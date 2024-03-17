import axios from "axios";

const backendUrl = import.meta.env.VITE_BASE_URL_API;
export const api = axios.create({ baseURL: `${backendUrl}/api` });

