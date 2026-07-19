'use strict';

/**
 * Charge un fichier JSON.
 *
 * @param {string} url
 * @returns {Promise<Object>}
 */
export async function loadJson(url) {

    const response = await fetch(url);

    if (!response.ok) {

        throw new Error(`Impossible de charger ${url}`);

    }

    return await response.json();

}