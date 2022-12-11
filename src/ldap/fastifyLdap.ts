import {FastifyPluginAsync} from "fastify";
import {authenticate} from 'ldap-authentication'
import ldap from 'ldapjs'
import fp from 'fastify-plugin'
import * as process from "process";

export interface LDAPPlugin {
    tempAuth: (username: string, password: string) => Promise<boolean>
    checkAuthenticate: (username: string, password: string) => Promise<void>
}

const fastifyLdap: FastifyPluginAsync<Object> = async (fastify) => {

    const ldapServer = ldap.createServer()

    const authTest = async () => await authenticate({
        ldapOpts: {url: `ldap://${process.env.LDAP_HOST}:1389`},
        userDn: 'cn=user01,dc=killerbee,dc=com',
        userPassword: 'password1',
        userSearchBase: 'dc=killerbee,dc=com',
        usernameAttribute: 'uid',
        username: 'user01',
        attributes: ['dn', 'sn', 'cn', 'ou'],
    })

    const tempAuth = async (username: string, password: string): Promise<boolean> => {
        await new Promise(res => setTimeout(res, 500))
        return username === 'admin' && password === 'admin';
    }


    const plugin: LDAPPlugin = {
        checkAuthenticate: authTest,
        tempAuth
    }

    fastify.decorate('ldap', plugin)

}

export default fp(fastifyLdap, {name: 'ldap'})