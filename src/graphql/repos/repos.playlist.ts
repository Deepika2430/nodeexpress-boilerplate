import { InputJsonValue } from "@prisma/client/runtime/library";
import { Playlist } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

// import { prismaConnection as prisma } from "../../connections";
import { PlaylistMetadata } from "../types/types.media";
import { logger } from "../../logger/log";

const prisma = new PrismaClient();
export async function createPlaylist(playlistMetadata: PlaylistMetadata, playlist: any): Promise<Playlist | null> {
    try {
        const playlistData = await prisma.playlist.create({
            data: {
                title: playlistMetadata.title,
                type: playlistMetadata.type,
                description: playlistMetadata.description,
                customParameters: (playlistMetadata.customParameters) as InputJsonValue,
                kind: playlistMetadata.type,
                playlist
            },
        });
        return playlistData;
    } catch (error) {
        logger.error(error);
        return null;
    }
}