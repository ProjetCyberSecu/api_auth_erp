import Fastify, {FastifyInstance} from 'fastify'
import type {Server, IncomingMessage, ServerResponse} from 'http'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import swaggerConfig from './doc/swaggerConfig';
import {router} from "./router/router";
import {loginSchema} from "./dataValidation/schema";

const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({
    logger: true
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
    secret: 'SUPER_SECRET_JWT'
})


fastify.register(router, {prefix: '/api/auth'})


// RUNNING SERVER
const start = async () => {
    try {
        await fastify.listen({ port: 8080 })
        fastify.swagger()
    } catch (e) {
        fastify.log.error(e)
        process.exit(1)
    }
}

start().then()