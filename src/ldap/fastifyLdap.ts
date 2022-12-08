import {FastifyPluginAsync} from "fastify";
import { authenticate } from 'ldap-authentication'
import fp from 'fastify-plugin'
import * as process from "process";

export interface LDAPPlugin {checkAuthenticate: () => Promise<void>}

const fastifyLdap: FastifyPluginAsync<Object> = async (fastify) => {

    const authTest = async () => await authenticate({
        ldapOpts: { url: `ldap://${process.env.HOST}:1389` },
        userDn: 'uid=user01,dc=killerbee,dc=fr',
        userPassword: 'password1',
        userSearchBase: 'dc=killerbee,dc=fr',
        usernameAttribute: 'uid',
        username: 'user01',
        attributes: ['dn', 'sn', 'cn'],
    })

    const plugin: LDAPPlugin = {
        checkAuthenticate: authTest
    }

    fastify.decorate('ldap', plugin)

}

export default fp(fastifyLdap, {name: 'ldap'})