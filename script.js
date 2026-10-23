/* AVEC VINCENT — coordonnées et service de contact publics.
   Lors d’une mise à jour, synchroniser aussi le HTML, les métadonnées
   et les informations légales. Aucun secret ne doit figurer ici. */
const CONFIG = Object.freeze({
  email: "contact@avecvincent.fr",
  phone: "+33 6 03 87 22 63",
  phoneLink: "+33603872263",
  formEndpoint: "https://script.google.com/macros/s/AKfycby7wINsDuFB15yDJCYJEE1Ya_2E6bA_VTM6MB31VdTW9Vag9DWaeOtDDbSQa-1fm-oW2g/exec"
});

document.documentElement.classList.add("has-js");

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menu = document.querySelector("#site-menu");
  const toggle = document.querySelector(".menu-button");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktop = window.matchMedia("(min-width:900px)");
  let menuMotion = null;
  let menuExpanded = false;
  const closeMenu = (instant = false) => setMenu(false, instant);
  const setMenu = (expanded, instant = false) => {
    if (!menu || !toggle) return;
    const visible = menu.classList.contains("open");
    const previous = getComputedStyle(menu);
    const opacity = visible ? previous.opacity : "0";
    const transform = visible ? previous.transform : "translateY(-6px)";
    menuMotion?.cancel();
    menuMotion = null;
    menuExpanded = expanded && !desktop.matches;
    toggle.setAttribute("aria-expanded", String(menuExpanded));
    toggle.setAttribute("aria-label", menuExpanded ? "Fermer le menu" : "Ouvrir le menu");
    const finish = () => {
      menu.classList.toggle("open", menuExpanded);
      menu.inert = !menuExpanded && !desktop.matches;
    };
    if (instant || desktop.matches || reducedMotion.matches || typeof menu.animate !== "function" || !visible && !expanded) { finish(); return; }
    menu.classList.add("open");
    menu.inert = !menuExpanded;
    const animation = menu.animate({opacity:[opacity, menuExpanded ? 1 : 0],transform:[transform, menuExpanded ? "translateY(0)" : "translateY(-6px)"]}, {duration:180,easing:"cubic-bezier(.2,.7,.3,1)",fill:"both"});
    menuMotion = animation;
    animation.finished.then(() => {
      if (menuMotion !== animation) return;
      finish();
      menuMotion = null;
      animation.cancel();
    }).catch(() => {});
  };
  const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 8);
  updateHeader();
  window.addEventListener("scroll", updateHeader, {passive:true});
  toggle?.addEventListener("click", () => {
    if (!menuExpanded) closePanels();
    setMenu(!menuExpanded);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuExpanded) {
      closeMenu(); toggle.focus();
    }
  });
  document.addEventListener("click", event => {
    if (menuExpanded && !header.contains(event.target)) closeMenu();
  });
  menu?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeMenu()));
  desktop.addEventListener("change", () => closeMenu(true));
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

  // Show the offer for one school level at a time; keep both sections readable without JS.
  document.querySelectorAll("[data-offer-browser]").forEach(browser => {
    const picker = browser.querySelector(".offer-picker");
    const tabs = Array.from(browser.querySelectorAll("[data-offer-tab]"));
    const views = Array.from(browser.querySelectorAll("[data-offer-panel]"));
    if (!picker || !tabs.length || !views.length) return;
    const wideOffer = window.matchMedia("(min-width:1000px)");
    let currentTab = null;
    let contentMotion = null;
    const select = (tab, focus = false) => {
      const changed = currentTab && currentTab !== tab;
      contentMotion?.cancel();
      contentMotion = null;
      tabs.forEach(item => {
        const active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      views.forEach(view => {
        const active = wideOffer.matches || view.dataset.offerPanel === tab.dataset.offerTab;
        view.hidden = !active;
        if (wideOffer.matches) {
          view.removeAttribute("role");
          view.setAttribute("aria-labelledby", "offre-" + view.dataset.offerPanel + "-titre");
          view.removeAttribute("tabindex");
        } else {
          view.setAttribute("role", "tabpanel");
          view.setAttribute("aria-labelledby", "offre-tab-" + view.dataset.offerPanel);
          view.tabIndex = 0;
        }
        if (active && changed && !wideOffer.matches && !reducedMotion.matches && typeof view.animate === "function") {
          contentMotion = view.animate({opacity:[0.3, 1]}, {duration:160, easing:"ease-out"});
        }
      });
      picker.hidden = wideOffer.matches;
      currentTab = tab;
      if (focus) tab.focus({preventScroll:true});
    };
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => select(tab));
      tab.addEventListener("keydown", event => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") next = 0;
        if (event.key === "End") next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(tabs[next], true);
      });
    });
    select(tabs[0]);
    wideOffer.addEventListener("change", () => {
      const focusedView = views.find(view => view.contains(document.activeElement));
      const focusedTab = focusedView && tabs.find(tab => tab.dataset.offerTab === focusedView.dataset.offerPanel);
      select(focusedTab || currentTab || tabs[0]);
    });
    browser.classList.add("has-offer-picker");
  });

  // Keep native details without JavaScript; enhance each disclosure by its purpose.
  const panels = Array.from(document.querySelectorAll('details[name="page-panels"]'));
  const panelStates = new Map();
  const setPanel = (panel, expanded, animate = true) => {
    const state = panelStates.get(panel);
    if (!state) { panel.open = expanded; return; }
    if (state.expanded === expanded && !state.animation && panel.open === expanded) return;
    const from = panel.getBoundingClientRect().height;
    const opacity = getComputedStyle(state.body).opacity;
    state.animation?.cancel();
    state.fade?.cancel();
    state.animation = null;
    state.fade = null;
    state.expanded = expanded;
    state.summary.setAttribute("aria-expanded", String(expanded));
    state.body.inert = !expanded;
    state.body.setAttribute("aria-hidden", String(!expanded));
    panel.dataset.disclosureState = expanded ? "open" : "closing";
    if (!animate || reducedMotion.matches || typeof panel.animate !== "function") {
      panel.open = expanded;
      panel.style.height = "";
      panel.style.overflow = "";
      panel.dataset.disclosureState = expanded ? "open" : "closed";
      return;
    }
    // Hold the native body visible until the closing height transition finishes.
    panel.open = true;
    panel.style.height = "auto";
    const borders = parseFloat(getComputedStyle(panel).borderTopWidth) + parseFloat(getComputedStyle(panel).borderBottomWidth);
    const to = expanded ? panel.getBoundingClientRect().height : state.summary.getBoundingClientRect().height + borders;
    panel.style.height = from + "px";
    panel.style.overflow = "hidden";
    const course = panel.classList.contains("course-item");
    const duration = course ? 330 : 210;
    const animation = panel.animate({height:[from + "px", to + "px"]}, {duration, easing:course ? "cubic-bezier(.22,1,.36,1)" : "cubic-bezier(.2,.7,.3,1)", fill:"both"});
    state.animation = animation;
    if (course) state.fade = state.body.animate({opacity:[expanded && from <= state.summary.offsetHeight + borders + 1 ? 0 : opacity, expanded ? 1 : 0]}, {duration:expanded ? 240 : 150, easing:"ease-out", fill:"both"});
    animation.finished.then(() => {
      if (state.animation !== animation) return;
      panel.open = state.expanded;
      panel.style.height = "";
      panel.style.overflow = "";
      panel.dataset.disclosureState = state.expanded ? "open" : "closed";
      state.animation = null;
      state.fade?.cancel();
      state.fade = null;
      animation.cancel();
    }).catch(() => {}); // Interrupted taps resume from the current visible height.
  };
  const closePanels = except => panels.forEach(panel => {
    if (panel !== except && panelStates.get(panel)?.expanded) setPanel(panel, false);
  });
  panels.forEach(panel => {
    const summary = panel.querySelector("summary");
    if (!summary) return;
    const body = document.createElement("div");
    body.className = "disclosure-content";
    while (summary.nextSibling) body.append(summary.nextSibling);
    panel.append(body);
    const expanded = panel.open;
    panelStates.set(panel, {summary, body, expanded, animation:null, fade:null});
    // Native exclusivity would remove the old body before its closing can animate.
    panel.removeAttribute("name");
    panel.dataset.disclosureState = expanded ? "open" : "closed";
    summary.setAttribute("aria-expanded", String(expanded));
    body.inert = !expanded;
    body.setAttribute("aria-hidden", String(!expanded));
    summary.addEventListener("click", event => {
      event.preventDefault();
      const opening = !panelStates.get(panel).expanded;
      if (opening) { closePanels(panel); closeMenu(); }
      setPanel(panel, opening);
    });
  });
  document.addEventListener("toggle", event => {
    const panel = event.target;
    if (panel.tagName !== "DETAILS") return;
    const state = panelStates.get(panel);
    if (!state || state.animation) return;
    if (panel.open !== state.expanded) setPanel(panel, panel.open, false);
    if (panel.open) { closePanels(panel); closeMenu(); }
  }, true);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) panels.forEach(panel => setPanel(panel, panelStates.get(panel).expanded, false));
  });

  closeMenu(true);
  // Preserve existing subject and legal fragment links when a target is a disclosure.
  const openFragment = () => {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    const disclosure = target?.closest("details");
    if (disclosure) {
      closePanels(disclosure);
      setPanel(disclosure, true, false);
      requestAnimationFrame(() => disclosure.scrollIntoView({block:"start"}));
    }
  };
  openFragment();
  window.addEventListener("hashchange", openFragment);

  const form = document.querySelector("#formulaire");
  if (!form) return;
  // Retain the subject of a course link without adding another question.
  // The existing endpoint requires nonempty level and subject values:
  // level explicitly points to the visitor's message, never an inferred class.
  const subject = form.elements.namedItem("subject");
  const params = new URLSearchParams(window.location.search);
  const aliases = {"Géopolitique & HGGSP": "Géopolitique / HGGSP", "bac · BCE · ECRICOME": "Bac / BCE / ECRICOME", "BAC · BCE · ECRICOME": "Bac / BCE / ECRICOME", "BAC": "Bac"};
  const requested = params.get("demande") === "specifique" ? "Demande spécifique" : (aliases[params.get("matiere")] || params.get("matiere"));
  const subjects = ["Mathématiques", "Géopolitique / HGGSP", "Anglais", "Allemand", "Français", "Philosophie", "Méthodologie", "bac", "Bac", "BCE / ECRICOME", "Bac / BCE / ECRICOME", "Demande spécifique"];
  const context = requested && subjects.includes(requested) ? requested : "Premier contact";
  subject.value = context;
  subject.defaultValue = context;
  const status = form.querySelector(".form-status");
  const submitButton = form.querySelector('button[type="submit"]');
  let sending = false;
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    sending = true;
    submitButton.disabled = true;
    form.setAttribute("aria-busy", "true");
    status.dataset.kind = "pending";
    status.textContent = "Envoi du message…";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    try {
      // A simple URL-encoded POST avoids preflight. Success requires the API's explicit acknowledgement.
      const response = await fetch(CONFIG.formEndpoint, {method:"POST", body:new URLSearchParams(new FormData(form)), signal:controller.signal, credentials:"omit", redirect:"follow"});
      if (!response.ok) throw new Error("http_error");
      const result = await response.json();
      if (result.ok !== true || typeof result.reference !== "string" || !result.reference.trim()) throw new Error("unconfirmed");
      form.reset();
      status.dataset.kind = "success";
      status.textContent = "Le message a bien été reçu. Référence : " + result.reference + ". Je répondrai personnellement par e-mail.";
    } catch (error) {
      status.dataset.kind = "error";
      status.textContent = "La réception du message n’a pas pu être confirmée. Les informations sont conservées dans le formulaire. Pour vérifier sa réception ou me contacter : " + CONFIG.email + ".";
    } finally {
      clearTimeout(timeout);
      sending = false;
      submitButton.disabled = false;
      form.removeAttribute("aria-busy");
    }
  });
});
