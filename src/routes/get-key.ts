import { FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const getKeyDetails: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/getKeyDetails', async function (request, reply) {
    const { key } = request.query as {key: string}
    if (!key) {
      return reply.code(400).send({ error: 'Missing key' })
    }

    try {
        const key_db = await prisma.key.findUnique({
            where: {
            value: key
            }
        })
    
        if (!key_db) {
            return reply.code(404).send({ error: 'Key not found' })
        }
    
        return reply.send({ key: key_db.value, expires: key_db.expires, key_id: key_db.id, identifier: key_db.identifier, env: key_db.env })
    }
    catch (e) {
        return reply.code(500).send({ error: 'Error getting key', e })
    }
  })
}

export default getKeyDetails;