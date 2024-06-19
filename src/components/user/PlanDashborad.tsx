import { Table, TableColumnsType } from "antd";
import { useEffect, useMemo, useState } from "react";
import { PlanType } from "../../type";
import { api } from "../../api";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import Loading from "../common/Loading";
import Heading from "../common/Heading";
import { useTranslation } from "react-i18next";
import { translateType } from "../../constants";
import { useFormatPrice } from "../../hooks/useFormatPrice";

const PlanDashborad = () => {
  const priceFomat = useFormatPrice();
  const { t, i18n } = useTranslation();
  const { _id } = useSelector((state: RootState) => state.auth);
  const [plans, setPlans] = useState<PlanType[]>([]);
  const navigation = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    handleFetchPlans();
  }, []);
  const handleFetchPlans = async () => {
    try {
      const result = await api.get("/plans?status=1");
      setPlans(result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const handleChoosePlan = async (plan: PlanType) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">${t(
          "page.package.swal.title"
        )} <span class="text-secondary">${plan.name} ${
          plan.bandWidth
        }GB</span></p>`,

        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: t("page.package.swal.cancelButton"),
        confirmButtonText: t("page.package.swal.confirmButton"),
      });
      if (isConfirmed) {
        setLoading(true);
        await api.post("/gists", {
          userId: _id,
          planId: plan._id,
        });
        toast.success(t("page.package.swal.success"));
        navigation("/user/order");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
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
  };
  const columns: TableColumnsType<PlanType> = useMemo(
    () => [
      {
        title: () => <p className="text-sm font-semibold font-primary"></p>,
        dataIndex: "index",
        key: "index",
        render: (text: string) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.dashboard.plan.field.name")}
          </p>
        ),
        dataIndex: "name",
        key: "name",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.dashboard.plan.field.type")}
          </p>
        ),
        dataIndex: "type",
        key: "type",
        render: (text: string) => (
          <p className="text-sm font-primary">
            {translateType(text, i18n.language)}
          </p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.dashboard.plan.field.bandwidth")}
          </p>
        ),
        dataIndex: "bandWidth",
        key: "bandWidth",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}GB</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.dashboard.plan.field.price")}
          </p>
        ),
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="text-sm font-primary">
            {priceFomat(text)}VND
          </p>
        ),
      },
      {
        title: () => <p className="text-sm font-semibold font-primary"></p>,
        // dataIndex: "createdAt",
        key: "action",
        render: (_: string, record: PlanType) => (
          <div className="flex gap-4">
            <button
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-error font-primary"
              onClick={() => handleChoosePlan(record)}
            >
              {t("page.dashboard.buyNow")}
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
  );
  if (plans.length > 0)
    return (
      <>
        {loading && <Loading />}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading>{t("page.dashboard.plan.heading")}</Heading>
            {plans.length > 5 ? (
              <Link
                to={"/user/plan"}
                className="font-medium underline text-primary decoration-primary"
              >
                {t("page.dashboard.seeAll")}
              </Link>
            ) : null}
          </div>{" "}
          <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
            <Table
              dataSource={plans
                .slice(0, 5)
                .map((item, index) => ({ index, ...item }))}
              columns={columns}
              pagination={false}
              scroll={{ x: 700 }}
            />
          </div>
        </div>
      </>
    );
  return;
};

export default PlanDashborad;
