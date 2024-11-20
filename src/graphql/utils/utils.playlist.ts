export function formatPlaylist(rawPlaylist: any): { [key: string]: any } {
    const { playlistId, title, type, description, customParameters, playlist } = rawPlaylist;
    const formattedPlaylist: { [key: string]: any } = {
        title,
        feedid: playlistId,
        description,
        kind: type,
        playlist,
    };

    if (customParameters) {
        Object.entries(customParameters).forEach(([key, value]) => {
            formattedPlaylist[key] = value;
        });
    }

    return formattedPlaylist;
}