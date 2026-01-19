import { findElementByStartsWithText } from '../../scripts/customlib.js';

export default function decorate(block) {
  const boxes = document.createElement('div');
  boxes.classList.add('boxes-wrapper');
  let boxesPos = 0;

  let pos = 0;
  [...block.children].forEach((div) => {
    const foundBox = findElementByStartsWithText(div, 'box', 'p');
    if (foundBox) {
      if (boxes.children.length === 0) {
        boxesPos = pos;
      }
      const classes = foundBox.innerHTML.replace(',', '');
      div.className = `box-item ${classes}`;
      foundBox.parentNode.remove();
      boxes.appendChild(div);
    } else {
      div.className = 'banner-item';
    }

    [...div.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('image-wrapper');
          picWrapper.parentNode.className = 'banner-item-image';
        }
      }
    });
    pos += 1;
  });

  const referenceChild = block.children[boxesPos];
  block.insertBefore(boxes, referenceChild);

  block.querySelectorAll('.banner-item').forEach((itens) => {
    if (itens.children.length > 1) {
      itens.children[0].className = 'tagline';
      itens.children[1].className = 'content';
      if (itens.children[0].children.length === 0) {
        itens.children[0].remove();
      }
    } else {
      itens.children[0].className = 'content content-button';
    }
  });

  const anchorCursos = [
    document.querySelectorAll('.columns-wrapper')[1],
    document.querySelectorAll('.columns-wrapper')[0],
  ];

  boxes.querySelectorAll('.button').forEach((anchor, index) => {
    const anchorURL = new URL(anchor.href);
    const anchorId = anchorURL.hash ? anchorURL.hash : false;

    if (anchorId) {
      anchorCursos[index].setAttribute('id', anchorId.replace('#', ''));
    }
  });
}
