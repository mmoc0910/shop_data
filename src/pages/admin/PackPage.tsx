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
import { Check } from "../../components/home/PricingBox";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import IconTrash from "../../icons/IconTrash";
import { useFormatPrice } from "../../hooks/useFormatPrice";
import { ButtonEnablePack } from "../../components/pack/ButtonEnablePack";

const PackPage = () => {
  const priceFomat = useFormatPrice();
  const { i18n } = useTranslation();
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [listPlanHistory, setListPlanHistory] = useState<PlanType[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [initialSelectedRowKeys, setInitialSelectedRowKeys] = useState<
    React.Key[]
  >([]);
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
      setPlans(
        result.data
          .filter((item) => item.status === 1)
          .map((item) => ({ ...item, key: item._id }))
      );
      setListPlanHistory(result.data.filter((item) => item.status === 0));
      setSelectedRowKeys(
        result.data
          .filter((item) => item.status === 1 && item.display === 1)
          .map((item) => item._id)
      );
      setInitialSelectedRowKeys(
        result.data
          .filter((item) => item.status === 1 && item.display === 1)
          .map((item) => item._id)
      );
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const handleShowHomePage = async () => {
    try {
      if (selectedRowKeys.length > 3) {
        toast.warn("Không được chọn quá 3 gói để hiện thị");
      } else {
        initialSelectedRowKeys.forEach(async (item) => {
          !selectedRowKeys.some((i) => i === item) &&
            (await api.patch(`/plans/${item}`, { display: 0 }));
        });
        selectedRowKeys.forEach(async (item) => {
          await api.patch(`/plans/${item}`, { display: 1 });
        });
        setInitialSelectedRowKeys(selectedRowKeys);
        toast.success("Thành công");
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
        title: () => <p className="font-semibold font-primary">STT</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Tên gói</p>,
        dataIndex: "name",
        key: "name",
        render: (text: string, record: PlanType) => (
          <Link
            to={`/admin/pack/edit/${record._id}`}
            className="text-sm font-medium font-primary text-primary"
          >
            {text}
          </Link>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Giá gói</p>,
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="text-sm font-primary">{priceFomat(text)}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Lượt mua</p>,
        dataIndex: "numberPurchase",
        key: "numberPurchase",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Chu kỳ</p>,
        dataIndex: "type",
        key: "type",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Ngày</p>,
        dataIndex: "day",
        key: "day",
        render: (text: string) => (
          <p className="text-sm font-primary">{text} ngày</p>
        ),
        sorter: (a, b) => a.day - b.day,
      },
      {
        title: () => <p className="font-semibold font-primary">Bandwidth</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}GB</p>
        ),
        sorter: (a, b) => a.bandWidth - b.bandWidth,
      },
      // {
      //   title: () => (
      //     <p className="font-semibold font-primary">Trạng thái</p>
      //   ),
      //   dataIndex: "status",
      //   key: "status",
      //   render: (status: 0 | 1) => (
      //     <div className="text-sm font-primary">
      //       {status === 1 ? (
      //         <Tag color="green">Hoạt động</Tag>
      //       ) : (
      //         <Tag color="red">Ngừng hoạt động</Tag>
      //       )}
      //     </div>
      //   ),
      // },
      {
        title: () => <p className="font-semibold font-primary">Ngày tạo</p>,
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
      {
        title: () => <p className="font-semibold font-primary"></p>,
        // dataIndex: "createdAt",
        key: "action",
        render: (_: string, record: PlanType) => (
          <div className="flex gap-4">
            {record.status === 1 ? (
              <div className="flex gap-2">
                {" "}
                <ButtonEnablePack
                  _id={record._id}
                  enable={!!record.enable}
                  onSuccess={handleFetchPlans}
                />
                <button
                  className="px-2 aspect-square text-xs font-medium text-white rounded-md bg-error font-primary"
                  onClick={() => handleRemovePlan(record._id)}
                >
                  <IconTrash className="w-5 h-5" />
                </button>
              </div>
            ) : null}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language, listPlanFilter]
  );
  const columnHistory: TableColumnsType<PlanType> = useMemo(
    () => [
      {
        title: () => <p className="font-semibold font-primary">STT</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Tên gói</p>,
        dataIndex: "name",
        key: "name",
        render: (text: string, record: PlanType) => (
          <Link
            to={`/admin/pack/edit/${record._id}`}
            className="text-sm font-medium font-primary text-primary"
          >
            {text}
          </Link>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Giá gói</p>,
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="text-sm font-primary">{priceFomat(text)}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Lượt mua</p>,
        dataIndex: "numberPurchase",
        key: "numberPurchase",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Chu kỳ</p>,
        dataIndex: "type",
        key: "type",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Ngày</p>,
        dataIndex: "day",
        key: "day",
        render: (text: string) => (
          <p className="text-sm font-primary">{text} ngày</p>
        ),
        sorter: (a, b) => a.day - b.day,
      },
      {
        title: () => <p className="font-semibold font-primary">Bandwidth</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}GB</p>
        ),
        sorter: (a, b) => a.bandWidth - b.bandWidth,
      },
      {
        title: () => <p className="font-semibold font-primary">Ngày tạo</p>,
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
      {
        title: () => <p className="font-semibold font-primary">Ngày xóa</p>,
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (text: Date, record: PlanType) =>
          record.status === 0 ? (
            <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
          ) : null,
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
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
    <RequireAuthPage rolePage={[1]}>
      <div className="pb-10">
        <div className="hidden mt-10 space-y-6 lg:block">
          <Heading>Gói cước hiển thị trang chủ</Heading>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((item) =>
              item.display === 1 ? (
                <PricingItem key={uuidv4()} plan={item} />
              ) : null
            )}
          </div>
        </div>
        <div className="flex justify-end gap-5 my-10">
          <Button
            className="px-5 text-white bg-primary20"
            href="/admin/pack/extend-plan"
          >
            Quản lý gói cước mở rộng
          </Button>
          <Button
            className="px-5 text-white bg-secondary"
            href="/admin/pack/add"
          >
            Thêm gói cước
          </Button>
        </div>
        <div className="space-y-4">
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
              dataSource={listPlanFilter.map((item, index) => ({
                index,
                ...item,
              }))}
              columns={columns}
              rowSelection={rowSelection}
              scroll={{ x: 1120 }}
            />
          </div>
        </div>
        <div className="mt-10 space-y-4">
          <Heading>Lịch sử gói cước</Heading>{" "}
          <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
            <Table
              dataSource={listPlanHistory.map((item, index) => ({
                index,
                ...item,
              }))}
              columns={columnHistory}
              scroll={{ x: 1120 }}
            />
          </div>
        </div>
      </div>
    </RequireAuthPage>
  );
};

export const PricingItem = ({ plan }: { plan: PlanType }) => {
  const priceFomat = useFormatPrice();
  const { name, price, description, type, bandWidth } = plan;
  return (
    <>
      <div className="flex flex-col items-center col-span-1 overflow-hidden shadow-xl rounded-2xl">
        <h4 className="px-3 py-2 font-medium rounded-bl-lg rounded-br-lg text-primary bg-primary bg-opacity-5">
          {name}
        </h4>
        <div className="pt-10 pb-10">
          <p className="mb-2 text-4xl font-medium text-primary">
            {priceFomat(price)}
            <span className="text-xl">/{type.split("_")[0]}</span>
          </p>
          <p className="mt-3 text-3xl font-semibold text-center text-primary">
            {bandWidth}GB
          </p>
        </div>
        <div className="w-[80%] mx-auto space-y-5 pb-16 mb-auto">
          {description
            .filter((item) => item.includes("vi_"))
            .map((desc) => (
              <Check content={desc.replace("vi_", "")} key={uuidv4()} />
            ))}
        </div>
        <button className="flex flex-col items-center justify-center w-full gap-2 py-4 bg-primary">
          <p className="text-xl font-medium text-white">Đăng ký mua</p>
        </button>
      </div>
    </>
  );
};

export default PackPage;
