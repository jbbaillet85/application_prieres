'use strict';

/**
 * Références vers les éléments du dialogue.
 */

const dialog = document.querySelector('#prayer-dialog');

const image = document.querySelector('#dialog-image');

const title = document.querySelector('#dialog-title');

const category = document.querySelector('#dialog-category');

const content = document.querySelector('#dialog-content');

const closeButton = document.querySelector('#close-dialog');

/**
 * Ouvre une prière.
 *
 * @param {Object} prayer
 */
export function openDialog(prayer) {

    image.src = prayer.image;

    image.alt = prayer.title;

    title.textContent = prayer.title;

    category.textContent = prayer.category;

    content.innerHTML = prayer.content
        .split('\n')
        .map(line => `<p>${line}</p>`)
        .join('');

    dialog.showModal();

}

/**
 * Ferme le dialogue.
 */
export function closeDialog() {

    dialog.close();

}

/**
 * Initialise les événements.
 */
export function initDialog() {

    closeButton.addEventListener('click', closeDialog);

    dialog.addEventListener('click', event => {

        const rect = dialog.getBoundingClientRect();

        const inside =
            rect.top <= event.clientY &&
            event.clientY <= rect.bottom &&
            rect.left <= event.clientX &&
            event.clientX <= rect.right;

        if (!inside) {

            dialog.close();

        }

    });

}