import {FastifyReply} from "fastify";
import {FastifyRequestTypebox, loginBodySchema} from "../dataValidation/schema";
import dayjs from "dayjs";
import {refreshBodySchema} from "../dataValidation/schema";
import {JWT} from "@fastify/jwt";

type AccessTokenPayload = {
    iss: string
    azp: string
    exp: number
    iat: number
} | string

const generateTokens = (jwt: JWT, username: string) => {
    const JWTPayload = {
        "iss": "https://killerbee.com/",
        "azp": username,
        "exp": parseInt(dayjs().add(20, 'minute').format('X')),
        "iat": parseInt(dayjs().format('X')),
    }

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

    const {username, password} = req.body

    /**
     * Try to auth from ldap with username and password
     */
    const result = await req.server.ldap.tempAuth(username, password)

    // handle bad credentials
    if (!result) {
        res.status(401).send({
            error: 'Unauthorized',
            message: 'Invalid username or password'
        })
    }

    // generate  and send JWT for access and refresh token
    res.send(JSON.stringify(generateTokens(req.server.jwt, username)))
}


export const refresh = async (req: FastifyRequestTypebox<typeof refreshBodySchema>, res: FastifyReply) => {

    const {accessToken, refreshToken} = req.body

    try {
        req.server.jwt.decode(refreshToken)
        let accessTokenPayload = req.server.jwt.decode(accessToken) as AccessTokenPayload

        if (typeof accessTokenPayload === 'string') {
            accessTokenPayload = JSON.parse(accessTokenPayload)
        }

        if (typeof accessTokenPayload !== "string" && accessTokenPayload.azp) {
            res.send(JSON.stringify(generateTokens(req.server.jwt, accessTokenPayload.azp)))
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