async function adminApi(path, opts = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const msg = data.error || data.message || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}

async function requireAdminSession() {
  try {
    const me = await adminApi("/admin/api/me");
    if (!me.loggedIn) throw new Error();
    return me.user;
  } catch {
    window.location.href = "/admin/login.html";
    return null;
  }
}

async function logout() {
  await adminApi("/admin/api/logout", { method: "POST", body: "{}" });
  window.location.href = "/admin/login.html";
}
