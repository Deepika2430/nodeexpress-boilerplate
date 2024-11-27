import { logger } from "../../logger/log";
import { prismaConnection as prisma } from "../../connections";

export async function createPlaylist(inputPlaylist: any, playlistConfig: any): Promise<any> {
    try {
        const { title, feedid, kind, description, playlist, ...customParameters } = inputPlaylist;

        const playlistData = await prisma.playlist.create({
            data: {
                playlistId: feedid,
                title,
                type: kind,
                description,
                playlist,
                customParameters,
                playlistConfig
            },
        });

        return playlistData;
    } catch (error: any) {
        logger.error(`Error creating playlist: ${error.message}`);
        throw new Error('Failed to create playlist. Please try again later.');
    }
}

export async function updatePlaylist(playlistId: string, updatedData: any): Promise<any> {
    try {
       
        const { title, kind, description, playlist, ...customParameters } = updatedData;
        const updatedPlaylist = await prisma.playlist.update({
            where: { playlistId },
            data: {
                title,
                type: kind,
                description,
                playlist,
                customParameters,
            },
        });

        return updatedPlaylist;
    } catch (error: any) {
        logger.error(`Error updating playlist with ID ${playlistId}: ${error.message}`);
    }
}

export async function getPlaylistById(playlistId: string) {
    try {
        logger.info(playlistId);
        const playlist = await prisma.playlist.findUnique({
            where: {
                playlistId
            }
        });
        return playlist;
    } catch (error) {
        logger.error(error);
        return null;
    }
}