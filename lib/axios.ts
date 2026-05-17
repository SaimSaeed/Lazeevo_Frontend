import axios from "axios";
import { envConfig } from "./config";
import Cookies from "js-cookie";

export const PublicAPI = axios.create({
  baseURL: envConfig.BASE_URL,
});

export const ProtectedAPI = axios.create({
  baseURL: envConfig.BASE_URL,
});

ProtectedAPI.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("User", user);
      if (parsedUser?.tenantId) {
        config.headers.tenant_id = parsedUser.tenantId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

//  Response interceptor (NEW)
// ProtectedAPI.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error?.response?.status;
//     const currentPath = window.location.pathname;

//     if (status === 401 || status === 403) {
//       Cookies.remove("accessToken");
//       localStorage.clear();
//       if (!currentPath.includes("/signin")) window.location.href = "/signin";
//     }

//     return Promise.reject(error);
//   },
// );
