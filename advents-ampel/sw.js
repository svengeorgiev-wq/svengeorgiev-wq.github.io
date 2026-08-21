"use strict";

const SHELL_CACHE = "advents-ampel-shell-v6";
const AUDIO_CACHE = "advents-ampel-audio-v1";
const APP_SHELL = [
  "./",
  "index.html",
  "styles.css?v=4",
  "data.js?v=2",
  "app.js?v=4",
  "manifest.webmanifest?v=2",
  "assets/book-cover-2026.png",
  "icons/favicon-cover-2026.png",
  "icons/apple-touch-cover-2026.png",
  "icons/icon-192-cover-2026.png",
  "icons/icon-512-cover-2026.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("advents-ampel-") && ![SHELL_CACHE, AUDIO_CACHE].includes(key)).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.endsWith(".mp3")) {
    event.respondWith(respondWithAudio(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put("index.html", copy));
          return response;
        })
        .catch(() => caches.match("index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(SHELL_CACHE).then((cache) => cache.put(request, response.clone()));
      return response;
    }))
  );
});

async function respondWithAudio(request) {
  const cache = await caches.open(AUDIO_CACHE);
  let response = await cache.match(request.url);

  if (!response) {
    const fullRequest = new Request(request.url, { method: "GET", mode: "same-origin", credentials: "same-origin" });
    response = await fetch(fullRequest);
    if (!response.ok) return response;
    await cache.put(request.url, response.clone());
  }

  const range = request.headers.get("range");
  if (!range) return response;

  const buffer = await response.arrayBuffer();
  const match = /bytes=(\d+)-(\d*)/.exec(range);
  if (!match) return new Response(buffer, { status: 200, headers: response.headers });

  const start = Number(match[1]);
  const requestedEnd = match[2] ? Number(match[2]) : buffer.byteLength - 1;
  const end = Math.min(requestedEnd, buffer.byteLength - 1);
  const chunk = buffer.slice(start, end + 1);
  const headers = new Headers(response.headers);
  headers.set("Content-Range", `bytes ${start}-${end}/${buffer.byteLength}`);
  headers.set("Content-Length", String(chunk.byteLength));
  headers.set("Accept-Ranges", "bytes");
  headers.set("Content-Type", "audio/mpeg");
  return new Response(chunk, { status: 206, statusText: "Partial Content", headers });
}
