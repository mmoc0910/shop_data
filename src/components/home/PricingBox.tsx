import { useEffect, useState } from "react";
import Container from "../common/Container";
import { GistType, PlanType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { IconCheck } from "../checkbox/Checkbox";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../common/Loading";
import { useTranslation } from "react-i18next";
import { translateType } from "../../constants";
import { useFormatPrice } from "../../hooks/useFormatPrice";
// import { Modal } from "antd";

const PricingBox = () => {
  const { t } = useTranslation();
  const { _id } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigate();
  const [plans, setPlans] = useState<PlanType[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<PlanType[]>("/plans");
        setPlans(
          result.data
            .filter((item) => item.status === 1)
            .sort((a, b) => b.numberPurchase - a.numberPurchase)
        );
      } catch (error) {
        console.log("error - ", error);
      }
    })();
  }, []);
  if (plans.length > 0)
    return (
      <div className="py-10 lg:py-20" id="pricing">
        <Container className="flex flex-col items-center">
          <div className="w-full md:w-3/5 space-y-5">
            <h2 className="font-medium text-3xl text-center">
              {t("page.home.pricing.title")}
            </h2>
            <p className="text-center text-gray-400">
              {t("page.home.pricing.desc")}
            </p>
            <Link
              to={"/sign-up"}
              className="block text-center text-secondary20 font-medium text-xl"
            >
              {t("page.home.pricing.desc2")}{" "}
              {/* <Link to={"/sign-up"} className="font-bold underline">
                {t("authen.sign_up")}
              </Link> */}
            </Link>
          </div>
          {/* <div className="my-9 lg:my-14 py-2 px-7 bg-[#f2f4f7] rounded-full">
            <div className="font-medium text-white bg-primary px-4 py-3 rounded-full">
              Thanh toán hàng tháng
            </div>
          </div> */}
          <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 lg:gap-y-16 w-full">
            {plans.map((plan) =>
              plan.display === 1 ? (
                <PricingItem key={uuidv4()} plan={plan} />
              ) : null
            )}
          </div>
          {plans.length > 3 ? (
            <div
              onClick={() => {
                if (_id) {
                  navigation("/user/plan");
                } else {
                  navigation("/sign-in");
                }
              }}
              className="my-9 lg:my-14 py-2 px-9 bg-[#f2f4f7] rounded-full"
            >
              <div className="font-medium text-white bg-primary px-6 py-3 rounded-full">
                {t("page.home.pricing.seemore")}
              </div>
            </div>
          ) : null}
        </Container>
      </div>
    );
  return;
};

export const PricingItem = ({
  plan,
  onSuccess,
}: {
  plan: PlanType;
  onSuccess?: (gist: GistType) => void;
}) => {
  const priceFomat = useFormatPrice();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const { _id } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigate();
  const { name, price, description, type, bandWidth } = plan;
  const handleBuy = async (_id: string | undefined) => {
    if (_id) {
      try {
        const { isConfirmed } = await Swal.fire({
          title: `<p class="leading-tight">${t(
            "page.package.swal.title"
          )} <span class="text-secondary20">${name}</span></p>`,
          text: `${bandWidth}GB - ${priceFomat(price)}/${translateType(
            type,
            i18n.language
          )}`,
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#1DC071",
          cancelButtonColor: "#d33",
          cancelButtonText: t("page.package.swal.cancelButton"),
          confirmButtonText: t("page.package.swal.confirmButton"),
        });
        if (isConfirmed) {
          setLoading(true);
          const result = await api.post<{data: GistType}>("/gists", {
            userId: _id,
            planId: plan._id,
          });
          console.log("result ~ ", result.data.data);
          toast.success(t("page.package.swal.success"));
          onSuccess && onSuccess(result.data.data)
          // navigation("/user/order");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // toast.error(error.response?.data.message);
          if (
            error.response?.data.message ===
              "Bạn không đủ tiền để đăng kí dịch vụ này" &&
            error.response.status === 400
          ) {
            toast.warn(t("page.package.swal.warn"));
            navigation("/user/dashboard");
          }
          if (
            error.response?.data.message === "Bạn đã đăng kí gói dùng thử." &&
            error.response.status === 400
          ) {
            toast.warn(
              i18n.language === "vi"
                ? "Gói dùng thử chỉ được mua 1 lần."
                : i18n.language === "en"
                ? "Trial only buy once."
                : "试用只会买一次"
            );
          }
        } else {
          console.log("unexpected error: ", error);
          return "An unexpected error occurred";
        }
      } finally {
        setLoading(false);
      }
    } else {
      navigation("/sign-in");
    }
  };
  return (
    <>
      <div className="col-span-1 shadow-xl flex flex-col items-center rounded-2xl overflow-hidden">
        <h4 className="font-medium text-primary bg-primary bg-opacity-5 px-3 py-2 rounded-br-lg rounded-bl-lg">
          {name}
        </h4>
        <div className="pb-10 pt-10">
          <p className="text-primary text-3xl font-medium mb-2">
            {/* {VND.format(price)} */}
            {priceFomat(price)}/{i18n.language === "vi" && type.split("_")[0]}
            {i18n.language === "en" && type.split("_")[1]}
            {i18n.language === "ci" && type.split("_")[2]}
          </p>
          <p className="font-semibold text-center text-primary text-3xl mt-3">
            {bandWidth}GB
          </p>
        </div>
        <div className="w-[80%] mx-auto space-y-5 pb-16 mb-auto">
          {i18n.language === "ci" &&
            description
              .filter((item) => item.includes("ci_"))
              .map((desc) => (
                <Check content={desc.replace("ci_", "")} key={uuidv4()} />
              ))}
          {i18n.language === "en" &&
            description
              .filter((item) => item.includes("en_"))
              .map((desc) => (
                <Check content={desc.replace("en_", "")} key={uuidv4()} />
              ))}
          {i18n.language === "vi" &&
            description
              .filter((item) => item.includes("vi_"))
              .map((desc) => (
                <Check content={desc.replace("vi_", "")} key={uuidv4()} />
              ))}
        </div>
        <button
          className="flex items-center justify-center bg-primary w-full py-4 flex-col gap-2"
          onClick={() => handleBuy(_id)}
          // onClick={() => onSuccess && onSuccess(res)}
        >
          <p className="font-medium text-white text-xl">
            {t("page.package.buyNow")}
          </p>
        </button>
      </div>
      {loading ? <Loading /> : null}
    </>
  );
};

export const Check = ({ content }: { content: string }) => {
  if (content)
    return (
      <div className="flex gap-3">
        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center translate-y-[2px] shrink-0">
          <span className="text-white">
            <IconCheck />
          </span>
        </div>
        <p className="">{content}</p>
      </div>
    );
  return;
};

export default PricingBox;
