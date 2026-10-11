import gsap from "gsap";
import { MOTION, getLenis } from "./motion";

/**
 * Footer micro-interactions, kept out of Footer.astro so the markup stays thin
 * and every effect shares the same MOTION tokens and gsap.context() lifecycle.
 *
 *   initRollLinks()          — text-roll contact links
 *   createSendButton()       — morphing send button (states A–E)
 *   initScrollProgressTop()  — scroll-progress back-to-top ring
 *
 * None of this touches the curtain reveal, the photo flashlight/tilt, or the
 * contact endpoint; it only reads the current scroll position and the form
 * markup that is already there.
 */

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ------------------------------------------------------------------ */
/*  1. Text-roll links                                                 */
/* ------------------------------------------------------------------ */
/**
 * Rolls each letter up by exactly one line on hover / keyboard focus and
 * reverses smoothly if the pointer leaves mid-roll. No-ops honours
 * prefers-reduced-motion (letters stay put) and skips hover on touch.
 */
export function initRollLinks(scope: ParentNode = document): () => void {
  const links = Array.from(scope.querySelectorAll<HTMLElement>("[data-roll]"));
  if (!links.length) return () => {};

  const reduce = prefersReducedMotion();
  const fine = isFinePointer();
  const cleanups: Array<() => void> = [];

  const ctx = gsap.context(() => {
    links.forEach((link) => {
      const tracks = Array.from(link.querySelectorAll<HTMLElement>(".roll-track"));
      if (!tracks.length) return;

      const { duration, ease, stagger } = MOTION.footer.roll;
      const timeline = gsap.timeline({ paused: true });
      timeline.to(tracks, { yPercent: -100, duration, ease, stagger });

      const play = () => timeline.play();
      const reverse = () => timeline.reverse();

      if (reduce) return;

      if (fine) {
        link.addEventListener("pointerenter", play);
        link.addEventListener("pointerleave", reverse);
      }
      link.addEventListener("focus", play);
      link.addEventListener("blur", reverse);

      cleanups.push(() => {
        if (fine) {
          link.removeEventListener("pointerenter", play);
          link.removeEventListener("pointerleave", reverse);
        }
        link.removeEventListener("focus", play);
        link.removeEventListener("blur", reverse);
      });
    });
  });

  return () => {
    cleanups.forEach((off) => off());
    ctx.revert();
  };
}

/* ------------------------------------------------------------------ */
/*  2. Morphing action button                                          */
/*                                                                     */
/*  One circular button serves the whole flow. The state machine lives  */
/*  in the consumer (Footer.astro); this controller only owns the GSAP  */
/*  side: the arrow ⇄ plane morph, the ready pulse, the sending spinner, */
/*  the success flight and the error shake. Every method is idempotent  */
/*  (tweens are killed before a new one starts, so rapid input can't    */
/*  stack transforms).                                                  */
/* ------------------------------------------------------------------ */
type IconName = "arrow" | "plane";

export interface SendButtonApi {
  /** Morph the icon (arrow ⇄ plane). `animate: false` swaps instantly. */
  setIcon: (name: IconName, animate?: boolean) => void;
  /** Ready pulse (scale 1 → 1.08 → 1). */
  pulse: () => void;
  /** Busy: hide the icons and show the spinner (sending), or restore. */
  setBusy: (busy: boolean) => void;
  /** Success: the airplane flies off to the top-right. Resolves when done. */
  flyOut: () => Promise<void>;
  /** Error: the current icon oscillates on x. Resolves when done. */
  shake: () => Promise<void>;
  /** Update the aria-label to match the current state. */
  setLabel: (label: string) => void;
  /** Kill tweens/listeners created by this controller. */
  revert: () => void;
}

export function createSendButton(button: HTMLButtonElement): SendButtonApi | null {
  const arrow = button.querySelector<SVGElement>('[data-icon="arrow"]');
  const plane = button.querySelector<SVGElement>('[data-icon="plane"]');
  const spinner = button.querySelector<HTMLElement>("[data-send-spinner]");
  if (!arrow || !plane) return null;

  const reduce = prefersReducedMotion();
  const { morph } = MOTION.footer.send;

  let current: IconName = "arrow";

  const showImmediate = (name: IconName) => {
    current = name;
    const isArrow = name === "arrow";
    gsap.set(arrow, { opacity: isArrow ? 1 : 0, rotation: isArrow ? 0 : morph.rotate, x: 0 });
    gsap.set(plane, { opacity: isArrow ? 0 : 1, rotation: 0, x: 0 });
  };

  const ctx = gsap.context(() => showImmediate("arrow"), button);

  /* Arrow ⇄ plane morph. Kill any in-flight morph first (idempotent). */
  const setIcon = (name: IconName, animate = true) => {
    if (name === current) return;
    current = name;
    gsap.killTweensOf([arrow, plane]);
    if (reduce || !animate) {
      showImmediate(name);
      return;
    }
    const toPlane = name === "plane";
    gsap.to(toPlane ? arrow : plane, {
      opacity: 0,
      rotation: toPlane ? morph.rotate : 0,
      duration: morph.duration,
      ease: morph.ease,
      transformOrigin: "center",
    });
    gsap.fromTo(
      toPlane ? plane : arrow,
      { opacity: 0 },
      { opacity: 1, rotation: 0, duration: morph.duration, ease: morph.ease, transformOrigin: "center" },
    );
  };

  const pulse = () => {
    if (reduce) return;
    const { scale, duration } = MOTION.footer.send.pulse;
    gsap.killTweensOf(button);
    gsap.fromTo(
      button,
      { scale: 1 },
      { scale, duration, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "center" },
    );
  };

  const setBusy = (busy: boolean) => {
    gsap.killTweensOf([arrow, plane]);
    if (spinner) gsap.killTweensOf(spinner);
    if (busy) {
      if (spinner) spinner.hidden = false;
      gsap.to([arrow, plane], { opacity: 0, duration: 0.2, ease: "power2.out" });
      if (spinner && !reduce) {
        gsap.set(spinner, { rotation: 0 });
        gsap.to(spinner, { rotation: 360, duration: 0.8, repeat: -1, ease: "none" });
      }
    } else {
      if (spinner) {
        spinner.hidden = true;
        gsap.set(spinner, { rotation: 0 });
      }
      showImmediate(current);
    }
  };

  const flyOut = () =>
    new Promise<void>((resolve) => {
      if (reduce) {
        gsap.set([arrow, plane], { opacity: 0 });
        resolve();
        return;
      }
      const { x, y, scale, duration, ease } = MOTION.footer.send.flight;
      gsap.killTweensOf(plane);
      gsap.set(plane, { opacity: 1, rotation: 0, x: 0 });
      gsap.set(arrow, { opacity: 0 });
      current = "plane";
      gsap.to(plane, {
        xPercent: x,
        yPercent: y,
        scale,
        opacity: 0,
        duration,
        ease,
        onComplete: resolve,
      });
    });

  const shake = () =>
    new Promise<void>((resolve) => {
      if (reduce) {
        resolve();
        return;
      }
      const target = current === "plane" ? plane : arrow;
      const { amplitude, duration, ease } = MOTION.footer.send.shake;
      const step = duration / 4;
      gsap.killTweensOf(target);
      gsap
        .timeline({ onComplete: resolve })
        .to(target, { x: amplitude, duration: step, ease })
        .to(target, { x: -amplitude, duration: step, ease })
        .to(target, { x: amplitude * 0.6, duration: step, ease })
        .to(target, { x: 0, duration: step, ease });
    });

  return {
    setIcon,
    pulse,
    setBusy,
    flyOut,
    shake,
    setLabel: (label) => button.setAttribute("aria-label", label),
    revert: () => {
      gsap.killTweensOf([arrow, plane, button]);
      if (spinner) gsap.killTweensOf(spinner);
      ctx.revert();
    },
  };
}

/* ------------------------------------------------------------------ */
/*  3. Scroll-progress back-to-top                                     */
/* ------------------------------------------------------------------ */
/**
 * The ring's dashoffset is driven by a ScrollTrigger over the whole document
 * (start: 0, end: "max"). Because #page carries a bottom margin equal to the
 * footer height, the document is exactly page + footer tall, so progress hits
 * 1 at the same instant the curtain finishes opening.
 */
export function initScrollProgressTop(): () => void {
  const button = document.querySelector<HTMLButtonElement>("[data-scroll-top]");
  const ring = button?.querySelector<SVGCircleElement>("[data-progress-ring]");
  if (!button || !ring) return () => {};

  const reduce = prefersReducedMotion();
  const { pressScale, pressDuration, pressEase, scrollDuration } = MOTION.footer.progress;

  const ctx = gsap.context(() => {
    /* pathLength="1" on the circle normalises the circumference to 1, so the
       dashoffset is simply 1 - progress. Scrub keeps it easing-free. */
    gsap.fromTo(
      ring,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: true, invalidateOnRefresh: true },
      },
    );
  }, button);

  const onPress = () => {
    if (!reduce) {
      gsap
        .timeline()
        .to(button, { scale: pressScale, duration: pressDuration, ease: pressEase })
        .to(button, { scale: 1, duration: pressDuration, ease: pressEase });
    }
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: reduce ? 0 : scrollDuration });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  button.addEventListener("click", onPress);

  return () => {
    button.removeEventListener("click", onPress);
    ctx.revert();
  };
}
