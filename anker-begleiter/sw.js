"use strict";

const CACHE = "anker-begleiter-v1.0.4";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=5",
  "./app.js?v=5",
  "./anker-inhalte.json",
  "./audio-manifest.json",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
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

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.includes("/audio/") && request.method === "HEAD") {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(new Request(request.url, { method: "GET" }));
        if (cached) {
          const headers = new Headers();
          ["Content-Type", "Content-Length", "Accept-Ranges"].forEach((name) => {
            const value = cached.headers.get(name);
            if (value) headers.set(name, value);
          });
          return new Response(null, { status: 200, headers });
        }
        return fetch(request);
      })
    );
    return;
  }

  if (request.method === "HEAD") return;

  if (url.pathname.includes("/audio/") && request.method === "GET") {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok && response.status === 200) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response.ok) caches.open(CACHE).then((cache) => cache.put(request, response.clone()));
      return response;
    }))
  );
});
