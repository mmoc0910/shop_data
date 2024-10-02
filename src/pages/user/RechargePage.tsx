import wechat from "../../assets/contact/wechat1.png";
import alipay from "../../assets/contact/alipay.png";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { toast } from "react-toastify";
import axios from "axios";
import { Input } from "../../components/input";
import Button from "../../components/button/Button";
import { CountdownProps, Statistic, Tooltip } from "antd";
import { copyToClipboard } from "../../utils/copyToClipboard";
import {
  ACCOUNT_NAME,
  ACCOUNT_NO,
  APP_SCRIPT_URL,
  BANK_ID,
  TEMPLATE,
} from "../../constants";
import { useEffect, useState } from "react";
import {
  EXCHANGE_RATE_CHINA,
  EXCHANGE_RATE_ENGLISH,
  VND,
} from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
import logoMB from "../../assets/th (1).jpg";
import dayjs from "dayjs";
import SelectCurrency from "../../components/common/SelectCurrency";

const { Countdown } = Statistic;
const schema = yup
  .object({
    money: yup.number().required("This field is required"),
  })
  .required();

const RechargePage = () => {
  const { t } = useTranslation();
  const { _id } = useSelector((state: RootState) => state.auth);
  const currency = useSelector((state: RootState) => state.currency);
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: { money: number }) => {
    if (data.money > 0) {
      try {
        Swal.fire({
          title: `<p class="leading-tight">${t(
            "page.cash.payment.manual.ques"
          )}<span class="text-secondary">${VND.format(data.money)}${
            currency === "vi" ? "VND" : currency === "ci" ? "元" : "$"
          }</span></p>`,
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#1DC071",
          cancelButtonColor: "#d33",
          cancelButtonText: t("page.cash.payment.manual.cancelButton"),
          confirmButtonText: t("page.cash.payment.manual.confirmButton"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            const money =
              currency === "vi"
                ? data.money
                : currency === "ci"
                ? data.money * EXCHANGE_RATE_CHINA
                : data.money * EXCHANGE_RATE_ENGLISH;
            await api.post("/cashs", { money, userId: _id, type: 1 });
            setValue("money", 0);
            Swal.fire(
              `<p class='leading-tight'>${t(
                "page.cash.payment.manual.success"
              )}</p>`
            );
          }
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error message: ", error);
          toast.error(error.response?.data.message);
        } else {
          console.log("unexpected error: ", error);
          return "An unexpected error occurred";
        }
      }
    } else {
      toast.warn("Bạn nhập số tiền không hợp lệ");
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-4 gap-5 md:gap-10 xl:gap-20 xl:px-10">
      <AutoBanking />
      <div className="px-5 py-10 rounded-xl shadow-2xl col-span-1 md:col-span-3 xl:col-span-2">
        <p className="font-semibold text-xl text-center mb-3">
          {t("page.cash.payment.manual.title")}
        </p>
        <p className="mb-5 text-primary">
          {t("page.cash.payment.manual.desc")}
        </p>
        <p className="mb-7">{t("page.cash.payment.manual.step1")}</p>
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col items-center">
            <p>Wechat Pay</p>
            <p>(微信支付)</p>
            <img
              src={wechat}
              className="w-full aspect-square object-cover mt-4"
            />
          </div>
          <div className="flex flex-col items-center">
            <p>Alipay</p>
            <p>(支付宝)</p>
            <img
              src={alipay}
              className="w-full aspect-square object-cover mt-4"
            />
          </div>
        </div>
        <p className="mt-5">{t("page.cash.payment.manual.step2")}</p>
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            min={0}
            type="number"
            name="money"
            placeholder={t("page.cash.payment.manual.form.placeholder")}
            control={control}
            containerclass="flex-1"
          >
            {/* <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
              {listCurrency.find((item) => item.key === currency)?.title}
            </span> */}
            <div className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
              <SelectCurrency />
            </div>
          </Input>
          <Button
            type="submit"
            className="px-5 text-white bg-primary w-full mt-5"
          >
            {t("page.cash.payment.manual.form.button")}
          </Button>
        </form>
        <p className="mt-5">{t("page.cash.payment.manual.step3")}</p>
        <p className="mt-5 text-primary">
          {t("page.cash.payment.manual.note")}
        </p>
      </div>
    </div>
  );
};

// const onChange: CountdownProps['onChange'] = (val) => {
//   if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
//     console.log('changed!');
//   }
// };

const AutoBanking = () => {
  const { t } = useTranslation();
  const { username, _id } = useSelector((state: RootState) => state.auth);
  const [amount, setAmount] = useState<string>("");
  const [addInfo, setAddInfo] = useState<string>("");
  const [showQR, setShowQR] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string>();
  return (
    <div className="px-5 py-10 rounded-xl shadow-2xl col-span-1 md:col-span-3 lg:col-span-2">
      <p className="font-semibold text-xl text-center mb-7">
        {t("page.cash.payment.auto.title")}
      </p>
      <p className="text-center mb-7 text-primary">
        {t("page.cash.payment.auto.desc")}
      </p>
      <img src={logoMB} className="w-3/4 h-[100px] object-cover mx-auto" />
      {!showQR ? (
        <div className="flex items-center gap-5 mb-5">
          <div className="relative w-full">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("page.cash.payment.auto.form.placeholder")}
              type="number"
              className="pr-16 focus:border-primary text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock text-text1  "
            />
            <p className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2 font-semibold text-icon-color">
              VND
            </p>
          </div>
          <button
            onClick={async () => {
              if (amount && Number(amount) > 0 && username) {
                const contentPayment = `${username.toLocaleUpperCase()}${dayjs().get(
                  "minute"
                )}${dayjs().get("hour")}${dayjs().get("date")}${dayjs().get(
                  "month"
                )}`;
                const result = await api.post<{ data: { _id: string } }>(
                  "/cashs",
                  {
                    money: Number(amount),
                    userId: _id,
                    type: 0,
                    content: contentPayment,
                  }
                );
                setOrderId(result.data.data._id);
                setAddInfo(contentPayment);
                setShowQR(true);
              } else {
                toast.warn(t("page.cash.payment.auto.form.warn"));
              }
            }}
            type="button"
            className="font-semibold lg:py-3 rounded-[10px] lg:min-h-[52px] flex items-center justify-center select-none text-sm lg:text-base min-h-[40px] py-2 px-5 text-white bg-primary shrink-0"
          >
            {t("page.cash.payment.auto.form.button")}
          </button>
        </div>
      ) : null}

      {showQR && orderId ? (
        <AutoBankingQR
          orderId={orderId}
          amount={Number(amount)}
          addInfo={addInfo}
          onSuccess={() => setShowQR(false)}
        />
      ) : null}
    </div>
  );
};

const AutoBankingQR = ({
  orderId,
  amount,
  addInfo,
  onSuccess,
}: {
  orderId: string;
  amount: number;
  addInfo: string;
  onSuccess: () => void;
}) => {
  const { t } = useTranslation();
  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     const confirmationMessage = "Bạn có chắc muốn reload trang?";
  //     event.returnValue = confirmationMessage;
  //     const userConfirmed = window.confirm(confirmationMessage);
  //     if (userConfirmed) {
  //       handelCancelPayment();
  //     }
  //     return confirmationMessage;
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    const fetchDataInterval = setInterval(() => {
      // Gọi hàm fetchData ở đây
      checkPaid(amount, addInfo);
    }, 5000); // 10000 miligiây = 10 giây

    // Đảm bảo rằng bạn xóa interval khi component unmount
    return () => {
      clearInterval(fetchDataInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const checkPaid = async (amount: number, addInfo: string) => {
    try {
      const result = await api.get<{
        data: {
          "Mã GD": number;
          "Mô tả": string;
          "Giá trị": number;
          "Ngày diễn ra": Date;
          "Số tài khoản": string;
        }[];
      }>(APP_SCRIPT_URL);
      console.log("data - ", result.data.data);
      if (
        result.data.data.some(
          (item) =>
            item["Giá trị"] >= amount &&
            (item["Mô tả"].includes(addInfo) ||
              item["Mô tả"].toLowerCase().includes(addInfo.toLowerCase()))
        )
      ) {
        // await api.post("/cashs/auto-bank", {
        //   userId: _id,
        //   money: amount,
        // });
        await api.get(`/cashs/approve/${orderId}`);
        onSuccess();
        Swal.fire({
          title: `<p class="leading-tight">${t(
            "page.cash.payment.auto.success"
          )}</p>`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onFinish: CountdownProps["onFinish"] = async () => {
    console.log("finished!");
    handelCancelPayment();
  };
  const handelCancelPayment = async () => {
    try {
      await api.post(`/cashs/reject/${orderId}`, {
        description: "Nạp tiền tự động bị hủy do quá thời gian chuyển khoản",
      });
      Swal.fire({
        title: `<p class="leading-tight">${t(
          "page.cash.payment.auto.error"
        )}</p>`,
      });
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <img
        src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${Number(
          amount
        )}&addInfo=${addInfo}`}
        className="w-4/6 h-auto object-cover mx-auto mb-10"
      />

      <div className="space-y-5 mx-5">
        <div className="flex items-center gap-5">
          <div className="w-full h-[7px] relative my-0 mx-auto my before:content-[''] before:absolute before:right-auto before:left-0 before:h-full before:bg-primary  before:rounded-full before:animate-lineloading"></div>
          <Countdown value={Date.now() + 10 * 60 * 1000} onFinish={onFinish} />
        </div>
        <p className="text-lg">
          {t("page.cash.payment.auto.stk")}
          <span className="font-medium text-primary">{ACCOUNT_NO}</span>
        </p>
        <p className="text-lg">
          {t("page.cash.payment.auto.bank_name")}
          <span className="font-medium">{ACCOUNT_NAME}</span>
        </p>
        <p className="text-lg">
          {t("page.cash.payment.auto.money")}
          <span className="font-medium">{VND.format(Number(amount))}VND</span>
        </p>
        <div className="text-lg flex items-center gap-2">
          <p>
            {t("page.cash.payment.auto.content")}:{" "}
            <span className="font-medium text-secondary">{addInfo}</span>
          </p>
          <Tooltip title="copy">
            <button
              className="-translate-y-[2px]"
              onClick={() => copyToClipboard(addInfo)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                />
              </svg>
            </button>
          </Tooltip>
        </div>
        {/* <p className="text-lg">{t("page.cash.payment.auto.note")}</p> */}
      </div>
    </div>
  );
};

export default RechargePage;
