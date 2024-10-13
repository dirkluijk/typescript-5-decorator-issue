import type { RandomReader } from "@oslojs/crypto/random";
import { getRandomValues } from "node:crypto";

export const random: RandomReader = {
  read(bytes: Uint8Array): void {
    getRandomValues(bytes);
  },
};
