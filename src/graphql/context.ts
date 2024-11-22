import { getMedia } from "./resolvers/resolvers.media";
import { createPlaylist, updatePlaylist, getPlaylistById } from "./resolvers/resolvers.playlist";
import { PlaylistMetadata } from "./types/types.playlist";

export type Context = {
    getMedia: (mediaId: string) => Promise<any>;
    createPlaylist: (playlistMetadata: PlaylistMetadata, playlist: any) => Promise<any>;
    updatePlaylist: (playlistId: string, playlistMetadata: PlaylistMetadata, playlist: any) => Promise<any>;
    getPlaylistById: (playlistId: string) => Promise<any>;
};

export const createContext = (): Context => {
    return {
        getMedia,
        createPlaylist,
        updatePlaylist,
        getPlaylistById
    };
};
