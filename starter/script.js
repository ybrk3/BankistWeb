'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnLearnMore = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const operationsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

//Esc close modal
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Scrolling
btnLearnMore.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//Tabbed component
tabContainer.addEventListener('click', function (e) {
  //getting the clicked tab
  const clicked = e.target.closest('.operations__tab');

  //Guard Clause
  if (!clicked) return;

  //Removing the active of tabs and content
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  operationsContent.forEach(c =>
    c.classList.remove('operations__content--active')
  );
  // Activate tab and content
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Argument usage in eventhandlers
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');

    const logo = e.target.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

//Sticky scrolling --Better Way-- Intersection Observer API
const header = document.querySelector('.header');

const stickyNav = function (entries) {
  const [entry] = entries; /* =>'entry=entries[0]' */
  if (!entry.isIntersecting) nav.classList.add('sticky');
  //When it's out of root within threshold. isIntersecting returns false
  else nav.classList.remove('sticky');
};

const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //area to be checked, 'viewport' as a default
  threshold: 0, //percentage
  rootMargin: `-${navHeight}px`, //decrease as per given value
});
headerObserver.observe(header);

//Revealıng elements on scroll

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target); //=> stop keeping observe
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden'); //=> from CSS
});

//Lazy loading images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

//Slides
const slides = document.querySelectorAll('.slide');
let curSlide = 0; //Slide start on first picture
const slideNumber = slides.length; //to control when it comes to last or first one

//Changing slide
const changeSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};
const nextSlide = function () {
  if (curSlide === slideNumber - 1) curSlide = 0;
  else curSlide += 1;
  changeSlide(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) curSlide = slideNumber - 1;
  else curSlide -= 1;
  changeSlide(curSlide);
};

//Event listener on buttons
const btnNextSlide = document.querySelector('.slider__btn--right');
const btnPrevSlide = document.querySelector('.slider__btn--left');
btnNextSlide.addEventListener('click', nextSlide);

//Event Listener on keyboard (arrow)
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

//Controlling slide through dots.
// 1- Creating dots on HTML
const dotContainer = document.querySelector('.dots');
slides.forEach((_, i) =>
  dotContainer.insertAdjacentHTML(
    'beforeend',
    `<button class='dots__dot' data-slide='${i}'></button>`
  )
);
// 2- Event Listener through dots
const dots = document.querySelectorAll('.dots__dot');
dots.forEach(d => {
  addEventListener('click', function (e) {
    const slctedDot = e.target.dataset.slide;
    changeSlide(slctedDot);
  });
});

changeSlide(curSlide);
