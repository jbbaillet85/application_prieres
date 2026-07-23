'use strict';

const CACHE_VERSION = 'mes-prieres-v1';

const APP_BASE_PATH = '/application_prieres';

const APP_SHELL_FILES = [
    `${APP_BASE_PATH}/`,
    `${APP_BASE_PATH}/index.html`,
    `${APP_BASE_PATH}/manifest.json`,

    `${APP_BASE_PATH}/css/style.css`,

    `${APP_BASE_PATH}/js/app.js`,
    `${APP_BASE_PATH}/js/api.js`,
    `${APP_BASE_PATH}/js/dialog.js`,
    `${APP_BASE_PATH}/js/ui.js`,

    `${APP_BASE_PATH}/data/index.json`,
    `${APP_BASE_PATH}/data/prayers/notre-pere.json`,
    `${APP_BASE_PATH}/data/prayers/je-vous-salue-marie.json`,

    `${APP_BASE_PATH}/assets/images/notre-pere.webp`,
    `${APP_BASE_PATH}/assets/images/je-vous-salue-marie.webp`,
    `${APP_BASE_PATH}/assets/images/thumbnails/notre-pere.webp`,
    `${APP_BASE_PATH}/assets/images/thumbnails/je-vous-salue-marie.webp`,

    `${APP_BASE_PATH}/assets/icons/icon-192.png`,
    `${APP_BASE_PATH}/assets/icons/icon-512.png`,
    `${APP_BASE_PATH}/assets/icons/icon-512-maskable.png`
];

/**
 * Installe le service worker et met en cache les fichiers indispensables.
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(CACHE_VERSION)
            .then(cache => cache.addAll(APP_SHELL_FILES))
            .then(() => self.skipWaiting())
    );
});

/**
 * Supprime les anciennes versions du cache.
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames =>
                Promise.all(
                    cacheNames
                        .filter(cacheName => cacheName !== CACHE_VERSION)
                        .map(cacheName => caches.delete(cacheName))
                )
            )
            .then(() => self.clients.claim())
    );
});

/**
 * Sert les ressources depuis le cache.
 *
 * Lorsqu'une ressource n'est pas encore en cache, elle est récupérée
 * sur le réseau puis ajoutée au cache pour une prochaine utilisation.
 */
self.addEventListener('fetch', event => {
    const request = event.request;

    if (request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(request.url);

    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(handleNavigationRequest(request));
        return;
    }

    event.respondWith(handleResourceRequest(request));
});

/**
 * Gère les requêtes de navigation.
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleNavigationRequest(request) {
    try {
        const networkResponse = await fetch(request);

        const cache = await caches.open(CACHE_VERSION);
        cache.put(request, networkResponse.clone());

        return networkResponse;
    } catch {
        const cachedPage = await caches.match(
            `${APP_BASE_PATH}/index.html`
        );

        if (cachedPage) {
            return cachedPage;
        }

        return Response.error();
    }
}

/**
 * Utilise une stratégie cache-first pour les ressources statiques.
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleResourceRequest(request) {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
        }

        const cache = await caches.open(CACHE_VERSION);
        cache.put(request, networkResponse.clone());

        return networkResponse;
    } catch {
        return Response.error();
    }
}