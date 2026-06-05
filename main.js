(function () {
  const chrome = document.getElementById("site-chrome");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = nav ? nav.querySelectorAll('a[href^="#"]') : [];

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  function updateChrome() {
    if (!chrome) return;
    chrome.classList.toggle("is-solid", window.scrollY > 60);
  }

  window.addEventListener("scroll", updateChrome, { passive: true });
  updateChrome();

  const sections = document.querySelectorAll(".panel[id], .hero");
  const linkMap = new Map();
  navLinks.forEach(function (link) {
    const id = link.getAttribute("href").slice(1);
    if (id) linkMap.set(id, link);
  });

  if (sections.length && linkMap.size) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach(function (l) {
            l.classList.remove("is-active");
          });
          const active = linkMap.get(id);
          if (active) active.classList.add("is-active");
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach(function (section) {
      if (section.id) observer.observe(section);
    });
  }

  document.querySelectorAll(
    ".intro, .about-split, .team-grid, .reviews-grid, .gallery-grid, .visit-card"
  ).forEach(function (el) {
    el.classList.add("reveal");
  });

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (lightbox && lightboxImg) {
    document.querySelectorAll(".gallery-cell").forEach(function (cell) {
      cell.addEventListener("click", function () {
        const img = cell.querySelector("img");
        const full = cell.getAttribute("data-full");
        if (!img || !full) return;
        lightboxImg.src = full;
        lightboxImg.alt = img.alt;
        lightbox.showModal();
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", function () {
        lightbox.close();
      });
    }

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) lightbox.close();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.open) lightbox.close();
    });

    lightbox.addEventListener("close", function () {
      lightboxImg.removeAttribute("src");
    });
  }
})();
