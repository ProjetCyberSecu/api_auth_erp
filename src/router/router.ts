import {FastifyInstance} from "fastify";
import {loginSchema} from "../dataValidation/schema";

export const router = async (fastify: FastifyInstance, option: Object) => {

    fastify.post('/login', loginSchema , async (request, reply) => {
        return {your: 'logged'}
    })
    fastify.get('/', async (request, reply) => {
        return {'hello': 'world'}
    })

}