document.documentElement.classList.add("js-enabled");

const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const marqueeTrack = document.querySelector(".marquee-track");
const countItems = document.querySelectorAll("[data-count]");
const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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

if (marqueeTrack) {
  const cards = Array.from(marqueeTrack.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.appendChild(clone);
  });
}

const mindmap = document.querySelector("[data-mindmap]");

if (mindmap) {
  const toggles = mindmap.querySelectorAll("[data-mm-toggle]");

  const setHeight = (childrenEl) => {
    childrenEl.style.maxHeight = `${childrenEl.scrollHeight}px`;
  };

  const recalcAllOpenAncestorsOf = (item) => {
    let current = item;
    while (current) {
      const childrenEl = current.querySelector(":scope > [data-mm-children]");
      if (childrenEl && current.classList.contains("mm-item-open")) {
        setHeight(childrenEl);
      }
      const parentChildren = current.parentElement?.closest("[data-mm-children]");
      current = parentChildren ? parentChildren.closest("[data-mm-item]") : null;
    }
  };

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest("[data-mm-item]");
      if (!item) return;

      const isOpen = item.classList.contains("mm-item-open");
      const willOpen = !isOpen;
      item.classList.toggle("mm-item-open", willOpen);
      toggle.setAttribute("aria-expanded", String(willOpen));

      const childrenEl = item.querySelector(":scope > [data-mm-children]");

      if (willOpen && childrenEl) {
        const items = Array.from(childrenEl.children);
        items.forEach((child, index) => {
          child.style.transitionDelay = motionQuery.matches ? "0ms" : `${index * 70}ms`;
        });
        setHeight(childrenEl);
      } else if (childrenEl) {
        childrenEl.style.maxHeight = "0px";
      }

      // Walk up: every open ancestor's max-height must grow/shrink to fit this change.
      recalcAllOpenAncestorsOf(item.parentElement?.closest("[data-mm-item]"));

      // After the transition finishes, re-measure once more in case fonts/layout shifted.
      window.setTimeout(() => recalcAllOpenAncestorsOf(item), 600);
    });
  });

  window.addEventListener("resize", () => {
    mindmap.querySelectorAll(".mm-item-open > [data-mm-children]").forEach(setHeight);
  });
}

// Hero video: click anywhere on it to toggle play/pause, tap the corner button to
// unmute. Pauses automatically when scrolled out of view, resumes when scrolled back
// in (but only if the person hadn't manually paused it). Requires enablejsapi=1.
const heroVideoWrapper = document.querySelector("[data-video-wrapper]");

if (heroVideoWrapper) {
  const iframe = heroVideoWrapper.querySelector("[data-video-frame]");
  const toggleButton = heroVideoWrapper.querySelector("[data-video-toggle]");
  const unmuteButton = heroVideoWrapper.querySelector("[data-video-unmute]");

  if (iframe) {
    let isPlaying = true;
    let isMuted = true;
    let manuallyPaused = false;

    const postPlayerCommand = (func, args = []) => {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args }), "*");
    };

    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        if (isPlaying) {
          postPlayerCommand("pauseVideo");
          isPlaying = false;
          manuallyPaused = true;
        } else {
          postPlayerCommand("playVideo");
          isPlaying = true;
          manuallyPaused = false;
        }
      });
    }

    if (unmuteButton) {
      unmuteButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (isMuted) {
          postPlayerCommand("unMute");
          postPlayerCommand("setVolume", [100]);
          isMuted = false;
        } else {
          postPlayerCommand("mute");
          isMuted = true;
        }
        unmuteButton.setAttribute("aria-pressed", String(!isMuted));
        unmuteButton.setAttribute("aria-label", isMuted ? "Unmute video" : "Mute video");
      });
    }

    if (!motionQuery.matches && "IntersectionObserver" in window) {
      const videoObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (manuallyPaused) return;
            if (entry.isIntersecting) {
              postPlayerCommand("playVideo");
              isPlaying = true;
            } else {
              postPlayerCommand("pauseVideo");
              isPlaying = false;
            }
          });
        },
        { threshold: 0.2 }
      );

      videoObserver.observe(heroVideoWrapper);
    }
  }
}


