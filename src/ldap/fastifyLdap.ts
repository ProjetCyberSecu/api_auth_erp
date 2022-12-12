import {FastifyPluginAsync} from "fastify";
import fp from 'fastify-plugin'

export interface LDAPPlugin {
    tempAuth: (username: string, password: string) => Promise<boolean>
}

const fastifyLdap: FastifyPluginAsync<Object> = async (fastify) => {

    const tempAuth = async (username: string, password: string): Promise<boolean> => {
        await new Promise(res => setTimeout(res, 500))
        return username === 'admin' && password === 'admin';
    }


    const plugin: LDAPPlugin = {
        tempAuth
    }

    fastify.decorate('ldap', plugin)

}

export default fp(fastifyLdap, {name: 'ldap'})