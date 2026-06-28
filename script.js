document.documentElement.classList.add("js-enabled");

const header = document.querySelector("[data-header]");
const revealItems = document.querySelectorAll(".reveal");
const marqueeTrack = document.querySelector(".marquee-track");

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const revealAll = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
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
} else {
  revealAll();
}

window.addEventListener("pageshow", revealAll, { once: true });
window.addEventListener("load", revealAll, { once: true });
window.setTimeout(revealAll, 1200);

if (marqueeTrack) {
  const cards = Array.from(marqueeTrack.children);
  cards.forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    marqueeTrack.appendChild(clone);
  });
}
