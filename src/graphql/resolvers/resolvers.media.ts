import { fetchMediaItemById } from "../repos/repos.media";
import { formatMedia } from "../utils/utils.media";

export async function getMedia(mediaId: string) {
    return formatMedia(await fetchMediaItemById(mediaId));
}