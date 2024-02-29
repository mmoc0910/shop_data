import { useEffect, useMemo, useState } from "react";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { PlanType } from "../../type";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Table, TableColumnsType } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Heading from "../../components/common/Heading";

const PackPage = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);

  useEffect(() => {
    handleFetchPlans();
  }, []);
  const handleFetchPlans = async () => {
    try {
      const result = await api.get("/plans");
      setPlans(result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const handleRemovePlan = async (_id: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `Bạn có muốn xóa gói cước này`,
        // text: `${bandWidth}GB - ${VND.format(price)}VND/${type}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.delete(`/plans/${_id}`);
        handleFetchPlans();
        toast.success("Xóa thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
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
          <p className="font-primary text-base font-semibold">Ngày</p>
        ),
        dataIndex: "day",
        key: "day",
        render: (text: string) => (
          <p className="font-primary text-sm">{text} ngày</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Bandwidth</p>
        ),
        dataIndex: "bandWidth",
        key: "bandWidth",
        render: (text: string) => (
          <p className="font-primary text-sm">{text}GB</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Ngày tạo</p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: string) => (
          <p className="font-primary text-sm">
            {dayjs(text).format("DD-MM-YYYY")}
          </p>
        ),
      },
      {
        title: () => <p className="font-primary text-base font-semibold"></p>,
        // dataIndex: "createdAt",
        key: "action",
        render: (_: string, record: PlanType) => (
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-error font-medium text-white font-primary text-sm"
              onClick={() => handleRemovePlan(record._id)}
            >
              Xóa
            </button>
            <Link
              to={`/admin/pack/edit/${record._id}`}
              className="px-4 py-2 rounded-lg bg-primary font-medium text-white font-primary text-sm"
            >
              Chỉnh sửa
            </Link>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <RequireAuthPage rolePage={1}>
      <div className="pb-10">
        <div className="mb-16 flex gap-10 justify-end">
          {/* <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
          <Input name="search" placeholder={"Tìm kiếm"} control={control}>
            <button
              type="submit"
              className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </Input>
        </form> */}
          <Button
            className="px-5 text-white bg-secondary"
            href="/admin/pack/add"
          >
            Thêm gói cước
          </Button>
        </div>
        <div className="space-y-6">
          <Heading>Danh sách gói cước</Heading>{" "}
          <Table dataSource={plans} columns={columns} />
        </div>
      </div>
    </RequireAuthPage>
  );
};

export default PackPage;
