import { getMedia } from "./resolvers/resolvers.media";
import { createPlaylist } from "./resolvers/resolvers.playlist";
import { PlaylistMetadata } from "./types/types.playlist";

export type Context = {
    getMedia: (mediaId: string) => Promise<any>;
    createPlaylist: (playlistMetadata: PlaylistMetadata, playlist: any) => Promise<any>;
};

export const createContext = (): Context => {
    return {
        getMedia,
        createPlaylist,
    };
};
