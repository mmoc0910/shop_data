import { Table, TableColumnsType } from "antd";
import { useEffect, useMemo, useState } from "react";
import { PlanType } from "../../type";
import { api } from "../../api";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { VND } from "../../utils/formatPrice";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import Loading from "../common/Loading";
import Heading from "../common/Heading";

const PlanDashborad = () => {
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
        title: `<p class="leading-tight">Bạn có muốn mua gói cước <span class="text-secondary">${plan.name} ${plan.bandWidth}GB</span></p>`,
        html: `<div>
            <p class="text-2xl font-semibold">${VND.format(plan.price)}VND/${
          plan.type
        }</p>
            <ul class="space-y-1 mt-3">
                ${plan.description.map((item) => `<li>${item}</li>`)}
            </ul>
        </div>`,
        // text: `${bandWidth}GB - ${VND.format(price)}VND/${type}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
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
  };
  const columns: TableColumnsType<PlanType> = useMemo(
    () => [
      {
        title: () => (
          <p className="font-primary text-base font-semibold">STT</p>
        ),
        dataIndex: "index",
        render: (_text: string, _record: PlanType, index: number) => (
          <p className="font-primary text-sm">{index + 1}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Tên gói</p>
        ),
        dataIndex: "name",
        key: "name",
        render: (text: string) => (
          <p className="font-primary text-sm">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Chu kỳ</p>
        ),
        dataIndex: "type",
        key: "type",
        render: (text: string) => (
          <p className="font-primary text-sm">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Băng thông</p>
        ),
        dataIndex: "bandWidth",
        key: "bandWidth",
        render: (text: string) => (
          <p className="font-primary text-sm">{text}GB</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Giá</p>
        ),
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="font-primary text-sm">{VND.format(text)}VND</p>
        ),
      },
      {
        title: () => <p className="font-primary text-base font-semibold"></p>,
        // dataIndex: "createdAt",
        key: "action",
        render: (_: string, record: PlanType) => (
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-error font-medium text-white font-primary text-sm hidden"
              onClick={() => handleChoosePlan(record)}
            >
              Mua ngay
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (plans.length > 0)
    return (
      <>
        {loading && <Loading />}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Heading>Gói cước</Heading>
            {plans.length > 5 ? (
              <Link
                to={"/user/plan"}
                className="text-primary font-medium underline decoration-primary"
              >
                Xem tất cả
              </Link>
            ) : null}
          </div>{" "}
          <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
            <Table
              dataSource={plans.slice(0, 5)}
              columns={columns}
              pagination={false}
              scroll={{x: 700}}
            />
          </div>
        </div>
      </>
    );
  return;
};

export default PlanDashborad;
