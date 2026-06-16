const products = {
  auto: [
    {
      icon: "Car.svg",
      name: "КАСКО Лайт",
      text: "Подходит клиенту, который хочет закрыть риск угона и крупного ремонта без полной программы.",
      value: "от 2 900 ₽/мес",
    },
    {
      icon: "Shield.svg",
      name: "ОСАГО плюс",
      text: "Быстрый апсейл к обязательному полису: юридическая поддержка и расширенная защита.",
      value: "+12% к чеку",
    },
    {
      icon: "Truck.svg",
      name: "Коммерческий парк",
      text: "Единый договор для малого бизнеса с несколькими авто и гибким графиком оплат.",
      value: "1 договор",
    },
  ],
  life: [
    {
      icon: "Heart.svg",
      name: "Защита жизни",
      text: "Аргумент для клиентов с ипотекой, семьей или высокой финансовой нагрузкой.",
      value: "до 5 млн ₽",
    },
    {
      icon: "Activity.svg",
      name: "Здоровье 24/7",
      text: "Телемедицина, диагностика и помощь при внезапных расходах на лечение.",
      value: "онлайн",
    },
    {
      icon: "Users.svg",
      name: "Семейный контур",
      text: "Пакетная защита для семьи, где агент продает не один полис, а спокойствие для всех.",
      value: "4 роли",
    },
  ],
  property: [
    {
      icon: "Home.svg",
      name: "Квартира",
      text: "Лучший второй продукт после авто: понятный риск, быстрый расчет и частые триггеры.",
      value: "2 минуты",
    },
    {
      icon: "Umbrella.svg",
      name: "Гражданская ответственность",
      text: "Мягкая допродажа к недвижимости: защита от затрат перед соседями и третьими лицами.",
      value: "низкий чек",
    },
    {
      icon: "Briefcase.svg",
      name: "Малый бизнес",
      text: "Защита имущества, оборудования и перерывов в работе для предпринимателей.",
      value: "B2B",
    },
  ],
};

const offerCopy = {
  renewal: {
    title: "Запустить сценарий продления",
    copy: "Подготовим предложение для клиента, у которого скоро заканчивается полис.",
  },
  bundle: {
    title: "Собрать пакет авто + дом",
    copy: "Покажем клиенту экономию при покупке второго продукта в одном разговоре.",
  },
  family: {
    title: "Предложить семейную защиту",
    copy: "Сформируем аргументы для клиента, который принимает решения за всю семью.",
  },
};

const productGrid = document.querySelector("[data-product-grid]");
const tabs = document.querySelectorAll("[data-category]");
const offerRows = document.querySelectorAll("[data-offer]");
const requestTitle = document.querySelector("[data-request-title]");
const requestCopy = document.querySelector("[data-request-copy]");
const requestForm = document.querySelector("[data-request-form]");
const formStatus = document.querySelector("[data-form-status]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function renderProducts(category) {
  productGrid.innerHTML = products[category]
    .map(
      (product) => `
        <article class="product-card">
          <div>
            <header>
              <img class="product-icon" src="../icons/${product.icon}" alt="" />
              <img src="../icons/ArrowRight.svg" alt="" width="20" height="20" />
            </header>
            <h3>${product.name}</h3>
            <p>${product.text}</p>
          </div>
          <footer>
            <span>${product.value}</span>
            <span>подобрать</span>
          </footer>
        </article>
      `
    )
    .join("");
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.toggle("active", item === tab);
      item.setAttribute("aria-selected", item === tab ? "true" : "false");
    });
    renderProducts(tab.dataset.category);
  });
});

offerRows.forEach((row) => {
  row.addEventListener("click", () => {
    offerRows.forEach((item) => item.classList.toggle("active", item === row));
    const selected = offerCopy[row.dataset.offer];
    requestTitle.textContent = selected.title;
    requestCopy.textContent = selected.copy;
  });
});

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const panel = trigger.nextElementSibling;
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!isOpen));
    trigger.querySelector("img").src = `../icons/${isOpen ? "ChevronDown.svg" : "ChevronUp.svg"}`;
    panel.hidden = isOpen;
  });
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

requestForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = Array.from(requestForm.querySelectorAll("input"));
  const invalid = fields.filter((field) => !field.value.trim());
  fields.forEach((field) => field.classList.toggle("error", invalid.includes(field)));

  if (invalid.length) {
    formStatus.textContent = "Заполните имя и телефон, чтобы сформировать предложение.";
    formStatus.style.color = "var(--text-error)";
    invalid[0].focus();
    return;
  }

  formStatus.textContent = "Готово: сценарий и предложение подготовлены для звонка.";
  formStatus.style.color = "var(--text-success-contrast)";
  requestForm.reset();
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
renderProducts("auto");
