const AURASOUND_LOGIN_KEY = "aurasound_user";

if (!localStorage.getItem(AURASOUND_LOGIN_KEY)) {
  window.location.href = "login.html";
}
