import dayjs, { Dayjs } from "dayjs";
export const BANK_ID = import.meta.env.VITE_BANK_ID;
export const ACCOUNT_NO = import.meta.env.VITE_ACCOUNT_NO;
export const ACCOUNT_NAME = import.meta.env.VITE_ACCOUNT_NAME;
export const TEMPLATE = import.meta.env.VITE_TEMPLATE;
export const APP_SCRIPT_URL = import.meta.env.VITE_APP_SCRIPT_URL;
export const messages = { error: "Xảy ra lỗi trong quá trình xử lý" };
export const DEFAULT_PAGE_SIZE = 10;
export const countries = [
  // { key: "en", title: "English" },
  { key: "vi", title: "Việt Nam" },
  { key: "ci", title: "Chinese" },
  { key: "ir", title: "Iran" },
  { key: "orther", title: "Other" },
];
export const purposes = [
  { id: 1, title: "Access global internet from China" },
  { id: 2, title: "Access global internet from Iran" },
  { id: 3, title: "Play Gaming" },
  { id: 4, title: "Others" },
];

export const listCurrency = [
  { key: "vi", title: "VND" },
  { key: "en", title: "USD" },
  { key: "ci", title: "CNY" },
];

export const regexUserName = /^[a-z0-9!@#$%^&*()_+{}[\]:;<>,.?/~`|-]+$/;

export const linkGist = import.meta.env.VITE_LINK_GIST;

export const DAY_FORMAT = (date: Date | Dayjs) =>
  dayjs(date).format("DD-MM-YYYY HH:mm");

export function isSameOrBefore(
  dateA: dayjs.Dayjs | Date,
  dateB: dayjs.Dayjs | Date
) {
  return (
    dayjs(dateA).isSame(dateB, "day") || dayjs(dateA).isBefore(dateB, "day")
  );
}

export function isSameOrAfter(
  dateA: dayjs.Dayjs | Date,
  dateB: dayjs.Dayjs | Date
) {
  return (
    dayjs(dateA).isSame(dateB, "day") || dayjs(dateA).isAfter(dateB, "day")
  );
}

export function translateType(type: string, lang: string) {
  if (lang === "vi") return type.split("_")[0];
  if (lang === "en") return type.split("_")[1];
  if (lang === "ci") return type.split("_")[2];
}
