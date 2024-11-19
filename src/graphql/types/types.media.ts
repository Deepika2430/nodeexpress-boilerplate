import { JsonValue } from "@prisma/client/runtime/library"
import { DateDimensionField } from "aws-sdk/clients/quicksight";

export type Media = {
    mediaId: string,
    title: string,
    status: string,
    mediaType: string,
    contentType: string,
    duration: number,
    publishDate: Date,
    tags: string,
    customParameters: JsonValue,
    image?: string,
    images: JsonValue[],
    tracks: JsonValue[],
    assets: JsonValue[],
    createdAt: Date,
    updatedAt: Date
}

export type PlaylistMetadata = {
    title: string;
    description: string;
    type: string,
    customParameters?: string,
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

export type Playlist = {
    playlistId: string;
    title: string;
    type: string;
    playlist: Media[];
    description?: string;
    customParameters: JsonValue[];
    kind: string;
    createdAt: Date;
    updatedAt: DateDimensionField;
};