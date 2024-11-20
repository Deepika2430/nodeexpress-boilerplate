import { PrismaClient } from '@prisma/client';

import { logger } from '../../logger/log';
import { config } from '../../connections';

import mediaRecords from "./media-records.json"

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: `postgresql://${config.db.user}:${config.db.pass}@${config.db.host}/${config.db.name}?connection_limit=${config.db.connectionLimit}`,
        },
    },
    log: ['info'],
})

async function insertRecords(dataArray: any) {
    try {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error('Data array is empty or not an array.');
        }

        const result = await prisma.media.createMany({
            data: dataArray.map((item: any) => ({
                ...item,
                publishDate: new Date(item.publishDate).toISOString(),
                createdAt: new Date(item.createdAt).toISOString(),
                updatedAt: new Date(item.updatedAt).toISOString(),
            })),
            skipDuplicates: false
        });

        logger.info(`${result.count} records inserted successfully into the media table.`);
        return result;
    } catch (error: any) {
        logger.error(`Error inserting records into the media table: ${error.message}`);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

const insertData = async (mediaRecords: any) => {
    try {
        await insertRecords(mediaRecords);
    } finally {
        process.exit(0);
    }
};

insertData(mediaRecords);