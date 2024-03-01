import { useEffect, useMemo, useState } from "react";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { PlanType } from "../../type";
import { toast } from "react-toastify";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Table, TableColumnsType } from "antd";
import axios from "axios";
import Swal from "sweetalert2";
import Heading from "../../components/common/Heading";
import { DAY_FORMAT } from "../../constants";
import dayjs from "dayjs";

const PackPage = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([
    "65dc5dcfb97c526c37096df2",
  ]);
  const [inputValue, setInputValue] = useState<string>("");
  const listPlanFilter = inputValue
    ? plans.filter(
        (item) =>
          item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          String(`${item.bandWidth}gb`).includes(inputValue.toLowerCase())
      )
    : plans;
  useEffect(() => {
    handleFetchPlans();
  }, []);
  const handleFetchPlans = async () => {
    try {
      const result = await api.get<PlanType[]>("/plans");
      setPlans(result.data.map((item) => ({ key: item._id, ...item })));
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const handleShowHomePage = async () => {
    try {
      if (selectedRowKeys.length > 3) {
        toast.warn("Không được chọn quá 3 gói để hiện thị");
      } else {
        selectedRowKeys.forEach(async (item) => {
          await api.patch(`/plans/${item}`, { display: 1 });
        });
        toast.success("Thành công")
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
  const handleRemovePlan = async (_id: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn xóa gói cước này</p>`,
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
        render: (text: string, record: PlanType) => (
          <Link
            to={`/admin/pack/edit/${record._id}`}
            className="font-primary text-sm text-primary font-medium"
          >
            {text}
          </Link>
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
        sorter: (a, b) => a.day - b.day,
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
        sorter: (a, b) => a.bandWidth - b.bandWidth,
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Ngày tạo</p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="font-primary text-sm">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
      {
        title: () => <p className="font-primary text-base font-semibold"></p>,
        // dataIndex: "createdAt",
        key: "action",
        render: (_: string, record: PlanType) => (
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-error font-medium text-white font-primary text-xs"
              onClick={() => handleRemovePlan(record._id)}
            >
              Xóa
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };
  return (
    <RequireAuthPage rolePage={1}>
      <div className="pb-10">
        <div className="mb-10 flex gap-10 justify-end">
          <Button
            className="px-5 text-white bg-secondary"
            href="/admin/pack/add"
          >
            Thêm gói cước
          </Button>
        </div>
        <div className="space-y-6">
          <Heading>Danh sách gói cước</Heading>{" "}
          <div className="flex items-center gap-5 pb-5">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                className="focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
                placeholder="Tìm kiếm"
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
            <div onClick={() => handleShowHomePage()}>
              <Button className="px-5 text-white bg-slate-400">
                Apply hiển thị trang chủ
              </Button>
            </div>
          </div>
          <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
            <Table
              dataSource={listPlanFilter}
              columns={columns}
              rowSelection={rowSelection}
            />
          </div>
        </div>
      </div>
    </RequireAuthPage>
  );
};

export default PackPage;
