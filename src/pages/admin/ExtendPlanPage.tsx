import { Modal, Table, TableColumnsType } from "antd";
import Heading from "../../components/common/Heading";
import { ExtendPlanType } from "../../type";
import { VND } from "../../utils/formatPrice";
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

const schema = yup
  .object({
    name: yup.string().required("This field is required"),
    price: yup.number().required("This field is required"),
    bandWidth: yup.number().required("This field is required"),
    level1: yup.number().required("This field is required"),
    level2: yup.number().required("This field is required"),
    level3: yup.number().required("This field is required"),
  })
  .required();

const ExtendPlanPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listExtendPlan, setListExtendPlan] = useState<ExtendPlanType[]>([]);
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
      setValue("level1", selectRow.level1);
      setValue("level2", selectRow.level2);
      setValue("level3", selectRow.level3);
    } else {
      reset();
    }
  }, [reset, selectRow, setValue]);
  const onSubmit = async (data: {
    name: string;
    price: number;
    bandWidth: number;
    level1: number;
    level2: number;
    level3: number;
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
      const result = await api.get<ExtendPlanType[]>("/extend-plans?status=1");
      setListExtendPlan(result.data);
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
        title: () => (
          <p className="font-primary text-base font-semibold">STT</p>
        ),
        dataIndex: "index",
        render: (_text: string, _record: ExtendPlanType, index: number) => (
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
          <p className="font-primary text-base font-semibold">Giá</p>
        ),
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="font-primary text-sm">{VND.format(text)}VND</p>
        ),
        sorter: {
          compare: (a, b) => a.price - b.price,
          multiple: 1,
        },
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">{`<=`}4 tháng</p>
        ),
        dataIndex: "level1",
        key: "level1",
        render: (text: number) => (
          <p className="font-primary text-sm">{text}%</p>
        ),
        sorter: {
          compare: (a, b) => a.level1 - b.level1,
          multiple: 1,
        },
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">5-8 tháng</p>
        ),
        dataIndex: "level2",
        key: "level2",
        render: (text: number) => (
          <p className="font-primary text-sm">{text}%</p>
        ),
        sorter: {
          compare: (a, b) => a.level2 - b.level2,
          multiple: 1,
        },
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">{`>=`}9 tháng</p>
        ),
        dataIndex: "level3",
        key: "level3",
        render: (text: number) => (
          <p className="font-primary text-sm">{text}%</p>
        ),
        sorter: {
          compare: (a, b) => a.level3 - b.level3,
          multiple: 1,
        },
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
        sorter: {
          compare: (a, b) => a.bandWidth - b.bandWidth,
          multiple: 2,
        },
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
      // {
      //   title: () => (
      //     <p className="font-primary text-base font-semibold">Ngày chỉnh sửa</p>
      //   ),
      //   dataIndex: "updatedAt",
      //   key: "updatedAt",
      //   render: (text: Date) => (
      //     <p className="font-primary text-sm">{DAY_FORMAT(text)}</p>
      //   ),
      //   sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      // },
      {
        title: "",
        dataIndex: "action",
        key: "action",
        render: (_: string, record: ExtendPlanType) => (
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-error font-medium text-white font-primary text-sm"
              onClick={() => handleDeleteExtendPlan(record._id)}
            >
              Xóa
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-primary font-medium text-white font-primary text-sm"
              onClick={() => {
                setSelectRow(record);
                showModal();
              }}
            >
              Edit
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  return (
    <RequireAuthPage rolePage={1}>
      <div className="space-y-6">
        <div className="flex justify-between">
          <Heading>Danh sách gói mở rộng</Heading>
          <div onClick={showModal}>
            <Button className="bg-primary text-white font-semibold px-5">
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
          <Table dataSource={listExtendPlanFilter} columns={columns} scroll={{x: 1120}} />
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
          <div className="grid grid-cols-3 gap-5">
            <FormGroup>
              <Label htmlFor="price">{`<=`}4 tháng(%)*</Label>
              <Input
                name="level1"
                placeholder={""}
                control={control}
                type="number"
                min={0}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="price">5-8 tháng(%)*</Label>
              <Input
                name="level2"
                placeholder={""}
                control={control}
                type="number"
                min={0}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="price">{`>=`}9 tháng(%)*</Label>
              <Input
                name="level3"
                placeholder={""}
                control={control}
                type="number"
                min={0}
              />
            </FormGroup>
          </div>
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

          <Button type="submit" className="w-full text-white bg-primary">
            {selectRow ? "Chỉnh sửa" : "Thêm mới"}
          </Button>
        </form>
      </Modal>
    </RequireAuthPage>
  );
};

export default ExtendPlanPage;
