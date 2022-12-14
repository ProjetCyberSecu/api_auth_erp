import {FastifyInstance, FastifyPluginAsync} from "fastify";
import {loginSchema, refreshSchema} from "../dataValidation/schema";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";
import {login, refresh} from "../controllers/auth.controller";

export const router: FastifyPluginAsync = async (fastify: FastifyInstance) => {

    fastify.withTypeProvider<TypeBoxTypeProvider>().post('/login', loginSchema, login)
    fastify.withTypeProvider<TypeBoxTypeProvider>().post('/refresh', refreshSchema, refresh)

}