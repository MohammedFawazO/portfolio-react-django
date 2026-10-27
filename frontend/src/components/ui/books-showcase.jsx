import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { cn } from '@/lib/utils';

// Detail-panel actions are supplied per item (`item.actions`), so the same
// showcase can present books, CVs or anything else. These are the fallbacks
// when an item doesn't define its own.
// The showcase sticks to the site's own two families - Michroma for display,
// Poppins for everything else - so nothing inside it (nav, carousel, detail
// panel, or a canvas texture) can fall back to Inter, Geist or a generic.
const SHOWCASE_DISPLAY_FONT = "'Michroma', 'Poppins', sans-serif";
const SHOWCASE_TEXT_FONT = "'Poppins', sans-serif";

const ACTION_TONE_CLASS = {
  light: 'bg-[var(--bs-cream)] text-[var(--bs-navy)]',
  accent: 'bg-[var(--bs-peri)] text-[#10152c]',
  muted: 'bg-[#242c50] text-[var(--bs-lav)]',
};

const ACTION_BASE_CLASS =
  'inline-flex h-[54px] items-center gap-[10px] rounded-full px-[26px] text-[16.5px] font-semibold transition-[transform,filter] duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.04] hover:brightness-105 @max-[760px]:h-12 @max-[760px]:px-5 @max-[760px]:text-[15px]';

// Résumé actions opt into `variant: 'console'`, which borrows the site's own
// console button language (index.css `.console-btn`): Michroma, uppercase,
// wide tracking, hairline border, square-ish corners and the cyan accent. The
// pill buttons stay untouched for the book fallback.
const CONSOLE_ACTION_CLASS =
  'inline-flex items-center gap-[9px] rounded-[5px] border px-[18px] py-[11px] font-[family-name:var(--font-display)] text-[11px] font-normal uppercase tracking-[0.13em] transition-[background-color,border-color,color,transform] duration-200 ease-out hover:-translate-y-[1px] active:translate-y-0 @max-[760px]:gap-1 @max-[760px]:px-1.5 @max-[760px]:py-2 @max-[760px]:text-[9px] @max-[760px]:tracking-[0.05em]';

const CONSOLE_TONE_CLASS = {
  light:
    'border-[var(--bs-focus-fg)]/30 bg-transparent text-[var(--bs-focus-fg)] hover:border-[var(--bs-focus-fg)]/70 hover:bg-[var(--bs-focus-fg)]/10',
  accent:
    'border-[var(--bs-focus-accent)] bg-[var(--bs-focus-accent)] text-[var(--bs-focus-bg)] shadow-[0_6px_18px_-8px_var(--bs-focus-accent)] hover:border-[var(--bs-focus-accent)] hover:brightness-110',
  muted:
    'border-dashed border-[var(--bs-focus-fg)]/20 bg-transparent text-[var(--bs-focus-fg)]/60 hover:border-[var(--bs-focus-fg)]/35 hover:text-[var(--bs-focus-fg)]/80',
};

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5 @max-[760px]:h-4 @max-[760px]:w-4">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.8 2.6 2.8 15.4 0 18M12 3c-2.8 2.6-2.8 15.4 0 18" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5 @max-[760px]:h-4 @max-[760px]:w-4">
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M4 21h16" />
  </svg>
);

const BookmarkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5 @max-[760px]:h-4 @max-[760px]:w-4">
    <path d="M7 3h10v18l-5-4-5 4z" />
  </svg>
);

const DEFAULT_ACTIONS = [
  { label: 'English', tone: 'light', icon: 'globe' },
  { label: 'Buy Now', tone: 'accent' },
  { label: 'Buy Audiobook', tone: 'accent' },
  { label: 'Save', tone: 'muted', icon: 'save' },
];

function DetailActions({ actions }) {
  const list = actions?.length ? actions : DEFAULT_ACTIONS;

  return list.map((action, i) => {
    const isConsole = action.variant === 'console';
    const toneMap = isConsole ? CONSOLE_TONE_CLASS : ACTION_TONE_CLASS;
    const tone = toneMap[action.tone] || toneMap.accent;
    const icon = action.icon === 'globe' ? <GlobeIcon />
      : action.icon === 'download' ? <DownloadIcon />
      : action.icon === 'save' ? <BookmarkIcon />
      : null;
    const isIconOnly = !isConsole && action.icon === 'save';
    const cls = isConsole
      ? `${CONSOLE_ACTION_CLASS} ${tone}`
      : `${ACTION_BASE_CLASS} ${tone} ${isIconOnly ? 'w-[54px] px-0' : ''}`;

    if (action.href) {
      // A download action hands the file over; anything else is a plain link
      // and opens in a new tab, so the visitor keeps the page they came from.
      // The old test only opened a tab for an absolute http(s) href, which
      // left the same-site "Open in tab" actions navigating away in place.
      const isDownload = action.download !== false;
      return (
        <a
          key={i}
          href={action.href}
          download={isDownload ? '' : undefined}
          target={isDownload ? undefined : '_blank'}
          rel={isDownload ? undefined : 'noreferrer'}
          className={cls}
        >
          {icon}
          {action.label ? <span>{action.label}</span> : null}
        </a>
      );
    }

    return (
      <button key={i} type="button" onClick={action.onClick} aria-label={action.label} className={cls}>
        {icon}
        {action.label && !isIconOnly ? <span>{action.label}</span> : null}
      </button>
    );
  });
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const OPEN_BTN_OFF = ['opacity-0', 'scale-[0.94]'];
const OPEN_BTN_ON = ['opacity-100', 'scale-100'];

export function BooksShowcase({
  books = [],
  heroTitle = 'Books',
  navTitle = 'Bestsellers',
  showNav = true,
  showDetailPanel = true,
  showCarousel = true,
  themeColors,
  className,
  onBookSelect,
}) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const openBtnRef = useRef(null);
  const closeBtnRef = useRef(null);
  const dpRef = useRef(null);
  const shiftCarouselRef = useRef(() => {});
  const switchDetailRef = useRef(() => {});

  const onBookSelectRef = useRef(onBookSelect);
  useEffect(() => {
    onBookSelectRef.current = onBookSelect;
  }, [onBookSelect]);

  // The open document is remembered outside the 3D scene so a rebuild of that
  // scene (a remount, StrictMode's double-invoke, hot reload) restores the same
  // open CV instead of silently dropping back to the shelf. Only an explicit
  // close() clears it.
  const openDocRef = useRef({ id: null });

  const [uiMode, setUiMode] = useState('hero');
  const [selectedCfg, setSelectedCfg] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const canvasEl = canvasRef.current;
    if (!root || !canvasEl || books.length === 0) return;

    let cancelled = false;
    const timeouts = [];
    const setT = (fn, ms) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timeouts.push(id);
      return id;
    };

    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice =
      RM ||
      window.matchMedia('(max-width: 900px)').matches ||
      (navigator.hardwareConcurrency ?? 8) <= 4;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    class Spring {
      constructor(v, k, d) {
        this.v = v;
        this.t = v;
        this.vel = 0;
        this.k = k || 120;
        this.d = d || 14;
      }
      set(v) {
        this.v = v;
        this.t = v;
        this.vel = 0;
        return this;
      }
      update(dt) {
        const a = this.k * (this.t - this.v) - this.d * this.vel;
        this.vel += a * dt;
        this.v += this.vel * dt;
        return this.v;
      }
    }

    function mkCanvas(w, h) {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      return c;
    }

    function drawSpaced(x, text, cx, y, ls) {
      const prev = x.textAlign;
      x.textAlign = 'left';
      const chars = [...text];
      let tot = 0;
      const ws = chars.map((ch) => {
        const w = x.measureText(ch).width;
        tot += w;
        return w;
      });
      tot += ls * (chars.length - 1);
      let px = cx - tot / 2;
      chars.forEach((ch, i) => {
        x.fillText(ch, px, y);
        px += ws[i] + ls;
      });
      x.textAlign = prev;
    }

    function rr(x, px, py, w, h, r) {
      x.beginPath();
      x.moveTo(px + r, py);
      x.arcTo(px + w, py, px + w, py + h, r);
      x.arcTo(px + w, py + h, px, py + h, r);
      x.arcTo(px, py + h, px, py, r);
      x.arcTo(px, py, px + w, py, r);
      x.closePath();
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: !lowPowerDevice, alpha: true });
    } catch (err) {
      console.warn('BooksShowcase: WebGL renderer creation failed', err);
      const fail = document.createElement('div');
      fail.className = 'absolute inset-0 z-50 flex items-center justify-center p-10 text-center text-lg leading-relaxed text-[var(--bs-lav)]';
      fail.textContent = 'This experience needs WebGL, which your browser blocked or does not support.';
      root.appendChild(fail);
      return () => {
        fail.remove();
      };
    }

    const dims = { w: 0, h: 0 };

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPowerDevice ? 1 : 1.25));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    renderer.shadowMap.enabled = !lowPowerDevice;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    const ANISO = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 100);
    camera.position.set(0, 0.1, 9.6);

    function envBlob(x, cx, cy, r, rgb, a) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')');
      g.addColorStop(1, 'rgba(' + rgb + ',0)');
      x.fillStyle = g;
      x.beginPath();
      x.arc(cx, cy, r, 0, 6.2832);
      x.fill();
    }
    (function buildEnv() {
      const c = mkCanvas(512, 256);
      const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#5a6ba6');
      g.addColorStop(0.55, '#262e52');
      g.addColorStop(1, '#0a0d1d');
      x.fillStyle = g;
      x.fillRect(0, 0, 512, 256);
      envBlob(x, 140, 66, 95, '255,255,255', 0.95);
      envBlob(x, 405, 84, 55, '255,214,168', 0.55);
      envBlob(x, 256, 150, 120, '255,155,185', 0.28);
      const tx = new THREE.CanvasTexture(c);
      tx.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromEquirectangular(tx).texture;
      tx.dispose();
      pmrem.dispose();
    })();

    const hemi = new THREE.HemisphereLight(0x8fa0d8, 0x0d1024, 0.32);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 0.82);
    key.position.set(3.5, 5, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -4;
    key.shadow.camera.right = 4;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -4;
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 20;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    scene.add(key);
    const fillLight = new THREE.DirectionalLight(0xa9b6ff, 0.2);
    fillLight.position.set(-4, 1, 4);
    scene.add(fillLight);
    const rim = new THREE.DirectionalLight(0xff9db8, 0.3);
    rim.position.set(-2, 3, -5);
    scene.add(rim);

    const bookRoot = new THREE.Group();
    scene.add(bookRoot);

    function tex(c) {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = ANISO;
      return t;
    }

    // Canvas text is painted with whatever font is available at that instant.
    // On slower devices the cover texture is built before Michroma/Poppins have
    // swapped in, leaving the shelf in a fallback face. Repaint once the fonts
    // the painters ask for have actually loaded so mobile matches desktop.
    const fontsReady =
      typeof document !== 'undefined' && document.fonts?.load
        ? Promise.allSettled([
            document.fonts.load('700 82px "Michroma"'),
            document.fonts.load('500 40px "Michroma"'),
            document.fonts.load('700 30px "Michroma"'),
            document.fonts.load('700 62px "Michroma"'),
            document.fonts.load('800 240px "Michroma"'),
            document.fonts.load('700 42px "Michroma"'),
            document.fonts.load('500 26px "Poppins"'),
            document.fonts.load('700 24px "Poppins"'),
            document.fonts.load('600 21px "Poppins"'),
            document.fonts.load('500 34px "Poppins"'),
          ]).then(() => document.fonts.ready)
        : Promise.resolve();

    function loadOrPaint(material, imageURL, paintFallback) {
      material.map = tex(paintFallback());
      material.needsUpdate = true;

      let imageLoaded = false;
      fontsReady.then(() => {
        if (cancelled || imageLoaded) return;
        const prev = material.map;
        material.map = tex(paintFallback());
        material.needsUpdate = true;
        prev?.dispose();
      });

      if (!imageURL) return;
      new THREE.TextureLoader().setCrossOrigin('anonymous').load(
        imageURL,
        (t) => {
          if (cancelled) return;
          imageLoaded = true;
          t.colorSpace = THREE.SRGBColorSpace;
          t.anisotropy = ANISO;
          const prev = material.map;
          material.map = t;
          material.needsUpdate = true;
          prev?.dispose();
        },
        undefined,
        () => console.warn('Cover image failed to load, kept fallback cover:', imageURL),
      );
    }

    function noiseTexture(base, amp, scratches) {
      const s = 256;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      const img = x.createImageData(s, s);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = base + (Math.random() - 0.5) * 2 * amp;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
      if (scratches) {
        x.strokeStyle = 'rgba(200,200,200,.25)';
        x.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          x.beginPath();
          const y = Math.random() * s;
          x.moveTo(0, y);
          x.lineTo(s, y + (Math.random() - 0.5) * 22);
          x.stroke();
        }
      }
      return new THREE.CanvasTexture(c);
    }
    const laminateBump = noiseTexture(128, 10, true);
    const clothBump = (function () {
      const s = 128;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      x.fillStyle = '#808080';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < s; i += 2) {
        x.fillStyle = i % 4 === 0 ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.22)';
        x.fillRect(i, 0, 1, s);
        x.fillRect(0, i, s, 1);
      }
      return new THREE.CanvasTexture(c);
    })();

    function striationTexture(vertical) {
      const s = 512;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      x.fillStyle = '#ece4d2';
      x.fillRect(0, 0, s, s);
      let p = 0;
      while (p < s) {
        const w = 1 + Math.random() * 2.4;
        const tone = Math.random();
        x.fillStyle =
          tone < 0.12 ? 'rgba(140,125,95,.5)' : tone < 0.5 ? 'rgba(255,255,252,.55)' : 'rgba(190,178,150,.45)';
        if (vertical) x.fillRect(p, 0, w, s);
        else x.fillRect(0, p, s, w);
        p += w + 0.6 + Math.random() * 1.6;
      }
      for (let i = 0; i < 2600; i++) {
        x.fillStyle = 'rgba(120,108,84,' + (Math.random() * 0.1).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.2, 1.2);
      }
      return tex(c);
    }
    const striV = striationTexture(true);
    const striH = striationTexture(false);

    const endpaperTex = (function () {
      const s = 512;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      x.fillStyle = '#f3edde';
      x.fillRect(0, 0, s, s);
      for (let i = 0; i < 1400; i++) {
        x.fillStyle = 'rgba(120,105,70,' + (0.04 + Math.random() * 0.08).toFixed(3) + ')';
        x.fillRect(Math.random() * s, Math.random() * s, 1.4, 1.4);
      }
      const g = x.createLinearGradient(0, 0, s, 0);
      g.addColorStop(0, 'rgba(0,0,0,.07)');
      g.addColorStop(0.12, 'rgba(0,0,0,0)');
      g.addColorStop(0.88, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(0,0,0,.07)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return tex(c);
    })();

    const blobTex = (function () {
      const s = 256;
      const c = mkCanvas(s, s);
      const x = c.getContext('2d');
      const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
      g.addColorStop(0, 'rgba(0,0,0,.85)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g;
      x.fillRect(0, 0, s, s);
      return new THREE.CanvasTexture(c);
    })();

    function paintDefaultFront(x, w, h, o) {
      x.fillStyle = o.bg;
      x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(255,255,255,0.06)';
      for (let i = 0; i < 40; i++) x.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      x.fillStyle = '#ffffff';
      x.textAlign = 'center';
      x.font = `700 76px ${SHOWCASE_DISPLAY_FONT}`;
      const words = o.title.split(' ');
      let line = '';
      const lines = [];
      words.forEach((word) => {
        const test = line ? line + ' ' + word : word;
        if (x.measureText(test).width > w * 0.8 && line) {
          lines.push(line);
          line = word;
        } else line = test;
      });
      if (line) lines.push(line);
      const startY = h * 0.42 - ((lines.length - 1) * 88) / 2;
      lines.forEach((l, i) => x.fillText(l, w / 2, startY + i * 88));
      x.globalAlpha = 0.85;
      x.font = `500 40px ${SHOWCASE_DISPLAY_FONT}`;
      x.fillText(o.author, w / 2, startY + lines.length * 88 + 60);
      x.globalAlpha = 1;
      x.strokeStyle = 'rgba(255,255,255,0.4)';
      x.lineWidth = 3;
      x.strokeRect(60, 60, w - 120, h - 120);
    }

    function paintBack(x, w, h, o) {
      x.fillStyle = o.backBg;
      x.fillRect(0, 0, w, h);
      const ink = o.backInk;
      x.fillStyle = 'rgba(' + ink + ',.5)';
      rr(x, 150, 190, w - 460, 28, 14);
      x.fill();
      for (let i = 0; i < 9; i++) {
        const lw = i === 8 ? w - 560 : w - 300 - Math.random() * 180;
        x.fillStyle = 'rgba(' + ink + ',.2)';
        rr(x, 150, 300 + i * 56, lw, 15, 7);
        x.fill();
      }
      x.fillStyle = 'rgba(' + ink + ',.45)';
      x.beginPath();
      x.arc(178, h - 186, 26, 0, 6.2832);
      x.fill();
      x.fillStyle = '#fff';
      rr(x, w - 330, h - 262, 236, 152, 8);
      x.fill();
      x.fillStyle = '#111';
      let bx = w - 310;
      while (bx < w - 118) {
        const bw = 2 + Math.random() * 6;
        if (Math.random() > 0.42) x.fillRect(bx, h - 242, bw, 96);
        bx += bw + 2 + Math.random() * 4;
      }
      x.font = '500 21px Arial';
      x.textAlign = 'center';
      x.fillText('9 781234 567890', w - 212, h - 124);
      x.textAlign = 'left';
    }

    function paintSpine(x, w, h, o) {
      x.fillStyle = o.spineBg;
      x.fillRect(0, 0, w, h);
      x.save();
      x.translate(w / 2, h / 2);
      x.rotate(Math.PI / 2);
      x.fillStyle = o.spineInk;
      x.font = o.spineFont;
      drawSpaced(x, o.title.toUpperCase(), -h * 0.1, 15, 6);
      x.globalAlpha = 0.85;
      x.font = '600 25px Arial';
      drawSpaced(x, o.author.toUpperCase(), h * 0.325, 9, 4);
      x.globalAlpha = 1;
      x.restore();
      x.fillStyle = o.spineInk;
      x.globalAlpha = 0.6;
      x.fillRect(w / 2 - 26, 92, 52, 3);
      x.fillRect(w / 2 - 26, h - 95, 52, 3);
      x.globalAlpha = 1;
    }

    function trimToWidth(x, text, maxW) {
      if (x.measureText(text).width <= maxW) return text;
      let t = text;
      while (t.length > 1 && x.measureText(t + '...').width > maxW) t = t.slice(0, -1);
      return t + '...';
    }

    function makeIndexPageTex(chapters) {
      const w = 1024;
      const h = 1536;
      const c = mkCanvas(w, h);
      const x = c.getContext('2d');
      x.fillStyle = '#f4efdf';
      x.fillRect(0, 0, w, h);
      x.fillStyle = 'rgba(130,110,80,0.07)';
      for (let i = 0; i < 1600; i++) x.fillRect(Math.random() * w, Math.random() * h, 1.1, 1.1);
      x.fillStyle = '#2f2a23';
      x.textAlign = 'center';
      x.font = `700 84px ${SHOWCASE_DISPLAY_FONT}`;
      x.fillText('INDEX', w / 2, 190);
      x.globalAlpha = 0.26;
      x.fillRect(220, 225, w - 440, 3);
      x.globalAlpha = 1;

      const list = chapters && chapters.length
        ? chapters
        : ['Introduction', 'Main Ideas', 'Practical Lessons', 'Case Studies', 'Takeaways', 'Final Notes'];
      x.textAlign = 'left';
      x.font = `500 46px ${SHOWCASE_DISPLAY_FONT}`;
      let y = 318;
      for (let i = 0; i < list.length; i++) {
        const n = String(i + 1).padStart(2, '0');
        const pageNo = String(7 + i * 14).padStart(3, ' ');
        const left = n + '. ' + trimToWidth(x, list[i], 650);
        x.fillStyle = '#2f2a23';
        x.fillText(left, 150, y);
        x.textAlign = 'right';
        x.fillStyle = '#5d5043';
        x.fillText(pageNo, w - 150, y);
        x.textAlign = 'left';
        x.globalAlpha = 0.22;
        x.fillRect(150, y + 16, w - 300, 2);
        x.globalAlpha = 1;
        y += 112;
      }
      return tex(c);
    }

    const N = books.length;
    const VISIBLE = Math.min(3, N);

    const W = 1.42;
    const H = 2.14;
    const T = 0.34;
    const CT = 0.032;
    const OV = 0.05;
    const PAGE_N = lowPowerDevice ? 6 : 10;
    const BACK_PAGE_N = lowPowerDevice ? 3 : 5;
    const PW = W - 0.02;
    const PH = H - 0.02;
    const BLOCK_D = 0.245;
    const BLOCK_Z = -0.0205;
    const PIVOT_Z = T / 2 + CT / 2;
    const BPIVOT_Z = -(T / 2 + CT / 2);
    const HINGE_OVERLAP = 0.05;

    const coverGeo = new THREE.BoxGeometry(W + OV, H + OV * 2, CT);
    const blockGeo = new THREE.BoxGeometry(W - 0.015, H, BLOCK_D);
    const pageGeo = new THREE.PlaneGeometry(PW, PH);
    const spineGeo = new THREE.BoxGeometry(0.028, H + OV * 2, T + CT * 2 + 0.006);
    const hitGeo = new THREE.BoxGeometry(1.8, 2.5, 1.15);
    const blobGeo = new THREE.PlaneGeometry(1, 1);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });

    function std(o) {
      return new THREE.MeshStandardMaterial(Object.assign({ metalness: 0.02 }, o));
    }

    const paperFlat = std({ color: 0xf2ecdd, roughness: 0.95, envMapIntensity: 0.2 });
    const striMatV = std({ map: striV, bumpMap: striV, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
    const striMatH = std({ map: striH, bumpMap: striH, bumpScale: 0.0025, roughness: 0.95, envMapIntensity: 0.2 });
    const endpaperMat = std({ map: endpaperTex, roughness: 0.9, envMapIntensity: 0.25 });
    const pageMats = [0xf4eee0, 0xf1ebdb, 0xf6f0e3].map((c) =>
      std({ color: c, roughness: 0.92, envMapIntensity: 0.22, side: THREE.DoubleSide }),
    );

    const bookInstances = [];
    const hitMeshes = [];

    function buildBook(cfg, index) {
      const root = new THREE.Group();
      const float = new THREE.Group();
      root.add(float);
      bookRoot.add(root);

      const indexPageMat = std({ map: makeIndexPageTex(cfg.chapters), roughness: 0.92, envMapIntensity: 0.2, side: THREE.DoubleSide });

      const edgeColor = cfg.edge ?? '#eee4cf';
      const mEdge = std({ color: edgeColor, bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.68, envMapIntensity: 0.3 });
      const mFront = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.54, envMapIntensity: 0.28 });
      const mBack = std({ bumpMap: laminateBump, bumpScale: 0.0035, roughness: 0.58, envMapIntensity: 0.26 });
      const mSpine = std({ bumpMap: clothBump, bumpScale: 0.006, roughness: 0.78, envMapIntensity: 0.22 });

      loadOrPaint(mFront, cfg.images?.front ?? cfg.coverURL ?? null, () => {
        const c = mkCanvas(1024, 1536);
        const ctx = c.getContext('2d');
        if (cfg.front) cfg.front(ctx, 1024, 1536);
        else paintDefaultFront(ctx, 1024, 1536, { title: cfg.title, author: cfg.author, bg: cfg.spineBg ?? cfg.backBg ?? '#22252b' });
        return c;
      });
      loadOrPaint(mBack, cfg.images?.back ?? null, () => {
        const c = mkCanvas(1024, 1536);
        const ctx = c.getContext('2d');
        if (cfg.back) cfg.back(ctx, 1024, 1536);
        else paintBack(ctx, 1024, 1536, { backBg: cfg.backBg ?? '#22252b', backInk: cfg.backInk ?? '255,255,255' });
        return c;
      });
      loadOrPaint(mSpine, cfg.images?.spine ?? null, () => {
        const c = mkCanvas(220, 1536);
        const ctx = c.getContext('2d');
        if (cfg.spine) cfg.spine(ctx, 220, 1536);
        else
          paintSpine(ctx, 220, 1536, {
            spineBg: cfg.spineBg ?? cfg.backBg ?? '#22252b',
            spineInk: cfg.spineInk ?? '#ffffff',
            spineFont: cfg.spineFont ?? `700 42px ${SHOWCASE_DISPLAY_FONT}`,
            title: cfg.title,
            author: cfg.author,
          });
        return c;
      });

      const backPivot = new THREE.Group();
      backPivot.position.set(-W / 2 - HINGE_OVERLAP, 0, BPIVOT_Z);
      const backMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, endpaperMat, mBack]);
      backMesh.position.x = (W + OV) / 2;
      backMesh.castShadow = backMesh.receiveShadow = true;
      backPivot.add(backMesh);
      float.add(backPivot);

      const pivot = new THREE.Group();
      pivot.position.set(-W / 2 - HINGE_OVERLAP, 0, PIVOT_Z);
      const frontMesh = new THREE.Mesh(coverGeo, [mEdge, mEdge, mEdge, mEdge, mFront, endpaperMat]);
      frontMesh.position.x = (W + OV) / 2;
      frontMesh.castShadow = frontMesh.receiveShadow = true;
      pivot.add(frontMesh);
      float.add(pivot);

      const spine = new THREE.Mesh(spineGeo, mSpine);
      spine.position.set(-W / 2 - 0.013, 0, 0);
      spine.castShadow = true;
      float.add(spine);

      const block = new THREE.Mesh(blockGeo, [striMatV, paperFlat, striMatH, striMatH, paperFlat, paperFlat]);
      block.position.set(-0.0075, 0, BLOCK_Z);
      block.castShadow = block.receiveShadow = true;
      float.add(block);

      const pages = [];
      const pageF = [];
      for (let i = 0; i < PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, 0.166 - i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, i === 0 ? indexPageMat : pageMats[i % 3]);
        pm.position.x = PW / 2;
        pm.rotation.z = (Math.random() - 0.5) * 0.006;
        pp.add(pm);
        float.add(pp);
        pages.push(pp);
        pageF.push(0.3 * Math.pow(1 - i / PAGE_N, 2.6));
      }

      const pagesB = [];
      const pageFB = [];
      for (let i = 0; i < BACK_PAGE_N; i++) {
        const pp = new THREE.Group();
        pp.position.set(-W / 2 + 0.01, (Math.random() - 0.5) * 0.006, -0.166 + i * 0.0042);
        const pm = new THREE.Mesh(pageGeo, pageMats[i % 3]);
        pm.position.x = PW / 2;
        pm.rotation.z = (Math.random() - 0.5) * 0.006;
        pp.add(pm);
        float.add(pp);
        pagesB.push(pp);
        pageFB.push(0.3 * Math.pow(1 - i / BACK_PAGE_N, 2.6));
      }

      const blob = new THREE.Mesh(
        blobGeo,
        new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, opacity: 0.45, depthWrite: false }),
      );
      blob.scale.set(3.1, 3.9, 1);
      blob.position.set(0.1, -0.3, -0.85);
      blob.renderOrder = -5;
      root.add(blob);

      const hit = new THREE.Mesh(hitGeo, hitMat);
      float.add(hit);

      const springs = {
        px: new Spring(0, 17, 6.8),
        py: new Spring(0, 17, 6.8),
        pz: new Spring(0, 17, 6.8),
        rx: new Spring(0, 17, 6.8),
        ry: new Spring(0, 17, 6.8),
        rz: new Spring(0, 17, 6.8),
        sc: new Spring(1, 17, 6.8),
        tiltX: new Spring(0, 120, 13),
        tiltY: new Spring(0, 120, 13),
        lift: new Spring(0, 120, 13),
        cover: new Spring(0, 90, 12),
        coverB: new Spring(0, 90, 12),
        drag: new Spring(0, 160, 16),
      };

      const b = {
        cfg,
        index,
        root,
        float,
        pivot,
        backPivot,
        frontMesh,
        spine,
        block,
        pages,
        pageF,
        pagesB,
        pageFB,
        hit,
        springs,
        phase: Math.random() * 6.28,
        slotScale: 1,
        hitEdge: null,
        scr: { x: 0, y: 0 },
        orbY: 0,
        orbYv: 0,
        orbPhase: 'idle',
        orbTarget: 0,
        orbXs: new Spring(0, 60, 12),
        exit: null,
      };
      bookInstances.push(b);
      return b;
    }
    books.forEach(buildBook);
    const bookByHit = (m) => bookInstances.find((b) => b.hit === m);

    const leaves = {
      items: [],
      anchor: null,
      activate(book) {
        this.anchor = book;
        this.items.forEach((l) => {
          l.kick.set(-l.hx + (Math.random() - 0.5) * 0.6, -l.hy + (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.5);
          l.s.t = l.size;
          l.mesh.visible = true;
        });
      },
      deactivate() {
        this.items.forEach((l) => {
          l.s.t = 0;
        });
      },
      push(dx, dy) {
        if (!this.anchor) return;
        this.items.forEach((l) => {
          l.kick.x += dx * 2.4 * Math.random();
          l.kick.y += -dy * 2.4 * Math.random();
        });
      },
      update(dt, t) {
        if (!this.anchor) return;
        const ap = this.anchor.root.position;
        const w = RM ? 0.15 : 1;
        this.items.forEach((l) => {
          l.kick.multiplyScalar(Math.exp(-1.15 * dt));
          l.mesh.position.set(
            ap.x + l.hx + Math.sin(t * l.sp + l.ph) * 0.4 * w + l.kick.x,
            ap.y + l.hy + Math.cos(t * l.sp * 0.83 + l.ph * 1.3) * 0.3 * w + l.kick.y,
            ap.z * 0.4 + l.hz + l.kick.z,
          );
          l.mesh.rotation.x += l.rv.x * dt * (0.3 + w);
          l.mesh.rotation.y += l.rv.y * dt * (0.3 + w);
          l.mesh.rotation.z += l.rv.z * dt * (0.3 + w);
          const s = l.s.update(dt);
          l.mesh.scale.setScalar(Math.max(s, 0.0001));
          if (l.s.t === 0 && s < 0.01) l.mesh.visible = false;
        });
      },
    };
    (function buildLeaves() {
      const shape = new THREE.Shape();
      shape.moveTo(0, -0.5);
      shape.bezierCurveTo(0.3, -0.28, 0.3, 0.22, 0, 0.55);
      shape.bezierCurveTo(-0.3, 0.22, -0.3, -0.28, 0, -0.5);
      const geo = new THREE.ShapeGeometry(shape, 10);
      const cols = [0x3e7c3f, 0x57944a, 0x2f6136, 0x6aa557];
      for (let i = 0; i < 16; i++) {
        const mat = std({ color: cols[i % 4], roughness: 0.55, envMapIntensity: 0.3, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.visible = false;
        bookRoot.add(mesh);
        let hx = (Math.random() - 0.5) * 4.6;
        if (i % 5 === 0) hx += 2.8 * Math.sign(hx || 1);
        leaves.items.push({
          mesh,
          hx,
          hy: (Math.random() - 0.5) * 3.2,
          hz: -0.5 + Math.random() * 1.5,
          sp: 0.25 + Math.random() * 0.5,
          ph: Math.random() * 6.28,
          rv: new THREE.Vector3((Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.8),
          kick: new THREE.Vector3(),
          size: 0.14 + Math.random() * 0.16,
          s: new Spring(0, 60, 10),
        });
      }
    })();

    const state = { mode: 'hero', selected: null, hovered: null, pillLock: null, kbIndex: -1 };

    const SLOTS = { hero: [], detail: null, portrait: false };

    function computeSlots() {
      const a = dims.w / Math.max(1, dims.h);
      // The detail panel sits under the book for every container up to 760px
      // wide (see the @max-[760px] panel styles). Treat those as portrait too,
      // even when they are wider than they are tall, so a landscape phone or a
      // short tablet still uses the camera and slot that reserve the panel's
      // strip. Without this the opened CV kept the desktop (side) slot and slid
      // behind the panel.
      const portrait = a < 0.85 || dims.w <= 760;
      // Portrait books are sized from the width they have to share, with a bit
      // more presence on phones than before (was a / 1.08, capped at 0.74).
      const fit = portrait ? clamp(a / 1.0, 0.4, 0.84) : clamp(a / 1.62, 0.52, 1);
      bookRoot.scale.setScalar(fit);
      bookRoot.position.y = -(1 - fit) * 0.28;
      SLOTS.portrait = portrait;

      SLOTS.hero = SLOTS.portrait
        ? (() => {
          // A phone is much narrower than the old fixed portrait slots assumed,
          // so the two side books sat outside the camera frustum and only the
          // centre CV was ever visible. Work out how much horizontal room the
          // camera actually sees at the shelf depth and pull the side books in
          // to fit, keeping all three on screen at any portrait width.
          const halfView = Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 10.4 * a;
          const sideHalf = ((W + OV) / 2) * fit * 1.25;
          const spread = Math.max(0.62, halfView - sideHalf * 0.95);
          return [
            { p: [-spread, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.25 },
            { p: [0, -0.22, 0.6], r: [-0.05, -0.1, -0.035], s: 1.35 },
            { p: [spread, -0.62, -0.34], r: [-0.045, -0.42, -0.17], s: 1.25 },
          ]
        })()
        : [
          { p: [-2.05, -0.58, -0.12], r: [-0.045, 0.4, 0.185], s: 1.22 },
          { p: [0.25, -0.36, 0.6], r: [-0.05, -0.1, -0.035], s: 1.32 },
          { p: [2.35, -0.64, -0.34], r: [-0.045, -0.42, -0.17], s: 1.22 },
        ];

      if (!showDetailPanel) {
        SLOTS.detail = { p: [0, -0.05, 0.75], r: [0.02, -0.34, 0.05], s: SLOTS.portrait ? 0.94 : 1.08 };
        return;
      }

      if (SLOTS.portrait) {
        const el = dpRef.current;
        const panelH = el && el.offsetHeight > 40 ? el.offsetHeight : dims.h * 0.44;
        // The panel is inset 3.5% from the bottom, so ask for an 8% gap: the
        // book's slot then stops ~4.5% above the panel instead of touching it.
        const gap = dims.h * 0.08;
        const navB = dims.h * 0.1;
        const freeTop = navB;
        // Keep the strip reserved for the book clear of the panel and centre
        // the slot inside it. Using 97% of the strip (and 2.32 against the
        // 2.14 book height) leaves ~5% breathing room at the top and bottom,
        // which absorbs the perspective growth of the rotated cover. The CV
        // therefore cannot touch the panel's text no matter how tall the
        // panel gets.
        const freeBot = Math.max(dims.h - panelH - gap, freeTop + 140);
        const midPx = (freeTop + freeBot) / 2;
        const T13 = 0.23087;
        const camZp = 10.4;
        const zw = 0.8 * fit;
        const rootY = -(1 - fit) * 0.28;
        const yw = 0.1 + (1 - (2 * midPx) / dims.h) * T13 * (camZp - zw);
        const availW = (((freeBot - freeTop) * 0.97) / dims.h) * 2 * T13 * (camZp - zw);
        // The upper cap only guards the floor/ceiling of the math; on a phone
        // the CV now fills ~90% of the reserved strip instead of the old 0.94
        // ceiling, which is what made the focused book read smaller than the
        // shelf copy.
        const s = clamp(availW / fit / 2.32, 0.4, 1.6);
        SLOTS.detail = { p: [0, (yw - rootY) / fit, 0.8], r: [-0.02, -0.4, 0.06], s };
      } else {
        SLOTS.detail = { p: [-1.68, 0.0, 0.85], r: [0.02, -0.44, 0.08], s: 1.06 };
      }
    }

    function setTargets(b, slot) {
      const s = b.springs;
      s.px.t = slot.p[0];
      s.py.t = slot.p[1];
      s.pz.t = slot.p[2];
      s.rx.t = slot.r[0];
      s.ry.t = slot.r[1];
      s.rz.t = slot.r[2];
      b.slotScale = slot.s;
    }

    const EASE = {
      hold: () => 1,
      outQuad: (t) => 1 - (1 - t) * (1 - t),
      outQuint: (t) => 1 - Math.pow(1 - t, 5),
      inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    };
    const LIFT = 0.38;
    const CLEAR = 4.2;

    function playY(b, segs) {
      b.exit = { segs, i: 0, t: 0 };
    }
    function stepY(b, dt) {
      const ex = b.exit;
      const s = b.springs;
      ex.t += dt;
      let seg = ex.segs[ex.i];
      while (seg && ex.t >= seg.d) {
        ex.t -= seg.d;
        s.py.v = seg.to;
        if (seg.end) seg.end();
        seg = ex.segs[++ex.i];
      }
      if (seg) s.py.v = seg.from + (seg.to - seg.from) * seg.ease(ex.t / seg.d);
      else b.exit = null;
      s.py.t = s.py.v;
      s.py.vel = 0;
    }
    function pinInPlace(b) {
      const s = b.springs;
      s.px.t = s.px.v;
      s.pz.t = s.pz.v;
      s.rx.t = s.rx.v;
      s.ry.t = s.ry.v;
      s.rz.t = s.rz.v;
    }
    function sendOut(b, i, delay) {
      const y0 = SLOTS.hero[i].p[1];
      const here = b.springs.py.v;
      const apex = y0 + LIFT;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 0.28, from: here, to: apex, ease: EASE.outQuad },
        { d: 0.9, from: apex, to: y0 - CLEAR, ease: EASE.inOutSine, end: () => { b.root.visible = false; } },
      ]);
    }
    function bringBack(b, i, delay) {
      const here = b.springs.py.v;
      b.root.visible = true;
      pinInPlace(b);
      playY(b, [
        { d: delay, from: here, to: here, ease: EASE.hold },
        { d: 1.0, from: here, to: SLOTS.hero[i].p[1], ease: EASE.outQuint },
      ]);
    }

    function windowIndices(start, total, count) {
      const arr = [];
      for (let i = 0; i < count; i++) arr.push((start + i) % total);
      return arr;
    }
    let carouselStart = 0;
    let currentWindow = windowIndices(0, N, VISIBLE);
    let carouselBusy = false;

    function rebuildHitMeshes() {
      hitMeshes.length = 0;
      currentWindow.forEach((bi) => hitMeshes.push(bookInstances[bi].hit));
    }

    function applyMode() {
      if (state.mode === 'hero' || state.mode === 'closing') {
        currentWindow.forEach((bi, i) => {
          const slot = SLOTS.hero[i];
          if (slot) setTargets(bookInstances[bi], slot);
        });
      } else if (state.selected) {
        setTargets(state.selected, SLOTS.detail);
      }
    }

    function shiftCarousel(dir) {
      if (carouselBusy || state.mode !== 'hero' || N <= VISIBLE) return;
      carouselBusy = true;
      const outgoing = currentWindow;
      carouselStart = (((carouselStart + dir) % N) + N) % N;
      const incoming = windowIndices(carouselStart, N, VISIBLE);

      const toHide = outgoing.filter((bi) => !incoming.includes(bi));

      toHide.forEach((bi) => {
        const oldIdx = outgoing.indexOf(bi);
        const slot = SLOTS.hero[oldIdx];
        const b = bookInstances[bi];
        if (slot) b.springs.px.t = slot.p[0] - dir * 6.5;
      });
      setT(() => toHide.forEach((bi) => { bookInstances[bi].root.visible = false; }), 650);

      incoming.forEach((bi, i) => {
        const slot = SLOTS.hero[i];
        if (!slot) return;
        const b = bookInstances[bi];
        const alreadyOnScreen = outgoing.includes(bi);
        b.root.visible = true;
        if (!alreadyOnScreen) {
          b.springs.px.set(slot.p[0] + dir * 6.5);
          b.springs.py.set(slot.p[1]);
          b.springs.pz.set(slot.p[2]);
          b.springs.rx.set(slot.r[0]);
          b.springs.ry.set(slot.r[1]);
          b.springs.rz.set(slot.r[2]);
          b.springs.sc.set(slot.s * 0.92);
        }
        setTargets(b, slot);
      });

      currentWindow = incoming;
      rebuildHitMeshes();
      setT(() => { carouselBusy = false; }, 700);
    }
    shiftCarouselRef.current = shiftCarousel;

    const camX = new Spring(0, 13, 6.5);
    const camY = new Spring(0.1, 13, 6.5);
    const camZ = new Spring(9.6, 13, 6.5);
    const lookX = new Spring(0, 13, 6.5);
    const lookY = new Spring(0, 13, 6.5);
    const parX = new Spring(0, 60, 10);
    const parY = new Spring(0, 60, 10);

    function camTo(mode) {
      if (mode === 'detail') {
        camX.t = SLOTS.portrait ? 0 : -0.25;
        camZ.t = SLOTS.portrait ? 10.4 : 9.6;
        lookX.t = SLOTS.portrait ? 0 : -0.35;
        lookY.t = SLOTS.portrait ? 0 : 0.15;
      } else {
        camX.t = 0;
        camZ.t = 9.6;
        lookX.t = 0;
        lookY.t = 0;
      }
    }

    const pillX = new Spring(0, 190, 23);
    const pillY = new Spring(0, 190, 23);
    let pillOn = false;
    function showPill() {
      const el = openBtnRef.current;
      if (!el) return;
      el.classList.remove(...OPEN_BTN_OFF);
      el.classList.add(...OPEN_BTN_ON);
      pillOn = true;
    }
    function hidePill() {
      const el = openBtnRef.current;
      if (el) {
        el.classList.remove(...OPEN_BTN_ON);
        el.classList.add(...OPEN_BTN_OFF);
      }
      pillOn = false;
    }

    function open(book) {
      if (state.mode !== 'hero' || !book) return;
      state.mode = 'opening';
      setUiMode('opening');
      state.selected = book;
      openDocRef.current = { id: book.cfg?.id ?? null };
      state.pillLock = null;
      state.kbIndex = -1;
      hidePill();
      book.exit = null;
      root.classList.add('bs-transit');
      setSelectedCfg(book.cfg);
      onBookSelectRef.current?.(book.cfg);
      computeSlots();

      let out = 0;
      currentWindow.forEach((bi, i) => {
        const b = bookInstances[bi];
        if (b !== book) sendOut(b, i, out++ * 0.08);
      });

      setT(() => {
        if (state.mode !== 'opening' && state.mode !== 'detail') return;
        book.orbY = RM ? 0 : -6.2832;
        book.orbYv = RM ? 0 : 3;
        book.orbPhase = 'return';
        book.orbTarget = 0;
        book.orbXs.set(0);
        applyMode();
        camTo('detail');
      }, 760);
      setT(() => leaves.activate(book), 1000);
      setT(() => {
        if (state.mode === 'opening') {
          currentWindow.forEach((bi) => {
            const sibling = bookInstances[bi];
            if (sibling !== book) {
              sibling.exit = null;
              sibling.root.visible = false;
            }
          });
          root.classList.add('bs-detail-open');
          state.mode = 'detail';
          setUiMode('detail');
        }
      }, 1400);
    }

    function close() {
      if (state.mode !== 'detail') return;
      openDocRef.current = { id: null };
      state.mode = 'closing';
      setUiMode('closing');
      root.classList.remove('bs-detail-open');
      onBookSelectRef.current?.(null);
      leaves.deactivate();
      orbit.drag = false;
      const b = state.selected;
      if (b) {
        b.orbTarget = Math.round(b.orbY / 6.2832) * 6.2832 + 6.2832;
        b.orbYv = Math.max(b.orbYv, 3);
        b.orbPhase = 'return';
        b.orbXs.t = 0;
      }
      setT(() => {
        root.classList.remove('bs-transit');
        applyMode();
        camTo('hero');
        let back = 0;
        currentWindow.forEach((bi, i) => {
          const bk = bookInstances[bi];
          if (bk !== b) bringBack(bk, i, 0.85 + back++ * 0.1);
        });
      }, 250);
      setT(() => {
        if (state.mode === 'closing') {
          state.mode = 'hero';
          setUiMode('hero');
          state.selected = null;
          setSelectedCfg(null);
        }
      }, 1600);
    }

    // Swap the open document for its neighbour without dropping back to the
    // shelf. The outgoing CV slides out, the incoming one slides in with its
    // cover already opening, and the hero carousel window is kept on the new
    // document so closing returns to the CV that was last read.
    function switchDetail(dir) {
      if (state.mode !== 'detail' || !state.selected || N <= 1) return;
      const from = state.selected;
      const fromIdx = bookInstances.indexOf(from);
      if (fromIdx < 0) return;
      const toIdx = ((fromIdx + dir) % N + N) % N;
      const to = bookInstances[toIdx];
      if (!to || to === from || !SLOTS.detail) return;

      carouselStart = ((toIdx - Math.floor(VISIBLE / 2)) % N + N) % N;
      currentWindow = windowIndices(carouselStart, N, VISIBLE);
      rebuildHitMeshes();

      state.selected = to;
      openDocRef.current = { id: to.cfg?.id ?? null };
      setSelectedCfg(to.cfg);
      onBookSelectRef.current?.(to.cfg);

      const f = from.springs;
      f.px.t = SLOTS.detail.p[0] + dir * 4.6;
      f.pz.t = SLOTS.detail.p[2] - 1.2;
      from.slotScale = SLOTS.detail.s * 0.78;
      setT(() => {
        if (state.selected !== from) from.root.visible = false;
      }, 420);

      const d = SLOTS.detail;
      const s = to.springs;
      // A right click pulls the next CV in from the left while the current one
      // leaves to the right; the left chevron mirrors that.
      s.px.set(d.p[0] - dir * 5.2);
      s.py.set(d.p[1]);
      s.pz.set(d.p[2]);
      s.rx.set(d.r[0]);
      s.ry.set(d.r[1]);
      s.rz.set(d.r[2]);
      s.sc.set(d.s * 0.9);
      s.cover.set(0);
      s.coverB.set(0);
      s.drag.set(0);
      s.tiltX.set(0);
      s.tiltY.set(0);
      s.lift.set(0);
      to.root.visible = true;
      to.slotScale = d.s;
      to.orbY = 0;
      to.orbYv = 0;
      to.orbPhase = 'idle';
      to.orbTarget = 0;
      to.orbXs.set(0);
      setTargets(to, d);

      leaves.deactivate();
      setT(() => {
        if (state.selected === to && state.mode === 'detail') leaves.activate(to);
      }, 300);
    }
    switchDetailRef.current = switchDetail;

    const onCloseClick = () => close();
    closeBtnRef.current?.addEventListener('click', onCloseClick);

    const ptr = {
      ndcX: 0,
      ndcY: 0,
      cx: 0,
      cy: 0,
      lastX: 0,
      lastY: 0,
      down: false,
      downX: 0,
      downY: 0,
      moved: 0,
      t0: 0,
      type: 'mouse',
      seen: false,
      id: null,
    };
    const isTouch = () => ptr.type === 'touch' || ptr.type === 'pen';
    let dragBook = null;
    let rayBook = null;
    const orbit = { drag: false, dxAcc: 0, dyAcc: 0 };
    const ray = new THREE.Raycaster();
    const tmpV = new THREE.Vector3();

    const canvas = canvasEl;
    const onContextMenu = (e) => e.preventDefault();
    canvas.addEventListener('contextmenu', onContextMenu);

    const onPointerLeave = () => {
      rayBook = null;
      state.pillLock = null;
      state.kbIndex = -1;
    };
    canvas.addEventListener('pointerleave', onPointerLeave);

    const localXY = (e) => {
      const r = root.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onPointerMove = (e) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      const { x: cx, y: cy } = localXY(e);
      const dxN = (cx - ptr.lastX) / dims.w;
      const dyN = (cy - ptr.lastY) / dims.h;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      if (state.mode === 'detail') leaves.push(dxN, dyN);
      if (ptr.down && dragBook) {
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
        dragBook.springs.drag.t = clamp(((ptr.downX - cx) / dims.w) * 3.4, 0, 1.0);
      }
      if (ptr.down && orbit.drag) {
        orbit.dxAcc += dxN;
        orbit.dyAcc += dyN;
        ptr.moved += Math.abs(dxN * dims.w) + Math.abs(dyN * dims.h);
      }
    };
    canvas.addEventListener('pointermove', onPointerMove);

    const onPointerDown = (e) => {
      if (ptr.id !== null) return;
      root.focus({ preventScroll: true });
      ptr.id = e.pointerId;
      const { x: cx, y: cy } = localXY(e);
      ptr.cx = cx;
      ptr.cy = cy;
      ptr.lastX = cx;
      ptr.lastY = cy;
      ptr.ndcX = (cx / dims.w) * 2 - 1;
      ptr.ndcY = -(cy / dims.h) * 2 + 1;
      ptr.type = e.pointerType || 'mouse';
      ptr.seen = true;
      castRay();
      if (state.mode === 'hero' && rayBook) {
        ptr.down = true;
        dragBook = rayBook;
        ptr.downX = cx;
        ptr.downY = cy;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvas.setPointerCapture(e.pointerId);
      } else if (state.mode === 'detail' && rayBook === state.selected) {
        ptr.down = true;
        orbit.drag = true;
        orbit.dxAcc = 0;
        orbit.dyAcc = 0;
        ptr.moved = 0;
        ptr.t0 = performance.now();
        canvas.setPointerCapture(e.pointerId);
      } else {
        state.pillLock = null;
        state.kbIndex = -1;
      }
    };
    canvas.addEventListener('pointerdown', onPointerDown);

    const onPointerUp = (e) => {
      if (ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      orbit.drag = false;
      if (dragBook) {
        const slop = isTouch() ? 26 : 14;
        const limit = isTouch() ? 650 : 450;
        const wasDrag = ptr.moved > slop;
        dragBook.springs.drag.t = 0;
        if (!wasDrag && state.mode === 'hero' && performance.now() - ptr.t0 < limit) open(dragBook);
        dragBook = null;
      }
      ptr.down = false;
      if (isTouch()) rayBook = null;
    };
    window.addEventListener('pointerup', onPointerUp);

    const cancelPointer = (e) => {
      if (e && ptr.id !== null && e.pointerId !== ptr.id) return;
      ptr.id = null;
      ptr.down = false;
      orbit.drag = false;
      if (dragBook) {
        dragBook.springs.drag.t = 0;
        dragBook = null;
      }
      if (isTouch()) rayBook = null;
    };
    window.addEventListener('pointercancel', cancelPointer);
    canvas.addEventListener('lostpointercapture', cancelPointer);

    const onKeydown = (e) => {
      if (e.key === 'Escape') close();
      if (state.mode === 'detail' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
        switchDetail(e.key === 'ArrowRight' ? 1 : -1);
        e.preventDefault();
        return;
      }
      if (state.mode !== 'hero') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        if (e.shiftKey) {
          shiftCarousel(e.key === 'ArrowRight' ? -1 : 1);
        } else {
          const d = e.key === 'ArrowRight' ? 1 : -1;
          state.kbIndex = ((state.kbIndex < 0 ? (d > 0 ? -1 : 1) : state.kbIndex) + d + VISIBLE) % VISIBLE;
          state.pillLock = null;
        }
        e.preventDefault();
      }
      if (e.key === 'Enter' && state.hovered) open(state.hovered);
    };
    root.addEventListener('keydown', onKeydown);

    function castRay() {
      ray.setFromCamera({ x: ptr.ndcX, y: ptr.ndcY }, camera);
      const hits = ray.intersectObjects(hitMeshes, false);
      if (hits.length) {
        rayBook = bookByHit(hits[0].object);
        const lp = rayBook.hit.worldToLocal(hits[0].point.clone());
        rayBook.hitEdge = clamp((lp.x / 0.9) * 0.5 + 0.5, 0, 1);
      } else {
        rayBook = null;
      }
    }

    const timer = new THREE.Timer();
    timer.connect(document);
    const idle = RM ? 0 : 1;
    const DETAIL_OPEN_ANGLE = 0.88;
    const DETAIL_OPEN_SWAY = 0.035;

    function screenPos(b) {
      b.root.getWorldPosition(tmpV).project(camera);
      b.scr.x = (tmpV.x * 0.5 + 0.5) * dims.w;
      b.scr.y = (-tmpV.y * 0.5 + 0.5) * dims.h;
    }

    function tickBook(b, dt, t) {
      const s = b.springs;
      const isHov = state.hovered === b;
      const inDetail = state.mode === 'detail' && state.selected === b;
      const orbitActive = state.selected === b && state.mode !== 'hero';

      let activity = 0;
      if (orbitActive) {
        if (orbit.drag && inDetail) {
          const step = orbit.dxAcc * 6.5;
          orbit.dxAcc = 0;
          b.orbY += step;
          b.orbYv = clamp(b.orbYv * 0.5 + (step / Math.max(dt, 0.001)) * 0.5, -14, 14);
          b.orbXs.t = clamp(b.orbXs.t + orbit.dyAcc * 3.2, -0.55, 0.55);
          orbit.dyAcc = 0;
          b.orbPhase = 'drag';
        } else {
          b.orbXs.t = 0;
          if (b.orbPhase === 'drag') {
            if (Math.abs(b.orbYv) > 0.6) b.orbPhase = 'spin';
            else {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          }
          if (b.orbPhase === 'spin') {
            b.orbYv *= Math.exp(-0.9 * dt);
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbYv) < 0.5) {
              b.orbPhase = 'return';
              b.orbTarget = Math.round((b.orbY + b.orbYv * 1.2) / Math.PI) * Math.PI;
            }
          } else if (b.orbPhase === 'return') {
            const acc = 16 * (b.orbTarget - b.orbY) - 8 * b.orbYv;
            b.orbYv += acc * dt;
            b.orbY += b.orbYv * dt;
            if (Math.abs(b.orbTarget - b.orbY) < 0.002 && Math.abs(b.orbYv) < 0.01) {
              b.orbY = b.orbTarget;
              b.orbYv = 0;
              b.orbPhase = 'idle';
            }
          }
        }
        const distRest = Math.abs(b.orbY - Math.round(b.orbY / 6.2832) * 6.2832);
        activity = clamp(Math.abs(b.orbYv) * 1.5 + (orbit.drag ? 1 : 0) + distRest * 2, 0, 1);
      }
      b.orbXs.update(dt);

      let coverBase = 0;
      if (inDetail) coverBase = DETAIL_OPEN_ANGLE + Math.sin(t * 0.8 + b.phase) * DETAIL_OPEN_SWAY * idle;
      const fan = orbitActive ? clamp(b.orbYv * 0.16, 0, 0.75) : 0;
      const fanB = orbitActive ? clamp(-b.orbYv * 0.16, 0, 0.75) : 0;
      let coverBBase = 0;
      if (inDetail) coverBBase = 0.2 + Math.sin(t * 0.8 + b.phase + 1.7) * 0.02 * idle;

      if (isHov && ptr.seen && state.mode === 'hero') {
        const dxN = (ptr.cx - b.scr.x) / (dims.w * 0.25);
        const dyN = (b.scr.y - ptr.cy) / (dims.h * 0.3);
        s.tiltY.t = clamp(dxN * 0.28, -0.15, 0.15);
        s.tiltX.t = clamp(-dyN * 0.1, -0.09, 0.1);
        s.lift.t = 0.3;
        coverBase = 0;
      } else {
        s.tiltY.t = 0;
        s.tiltX.t = 0;
        s.lift.t = 0;
      }
      s.cover.t = coverBase + fan;
      s.coverB.t = coverBBase + fanB;
      s.sc.t = b.slotScale * (isHov && state.mode === 'hero' ? 1.09 : 1);

      s.px.update(dt);
      if (b.exit) stepY(b, dt);
      else s.py.update(dt);
      s.pz.update(dt);
      s.rx.update(dt);
      s.ry.update(dt);
      s.rz.update(dt);
      s.sc.update(dt);
      s.tiltX.update(dt);
      s.tiltY.update(dt);
      s.lift.update(dt);
      s.cover.update(dt);
      s.coverB.update(dt);
      s.drag.update(dt);

      b.float.position.y = Math.sin(t * 0.7 + b.phase) * 0.035 * idle;
      b.float.rotation.z = Math.sin(t * 0.9 + b.phase * 1.7) * 0.006 * idle;

      b.root.position.set(s.px.v, s.py.v, s.pz.v + s.lift.v);
      const sway = inDetail ? Math.sin(t * 0.45 + b.phase) * 0.035 * idle * (1 - activity) : 0;
      const swing = clamp(-s.px.vel * 0.12, -0.5, 0.5);
      b.root.rotation.set(s.rx.v + s.tiltX.v + b.orbXs.v, s.ry.v + s.tiltY.v + b.orbY + sway + swing, s.rz.v);
      b.root.scale.setScalar(Math.max(s.sc.v, 0.001));

      const ang = Math.max(0, s.cover.v + s.drag.v);
      const angB = Math.max(0, s.coverB.v);
      b.pivot.rotation.y = -ang;
      b.pivot.position.z = PIVOT_Z + ang * 0.022;
      b.backPivot.rotation.y = angB;
      b.backPivot.position.z = BPIVOT_Z - angB * 0.022;
      b.spine.rotation.y = -ang * 0.16 + angB * 0.16;
      b.block.scale.z = 1 - (ang + angB) * 0.05;
      b.block.position.z = BLOCK_Z - ang * 0.006 + angB * 0.006;
      for (let i = 0; i < PAGE_N; i++) {
        const fl = idle * Math.sin(t * 1.15 + b.phase + i * 0.6) * 0.006 * (1 - i / PAGE_N);
        b.pages[i].rotation.y = -(ang * b.pageF[i] + Math.max(0, fl));
      }
      for (let i = 0; i < BACK_PAGE_N; i++) b.pagesB[i].rotation.y = angB * b.pageFB[i];
    }

    let rafId = 0;
    let isInViewport = true;
    let lastFrameTime = 0;
    const frameInterval = 1000 / (lowPowerDevice ? 20 : 30);
    function animate(timestamp = performance.now()) {
      if (cancelled || !isInViewport || document.hidden) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(animate);
      if (timestamp - lastFrameTime < frameInterval) return;
      lastFrameTime = timestamp;
      timer.update(timestamp);
      const dt = Math.min(timer.getDelta(), 0.05);
      const t = timer.getElapsed();

      if (ptr.seen && (ptr.type === 'mouse' || ptr.down)) castRay();
      let hov = null;
      if (state.mode === 'hero') {
        const kb = state.kbIndex >= 0 ? bookInstances[currentWindow[state.kbIndex]] : null;
        hov = rayBook || state.pillLock || kb || null;
      } else if (state.mode === 'detail') {
        hov = rayBook === state.selected ? rayBook : null;
      }
      state.hovered = hov;
      let cur = 'default';
      if (state.mode === 'hero' && hov) cur = 'pointer';
      else if (state.mode === 'detail' && state.selected) {
        if (orbit.drag) cur = 'grabbing';
        else if (rayBook === state.selected) cur = 'grab';
      }
      canvas.style.cursor = cur;

      bookInstances.forEach((b) => screenPos(b));
      bookInstances.forEach((b) => tickBook(b, dt, t));
      leaves.update(dt, t);

      parX.t = RM ? 0 : ptr.ndcX * 0.02;
      parY.t = RM ? 0 : -ptr.ndcY * 0.012;
      bookRoot.rotation.y = parX.update(dt);
      bookRoot.rotation.x = parY.update(dt);

      camera.position.set(camX.update(dt), camY.update(dt), camZ.update(dt));
      camera.lookAt(lookX.update(dt), lookY.update(dt), 0);

      if (state.mode === 'hero' && state.hovered && ptr.seen && !isTouch() && !(ptr.down && ptr.moved > 14)) {
        const tx = ptr.cx;
        const ty = ptr.cy + 34;
        if (!pillOn) {
          pillX.set(tx);
          pillY.set(ty);
        }
        pillX.t = tx;
        pillY.t = ty;
        if (openBtnRef.current) {
          openBtnRef.current.style.left = pillX.update(dt) + 'px';
          openBtnRef.current.style.top = pillY.update(dt) + 'px';
        }
        if (!pillOn) showPill();
      } else {
        hidePill();
      }

      renderer.render(scene, camera);
    }

    function resumeAnimation() {
      if (!rafId && !cancelled && isInViewport && !document.hidden) animate();
    }

    function relayout() {
      const r = root.getBoundingClientRect();
      dims.w = Math.max(1, Math.round(r.width));
      dims.h = Math.max(1, Math.round(r.height));
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPowerDevice ? 1 : 1.25));
      renderer.setSize(dims.w, dims.h);
      camera.aspect = dims.w / dims.h;
      camera.updateProjectionMatrix();
      computeSlots();
      applyMode();
      camTo(state.mode === 'detail' || state.mode === 'opening' ? 'detail' : 'hero');
    }

    relayout();
    currentWindow.forEach((bi, i) => {
      const b = bookInstances[bi];
      const slot = SLOTS.hero[i];
      const s = b.springs;
      s.px.set(slot.p[0]);
      s.py.set(slot.p[1] - 3.9);
      s.pz.set(slot.p[2]);
      s.rx.set(slot.r[0]);
      s.ry.set(slot.r[1]);
      s.rz.set(slot.r[2] + 0.35 * (i === 1 ? -1 : Math.sign(slot.p[0])));
      s.sc.set(slot.s);
      b.slotScale = slot.s;
      setT(() => setTargets(b, slot), 240 + i * 150);
    });
    bookInstances.forEach((b, idx) => {
      if (!currentWindow.includes(idx)) b.root.visible = false;
    });
    rebuildHitMeshes();
    camTo('hero');
    animate();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewport = entry.isIntersecting;
        if (isInViewport) resumeAnimation();
        else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      },
      { rootMargin: '160px' },
    );
    visibilityObserver.observe(root);

    const onVisibilityChange = () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      } else {
        resumeAnimation();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onWindowResize = () => relayout();
    let orientationTimeout = null;
    const onOrientation = () => {
      relayout();
      orientationTimeout = setT(relayout, 250);
    };
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', onOrientation);
    let visualViewportHandler = null;
    if (window.visualViewport) {
      visualViewportHandler = () => relayout();
      window.visualViewport.addEventListener('resize', visualViewportHandler);
    }
    const ro = new ResizeObserver(() => relayout());
    ro.observe(root);

    // The detail panel grows when a CV's content renders (and when switching
    // CVs). On portrait screens the open book is positioned in the strip above
    // that panel, so recompute the slot whenever the panel's height changes -
    // otherwise the book is placed against a stale shrink-to-fit height and
    // ends up behind the content. Desktop slots are fixed, so this is a no-op
    // there.
    const detailPanel = dpRef.current;
    const detailPanelRo = new ResizeObserver(() => relayout());
    if (detailPanel) detailPanelRo.observe(detailPanel);

    // Show the panel's scrollbar only while it is actually being scrolled.
    // The thumb is transparent at rest (see .bs-detail-scroll in index.css)
    // and fades in when this class is present.
    let scrollIdleTimer = null;
    const onPanelScroll = () => {
      if (!detailPanel) return;
      detailPanel.classList.add('is-scrolling');
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      scrollIdleTimer = setTimeout(() => detailPanel.classList.remove('is-scrolling'), 800);
    };
    if (detailPanel) detailPanel.addEventListener('scroll', onPanelScroll, { passive: true });

    // If a document was open when this scene was rebuilt, reopen it so the
    // detail view is sticky: the only way back to the shelf is close().
    const restoreOpenDoc = () => {
      const id = openDocRef.current?.id;
      if (!id) return;
      const target = bookInstances.find((b) => b.cfg?.id === id);
      if (target && state.mode === 'hero') open(target);
    };
    restoreOpenDoc();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      timeouts.forEach((id) => clearTimeout(id));
      if (orientationTimeout) clearTimeout(orientationTimeout);

      visibilityObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      timer.dispose();
      ro.disconnect();
      detailPanelRo.disconnect();
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
      if (detailPanel) detailPanel.removeEventListener('scroll', onPanelScroll);
      window.removeEventListener('resize', onWindowResize);
      window.removeEventListener('orientationchange', onOrientation);
      if (visualViewportHandler && window.visualViewport) {
        window.visualViewport.removeEventListener('resize', visualViewportHandler);
      }
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', cancelPointer);
      root.removeEventListener('keydown', onKeydown);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('lostpointercapture', cancelPointer);
      closeBtnRef.current?.removeEventListener('click', onCloseClick);

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => {
              if (v && v.isTexture) v.dispose();
            });
            m.dispose();
          });
        }
      });
      scene.environment?.dispose();
      scene.environment = null;
      renderer.dispose();
    };
  }, [books, showDetailPanel]);

  const themeVars = {
    '--bs-navy': themeColors?.navy ?? '#141a32',
    '--bs-pink': themeColors?.pink ?? '#f591ac',
    '--bs-cream': themeColors?.cream ?? '#fdfbf4',
    '--bs-lav': themeColors?.lav ?? '#c9d0ee',
    '--bs-peri': themeColors?.peri ?? '#96a2de',
    '--bs-bg-light': themeColors?.bgLight ?? themeColors?.bg ?? '#fafafa',
    '--bs-bg-dark': themeColors?.bgDark ?? themeColors?.bg ?? '#18181b',
    '--bs-fg-light': themeColors?.foregroundLight ?? '#18181b',
    '--bs-fg-dark': themeColors?.foregroundDark ?? '#fafafa',
    // Focus (detail) view has its own palette so the shelf can stay dark while
    // the opened CV reads like a sheet of paper. Defaults keep the old dark
    // look for any other use of the showcase.
    '--bs-focus-bg': themeColors?.focusBg ?? themeColors?.navy ?? '#141a32',
    '--bs-focus-fg': themeColors?.focusFg ?? themeColors?.cream ?? '#fdfbf4',
    '--bs-focus-accent': themeColors?.focusAccent ?? themeColors?.peri ?? '#96a2de',
  };

  const panelVisible = uiMode === 'detail';
  const heroWordVisible = mounted && uiMode === 'hero';
  const canCarousel = showCarousel && books.length > 3;
  const canSwitchDetail = books.length > 1;
  const selectedIndex = selectedCfg ? books.findIndex((b) => b.id === selectedCfg.id) : -1;

  const delayMap = {
    50: 'delay-[50ms]',
    90: 'delay-[90ms]',
    130: 'delay-[130ms]',
    200: 'delay-[200ms]',
    230: 'delay-[230ms]',
    280: 'delay-[280ms]',
    210: 'delay-[210ms]',
    270: 'delay-[270ms]',
    330: 'delay-[330ms]',
  };

  // A document that ships its own sections (résumés) gets a CV-shaped panel:
  // a format badge plus the real section list, instead of book ratings.
  const cvSections = Array.isArray(selectedCfg?.sections) ? selectedCfg.sections : [];
  const eyebrow = selectedCfg?.badge || (selectedCfg?.metaLabel && cvSections.length > 0 ? selectedCfg.metaLabel : null);

  const dpChild = (delayMs) =>
    panelVisible
      ? `opacity-100 translate-y-0 transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${delayMap[delayMs] || ''}`
      : 'opacity-0 translate-y-[28px] transition-[opacity,transform] duration-[280ms] ease-out';

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-label={`${heroTitle} book showcase`}
      data-state={uiMode}
      className={cn(
        'book-showcase relative isolate h-full min-h-[560px] max-[800px]:min-h-[660px]! overflow-hidden font-[family-name:var(--font-display)] outline-none [container-type:size] [-webkit-tap-highlight-color:transparent]',
        'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--bs-peri)]',
        'transition-colors duration-500 ease-out',
        uiMode === 'hero'
          ? 'bg-[var(--bs-bg-light)] text-[var(--bs-fg-light)] dark:bg-[var(--bs-bg-dark)] dark:text-[var(--bs-fg-dark)]'
          : 'bg-[var(--bs-focus-bg)] text-[var(--bs-focus-fg)]',
        className,
      )}
      style={{ ...themeVars, '--font-display': SHOWCASE_DISPLAY_FONT, '--font-sans': SHOWCASE_TEXT_FONT, '--font-mono': SHOWCASE_TEXT_FONT, '--font-heading': SHOWCASE_DISPLAY_FONT }}
    >
      <div
        className={`pointer-events-none absolute left-1/2 top-[14%] z-[1] -translate-x-1/2 select-none transition-all duration-500 ease-out ${heroWordVisible ? 'translate-y-0 opacity-100' : uiMode === 'hero' ? '-translate-y-0 translate-y-[60px] opacity-0' : '-translate-y-11 opacity-0'
          }`}
      >
        <span className="block whitespace-nowrap text-current text-[clamp(2.25rem,11cqw,9rem)] font-bold leading-[0.9] tracking-[-0.015em]">
          {heroTitle}
        </span>
      </div>

      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 z-[2] block h-full w-full touch-none" />

      {books.length === 0 && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-8 text-center text-sm text-current opacity-60">
          Add at least one book to display the showcase.
        </div>
      )}

      {showNav && (
        <nav
          aria-hidden={uiMode !== 'hero'}
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 z-40 flex items-center justify-between px-[clamp(20px,4cqw,42px)] py-[clamp(18px,3cqh,26px)] transition-opacity duration-300',
            uiMode === 'hero' ? 'opacity-100' : 'opacity-0',
          )}
        >
          <div className="text-[clamp(20px,2.2cqw,29px)] font-extrabold tracking-[-0.01em] text-current">
            {navTitle}
          </div>
        </nav>
      )}

      {canCarousel && (
        <>
          <button
            type="button"
            aria-label="Next books"
            onClick={() => shiftCarouselRef.current(1)}
            className={`absolute left-3 top-1/2 z-30 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bs-cream)]/90 text-[var(--bs-navy)] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[var(--bs-cream)] @min-[768px]:left-6 @min-[768px]:h-12 @min-[768px]:w-12 ${uiMode === 'hero' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
              }`}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Previous books"
            onClick={() => shiftCarouselRef.current(-1)}
            className={`absolute right-3 top-1/2 z-30 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--bs-cream)]/90 text-[var(--bs-navy)] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[var(--bs-cream)] @min-[768px]:right-6 @min-[768px]:h-12 @min-[768px]:w-12 ${uiMode === 'hero' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
              }`}
          >
            <ChevronRight />
          </button>
        </>
      )}

      <button
        ref={openBtnRef}
        tabIndex={-1}
        aria-hidden="true"
        className={
          'absolute left-0 top-0 z-30 -translate-x-1/2 -translate-y-1/2 rotate-[-1.6deg] px-[38px] pb-[18px] pt-4 ' +
          'text-[15px] font-bold uppercase tracking-[0.1em] text-[var(--bs-navy)] pointer-events-none ' +
          'transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[left,top,opacity,transform] ' +
          '[clip-path:polygon(0%_0.9%,8.3%_0.8%,16.7%_6.3%,25%_3.8%,33.3%_5.5%,41.7%_2.7%,50%_5.2%,58.3%_0.4%,66.7%_5.9%,75%_6.5%,83.3%_1%,91.7%_6.4%,100%_0.7%,97.7%_20%,97%_40%,99.6%_60%,98.7%_80%,100%_96.5%,91.7%_99.8%,83.3%_95.6%,75%_94.9%,66.7%_96.6%,58.3%_93.5%,50%_97.9%,41.7%_99.5%,33.3%_93.2%,25%_93.6%,16.7%_93.2%,8.3%_93.1%,0%_93.5%,0.2%_80%,1.1%_60%,3.9%_40%,3.8%_20%)] ' +
          '[background:repeating-linear-gradient(92deg,rgba(90,74,40,0.03)_0px_2px,transparent_2px_6px),radial-gradient(125%_150%_at_28%_0%,#fffdf7_0%,#f8f2e3_58%,#ede4cf_100%)] ' +
          '[filter:drop-shadow(0_2px_1px_rgba(0,0,0,0.16))_drop-shadow(0_14px_26px_rgba(0,0,0,0.4))] ' +
          OPEN_BTN_OFF.join(' ')
        }
      >
        Open
      </button>

      <button
        ref={closeBtnRef}
        aria-label="Close detail view"
        className={`absolute left-1/2 top-[30px] z-40 -translate-x-1/2 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border-[1.5px] border-[var(--bs-focus-fg)]/30 bg-transparent text-[17px] leading-none text-[var(--bs-focus-fg)] transition-[opacity,border-color,background-color] duration-300 delay-150 hover:border-[var(--bs-focus-fg)]/80 hover:bg-[var(--bs-focus-fg)]/5 @max-[760px]:left-auto @max-[760px]:right-[18px] @max-[760px]:top-[18px] @max-[760px]:translate-x-0 [-webkit-tap-highlight-color:transparent] ${uiMode === 'detail' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
      >
        &#10005;
      </button>

      {canSwitchDetail && (
        <div
          className={`absolute left-[18px] top-[18px] z-40 flex items-center gap-[6px] transition-opacity duration-300 @min-[761px]:left-6 @min-[761px]:top-[30px] ${uiMode === 'detail' ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
            }`}
        >
          <button
            type="button"
            aria-label="Previous CV"
            tabIndex={uiMode === 'detail' ? 0 : -1}
            onClick={() => switchDetailRef.current(-1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[var(--bs-focus-fg)]/30 bg-transparent text-[var(--bs-focus-fg)] transition-[border-color,background-color] duration-300 hover:border-[var(--bs-focus-fg)]/80 hover:bg-[var(--bs-focus-fg)]/5 @min-[761px]:h-[52px] @min-[761px]:w-[52px] [-webkit-tap-highlight-color:transparent]"
          >
            <ChevronLeft />
          </button>
          <span className="min-w-[48px] text-center font-[family-name:var(--font-display)] text-[11px] uppercase tracking-[0.16em] text-[var(--bs-focus-fg)]/60 tabular-nums">
            {selectedIndex >= 0 ? selectedIndex + 1 : 1} / {books.length}
          </span>
          <button
            type="button"
            aria-label="Next CV"
            tabIndex={uiMode === 'detail' ? 0 : -1}
            onClick={() => switchDetailRef.current(1)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[var(--bs-focus-fg)]/30 bg-transparent text-[var(--bs-focus-fg)] transition-[border-color,background-color] duration-300 hover:border-[var(--bs-focus-fg)]/80 hover:bg-[var(--bs-focus-fg)]/5 @min-[761px]:h-[52px] @min-[761px]:w-[52px] [-webkit-tap-highlight-color:transparent]"
          >
            <ChevronRight />
          </button>
        </div>
      )}

      {showDetailPanel && (
        <div
          ref={dpRef}
          aria-live="polite"
          className={`bs-detail-scroll absolute right-[7%] top-1/2 z-[15] w-[min(560px,42%)] max-h-[88%] -translate-y-1/2 overflow-x-hidden overflow-y-auto overscroll-contain scroll-py-[6cqw] px-[clamp(20px,1.8cqw,30px)] py-[clamp(18px,1.6cqw,26px)] pointer-events-auto @max-[760px]:right-auto @max-[760px]:left-1/2 @max-[760px]:top-auto @max-[760px]:bottom-[3.5%] @max-[760px]:max-h-[46%] @max-[760px]:w-[min(560px,92cqw)] @max-[760px]:-translate-x-1/2 @max-[760px]:translate-y-0 @max-[760px]:px-4! @max-[760px]:py-4 @max-[760px]:scroll-py-4 ${panelVisible ? 'visible' : 'invisible delay-[500ms]'
            }`}
        >
          <h1 className={`m-0 break-words text-balance text-[var(--bs-focus-fg)] text-[clamp(44px,4.7cqw,76px)] font-extrabold leading-[0.98] tracking-[-0.015em] @max-[760px]:text-center @max-[760px]:text-[clamp(26px,7cqw,38px)] @max-[760px]:leading-[1.02] ${dpChild(50)}`}>
            {selectedCfg?.title}
          </h1>
          {eyebrow && (
            <div className={`mt-[20px] flex items-center gap-4 @max-[760px]:mt-3 @max-[760px]:justify-center ${dpChild(90)}`}>
              <span className="inline-flex items-center rounded-[4px] border border-[var(--bs-focus-accent)]/40 bg-[var(--bs-focus-accent)]/10 px-[12px] py-[7px] font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.16em] text-[var(--bs-focus-accent)] @max-[760px]:px-2 @max-[760px]:py-1 @max-[760px]:text-[9px] @max-[760px]:tracking-[0.1em]">
                {eyebrow}
              </span>
              <span className="h-px flex-1 bg-[var(--bs-focus-fg)]/15 @max-[760px]:hidden" />
            </div>
          )}
          <p className={`mt-[26px] max-w-[54ch] break-words font-[family-name:var(--font-sans)] text-[var(--bs-focus-fg)]/75 text-[clamp(16px,1.25cqw,19px)] leading-[1.65] @max-[760px]:mt-4 @max-[760px]:line-clamp-4 @max-[760px]:text-[15px] ${dpChild(130)}`}>
            {selectedCfg?.desc}
          </p>
          {cvSections.length > 0 ? (
            <>
              <div className={`mt-[30px] border-t border-[var(--bs-focus-fg)]/15 @max-[760px]:mt-5 ${dpChild(200)}`} />
              <div className={`mt-[24px] @max-[760px]:mt-4 ${dpChild(230)}`}>
                <div className="font-[family-name:var(--font-display)] text-[10.5px] uppercase tracking-[0.2em] text-[var(--bs-focus-fg)]/60">
                  Sections in this CV
                </div>
                <ol className="mt-5 grid grid-cols-2 gap-x-10 gap-y-[14px] @max-[760px]:grid-cols-1 @max-[760px]:gap-y-2">
                  {cvSections.map((section, i) => (
                    <li
                      key={section}
                      className="flex min-w-0 items-baseline gap-[12px] font-[family-name:var(--font-sans)] text-[clamp(15px,1.1cqw,17px)] text-[var(--bs-focus-fg)]/85"
                    >
                      <span className="shrink-0 font-mono text-[12px] tabular-nums text-[var(--bs-focus-accent)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 break-words border-b border-transparent pb-[3px] leading-[1.35] transition-colors duration-300 hover:border-[var(--bs-focus-accent)]/50">
                        {section}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <div className={`mt-[30px] flex items-center gap-[18px] @max-[760px]:mt-[18px] ${dpChild(210)}`}>
              <div className="flex gap-[5px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className={`h-[25px] w-[25px] fill-[var(--bs-pink)] ${i < (selectedCfg?.stars ?? 0) ? '' : 'opacity-25'}`}
                  >
                    <path d="M12 2.6l2.8 6 6.6.6-5 4.4 1.5 6.5L12 16.7 6.1 20.1l1.5-6.5-5-4.4 6.6-.6z" />
                  </svg>
                ))}
              </div>
              <div className="h-6 w-px bg-[var(--bs-focus-fg)]/20" />
              <div className="text-[18px] italic text-[var(--bs-focus-fg)]/60">{selectedCfg?.metaLabel || 'Goodreads'}</div>
              <div className="ml-auto text-[18px] italic text-[var(--bs-focus-fg)]/60">{selectedCfg?.year}</div>
            </div>
          )}
          {cvSections.length > 0 && (
            <div className={`mt-[26px] border-t border-[var(--bs-focus-fg)]/15 @max-[760px]:mt-5 ${dpChild(280)}`} />
          )}
          <div
            className={`pointer-events-auto mt-6 flex flex-wrap items-center gap-[10px] @max-[760px]:mt-[18px] @max-[760px]:flex-nowrap @max-[760px]:justify-center @max-[760px]:gap-2 ${dpChild(330)}`}
          >
            <DetailActions actions={selectedCfg?.actions} />
          </div>
        </div>
      )}
    </div>
  );
}

export default BooksShowcase;
