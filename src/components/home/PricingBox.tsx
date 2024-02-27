import { useEffect, useState } from "react";
import Container from "../common/Container";
import { PlanType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { VND } from "../../utils/formatPrice";
import { IconCheck } from "../checkbox/Checkbox";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../common/Loading";

const PricingBox = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/plans");
        setPlans(result.data);
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
            <h2 className="font-medium text-2xl text-center">
              Trải nghiệm tuyệt vời, giá bất ngờ
            </h2>
            <p className="text-center text-gray-400">
              Đừng lãng phí thời gian quý báu của bạn để chờ đợi. Mở ngay dịch
              vụ chuyển tiếp mạng toàn cầu và truy cập Internet toàn cầu mọi
              lúc, mọi nơi.
            </p>
          </div>
          {/* <div className="my-9 lg:my-14 py-2 px-7 bg-[#f2f4f7] rounded-full">
            <div className="font-medium text-white bg-primary px-4 py-3 rounded-full">
              Thanh toán hàng tháng
            </div>
          </div> */}
          <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 lg:gap-y-16 w-full">
            {plans.map((plan) => (
              <PricingItem key={uuidv4()} plan={plan} />
            ))}
          </div>
        </Container>
      </div>
    );
  return;
};

export const PricingItem = ({ plan }: { plan: PlanType }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { _id } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigate();
  const { name, price, description, type, bandWidth } = plan;
  return (
    <>
      <div className="col-span-1 shadow-xl flex flex-col items-center rounded-2xl overflow-hidden">
        <h4 className="font-medium text-primary bg-primary bg-opacity-5 px-3 py-2 rounded-br-lg rounded-bl-lg">
          {name}
        </h4>
        <div className="pb-10 pt-10">
          <p className="text-primary text-4xl font-medium mb-2">
            {VND.format(price)}
            <span className="text-xl">VND/{type}</span>
          </p>
          <p className="font-semibold text-center text-primary text-3xl mt-3">
            {bandWidth}GB
          </p>
        </div>
        <div className="w-[80%] mx-auto space-y-5 pb-16 mb-auto">
          {description.map((desc) => (
            <Check content={desc} key={uuidv4()} />
          ))}
        </div>
        <button
          className="flex items-center justify-center bg-primary w-full py-4 flex-col gap-2"
          onClick={async () => {
            console.log("abvdhsdv");
            if (_id) {
              try {
                const { isConfirmed } = await Swal.fire({
                  title: `Bạn có muốn mua gói ${name}`,
                  text: `${bandWidth}GB - ${VND.format(price)}VND/${type}`,
                  icon: "success",
                  showCancelButton: true,
                  confirmButtonColor: "#1DC071",
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Thoát",
                  confirmButtonText: "Có, mua ngay",
                });
                if (isConfirmed) {
                  setLoading(true);
                  await api.post("/gists", {
                    userId: _id,
                    planId: plan._id,
                  });
                  toast.success("Mua thành công");
                  navigation("/user/order");
                }
              } catch (error) {
                if (axios.isAxiosError(error)) {
                  console.log("error message: ", error);
                  toast.error(error.response?.data.message);
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
          }}
        >
          <p className="font-medium text-white text-xl">Đăng ký mua</p>
          {/* <p className="text-3xl font-medium text-white">
          {VND.format(price)}
          <span className="text-xl">VND/{type}</span>
        </p> */}
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
