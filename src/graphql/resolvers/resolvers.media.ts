import { fetchMediaItemById } from "../repos/repos.media";
import { convertMediaFormat } from "../utils/utils.media";

export async function getMedia(mediaId: string) {
    const media = convertMediaFormat(await fetchMediaItemById(mediaId));
    console.log(media)
    return media;
}