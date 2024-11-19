import { PrismaClient } from '@prisma/client';

import { logger } from '../../logger/log';
import { Media } from '../types/types.media';

import mediaRecords from "./media_record.json"


const prisma = new PrismaClient();

async function insertRecords(dataArray: Media[]) {
    try {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            throw new Error('Data array is empty or not an array.');
        }

        const result= await prisma.media.createMany({
            data: dataArray.map((item: Media) => ({
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

insertRecords(mediaRecords)
    .then(result => {
        logger.info(result);
        logger.info("Data insertion completed successfully.");
    })
    .catch(error => {
        logger.error("Data insertion failed:", error);
    });