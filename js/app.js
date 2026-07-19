'use strict';

/**
 * Point d'entrée de l'application.
 */

document.addEventListener('DOMContentLoaded', init);

/**
 * Initialise l'application.
 */
async function init() {

    console.info('🙏 Application Prières');

    try {

        const prayers = await loadPrayerIndex();

        displayPrayerCards(prayers);

    } catch (error) {

        console.error(error);

        document.querySelector('#prayer-list').textContent =
            "Impossible de charger les prières.";

    }

}

/**
 * Charge l'index des prières.
 *
 * @returns {Promise<Array>}
 */
async function loadPrayerIndex() {

    const response = await fetch('data/index.json');

    if (!response.ok) {

        throw new Error('Impossible de charger index.json');

    }

    return await response.json();

}

/**
 * Affiche les cartes.
 *
 * @param {Array} prayers
 */
function displayPrayerCards(prayers) {

    const container = document.querySelector('#prayer-list');

    container.innerHTML = '';

    prayers
        .sort((a, b) => a.order - b.order)
        .forEach(prayer => {

            container.appendChild(createPrayerCard(prayer));

        });

}

/**
 * Crée une carte.
 *
 * @param {Object} prayer
 *
 * @returns {HTMLElement}
 */
function createPrayerCard(prayer) {

    const article = document.createElement('article');

    article.className = 'prayer-card';

    article.innerHTML = `

        <img
            src="${prayer.thumbnail}"
            alt="${prayer.title}"
            loading="lazy"
        >

        <h2>${prayer.title}</h2>

        <p>${prayer.category}</p>

    `;

    article.addEventListener('click', () => {

        console.log(prayer.file);

    });

    return article;

}