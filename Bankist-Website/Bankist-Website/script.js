'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const section3 = document.querySelector('#section--3');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');





///////////////////////////////////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});




///////////////////////////////////////////////////////////////////
// For Learn more button...

btnScrollTo.addEventListener('click', function (e) {
  // To get the coordinated of target (section 1)
  const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);

  // // To get the coordinates of the button to be used(btnScrollTo)
  // console.log(e.target.getBoundingClientRect());

  // // To get the current position of the scroll on scroll bar
  // console.log('current scroll (x, y)', window.pageXOffset, window.pageYOffset);

  // // To get the resolution of the current vivible screen
  // console.log("(height, width) of viewport", document.documentElement.clientHeight, document.documentElement.clientWidth);

  // // Scrolling
  // window.scrollTo(s1Coords.left + window.pageXOffset, s1Coords.top + window.pageYOffset);

  // // For smoother scrolling
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: "smooth"
  // });

  // New and easy way to scroll smoother without finding the coordinates manually
  section1.scrollIntoView({
    behavior: "smooth"
  });
});




///////////////////////////////////////////////////////////////////
// Page Navigation

// Method 1
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     // Smooth scrolling 
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({
//       behavior: "smooth"
//     });
//   })
// });

// Method 2
// 1. Add event listener to a common parent
// 2. Determine what event originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // Adding smooth scroll effect in navbar
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth'
    });
  }
});




///////////////////////////////////////////////////////////////////
// Top Menu-fade animation

// const handleHover = function (e, opacity) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) {
//         el.style.opacity = opacity;
//       }
//     });
//     logo.style.opacity = opacity;
//   }
// };
// // Adding
// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
// //Removing
// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

// Clean way
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
// Adding
nav.addEventListener('mouseover', handleHover.bind(0.5));
//Removing
nav.addEventListener('mouseout', handleHover.bind(1));




///////////////////////////////////////////////////////////////////
// Sticky Navigation

// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   // Tells the current y coordinates or the scroll
//   // console.log(window.scrollY);

//   if (this.window.scrollY > initialCoords.top) {
//     nav.classList.add("sticky");
//   }
//   else {
//     nav.classList.remove("sticky");
//   }
// });

// Using : Intersection Observer API
const navHeight = nav.getBoundingClientRect().height;
// This call-back function will get called each time that the observed/target element is intersecting 
// the root element at the threshold that we defined
const obsCallback = function (entries) {
  // entries.forEach(entry => console.log(entry));
  const [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  }
  else {
    nav.classList.remove('sticky');
  }
};
const obsOptions = {
  // root element is intersected by target
  root: null,
  // threshold is the percentage(s) at which the observer call-back will be called
  threshold: 0,
  rootMargin: `-${navHeight}px`
};
const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);




///////////////////////////////////////////////////////////////////
// Tabbed components

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);
  // console.log(clicked.dataset.tab);

  // Error Handling
  if (!clicked) return;

  // Removing all active classes of tabs and contents
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));

  // Activating the tab(moving up)
  clicked.classList.add('operations__tab--active');

  // Activating the content
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});




///////////////////////////////////////////////////////////////////
// Revealing Sections smoothly
// Call-back function
const revealSection = function (entries, observer) {
  const [entry] = entries;
  // Error handling
  if (!entry.isIntersecting) return;
  // Making the sections visible
  entry.target.classList.remove('section--hidden');
  // To stop the unwanted observation happening after it has been done once
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, { root: null, threshold: 0.15 });

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});




///////////////////////////////////////////////////////////////////
// Lazy loading images
// Call-back function

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  // To stop the unwanted observation happening after it has been done once
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, { root: null, threshold: 0 });

imgTargets.forEach(img => imgObserver.observe(img));




///////////////////////////////////////////////////////////////////
// Sliding testimonials
// Call-back function

let curSlide = 0;
const maxSlides = slides.length;

// Creates Dots under the slide section
const createDots = function () {
  slides.forEach((_, i) => dotContainer.insertAdjacentHTML('beforeend',
    `<button class="dots__dot" data-slide="${i}"></button>`))
};

// Activates the dots(changes the color accordingly)
const activateDots = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}

// To move the slides
const goToSlide = function (slide) {
  slides.forEach((s, i) => s.style.transform = `translateX(${100 * (i - slide)}%)`);
}

// Assigns Initial Coordinates to all slides
goToSlide(0);
createDots();
activateDots(0);

// For sliding towards right
const nextSlide = function () {
  // When the slider reaches the right-end, start from the beginning
  if (curSlide === (maxSlides - 1))
    curSlide = 0;
  else
    curSlide++;

  goToSlide(curSlide);
  activateDots(curSlide);
};

// For sliding towards left
const prevSlide = function () {
  // When the slider reaches the left-end, start from the end
  if (curSlide === 0) {
    curSlide = (maxSlides - 1);
  }
  else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDots(curSlide);
}

// Right Slide Button
btnRight.addEventListener('click', nextSlide);
// Left Slide Button
btnLeft.addEventListener('click', prevSlide);

// To make the use of keyboard to move the slide (arrowLeft and arrowRight)
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft')
    prevSlide();
  else if (e.key === 'ArrowRight')
    nextSlide();
});

// To move the slides by clicking on the dots
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDots(curSlide);
  }
})