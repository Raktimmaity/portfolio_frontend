export function getAdminToken() {
  return localStorage.getItem("admin_token");
}
export function getAdminExpiry() {
  const v = localStorage.getItem("admin_expiresAt");
  return v ? parseInt(v, 10) : null;
}
export function logoutAdmin(navigate) {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_expiresAt");
  localStorage.removeItem("admin_user");

  if (navigate) {
    navigate("/boss-login", { replace: true });
  }
}

