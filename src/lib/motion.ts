import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ExpoScaleEase } from "gsap/EasePack";
import SplitType from "split-type";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin, ExpoScaleEase);
gsap.config({ force3D: true });

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
    start: "top center",
    end: "+=210%",
    scrub: 1,
  },

  /* Experience entries */
  experience: {
    entryStart: "top 82%",
    entryDuration: 0.9,
    entryEase: "power3.out",
    indexDuration: 0.6,
    indexDelay: 0.15,
    indexEase: "power2.out",
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
} as const;

/* ------------------------------------------------------------------ */
/*  Small shared helpers                                               */
/* ------------------------------------------------------------------ */
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const isMobileScreen = () => window.innerWidth <= 1023;

/* ------------------------------------------------------------------ */
/*  Smooth scroll (Lenis ↔ GSAP)                                       */
/* ------------------------------------------------------------------ */
function initSmoothScroll(): Lenis | null {
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
/*  Experience: 3D card stack                                         */
/* ------------------------------------------------------------------ */
class CardStack {
  private content: HTMLElement;
  private images: HTMLElement[];
  private imagesTotal = 0;
  private timeline: gsap.core.Timeline | null = null;

  constructor(private wrapElement: HTMLElement) {
    this.content = this.wrapElement.querySelector(".content") as HTMLElement;
    this.images = Array.from(this.content.querySelectorAll(".anim-card")) as HTMLElement[];
    this.imagesTotal = this.images.length;
    this.setup();
  }

  private setup() {
    this.scroll();
    let resizeTimer: number | undefined;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => this.scroll(), 100);
    });
  }

  private scroll() {
    const { transform, zFromBase, zFromStep, zToBase, zToStep, rotationFrom, rotationToZ, rotationToY, stagger, start, end, scrub } = MOTION.stack;
    const width = window.innerWidth;
    this.content.style.transform = transform;
    this.content.style.opacity = "0";
    this.timeline?.kill();
    const images = this.images;
    const imagesTotal = this.imagesTotal;
    this.timeline = gsap
      .timeline({
        defaults: { ease: "power1" },
        scrollTrigger: {
          trigger: this.wrapElement,
          start,
          end,
          scrub,
          onEnter: () => gsap.set(this.content, { opacity: 1 }),
          onEnterBack: () => gsap.set(this.content, { opacity: 1 }),
          onLeave: () => gsap.set(this.content, { opacity: 0 }),
          onLeaveBack: () => gsap.set(this.content, { opacity: 0 }),
        },
      })
      .fromTo(
        images as never,
        { z: (index: number) => zFromBase * width - index * -zFromStep * width } as gsap.TweenVars,
        { z: (index: number) => zToBase * width + (imagesTotal - index - 1) * zToStep * width } as gsap.TweenVars,
        0,
      )
      .fromTo(
        images as never,
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
/*  Experience entries                                                 */
/* ------------------------------------------------------------------ */
function experienceEntries() {
  const { entryStart, entryDuration, entryEase, indexDuration, indexDelay, indexEase } = MOTION.experience;
  document.querySelectorAll(".exp-entry").forEach((entry) => {
    const indexElement = entry.querySelector(".exp-index");
    gsap.to(entry, {
      scrollTrigger: { trigger: entry, start: entryStart, toggleActions: MOTION.reveal.toggleActions },
      opacity: 1,
      y: 0,
      duration: entryDuration,
      ease: entryEase,
    });
    if (indexElement) {
      gsap.to(indexElement, {
        scrollTrigger: { trigger: entry, start: entryStart, toggleActions: MOTION.reveal.toggleActions },
        opacity: 1,
        x: 0,
        duration: indexDuration,
        delay: indexDelay,
        ease: indexEase,
      });
    }
  });
  gsap.set(".exp-entry", { opacity: 0, y: 50 });
  gsap.set(".exp-index", { opacity: 0, x: -16 });
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
/*  Boot                                                               */
/* ------------------------------------------------------------------ */
let lenisInstance: Lenis | null = null;
const matchMedia = gsap.matchMedia();

function bootAfterLoad() {
  window.setTimeout(() => {
    lenisInstance?.scrollTo(0, { immediate: true });
    gsap.to(window, { duration: 0, scrollTo: 0 });
    window.setTimeout(
      () => {
        pageReveals();
        featuredGallery();
        experienceEntries();
        initCardStack();
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
    return () => {};
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
    lenisInstance?.destroy();
    lenisInstance = null;
    matchMedia.revert();
    ctx.revert();
  };
  window.addEventListener("beforeunload", cleanup, { once: true });
  return cleanup;
}

export default MOTION;