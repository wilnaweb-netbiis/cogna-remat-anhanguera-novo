/**
 * customlib.js
 * Custom utility functions for Cogna Rematricula scripts.
 * Description: Collection of reusable JavaScript functions.
 */

/**
 * Returns true if the given value is a non-empty string.
 * @param {any} value
 * @returns {boolean}
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Deep clones a simple object or array.
 * @param {Object|Array} obj
 * @returns {Object|Array}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirst(str) {
  if (!isNonEmptyString(str)) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Finds the first child element of a given parent node whose text content starts with the
 * specified search text.
 * @param {Node} parentNode - The parent DOM node to search within.
 * @param {string} searchText - The text to match at the start of the element's text content.
 * @param {string} [tagName='*'] - The tag name to filter elements by (defaults to all elements).
 * @returns {Element|null} The first matching element, or null if none is found.
 */
function findElementByStartsWithText(parentNode, searchText, tagName = '*') {
  const elements = parentNode.getElementsByTagName(tagName);
  for (let i = 0; i < elements.length; i += 1) {
    if (elements[i].textContent.startsWith(searchText)) {
      return elements[i]; // Returns the first element found
    }
  }
  return null; // No element found
}

function toggleElement(element) {
  if (element.style.display === 'none') {
    element.style.display = 'block'; // Or "flex", "grid", etc. depending on your layout
  } else {
    element.style.display = 'none';
  }
}

function decorateVideo(block) {
  block.children[0].className = 'video-id';
  block.children[1].className = 'video-thumb';
  block.children[2].className = 'video-button';

  const video = document.createElement('video');
  video.setAttribute('width', '320');
  video.setAttribute('height', '240');
  video.setAttribute('controls', 'controls');

  const url = block.children[2].querySelector('a').getAttribute('href');
  const source = document.createElement('source');
  source.setAttribute('src', url);
  source.setAttribute('type', 'video/mp4');

  video.appendChild(source);

  const wrapper = document.createElement('div');
  wrapper.classList.add('video-player');
  wrapper.appendChild(video);

  block.appendChild(wrapper);

  const click = block.children[2].querySelector('a');
  const videoPlayer = block.children[3];

  toggleElement(videoPlayer);

  click.addEventListener('click', (event) => {
    event.preventDefault();

    toggleElement(block.children[0]);
    toggleElement(block.children[1]);

    toggleElement(videoPlayer);

    video.setAttribute('autoplay', 'autoplay');
  });

  block.children[0].remove();
}

export {
  isNonEmptyString,
  deepClone,
  capitalizeFirst,
  findElementByStartsWithText,
  decorateVideo,
  toggleElement,
};
