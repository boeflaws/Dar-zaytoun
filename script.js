/* ==========================================================
   Dar Zaytoun: demo restaurant site
   ========================================================== */

/* >>> REPLACE THIS PLACEHOLDER <<<
   WhatsApp number in international format, digits only, no "+" or spaces.
   Example format: country code 212 (Morocco) followed by the number without the leading 0.
   While it is still the placeholder below, WhatsApp will not reach a real restaurant. */
const WHATSAPP_NUMBER = "000000000000"; // PLACEHOLDER, replace with the restaurant's number

/* Restaurant name used in the WhatsApp message */
const RESTAURANT_NAME = "Dar Zaytoun";

(function () {
  "use strict";

  const waBase = "https://wa.me/" + WHATSAPP_NUMBER;

  /* ---------- Generic WhatsApp buttons ---------- */
  document.querySelectorAll(".js-whatsapp").forEach(function (link) {
    link.addEventListener("click", function (e) {
      // Header button scrolls to the form on small screens; the other opens WhatsApp directly
      if (link.classList.contains("nav-cta")) return;
      e.preventDefault();
      const text = encodeURIComponent("Hello " + RESTAURANT_NAME + ", I would like to ask about a reservation.");
      window.open(waBase + "?text=" + text, "_blank", "noopener");
    });
  });

  /* ---------- Mobile navigation ---------- */
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  function setNav(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setNav(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setNav(false); toggle.focus(); }
  });

  /* ---------- Menu tabs (with arrow-key support) ---------- */
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      const active = t === tab;
      t.setAttribute("aria-selected", String(active));
      t.tabIndex = active ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      let next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); selectTab(next); next.focus(); }
    });
  });

  /* ---------- Reservation form -> WhatsApp message ---------- */
  const form = document.getElementById("reservationForm");
  const dateInput = document.getElementById("date");

  // Do not allow past dates
  dateInput.min = new Date().toISOString().split("T")[0];

  function showError(id, message) {
    const input = document.getElementById(id);
    document.getElementById("err-" + id).textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return !message;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = form.name.value.trim();
    const people = parseInt(form.people.value, 10);
    const date = form.date.value;
    const time = form.time.value;

    const checks = [
      showError("name", name ? "" : "Please enter your name."),
      showError("people", people >= 1 && people <= 20 ? "" : "Enter a number of people between 1 and 20."),
      showError("date", date ? "" : "Please choose a date."),
      showError("time", time ? "" : "Please choose a time.")
    ];
    if (checks.includes(false)) {
      form.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    // Show the date in a readable format
    const prettyDate = new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    // Edit the wording of the WhatsApp message here
    const message =
      "Hello " + RESTAURANT_NAME + ", I would like to reserve a table.\n\n" +
      "Name: " + name + "\n" +
      "People: " + people + "\n" +
      "Date: " + prettyDate + "\n" +
      "Time: " + time + "\n\n" +
      "Please confirm availability. Thank you!";

    window.open(waBase + "?text=" + encodeURIComponent(message), "_blank", "noopener");
  });

  /* ---------- Image fallback ----------
     If a photo URL stops working, hide the broken image so the
     olive/gold background behind it shows instead of an error icon. */
  document.addEventListener("error", function (e) {
    if (e.target.tagName === "IMG") e.target.style.visibility = "hidden";
  }, true);
})();
