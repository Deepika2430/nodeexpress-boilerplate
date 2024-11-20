import { JsonValue } from "@prisma/client/runtime/library"

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
