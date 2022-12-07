import {FastifyReply} from "fastify";
import {FastifyRequestTypebox, loginBodySchema} from "../dataValidation/schema";

export const login = async (req: FastifyRequestTypebox<typeof loginBodySchema>, res: FastifyReply) => {
    const payload = await new Promise(resolve => setTimeout(() => {
        resolve({
            firstname: 'Basile',
            lastname: 'LECOUTURIER',
            role: 'admin',
        })
    }, 3000))

    const  {  } = req.body

    const accessToken = req.server.jwt.sign({payload})
    const refreshToken = req.server.jwt.sign({payload: {validityDate: Date.now()}})

    res.send({accessToken, refreshToken})
}