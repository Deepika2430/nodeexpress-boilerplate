import { fetchPlaylistPreview } from '../repos/repos.media';
import { PlaylistMetadata, DynamicPlaylistConfig } from '../types/types.playlist';
import { convertMediaFormat } from '../utils/utils.media';
import * as repos from '../repos/repos.playlist'
import { logger } from '../../logger/log';
export async function createPlaylist(playlistMetadata: PlaylistMetadata, dynamicPlaylistConfig: DynamicPlaylistConfig) {
    const mediaItems = await fetchPlaylistPreview(dynamicPlaylistConfig);
    const convertedMediaItems = (await mediaItems).map((mediaItem) =>
        convertMediaFormat(mediaItem)
    );
    const createdPlaylist = await repos.createPlaylist(playlistMetadata, convertedMediaItems);
    const playlist: { [key: string]: any } = {
        title: createdPlaylist?.title,
        feedid: createdPlaylist?.playlistId,
        playlist: createdPlaylist?.playlist,
        description: createdPlaylist?.description,
        kind: createdPlaylist?.kind
    }
    if (createdPlaylist?.customParameters) {
        Object.entries(createdPlaylist.customParameters).forEach(([key, value]) => {
            playlist[key] = value;
        });
    }
    logger.info(playlist);
    return playlist;
}