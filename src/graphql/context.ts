import { getMedia } from "./resolvers/resolvers.media";
import { createPlaylist, updatePlaylist, getPlaylistById, showPlaylist } from "./resolvers/resolvers.playlist";
import { DynamicPlaylistConfig, PlaylistMetadata } from "./types/types.playlist";

export type Context = {
    getMedia: (mediaId: string) => Promise<any>;
    createPlaylist: (playlistMetadata: PlaylistMetadata, playlist: any) => Promise<any>;
    updatePlaylist: (playlistId: string, playlistMetadata: PlaylistMetadata, playlist: any) => Promise<any>;
    getPlaylistById: (playlistId: string) => Promise<any>;
    showPlaylist: (dynamicPlaylistConfig: DynamicPlaylistConfig) => Promise<any>;
};

export const createContext = (): Context => {
    return {
        getMedia: getMedia,
        createPlaylist,
        updatePlaylist,
        getPlaylistById,
        showPlaylist
    };
};
