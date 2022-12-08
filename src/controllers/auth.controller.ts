import {FastifyReply} from "fastify";
import {FastifyRequestTypebox, loginBodySchema} from "../dataValidation/schema";

export const login = async (req: FastifyRequestTypebox<typeof loginBodySchema>, res: FastifyReply) => {
    const payload = await new Promise(resolve => {
        resolve({
            firstname: 'Basile',
            lastname: 'LECOUTURIER',
            role: 'admin'
        })
    })

    const result = await req.server.ldap.checkAuthenticate()

    console.log(result)

    const accessToken = req.server.jwt.sign({payload})
    const refreshToken = req.server.jwt.sign({payload: {validityDate: Date.now()}})

    res.send({accessToken, refreshToken})
}