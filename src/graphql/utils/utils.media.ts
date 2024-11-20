import { Media } from "./../types/types.media";

export function formatMedia(mediaItem: Media | null) {
    if (!mediaItem)
        return null;

    const media: {
        title: string,
        description: string,
        kind: string,
        playlist: [{ [key: string]: any }]
    } = {
        title: mediaItem.title,
        description: mediaItem.title,
        kind: "Single Item",
        playlist: [
            {
                title: mediaItem.title,
                mediaid: mediaItem.mediaId,
                image: (mediaItem.images[0] as any)?.url,
                images: mediaItem.images,
                duration: mediaItem.duration,
                pubDate: mediaItem.publishDate,
                tags: mediaItem.tags,
                sources: mediaItem.assets,
                tracks: mediaItem.tracks,
            }
        ],
    };
    // Add all key-value pairs from customParameters directly to playlist[0]
    if (mediaItem.customParameters) {
        Object.entries(mediaItem.customParameters).forEach(([key, value]) => {
            media.playlist[0][key] = value;
        });
    }

    return media;
}
