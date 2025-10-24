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

const authHeaders = (token, extra = {}) => {
  const headers = { ...defaultHeaders, ...extra };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const authJsonHeaders = (token) =>
  authHeaders(token, { "Content-Type": "application/json" });

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
      headers: authHeaders(token),
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

  async getTimetable({ schoolCode, grade, classNumber, date } = {}, token) {
    const params = new URLSearchParams();
    if (schoolCode) params.append("schoolCode", schoolCode);
    if (grade !== undefined && grade !== null && grade !== "") {
      params.append("grade", grade);
    }
    if (classNumber !== undefined && classNumber !== null && classNumber !== "") {
      params.append("class", classNumber);
    }
    if (date) params.append("date", date);

    const query = params.toString();
    const url = query ? `/neis/timetable?${query}` : "/neis/timetable";

    const response = await fetch(buildUrl(url), {
      method: "GET",
      headers: token ? authHeaders(token) : defaultHeaders,
    });
    return parseResponse(response);
  },

  async getMeal({ schoolCode, date } = {}, token) {
    const params = new URLSearchParams();
    if (schoolCode) params.append("schoolCode", schoolCode);
    if (date) params.append("date", date);

    const query = params.toString();
    const url = query ? `/neis/meal?${query}` : "/neis/meal";

    const response = await fetch(buildUrl(url), {
      method: "GET",
      headers: token ? authHeaders(token) : defaultHeaders,
    });
    return parseResponse(response);
  },

  async getDailyMissions(token) {
    const response = await fetch(buildUrl("/user/missions"), {
      method: "GET",
      headers: authHeaders(token),
    });
    return parseResponse(response);
  },

  async completeMission(token, payload) {
    const response = await fetch(buildUrl("/user/mission/complete"), {
      method: "POST",
      headers: authJsonHeaders(token),
      body: JSON.stringify(payload),
    });
    return parseResponse(response);
  },

  async getClassCharacter(token) {
    const response = await fetch(buildUrl("/user/class/character"), {
      method: "GET",
      headers: authHeaders(token),
    });
    return parseResponse(response);
  },
};

export default ApiService;
