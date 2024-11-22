import { PrismaClient } from '@prisma/client'
import IORedis from 'ioredis';

import config from '../config';

const redisConnection = new IORedis({
    port: config.redis.port,
    host: config.redis.host,
    maxRetriesPerRequest: null
});


const prismaConnection = new PrismaClient({
    datasources: {
        db: {
            url: `postgresql://${config.db.user}:${config.db.pass}@${config.db.host}/${config.db.name}?connection_limit=${config.db.connectionLimit}`,
        },
    },
  log: ['info'],
})

export { redisConnection, prismaConnection, config };