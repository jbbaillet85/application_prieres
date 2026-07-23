'use strict';

import { loadJson } from './api.js';
import { createPrayerCard } from './ui.js';
import { openDialog, initDialog } from './dialog.js';

document.addEventListener('DOMContentLoaded', init);

/**
 * Initialise l'application.
 */
async function init() {
    registerServiceWorker();
    initDialog();

    const prayers = await loadJson('data/index.json');

    displayPrayerList(prayers);
}

/**
 * Enregistre le service worker lorsque le navigateur le permet.
 */
async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.info(
            'Les service workers ne sont pas pris en charge par ce navigateur.'
        );

        return;
    }

    try {
        const registration = await navigator.serviceWorker.register(
            './service-worker.js'
        );

        console.info(
            'Service worker enregistré avec succès.',
            registration.scope
        );
    } catch (error) {
        console.error(
            "Échec de l'enregistrement du service worker.",
            error
        );
    }
}

/**
 * Affiche la liste des prières.
 *
 * @param {Array} prayers
 */
function displayPrayerList(prayers) {
    const container = document.querySelector('#prayer-list');

    container.innerHTML = '';

    prayers
        .sort((a, b) => a.order - b.order)
        .forEach(prayer => {
            const card = createPrayerCard(prayer);

            card.addEventListener('click', async () => {
                const prayerData = await loadJson(prayer.file);

                openDialog(prayerData);
            });

            container.appendChild(card);
        });
}