import { JsonValue } from "@prisma/client/runtime/library";

import {Media} from './types.media';

export type Playlist = {
    playlistId: string;
    title: string;
    type: string;
    playlist: Media[];
    description?: string;
    customParameters: JsonValue[];
    kind: string;
    createdAt: Date;
    updatedAt: Date;
};

export type PlaylistMetadata = {
    title: string;
    description: string;
    type: string,
    customParameters?: JsonValue,
}

export type DynamicPlaylistConfig = {
    tags?: {
        include?: string;
        exclude?: string;
    };
    customParameters?: {
        include?: { [key: string]: any };
        exclude?: { [key: string]: any };
    };
    pageNumber?: number;
    itemsPerPage?: number;
    sort?: {
        field?: string;
        order: "asc" | "desc";
    };
};
