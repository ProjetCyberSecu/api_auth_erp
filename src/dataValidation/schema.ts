import {
    FastifyRequest, FastifySchema,
    RawRequestDefaultExpression,
    RawServerDefault,
    RouteGenericInterface,
} from "fastify";
import {Type} from "@sinclair/typebox";
import {TypeBoxTypeProvider} from "@fastify/type-provider-typebox";

export const loginBodySchema = {
    body: Type.Object({
        username: Type.String(),
        password: Type.String()
    }),
}

export const loginSchema = {
    $id: 'login_auth',
    schema: {
        required: ['username'],
        tags: ['auth'],
        body: loginBodySchema.body,
        response: {
            200: {
                description: 'Successfully connected',
                type: 'object',
                properties: {
                    accessToken: Type.String(),
                    refreshToken: Type.String()
                }
            }
        }
    }
}

export type FastifyRequestTypebox<TSchema extends FastifySchema> = FastifyRequest<
    RouteGenericInterface,
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    TSchema,
    TypeBoxTypeProvider
>;