import { Modal, Table, TableColumnsType } from "antd";
import Heading from "../../components/common/Heading";
import { ExtendPlanType } from "../../type";
import { toast } from "react-toastify";
import { api } from "../../api";
import { DAY_FORMAT, messages } from "../../constants";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import Button from "../../components/button/Button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import Swal from "sweetalert2";
import RoseExtendPlan from "../../components/extendPlan/RoseExtendPlan";
import { useTranslation } from "react-i18next";
import IconTrash from "../../icons/IconTrash";
import IconEdit from "../../icons/IconEdit";
import { Checkbox } from "../../components/checkbox";
import { useFormatPrice } from "../../hooks/useFormatPrice";

const schema = yup
  .object({
    name: yup.string().required("This field is required"),
    price: yup.number().required("This field is required"),
    bandWidth: yup.number().required("This field is required"),
  })
  .required();

const ExtendPlanPage = () => {
  const priceFomat = useFormatPrice();
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listExtendPlan, setListExtendPlan] = useState<ExtendPlanType[]>([]);
  const [listExtendPlanDelete, setListExtendPlanDelete] = useState<
    ExtendPlanType[]
  >([]);
  const [selectRow, setSelectRow] = useState<ExtendPlanType | undefined>();
  const [inputValue, setInputValue] = useState<string>("");
  const listExtendPlanFilter = inputValue
    ? listExtendPlan.filter(
        (item) =>
          item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          `${item.bandWidth}gb`.includes(inputValue.toLowerCase())
      )
    : listExtendPlan;
  const { handleSubmit, control, reset, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  useEffect(() => {
    if (selectRow) {
      setValue("name", selectRow.name);
      setValue("price", selectRow.price);
      setValue("bandWidth", selectRow.bandWidth);
    } else {
      reset();
    }
  }, [reset, selectRow, setValue]);
  const onSubmit = async (data: {
    name: string;
    price: number;
    bandWidth: number;
  }) => {
    try {
      if (selectRow) {
        await api.patch(`/extend-plans/${selectRow._id}`, data);
        toast.success("Sửa thành công");
        setSelectRow(undefined);
      } else {
        await api.post("/extend-plans", data);
        toast.success("Thêm thành công");
      }
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    } finally {
      handleOk();
      reset();
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const result = await api.get<ExtendPlanType[]>("/extend-plans");
      setListExtendPlan(result.data.filter((item) => item.status === 1));
      setListExtendPlanDelete(result.data.filter((item) => item.status === 0));
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const handleDeleteExtendPlan = async (_id: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn xóa gói cước mở rộng này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.delete(`/extend-plans/${_id}`);
        fetchData();
        toast.success("Xóa thành công");
      }
    } catch (error) {
      console.log("error - ", error);
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
  const columns: TableColumnsType<ExtendPlanType> = useMemo(
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
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Lượt mua</p>,
        dataIndex: "numberPurchase",
        key: "numberPurchase",
        render: (text) => <p className="text-sm font-primary">{text}</p>,
      },
      {
        title: () => <p className="font-semibold font-primary">Giá</p>,
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="text-sm font-primary">
            {" "}
            {priceFomat(text)}
          </p>
        ),
        sorter: {
          compare: (a, b) => a.price - b.price,
          multiple: 1,
        },
      },
      {
        title: () => <p className="font-semibold font-primary">Băng thông</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}GB</p>
        ),
        sorter: {
          compare: (a, b) => a.bandWidth - b.bandWidth,
          multiple: 2,
        },
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
      // {
      //   title: () => (
      //     <p className="font-semibold font-primary">Ngày chỉnh sửa</p>
      //   ),
      //   dataIndex: "updatedAt",
      //   key: "updatedAt",
      //   render: (text: Date) => (
      //     <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
      //   ),
      //   sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      // },
      {
        title: "",
        dataIndex: "action",
        key: "action",
        render: (_: string, record: ExtendPlanType) => (
          <div className="flex gap-2">
            <button
              className="px-2 aspect-square text-sm font-medium text-white rounded-md bg-error font-primary"
              onClick={() => handleDeleteExtendPlan(record._id)}
            >
              <IconTrash className="size-4" />
            </button>
            <button
              className="px-2 aspect-square text-sm font-medium text-white rounded-md bg-primary font-primary"
              onClick={() => {
                setSelectRow(record);
                showModal();
              }}
            >
              <IconEdit className="size-4" />
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const columnDelete: TableColumnsType<ExtendPlanType> = useMemo(
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
        title: () => (
          <p className="text-base font-semibold font-primary">Tên gói</p>
        ),
        dataIndex: "name",
        key: "name",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="text-base font-semibold font-primary">Lượt mua</p>
        ),
        dataIndex: "numberPurchase",
        key: "numberPurchase",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="text-base font-semibold font-primary">Giá</p>
        ),
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="text-sm font-primary">
            {" "}
            {priceFomat(text)}
          </p>
        ),
        sorter: {
          compare: (a, b) => a.price - b.price,
          multiple: 1,
        },
      },
      {
        title: () => (
          <p className="text-base font-semibold font-primary">Băng thông</p>
        ),
        dataIndex: "bandWidth",
        key: "bandWidth",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}GB</p>
        ),
        sorter: {
          compare: (a, b) => a.bandWidth - b.bandWidth,
          multiple: 2,
        },
      },
      {
        title: () => (
          <p className="text-base font-semibold font-primary">Ngày tạo</p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
      {
        title: () => (
          <p className="text-base font-semibold font-primary">Ngày xóa</p>
        ),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  return (
    <RequireAuthPage rolePage={[1]}>
      <div className="space-y-6">
        <div className="space-y-6">
          <RoseExtendPlan />
          <div className="flex justify-between">
            <Heading>Danh sách gói mở rộng</Heading>
            <div onClick={showModal}>
              <Button className="px-5 font-semibold text-white bg-primary">
                Thêm mới
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-5">
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
          </div>
          <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
            <Table
              dataSource={listExtendPlanFilter.map((item, index) => ({
                index,
                ...item,
              }))}
              columns={columns}
              scroll={{ x: 1120 }}
            />
          </div>
        </div>
        <div className="space-y-6">
          <Heading>Lịch sử gói mở rộng</Heading>
          <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
            <Table
              dataSource={listExtendPlanDelete.map((item, index) => ({
                index,
                ...item,
              }))}
              columns={columnDelete}
              scroll={{ x: 1120 }}
            />
          </div>
        </div>
      </div>
      <Modal
        title="Thêm gói cước mở rộng"
        open={isModalOpen}
        onCancel={() => {
          if (selectRow) setSelectRow(undefined);
          handleCancel();
        }}
        footer={[]}
      >
        <form
          className="space-y-[15px] md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <Label htmlFor="name">Tên gói*</Label>
            <Input name="name" placeholder={""} control={control} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bandWidth">Băng thông(GB)*</Label>
            <Input
              name="bandWidth"
              placeholder={""}
              control={control}
              type="number"
              min={0}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="price">Giá(/tháng)*</Label>
            <Input
              name="price"
              placeholder={""}
              control={control}
              type="number"
              min={0}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="price">Status*</Label>
            <Checkbox checked={!!selectRow?.status}>
              {selectRow?.status ? "Active" : "InActive"}
            </Checkbox>
          </FormGroup>
          <Button type="submit" className="w-full text-white bg-primary">
            {selectRow ? "Chỉnh sửa" : "Thêm mới"}
          </Button>
        </form>
      </Modal>
    </RequireAuthPage>
  );
};

export default ExtendPlanPage;
