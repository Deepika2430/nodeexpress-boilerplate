import { v4 as uuidv4 } from "uuid";

import { fetchPlaylistPreview } from "../repos/repos.media";
import { PlaylistMetadata, DynamicPlaylistConfig } from "../types/types.playlist";
import { formatMedia } from "../utils/utils.media";
import * as repos from "../repos/repos.playlist";
import { logger } from "../../logger/log";
import { formatPlaylist } from "../utils/utils.playlist";

export async function createPlaylist(
    playlistMetadata: PlaylistMetadata,
    dynamicPlaylistConfig: DynamicPlaylistConfig
) {
    const mediaItems = await fetchPlaylistPreview(dynamicPlaylistConfig);
    const convertedMediaItems = await Promise.all(
        mediaItems.map((mediaItem) => formatMedia(mediaItem))
    );

    const playlistId = uuidv4().substr(0, 6);
    const playlist = formatPlaylist({
        playlistId,
        playlist: convertedMediaItems,
        ...playlistMetadata,
    });

    return formatPlaylist(await repos.createPlaylist(playlist));
}

export async function getPlaylistById(playlistId: string) {
    return formatPlaylist(await repos.getPlaylistById(playlistId));
}