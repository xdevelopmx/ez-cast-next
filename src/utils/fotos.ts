import { type MediaObj } from "~/components";

export const convertirMediaObjAString = (media: MediaObj[]): string => {
    if (media.length < 1) {
        return "/assets/img/no-user-image.png"
    }
    if (!media[0]) {
        return "/assets/img/no-user-image.png"
    }
    return media[0].media.url;
}