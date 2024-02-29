import { Modal, Table, TableColumnsType } from "antd";
import Heading from "../../components/common/Heading";
import { ExtendPlanType } from "../../type";
import { VND } from "../../utils/formatPrice";
import { toast } from "react-toastify";
import { api } from "../../api";
import { messages } from "../../constants";
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
  })
  .required();

const ExtendPlanPage = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listExtendPlan, setListExtendPlan] = useState<ExtendPlanType[]>([]);
  const [selectRow, setSelectRow] = useState<ExtendPlanType | undefined>();
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
      console.log("data - ", data);
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
      setListExtendPlan(result.data);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const handleDeleteExtendPlan = async (_id: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `Bạn có muốn xóa gói cước mở rộng này`,
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
        title: () => (
          <p className="font-primary text-base font-semibold">Ngày chỉnh sửa</p>
        ),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (text: string) => (
          <p className="font-primary text-sm">
            {dayjs(text).format("DD-MM-YYYY")}
          </p>
        ),
      },
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
              Chỉnh sửa
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
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

        <Table dataSource={listExtendPlan} columns={columns} />
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
            <Label htmlFor="price">Giá*</Label>
            <Input
              name="price"
              placeholder={""}
              control={control}
              type="number"
              min={0}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bandWidth">Băng thông*</Label>
            <Input
              name="bandWidth"
              placeholder={""}
              control={control}
              type="number"
              min={0}
            />
          </FormGroup>
          <Button type="submit" className="w-full text-white bg-primary">
            Thêm mới
          </Button>
        </form>
      </Modal>
    </RequireAuthPage>
  );
};

export default ExtendPlanPage;
