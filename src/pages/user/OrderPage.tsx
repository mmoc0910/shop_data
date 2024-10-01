import { useTranslation } from "react-i18next";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { ListOrderTable } from "../../components/user/ListOrderTable";
import { ExtendPlanType, RoseExtendType } from "../../type";
import dayjs from "dayjs";
import { useFormatPrice } from "../../hooks/useFormatPrice";
import Swal from "sweetalert2";
import { api } from "../../api";
import { toast } from "react-toastify";
import axios from "axios";
import { Radio } from "antd";
import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import Heading from "../../components/common/Heading";
import { useState } from "react";

const OrderPage = () => {
  const { t } = useTranslation();

  return (
    <RequireAuthPage rolePage={[2]}>
      <div className="bg-[#ffeaa754] rounded-lg p-5 mb-5">
        <p className="mb-1">
          {t("page.myOrder.instruct1")}{" "}
          <Link
            to={"/user/dashboard/post/android-vi_outline-phone-guide"}
            className="underline text-primary decoration-primary"
          >
            Link
          </Link>
          :
        </p>
        <div className="flex items-center gap-2 mb-1">
          <button className="text-white px-2 w-fit aspect-square rounded-md bg-secondary20">
            <AndroidXML />
          </button>
          <p>: {t("page.myOrder.instruct2")}</p>
        </div>
        <div className="flex items-center gap-2 mb-5">
          <button className="text-white px-2 w-fit aspect-square rounded-md bg-gray-400">
            <AndroidXML />
          </button>
          <p>: {t("page.myOrder.instruct3")}</p>
        </div>
      </div>
      {/* <p className="flex items-center gap-2 mb-5">
        <span>
          <AndroidXML />
        </span>
        : Link kết nối phụ khi link chính bị chết
      </p> */}
      {/* <div className="items-center block gap-5 pb-5 space-y-3 md:flex md:space-y-0">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
            placeholder={t("page.searchPlaceholder")}
          />
          {inputValue.length > 0 ? (
            <span
              className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
              onClick={() => setInputValue("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-icon-color"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ) : null}
        </div>
      </div> */}
      {/* <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
        <Table
          // dataSource={listGist.data.map((item, index) => ({ index, ...item }))}
          dataSource={listGist.data}
          columns={columns}
          loading={loadingTable}
          scroll={{ x: 1400, y: 500 }}
          pagination={{
            defaultCurrent: 1,
            total: listGist.totalItems,
            onChange: (index) => setPage(index),
            pageSize,
            onShowSizeChange,
          }}
        />
      </div> */}
      {/* <Modal
        width={1200}
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setSelectRow(undefined);
        }}
        footer={[]}
      >
        <Heading className="font-primary">
          {t("page.myOrder.swal.buyData.title2")}
        </Heading>
        <div className="grid grid-cols-1 gap-5 py-3 md:grid-cols-2 lg:grid-cols-3">
          {roseExtend &&
            listExtendPlan.map((item) => (
              <ExtendPlanItem
                key={uuidv4()}
                extendPlan={item}
                onSubmit={() => {
                  handleOk();
                  handleFetchData();
                }}
                selectRow={selectRow}
                setLoading={(value: boolean) => setLoading(value)}
                roseExtend={roseExtend}
              />
            ))}
        </div>
        <div className="flex justify-end mt-5">
          <button
            className="px-4 py-2 font-medium text-white rounded-lg bg-error font-primary"
            onClick={() => {
              handleCancel();
              setSelectRow(undefined);
            }}
          >
            {t("page.myOrder.swal.buyData.cancelModal")}
          </button>
        </div>
      </Modal> */}
      <ListOrderTable status={1} />
      <div className="pt-10 space-y-7">
        <Heading>Exprired List Key</Heading>
        <ListOrderTable status={0} />
      </div>
    </RequireAuthPage>
  );
};

export const ExtendPlanItem = ({
  selectRow,
  extendPlan,
  setLoading,
  onSubmit,
  roseExtend,
}: {
  selectRow?: { id: string; endDate: Date };
  extendPlan: ExtendPlanType;
  setLoading: (value: boolean) => void;
  onSubmit: () => void;
  roseExtend: RoseExtendType;
}) => {
  const priceFomat = useFormatPrice();
  const { t } = useTranslation();
  const period =
    selectRow?.endDate && dayjs(selectRow.endDate).diff(dayjs(), "month") + 1;
  const [month, setMonth] = useState<number>(1);
  console.log("ahcvh - ", roseExtend);
  const discountPercent =
    month <= 4
      ? roseExtend.level1
      : month > 4 && month <= 8
      ? roseExtend.level2
      : roseExtend.level3;
  const priceDiscount =
    extendPlan.price * month * ((100 - discountPercent) / 100);
  const navigation = useNavigate();
  const handleUpgradeBrandWidth = async (
    extendPlanId: string,
    gistId: string,
    bandWidth: number,
    month: number
  ) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">${t(
          "page.myOrder.swal.buyData.title"
        )} <span class="text-secondary">${bandWidth}GB</span></p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: t("page.myOrder.swal.buyData.cancelButton"),
        confirmButtonText: t("page.myOrder.swal.buyData.confirmButton"),
      });
      if (isConfirmed) {
        setLoading(true);
        await api.post("/upgrades/band-width", { gistId, extendPlanId, month });
        onSubmit();
        // handleOk();
        // handleFetchData();
        toast.success(t("page.myOrder.swal.buyData.success"));
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
        if (
          error.response?.data.message ===
            "Bạn không đủ tiền để đăng kí dịch vụ này" &&
          error.response.status === 400
        ) {
          toast.warn(t("page.myOrder.swal.buyData.error"));
          navigation("/user/dashboard");
        }
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      key={uuidv4()}
      className="flex flex-col justify-between p-5 space-y-3 rounded-lg shadow-xl font-primary"
    >
      <p className="text-base font-semibold text-center">{extendPlan.name}</p>
      <p className="text-xl font-medium text-center">
        {extendPlan.bandWidth}GB/{t("page.myOrder.swal.buyData.month")} -{" "}
        {priceFomat(priceDiscount || 0)}
      </p>
      <div className="flex items-center gap-5">
        <Radio checked={month === 1} onClick={() => setMonth(1)}>
          {t("page.myOrder.swal.buyData.month")}
        </Radio>
        {period && period > 1 ? (
          <Radio checked={month === period} onClick={() => setMonth(period)}>
            {t("page.myOrder.swal.buyData.months", { month: period })}
          </Radio>
        ) : null}
        {/* {!month && <p className="text-error">Bạn chưa chọn thời gian</p>} */}
      </div>
      <button
        className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-secondary40 font-primary"
        onClick={() =>
          selectRow &&
          month &&
          handleUpgradeBrandWidth(
            extendPlan._id,
            selectRow.id,
            extendPlan.bandWidth,
            month
          )
        }
      >
        {t("page.myOrder.swal.buyData.buyNow")}
      </button>
    </div>
  );
};

export const IosXML = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      className="w-4 h-4"
    >
      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
    </svg>
  );
};

export const AndroidXML = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className="w-4 h-4 fill-current"
    >
      <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
    </svg>
  );
};

export default OrderPage;
