import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ExpoScaleEase } from "gsap/EasePack";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger, Flip, ScrollToPlugin, ExpoScaleEase);
gsap.config({ force3D: true });

const matchMedia = gsap.matchMedia();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isMobileScreen = () => window.innerWidth <= 1023;

/* Global resolver shared by official mode and Flip representations */
function ktArc({
  index,
  totalItems,
  containerWidth,
  arcHeight,
  tiltAdjust = 0,
}: {
  index: number;
  totalItems: number;
  containerWidth: number;
  arcHeight: number;
  tiltAdjust?: number;
}) {
  const step = containerWidth / totalItems;
  const offset = (totalItems - 1) / 2;
  const x = (index - offset) * step;
  const curve = arcHeight * Math.sin((Math.PI / (totalItems - 1)) * index);
  const tiltAngle = (index - (totalItems - 1) / 2) * 7 + tiltAdjust;
  const irregularities = [0, 0, 0, 4, -8, -12];
  const topPosition = arcHeight - curve + (irregularities[index] ?? 0);
  return { x, tiltAngle, topPosition };
}

/* ---------- Loader ---------- */
function animateLoader() {
  const panels = document.querySelectorAll(".loader-panel");
  const progress = document.querySelector(".progress") as HTMLElement | null;
  gsap.to(panels, { delay: 1, duration: 0.8, height: 0, ease: "expoScale(0.5,7,none)" });
  if (!progress) return;
  const counter = { value: 0 };
  gsap.to(counter, {
    value: 100,
    duration: 3,
    ease: "power3.inOut",
    onUpdate: () => {
      const shown = Math.max(10, Math.round(counter.value / 10) * 10);
      progress.textContent = String(shown);
    },
    onComplete: () => {
      gsap.to(progress, { opacity: 0, duration: 1, onComplete: () => progress.remove() });
    },
  });
}

/* ---------- Hero ---------- */
function animateHeroWords() {
  new SplitType(".banner", { types: "words" });
  new SplitType(".sub-title", { types: "words" });
  gsap.from(["h1 div .word"], {
    yPercent: 110,
    delay: 1,
    duration: 1.5,
    ease: "power2.out",
    stagger: 0.3,
    opacity: 0,
  });
  gsap.from([".sub-title div .word"], {
    yPercent: 110,
    delay: 1.5,
    skewY: 7,
    duration: 0.8,
    ease: "power4.out",
    stagger: 0.3,
    opacity: 0,
  });
}

/* ---------- Hero stacked cards → about Flip ---------- */
function animateStackedCards() {
  const container = document.querySelector(".stacked-cards");
  const items = document.querySelectorAll(".item");
  if (!container || !items.length) return;
  const total = items.length;
  const containerWidth = isMobileScreen() ? 600 : 850;

  items.forEach((element, index) => {
    const elementRef = element as HTMLElement;
    const arc = ktArc({ index, totalItems: total, containerWidth, arcHeight: 75 });

    const timeline = gsap.timeline();
    gsap.set(elementRef, { x: 0, y: 300, rotation: -45, scale: 1.1, opacity: 0 });
    timeline
      .to(elementRef, { delay: 1.5, opacity: 1, duration: 1, y: 0, ease: "elastic.out(1, 0.7)" })
      .to(elementRef, { duration: 0.8, rotation: 3, ease: "elastic.out(1, 0.7)" }, "<5%")
      .to(elementRef, { duration: 0.4, scale: 1, ease: "expo.out" }, "<50%")
      .to(elementRef, { duration: 0.4, rotation: arc.tiltAngle, ease: "power1.out" }, "<50%")
      .to(elementRef, { duration: 0.8, x: arc.x, top: `${arc.topPosition}px`, ease: "elastic.out(1, 0.7)" }, "<0%")
      .call(() => {
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
          })
          .add(Flip.from(flipState, { duration: 0.8, ease: "power2.inOut" }));
        gsap.to(elementRef, {
          scrollTrigger: { trigger: ".about-section", start: "top 80%", end: "bottom 100%", scrub: true, immediateRender: false },
          x: 0,
          rotation: 0,
          top: 0,
        });
        gsap.to(".text-highlight", {
          scrollTrigger: { trigger: ".about-section", start: "top 1%", end: "+=400", scrub: true, immediateRender: false },
          stagger: 1,
          color: "#990900",
        });
        matchMedia.add("(min-width: 1024px)", () => {
          gsap.to(elementRef, {
            scrollTrigger: { trigger: ".about-section", start: "top 1%", end: "+=800", scrub: true, immediateRender: false },
            x: index * 150,
            scale: 1.3,
            top: index * 50,
            duration: 2.5,
            ease: "expoScale(0.5,7,none)",
          });
        });
        matchMedia.add("(max-width: 1024px)", () => {
          gsap.to(elementRef, {
            scrollTrigger: { trigger: ".about-section", start: "top 1%", end: "+=400", scrub: true, immediateRender: false },
            x: arc.x,
            scale: 1.1,
            top: index * 5,
            duration: 2.5,
            ease: "expoScale(0.5,7,none)",
          });
        });
      });
  });
}

/* ---------- About pin ---------- */
function pinAbout() {
  matchMedia.add("(min-width: 1024px)", () => {
    gsap.to(".about-section", {
      scrollTrigger: { scrub: true, snap: 0.33, pin: ".about-section", end: "+=1000", pinSpacing: true },
    });
  });
  matchMedia.add("(max-width: 1024px)", () => {
    gsap.to(".about-section", {
      scrollTrigger: { scrub: 0.1, snap: 0.33, pin: ".about-section", end: "+=400", pinSpacing: true },
    });
  });
}

/* ---------- Scroll reveal batches ---------- */
function fadeUp(selector: string, vars: gsap.TweenVars = {}, opts: { start?: string } = {}) {
  gsap.set(selector, { y: 50, opacity: 0 });
  ScrollTrigger.batch(selector, {
    onEnter: (targets) =>
      gsap.to(targets, {
        force3D: true,
        duration: 1,
        autoAlpha: 1,
        y: 0,
        opacity: 1,
        stagger: 0.15,
        overwrite: true,
        ...vars,
      }),
    once: true,
    start: opts.start ?? (isMobileScreen() ? "top 90%" : "top 85%"),
  });
}

function fadeInBlur(selector: string, vars: gsap.TweenVars = {}, opts: { start?: string } = {}) {
  gsap.set(selector, { y: 0, opacity: 0, filter: "blur(10px)" });
  ScrollTrigger.batch(selector, {
    onEnter: (targets) =>
      gsap.to(targets, {
        duration: 1,
        autoAlpha: 1,
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.1,
        overwrite: true,
        ...vars,
      }),
    once: true,
    start: opts.start ?? (isMobileScreen() ? "top 90%" : "top 85%"),
  });
}

/* ---------- About title line reveal ---------- */
function animateAboutLines() {
  const targets = document.querySelectorAll(".line-fade");
  if (!targets.length) return;
  const split = new SplitType(".line-fade", { types: "lines" });
  const lines = (split.lines as HTMLElement[] | null) ?? [];
  lines.forEach((line) => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("overflow-hidden");
    line.parentNode?.appendChild(wrapper);
    wrapper.appendChild(line);
  });
  gsap.set(".line", { opacity: 0 });
  gsap.set(".fade-up", { opacity: 0, y: 50 });
  ScrollTrigger.create({
    trigger: ".about-section",
    start: "top 30%",
    end: "bottom 70%",
    scrub: true,
    immediateRender: false,
    once: true,
    onEnter: () => {
      gsap.killTweensOf(lines as never);
      gsap
        .timeline({ defaults: { duration: 2.2, ease: "expo" } })
        .set(lines as never, { y: "150%", rotate: 0, opacity: 0 })
        .to(lines as never, { y: "0%", rotate: 0, stagger: 0.04, opacity: 1 });
    },
  });
}

/* ---------- Featured work: pinned arc + content reveal ---------- */
function heroFactor() {
  const width = window.innerWidth;
  const table = [
    { max: 600, factor: 7 },
    { max: 768, factor: 5.5 },
    { max: 992, factor: 3 },
    { max: 1024, factor: 3.5 },
  ];
  const found = table.find((entry) => width < entry.max);
  return width * (found ? found.factor : 3);
}

function positionFeaturedItems(progress = 0) {
  const items = document.querySelectorAll(".featured-item");
  const total = items.length;
  if (!total) return;
  const theta = Math.PI / 2.2;
  const offset = Math.PI / 2 - theta / 2;
  const radius = heroFactor();
  const spacing = 1 + total / 5.5;
  const shift = (progress * spacing - 1) * 0.75;
  items.forEach((element, index) => {
    const fraction = (total - 1 - index) / total + shift;
    const angle = offset + theta * fraction;
    const x = Math.cos(angle) * radius;
    const yPos = Math.sin(angle) * radius;
    const rotation = (angle - Math.PI / 2) * (180 / Math.PI);
    gsap.set(element, { x, y: -yPos + radius, rotation: -rotation, transformOrigin: "center center" });
  });
}

function animateFeatured() {
  positionFeaturedItems(0);
  matchMedia.add("(min-width: 1024px)", () => {
    ScrollTrigger.create({
      trigger: ".featured-section",
      start: "top top",
      end: "+=5000px",
      pin: true,
      scrub: true,
      onUpdate: (self) => positionFeaturedItems(self.progress),
    });
  });
  matchMedia.add("(max-width: 1024px)", () => {
    ScrollTrigger.create({
      trigger: ".featured-section",
      start: "top top",
      end: "+=3000px",
      pin: true,
      onUpdate: (self) => positionFeaturedItems(self.progress),
    });
  });
  const easeStart = isMobileScreen() ? 2000 * 0.85 : 4000 * 0.85;
  window.addEventListener("resize", () => positionFeaturedItems(0));
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
    duration: 0.4,
    ease: "power2.out",
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
        ease: "power4.out",
        stagger: 0.04,
        duration: 1.2,
      });
  }
}

/* ---------- Experience: 3D card stack ---------- */
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
    const width = window.innerWidth;
    this.content.style.transform =
      "rotate3d(1, 0, 0, -25deg) rotate3d(0, 1, 0, 50deg) rotate3d(0, 0, 1, 25deg)";
    this.content.style.opacity = "0";
    this.timeline?.kill();
    const images = this.images;
    const imagesTotal = this.imagesTotal;
    const viewportSize = width;
    this.timeline = gsap.timeline({
      defaults: { ease: "power1" },
      scrollTrigger: {
        trigger: this.wrapElement,
        start: "top center",
        end: "+=210%",
        scrub: 1,
        onEnter: () => gsap.set(this.content, { opacity: 1 }),
        onEnterBack: () => gsap.set(this.content, { opacity: 1 }),
        onLeave: () => gsap.set(this.content, { opacity: 0 }),
        onLeaveBack: () => gsap.set(this.content, { opacity: 0 }),
      },
    });
    this.timeline
      .fromTo(
        images as never,
        {
          z: (index: number) => -2.25 * viewportSize - index * 0.03 * viewportSize,
        } as gsap.TweenVars,
        {
          z: (index: number) => 1.8 * viewportSize + (imagesTotal - index - 1) * 0.03 * viewportSize,
        } as gsap.TweenVars,
        0,
      )
      .fromTo(
        images as never,
        { rotationZ: -220 } as gsap.TweenVars,
        { rotationY: -30, rotationZ: 120, stagger: 0.005 } as gsap.TweenVars,
        0,
      );
  }
}

/* ---------- Experience entries ---------- */
function animateExperienceEntries() {
  document.querySelectorAll(".exp-entry").forEach((entry) => {
    const indexElement = entry.querySelector(".exp-index");
    gsap.to(entry, {
      scrollTrigger: { trigger: entry, start: "top 82%", toggleActions: "play none none none" },
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power3.out",
    });
    if (indexElement) {
      gsap.to(indexElement, {
        scrollTrigger: { trigger: entry, start: "top 82%", toggleActions: "play none none none" },
        opacity: 1,
        x: 0,
        duration: 0.6,
        delay: 0.15,
        ease: "power2.out",
      });
    }
  });
  gsap.set(".exp-entry", { opacity: 0, y: 50 });
  gsap.set(".exp-index", { opacity: 0, x: -16 });
}

/* ---------- Boot after window load ---------- */
function bootPage() {
  window.setTimeout(() => {
    gsap.to(window, { duration: 0, scrollTo: 0 });
    window.setTimeout(() => {
      fadeUp(".fade-up", { duration: 0.4, stagger: 0.04 }, { start: "top 70%" });
      fadeInBlur(".fade-in", { duration: 0.4, stagger: 0.04 }, { start: "top 70%" });
      animateAboutLines();
      animateFeatured();
      animateExperienceEntries();
      document.querySelectorAll("[data-stack-1]").forEach((element) => {
        new CardStack(element as HTMLElement);
      });
    }, 200);
  }, 50);
}

if (!reducedMotion) {
  if (typeof history !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  animateLoader();
  animateHeroWords();
  animateStackedCards();
  pinAbout();
  window.addEventListener("load", bootPage);
} else {
  document.querySelector(".loader")?.remove();
}

export {};