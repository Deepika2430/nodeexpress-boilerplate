import { logger } from "../../logger/log";
import { prismaConnection as prisma } from "../../connections";

export async function createPlaylist(inputPlaylist: any): Promise<any> {
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
            },
        });

        return playlistData;
    } catch (error: any) {
        logger.error(`Error creating playlist: ${error.message}`);
        throw new Error('Failed to create playlist. Please try again later.');
    }
}
export async function getPlaylistById(playlistId: string) {
    try {
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