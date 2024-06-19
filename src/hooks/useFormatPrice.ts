import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import {
  EXCHANGE_RATE_CHINA,
  EXCHANGE_RATE_ENGLISH,
  USD,
  VND,
  YUAN,
} from "../utils/formatPrice";

export function useFormatPrice() {
  const currency = useSelector((state: RootState) => state.currency);
  const priceFomat = (price: number) => {
    if (currency === "vi") {
      return `${VND.format(price)}VND`;
    } else if (currency === "ci") {
      return `${YUAN.format(Math.ceil(price / EXCHANGE_RATE_CHINA))}元`;
    } else if (currency === "en") {
      return `${USD.format(
        Number((price / EXCHANGE_RATE_ENGLISH).toFixed(2))
      )}$`;
    }
  };

  return priceFomat;
}
