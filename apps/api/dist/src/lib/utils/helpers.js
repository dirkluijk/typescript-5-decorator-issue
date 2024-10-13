import { getRandomValues } from "node:crypto";
export const random = {
    read(bytes) {
        getRandomValues(bytes);
    },
};
