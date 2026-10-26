"use strict";

const CACHE = "stuhl-yoga-v7";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest?v=2",
  "./assets/cover.jpg?v=2",
  "./icons/favicon-64.png?v=2",
  "./icons/icon-192.png?v=2",
  "./icons/apple-touch-icon.png?v=2"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Seite immer frisch aus dem Netz (neue Videos sofort sichtbar), offline aus dem Cache.
// Videos laufen direkt übers Netz, damit das Vorspulen funktioniert.
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (url.pathname.endsWith(".mp4")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) caches.open(CACHE).then((cache) => cache.put("./index.html", response.clone()));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
