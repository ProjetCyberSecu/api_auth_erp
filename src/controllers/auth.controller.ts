import {FastifyReply} from "fastify";
import {FastifyRequestTypebox, loginBodySchema} from "../dataValidation/schema";
import dayjs from "dayjs";
import {refreshBodySchema} from "../dataValidation/schema";
import {JWT} from "@fastify/jwt";
import ActiveDirectory from "activedirectory2";
import * as dotenv from 'dotenv'
dotenv.config()

type AccessTokenPayload = {
    iss: string
    azp: string,
    role: string
    exp: number
    iat: number
} | string

const LDAPConfig = {
    url: `ldap://${process.env.LDAP_HOST}`,
    baseDN: process.env.LDAP_DN ? process.env.LDAP_DN : 'dc=killerbee,dc=com',
    username: process.env.LDAP_USER ? `${process.env.LDAP_USER}@${process.env.LDAP_DOMAIN}` : 'none',
    password: process.env.LDAP_PASSWORD ? process.env.LDAP_PASSWORD : 'none'
}

const generateTokens = (jwt: JWT, username: string, groups: string) => {
    const JWTPayload = {
        "iss": "https://killerbee.com/",
        "azp": username,
        "exp": parseInt(dayjs().add(20, 'minute').format('X')),
        "role": groups,
        "iat": parseInt(dayjs().format('X')),
    } satisfies AccessTokenPayload
    const JWTRefreshPayload = {
        "iss": "https://killerbee.com/",
        "exp": parseInt(dayjs().add(1, 'day').format('X')),
        "iat": parseInt(dayjs().format('X')),
    }
    const accessToken = jwt.sign({...JWTPayload})
    const refreshToken = jwt.sign({...JWTRefreshPayload})
    return {accessToken, refreshToken}
}

export const login = async (req: FastifyRequestTypebox<typeof loginBodySchema>, res: FastifyReply) => {

    const ad = new ActiveDirectory(LDAPConfig)
    const {username, password} = req.body
    const tryAuth = await new Promise<boolean>(resolve => {
        ad.authenticate(`${username}@${process.env.LDAP_DOMAIN}`, password, (err, auth) => {
            if (err || !auth) {
                resolve(false)
                return
            }
            resolve(true)
        });
    })

    if (!tryAuth) {
        res.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid username or password'
        })
        return
    }
    res.send(JSON.stringify(generateTokens(req.server.jwt, username, 'admin')))
}


export const refresh = async (req: FastifyRequestTypebox<typeof refreshBodySchema>, res: FastifyReply) => {

    // Get tokens
    const {accessToken} = req.body
    const {authorization} = req.headers
    if (!authorization) return res.status(401).send({error: 'Unauthorized', message: 'Invalid tokens'})
    const refreshToken = authorization.replace('Bearer ', '')

    try {
        req.server.jwt.verify(refreshToken)
        try {
            req.server.jwt.verify(accessToken)
        } catch (e) {
            const jsonError = JSON.stringify(e)
            const error = JSON.parse(jsonError as string) as {code: string}
            if (error.code !== 'FAST_JWT_EXPIRED') {
                res.status(401).send({
                    error: 'Unauthorized',
                    message: 'Invalid access tokens'
                })
                return
            }
        }
        let accessTokenPayload = req.server.jwt.decode(accessToken) as AccessTokenPayload

        if (typeof accessTokenPayload === 'string') {
            accessTokenPayload = JSON.parse(accessTokenPayload)
        }

        if (typeof accessTokenPayload !== "string" && accessTokenPayload.azp) {
            res.send(JSON.stringify(generateTokens(req.server.jwt, accessTokenPayload.azp, accessTokenPayload.role)))
            return
        }

        res.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid tokens'
        })
    } catch (e) {
        res.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid tokens'
        })
    }

}
