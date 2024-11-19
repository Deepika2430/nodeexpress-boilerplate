// context.ts
import { Media } from "@prisma/client";

import { fetchMediaItemById } from "./repos/repos.media";
import { createPlaylist } from "./repos/repos.playlist";
import { PlaylistMetadata } from "./types/types.media";

export type Context = {
    fetchMediaItemById: (mediaId: string) => Promise<Media| null>;
    createPlaylist: (playlistMetadata: PlaylistMetadata, playlist: any) => Promise<any>;
};

export const createContext = (): Context => {
    return {
        fetchMediaItemById,
        createPlaylist,
        // Initialize your context here
    };
};
