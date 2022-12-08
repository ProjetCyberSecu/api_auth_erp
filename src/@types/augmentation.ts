import {LDAPPlugin} from "../ldap/fastifyLdap";

declare module 'fastify' {
    export interface FastifyInstance {
        ldap: LDAPPlugin
    }
}