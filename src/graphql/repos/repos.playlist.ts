import { InputJsonValue } from "@prisma/client/runtime/library";
import { Playlist } from "@prisma/client";

import { PlaylistMetadata } from "../types/types.playlist";
import { logger } from "../../logger/log";
import { prismaConnection as prisma } from "../../connections";

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