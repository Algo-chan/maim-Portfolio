import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ExpoScaleEase } from "gsap/EasePack";
import SplitType from "split-type";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin, ExpoScaleEase);
gsap.config({ force3D: true });
/* The mobile address bar changing height must not re-trigger refreshes and
   cause the curtain to jump. */
ScrollTrigger.config({ ignoreMobileResize: true });

/* ------------------------------------------------------------------ */
/*  Global motion tokens — tune the whole page from this one object.  */
/* ------------------------------------------------------------------ */
export const MOTION = {
  ease: { out: "power3.out", inOut: "power3.inOut", expo: "expo.out" },
  dur: { fast: 0.4, base: 0.8, slow: 1.2 },
  stagger: { chars: 0.025, words: 0.06, lines: 0.1, items: 0.12 },
  distance: { sm: 24, md: 48, lg: 80 },
  scrollSmooth: { lerp: 0.1, wheelMultiplier: 1 },
  marqueeSpeed: { rowA: 40, rowB: 55 }, // kept in the spec shape; marquee currently disabled

  /* Page-load intro (hero words + subtitle + header) */
  intro: {
    nameDelay: 1,
    nameDuration: 1.5,
    nameStagger: 0.3,
    nameYPercent: 110,
    nameEase: "power2.out",
    subDelay: 1.5,
    subDuration: 0.8,
    subStagger: 0.3,
    subYPercent: 110,
    subSkewY: 7,
    subEase: "power4.out",
    headerDelay: 1.8,
    headerDuration: 0.6,
    headerEase: "power2.out",
  },

  /* Boot sequencing */
  boot: {
    scrollToTopDelay: 50,
    engineDelay: 200,
  },

  /* Loader */
  loader: {
    panelDelay: 1,
    panelDuration: 0.8,
    panelEase: "expoScale(0.5,7,none)",
    counterDuration: 3,
    counterEase: "power3.inOut",
    counterSnap: 10,
    counterMin: 10,
    hideDuration: 1,
  },

  /* Generic data-reveal engine */
  reveal: {
    start: "top 70%",
    toggleActions: "play none none none",
    fadeUp: { y: 48, duration: 0.4, stagger: 0.04 },
    fadeIn: { y: 0, blur: 10, duration: 0.4, stagger: 0.04 },
    lines: { yPercentFrom: 150, duration: 2.2, stagger: 0.04, ease: "expo" },
    words: { fromOpacity: 0.15, duration: 1.2, ease: "none" },
    clip: { duration: 1, ease: "power3.inOut" },
  },

  /* About section (pin + line reveal + highlight + card fan) */
  about: {
    lineStart: "top 30%",
    lineEnd: "bottom 70%",
    highlightStart: "top 1%",
    highlightEnd: "+=400",
    highlightStagger: 1,
    highlightColor: "#990900",
    desktopEnd: "+=1000",
    mobileEnd: "+=400",
    snap: 0.33,
    desktopScrub: 1,
    mobileScrub: 0.1,
  },

  /* Hero stacked cards → Flip into about (reference behaviour) */
  cards: {
    dropInDelay: 1.5,
    dropInDuration: 1,
    dropInEase: "elastic.out(1, 0.7)",
    dropInStagger: 0.12,
    tiltEaseDuration: 0.8,
    tiltRest: 3,
    scaleDuration: 0.4,
    scaleEase: "expo.out",
    tiltDur: 0.4,
    tiltEase: "power1.out",
    arcDur: 0.8,
    arcEase: "elastic.out(1, 0.7)",
    flipDuration: 0.8,
    flipEase: "power2.inOut",
    fanScaleDesktop: 1.3,
    fanScaleMobile: 1.1,
    fanSpanDesktop: 800,
    fanSpanMobile: 400,
    fanEase: "expoScale(0.5,7,none)",
    mobileWidth: 600,
    desktopWidth: 850,
    arcHeight: 75,
    irregularities: [0, 0, 0, 4, -8, -12],
    tiltDegrees: 7,
    tiltDegreesMobile: 5,
  },

  /* Featured Work: pinned radius arc + content/char reveals */
  featured: {
    desktopEnd: "+=5000px",
    mobileEnd: "+=3000px",
    contentEaseStart: 0.85,
    radius: [
      { max: 600, factor: 7 },
      { max: 768, factor: 5.5 },
      { max: 992, factor: 3 },
      { max: 1024, factor: 3.5 },
    ],
    radiusFallback: 3,
    arc: { theta: Math.PI / 2.2, softener: 5.5, shift: 0.75 },
    charsDuration: 1.2,
    charsStagger: 0.04,
    charsEase: "power4.out",
    titleDuration: 0.4,
    titleEase: "power2.out",
  },

  /* Experience 3D card stack */
  stack: {
    transform: "rotate3d(1, 0, 0, -25deg) rotate3d(0, 1, 0, 50deg) rotate3d(0, 0, 1, 25deg)",
    zFromBase: -2.25,
    zFromStep: -0.03,
    zToBase: 1.8,
    zToStep: 0.03,
    rotationFrom: -220,
    rotationToZ: 120,
    rotationToY: -30,
    stagger: 0.005,
    start: "top top",
    end: "+=2000",
    scrub: 1,
    pin: true,
  },

  /* Experience section — heading, timeline entries, hover */
  experience: {
    start: "top 85%",
    toggleActions: "play none none none",
    heading: { yPercent: 100, duration: 1, ease: "expo.out" },
    divider: { duration: 0.9, ease: "power3.inOut" },
    index: { y: 24, duration: 0.6, ease: "power2.out" },
    line: { duration: 0.8, ease: "power3.out", stagger: 0.08 },
    bullets: { y: 20, duration: 0.6, ease: "power2.out", stagger: 0.08 },
    meta: { duration: 0.6, ease: "power2.out", stagger: 0.06 },
    hover: { shift: 12, dim: 0.5, arrow: 4, duration: 0.4, ease: "power3.out" },
    reduced: { duration: 0.5, ease: "power1.out" },
  },

  /* Magnetic hover + underlined links */
  magnetic: {
    max: 12,
    outEase: "power3.out",
    outDuration: 0.4,
    backEase: "elastic.out(1, 0.4)",
    backDuration: 0.6,
  },
  underline: { duration: 0.4 },

  /* Subtle scrubbed parallax */
  parallax: {
    heroYPercent: -10,
    heroOpacity: 0.3,
  },

  /* Curtain footer reveal + message flow */
  footer: {
    /* ScrollTrigger window: #page's bottom meets the viewport bottom, then
       scrolls one footer-height further (end is computed as += footer height
       so the reveal spans exactly the uncovered distance). */
    start: "bottom bottom",
    end: "bottom top",
    /* Inner wrapper parallax while the curtain lifts. */
    parallaxFrom: -20,
    /* Message textarea open/close. */
    message: {
      openDuration: 0.6,
      openEase: "power3.inOut",
    },
    /* Flashlight reveal on the profile photo. */
    spotlight: {
      /* Radius as a fraction of the photo's width (tune to taste). */
      radiusFactor: 0.28,
      /* Cursor-follow smoothing. */
      moveDuration: 0.35,
      moveEase: "power3.out",
      /* Grow (enter) / shrink (leave) of the spotlight. */
      growDuration: 0.4,
      growEase: "power3.out",
      /* Self-drifting lissajous path for touch devices. */
      driftDuration: 8,
      driftAmpX: 0.34,
      driftAmpY: 0.3,
      /* Idle time after a touch before drifting resumes. */
      resumeDelay: 2,
    },
    /* Subtle 3D depth tilt layered on top of the flashlight reveal. */
    tilt: {
      /* Max rotation from centre to edge, in degrees (4 = alive, not gimmicky). */
      maxAngle: 4,
      /* Scale + forward lift while hovered. */
      maxScale: 1.02,
      lift: 10,
      /* Cursor-follow smoothing for the tilt. */
      moveDuration: 0.5,
      moveEase: "power3.out",
      /* Ease back to rest on pointer leave. */
      returnDuration: 0.8,
      returnEase: "power3.out",
      /* Sheen highlight strength (alpha) + how far the shadow drifts, in px. */
      sheenOpacity: 0.12,
      shadowShift: 8,
      shadowY: 14,
    },
    /* Text-roll links: each letter (and its duplicate) rolls up one line. */
    roll: {
      duration: 0.5,
      ease: "power3.inOut",
      stagger: 0.025,
    },
    /* Morphing send button: one circular button, five states. */
    send: {
      /* Arrow → plane morph: arrow rotates -45° and cross-fades to the plane. */
      morph: { duration: 0.45, ease: "back.out(1.7)", rotate: -45 },
      /* "Ready" signal pulse (1 → 1.08 → 1). */
      pulse: { scale: 1.08, duration: 0.18, ease: "power2.inOut" },
      /* Success flight: off to the top-right. */
      flight: { x: 120, y: -120, scale: 0.4, duration: 0.7, ease: "power3.in" },
      /* Error shake (x oscillation). */
      shake: { amplitude: 6, duration: 0.4, ease: "power2.out" },
      /* Input block fade-out before the success message is shown. */
      formFade: { duration: 0.5, ease: "power2.out" },
      /* Success check-mark path draw. */
      check: { duration: 0.6, ease: "power2.out" },
    },
    /* Scroll-progress back-to-top ring. */
    progress: {
      pressScale: 0.92,
      pressDuration: 0.18,
      pressEase: "power2.out",
      scrollDuration: 1.4,
    },
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Small shared helpers                                               */
/* ------------------------------------------------------------------ */
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isMobileScreen = () => window.innerWidth <= 1023;
/** Accent colour for hover states, resolved from CSS so it follows the colour scheme. */
const experienceAccent = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--experience-accent").trim() || "#990900";

/* ------------------------------------------------------------------ */
/*  Smooth scroll (Lenis ↔ GSAP)                                       */
/* ------------------------------------------------------------------ */
function initSmoothScroll(): Lenis | null {
  /* Touch devices scroll natively — Lenis would fight the browser and the
     mobile viewport. ScrollTrigger's scrub works fine with native scroll. */
  if (!isFinePointer()) return null;
  const lenis = new Lenis({
    autoRaf: false,
    lerp: MOTION.scrollSmooth.lerp,
    wheelMultiplier: MOTION.scrollSmooth.wheelMultiplier,
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  return lenis;
}

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */
function animateLoader() {
  const panels = document.querySelectorAll(".loader-panel");
  gsap.to(panels, {
    delay: MOTION.loader.panelDelay,
    duration: MOTION.loader.panelDuration,
    height: 0,
    ease: MOTION.loader.panelEase,
  });
  const progress = document.querySelector(".progress") as HTMLElement | null;
  if (!progress) return;
  const counter = { value: 0 };
  gsap.to(counter, {
    value: 100,
    duration: MOTION.loader.counterDuration,
    ease: MOTION.loader.counterEase,
    onUpdate: () => {
      const shown = Math.max(MOTION.loader.counterMin, Math.round(counter.value / MOTION.loader.counterSnap) * MOTION.loader.counterSnap);
      progress.textContent = String(shown);
    },
    onComplete: () => {
      gsap.to(progress, {
        opacity: 0,
        duration: MOTION.loader.hideDuration,
        onComplete: () => progress.remove(),
      });
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Hero intro (words + subtitle)                                      */
/* ------------------------------------------------------------------ */
function heroIntro() {
  new SplitType(".banner", { types: "words" });
  new SplitType(".sub-title", { types: "words" });

  const { nameDelay, nameDuration, nameStagger, nameYPercent, nameEase } = MOTION.intro;
  const { subDelay, subDuration, subStagger, subYPercent, subSkewY, subEase } = MOTION.intro;

  gsap.from(["h1 div .word"], {
    yPercent: nameYPercent,
    delay: nameDelay,
    duration: nameDuration,
    ease: nameEase,
    stagger: nameStagger,
    opacity: 0,
  });
  gsap.from([".sub-title div .word"], {
    yPercent: subYPercent,
    delay: subDelay,
    skewY: subSkewY,
    duration: subDuration,
    ease: subEase,
    stagger: subStagger,
    opacity: 0,
  });
}

/* ------------------------------------------------------------------ */
/*  Hero stacked cards → Flip into the About container                 */
/* ------------------------------------------------------------------ */
function arcPosition({
  index,
  totalItems,
  containerWidth,
  arcHeight,
  tiltAdjust = 7,
}: {
  index: number;
  totalItems: number;
  containerWidth: number;
  arcHeight: number;
  tiltAdjust?: number;
}) {
  const { irregularities } = MOTION.cards;
  const step = containerWidth / totalItems;
  const offset = (totalItems - 1) / 2;
  const x = (index - offset) * step;
  const curve = arcHeight * Math.sin((Math.PI / (totalItems - 1)) * index);
  const tiltAngle = (index - (totalItems - 1) / 2) * tiltAdjust;
  const topPosition = arcHeight - curve + (irregularities[index] ?? 0);
  return { x, tiltAngle, topPosition };
}

function stackedCardsToAbout() {
  const container = document.querySelector(".stacked-cards");
  const items = document.querySelectorAll(".item");
  if (!container || !items.length) return;
  const total = items.length;
  const { desktopWidth, mobileWidth, arcHeight } = MOTION.cards;
  const containerWidth = isMobileScreen() ? mobileWidth : desktopWidth;

  const resettable = document.querySelector(".about-section") as HTMLElement | null;
  const viewportHeight = window.innerHeight;
  const sectionHeight = resettable ? resettable.offsetHeight : viewportHeight;
  const cardRange = Math.max(1, sectionHeight - 0.2 * viewportHeight);

  const { dropInDelay, dropInDuration, dropInEase, dropInStagger, tiltEaseDuration, tiltRest, scaleDuration, scaleEase, tiltDur, tiltEase, arcDur, arcEase, flipDuration, flipEase } = MOTION.cards;

  let entered = 0;
  const runAfterAll: Array<() => void> = [];

  items.forEach((element, index) => {
    const item = element as HTMLElement;
    const arc = arcPosition({ index, totalItems: total, containerWidth, arcHeight, tiltAdjust: MOTION.cards.tiltDegrees });
    const compact = arcPosition({ index, totalItems: total, containerWidth: 0, arcHeight: 0, tiltAdjust: 5 });

    runAfterAll[index] = () => {
      const flipState = Flip.getState(container);
      document.querySelector(".about-container")?.appendChild(container);
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".about-section",
            start: "top 80%",
            end: "bottom 70%",
            scrub: true,
            immediateRender: false,
          },
          x: compact.x,
          rotation: compact.tiltAngle,
          top: `${compact.topPosition}px`,
        })
        .add(Flip.from(flipState, { duration: flipDuration, ease: flipEase }));
      gsap.to(".text-highlight", {
        scrollTrigger: {
          trigger: ".about-section",
          start: MOTION.about.highlightStart,
          end: MOTION.about.highlightEnd,
          scrub: true,
          immediateRender: false,
        },
        stagger: MOTION.about.highlightStagger,
        color: MOTION.about.highlightColor,
      });
      matchMedia.add("(min-width: 1024px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".about-section",
              start: "top 80%",
              end: `+=${cardRange + MOTION.cards.fanSpanDesktop}`,
              scrub: true,
              immediateRender: false,
            },
          })
          .to(item, { x: 0, rotation: 0, top: 0, duration: cardRange, ease: "none" })
          .to(item, {
            x: index * 150,
            scale: MOTION.cards.fanScaleDesktop,
            top: index * 50,
            duration: MOTION.cards.fanSpanDesktop,
            ease: MOTION.cards.fanEase,
          });
      });
      matchMedia.add("(max-width: 1024px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".about-section",
              start: "top 80%",
              end: `+=${cardRange + MOTION.cards.fanSpanMobile}`,
              scrub: true,
              immediateRender: false,
            },
          })
          .to(item, { x: 0, rotation: 0, top: 0, duration: cardRange, ease: "none" })
          .to(item, {
            x: arc.x,
            scale: MOTION.cards.fanScaleMobile,
            top: index * 5,
            duration: MOTION.cards.fanSpanMobile,
            ease: MOTION.cards.fanEase,
          });
      });
    };

    const timeline = gsap.timeline({ delay: index * dropInStagger });
    gsap.set(item, { x: 0, y: 300, rotation: -45, scale: 1.1, opacity: 0 });
    timeline
      .to(item, { delay: dropInDelay, opacity: 1, duration: dropInDuration, y: 0, ease: dropInEase })
      .to(item, { duration: tiltEaseDuration, rotation: tiltRest, ease: dropInEase }, "<5%")
      .to(item, { duration: scaleDuration, scale: 1, ease: scaleEase }, "<50%")
      .to(item, { duration: tiltDur, rotation: arc.tiltAngle, ease: tiltEase }, "<50%")
      .to(item, { duration: arcDur, x: arc.x, top: `${arc.topPosition}px`, ease: arcEase }, "<0%")
      .call(() => {
        entered += 1;
        if (entered === total) {
          runAfterAll.forEach((run) => run());
        }
      });
  });
}

/* ------------------------------------------------------------------ */
/*  About pin                                                          */
/* ------------------------------------------------------------------ */
function pinAbout() {
  const { desktopEnd, mobileEnd, snap, desktopScrub, mobileScrub } = MOTION.about;
  matchMedia.add("(min-width: 1024px)", () => {
    gsap.to(".about-section", {
      scrollTrigger: { scrub: desktopScrub, snap, pin: ".about-section", end: desktopEnd, pinSpacing: true },
    });
  });
  matchMedia.add("(max-width: 1024px)", () => {
    gsap.to(".about-section", {
      scrollTrigger: { scrub: mobileScrub, snap, pin: ".about-section", end: mobileEnd, pinSpacing: true },
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Line-masked reveal for big statements                              */
/* ------------------------------------------------------------------ */
function revealLines(element: HTMLElement) {
  const split = new SplitType(element, { types: "lines" });
  const lines = (split.lines as HTMLElement[] | null) ?? [];
  lines.forEach((line) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("overflow-hidden");
    line.parentNode?.appendChild(wrapper);
    wrapper.appendChild(line);
  });
  const { yPercentFrom, duration, stagger, ease } = MOTION.reveal.lines;
  gsap.set(lines, { opacity: 0 });
  ScrollTrigger.create({
    trigger: element,
    start: MOTION.about.lineStart,
    end: MOTION.about.lineEnd,
    scrub: true,
    immediateRender: false,
    once: true,
    onEnter: () => {
      gsap.killTweensOf(lines as never);
      gsap
        .timeline({ defaults: { duration, ease } })
        .set(lines as never, { yPercent: yPercentFrom, rotate: 0, opacity: 0 })
        .to(lines as never, { yPercent: 0, rotate: 0, stagger, opacity: 1 });
    },
  });
}

/* ------------------------------------------------------------------ */
/*  Generic data-attribute reveal engine                                */
/* ------------------------------------------------------------------ */
function revealWords(element: HTMLElement) {
  const split = new SplitType(element, { types: "words" });
  const words = (split.words as HTMLElement[] | null) ?? [];
  const { fromOpacity, ease } = MOTION.reveal.words;
  gsap.set(words, { opacity: fromOpacity });
  gsap.fromTo(
    words,
    { opacity: fromOpacity },
    {
      opacity: 1,
      stagger: MOTION.stagger.words,
      ease,
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        end: "bottom 50%",
        scrub: true,
      },
    },
  );
}

function revealClip(element: HTMLElement) {
  const { duration, ease } = MOTION.reveal.clip;
  gsap.set(element, { clipPath: "inset(0 0 100% 0)" });
  ScrollTrigger.create({
    trigger: element,
    start: MOTION.reveal.start,
    toggleActions: MOTION.reveal.toggleActions,
    onEnter: () =>
      gsap.to(element, {
        clipPath: "inset(0 0 0% 0)",
        duration,
        ease,
        overwrite: true,
      }),
  });
}

function pageReveals() {
  const fadeUps = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal='fade-up']"));
  const fadeIns = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal='fade-in']"));

  if (fadeUps.length) {
    gsap.set(fadeUps, { y: MOTION.distance.md, opacity: 0 });
    ScrollTrigger.batch(fadeUps, {
      onEnter: (targets) =>
        gsap.to(targets, {
          force3D: true,
          y: 0,
          opacity: 1,
          duration: MOTION.reveal.fadeUp.duration,
          stagger: MOTION.reveal.fadeUp.stagger,
          ease: MOTION.ease.out,
          overwrite: true,
          delay: (_i, el) => Number((el as HTMLElement).dataset.delay ?? 0),
        }),
      once: true,
      start: MOTION.reveal.start,
    });
  }

  if (fadeIns.length) {
    gsap.set(fadeIns, { y: 0, opacity: 0, filter: `blur(${MOTION.reveal.fadeIn.blur}px)` });
    ScrollTrigger.batch(fadeIns, {
      onEnter: (targets) =>
        gsap.to(targets, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: MOTION.reveal.fadeIn.duration,
          stagger: MOTION.reveal.fadeIn.stagger,
          ease: MOTION.ease.out,
          overwrite: true,
        }),
      once: true,
      start: MOTION.reveal.start,
    });
  }

  document.querySelectorAll<HTMLElement>("[data-reveal='lines']").forEach(revealLines);
  document.querySelectorAll<HTMLElement>("[data-reveal='words']").forEach(revealWords);
  document.querySelectorAll<HTMLElement>("[data-reveal='clip']").forEach(revealClip);
}

/* ------------------------------------------------------------------ */
/*  Featured Work: pinned radius arc + content reveals                */
/* ------------------------------------------------------------------ */
function featuredRadius() {
  const width = window.innerWidth;
  const found = MOTION.featured.radius.find(({ max }) => width < max);
  return width * (found ? found.factor : MOTION.featured.radiusFallback);
}

function positionFeatured(progress = 0) {
  const items = document.querySelectorAll<HTMLElement>(".featured-item");
  const total = items.length;
  if (!total) return;
  const { theta, softener, shift } = MOTION.featured.arc;
  const offsetAngle = Math.PI / 2 - theta / 2;
  const radius = featuredRadius();
  const spacing = 1 + total / softener;
  const appliedShift = (progress * spacing - 1) * shift;
  items.forEach((element, index) => {
    const fraction = (total - 1 - index) / total + appliedShift;
    const angle = offsetAngle + theta * fraction;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    const rotation = (angle - Math.PI / 2) * (180 / Math.PI);
    gsap.set(element, { x, y: -y + radius, rotation: -rotation, transformOrigin: "center center" });
  });
}

function featuredGallery() {
  positionFeatured(0);
  const { desktopEnd, mobileEnd, contentEaseStart, charsDuration, charsStagger, charsEase, titleDuration, titleEase } = MOTION.featured;

  matchMedia.add("(min-width: 1024px)", () => {
    ScrollTrigger.create({
      trigger: ".featured-section",
      start: "top top",
      end: desktopEnd,
      pin: true,
      scrub: true,
      onUpdate: (self) => positionFeatured(self.progress),
    });
  });
  matchMedia.add("(max-width: 1024px)", () => {
    ScrollTrigger.create({
      trigger: ".featured-section",
      start: "top top",
      end: mobileEnd,
      pin: true,
      onUpdate: (self) => positionFeatured(self.progress),
    });
  });

  const easeStart = isMobileScreen() ? 2000 * contentEaseStart : 4000 * contentEaseStart;
  const split = new SplitType(".featured-content", { types: "lines,chars" });
  const chars = split.chars;
  gsap.set(".featured-content", { opacity: 0 });
  gsap.set(".featured-title", { opacity: 0, y: 100 });
  gsap.to(".featured-content", {
    scrollTrigger: {
      trigger: ".featured-container",
      start: `top+=${easeStart - 300} top`,
      end: "bottom bottom",
      scrub: true,
      immediateRender: false,
    },
    opacity: 1,
  });
  gsap.to(".featured-title", {
    scrollTrigger: {
      trigger: ".featured-content",
      start: "top 60%",
      end: "bottom top",
      scrub: true,
      immediateRender: false,
    },
    opacity: 1,
    y: 0,
    duration: titleDuration,
    ease: titleEase,
  });
  if (chars) {
    gsap
      .timeline()
      .to(chars as gsap.TweenTarget, {
        scrollTrigger: {
          trigger: ".featured-container",
          start: `top+=${easeStart} top`,
          end: "bottom 80%",
          scrub: true,
          immediateRender: false,
        },
        opacity: 1,
        color: "#000",
        ease: charsEase,
        stagger: charsStagger,
        duration: charsDuration,
      });
  }
  window.addEventListener("resize", () => positionFeatured(0));
}

/* ------------------------------------------------------------------ */
/*  Experience: 3D card stack (reference behaviour, plus a reveal)    */
/* ------------------------------------------------------------------ */
class CardStack {
  private content: HTMLElement;
  private cards: HTMLElement[];
  private timeline: gsap.core.Timeline | null = null;
  private timeout: number | undefined;

  constructor(private wrapElement: HTMLElement) {
    this.content = this.wrapElement.querySelector(".content") as HTMLElement;
    this.cards = Array.from(this.content.querySelectorAll<HTMLElement>(".anim-card"));
    this.scroll();
    window.addEventListener("resize", () => {
      window.clearTimeout(this.timeout);
      this.timeout = window.setTimeout(() => this.scroll(), 100);
    });
  }

  private scroll() {
    const { transform, zFromBase, zFromStep, zToBase, zToStep, rotationFrom, rotationToZ, rotationToY, stagger, start, end, scrub, pin } = MOTION.stack;
    const width = window.innerWidth;
    const total = this.cards.length;
    const section = this.wrapElement.closest("section") ?? undefined;
    this.content.style.transform = transform;
    this.content.style.opacity = "0";
    this.timeline?.kill();
    this.timeline = gsap
      .timeline({
        defaults: { ease: "power1" },
        scrollTrigger: {
          trigger: this.wrapElement,
          start,
          end,
          scrub,
          pin: pin ? section : false,
          onEnter: () => {
            gsap.set(this.content, { opacity: 1 });
            gsap.fromTo(
              this.cards,
              { x: 180, opacity: 0, scale: 0.7 },
              { x: 0, opacity: 1, scale: 1, duration: 0.7, ease: "power3.out", stagger: 0.04 },
            );
          },
          onEnterBack: () => gsap.set(this.content, { opacity: 1 }),
          onLeave: () => gsap.set(this.content, { opacity: 0 }),
          onLeaveBack: () => gsap.set(this.content, { opacity: 0 }),
        },
      })
      .fromTo(
        this.cards as never,
        { z: (index: number) => zFromBase * width - index * -zFromStep * width } as gsap.TweenVars,
        { z: (index: number) => zToBase * width + (total - index - 1) * zToStep * width } as gsap.TweenVars,
        0,
      )
      .fromTo(
        this.cards as never,
        { rotationZ: rotationFrom } as gsap.TweenVars,
        { rotationY: rotationToY, rotationZ: rotationToZ, stagger } as gsap.TweenVars,
        0,
      );
  }
}

function initCardStack() {
  document.querySelectorAll("[data-stack-1]").forEach((element) => {
    new CardStack(element as HTMLElement);
  });
}

/* ------------------------------------------------------------------ */
/*  Experience section — masked heading, per-entry timeline, hover     */
/* ------------------------------------------------------------------ */
function experienceSection(): () => void {
  const cfg = MOTION.experience;
  const listeners: Array<() => void> = [];

  const ctx = gsap.context(() => {
    const heading = document.querySelector<HTMLElement>("[data-reveal='exp-heading']");
    if (heading) {
      gsap.fromTo(
        heading,
        { yPercent: cfg.heading.yPercent },
        {
          yPercent: 0,
          duration: cfg.heading.duration,
          ease: cfg.heading.ease,
          scrollTrigger: { trigger: heading, start: cfg.start, once: true },
        },
      );
    }

    document.querySelectorAll<HTMLElement>("[data-reveal='exp-entry']").forEach((entry) => {
      const divider = entry.querySelector<HTMLElement>("[data-reveal='exp-divider']");
      const index = entry.querySelector<HTMLElement>("[data-reveal='exp-index']");
      const lines = entry.querySelectorAll<HTMLElement>("[data-reveal='exp-line']");
      const bullets = entry.querySelectorAll<HTMLElement>("[data-reveal='exp-bullet']");
      const metas = entry.querySelectorAll<HTMLElement>("[data-reveal='exp-meta'], [data-reveal='exp-stat']");

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: entry, start: cfg.start, toggleActions: cfg.toggleActions, once: true },
      });

      if (divider) {
        timeline.fromTo(
          divider,
          { scaleX: 0 },
          { scaleX: 1, duration: cfg.divider.duration, ease: cfg.divider.ease, transformOrigin: "left center" },
          0,
        );
      }
      if (index) {
        timeline.fromTo(
          index,
          { y: cfg.index.y, opacity: 0 },
          { y: 0, opacity: 1, duration: cfg.index.duration, ease: cfg.index.ease },
          0.1,
        );
      }
      if (lines.length) {
        timeline.fromTo(
          lines,
          { yPercent: 100 },
          { yPercent: 0, duration: cfg.line.duration, ease: cfg.line.ease, stagger: cfg.line.stagger },
          0.15,
        );
      }
      if (bullets.length) {
        timeline.fromTo(
          bullets,
          { y: cfg.bullets.y, opacity: 0 },
          { y: 0, opacity: 1, duration: cfg.bullets.duration, ease: cfg.bullets.ease, stagger: cfg.bullets.stagger },
          0.4,
        );
      }
      if (metas.length) {
        timeline.fromTo(
          metas,
          { opacity: 0 },
          { opacity: 1, duration: cfg.meta.duration, ease: cfg.meta.ease, stagger: cfg.meta.stagger },
          0.6,
        );
      }
    });

    if (isFinePointer()) {
      const accent = experienceAccent();
      const entries = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal='exp-entry']"));
      const { duration, ease, dim, shift, arrow } = cfg.hover;

      entries.forEach((entry) => {
        const title = entry.querySelector<HTMLElement>("[data-exp-title]");
        const index = entry.querySelector<HTMLElement>("[data-reveal='exp-index']");
        const arrowEl = entry.querySelector<HTMLElement>("[data-exp-arrow]");
        const baseColor = index ? getComputedStyle(index).color : "";

        const onEnter = () => {
          entry.classList.add("is-active");
          entries.forEach((other) => {
            if (other !== entry) gsap.to(other, { opacity: dim, duration, ease, overwrite: "auto" });
          });
          if (title) gsap.to(title, { x: shift, duration, ease, overwrite: "auto" });
          if (index) gsap.to(index, { color: accent, duration, ease, overwrite: "auto" });
          if (arrowEl) gsap.to(arrowEl, { x: arrow, duration, ease, overwrite: "auto" });
        };

        const onLeave = () => {
          entry.classList.remove("is-active");
          entries.forEach((other) => {
            if (other !== entry) gsap.to(other, { opacity: 1, duration, ease, overwrite: "auto" });
          });
          if (title) gsap.to(title, { x: 0, duration, ease, overwrite: "auto" });
          if (index && baseColor) gsap.to(index, { color: baseColor, duration, ease, overwrite: "auto" });
          if (arrowEl) gsap.to(arrowEl, { x: 0, duration, ease, overwrite: "auto" });
        };

        entry.addEventListener("mouseenter", onEnter);
        entry.addEventListener("mouseleave", onLeave);
        listeners.push(() => {
          entry.removeEventListener("mouseenter", onEnter);
          entry.removeEventListener("mouseleave", onLeave);
          entry.classList.remove("is-active");
        });
      });
    }

    return () => listeners.forEach((off) => off());
  });

  return () => ctx.revert();
}

/* Reduced-motion counterpart: plain opacity fades, no transforms. */
function experienceReduced(): () => void {
  const cfg = MOTION.experience;
  const ctx = gsap.context(() => {
    document.querySelectorAll<HTMLElement>("[data-reveal='exp-entry']").forEach((entry) => {
      gsap.fromTo(
        entry,
        { opacity: 0 },
        {
          opacity: 1,
          duration: cfg.reduced.duration,
          ease: cfg.reduced.ease,
          scrollTrigger: { trigger: entry, start: cfg.start, once: true },
        },
      );
    });
  });
  return () => ctx.revert();
}

/* ------------------------------------------------------------------ */
/*  Magnetic hover (desktop, pointers only)                           */
/* ------------------------------------------------------------------ */
function initMagnetic() {
  if (!isFinePointer()) return;
  const { max, outEase, outDuration, backEase, backDuration } = MOTION.magnetic;
  document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((element) => {
    const xTo = gsap.quickTo(element, "x", { duration: outDuration, ease: outEase });
    const yTo = gsap.quickTo(element, "y", { duration: outDuration, ease: outEase });
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const scale = Math.min(1, max / distance);
      xTo(dx * scale);
      yTo(dy * scale);
    });
    element.addEventListener("mouseleave", () => {
      gsap.to(element, { x: 0, y: 0, duration: backDuration, ease: backEase, overwrite: true });
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Animated underlines (desktop, pointers only)                     */
/* ------------------------------------------------------------------ */
function initUnderlines() {
  if (!isFinePointer()) return;
  const { duration } = MOTION.underline;
  document.querySelectorAll<HTMLElement>("[data-underline]").forEach((element) => {
    const line = document.createElement("span");
    line.setAttribute("aria-hidden", "true");
    line.classList.add("motion-underline");
    element.classList.add("has-motion-underline");
    element.appendChild(line);
    element.addEventListener("mouseenter", () => gsap.to(line, { scaleX: 1, duration, ease: MOTION.ease.out }));
    element.addEventListener("mouseleave", () => gsap.to(line, { scaleX: 0, duration, ease: MOTION.ease.out }));
  });
}

/* ------------------------------------------------------------------ */
/*  Subtle scrubbed parallax                                          */
/* ------------------------------------------------------------------ */
function parallax() {
  document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
    const mode = element.dataset.parallax;
    if (mode === "hero") {
      const { heroYPercent, heroOpacity } = MOTION.parallax;
      gsap.fromTo(
        element,
        { yPercent: 0, opacity: 1 },
        {
          yPercent: heroYPercent,
          opacity: heroOpacity,
          scrollTrigger: {
            trigger: ".banner-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      return;
    }
    gsap.fromTo(
      element,
      { yPercent: 0 },
      {
        yPercent: -8,
        scrollTrigger: {
          trigger: element.closest<HTMLElement>("[data-parallax-frame]") ?? element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

/* ------------------------------------------------------------------ */
/*  Curtain footer reveal                                              */
/*                                                                     */
/*  #site-footer is fixed behind #page. #page gets a bottom margin     */
/*  equal to the footer's measured height, so the document is exactly  */
/*  page + footer tall and the footer is uncovered as the page lifts.  */
/*  Falls back to a static footer only when reduced motion is on or the */
/*  footer is still taller than the viewport AFTER the compact mobile   */
/*  layout — never by screen width alone.                              */
/* ------------------------------------------------------------------ */
function footerCurtain(): () => void {
  const page = document.querySelector<HTMLElement>("#page");
  const footer = document.querySelector<HTMLElement>("#site-footer");
  const inner = footer?.querySelector<HTMLElement>("[data-footer-inner]") ?? null;
  if (!page || !footer || !inner) return () => {};

  const root = document.documentElement;
  let ctx: gsap.Context | null = null;
  let enabled = false;
  let restingHeight = 0;

  /* True while the message textarea is open (see Footer.astro + global.css). */
  const isMessageOpen = () => root.classList.contains("is-message-open");

  /* A little slack so a near-viewport-tall footer doesn't thrash on scroll.
     Width is deliberately not part of this test: the compact mobile layout
     (see global.css) is what makes phones fit. */
  const fits = (height: number) => height > 0 && height < window.innerHeight - 8;

  const enable = () => {
    root.classList.add("curtain");
    footer.inert = true;
    enabled = true;
    ctx = gsap.context(() => {
      /* The reveal's end coincides with the document's max scroll, so
         `isActive` flips back to false on the final pixel — exactly when the
         footer is fully revealed. Drive interactivity from progress instead,
         so the footer is never left inert at the bottom of the page. */
      const applyInert = (self: ScrollTrigger) => {
        footer.inert = self.progress <= 0.001;
      };
      const trigger = ScrollTrigger.create({
        trigger: page,
        start: MOTION.footer.start,
        end: () => `+=${restingHeight || footer.offsetHeight}`,
        scrub: true,
        animation: gsap.fromTo(
          inner,
          { yPercent: MOTION.footer.parallaxFrom },
          { yPercent: 0, ease: "none" },
        ),
        onUpdate: applyInert,
        onEnter: applyInert,
        onLeave: applyInert,
        onEnterBack: applyInert,
        onLeaveBack: applyInert,
      });
      footer.inert = trigger.progress <= 0.001;
    }, footer);
  };

  const disable = () => {
    enabled = false;
    root.classList.remove("curtain");
    root.style.removeProperty("--footer-h");
    footer.inert = false;
    ctx?.revert();
    ctx = null;
    gsap.set(inner, { clearProps: "transform" });
  };

  const sync = () => {
    const height = footer.offsetHeight;
    /* While the message textarea is open the footer is allowed to exceed the
       viewport (it scrolls internally — see global.css). Anchor the curtain to
       the footer's resting height so opening it never flips to the static
       fallback or shifts #page's bottom margin. */
    if (!isMessageOpen() || restingHeight === 0) restingHeight = height;
    root.style.setProperty("--footer-h", `${restingHeight}px`);
    if (fits(restingHeight)) {
      if (!enabled) enable();
    } else if (enabled) {
      disable();
    }
  };

  const ro = new ResizeObserver(() => {
    sync();
    ScrollTrigger.refresh();
  });
  ro.observe(footer);

  const onResize = () => {
    sync();
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.visualViewport?.addEventListener("resize", onResize);

  sync();
  document.fonts?.ready.then(() => {
    sync();
    ScrollTrigger.refresh();
  });

  return () => {
    ro.disconnect();
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    window.visualViewport?.removeEventListener("resize", onResize);
    disable();
  };
}

/* ------------------------------------------------------------------ */
/*  Boot                                                               */
/* ------------------------------------------------------------------ */
let lenisInstance: Lenis | null = null;
let sectionCleanups: Array<() => void> = [];
const matchMedia = gsap.matchMedia();

/** Exposed so footer controls (back-to-top) reuse the active smooth scroller. */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

function bootAfterLoad() {
  window.setTimeout(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    gsap.to(window, { duration: 0, scrollTo: 0 });
    window.setTimeout(
      () => {
        pageReveals();
        featuredGallery();
        initCardStack();
        sectionCleanups.push(experienceSection());
        sectionCleanups.push(footerCurtain());
        initMagnetic();
        initUnderlines();
        parallax();
      },
      MOTION.boot.engineDelay,
    );
  }, MOTION.boot.scrollToTopDelay);
}

export function initMotion(): () => void {
  if (typeof window === "undefined") return () => {};

  if (prefersReducedMotion()) {
    document.querySelector(".loader")?.remove();
    const reducedCleanup = experienceReduced();
    return () => reducedCleanup();
  }

  document.documentElement.classList.add("js");
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const onLoad = () => {
    ScrollTrigger.refresh();
    bootAfterLoad();
  };

  const ctx = gsap.context(() => {
    lenisInstance = initSmoothScroll();
    animateLoader();
    heroIntro();
    stackedCardsToAbout();
    pinAbout();
    window.addEventListener("load", onLoad);
  });

  const cleanup = () => {
    window.removeEventListener("load", onLoad);
    sectionCleanups.forEach((off) => off());
    sectionCleanups = [];
    lenisInstance?.destroy();
    lenisInstance = null;
    matchMedia.revert();
    ctx.revert();
  };
  window.addEventListener("beforeunload", cleanup, { once: true });
  return cleanup;
}

export default MOTION;