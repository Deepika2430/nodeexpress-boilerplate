import { Media } from "@prisma/client";

import { DynamicPlaylistConfig } from "../types/types.playlist";
import { prismaConnection as prisma } from "../../connections";
export async function fetchMediaItems(): Promise<Media[]> {
    try {
        return await prisma.media.findMany();
    } catch (err) {
        console.error("Error fetching media items:", err);
        return [];
    }
}

export async function fetchMediaItemById(mediaId: string): Promise<Media | null> {
    try {
        const media: Media | null = await prisma.media.findUnique({ where: { mediaId } });
        return media;
    } catch (err) {
        console.error("Error fetching media items:", err);
        return null;
    }
}

export async function fetchPlaylistPreview(playlistConfig: DynamicPlaylistConfig) {
    const {
        tags,
        customParameters,
        pageNumber = 1,
        itemsPerPage = 500,
        sort,
    } = playlistConfig;

    try {
        const conditions: any[] = [];

        // Include tags
        if (tags?.include) {
            conditions.push({
                tags: {
                    contains: tags.include,
                },
            });
        }

        // Exclude tags
        if (tags?.exclude) {
            conditions.push({
                NOT: {
                    tags: {
                        contains: tags.exclude,
                    },
                },
            });
        }

        // Handle customParameters for JSON fields
        if (customParameters?.include) {
            Object.entries(customParameters.include).forEach(([key, value]) => {
                conditions.push({
                    customParameters: {
                        path: [key],
                        equals: value,
                    },
                });
            });
        }

        // Exclude customParameters
        if (customParameters?.exclude) {
            Object.entries(customParameters.exclude).forEach(([key, value]) => {
                conditions.push({
                    NOT: {
                        customParameters: {
                            path: [key],
                            equals: value,
                        },
                    },
                });
            });
        }

        const playlistPreview = await prisma.media.findMany({
            where: conditions.length > 0 ? { AND: conditions } : undefined,
            orderBy: sort?.field
                ? {
                    [sort.field]: sort.order,
                }
                : undefined,
            skip: (pageNumber - 1) * itemsPerPage,
            take: itemsPerPage,
        });

        return playlistPreview;
    } catch (err) {
        console.error("Error fetching playlist preview:", err);
        return [];
    }
}
