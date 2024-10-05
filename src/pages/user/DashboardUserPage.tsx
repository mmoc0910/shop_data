import { Modal, Tooltip } from "antd";
import Heading from "../../components/common/Heading";
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
import picture1 from "../../assets/Picture1.png";
import { Link } from "react-router-dom";
import IconQuesionMarkCircle from "../../icons/IconQuesionMarkCircle";
import Post from "../../components/user/Post";
import { useTranslation } from "react-i18next";
import logoOutline from "../../assets/logo_outline.jpg";
import i18n from "../../i18n";
import { useFormatPrice } from "../../hooks/useFormatPrice";

const schema = yup
  .object({
    money: yup.number().required("This field is required"),
  })
  .required();

const DashboardUserPage = () => {
  const priceFomat = useFormatPrice();
  const { t } = useTranslation();
  const { _id } = useSelector((state: RootState) => state.auth);
  const satisfy = useSelector((state: RootState) => state.satisfy);
  const commision = useSelector((state: RootState) => state.commision);
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
        title: `<p class="leading-tight">Bạn có muốn nạp <span class="text-secondary">${priceFomat(
          data.money
        )}</span></p>`,

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
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <RequireAuthPage rolePage={[2]}>
      <div className="grid-cols-12 lg:grid gap-x-12 gap-y-10">
        <div className="col-span-12 mb-5 space-y-4 lg:mb-0">
          {/* <Heading>Thống kê chi tiết</Heading> */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 rounded-xl border-2 border-[#eeeeed]">
            <div className="flex-1 p-5 space-y-3">
              <p className="text-base text-gray-500 lg:text-lg">
                {t("page.dashboard.satify.cash")}
              </p>
              <p className="text-xl font-medium md:text-2xl">
                {priceFomat(satisfy.cash)}
              </p>
            </div>
            <div className="flex-1 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <p className="text-base text-gray-500 lg:text-lg">
                  {t("page.dashboard.satify.currentMoney")}
                </p>
                <Tooltip title={t("page.dashboard.satify.currentMoneyNode")}>
                  <span className="cursor-pointer text-[#3d6dae]">
                    <IconQuesionMarkCircle />
                  </span>
                </Tooltip>
              </div>
              <p className="text-xl font-medium md:text-2xl">
                {priceFomat(satisfy?.currentMoney || 0)}
              </p>
            </div>
            <div className="flex-1 hidden p-5 space-y-3 md:block">
              <p className="text-base text-gray-500 lg:text-lg">
                {t("page.dashboard.satify.transaction")}
              </p>
              <div className="">
                <p className="text-xl font-medium md:text-2xl text-error">
                  {priceFomat(satisfy.transaction)}
                </p>
                <Link
                  to={"/user/cash"}
                  className="underline cursor-pointer text-primary decoration-primary"
                  // onClick={showModal}
                >
                  {t("page.dashboard.satify.depositNow")}
                </Link>
              </div>
            </div>
            <div className="flex-1 hidden p-5 space-y-3 md:block">
              <div className="flex items-center gap-2">
                <p className="text-base text-gray-500 lg:text-lg">
                  {t("page.dashboard.satify.rose")}
                </p>
                <Tooltip
                  title={t("page.dashboard.satify.roseNode", {
                    amount: commision,
                  })}
                >
                  <span className="cursor-pointer text-[#3d6dae]">
                    <IconQuesionMarkCircle />
                  </span>
                </Tooltip>
              </div>
              <p className="text-xl font-medium md:text-2xl">
                {priceFomat(satisfy.rose)}
              </p>
            </div>
            <div className="flex-1 hidden p-5 space-y-3 md:block">
              <p className="text-base text-gray-500 lg:text-lg">
                {t("page.dashboard.satify.numberIntoduce")}
              </p>
              <p className="text-xl font-medium md:text-2xl">
                {/* {satisfy?.numberIntoduce || 0} */}
                {satisfy.numberIntoduce}
              </p>
            </div>
            <div className="flex-1 hidden p-5 space-y-3 md:block">
              <p className="text-base text-gray-500 lg:text-lg">
                {/* {t("page.dashboard.satify.numberIntoduce")} */}
                Total Earn
              </p>
              <p className="text-xl font-medium md:text-2xl">
                {priceFomat(satisfy.discount)}
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
          <Policy />
          <PlanDashborad />
          <InviteDashboard />
          <Post />
        </div>
        {userCashHistory.length === 0 &&
        roseHistory.length === 0 &&
        transactions.length === 0 ? null : (
          <div className="hidden col-span-4 space-y-10 lg:block">
            <CashHistory
              userCashHistory={userCashHistory.filter(
                (item) => item.status !== 2
              )}
            />
            <RoseHistory roseHistory={roseHistory} />
            {/* <TransactionHistory transactions={transactions} /> */}
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
          <Label htmlFor="money" className="block py-5">
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
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Heading className="!text-primary">Welcome to VPNCN2 !</Heading>
      <div className="space-y-2">
        <p>{t("page.dashboard.userManual.heading")}</p>
        <ul className="pl-5 space-y-2 list-decimal">
          <li className="">{t("page.dashboard.userManual.title1")}</li>
          <li className="">{t("page.dashboard.userManual.title2")}</li>
          <li className="">{t("page.dashboard.userManual.title3")}</li>
          <li className="">{t("page.dashboard.userManual.title4")}</li>
          <li className="">{t("page.dashboard.userManual.title5")}</li>
          <div className="flex items-end gap-2">
            <p className="text-xl font-medium text-secondary40">
              {i18n.language === "vi"
                ? "Link download phần mềm"
                : i18n.language === "en"
                ? "Link download software"
                : "下载软件"}
            </p>
            <div className="flex flex-col items-center gap-7 group">
              <img src={logoOutline} className="w-[100px]" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-10 py-5 md:gap-16 lg:gap-20 ">
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
                  className="w-12 h-12 transition-all duration-300 fill-current md:w-20 md:h-20 group-hover:fill-primary"
                >
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
              </span>
              <span className="text-sm font-medium transition-all duration-300 group-hover:text-primary">
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
                  className="w-12 h-12 transition-all duration-300 fill-current md:w-20 md:h-20 group-hover:fill-primary"
                >
                  <path d="M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z" />
                </svg>
              </span>
              <span className="text-sm font-medium transition-all duration-300 group-hover:text-primary">
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
                  className="w-12 h-12 transition-all duration-300 fill-current md:w-20 md:h-20 group-hover:fill-primary"
                >
                  <path d="M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z" />
                </svg>
              </span>
              <span className="text-sm font-medium transition-all duration-300 group-hover:text-primary">
                AppStore(iOS)
              </span>
            </Link>
          </div>
          <span className="text-xl font-medium text-secondary40">
            {t("page.dashboard.userManual.note")}
          </span>
          <div className="flex flex-wrap items-stretch gap-10 py-5 md:gap-16 lg:gap-20">
            <Link
              to={
                "https://s3.ap-northeast-3.amazonaws.com/vpncn2.top/outlinefiles/win-outline-client-1.12.exe"
              }
              download
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-12 h-12 transition-all duration-300 fill-current md:w-20 md:h-20 group-hover:fill-primary"
                >
                  <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
                </svg>
              </span>
              <span className="text-sm font-medium transition-all duration-300 group-hover:text-primary">
                For Windows
              </span>
            </Link>
            <Link
              to={
                "https://s3.ap-northeast-3.amazonaws.com/vpncn2.top/outlinefiles/Outline-Client-1.12.apk"
              }
              download
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  className="w-12 h-12 transition-all duration-300 fill-current md:w-20 md:h-20 group-hover:fill-primary"
                >
                  <path d="M420.6 301.9a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m273.7-144.5 47.9-83a10 10 0 1 0 -17.3-10h0l-48.5 84.1a301.3 301.3 0 0 0 -246.6 0L116.2 64.5a10 10 0 1 0 -17.3 10h0l47.9 83C64.5 202.2 8.2 285.6 0 384H576c-8.2-98.5-64.5-181.8-146.9-226.6" />
                </svg>
              </span>
              <span className="text-sm font-medium text-center transition-all duration-300 group-hover:text-primary">
                For Android
                {/* : New version <br />
                (Recommend) */}
              </span>
            </Link>
            <Link
              to={
                "https://s3.ap-northeast-3.amazonaws.com/vpncn2.top/outlinefiles/linux-Outline-Client_1.12.appimage"
              }
              download
              className="flex flex-col items-center gap-7 group"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="w-12 h-12 transition-all duration-300 fill-current md:w-20 md:h-20 group-hover:fill-primary"
                >
                  <path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5 .2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4 .2-.8 .7-.6 1.1 .3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6 .2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5 .1-1.3 .6-3.4 1.5-3.2 2.9 .1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7 .1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9 .6 7.9 1.2 11.8 1.2 8.1 2.5 15.7 .8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1 .6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3 .4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4 .7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6 .6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7 .8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4 .6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1 .8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7 .4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6 .8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1 .3-.2 .7-.3 1-.5 .8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z" />
                </svg>
              </span>
              <span className="text-sm font-medium text-center transition-all duration-300 group-hover:text-primary">
                Linux
              </span>
            </Link>
          </div>
          <div className="">
            <p>{t("page.dashboard.userManual.contact1")}</p>
            <div className="flex items-center gap-10 mt-5">
              <div className="flex flex-col items-center gap-3">
                <img src={zalo} className="object-cover w-full aspect-square" />
                <p className="font-semibold uppercase">Zalo</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={wechat}
                  className="object-cover w-full aspect-square"
                />
                <p className="font-semibold uppercase">Wechat</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <img
                  src={whatapp}
                  className="object-cover w-full aspect-square"
                />
                <p className="font-semibold uppercase">whatapp</p>
              </div>
            </div>
          </div>
          <div className="">
            <p> {t("page.dashboard.userManual.contact2")}</p>
            <div className="grid grid-cols-4 gap-10 mt-5">
              <div className="flex flex-col items-center gap-3">
                <img
                  src={picture1}
                  className="object-cover w-full aspect-square"
                />
              </div>
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default DashboardUserPage;
