import {RouteShorthandOptions} from "fastify";

export const loginSchema: RouteShorthandOptions = {
    schema: {
        body: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
                username: {type: 'string'},
                password: {type: 'number'}
            }
        }
    }
}