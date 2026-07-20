'use strict';

import { loadJson } from './api.js';

import { createPrayerCard } from './ui.js';

import { openDialog, initDialog } from './dialog.js';

document.addEventListener('DOMContentLoaded', init);

/**
 * Initialise l'application.
 */
async function init() {

    initDialog();

    const prayers = await loadJson('data/index.json');

    displayPrayerList(prayers);

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