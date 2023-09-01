"use client";

// External loader because Electron does not support the default loader in production mode.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default function myImageLoader({ src, width, quality }) {
  return `app://./${src}?w=${width}&q=${quality || 75}`;
}
