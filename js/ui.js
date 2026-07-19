'use strict';

/**
 * Crée une carte de prière.
 *
 * @param {Object} prayer
 * @returns {HTMLElement}
 */
export function createPrayerCard(prayer) {

    const article = document.createElement('article');

    article.className = 'prayer-card';

    article.innerHTML = `
        <img
            src="${prayer.thumbnail}"
            alt="${prayer.title}"
            loading="lazy">

        <h2>${prayer.title}</h2>

        <p>${prayer.category}</p>
    `;

    return article;

}