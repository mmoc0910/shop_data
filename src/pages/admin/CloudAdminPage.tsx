import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "../../components/button/Button";
import Heading from "../../components/common/Heading";
import { Input, Textarea } from "../../components/input";
import { DatePicker, Modal, Table, Tag } from "antd";
import PickCloudForm from "../../components/cloud/PickCloudForm";
import PickProviderForm from "../../components/cloud/PickProviderForm";
import dayjs from "dayjs";
import axios from "axios";
import { api } from "../../api";
import { toast } from "react-toastify";
import { CloudManagerType } from "../../type";
import { TableColumnsType } from "antd";
import { VND } from "../../utils/formatPrice";
import classNames from "../../utils/classNames";
import Swal from "sweetalert2";
import { DatePickerProps } from "antd";
import { DAY_FORMAT } from "../../constants";

const schema = yup
  .object({
    name: yup.string().required("This field is required"),
    startDate: yup.string().required("This field is required"),
    endDate: yup.string().required("This field is required"),
    providerId: yup.string().required("This field is required"),
    cloudId: yup.string().required("This field is required"),
    key: yup.string().required("This field is required"),
    remark: yup.string().required("This field is required"),
    price: yup.number().required("This field is required"),
    status: yup.number().required(),
  })
  .required();
export const CloudAdminPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [clouds, setClouds] = useState<{ name: string; _id: string }[]>([]);
  const [providers, setProviders] = useState<{ name: string; _id: string }[]>(
    []
  );
  const [listCloud, setListCloud] = useState<CloudManagerType[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: {
      status: 1,
      name: "",
      startDate: "",
      endDate: "",
      providerId: "",
      cloudId: "",
      key: "",
      remark: "",
    },
  });
  const cloudWatch = watch("cloudId");
  const providerWatch = watch("providerId");
  useEffect(() => {
    (async () => {
      try {
        const [responseCloud, responseProvider] = await Promise.all([
          api.get("/cloulds"),
          api.get("/providers"),
        ]);
        setClouds(responseCloud.data);
        setProviders(responseProvider.data);
      } catch (error) {
        toast.error("Xảy ra lỗi trong quá trình xử lý");
      }
    })();
  }, []);
  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ listData: CloudManagerType[] }>(
        `/cloud-managers`
      );
      setListCloud(
        response.data.listData.map((item, index) => ({
          index: index + 1,
          ...item,
        }))
      );
      console.log("response ~ ", response.data);
    } catch (error) {
      toast.error("Xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data: {
    name: string;
    startDate: string;
    endDate: string;
    providerId: string;
    cloudId: string;
    key: string;
    remark: string;
    price: number;
    status: number;
  }) => {
    try {
      await api.post("/cloud-managers", data);
      handleFetchData();
      setOpenModal(false);
      toast.success("Thêm Cloud Server thành công");
      reset();
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
  const handleChangeStatus = async (_id: string, status: 0 | 1) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn đổi status cloud này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      console.log("isComfirm ~ ", isConfirmed);
      if (isConfirmed) {
        await api.patch(`/cloud-managers/${_id}`, {
          status,
        });
        handleFetchData();
        toast.success("Đổi trạng thái thành công");
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
  const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
    setValue("startDate", DAY_FORMAT(date));
  };
  const onChangeEndDate: DatePickerProps["onChange"] = (date) => {
    setValue("endDate", DAY_FORMAT(date));
  };
  const columns: TableColumnsType<CloudManagerType> = useMemo(
    () => [
      {
        title: () => <p className="font-semibold font-primary">No</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Name</p>,
        dataIndex: "name",
        key: "name",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary"></p>,
        dataIndex: "status",
        key: "status",
        render: (status: 0 | 1, record) => (
          <div
            onClick={() => handleChangeStatus(record._id, status === 0 ? 1 : 0)}
            className={classNames(
              "w-2 h-2 rounded-full",
              status === 1 ? "bg-primary20" : "bg-error"
            )}
          ></div>
        ),
        width: 40,
      },
      {
        title: <p className="font-semibold font-primary">Valid</p>,
        dataIndex: "valid",
        key: "valid",
        render: (_, record) =>
          record.remain >= 0 ? (
            <Tag color="green">Valid</Tag>
          ) : (
            <Tag color="red">Expired</Tag>
          ),
      },
      {
        title: <p className="font-semibold font-primary">Date</p>,
        dataIndex: "date",
        key: "date",
        render: (_, record) => (
          <>
            <p className="text-sm font-primary">
              {dayjs(record.startDate).format("DD-MM-YYYY")}
            </p>
            <p className="text-sm font-primary">
              {dayjs(record.endDate).format("DD-MM-YYYY")}
            </p>
          </>
        ),
        width: 120,
      },
      {
        title: <p className="font-semibold font-primary">Remain</p>,
        dataIndex: "remain",
        key: "remain",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Provider</p>,
        dataIndex: "provider",
        key: "provider",
        render: (_, record) => (
          <p className="text-sm font-primary">
            {providers.find((item) => item._id === record.providerId)?.name}
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Cloud</p>,
        dataIndex: "cloud",
        key: "cloud",
        render: (_, record) => (
          <p className="text-sm font-primary">
            {clouds.find((item) => item._id === record.cloudId)?.name}
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Key</p>,
        dataIndex: "key",
        key: "key",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Server</p>,
        dataIndex: "server",
        key: "server",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Price</p>,
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="text-sm font-primary">{VND.format(text)}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Remark</p>,
        dataIndex: "remark",
        key: "remark",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clouds, providers]
  );
  return (
    <div>
      <button
        className="py-2 px-5 text-white bg-secondary20 rounded-lg font-medium mb-5"
        type="button"
        onClick={() => setOpenModal(true)}
      >
        Thêm Cloud
      </button>
      <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
        <Table
          loading={loading}
          dataSource={listCloud}
          columns={columns}
          scroll={{ x: 1000, y: 400 }}
        />
      </div>
      <Modal
        centered
        open={openModal}
        onCancel={() => {
          reset();
          setOpenModal(false);
        }}
        footer={[]}
        width={"50%"}
      >
        <div className="space-y-5">
          <Heading>Thêm Cloud</Heading>
          <form
            className="gap-5 grid grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="w-full lg:flex-1 col-span-2">
              <Input
                name="name"
                type="text"
                placeholder={"Name"}
                control={control}
              />
            </div>
            <div className="w-full lg:flex-1 col-span-2">
              <Input
                name="key"
                type="text"
                placeholder={"Key"}
                control={control}
              />
            </div>
            <div className="w-full lg:flex-1">
              <DatePicker
                onChange={onChangeStartDate}
                className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
                placeholder="Start date"
                // defaultValue={dayjs()}
              />
            </div>
            <div className="w-full lg:flex-1">
              <DatePicker
                onChange={onChangeEndDate}
                className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
                placeholder="End date"
                // defaultValue={dayjs()}
              />
            </div>

            <div className="w-full lg:flex-1">
              <PickCloudForm
                location={cloudWatch}
                onSelectCloud={(value) => {
                  setValue("cloudId", value);
                }}
                error={
                  errors?.cloudId?.message ? errors.cloudId.message : undefined
                }
              />
            </div>
            <div className="w-full lg:flex-1">
              <PickProviderForm
                location={providerWatch}
                onSelectLocation={(value) => {
                  setValue("providerId", value);
                }}
                error={
                  errors?.cloudId?.message ? errors.cloudId.message : undefined
                }
              />
            </div>

            <div className="w-full lg:flex-1 col-span-2">
              <Input
                name="price"
                type="number"
                placeholder={"Price"}
                control={control}
              />
            </div>
            <div className="w-full lg:flex-1 col-span-2">
              <Textarea
                name="remark"
                placeholder={"Remark"}
                control={control}
                className="!h-[100px]"
              />
            </div>
            <div className="w-full lg:flex-1 col-span-2">
              <Button
                className="w-full px-5 py-2 text-white bg-secondary20 lg:w-fit ml-auto"
                type="submit"
              >
                Thêm cloud
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};
