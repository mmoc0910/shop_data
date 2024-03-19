import { Modal, Tooltip } from "antd";
import Heading from "../../components/common/Heading";
import { priceFomat } from "../../utils/formatPrice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/button/Button";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { api } from "../../api";
import CashHistory from "../../components/user/CashHistory";
// import TransactionHistory from "../../components/user/TransactionHistory";
import RoseHistory from "../../components/user/RoseHistory";
import {
  CashType,
  CollabType,
  CommisionType,
  CoutryType,
  RoseType,
  SatisfyType,
  TransactionType,
} from "../../type";
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
import { setSatify } from "../../store/satisfy/satisfySlice";
import { setCommision } from "../../store/commision/commisionSlice";
import { setCollab } from "../../store/collab/collabSlice";
import Post from "../../components/user/Post";
import { useTranslation } from "react-i18next";

const schema = yup
  .object({
    money: yup.number().required("This field is required"),
  })
  .required();

const DashboardUserPage = () => {
  const { t, i18n } = useTranslation();
  const { _id } = useSelector((state: RootState) => state.auth);
  const satisfy = useSelector((state: RootState) => state.satisfy);
  const commision = useSelector((state: RootState) => state.commision);
  const [userCashHistory, setUserCashHistory] = useState<CashType[]>([]);
  const [roseHistory, setRoseHistory] = useState<RoseType[]>([]);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const [
          { data: dataSatify },
          { data: dataCommision },
          { data: dataCollab },
        ] = await Promise.all([
          api.get<SatisfyType>(`/satisfy/${_id}`),
          api.get<CommisionType>("/commisions"),
          api.get<CollabType>("/collab"),
        ]);
        dispatch(
          setSatify({
            cash: dataSatify.cash[0]?.money || 0,
            rose: dataSatify.rose[0]?.money || 0,
            currentMoney: dataSatify.currentMoney,
            numberIntoduce: dataSatify.numberIntoduce,
            transaction: dataSatify.transaction[0]?.money || 0,
          })
        );
        dispatch(
          setCommision({ value: dataCommision.value, min: dataCommision.min })
        );
        dispatch(
          setCollab({
            level1: dataCollab.level1,
            level2: dataCollab.level2,
            level3: dataCollab.level3,
            minLevel1: dataCollab.minLevel1,
            minLevel2: dataCollab.minLevel2,
            minLevel3: dataCollab.minLevel3,
          })
        );
      } catch (error) {
        console.log("error - ", error);
      }
    })();
  }, [_id, dispatch]);
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
          data.money,
          i18n.language as CoutryType
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
    <RequireAuthPage rolePage={2}>
      <div className="grid-cols-12 lg:grid gap-x-12 gap-y-10">
        <div className="col-span-12 mb-5 space-y-4 lg:mb-0">
          {/* <Heading>Thống kê chi tiết</Heading> */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-xl border-2 border-[#eeeeed]">
            <div className="flex-1 p-5 space-y-3">
              <p className="text-base text-gray-500 lg:text-lg">
                {t("page.dashboard.satify.cash")}
              </p>

              <p className="text-xl font-medium md:text-2xl">
                {priceFomat(satisfy.cash, i18n.language as CoutryType)}
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
                {priceFomat(
                  satisfy ? satisfy.currentMoney : 0,
                  i18n.language as CoutryType
                )}
              </p>
            </div>
            <div className="flex-1 hidden p-5 space-y-3 md:block">
              <p className="text-base text-gray-500 lg:text-lg">
                {t("page.dashboard.satify.transaction")}
              </p>
              <div className="">
                <p className="text-xl font-medium md:text-2xl text-error">
                  {priceFomat(satisfy.transaction, i18n.language as CoutryType)}
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
                {priceFomat(satisfy.rose, i18n.language as CoutryType)}
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
          <li className="">
            {t("page.dashboard.userManual.title3")}
            {/* Bạn có thể kết nối VPN nhiều thiết bị cùng 1 lúc, Nhưng khuyến cáo{" "}
            <span className="text-error">KHÔNG ĐƯỢC</span> chia sẻ cho người
            khác cùng sử dụng, nếu vượt quá băng thông sẽ không truy cập được
            tiếp mà sẽ phải mua thêm băng thông tại mục{" "}
            <span className="text-secondary">
              Đơn hàng của tôi {">"} Chọn Key của bạn {">"} Mua data
            </span> */}
          </li>
          <li className="">{t("page.dashboard.userManual.title4")}</li>
          <li className="">{t("page.dashboard.userManual.title5")}</li>
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
              to={"http://woot2.vn/vpncn2/Win-outline-client.zip"}
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
              to={"http://woot2.vn/vpncn2/Outline-Client-1.12.apk"}
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
                For Android: New version <br />
                (Recommend)
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
