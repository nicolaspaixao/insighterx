const menuButton = document.querySelector(".menu-button");
const menu = document.querySelector("#main-menu");

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("open", !open);
});

menu.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  menuButton.setAttribute("aria-expanded", "false");
  menu.classList.remove("open");
});

document.querySelectorAll('a[href="#topo"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    history.replaceState(null, "", window.location.pathname + window.location.search);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const form = document.querySelector(".contact-form");
const status = document.querySelector(".form-status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = form.querySelector("button");
  button.disabled = true;
  status.textContent = "Enviando sua mensagem…";
  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Falha no envio");
    form.reset();
    status.textContent = "Mensagem enviada. Em breve entraremos em contato.";
  } catch {
    status.textContent = "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.";
  } finally {
    button.disabled = false;
  }
});
