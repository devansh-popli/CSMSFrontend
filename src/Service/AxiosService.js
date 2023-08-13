import axios from "axios";
import { baseURL } from "./HelperService";

export const privateAxios=axios.create({
    baseURL:baseURL
})
// privateAxios.interceptors.request.use(
//     (config) => {
//       //request me modification krege
//       const token = getTokenFromLocalStorage();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );