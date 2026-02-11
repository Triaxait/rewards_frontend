const API_BASE = import.meta.env.VITE_API_BASE;

export async function apiFetch(path, options = {}) {
  let res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include", // future-proof
  });

  if (res.status === 401) {
    // try refreshing token
    const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!refreshRes.ok) {
      throw new Error("Session expired");
    }

    const { accessToken } = await refreshRes.json();
    localStorage.setItem("accessToken", accessToken);

    // retry original request
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
