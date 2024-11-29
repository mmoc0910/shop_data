export const VND = new Intl.NumberFormat("vi-VN", {
  // style: "currency",
  currency: "VND",
});
export const YUAN = new Intl.NumberFormat("zh-CN", {
  // style: "currency",
  currency: "CNY",
});

export const USD = new Intl.NumberFormat("en-US", {
  // style: "currency",
  currency: "USD",
});

// export const EXCHANGE_RATE_CHINA = 3400;
// export const EXCHANGE_RATE_ENGLISH = 24000;
export const EXCHANGE_RATE_CHINA = import.meta.env.VITE_EXCHANGE_RATE_CHINA;
export const EXCHANGE_RATE_ENGLISH = import.meta.env.VITE_EXCHANGE_RATE_ENGLISH;

console.log("EXCHANGE_RATE_CHINA ~ ", EXCHANGE_RATE_CHINA);
console.log("EXCHANGE_RATE_ENGLISH ~ ", EXCHANGE_RATE_ENGLISH);
// export const priceFomat = (price: number, country: string = "vi") => {
//   if (country === "vi") {
//     return `${VND.format(price)}VND`;
//   } else if (country === "ci") {
//     return `${YUAN.format(Math.ceil(price / EXCHANGE_RATE_CHINA))}元`;
//   } else if (country === "en") {
//     return `${YUAN.format(Math.ceil(price / EXCHANGE_RATE_ENGLISH))}$`;
//   }
// };

// export const calculatePrice = (price: number, country: string = "vi") => {
//   if (country === "vi") {
//     return price;
//   } else if (country === "ci") {
//     return Math.ceil(price / EXCHANGE_RATE_CHINA);
//   } else if (country === "en") {
//     return Math.ceil(price / EXCHANGE_RATE_ENGLISH);
//   }
// };
