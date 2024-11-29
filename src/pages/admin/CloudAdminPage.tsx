import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Button from "../../components/button/Button";
import Heading from "../../components/common/Heading";
import { Input, Textarea } from "../../components/input";
import { DatePicker, Modal } from "antd";
import PickCloudForm from "../../components/cloud/PickCloudForm";
import PickProviderForm from "../../components/cloud/PickProviderForm";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { api } from "../../api";
import { toast } from "react-toastify";
import { CloudManagerType } from "../../type";
import { VND } from "../../utils/formatPrice";
import Swal from "sweetalert2";
import { DatePickerProps } from "antd";
import { messages } from "../../constants";
import IconTrash from "../../icons/IconTrash";
import { ListCloudManager } from "../../components/cloud-manager/ListCloudManager";
import _ from "lodash";

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
  const [selectDateTotalCost, setSelectDateTotalCost] = useState<Date | Dayjs>(
    dayjs()
  );
  const [costSelectMonth, setCostSelectMonth] = useState<number>(0);
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
        const result = await api.post<{ cost?: number }>(
          `/cloud-managers/total-cost`,
          { month: dayjs(selectDateTotalCost).format("YYYY-MM") }
        );
        setCostSelectMonth(result.data?.cost || 0);
      } catch (error) {
        console.log(messages.error);
      }
    })();
  }, [selectDateTotalCost]);
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
          index,
          ...item,
        }))
      );
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
      console.log("data ~ ", data);
      await api.post("/cloud-managers", data);
      handleFetchData();
      toast.success("Thêm Cloud Server thành công");
      reset();
      setOpenModal(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };
  // const handleChangeStatus = async (_id: string, status: 0 | 1) => {
  //   try {
  //     const { isConfirmed } = await Swal.fire({
  //       title: `<p class="leading-tight">Bạn có muốn đổi status cloud này</p>`,
  //       icon: "success",
  //       showCancelButton: true,
  //       confirmButtonColor: "#1DC071",
  //       cancelButtonColor: "#d33",
  //       cancelButtonText: "Thoát",
  //       confirmButtonText: "Đồng ý",
  //     });
  //     console.log("isComfirm ~ ", isConfirmed);
  //     if (isConfirmed) {
  //       await api.patch(`/cloud-managers/${_id}`, {
  //         status,
  //       });
  //       handleFetchData();
  //       toast.success("Đổi trạng thái thành công");
  //     }
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.log("error message: ", error);
  //       toast.error(error.response?.data.message);
  //     } else {
  //       console.log("unexpected error: ", error);
  //       return "An unexpected error occurred";
  //     }
  //   }
  // };
  const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
    setValue("startDate", dayjs(date).format("YYYY/MM/DD"));
  };
  const onChangeEndDate: DatePickerProps["onChange"] = (date) => {
    setValue("endDate", dayjs(date).format("YYYY/MM/DD"));
  };
  const onChangeDateTotalCoast: DatePickerProps["onChange"] = (date) => {
    setSelectDateTotalCost(dayjs(date));
  };
  // const columns: TableColumnsType<CloudManagerType> = useMemo(
  //   () => [
  //     {
  //       title: () => <p className="font-semibold font-primary">No</p>,
  //       dataIndex: "index",
  //       key: "index",
  //       width: 70,
  //       render: (text: number) => (
  //         <p className="text-sm font-primary">{text + 1}</p>
  //       ),
  //     },
  //     {
  //       title: <p className="font-semibold font-primary">Name</p>,
  //       dataIndex: "name",
  //       key: "name",
  //       render: (text: string, record) => (
  //         <Link
  //           to={`/admin/cloud/${record._id}`}
  //           className="text-sm font-primary text-primary"
  //         >
  //           {text}
  //         </Link>
  //       ),
  //     },
  //     {
  //       title: <p className="font-semibold font-primary">Status</p>,
  //       dataIndex: "status",
  //       key: "status",
  //       render: (status: 0 | 1, record) => {
  //         // const remain = dayjs(record.endDate).diff(dayjs(), "days");
  //         return (
  //           <div className="flex items-center gap-5">
  //             <Tooltip
  //               title={
  //                 status === 0 && record?.dieDate
  //                   ? DAY_FORMAT(record.dieDate)
  //                   : ""
  //               }
  //             >
  //               <div
  //                 onClick={() =>
  //                   handleChangeStatus(record._id, status === 0 ? 1 : 0)
  //                 }
  //                 className={classNames(
  //                   "w-2 h-2 rounded-full shrink-0",
  //                   status === 1 ? "bg-primary20" : "bg-error"
  //                 )}
  //               ></div>
  //             </Tooltip>

  //             {/* {remain >= 0 ? (
  //               <Tag color="green">Valid</Tag>
  //             ) : (
  //               <Tag color="red">Expired</Tag>
  //             )} */}

  //             {/* {record > 0 ? (
  //               <Tag color="green">Valid</Tag>
  //             ) : (
  //               <Tag color="red">Expired</Tag>
  //             )} */}
  //             {/* {dayjs(
  //               record.status === 0 ? record.dieDate : record.endDate
  //             ).diff(dayjs(), "days") > 0 ? (
  //               <Tag color="green">Valid</Tag>
  //             ) : (
  //               <Tag color="red">Expired</Tag>
  //             )} */}
  //             {dayjs(
  //               record.endDate
  //             ).diff(dayjs(), "days") > 0 ? (
  //               <Tag color="green">Valid</Tag>
  //             ) : (
  //               <Tag color="red">Expired</Tag>
  //             )}
  //           </div>
  //         );
  //       },
  //     },
  //     {
  //       title: <p className="font-semibold font-primary">Live/Valid</p>,
  //       dataIndex: "Live",
  //       key: "Live",
  //       render: (_, record) => {
  //         // const live = dayjs().diff(
  //         //   dayjs(
  //         //     record.status === 0 && record?.dieDate
  //         //       ? record.dieDate
  //         //       : record.startDate
  //         //   ),
  //         //   "days"
  //         // );
  //         // const valid = dayjs(record.endDate).diff(
  //         //   dayjs(record.startDate),
  //         //   "days"
  //         // );

  //         return (
  //           <p>
  //             {record.live} / {record.valid} days
  //           </p>
  //         );
  //       },
  //       width: 120,
  //     },
  //     {
  //       title: <p className="font-semibold font-primary">Date</p>,
  //       dataIndex: "date",
  //       key: "date",
  //       render: (_, record) => {
  //         return (
  //           <>
  //             <p className="text-sm font-primary">
  //               {dayjs(record.startDate).format("DD-MM-YYYY")}
  //             </p>
  //             <p className="text-sm font-primary">
  //               {dayjs(record.endDate).format("DD-MM-YYYY")}
  //             </p>
  //           </>
  //         );
  //       },
  //       width: 120,
  //     },
  //     // {
  //     //   title: <p className="font-semibold font-primary">Remain</p>,
  //     //   dataIndex: "remain",
  //     //   key: "remain",
  //     //   render: (text: number) => (
  //     //     <p className="text-sm font-primary">{text}</p>
  //     //   ),
  //     // },
  //     {
  //       title: <p className="font-semibold font-primary">Provider</p>,
  //       dataIndex: "provider",
  //       key: "provider",
  //       render: (_, record) => (
  //         <p className="text-sm font-primary">
  //           {providers.find((item) => item._id === record.providerId)?.name}
  //         </p>
  //       ),
  //     },
  //     {
  //       title: <p className="font-semibold font-primary">Cloud</p>,
  //       dataIndex: "cloud",
  //       key: "cloud",
  //       render: (_, record) => (
  //         <p className="text-sm font-primary">
  //           {clouds.find((item) => item._id === record.cloudId)?.name}
  //         </p>
  //       ),
  //     },
  //     // {
  //     //   title: <p className="font-semibold font-primary">Key</p>,
  //     //   dataIndex: "key",
  //     //   key: "key",
  //     //   render: (text: number) => (
  //     //     <p className="text-sm font-primary">{text}</p>
  //     //   ),
  //     // },
  //     {
  //       title: <p className="font-semibold font-primary">Server</p>,
  //       dataIndex: "server",
  //       key: "server",
  //       render: (text: number) => (
  //         <p className="text-sm font-primary">{text}</p>
  //       ),
  //     width: 80
  //     },
  //     {
  //       title: <p className="font-semibold font-primary">Price</p>,
  //       dataIndex: "price",
  //       key: "price",
  //       render: (text: number) => (
  //         <p className="text-sm font-primary">{VND.format(text)}</p>
  //       ),
  //     },
  //     {
  //       title: <p className="font-semibold font-primary"></p>,
  //       dataIndex: "action",
  //       key: "action",
  //       render: (_, record) => (
  //         <ButtonDeleteCloud
  //           cloudId={record._id}
  //           cloudName={record.name}
  //           handleFetchData={handleFetchData}
  //         />
  //       ),
  //       width: 80
  //     },
  //   ],
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [clouds, providers, listCloud]
  // );
  return (
    <div>
      <div className="grid grid-cols-2 p-5 gap-5 md:grid-cols-3 rounded-xl border-2 border-[#eeeeed] mb-5">
        <div className="flex-1 space-y-3">
          <p className="text-lg text-gray-500">Total cloud</p>
          <p className="text-2xl font-medium">
            {
              listCloud.filter((item) => item.status === 1 && item.remain > 0)
                .length
            }{" "}
            live / {listCloud.length}
          </p>
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-lg text-primary20">Total cost</p>
          <p className="text-2xl font-medium text-primary20">
            {VND.format(
              listCloud.reduce((prev, cur) => (prev += cur.price), 0)
            )}
            VND
          </p>
        </div>
        <div className="flex-1 space-y-3">
          <p className="text-lg text-[#ffaa01]">Total cost month</p>
          <div className="flex items-center gap-5">
            <p className="text-2xl font-medium text-[#ffaa01]">
              {VND.format(costSelectMonth)}VND
            </p>
            <DatePicker
              onChange={onChangeDateTotalCoast}
              value={dayjs(selectDateTotalCost)}
              placeholder="Select month"
              picker="month"
            />
          </div>
        </div>
      </div>
      <button
        className="py-2 px-5 text-white bg-secondary20 rounded-lg font-medium mb-5"
        type="button"
        onClick={() => setOpenModal(true)}
      >
        Thêm Cloud
      </button>
      {/* <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
        <Table
          loading={loading}
          dataSource={listCloud}
          columns={columns}
          scroll={{ x: 1000, y: 400 }}
        />
      </div> */}
      <div className="space-y-10">
        <ListCloudManager
          heading="List Cloud Live"
          clouds={clouds}
          handleFetchData={handleFetchData}
          listCloud={_.orderBy(
            listCloud.filter((item) => item.status === 1),
            ["startDate", ["desc"]]
          )}
          loading={loading}
          providers={providers}
        />
        <ListCloudManager
          heading="List Cloud Die Valid"
          clouds={clouds}
          handleFetchData={handleFetchData}
          listCloud={_.orderBy(
            listCloud.filter(
              (item) =>
                item.status === 0 &&
                dayjs(item.endDate).diff(dayjs(), "days") > 0
            ),
            ["startDate", ["desc"]]
          )}
          loading={loading}
          providers={providers}
        />
        <ListCloudManager
          heading="List Cloud Die"
          clouds={clouds}
          handleFetchData={handleFetchData}
          listCloud={_.orderBy(
            listCloud.filter(
              (item) =>
                item.status === 0 &&
                dayjs(item.endDate).diff(dayjs(), "days") <= 0
            ),
            ["startDate", ["desc"]]
          )}
          loading={loading}
          providers={providers}
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

export const ButtonDeleteCloud = ({
  cloudId,
  handleFetchData,
  cloudName,
}: {
  cloudId: string;
  handleFetchData: () => void;
  cloudName: string;
}) => {
  const [loading, setLoading] = useState(false);
  const handleRemoveCloud = async (_id: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Xoá cloud ${cloudName}</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Xóa",
      });
      if (isConfirmed) {
        setLoading(true);
        await api.delete(`/cloud-managers/${cloudId}`);
        handleFetchData();
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      className="w-7 flex items-center justify-center aspect-square text-xs font-medium text-white rounded-md bg-error font-primary"
      onClick={() => handleRemoveCloud(cloudId)}
    >
      {loading ? (
        <div className="w-3 h-3 border-white border-2 border-solid border-t-transparent animate-spin rounded-full" />
      ) : (
        <IconTrash className="size-4" />
      )}
    </button>
  );
};
