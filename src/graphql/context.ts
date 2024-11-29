import { getMedia } from "./resolvers/resolvers.media";
import { createPlaylist, updatePlaylist, getPlaylistById, showPlaylist } from "./resolvers/resolvers.playlist";
import { Media } from "./types/types.media";
import { PlaylistMetadata } from "./types/types.playlist";

export type Context = {
    getMedia: (mediaId: string) => Promise<any>;
    createPlaylist: (playlistMetadata: PlaylistMetadata, playlist: any) => Promise<any>;
    updatePlaylist: (playlistId: string, playlistMetadata: PlaylistMetadata, playlist: any) => Promise<any>;
    getPlaylistById: (playlistId: string) => Promise<any>;
    showPlaylist: (mediaItems: Media[]) => Promise<any>;
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
