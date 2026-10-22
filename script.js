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
    el.textContent = value || (email ? "E-mail non renseigné" : "Téléphone non renseigné");
    if (value) {
      el.href = email ? "mailto:" + value : "tel:" + CONFIG.phoneLink;
      el.removeAttribute("aria-disabled");
    } else {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
    }
  });

  const form = document.querySelector("#formulaire");
  if (!form) return;
  const subject = form.elements.namedItem("subject");
  const level = form.elements.namedItem("level");
  const params = new URLSearchParams(window.location.search);
  const aliases = {"Géopolitique & HGGSP": "Géopolitique / HGGSP", "bac · BCE · ECRICOME": "Bac / BCE / ECRICOME", "BAC · BCE · ECRICOME": "Bac / BCE / ECRICOME", "BAC": "bac"};
  const requested = params.get("demande") === "specifique" ? "Autre / demande spécifique" : (aliases[params.get("matiere")] || params.get("matiere"));
  if (requested && Array.from(subject.options).some(option => option.value === requested)) subject.value = requested;
  const validatePair = () => {
    const invalid = level.value.startsWith("Prépa") && ["Français", "Philosophie", "bac"].includes(subject.value);
    subject.setCustomValidity(invalid ? "Cette matière est proposée uniquement au lycée. Pour une demande particulière en prépa, choisissez « Autre / demande spécifique »." : "");
  };
  subject.addEventListener("change", validatePair);
  level.addEventListener("change", validatePair);
  validatePair();
  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  let sending = false;
  form.addEventListener("submit", async event => {
    event.preventDefault();
    validatePair();
    if (sending || !form.reportValidity()) return;
    sending = true;
    submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.dataset.kind = "pending";
    status.textContent = "Envoi de votre demande…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      // A simple URL-encoded POST avoids preflight. Success requires the API's explicit acknowledgement.
      const response = await fetch(CONFIG.formEndpoint, {method:"POST", body:new URLSearchParams(new FormData(form)), signal:controller.signal, credentials:"omit", redirect:"follow"});
      if (!response.ok) throw new Error("http_error");
      const result = await response.json();
      if (result.ok !== true || typeof result.reference !== "string" || !result.reference.trim()) throw new Error("unconfirmed");
      form.reset();
      validatePair();
      status.dataset.kind = "success";
      status.textContent = "Votre demande a bien été reçue. Référence : " + result.reference + ". Je vous répondrai personnellement par e-mail.";
    } catch (error) {
      status.dataset.kind = "error";
      status.textContent = "La réception de votre demande n’a pas pu être confirmée. Vos informations sont conservées dans le formulaire. Pour vérifier sa réception ou me contacter, écrivez à " + CONFIG.email + ".";
    } finally {
      clearTimeout(timeout);
      sending = false;
      submitButton.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
});
