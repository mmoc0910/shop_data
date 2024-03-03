import { Modal } from "antd";
import Heading from "../../components/common/Heading";
import { VND } from "../../utils/formatPrice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/button/Button";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { api } from "../../api";
import CashHistory from "../../components/user/CashHistory";
import TransactionHistory from "../../components/user/TransactionHistory";
import RoseHistory from "../../components/user/RoseHistory";
import { CashType, RoseType, TransactionType } from "../../type";
import Swal from "sweetalert2";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import classNames from "../../utils/classNames";
import PlanDashborad from "../../components/user/PlanDashborad";
import InviteDashboard from "../../components/user/InviteDashboard";
import zalo from "../../assets/contact/zalo1.jpg";
import wechat from "../../assets/contact/wechat.png";
import whatapp from "../../assets/contact/whatapp.png";

const schema = yup
  .object({
    money: yup.number().required("This field is required"),
  })
  .required();

const DashboardUserPage = () => {
  const { _id } = useSelector((state: RootState) => state.auth);
  const satisfy = useSelector((state: RootState) => state.satisfy);
  const [userCashHistory, setUserCashHistory] = useState<CashType[]>([]);
  const [roseHistory, setRoseHistory] = useState<RoseType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [resultCash, resultRose, resultTransaction] = await Promise.all([
          api.get<CashType[]>(`/cashs?userId=${_id}`),
          api.get<RoseType[]>(`/roses?reciveRoseId=${_id}`),
          api.get<TransactionType[]>(
            `/transactions?userId=${_id}&approve=true`
          ),
        ]);
        setUserCashHistory(resultCash.data);
        setRoseHistory(resultRose.data);
        setTransactions(resultTransaction.data);
      } catch (error) {
        toast.error(messages.error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [satisfy, setSatisfy] = useState<SatisfyType>();
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  // useEffect(() => {
  //   fetchSatify();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [_id]);
  // const fetchSatify = async () => {
  //   try {
  //     const result = await api.get<SatisfyType>(`/satisfy/${_id}`);
  //     console.log("result - ", result.data);
  //     setSatisfy(result.data);
  //   } catch (error) {
  //     console.log("error - ", error);
  //   }
  // };
  const onSubmit = async (data: { money: number }) => {
    try {
      Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn nạp ${VND.format(
          data.money
        )}VND</p>`,
        // text: `${bandWidth}GB - ${VND.format(price)}VND/${type}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log("data - ", data);
          await api.post("/cashs", { ...data, userId: _id });
          handleOk();
          Swal.fire(
            "<p class='leading-tight'>Bạn vừa yêu cầu nạp tiền thành công. Vui lòng gửi ảnh hóa đơn cho admin qua wechat/zalo để được phê duyệt.</p>"
          );
          // toast.success("Nạp tiền thành công. Vui lòng chờ admin phê duyệt");
          reset();
        }
      });
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <RequireAuthPage rolePage={2}>
      <div className="grid grid-cols-12 gap-x-12 gap-y-10">
        <div className="space-y-4 col-span-12">
          {/* <Heading>Thống kê chi tiết</Heading> */}
          <div className="flex items-start rounded-xl border-2 border-[#eeeeed]">
            <div className="p-5 flex-1 space-y-3">
              <p className="text-gray-500 text-lg">Tổng nạp</p>
              <p className="font-medium text-2xl">
                {VND.format(
                  // satisfy && satisfy.cash.length > 0 ? satisfy.cash[0].money : 0
                  satisfy.cash
                )}
                VND
              </p>
            </div>
            <div className="p-5 flex-1 space-y-3">
              <p className="text-gray-500 text-lg">Số dư hiện tại</p>
              <p className="font-medium text-2xl">
                {VND.format(satisfy ? satisfy.currentMoney : 0)}VND
              </p>
            </div>
            <div className="p-5 flex-1 space-y-3">
              <p className="text-gray-500 text-lg">Số tiền đã sử dụng</p>
              <div className="">
                <p className="font-medium text-2xl text-error">
                  {VND.format(
                    // satisfy && satisfy.transaction.length > 0
                    //   ? satisfy.transaction[0].money
                    //   : 0
                    satisfy.transaction
                  )}
                  VND
                </p>
                <div
                  className="text-primary underline decoration-primary cursor-pointer"
                  onClick={showModal}
                >
                  Nạp tiền ngay
                </div>
              </div>
            </div>
            <div className="p-5 flex-1 space-y-3">
              <p className="text-gray-500 text-lg">Tiền hoa hồng</p>
              <p className="font-medium text-2xl">
                {VND.format(
                  // satisfy && satisfy.rose.length > 0 ? satisfy.rose[0].money : 0
                  satisfy.rose
                )}
                VND
              </p>
            </div>
            <div className="p-5 flex-1 space-y-3">
              <p className="text-gray-500 text-lg">Đã mời</p>
              <p className="font-medium text-2xl">
                {/* {satisfy?.numberIntoduce || 0} */}
                {satisfy.numberIntoduce}
              </p>
            </div>
          </div>
        </div>
        <div
          className={classNames(
            "space-y-8",
            userCashHistory.length === 0 &&
              roseHistory.length === 0 &&
              transactions.length === 0 &&
              !loading
              ? "col-span-12"
              : "col-span-8"
          )}
        >
          <div className="space-y-4">
            <Heading>Liên hệ</Heading>
            <div className="">
              <p>Chào mừng quý khách đến với hệ thống của chúng tôi !</p>
              <p>
                Nếu gặp khó khăn trong quá trình giao dịch quý khách hãy liên hệ
                với admin qua :
              </p>
              <div className="flex items-center gap-10 mt-5">
                <div className="flex flex-col gap-3 items-center">
                  <img
                    src={zalo}
                    className="w-full aspect-square object-cover"
                  />
                  <p className="font-semibold uppercase">Zalo</p>
                </div>
                <div className="flex flex-col gap-3 items-center">
                  <img
                    src={wechat}
                    className="w-full aspect-square object-cover"
                  />
                  <p className="font-semibold uppercase">Wechat</p>
                </div>
                <div className="flex flex-col gap-3 items-center">
                  <img
                    src={whatapp}
                    className="w-full aspect-square object-cover"
                  />
                  <p className="font-semibold uppercase">whatapp</p>
                </div>
              </div>
            </div>
          </div>
          <PlanDashborad />
          <InviteDashboard />
          <div className="space-y-4">
            <Heading>Hướng dẫn sử dụng</Heading>
            <div className="space-y-6">
              <div className="rounded-lg border overflow-hidden bg-gray-100">
                <p className="px-5 py-3 font-medium text-lg">
                  Thông tin cần biết
                </p>
                <div className="rounded-lg border px-5 py-3 bg-white">
                  <p className="font-medium">
                    Thông tin cần biết VPN 4G là gì ? Tại sao lại cần đến ?
                  </p>
                  <p className="text-gray-400 text-sm mt-4">
                    Lần Cập Nhật Cuối Cùng Vào:08/2/2023
                  </p>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidde bg-gray-100">
                <p className="px-5 py-3 font-medium text-lg">
                  Chương trình CTV
                </p>
                <div className="rounded-lg border px-5 py-3 bg-white">
                  <p className="font-medium">Hưởng hoa hồng 30% trọn đời</p>
                  <p className="text-gray-400 text-sm mt-4">
                    Lần Cập Nhật Cuối Cùng Vào:07/11/2022
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {userCashHistory.length === 0 &&
        roseHistory.length === 0 &&
        transactions.length === 0 ? null : (
          <div className="col-span-4 space-y-10">
            <CashHistory
              userCashHistory={userCashHistory.filter(
                (item) => item.status !== 2
              )}
            />
            <RoseHistory roseHistory={roseHistory} />
            <TransactionHistory transactions={transactions} />
          </div>
        )}
      </div>
      <Modal
        title="Nạp tiền"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <form className="" onSubmit={handleSubmit(onSubmit)}>
          <p className="font-primary text-icon-color">
            Bạn vui lòng nhập số tiền cần nạp sau đó liên hệ với admin để có thể
            nạp tiền hoặc đợi admin liên hệ trong ít phút nữa.
          </p>
          <Label htmlFor="money" className="py-5 block">
            Số tiền*
          </Label>
          <div className="flex gap-5">
            <Input
              name="money"
              placeholder={""}
              control={control}
              containerclass="flex-1"
            />
            <Button type="submit" className="px-5 text-white bg-primary">
              Nạp tiền
            </Button>
          </div>
        </form>
      </Modal>
    </RequireAuthPage>
  );
};

export default DashboardUserPage;
