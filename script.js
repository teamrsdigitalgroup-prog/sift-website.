document.documentElement.classList.add("js-enabled");

const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const marqueeTrack = document.querySelector(".marquee-track");
const countItems = document.querySelectorAll("[data-count]");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const demoSteps = Array.from(document.querySelectorAll("[data-demo-step]"));
const demoToggle = document.querySelector("[data-demo-toggle]");
const demoIcon = document.querySelector("[data-demo-icon]");
const demoDelays = [700, 900, 2200, 900, 1200, 1900, 1000];
let demoTimer;
let demoIndex = 0;
let demoPaused = false;

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const revealAll = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

const countUp = (item) => {
  if (item.dataset.counted === "true") return;

  const target = Number(item.dataset.count);
  item.dataset.counted = "true";

  if (motionQuery.matches || Number.isNaN(target)) {
    item.textContent = String(target);
    return;
  }

  const duration = 800;
  const startedAt = performance.now();
  item.textContent = "0";

  const tick = (now) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    item.textContent = String(Math.round(eased * target));

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const startCounts = () => {
  countItems.forEach(countUp);
};

const showFinalDemoState = () => {
  window.clearTimeout(demoTimer);
  demoSteps.forEach((step) => step.classList.add("is-done"));
};

const resetDemo = () => {
  demoSteps.forEach((step) => step.classList.remove("is-active", "is-done"));
  demoIndex = 0;
};

const runDemoStep = () => {
  if (demoPaused || motionQuery.matches || demoSteps.length === 0) return;

  if (demoIndex === 0) {
    resetDemo();
  }

  const step = demoSteps[demoIndex];
  step.classList.add("is-active", "is-done");
  demoIndex += 1;

  const delay = demoDelays[demoIndex - 1] || 900;

  if (demoIndex >= demoSteps.length) {
    demoTimer = window.setTimeout(() => {
      demoIndex = 0;
      runDemoStep();
    }, 2600);
  } else {
    demoTimer = window.setTimeout(runDemoStep, delay);
  }
};

const startDemo = () => {
  if (motionQuery.matches) {
    showFinalDemoState();
    return;
  }

  window.clearTimeout(demoTimer);
  runDemoStep();
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounts();
          countObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );

  const heroDemo = document.querySelector(".hero-demo");
  if (heroDemo) {
    countObserver.observe(heroDemo);
  } else {
    startCounts();
  }
} else {
  revealAll();
  startCounts();
}

window.addEventListener("pageshow", revealAll, { once: true });
window.addEventListener("load", revealAll, { once: true });
window.setTimeout(revealAll, 1200);
window.setTimeout(startCounts, 1400);
window.setTimeout(startDemo, 500);

if (demoToggle) {
  demoToggle.addEventListener("click", () => {
    demoPaused = !demoPaused;
    demoToggle.classList.toggle("is-paused", demoPaused);
    demoToggle.setAttribute("aria-label", demoPaused ? "Play hero demo" : "Pause hero demo");
    if (demoIcon) {
      demoIcon.textContent = demoPaused ? "▶" : "Ⅱ";
    }

    if (demoPaused) {
      window.clearTimeout(demoTimer);
    } else {
      runDemoStep();
    }
  });
}

if (marqueeTrack) {
  const cards = Array.from(marqueeTrack.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.appendChild(clone);
  });
}
