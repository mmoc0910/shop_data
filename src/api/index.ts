import axios from "axios";

const backendUrl = import.meta.env.VITE_BASE_URL_API;
export const api = axios.create({ baseURL: `${backendUrl}/api` });
export const BANK_ID = import.meta.env.VITE_BANK_ID
export const ACCOUNT_NO = import.meta.env.VITE_ACCOUNT_NO
export const TEMPLATE = import.meta.env.VITE_TEMPLATE
