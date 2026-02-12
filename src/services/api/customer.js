const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiFetch(path, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const makeRequest = async (token) => {
    return fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(options.headers || {}),
      },
      credentials: "include",
    });
  };

  let res = await makeRequest(accessToken);

  // Only refresh if token actually expired
  if (
    res.status === 401 &&
    path !== "/auth/login" &&
    path !== "/auth/refresh"
  ) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch {}

    // Only refresh if backend says TOKEN_EXPIRED
    if (errorData.code === "TOKEN_EXPIRED") {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        localStorage.removeItem("accessToken");
        throw new Error("Session expired");
      }

      const { accessToken: newToken } = await refreshRes.json();
      localStorage.setItem("accessToken", newToken);

      // Retry original request with new token
      res = await makeRequest(newToken);
    }
  }

  let data = {};
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}