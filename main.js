const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".nav-link")];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (menuButton && siteNav) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "باز کردن فهرست");
    siteNav.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "باز کردن فهرست" : "بستن فهرست");
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!siteNav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window && !reduceMotion) {
  document.documentElement.classList.add("motion-ready");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const trackedSections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window && navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${entry.target.id}`) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-32% 0px -55% 0px" },
  );

  trackedSections.forEach((section) => sectionObserver.observe(section));
}

const quizShell = document.querySelector(".quiz-shell");
const quizOptions = [...document.querySelectorAll(".quiz-option")];
const quizProgressCount = document.querySelector(".quiz-progress-count");
const reflectionForm = document.querySelector("#reflection-form");
const quizNote = document.querySelector("#quiz-note");
const quizSubmit = document.querySelector(".quiz-submit");
const quizSuccess = document.querySelector(".quiz-success");

const quizResponses = {
  wishes: "خواسته‌ای که دوست دارم روشن بماند این است که ... این موضوع برایم مهم است چون ...",
  values: "چیزی که در زندگی برایم ارزشمند است ... دوست دارم عزیزانم بدانند که ...",
  message: "عزیزانم، اگر روزی خواستید یاد من کنید، دوست دارم این را بدانید: ...",
};

let selectedAnswer = "";
let lastSuggestedNote = "";

quizOptions.forEach((option) => {
  option.addEventListener("click", () => {
    quizOptions.forEach((item) => {
      const selected = item === option;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    const answer = option.dataset.answer;
    const response = quizResponses[answer];
    const noteWasUntouched = !quizNote?.value.trim() || quizNote.value === lastSuggestedNote;

    selectedAnswer = answer;
    if (response && quizNote) {
      quizNote.disabled = false;
      if (noteWasUntouched) {
        quizNote.value = response;
        lastSuggestedNote = response;
      }
    }

    if (quizSubmit) quizSubmit.hidden = false;
    if (quizSuccess) quizSuccess.hidden = true;
    if (quizShell) quizShell.classList.add("has-answer");
    if (quizProgressCount) quizProgressCount.textContent = "۱ / ۱";
  });
});

quizNote?.addEventListener("input", () => {
  if (quizSuccess) quizSuccess.hidden = true;
});

reflectionForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedAnswer) return;
  if (quizSuccess) quizSuccess.hidden = false;
});
