class Pixel {
  constructor(canvas, context, x, y, color, speed, delay) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.size = 0;
    this.sizeStep = Math.random() * 0.4;
    this.minSize = 0.5;
    this.maxSizeInteger = 2;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counter = 0;
    this.counterStep = Math.random() * 4 + (this.width + this.height) * 0.01;
    this.isIdle = false;
    this.isReverse = false;
    this.isShimmer = false;
    this.velocity = 0;
    this.opacity = 1;
    this.rainDirection = 1;
  }

  getRandomValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;

    this.ctx.globalAlpha = this.opacity;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size
    );
    this.ctx.globalAlpha = 1;
  }

  appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    } else {
      this.size -= 0.1;
    }

    this.draw();
  }

  shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    if (this.isReverse) {
      this.size -= this.speed;
    } else {
      this.size += this.speed;
    }
  }

  rain() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    this.y += this.velocity * this.rainDirection;
    this.opacity = this.rainDirection > 0
      ? Math.min(1, (this.height - this.y) / (this.height * 0.2))
      : Math.min(1, this.y / (this.height * 0.2));

    if (this.size < this.maxSize) {
      this.size += this.sizeStep;
    }

    if (this.rainDirection > 0 && this.y > this.height) {
      this.y = -this.maxSizeInteger;
      this.opacity = 0;
      this.delay = Math.random() * 60;
      this.counter = 0;
      this.velocity = this.getRandomValue(1, 4);
    } else if (this.rainDirection < 0 && this.y < -this.maxSizeInteger) {
      this.y = this.height;
      this.opacity = 0;
      this.delay = Math.random() * 60;
      this.counter = 0;
      this.velocity = this.getRandomValue(1, 4);
    }

    this.draw();
  }
}

class PixelCanvasElement extends HTMLElement {
  static register(tag = "pixel-canvas") {
    if ("customElements" in window && !customElements.get(tag)) {
      customElements.define(tag, this);
    }
  }

  static css = `
    :host {
      display: grid;
      inline-size: 100%;
      block-size: 100%;
      overflow: hidden;
    }
  `;

  get colors() {
    return this.dataset.colors?.split(",") || ["#f8fafc", "#f1f5f9", "#cbd5e1"];
  }
  set colors(v) { if (v) this.dataset.colors = v; }

  get gap() {
    const value = this.dataset.gap || 5;
    const min = 4;
    const max = 50;

    if (value <= min) {
      return min;
    } else if (value >= max) {
      return max;
    } else {
      return parseInt(value);
    }
  }
  set gap(v) { if (v != null) this.dataset.gap = v; }

  get speed() {
    const value = this.dataset.speed || 35;
    const min = 0;
    const max = 100;
    const throttle = 0.001;

    if (value <= min || this.reducedMotion) {
      return min;
    } else if (value >= max) {
      return max * throttle;
    } else {
      return parseInt(value) * throttle;
    }
  }
  set speed(v) { if (v != null) this.dataset.speed = v; }

  get noFocus() {
    return this.hasAttribute("data-no-focus");
  }
  set noFocus(v) { if (v) this.setAttribute("data-no-focus", ""); }

  get rain() {
    return this.hasAttribute("data-rain");
  }
  set rain(v) { if (v) this.setAttribute("data-rain", ""); }

  get rainDirection() {
    return parseInt(this.dataset.rainDirection) || 1;
  }
  set rainDirection(v) { if (v != null) this.dataset.rainDirection = v; }

  connectedCallback() {
    const canvas = document.createElement("canvas");
    const sheet = new CSSStyleSheet();

    this._parent = this.parentNode;
    this.shadowroot = this.attachShadow({ mode: "open" });

    sheet.replaceSync(PixelCanvasElement.css);

    this.shadowroot.adoptedStyleSheets = [sheet];
    this.shadowroot.append(canvas);
    this.canvas = this.shadowroot.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.timeInterval = 1000 / 60;
    this.timePrevious = performance.now();
    this.reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.resizeObserver = new ResizeObserver(() => this.init());
    this.resizeObserver.observe(this);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
    delete this._parent;
  }

  handleEvent(event) {
    this[`on${event.type}`](event);
  }

  onmouseenter() {
    this.handleAnimation("appear");
  }

  onmouseleave() {
    this.handleAnimation("disappear");
  }

  onfocusin(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    this.handleAnimation("appear");
  }

  onfocusout(e) {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    this.handleAnimation("disappear");
  }

  handleAnimation(name) {
    cancelAnimationFrame(this.animation);
    this.animation = this.animate(name);
  }

  init() {
    const rect = this.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);

    this.pixels = [];
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.createPixels();
  }

  getDistanceToCanvasCenter(x, y) {
    const dx = x - this.canvas.width / 2;
    const dy = y - this.canvas.height / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance;
  }

  createPixels() {
    const isRain = this.rain;
    const dir = this.rainDirection;

    for (let x = 0; x < this.canvas.width; x += this.gap) {
      for (let y = 0; y < this.canvas.height; y += this.gap) {
        const color = this.colors[
          Math.floor(Math.random() * this.colors.length)
        ];
        const delay = this.reducedMotion
          ? 0
          : this.getDistanceToCanvasCenter(x, y);

        const pixel = new Pixel(this.canvas, this.ctx, x, y, color, this.speed, delay);

        if (isRain) {
          pixel.y = Math.random() * this.canvas.height;
          pixel.velocity = pixel.getRandomValue(1, 4);
          pixel.delay = Math.random() * 60;
          pixel.rainDirection = dir;
        }

        this.pixels.push(pixel);
      }
    }
  }

  animate(fnName) {
    this.animation = requestAnimationFrame(() => this.animate(fnName));

    const timeNow = performance.now();
    const timePassed = timeNow - this.timePrevious;

    if (timePassed < this.timeInterval) return;

    this.timePrevious = timeNow - (timePassed % this.timeInterval);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.pixels.length; i++) {
      this.pixels[i][fnName]();
    }

    if (!this.rain && this.pixels.every((pixel) => pixel.isIdle)) {
      cancelAnimationFrame(this.animation);
    }
  }
}

PixelCanvasElement.register();
