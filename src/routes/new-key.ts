import { FastifyPluginAsync } from "fastify"
import crypto from "crypto"

import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const newKey: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/newKey', async function (request, reply) {
    const { identifier, env } = request.body as { identifier: string, env: string }
    if (!identifier || !env) {
      return reply.code(400).send({ error: 'Missing user identifier or enviorment' })
    }
    // generate a cryptographicaly random and secure 16 alphanumeric characters long string
    const key = crypto.randomBytes(8).toString('hex')
    // Generate a random 8 number id
    const id = Math.floor(Math.random() * 100000000)

    // cryptographicaly encrypt the key using js crypto module
    try {
      const key_db = await prisma.key.create({
        data: {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4 * 24), // 2 years
          value: key,
          identifier,
          env,
          id
        }
      })

      return reply.send({ key: key_db.value, expires: key_db.expires, key_id: key_db.id })
    }
    catch (e) {
      return reply.code(500).send({ error: 'Error creating key', e })
    }
  })
}

export default newKey;
