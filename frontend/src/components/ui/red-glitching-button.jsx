import * as React from "react";

const LOOKALIKE = {
  a: "eo", b: "hd", c: "eo", d: "bh", e: "ca", f: "tr", g: "qy",
  h: "bn", i: "lj", j: "il", k: "hx", l: "il", m: "nw", n: "mh",
  o: "ce", p: "qb", q: "pg", r: "nf", s: "z5", t: "fl", u: "vn",
  v: "uy", w: "vm", x: "kz", y: "vg", z: "sx",
};
const SCRAMBLE_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";
function swap(ch) {
  if (!/[A-Za-z]/.test(ch)) return ch;
  const near = LOOKALIKE[ch.toLowerCase()];
  if (near) return near[Math.floor(Math.random() * near.length)];
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

const IDLE = {
  duration: 1800, sliceCount: 7, velocity: 15,
  minHeight: 0.02, maxHeight: 0.18, maxOffset: 20,
  shakeAmplitude: 0.13, spanStart: 0.5, spanEnd: 0.84,
  scrambleRate: 0.06, scrambleInterval: 50, peakAt: 0.3,
  rogueMultiplier: 3, cornerJitter: 4, driftPx: 0.5,
};
const ACTIVE = {
  duration: 340, sliceCount: 10, velocity: 18,
  minHeight: 0.02, maxHeight: 0.2, maxOffset: 38,
  shakeAmplitude: 0.26, spanStart: 0.22, spanEnd: 0.9,
  scrambleRate: 0.14, scrambleInterval: 45, peakAt: 0.3,
  rogueMultiplier: 3.5, cornerJitter: 6, driftPx: 0.5,
};

const REST_SHADOW = [
  "inset 0 1px 0 -0.5px rgba(255,255,255,0.45)",
  "inset 0 -1px 0 -0.5px rgba(60,2,12,0.5)",
  "inset 0 0 0 1px rgba(80,2,18,0.18)",
  "0 1px 2px rgba(60,2,12,0.35)",
  "0 4px 10px -4px rgba(60,2,12,0.45)",
].join(", ");
const DROP_EVERY = 8;
const DROP_JITTER = 5;
const SHADOW_LAG = 7;
const OVERSHOOT_SPAN = 0.14;
const OVERSHOOT_PEAK = 0.22;

const BADGE_CSS = `
  .rgw-badge {
    display: block;
    border-radius: 8px;
    background:
      linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0) 40%),
      linear-gradient(160deg, #FF3B47, #7A0218);
    box-shadow:
      inset 0 1px 0 -0.5px rgba(255,255,255,0.45),
      inset 0 -1px 0 -0.5px rgba(60,2,12,0.5),
      inset 0 0 0 1px rgba(80,2,18,0.18),
      0 1px 2px rgba(60,2,12,0.35),
      0 4px 10px -4px rgba(60,2,12,0.45);
    animation: rgw-hue 6.5s ease-in-out infinite;
  }
  @keyframes rgw-hue {
    0%, 100% { background:
      linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0) 40%),
      linear-gradient(160deg, #FF3B47, #7A0218); }
    50% { background:
      linear-gradient(to bottom, rgba(255,255,255,0.16), rgba(255,255,255,0) 40%),
      linear-gradient(160deg, #D2042D, #5C000F); }
  }
`;

function envelope(o, t) {
  if (t < o.spanStart) return 0;
  const span = o.spanEnd - o.spanStart;
  if (t > o.spanEnd) {
    const tail = (t - o.spanEnd) / (span * OVERSHOOT_SPAN);
    return tail < 1 ? -OVERSHOOT_PEAK * (1 - tail) : 0;
  }
  const peak = o.spanStart + span * o.peakAt;
  return t < peak
    ? (t - o.spanStart) / (peak - o.spanStart)
    : (o.spanEnd - t) / (o.spanEnd - peak);
}
function jolt(o, t) { return (Math.random() - 0.5) * 2 * envelope(o, t); }
function band(o) {
  const range = o.maxHeight - o.minHeight;
  const heightRatio = Math.random();
  const h = o.minHeight + heightRatio * range;
  const y = Math.random() * (1 - h);
  const top = (y * 100).toFixed(2);
  const bot = ((y + h) * 100).toFixed(2);
  return {
    path: `polygon(0% ${top}%, 100% ${top}%, 100% ${bot}%, 0% ${bot}%)`,
    heightRatio,
  };
}
function sliceFrames(o, index, rogue) {
  const steps = Math.max(1, Math.floor((o.velocity * o.duration) / 1000) + 1);
  const threshold = ((index + 1) / (o.sliceCount + 1)) * 0.9;
  const push = index === rogue ? o.maxOffset * o.rogueMultiplier : o.maxOffset;
  const out = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const e = envelope(o, t);
    if (Math.abs(e) < threshold) {
      const flicker = index === 0 && Math.random() < 0.035;
      if (!flicker) {
        out.push({ opacity: "0", transform: "none", clipPath: "unset" });
        continue;
      }
      const b = band(o);
      out.push({
        opacity: "1",
        transform: `translate3d(${((Math.random() - 0.5) * o.maxOffset * 0.3).toFixed(2)}%,0,0)`,
        clipPath: b.path,
      });
      continue;
    }
    const b = band(o);
    const scale = 0.35 + b.heightRatio * 0.65;
    out.push({
      opacity: "1",
      transform: `translate3d(${(jolt(o, t) * push * scale).toFixed(2)}%,0,0)`,
      clipPath: b.path,
    });
  }
  return out;
}
function dropFrames(o) {
  const steps = Math.max(1, Math.floor((o.velocity * o.duration) / 1000) + 1);
  const peakStep = Math.round(steps * (o.spanStart + (o.spanEnd - o.spanStart) * o.peakAt));
  const out = [];
  for (let i = 0; i < steps; i++) {
    out.push({ opacity: i === peakStep ? "0" : "1" });
  }
  return out;
}
function badgeFrames(o, radius) {
  const steps = Math.max(1, Math.floor((o.velocity * o.duration) / 1000) + 1);
  const out = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const e = envelope(o, t);
    if (e === 0) {
      out.push({ borderRadius: `${radius}px`, boxShadow: REST_SHADOW });
      continue;
    }
    const r = Math.max(0, radius + jolt(o, t) * o.cornerJitter);
    const lag = (-jolt(o, t) * SHADOW_LAG).toFixed(1);
    out.push({
      borderRadius: `${r.toFixed(2)}px`,
      boxShadow: [
        "inset 0 1px 0 -0.5px rgba(255,255,255,0.45)",
        "inset 0 -1px 0 -0.5px rgba(60,2,12,0.5)",
        "inset 0 0 0 1px rgba(80,2,18,0.18)",
        `${lag}px 1px 2px rgba(60,2,12,0.35)`,
        `${lag}px 4px 10px -4px rgba(60,2,12,0.45)`,
      ].join(", "),
    });
  }
  return out;
}
function shakeFrames(o) {
  const steps = Math.max(1, Math.floor((o.velocity * o.duration) / 1000) + 1);
  const out = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const x = jolt(o, t) * o.shakeAmplitude * 100;
    const y = jolt(o, t) * o.shakeAmplitude * 100;
    out.push({ transform: `translate3d(${x.toFixed(2)}%,${y.toFixed(2)}%,0)` });
  }
  return out;
}
function onTransitionChange(cb) {
  const onStart = () => cb(true);
  const onEnd = () => cb(false);
  document.addEventListener("transitionstart", onStart);
  document.addEventListener("transitionend", onEnd);
  document.addEventListener("transitioncancel", onEnd);
  return () => {
    document.removeEventListener("transitionstart", onStart);
    document.removeEventListener("transitionend", onEnd);
    document.removeEventListener("transitioncancel", onEnd);
  };
}

class RedGlitchWord {
  constructor(base, layers, word, reduced = false) {
    this.unit = base.closest("[data-rgw-magnet]");
    this.badge = base.querySelector("[data-rgw-badge]");
    if (this.badge) {
      const r = parseFloat(getComputedStyle(this.badge).borderTopLeftRadius);
      if (!Number.isNaN(r)) this.badgeRadius = r;
    }
    this.base = base;
    this.layers = layers;
    this.word = word;
    this.reduced = reduced;
    this.opts = IDLE;
    this.anims = [];
    this.scrambleTimer = null;
    this.scrambleTick = 0;
    this.cycleStart = 0;
    this.running = false;
    this.drift = null;
    this.sinceDrop = 0;
  }
  setOptions(o) {
    this.opts = o;
    if (this.running) { this.cancel(); this.run(); }
  }
  setWord(word) { this.word = word; this.setText(word); }
  start() {
    if (this.running || this.reduced) return;
    this.running = true; this.run(); this.startScramble(); this.startDrift();
  }
  startDrift() {
    if (this.drift || this.reduced) return;
    const px = this.opts.driftPx;
    this.drift = this.base.animate(
      [
        { transform: "translate3d(0,0,0)" },
        { transform: `translate3d(${px}px,${-px * 0.6}px,0)` },
        { transform: `translate3d(${-px * 0.8}px,${px}px,0)` },
        { transform: `translate3d(${px * 0.5}px,${px * 0.7}px,0)` },
        { transform: "translate3d(0,0,0)" },
      ],
      { duration: 9400, iterations: Infinity, easing: "ease-in-out", composite: "add" },
    );
  }
  stopDrift() { this.drift?.cancel(); this.drift = null; }
  stop() {
    this.running = false; this.cancel(); this.stopScramble(); this.stopDrift();
  }
  run() {
    const o = this.opts;
    const stepEasing = `steps(${Math.max(1, Math.floor((o.velocity * o.duration) / 1000) + 1)}, jump-start)`;
    const timing = { duration: o.duration, iterations: 1, easing: stepEasing, fill: "none" };
    const rogue = Math.floor(Math.random() * o.sliceCount);

    if (this.unit && ++this.sinceDrop >= DROP_EVERY + Math.floor(Math.random() * DROP_JITTER)) {
      this.sinceDrop = 0;
      this.anims.push(this.unit.animate(dropFrames(o), { ...timing }));
    }

    this.anims = [
      this.base.animate(shakeFrames(o), timing),
      ...this.layers.slice(0, o.sliceCount).map((el, i) => el.animate(sliceFrames(o, i, rogue), timing)),
    ];

    if (this.badge) {
      this.anims.push(
        this.badge.animate(badgeFrames(o, this.badgeRadius), {
          duration: o.duration, iterations: 1, easing: "ease-in-out", fill: "none",
        }),
      );
    }

    this.cycleStart = performance.now();
    this.anims[0]?.finished
      ?.then(() => { if (this.running) this.run(); })
      ?.catch(() => {});
  }
  cancel() {
    for (const a of this.anims) { try { a.cancel(); } catch {} }
    this.anims = [];
    for (const el of this.layers) {
      el.style.opacity = "0";
      el.style.transform = "none";
      el.style.clipPath = "none";
      el.style.removeProperty("color");
      el.style.removeProperty("filter");
    }
    this.base.style.transform = "none";
    if (this.unit) this.unit.style.removeProperty("opacity");
  }
  startScramble() {
    this.stopScramble();
    this.cycleStart = performance.now();
    const tick = () => {
      const o = this.opts;
      const phase = ((performance.now() - this.cycleStart) % o.duration) / o.duration;
      if (envelope(o, phase) === 0) { this.setText(this.word); return; }
      if (!/^[A-Za-z\s'.\-_/・]+$/.test(this.word)) { this.setText(this.word); return; }
      if (++this.scrambleTick % 2 !== 0) { this.setText(this.word); return; }
      const chars = [...this.word];
      const out = chars.map((c) =>
        Math.random() < o.scrambleRate ? swap(c) : c
      ).join('');
      this.setText(out);
    };
    tick();
    this.scrambleTimer = window.setInterval(tick, this.opts.scrambleInterval);
  }
  stopScramble() {
    if (this.scrambleTimer !== null) window.clearInterval(this.scrambleTimer);
    this.scrambleTimer = null;
    this.setText(this.word);
  }
  setText(s) {
    const baseSlot = this.base.querySelector("[data-rgw-text]") ?? this.base;
    baseSlot.textContent = s;
    for (const el of this.layers) {
      const slot = el.querySelector("[data-rgw-text]") ?? el;
      slot.textContent = s;
    }
  }
  destroy() { this.stop(); }
}

export function RedGlitchingButton({ word = "glitching", hot = false } = {}) {
  const hostRef = React.useRef(null);
  const engineRef = React.useRef(null);
  const wordRef = React.useRef(word);
  const hotRef = React.useRef(hot);
  wordRef.current = word;
  hotRef.current = hot;

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const base = host.querySelector("[data-rgw-base]");
    const layers = Array.from(host.querySelectorAll("[data-rgw-layer]"));
    if (!base) return;

    const engine = new RedGlitchWord(base, layers, wordRef.current, reduced);
    engineRef.current = engine;
    if (hotRef.current) engine.setOptions(ACTIVE);

    let onScreen = false, hidden = false, inTransition = false, hovered = false;

    const magnet = host.querySelector("[data-rgw-magnet]");
    const PULL = 0.18;
    let raf = 0;

    const onMove = (e) => {
      if (!magnet || reduced) return;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = host.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const reach = Math.hypot(r.width, r.height) / 2;
        const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / reach);
        const k = PULL * falloff * falloff;
        magnet.style.transition = "none";
        magnet.style.transform = `translate3d(${(dx * k).toFixed(2)}px,${(dy * k).toFixed(2)}px,0)`;
      });
    };
    const onLeaveMagnet = () => {
      if (!magnet) return;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      magnet.style.transition = "transform 620ms cubic-bezier(.16,1,.3,1)";
      magnet.style.transform = "translate3d(0,0,0)";
    };
    const sync = () => {
      if (reduced) return;
      if (onScreen && !hidden && !inTransition && hovered) engine.start();
      else engine.stop();
    };
    const io = new IntersectionObserver(
      (es) => { onScreen = es.some((e) => e.isIntersecting); sync(); },
      { rootMargin: "200px" },
    );
    io.observe(host);

    const onVis = () => { hidden = document.hidden; sync(); };
    document.addEventListener("visibilitychange", onVis);
    const offTransition = onTransitionChange((active) => { inTransition = active; sync(); });

    const fine = window.matchMedia("(pointer: fine)").matches;
    const onEnter = () => {
      if (hovered) return;
      hovered = true; engine.setOptions(ACTIVE); host.dataset.hot = "true"; sync();
    };
    const onLeave = () => {
      if (!hovered) return;
      hovered = false; engine.setOptions(IDLE); delete host.dataset.hot; sync();
    };
    if (fine && !reduced) {
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointerleave", onLeave);
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeaveMagnet);
    }

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      offTransition();
      if (fine && !reduced) {
        host.removeEventListener("pointerenter", onEnter);
        host.removeEventListener("pointerleave", onLeave);
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeaveMagnet);
      }
      if (raf) cancelAnimationFrame(raf);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  React.useEffect(() => { engineRef.current?.setWord(word); }, [word]);
  React.useEffect(() => {
    if (!engineRef.current) return;
    if (hot) {
      engineRef.current.setOptions(ACTIVE);
      engineRef.current.start();
    } else {
      engineRef.current.setOptions(IDLE);
      engineRef.current.stop();
    }
  }, [hot]);

  const CELL = "col-start-1 row-start-1";
  const TEXT = "font-medium text-[22px] leading-none tracking-[0.18em] uppercase whitespace-pre";

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label={`The word '${word}' in a red glitch badge`}
      className="relative flex select-none items-center justify-center"
      style={{ fontFamily: 'var(--font-sans), "Poppins", sans-serif' }}
    >
      <style>{BADGE_CSS}</style>
      <span data-rgw-magnet className="relative inline-block will-change-transform">
        <span className="relative grid place-items-center">
          <span aria-hidden="true" className={`${CELL} ${TEXT} invisible`}>{word}</span>
          <span data-rgw-base className={`${CELL} relative z-10`}>
            <span data-rgw-badge className="rgw-badge absolute -inset-x-3 -top-1 -bottom-1" />
            <span data-rgw-text className={`${TEXT} relative text-white`}>{word}</span>
          </span>
          {Array.from({ length: 10 }).map((_, i) => (
            <span
              key={i}
              data-rgw-layer
              aria-hidden="true"
              style={{ opacity: 0 }}
              className={`${CELL} pointer-events-none relative z-10`}
            >
              <span
                className="rgw-badge absolute -inset-x-3 -top-1 -bottom-1"
                style={{ animationDelay: `${-(i * 2.4).toFixed(1)}s` }}
              />
              <span data-rgw-text className={`${TEXT} relative text-white`}>{word}</span>
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}

export default RedGlitchingButton;
