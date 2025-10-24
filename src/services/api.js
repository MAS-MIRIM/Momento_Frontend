const DEFAULT_BASE_URL = import.meta.env.DEV ? "/api" : "https://api.hjun.kr";

const normalizeBaseUrl = (raw) => {
  const input = (raw || "").trim();
  if (!input) {
    return DEFAULT_BASE_URL;
  }

  if (input.startsWith("/")) {
    return input.replace(/\/$/, "") || "/";
  }

  if (/^https?:\/\//i.test(input)) {
    return input.replace(/\/$/, "");
  }

  return `https://${input}`.replace(/\/$/, "");
};

const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

const buildUrl = (path) => {
  if (!path.startsWith("/")) {
    throw new Error("API path must start with '/'");
  }
  return `${API_BASE_URL}${path}`;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(
      (isJson && data?.message) || "요청을 처리하지 못했습니다."
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

const defaultHeaders = {
  Accept: "application/json",
};

const jsonHeaders = {
  ...defaultHeaders,
  "Content-Type": "application/json",
};

const ApiService = {
  async register(payload) {
    const response = await fetch(buildUrl("/user/register"), {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    });
    return parseResponse(response);
  },

  async login(userId, password) {
    const response = await fetch(buildUrl("/auth/login"), {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({ userId, password }),
    });
    return parseResponse(response);
  },

  async getProfile(token) {
    const response = await fetch(buildUrl("/user/profile"), {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });
    return parseResponse(response);
  },

  async checkUserId(userId) {
    const response = await fetch(
      buildUrl(`/user/haveId?userId=${encodeURIComponent(userId)}`),
      {
        method: "GET",
        headers: defaultHeaders,
      }
    );
    return parseResponse(response);
  },
};

export default ApiService;
