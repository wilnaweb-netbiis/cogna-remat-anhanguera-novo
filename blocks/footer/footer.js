import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  function MyModal() {
    return `
    <div id="myModal" class="modal"><div class="modal-content"><span class="close">&times;</span>
    <video width="320" height="240" controls>
    <source src="https://publish-p136102-e1403896.adobeaemcloud.com/content/dam/cogna-lps-adobe-eds/brands/video.mp4" type="video/mp4">
    Your browser does not support the video tag.
    </video>
    </div></div>
    <div id="myModal2" class="modal"><div class="modal-content"><span class="close">&times;</span>
    <video width="320" height="240" controls>
    <source src="https://publish-p136102-e1403896.adobeaemcloud.com/content/dam/cogna-lps-adobe-eds/brands/video2-estudo.mp4" type="video/mp4">
    Your browser does not support the video tag.
    </video>
    </div></div>
    <div id="myModal3" class="modal"><div class="modal-content"><span class="close">&times;</span>
    <video width="320" height="240" controls>
    <source src="https://publish-p136102-e1403896.adobeaemcloud.com/content/dam/cogna-lps-adobe-eds/brands/video3-avaliacao.mp4" type="video/mp4">
    Your browser does not support the video tag.
    </video>
    </div></div>`;
  }

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const classes = ['social-bar', 'copyright-bar'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`section-${c}`);
    section.children[0].classList.add('container', 'mx-auto');
  });
  const socialItens = footer.querySelector('.section-social-bar ul');
  socialItens.childNodes.forEach((item) => {
    if (item.hasChildNodes()) {
      const social = item.querySelector('a');
      const title = social.attributes.title.value.toLowerCase();
      social.innerHTML = `<i class="fa-brands fa-${title}"></i>`;
    }
  });

  const copyrightBar = footer.querySelectorAll('.section-copyright-bar p');
  copyrightBar.forEach((item) => {
    if (item.textContent.includes('#year#')) {
      item.innerHTML = item.textContent.replace('#year#', new Date().getFullYear());
    }
  });

  block.append(footer);

  const footerX = document.createElement('div');
  footerX.classList.add('footer-x');
  footerX.innerHTML = MyModal();
  block.append(footerX);
}

const sections = document.querySelectorAll('.section');
document.addEventListener('scroll', () => {
  const lastKnownScrollPosition = window.scrollY + (window.innerHeight * 0.25);

  sections.forEach((element) => {
    const rect = element.getBoundingClientRect();
    const reactTop = (rect.top + window.scrollY) - (window.innerHeight * 0.15);
    const reactBottom = rect.bottom + window.scrollY + (window.innerHeight * 0.15);
    if (reactTop <= lastKnownScrollPosition && reactBottom >= lastKnownScrollPosition) {
      // Element is in view
      element.classList.add('viewed');
      element.classList.add('in-view');
    } else {
      // Element is out of view
      element.classList.remove('in-view');
    }
  });
});
