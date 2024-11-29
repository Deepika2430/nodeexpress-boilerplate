import { v4 as uuidv4 } from "uuid";

import { fetchPlaylistPreview } from "../repos/repos.media";
import { PlaylistMetadata, DynamicPlaylistConfig } from "../types/types.playlist";
import { Media } from "../types/types.media";
import { formatMedia } from "../utils/utils.media";
import * as repos from "../repos/repos.playlist";
import { formatPlaylist } from "../utils/utils.playlist";

export async function showPlaylist(mediaItems: Media[]) {

    // const mediaItems = await fetchMediaItems();
    // const filteredMediaItems = await fetchPlaylistPreview(dynamicPlaylistConfig);
    // const convertedMediaItems = await Promise.all(
    //     filteredMediaItems.map((mediaItem) => formatMedia(mediaItem))
    // );
    console.log(mediaItems);
    const playlistId = uuidv4().substr(0, 6);
    const playlist = formatPlaylist({
        playlistId,
        playlist: mediaItems,
    });
    return playlist;
}

export async function createPlaylist(
    playlistMetadata: PlaylistMetadata,
    dynamicPlaylistConfig: DynamicPlaylistConfig
) {
    // const mediaItems = await fetchMediaItems();
    // const filteredMediaItems: Media[] = await fetchPlaylistPreview(mediaItems, dynamicPlaylistConfig);
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

    return formatPlaylist(await repos.createPlaylist(playlist, dynamicPlaylistConfig));
}

export async function updatePlaylist(
    playlistId: string,
    playlistMetadata?: PlaylistMetadata | undefined,
) {
    return await repos.updatePlaylist(playlistId, (playlistMetadata as unknown as JSON));
}


export async function getPlaylistById(playlistId: string) {
    return formatPlaylist(await repos.getPlaylistById(playlistId));
}


// export async function fetchPlaylistPreview(
//     mediaItems: Media[],
//     playlistConfig: DynamicPlaylistConfig
// ): Promise<Media[]> {
//     const {
//         tags,
//         customParameters,
//         pageNumber = 1,
//         itemsPerPage = 500,
//         sort,
//     } = playlistConfig;

//     try {

//         // Filter items by including tags
//         if (tags?.include) {
//             const includeTags = Array.isArray(tags.include) ? tags.include : [tags.include];
//             mediaItems = mediaItems.filter((item) =>
//                 includeTags.some((tag) => item.tags.includes(tag))
//             );
//         }

//         // Filter items by excluding tags
//         if (tags?.exclude) {
//             const excludeTags = Array.isArray(tags.exclude) ? tags.exclude : [tags.exclude];
//             mediaItems = mediaItems.filter(
//                 (item) => !excludeTags.some((tag) => item.tags.includes(tag))
//             );
//         }

//         // Filter items by including custom parameters
//         if (customParameters?.include) {
//             mediaItems = mediaItems.filter((item) => {
//                 if (item.customParameters && typeof item.customParameters === "object") {
//                     return Object.entries(customParameters.include || {}).every(
//                         ([key, value]) => (item.customParameters as Record<string, unknown>)[key] === value
//                     );
//                 }
//                 return false;
//             });
//         }

//         // Filter items by excluding custom parameters
//         if (customParameters?.exclude) {
//             mediaItems = mediaItems.filter((item) => {
//                 if (item.customParameters && typeof item.customParameters === "object") {
//                     return Object.entries(customParameters.exclude || {}).every(
//                         ([key, value]) => (item.customParameters as Record<string, unknown>)[key] === value
//                     );
//                 }
//                 return true;
//             });
//         }

//         // Sort items
//         if (sort?.field) {
//             mediaItems.sort((a, b) => {
//                 const aValue = a[sort.field as keyof Media];
//                 const bValue = b[sort.field as keyof Media];

//                 if (aValue == null && bValue == null) return 0;
//                 if (aValue == null) return sort.order === "asc" ? -1 : 1;
//                 if (bValue == null) return sort.order === "asc" ? 1 : -1;

//                 if (sort.order === "asc") {
//                     return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
//                 } else {
//                     return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
//                 }
//             });
//         }

//         const startIndex = (pageNumber - 1) * itemsPerPage;
//         const endIndex = startIndex + itemsPerPage;
//         return mediaItems.slice(startIndex, endIndex);
//     } catch (err) {
//         console.error("Error fetching playlist preview:", err);
//         return [];
//     }
// }
