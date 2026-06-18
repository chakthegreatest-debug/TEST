const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const leadForm = document.querySelector("[data-lead-form]");
const formStatus = document.querySelector("[data-form-status]");

document.querySelectorAll("img[data-photo]").forEach((image) => {
  const candidate = new Image();
  candidate.onload = () => {
    image.src = image.dataset.photo;
  };
  candidate.src = image.dataset.photo;
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  menuToggle.querySelector("img").src = `../icons/${isOpen ? "X.svg" : "Menu.svg"}`;
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-label", "Открыть меню");
    menuToggle.querySelector("img").src = "../icons/Menu.svg";
  });
});

document.querySelectorAll(".faq-item button").forEach((button) => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.querySelector("img").src = `../icons/${isOpen ? "ChevronDown.svg" : "ChevronUp.svg"}`;
    panel.hidden = isOpen;
  });
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const required = Array.from(leadForm.querySelectorAll("[required]"));
  const invalid = required.filter((field) => {
    if (field.type === "checkbox") return !field.checked;
    return !field.value.trim();
  });

  required.forEach((field) => field.classList.toggle("error", invalid.includes(field)));

  if (invalid.length) {
    formStatus.textContent = "Заполните обязательные поля и согласие на обработку данных.";
    formStatus.style.color = "var(--text-error)";
    invalid[0].focus();
    return;
  }

  formStatus.textContent = "Демо: заявка подготовлена. Интеграция отправки пока не подключена.";
  formStatus.style.color = "var(--text-success-contrast)";
  leadForm.reset();
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".section-reveal").forEach((section) => observer.observe(section));
