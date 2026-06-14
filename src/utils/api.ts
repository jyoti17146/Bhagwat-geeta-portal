export const getApiUrl = (endpoint: string): string => {
  // Respect VITE_API_URL defined in the frontend build/env configurations
  const envApiUrl = (import.meta as any).env?.VITE_API_URL;
  if (envApiUrl) {
    const base = envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl;
    return `${base}${endpoint}`;
  }

  // Fallback: auto-detect base URL
  let baseUrl = "https://bhagwat-geeta-portal.onrender.com"; // Default Render Backend
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.includes("run.app")) {
      baseUrl = window.location.origin;
    }
  }
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${base}${endpoint}`;
};
