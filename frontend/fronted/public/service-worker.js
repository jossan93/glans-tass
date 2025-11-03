const CACHE_NAME = "glans-tass-v6";
const urlsToCache = ["/", "/index.html",
   "/manifest.json", 
   "/offline.html",
   "/icons/paw-512px.png",
  ];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        )
      )
  );
  self.clients.claim();
});

// Fetch event – network first, fallback to cache, offline.html för navigering
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Navigeringsförfrågningar (HTML-sidor)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // Andra GET-filer (JS, CSS, bilder etc.)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Klona och spara i cache
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
