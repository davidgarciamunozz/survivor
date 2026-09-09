import { FRAME_EXT } from "./frames";

export type FrameSize = "hd" | "sm";

/** `index` is zero-based; the files on disk are 1-based and zero-padded. */
export function framePath(index: number, size: FrameSize = "hd") {
  return `/frames/${size}/${String(index + 1).padStart(3, "0")}.${FRAME_EXT}`;
}
