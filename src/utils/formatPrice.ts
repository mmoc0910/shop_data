export const VND = new Intl.NumberFormat("vi-VN", {
  // style: "currency",
  currency: "VND",
});
const YUAN = new Intl.NumberFormat("zh-CN", {
  // style: "currency",
  currency: "CNY",
});

export const EXCHANGE_RATE_CHINA = 3400;
export const EXCHANGE_RATE_ENGLISH = 24000;

export const priceFomat = (price: number, country: string = "vi") => {
  if (country === "vi") {
    return `${VND.format(price)}VND`;
  } else if (country === "ci") {
    return `${YUAN.format(Math.ceil(price / EXCHANGE_RATE_CHINA))}元`;
  } else if (country === "en") {
    return `${YUAN.format(Math.ceil(price / EXCHANGE_RATE_ENGLISH))}$`;
  }
};

// export const calculatePrice = (price: number, country: string = "vi") => {
//   if (country === "vi") {
//     return price;
//   } else if (country === "ci") {
//     return Math.ceil(price / EXCHANGE_RATE_CHINA);
//   } else if (country === "en") {
//     return Math.ceil(price / EXCHANGE_RATE_ENGLISH);
//   }
// };
