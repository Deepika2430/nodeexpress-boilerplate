export function formatPlaylist(rawPlaylist: any): { [key: string]: any } {
    const { playlistId, title, type, description, customParameters, playlist } = rawPlaylist;

    return {
        title,
        feedid: playlistId,
        description,
        kind: type,
        playlist,
        ...(customParameters || {}), // Spread customParameters if it exists
    };
}
