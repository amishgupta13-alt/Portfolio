const header = document.getElementById('siteHeader');
const progress = document.getElementById('progressLine');
const nav = document.getElementById('nav');
const menu = document.getElementById('menuToggle');
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;


/* =========================================================
   MOBILE MENU
   ========================================================= */

menu?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');

  menu.setAttribute(
    'aria-expanded',
    String(open)
  );
});


nav?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    nav.classList.remove('open');

    menu?.setAttribute(
      'aria-expanded',
      'false'
    );
  });
});


/* =========================================================
   ACTIVE NAVIGATION
   Works with:
   #section
   index.html#section
   portfolio.html#section
   ========================================================= */

const sections = [
  ...document.querySelectorAll('main section[id]')
];

const links = [
  ...document.querySelectorAll('.nav a')
];

const observer = new IntersectionObserver(
  (entries) => {

    entries.forEach((entry) => {

      if (!entry.isIntersecting) return;

      links.forEach((link) => {

        const href = link.getAttribute('href') || '';

        link.classList.toggle(
          'active',
          href.endsWith(
            `#${entry.target.id}`
          )
        );

      });

    });

  },
  {
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  }
);


sections.forEach((section) => {
  observer.observe(section);
});


/* =========================================================
   REVEAL ANIMATIONS
   ========================================================= */

const revealObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) return;

        entry.target.classList.add(
          'visible'
        );

        revealObserver.unobserve(
          entry.target
        );

      });

    },
    {
      threshold: 0.12
    }
  );


document
  .querySelectorAll('.reveal')
  .forEach((element) => {

    revealObserver.observe(
      element
    );

  });


/* =========================================================
   SCROLL PROGRESS
   ========================================================= */

function updateScroll() {

  const y = window.scrollY;

  header?.classList.toggle(
    'scrolled',
    y > 40
  );

  if (!progress) return;

  const max =
    document.documentElement.scrollHeight -
    window.innerHeight;

  progress.style.width =
    max > 0
      ? `${(y / max) * 100}%`
      : '0%';
}


window.addEventListener(
  'scroll',
  updateScroll,
  {
    passive: true
  }
);


updateScroll();


/* =========================================================
   TOOL TILT
   ========================================================= */

if (!prefersReduced) {

  document
    .querySelectorAll('[data-tilt]')
    .forEach((card) => {

      card.addEventListener(
        'pointermove',
        (event) => {

          if (window.innerWidth < 851) {
            return;
          }

          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
              rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
              rect.height -
            0.5;

          card.style.transform =
            `perspective(900px) ` +
            `rotateX(${y * -4}deg) ` +
            `rotateY(${x * 4}deg) ` +
            `translateY(-6px)`;

        }
      );


      card.addEventListener(
        'pointerleave',
        () => {
          card.style.transform = '';
        }
      );

    });

}


/* =========================================================
   COUNTERS
   ========================================================= */

const counters =
  document.querySelectorAll(
    '[data-count]'
  );


const countObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (!entry.isIntersecting) {
          return;
        }

        const element =
          entry.target;

        const target =
          Number(
            element.dataset.count
          );


        if (prefersReduced) {

          element.textContent =
            target;

          countObserver.unobserve(
            element
          );

          return;
        }


        let start = 0;


        const step = () => {

          start += 1;

          element.textContent =
            start;

          if (start < target) {

            requestAnimationFrame(
              step
            );

          }

        };


        requestAnimationFrame(
          step
        );

        countObserver.unobserve(
          element
        );

      });

    },
    {
      threshold: 0.8
    }
  );


counters.forEach((counter) => {
  countObserver.observe(
    counter
  );
});


/* =========================================================
   CONTACT FORM
   ========================================================= */

document
  .getElementById('contactForm')
  ?.addEventListener(
    'submit',
    (event) => {

      event.preventDefault();

      const form =
        new FormData(
          event.currentTarget
        );


      const subject =
        encodeURIComponent(
          form.get('subject') || ''
        );


      const body =
        encodeURIComponent(
          `Name: ${form.get('name') || ''}\n` +
          `Email: ${form.get('email') || ''}\n\n` +
          `${form.get('message') || ''}`
        );


      window.location.href =
        `mailto:amishgupta13@gmail.com` +
        `?subject=${subject}` +
        `&body=${body}`;

    }
  );


/* =========================================================
   FOOTER YEAR
   ========================================================= */

const yearElement =
  document.getElementById('year');


if (yearElement) {

  yearElement.textContent =
    new Date().getFullYear();

}


/* =========================================================
   CERTIFICATE COVERFLOW
   This works only when the certificate HTML exists.
   It does nothing on pages where the certificate section
   is not present.
   ========================================================= */

(() => {

  const stage =
    document.getElementById(
      'certificateStage'
    );

  const cards =
    Array.from(
      document.querySelectorAll(
        '.certificate-card'
      )
    );

  const previousButton =
    document.getElementById(
      'certificatePrev'
    );

  const nextButton =
    document.getElementById(
      'certificateNext'
    );

  const dotsContainer =
    document.getElementById(
      'certificateDots'
    );

  const issuerElement =
    document.getElementById(
      'certificateIssuer'
    );

  const titleElement =
    document.getElementById(
      'certificateTitle'
    );

  const dateElement =
    document.getElementById(
      'certificateDate'
    );

  const modal =
    document.getElementById(
      'certificateModal'
    );

  const modalClose =
    document.getElementById(
      'certificateModalClose'
    );

  const modalImage =
    document.getElementById(
      'certificateModalImage'
    );

  const modalIssuer =
    document.getElementById(
      'certificateModalIssuer'
    );

  const modalTitle =
    document.getElementById(
      'certificateModalTitle'
    );

  const modalDate =
    document.getElementById(
      'certificateModalDate'
    );


  /*
   * If the certificate section is not
   * present on this page, stop here.
   */
  if (
    !stage ||
    cards.length === 0
  ) {
    return;
  }


  /* =======================================================
     COVERFLOW SETTINGS
     ======================================================= */

  let position = 0;

  let target = 0;

  let animationFrame = null;

  let dragging = null;


  const ROTATE = 44;

  const DEPTH = 0.58;

  const GAP = 0.10;

  const FALLOFF = 0.56;

  const FADE = 0.12;


  /* =======================================================
     WRAP INDEX
     ======================================================= */

  function wrap(index) {

    return (
      (
        index % cards.length
      ) +
      cards.length
    ) %
    cards.length;

  }


  /* =======================================================
     UPDATE CAPTION
     ======================================================= */

  function updateCaption() {

    if (
      !issuerElement ||
      !titleElement ||
      !dateElement
    ) {
      return;
    }


    const activeCard =
      cards[
        wrap(
          Math.round(
            position
          )
        )
      ];


    issuerElement.textContent =
      activeCard.dataset.issuer ||
      '';


    titleElement.textContent =
      activeCard.dataset.title ||
      '';


    dateElement.textContent =
      activeCard.dataset.date ||
      '';

  }


  /* =======================================================
     UPDATE DOTS
     ======================================================= */

  function updateDots() {

    if (!dotsContainer) {
      return;
    }


    const active =
      wrap(
        Math.round(
          position
        )
      );


    Array.from(
      dotsContainer.children
    ).forEach(
      (dot, index) => {

        dot.classList.toggle(
          'active',
          index === active
        );

        dot.setAttribute(
          'aria-current',
          index === active
            ? 'true'
            : 'false'
        );

      }
    );

  }


  /* =======================================================
     PAINT CARDS
     ======================================================= */

  function paint() {

    const width =
      cards[0].getBoundingClientRect().width;


    const pitch =
      width *
      (1 + GAP);


    cards.forEach(
      (card, index) => {

        let offset =
          index -
          position;


        /*
         * Make the carousel circular.
         */
        offset =
          (
            (
              offset %
              cards.length
            ) +
            cards.length
          ) %
          cards.length;


        /*
         * Always use the shortest
         * route around the carousel.
         */
        if (
          offset >
          cards.length / 2
        ) {

          offset -=
            cards.length;

        }


        const distance =
          Math.abs(
            offset
          );


        /*
         * Ease the rotation and depth.
         */
        const ramp =
          Math.pow(
            distance,
            FALLOFF
          );


        /*
         * Rotate cards on the Y axis.
         */
        const tilt =
          Math.min(
            ROTATE * ramp,
            82
          ) *
          Math.sign(
            offset
          );


        /*
         * Push neighbouring cards
         * backward in 3D space.
         */
        const z =
          -DEPTH *
          width *
          ramp;


        /*
         * Fade distant cards.
         */
        const opacity =
          Math.max(
            0,
            1 - FADE * distance
          ) *
          Math.max(
            0,
            Math.min(
              1,
              cards.length / 2 -
              distance
            )
          );


        card.style.transform =
          `translate(-50%, -50%) ` +
          `translateX(${offset * pitch}px) ` +
          `translateZ(${z}px) ` +
          `rotateY(${-tilt}deg)`;


        card.style.opacity =
          String(
            opacity
          );


        card.style.zIndex =
          String(
            100 -
            Math.round(
              distance
            )
          );


        /*
         * Used by CSS to identify
         * the active certificate.
         */
        card.classList.toggle(
          'is-active',
          distance < 0.5
        );


        card.setAttribute(
          'aria-hidden',
          distance > 1.5
            ? 'true'
            : 'false'
        );

      }
    );


    updateCaption();

    updateDots();

  }


  /* =======================================================
     SMOOTH SETTLE / ANIMATION
     ======================================================= */

  function settle(
    nextTarget
  ) {

    target =
      nextTarget;


    if (
      animationFrame
    ) {

      cancelAnimationFrame(
        animationFrame
      );

    }


    const step = () => {

      const remaining =
        target -
        position;


      if (
        Math.abs(
          remaining
        ) <
        0.0004
      ) {

        position =
          target;


        paint();


        animationFrame =
          null;


        return;

      }


      /*
       * Exponential ease-out.
       */
      position +=
        remaining *
        0.16;


      paint();


      animationFrame =
        requestAnimationFrame(
          step
        );

    };


    animationFrame =
      requestAnimationFrame(
        step
      );

  }


  /* =======================================================
     MOVE LEFT / RIGHT
     ======================================================= */

  function moveBy(
    amount
  ) {

    settle(
      Math.round(
        target
      ) +
      amount
    );

  }


  /* =======================================================
     OPEN CERTIFICATE MODAL
     ======================================================= */

  function openCertificate(
    index
  ) {

    if (
      !modal ||
      !modalImage ||
      !modalTitle
    ) {
      return;
    }


    const card =
      cards[
        wrap(index)
      ];


    const image =
      card.querySelector(
        'img'
      );


    if (!image) {
      return;
    }


    modalImage.src =
      image.src;


    modalImage.alt =
      image.alt;


    if (modalIssuer) {

      modalIssuer.textContent =
        (
          card.dataset.issuer ||
          ''
        ).toUpperCase();

    }


    modalTitle.textContent =
      card.dataset.title ||
      '';


    if (modalDate) {

      modalDate.textContent =
        card.dataset.date ||
        '';

    }


    /*
     * Native dialog support.
     */
    if (
      typeof modal.showModal ===
      'function'
    ) {

      modal.showModal();

    } else {

      modal.setAttribute(
        'open',
        ''
      );

    }

  }


  /* =======================================================
     CERTIFICATE CARDS
     ======================================================= */

  cards.forEach(
    (card, index) => {

      const face =
        card.querySelector(
          '.certificate-face'
        );


      face?.addEventListener(
        'click',
        (event) => {

          /*
           * Prevent the click on a
           * side certificate from
           * opening the modal.
           */
          event.stopPropagation();


          const active =
            wrap(
              Math.round(
                position
              )
            );


          if (
            index === active
          ) {

            openCertificate(
              index
            );

          } else {

            settle(
              index
            );

          }

        }
      );

    }
  );


  /* =======================================================
     PAGINATION DOTS
     ======================================================= */

  if (dotsContainer) {

    cards.forEach(
      (_, index) => {

        const dot =
          document.createElement(
            'button'
          );


        dot.type =
          'button';


        dot.className =
          'certificate-dot';


        dot.setAttribute(
          'aria-label',
          `Go to certificate ${index + 1}`
        );


        dot.addEventListener(
          'click',
          () => {

            settle(
              index
            );

          }
        );


        dotsContainer.appendChild(
          dot
        );

      }
    );

  }


  /* =======================================================
     PREVIOUS / NEXT BUTTONS
     ======================================================= */

  previousButton?.addEventListener(
    'click',
    () => {
      moveBy(-1);
    }
  );


  nextButton?.addEventListener(
    'click',
    () => {
      moveBy(1);
    }
  );


  /* =======================================================
     KEYBOARD CONTROL
     ======================================================= */

  stage.addEventListener(
    'keydown',
    (event) => {

      if (
        event.key ===
        'ArrowLeft'
      ) {

        event.preventDefault();

        moveBy(-1);

      }


      if (
        event.key ===
        'ArrowRight'
      ) {

        event.preventDefault();

        moveBy(1);

      }


      if (
        event.key ===
          'Enter' ||
        event.key ===
          ' '
      ) {

        if (
          document.activeElement ===
          stage
        ) {

          event.preventDefault();

          openCertificate(
            wrap(
              Math.round(
                position
              )
            )
          );

        }

      }

    }
  );


  /* =======================================================
     POINTER DOWN — START DRAG
     ======================================================= */

  stage.addEventListener(
    'pointerdown',
    (event) => {

      /*
       * Stop the current
       * animation while dragging.
       */
      if (
        animationFrame
      ) {

        cancelAnimationFrame(
          animationFrame
        );

        animationFrame =
          null;

      }


      target =
        position;


      stage.setPointerCapture(
        event.pointerId
      );


      drag = {

        id:
          event.pointerId,

        startX:
          event.clientX,

        startPosition:
          position,

        velocity:
          0,

        lastTime:
          performance.now()

      };

    }
  );


  /* =======================================================
     POINTER MOVE — DRAG
     ======================================================= */

  stage.addEventListener(
    'pointermove',
    (event) => {

      if (
        !drag ||
        drag.id !==
          event.pointerId
      ) {
        return;
      }


      const width =
        cards[0]
          .getBoundingClientRect()
          .width;


      const pitch =
        width *
        (1 + GAP);


      if (!pitch) {
        return;
      }


      const now =
        performance.now();


      const previous =
        position;


      /*
       * Convert pointer movement
       * into carousel movement.
       */
      position =
        drag.startPosition -
        (
          (
            event.clientX -
            drag.startX
          ) /
          pitch
        );


      /*
       * Calculate velocity for
       * flick/swipe behavior.
       */
      drag.velocity =
        (
          position -
          previous
        ) /
        Math.max(
          now -
          drag.lastTime,
          1
        ) *
        1000;


      drag.lastTime =
        now;


      paint();

    }
  );


  /* =======================================================
     POINTER UP / CANCEL
     ======================================================= */

  function endDrag(
    event
  ) {

    if (
      !drag ||
      drag.id !==
        event.pointerId
    ) {
      return;
    }


    /*
     * Carry the swipe movement
     * forward slightly.
     */
    const carried =
      Math.max(
        -2,
        Math.min(
          2,
          drag.velocity *
            0.18
        )
      );


    drag =
      null;


    settle(
      Math.round(
        position +
        carried
      )
    );

  }


  stage.addEventListener(
    'pointerup',
    endDrag
  );


  stage.addEventListener(
    'pointercancel',
    endDrag
  );


  /* =======================================================
     MODAL CLOSE
     ======================================================= */

  modalClose?.addEventListener(
    'click',
    () => {

      if (
        typeof modal.close ===
        'function'
      ) {

        modal.close();

      } else {

        modal.removeAttribute(
          'open'
        );

      }

    }
  );


  /*
   * Close dialog when clicking
   * outside the modal content.
   */
  modal?.addEventListener(
    'click',
    (event) => {

      if (
        event.target ===
        modal
      ) {

        if (
          typeof modal.close ===
          'function'
        ) {

          modal.close();

        }

      }

    }
  );


  /* =======================================================
     RESIZE
     ======================================================= */

  window.addEventListener(
    'resize',
    paint
  );


  /* =======================================================
     INITIALIZE
     ======================================================= */

  paint();

})();
