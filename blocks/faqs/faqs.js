import { findElementByStartsWithText } from '../../scripts/customlib.js';

export default function decorate(block) {
  [...block.children].forEach((div) => {
    if (div.children.length === 3) {
      div.className = 'faq-item';
      div.children[0].className = 'faq-item-icon';
      div.children[1].className = 'faq-item-question';
      div.children[2].className = 'faq-item-answer';
      const divIcon = div.children[0];
      const foundIcon = findElementByStartsWithText(divIcon, 'i-icon', 'p');
      if (foundIcon) {
        const classIcon = foundIcon.innerHTML;
        const i = document.createElement('i');
        i.classList.add('i-icon');
        i.classList.add(classIcon);
        divIcon.appendChild(i);
        foundIcon.remove();
      } else {
        divIcon.remove();
      }
    } else {
      div.className = 'faq-header';
    }
  });
}
