import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ApiService from "../services/api";

const STORAGE_KEY = "mithon_access_token";

const readStoredToken = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Unable to read stored auth token", error);
    return null;
  }
};

const persistToken = (value) => {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn("Unable to update stored auth token", error);
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(readStoredToken);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(
    async (overrideToken) => {
      const activeToken = overrideToken || token;
      if (!activeToken) {
        setUser(null);
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);
        const profile = await ApiService.getProfile(activeToken);
        setUser(profile);
        if (import.meta.env.DEV) {
          console.log("[MITHON] 교육청 코드:", profile.educationOfficeCode ?? "");
          if (profile.schoolCode) {
            console.log("[MITHON] 학교 코드:", profile.schoolCode);
          } else {
            console.log("[MITHON] 학교 코드 없음");
          }
        }
        return profile;
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError(err);
        setUser(null);
        if (err.status === 401) {
          persistToken(null);
          setToken(null);
        }
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchProfile(token).catch(() => {
        // 실패 시 토큰을 이미 정리하며 에러를 기록함
      });
    } else {
      setUser(null);
    }
  }, [token, fetchProfile]);

  const login = useCallback(
    async (userId, password) => {
      const { access_token: accessToken } = await ApiService.login(
        userId,
        password
      );
      persistToken(accessToken);
      setToken(accessToken);
      await fetchProfile(accessToken);
    },
    [fetchProfile]
  );

  const logout = useCallback(() => {
    persistToken(null);
    setToken(null);
    setUser(null);
    window.location.assign("/");
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      error,
      login,
      logout,
      refreshProfile: fetchProfile,
      isAuthenticated: Boolean(token && user),
    }),
    [token, user, isLoading, error, login, logout, fetchProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.");
  }
  return context;
};
