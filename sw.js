const CACHE_NAME = "so-lua-pickleball-v22";
const BASE_PATH = "/pickleball";
const APP_SHELL = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/stats/`,
  `${BASE_PATH}/advances/`,
  `${BASE_PATH}/drinks/`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.ico`,
  `${BASE_PATH}/pwa-icon-192.png`,
  `${BASE_PATH}/pwa-icon-512.png`,
];

async function cacheShell() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.all(
    APP_SHELL.map(async (url) => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        if (response.ok) await cache.put(url, response);
      } catch {
        // A single unavailable route must not make the service worker install fail.
      }
    }),
  );
}

async function refresh(request) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return null;
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheShell().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (currentCache) => {
      const hasShell = Boolean(await currentCache.match(`${BASE_PATH}/`));
      if (!hasShell) return;
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    })
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;

  const isNavigation = event.request.mode === "navigate";
  event.respondWith(
    (async () => {
      const cached = await caches.match(event.request);

      // Standalone iOS launches must render immediately even when Safari is
      // waiting on a slow or unavailable network connection.
      if (cached) {
        event.waitUntil(refresh(event.request));
        return cached;
      }

      const fresh = await refresh(event.request);
      if (fresh) return fresh;

      if (isNavigation) {
        return (await caches.match(`${BASE_PATH}/`)) || (await caches.match(`${BASE_PATH}/index.html`)) || Response.error();
      }
      return Response.error();
    })(),
  );
});
