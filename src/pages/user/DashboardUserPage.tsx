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
import { Link } from "react-router-dom";

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
  const onSubmit = async (data: { money: number }) => {
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
      <div className="lg:grid grid-cols-12 gap-x-12 gap-y-10">
        <div className="space-y-4 col-span-12 mb-5 lg:mb-0">
          {/* <Heading>Thống kê chi tiết</Heading> */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-xl border-2 border-[#eeeeed]">
            <div className="p-5 flex-1 space-y-3">
              <p className="text-gray-500 text-base lg:text-lg">Tổng nạp</p>
              <p className="font-medium text-xl md:text-2xl">
                {VND.format(
                  // satisfy && satisfy.cash.length > 0 ? satisfy.cash[0].money : 0
                  satisfy.cash
                )}
                VND
              </p>
            </div>
            <div className="p-5 flex-1 space-y-3">
              <p className="text-gray-500 text-base lg:text-lg">
                Số dư hiện tại
              </p>
              <p className="font-medium text-xl md:text-2xl">
                {VND.format(satisfy ? satisfy.currentMoney : 0)}VND
              </p>
            </div>
            <div className="p-5 flex-1 space-y-3 hidden md:block">
              <p className="text-gray-500 text-base lg:text-lg">
                Số tiền đã sử dụng
              </p>
              <div className="">
                <p className="font-medium text-xl md:text-2xl text-error">
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
            <div className="p-5 flex-1 space-y-3 hidden md:block">
              <p className="text-gray-500 text-base lg:text-lg">
                Tiền hoa hồng
              </p>
              <p className="font-medium text-xl md:text-2xl">
                {VND.format(
                  // satisfy && satisfy.rose.length > 0 ? satisfy.rose[0].money : 0
                  satisfy.rose
                )}
                VND
              </p>
            </div>
            <div className="p-5 flex-1 space-y-3 hidden md:block">
              <p className="text-gray-500 text-base lg:text-lg">Đã mời</p>
              <p className="font-medium text-xl md:text-2xl">
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
              : "col-span-12 lg:col-span-8"
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
          <Policy />
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
          <div className="col-span-4 space-y-10 hidden lg:block">
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

const Policy = () => {
  return (
    <div className="space-y-4">
      <Heading> Vietnamese VPNCN2 Policy</Heading>
      <ul className="list-decimal pl-5 space-y-2">
        <li className="">
          Mỗi key không giới hạn số lượng thiết bị kết nối nhưng sẽ bị giới hạn
          tổng băng thông sử dụng hàng tháng là 150GB, việc giới hạn này với mục
          đích hạn chế chia sẻ key sử dụng cho người khác.
        </li>
        <li className="">
          Phần mềm kết nối VPN là "OUTLINE" có trên tất cả các loại thiết bị
          (điện thoại, máy tính, máy tính bảng) và hệ điều hành (Windows, MAC,
          Chromebook, iOS iphone, Android), có thể kết nối VPN nhiều thiết bị
          cùng 1 lúc, Nhưng khuyến cáo KHÔNG ĐƯỢC chia sẻ cho người khác cùng sử
          dụng, nếu vượt quá băng thông bạn sẽ không thể tiếp tục sử dụng, khi
          đó bạn phải mua thêm băng thông hoặc chờ cho đến khi băng thông được
          reset xoay vòng 30 ngày
        </li>
        <li>
          Phần mềm OUTLINE có thể cài đặt trực tiếp từ AppStore(iOS) hoặc
          GooglePlay (Android).
          <div className="flex flex-wrap items-center gap-10 md:gap-16 lg:gap-20 py-5 ">
            <Link
              to={
                "https://play.google.com/store/apps/details?id=org.outline.android.client&pcampaignid=web_share"
              }
              target="_blank"
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-12 h-12 md:w-20 md:h-20 fill-current group-hover:fill-primary transition-all duration-300"
                >
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
              </span>
              <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                GooglePlay (Android)
              </span>
            </Link>
            <Link
              to={
                "https://apps.apple.com/us/app/outline-secure-internet-access/id1356178125?mt=12"
              }
              target="_blank"
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-12 h-12 md:w-20 md:h-20 fill-current group-hover:fill-primary transition-all duration-300"
                >
                  <path d="M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z" />
                </svg>
              </span>
              <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                AppStore(MacOS)
              </span>
            </Link>
            <Link
              to={"https://apps.apple.com/us/app/outline-app/id1356177741"}
              target="_blank"
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-12 h-12 md:w-20 md:h-20 fill-current group-hover:fill-primary transition-all duration-300"
                >
                  <path d="M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z" />
                </svg>
              </span>
              <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                AppStore(iOS)
              </span>
            </Link>
          </div>
          <span className="font-medium text-secondary40 text-xl">
            Nếu bạn đang ở China và không tải được trên kho ứng dụng, thì có thể
            dùng link download dưới đây.
          </span>
          <div className="flex flex-wrap items-stretch gap-10 md:gap-16 lg:gap-20 py-5">
            <Link
              to={"http://woot2.vn/vpncn2/Win-outline-client.zip"}
              download
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-12 h-12 md:w-20 md:h-20 fill-current group-hover:fill-primary transition-all duration-300"
                >
                  <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
                </svg>
              </span>
              <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                For Windows
              </span>
            </Link>
            <Link
              to={"http://woot2.vn/vpncn2/Outline-Client-1.12.apk"}
              download
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="w-12 h-12 md:w-20 md:h-20 fill-current group-hover:fill-primary transition-all duration-300"
                >
                  <path d="M420.6 301.9a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m273.7-144.5 47.9-83a10 10 0 1 0 -17.3-10h0l-48.5 84.1a301.3 301.3 0 0 0 -246.6 0L116.2 64.5a10 10 0 1 0 -17.3 10h0l47.9 83C64.5 202.2 8.2 285.6 0 384H576c-8.2-98.5-64.5-181.8-146.9-226.6" />
                </svg>
              </span>
              <span className="font-medium text-sm group-hover:text-primary transition-all duration-300 text-center">
                For Android: New version <br />
                (Recommend)
              </span>
            </Link>
            {/* <Link
              to={"http://woot2.vn/vpncn2/Outline_1.11.0_Apkpure.apk"}
              download
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  className="w-12 h-12 md:w-20 md:h-20 fill-current group-hover:fill-primary transition-all duration-300"
                >
                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                </svg>
              </span>
              <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                For Android: Old version
              </span>
            </Link> */}
          </div>
        </li>
      </ul>
    </div>
  );
};

export default DashboardUserPage;
