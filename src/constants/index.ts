import dayjs from "dayjs";

export const messages = { error: "Xảy ra lỗi trong quá trình xử lý" };

export const countries = [
  // { key: "en", title: "English" },
  { key: "vi", title: "VietNam" },
  { key: "ci", title: "Chinese" },
  { key: "ir", title: "Iran" },
  { key: "orther", title: "Orther" },
];

export const DAY_FORMAT = (date: Date) => dayjs(date).format('DD-MM-YYYY HH:MM')