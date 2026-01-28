import { findElementByStartsWithText, decorateVideo } from '../../scripts/customlib.js';

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      const buttonContainer = col.querySelector('.button-container');
      col.classList.add('columns-col');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }

        if (picWrapper && picWrapper.children.length === 2 && buttonContainer) {
          picWrapper.classList.add('columns-img-button-col');
        }
      }

      // video block
      const foundVideo = findElementByStartsWithText(col, 'id-block-video', 'p');
      if (foundVideo) {
        const videoBlock = document.createElement('div');
        videoBlock.classList.add('video');
        videoBlock.classList.add('block');

        const wrapperDiv = document.createElement('div');
        const wrapperInto = document.createElement('div');

        const button = wrapperDiv.cloneNode(true);
        const buttonChild = wrapperInto.cloneNode(true);
        buttonChild.appendChild(foundVideo.nextElementSibling.nextElementSibling);
        button.appendChild(buttonChild);

        const thumb = wrapperDiv.cloneNode(true);
        const thumbChild = wrapperInto.cloneNode(true);
        thumbChild.appendChild(foundVideo.nextElementSibling.children[0]);
        thumb.appendChild(thumbChild);

        const id = wrapperDiv.cloneNode(true);
        const idChild = wrapperInto.cloneNode(true);
        idChild.appendChild(foundVideo);
        id.appendChild(idChild);

        videoBlock.appendChild(id);
        videoBlock.appendChild(thumb);
        videoBlock.appendChild(button);

        decorateVideo(videoBlock);

        col.appendChild(videoBlock);

        col.children[0].remove();
      }
    });
  });
}
