(function () {
  if (typeof window === "undefined") return;
  if (Object.prototype.hasOwnProperty.call(window, "AURASOUND_API_BASE")) return;
  const { protocol, hostname, port } = window.location;
  if (protocol === "file:") {
    window.AURASOUND_API_BASE = "http://localhost:3000";
    return;
  }
  if ((hostname === "localhost" || hostname === "127.0.0.1") && port === "3000") {
    window.AURASOUND_API_BASE = "";
    return;
  }
  window.AURASOUND_API_BASE = "http://localhost:3000";
})();
