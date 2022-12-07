import {FastifyInstance, FastifyPluginAsync} from "fastify";
import {loginSchema} from "../dataValidation/schema";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";
import {login} from "../controllers/auth.controller";

export const router: FastifyPluginAsync = async (fastify: FastifyInstance) => {

    fastify.withTypeProvider<TypeBoxTypeProvider>().post('/login', loginSchema, login)

}