import {SwaggerOptions} from "@fastify/swagger";

const swagger: SwaggerOptions = {
    swagger: {
        info: {
            title: 'My API',
            description: 'This is my API',
            version: '1.0.0'
        },
        externalDocs: {
            url: 'https://swagger.io',
            description: 'Find more info here'
        },
        host: 'localhost:8080',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            {
                name: 'users',
                description: 'User related end-points'
            },
            {
                name: 'auth',
                description: 'auth requests'
            }
        ],
        securityDefinitions: {
            apiKey: {
                type: 'apiKey',
                name: 'apiKey',
                in: 'header'
            }
        }
    }
}

export default swagger