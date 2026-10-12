/* AVEC VINCENT — configuration publique unique.
   Pour changer vos coordonnées, modifier uniquement ces valeurs.
   SIREN, SIRET et numéro SAP se complètent dans legal.html. */
const CONFIG = Object.freeze({
  email: "contact@avecvincent.fr",
  phone: "+33 6 03 87 22 63",
  phoneLink: "+33603872263",
  formEndpoint: "https://script.google.com/macros/s/AKfycby7wINsDuFB15yDJCYJEE1Ya_2E6bA_VTM6MB31VdTW9Vag9DWaeOtDDbSQa-1fm-oW2g/exec"
});

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menu = document.querySelector("#site-menu");
  const toggle = document.querySelector(".menu-button");
  const closeMenu = () => {
    menu?.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
    toggle?.setAttribute("aria-label", "Ouvrir le menu");
  };
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, {passive:true});
  toggle?.addEventListener("click", () => {
    const opened = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute("aria-label", opened ? "Fermer le menu" : "Ouvrir le menu");
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.classList.contains("open")) {
      closeMenu(); toggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (menu?.classList.contains("open") && !header.contains(event.target)) closeMenu();
  });
  menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  const desktop = window.matchMedia("(min-width:781px)");
  desktop.addEventListener("change", closeMenu);
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll("[data-contact]").forEach(el => {
    const email = el.dataset.contact === "email";
    const value = email ? CONFIG.email : CONFIG.phone;
    el.textContent = value || (email ? "E-mail à compléter" : "Téléphone à compléter");
    if (value) {
      el.href = email ? "mailto:" + value : "tel:" + CONFIG.phoneLink;
      el.removeAttribute("aria-disabled");
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
    }
  });

  // Une seule animation discrète au défilement : le contenu reste lisible sans JS.
  const revealItems = document.querySelectorAll("[data-reveal]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealItems.length && !reducedMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-reveal");
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, {rootMargin: "0px 0px -12% 0px", threshold: 0.08});
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  const form = document.querySelector("#formulaire");
  if (!form) return;
  const subject = form.elements.namedItem("subject");
  const params = new URLSearchParams(window.location.search);
  const aliases = {
    "Géopolitique & HGGSP": "Géopolitique / HGGSP",
    "BAC · BCE · ECRICOME": "BCE / ECRICOME"
  };
  const requested = params.get("demande") === "specifique"
    ? "Autre / demande spécifique"
    : (aliases[params.get("matiere")] || params.get("matiere"));
  if (requested && Array.from(subject.options).some(option => option.value === requested)) subject.value = requested;
  const status = form.querySelector(".form-status");
  const emailFallback = CONFIG.email;
  const submitButton = form.querySelector('button[type="submit"]');
  const responseFrame = document.querySelector("#form-response");
  const toast = document.querySelector("#form-toast");
  let awaitingResponse = false;
  let requestTimer;
  let toastTimer;
  let toastHideTimer;
  const showToast = (message, kind = "success") => {
    if (!toast) return;
    clearTimeout(toastTimer);
    clearTimeout(toastHideTimer);
    toast.textContent = message;
    toast.dataset.kind = kind;
    toast.hidden = false;
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
      toastHideTimer = setTimeout(() => { toast.hidden = true; }, 260);
    }, kind === "pending" ? 15000 : 6500);
  };
  const finishRequest = () => {
    awaitingResponse = false;
    clearTimeout(requestTimer);
    if (submitButton) submitButton.disabled = false;
  };
  form.action = CONFIG.formEndpoint;
  responseFrame?.addEventListener("load", () => {
    if (!awaitingResponse) return;
    finishRequest();
    form.reset();
    status.textContent = "Votre demande a bien été transmise.";
    showToast("Demande envoyée. Je vous répondrai rapidement par e-mail.");
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (!CONFIG.formEndpoint || CONFIG.formEndpoint.includes("REPLACE_WITH")) {
      status.textContent = "Le formulaire est en cours de configuration. Vous pouvez écrire à " + emailFallback + ".";
      showToast("Le formulaire est momentanément indisponible. Écrivez à " + emailFallback + ".", "error");
      return;
    }
    awaitingResponse = true;
    if (submitButton) submitButton.disabled = true;
    status.textContent = "Envoi de votre demande…";
    showToast("Envoi de votre demande…", "pending");
    requestTimer = setTimeout(() => {
      if (!awaitingResponse) return;
      finishRequest();
      status.textContent = "La confirmation n’a pas pu être reçue. Vous pouvez écrire à " + emailFallback + ".";
      showToast("Le délai de réponse est dépassé. Vérifiez votre boîte mail ou écrivez à " + emailFallback + ".", "error");
    }, 15000);
    HTMLFormElement.prototype.submit.call(form);
  });
});
