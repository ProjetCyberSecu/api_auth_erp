import Fastify, {FastifyInstance} from 'fastify'
import type {Server, IncomingMessage, ServerResponse} from 'http'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import swaggerConfig from './doc/swaggerConfig';
import {router} from "./router/router";
import {loginSchema} from "./dataValidation/schema";
import fastifyLdap from "./ldap/fastifyLdap";
import * as dotenv from 'dotenv'
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import fastifyCors from "@fastify/cors";

dotenv.config()

const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({
    logger: false
})

fastify.register(fastifyCors, {
    origin: process.env.CORS?.split(' ') || true
})

// DOCUMENTATION
fastify.register(fastifySwagger, swaggerConfig)
fastify.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    }
})

fastify.addSchema(loginSchema)

fastify.register(fastifyJwt,  {
    secret: process.env.JWT_SECRET_KEY || 'SUPER_SECRET_JWT'
})

dayjs.extend(advancedFormat)

fastify.register(fastifyLdap)


fastify.register(router, {prefix: '/api/auth'})

const port = parseInt((process.env.PORT? process.env.PORT : 8080 ) as string)


// RUNNING SERVER
const start = async () => {
    try {
        await fastify.listen({ host: process.env.HOST, port })
        fastify.swagger()
    } catch (e) {
        fastify.log.error(e)
        process.exit(1)
    }
}

start().then()
