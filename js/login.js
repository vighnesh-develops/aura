const LOGIN_KEY = "aurasound_user";
const form = document.getElementById("loginForm");

if (localStorage.getItem(LOGIN_KEY) && window.location.pathname.endsWith("login.html")) {
  window.location.href = "index.html";
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  localStorage.setItem(LOGIN_KEY, JSON.stringify({ email, loggedInAt: new Date().toISOString() }));
  window.location.href = "index.html";
});
