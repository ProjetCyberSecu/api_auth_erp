import Fastify, {FastifyInstance} from 'fastify'
import type {Server, IncomingMessage, ServerResponse} from 'http'
import {router} from "./router/router";
import swaggerConfig from './doc/swaggerConfig';

const fastify: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({
    logger: true
})

// ROUTING
fastify.register(router)

// DOCUMENTATION
fastify.register(require('@fastify/swagger'), swaggerConfig)
fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
        docExpansion: 'full',
        deepLinking: false
    }
})


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

start()