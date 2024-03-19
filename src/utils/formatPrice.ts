import { CoutryType } from "../type";

export const VND = new Intl.NumberFormat("vi-VN", {
  // style: "currency",
  currency: "VND",
});
const YUAN = new Intl.NumberFormat("zh-CN", {
  // style: "currency",
  currency: "CNY",
});

const EXCHANGE_RATE = 3400;

export const priceFomat = (price: number, country: CoutryType = "vi") => {
  if (country === "vi") {
    return `${VND.format(price)}VND`;
  } else if (country === "en" || country === 'ci') {
    return `${YUAN.format(Math.ceil(price / EXCHANGE_RATE))}元`;
  }
};
