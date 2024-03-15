// import { Tooltip } from "antd";
// import { copyToClipboard } from "../../utils/copyToClipboard";
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
import { VND } from "../../utils/formatPrice";
// import { Tooltip } from "antd";
// import { copyToClipboard } from "../../utils/copyToClipboard";

const schema = yup
  .object({
    money: yup.number().required("This field is required"),
  })
  .required();

const RechargePage = () => {
  const { _id } = useSelector((state: RootState) => state.auth);
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: { money: number }) => {
    if (data.money > 0) {
      try {
        Swal.fire({
          title: `<p class="leading-tight">Bạn có muốn nạp <span class="text-secondary">${VND.format(
            data.money
          )}VND</span></p>`,
          // text: `${bandWidth}GB - ${VND.format(price)}VND/${type}`,
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#1DC071",
          cancelButtonColor: "#d33",
          cancelButtonText: "Thoát",
          confirmButtonText: "Đồng ý",
        }).then(async (result) => {
          if (result.isConfirmed) {
            await api.post("/cashs", { ...data, userId: _id });
            setValue("money", 0);
            Swal.fire(
              "<p class='leading-tight'>Bạn vừa yêu cầu nạp tiền thành công. Vui lòng gửi ảnh hóa đơn cho admin qua wechat/zalo để được phê duyệt.</p>"
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
    <div className="grid grid-cols-1 md:grid-cols-6 xl:grid-cols-5 gap-20">
      {/* <AutoBanking /> */}
      <div className="px-5 py-10 rounded-xl shadow-2xl col-span-1 md:col-span-3 xl:col-span-2">
        <p className="font-semibold text-xl text-center mb-3">
          Nạp tiền thủ công
        </p>
        <p className="text-center text-icon-color mb-7">
          Vui lòng chuyển khoản đến một trong các hình thức sau, thông báo trực
          tiếp cho admin và Nhấn nút ”Yêu cầu nạp tiền”.
        </p>
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
        <p className="text-center text-secondary mt-5">
          Các hình thức nạp tiền khác: Zalopay, Momopay, Paypal, USDT xin vui
          lòng contact trực tiếp admin
        </p>
        <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
          <Input
            name="money"
            placeholder={"Nhập số tiền cần nạp"}
            control={control}
            containerclass="flex-1"
          />
          <Button
            type="submit"
            className="px-5 text-white bg-primary w-full mt-5"
          >
            Yêu cầu nạp tiền
          </Button>
        </form>
      </div>
    </div>
  );
};

// const AutoBanking = () => {
//   return (
//     <div className="px-5 py-10 rounded-xl shadow-2xl col-span-1 md:col-span-3 lg:col-span-2">
//       <p className="font-semibold text-xl text-center mb-7">
//         Nạp tiền tự động VNbanking
//       </p>
//       <img
//         src="https://images.unsplash.com/photo-1709314633232-b01d4f45596c?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//         className="w-4/6 aspect-square object-cover mx-auto mb-10"
//       />
//       <div className="space-y-5 mx-5">
//         <p className="text-lg">
//           Số tài khoản:{" "}
//           <span className="font-medium text-primary">0123456789</span>
//         </p>
//         <p className="text-lg">
//           Chủ tài khoản: <span className="font-medium">NGUYEN VAN A</span>
//         </p>
//         <div className="text-lg flex items-center gap-2">
//           <p>
//             {" "}
//             Nội dung chuyển khoản:{" "}
//             <span className="font-medium text-secondary">abcdef</span>
//           </p>
//           <Tooltip title="copy">
//             <button
//               className="-translate-y-[2px]"
//               onClick={() => copyToClipboard("abcdef")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth="1.5"
//                 stroke="currentColor"
//                 className="w-5 h-5"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
//                 />
//               </svg>
//             </button>
//           </Tooltip>
//         </div>
//         <p className="text-lg">
//           Lưu ý: Quý khách vui lòng nhập đúng nội dung chuyển khoản.
//         </p>
//       </div>
//     </div>
//   );
// };

export default RechargePage;
