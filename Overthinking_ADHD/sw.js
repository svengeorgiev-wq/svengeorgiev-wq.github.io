const CACHE = "adhd-overthinking-en-v2-20260727-localized";
const ASSETS = ["./", "./index.html", "../Overthinking_ADHS/styles.css?v=20260727-en", "./data.js?v=20260727-en", "./tracks.js?v=20260727-en", "./app.js?v=20260727-en", "./manifest.webmanifest", "../Overthinking_ADHS/assets/cover.webp", "../Overthinking_ADHS/assets/icon-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("adhd-overthinking-en-") && key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html"))));
});
