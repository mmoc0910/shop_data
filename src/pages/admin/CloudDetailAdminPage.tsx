import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { CloudManagerType } from "../../type";
import { toast } from "react-toastify";
import { api } from "../../api";
import dayjs from "dayjs";
import axios from "axios";
import classNames from "../../utils/classNames";
import Swal from "sweetalert2";
import { DatePicker, DatePickerProps, Tag } from "antd";
import Button from "../../components/button/Button";
import { Input, Textarea } from "../../components/input";
import PickProviderForm from "../../components/cloud/PickProviderForm";
import PickCloudForm from "../../components/cloud/PickCloudForm";
import Heading from "../../components/common/Heading";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { messages } from "../../constants";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";

const schema = yup
  .object({
    name: yup.string().required("This field is required"),
    startDate: yup.string().required("This field is required"),
    endDate: yup.string().required("This field is required"),
    dieDate: yup.string(),
    providerId: yup.string().required("This field is required"),
    cloudId: yup.string().required("This field is required"),
    key: yup.string().required("This field is required"),
    remark: yup.string().required("This field is required"),
    price: yup.number().required("This field is required"),
  })
  .required();
export const CloudDetailAdminPage = () => {
  const { cloudId } = useParams();
  const [cloudDetail, setCloudDetail] = useState<CloudManagerType>();
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
  const endDateWatch = watch("endDate");
  const dieDateWatch = watch("dieDate");
  const startDateWatch = watch("startDate");
  useEffect(() => {
    handleFetchData();
  }, [cloudId]);
  useEffect(() => {
    if (cloudDetail) {
      const {
        name,
        key,
        price,
        remark,
        cloudId,
        providerId,
        endDate,
        startDate,
      } = cloudDetail;
      reset({
        name,
        price,
        remark,
        cloudId,
        providerId,
        endDate: dayjs(endDate).format("YYYY/MM/DD"),
        key,
        startDate: dayjs(startDate).format("YYYY/MM/DD"),
        // dieDate: "2024/09/30",
      });
      cloudDetail.status === 0 &&
        cloudDetail.dieDate &&
        setValue("dieDate", dayjs(cloudDetail.dieDate).format("YYYY/MM/DD"));
    }
  }, [cloudDetail]);
  const handleFetchData = async () => {
    try {
      const response = await api(`/cloud-managers/${cloudId}`);
      setCloudDetail(response.data);
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trình xử lý");
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
        await api.put(`/cloud-managers/status/${_id}`, {
          status,
        });
        handleFetchData();
        toast.success("Đổi trạng thái thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
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
    dieDate?: string;
  }) => {
    try {
      const {
        name,
        startDate,
        endDate,
        providerId,
        cloudId,
        key,
        remark,
        price,
        dieDate,
      } = data;
      const dataSubmit: {
        name: string;
        startDate: string;
        endDate: string;
        providerId: string;
        cloudId: string;
        key: string;
        remark: string;
        price: number;
        dieDate?: string;
      } = {
        name,
        startDate,
        endDate,
        providerId,
        cloudId,
        key,
        remark,
        price,
      };
      if (dieDate && cloudDetail?.status === 0) dataSubmit.dieDate = dieDate;
      await api.patch(`/cloud-managers/${cloudDetail?._id}`, dataSubmit);
      handleFetchData();
      toast.success("Chỉnh sửa Cloud Server thành công");
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error(messages.error);
        return "An unexpected error occurred";
      }
    }
  };
  const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
    setValue("startDate", dayjs(date).format("YYYY/MM/DD"));
  };
  const onChangeEndDate: DatePickerProps["onChange"] = (date) => {
    setValue("endDate", dayjs(date).format("YYYY/MM/DD"));
  };
  const onChangedieDate: DatePickerProps["onChange"] = (date) => {
    setValue("dieDate", dayjs(date).format("YYYY/MM/DD"));
  };
  if (!cloudDetail) return null;
  return (
    <RequireAuthPage rolePage={[1]}>
      <div className="space-y-5">
        <div className="flex items-center gap-5">
          <Heading>Chi tiết Cloud:</Heading>
          <div className="flex items-center gap-5">
            <div
              onClick={() =>
                handleChangeStatus(
                  cloudDetail._id,
                  cloudDetail.status === 0 ? 1 : 0
                )
              }
              className={classNames(
                "w-4 h-4 rounded-full cursor-pointer",
                cloudDetail.status === 1 ? "bg-primary20" : "bg-error"
              )}
            ></div>

            {dayjs(
              cloudDetail.status === 0 && cloudDetail?.dieDate
                ? cloudDetail.dieDate
                : cloudDetail.endDate
            ).diff(dayjs(), "days") > 0 ? (
              <Tag color="green">Valid</Tag>
            ) : (
              <Tag color="red">Expired</Tag>
            )}
          </div>
        </div>
        <form
          className="gap-5 grid grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup className="w-full lg:flex-1 col-span-1">
            <Label htmlFor="name">Tên cloud*</Label>
            <Input
              name="name"
              type="text"
              placeholder={"Name"}
              control={control}
            />
          </FormGroup>
          <FormGroup className="w-full lg:flex-1 col-span-1">
            <Label htmlFor="name">Tên key*</Label>
            <Input
              name="key"
              type="text"
              placeholder={"Key"}
              control={control}
            />
          </FormGroup>
          <FormGroup className="w-full lg:flex-1 col-span-1">
            <Label htmlFor="name">Start date*</Label>
            <DatePicker
              onChange={onChangeStartDate}
              className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
              placeholder="Start date"
              value={dayjs(startDateWatch)}
            />
          </FormGroup>
          <FormGroup className="w-full lg:flex-1 col-span-1">
            <Label htmlFor="name">End date*</Label>
            <DatePicker
              onChange={onChangeEndDate}
              className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
              placeholder="End date"
              value={dayjs(endDateWatch)}
            />
          </FormGroup>
          {cloudDetail.status === 0 && (
            <FormGroup className="w-full lg:flex-1 col-span-1">
              <Label htmlFor="name">Die date*</Label>
              <DatePicker
                onChange={onChangedieDate}
                className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
                placeholder="Die date"
                value={dayjs(dieDateWatch)}
              />
            </FormGroup>
          )}
          <FormGroup className="w-full lg:flex-1 col-span-1">
            <Label htmlFor="name">Cloud*</Label>
            <PickCloudForm
              location={cloudWatch}
              onSelectCloud={(value) => {
                setValue("cloudId", value);
              }}
              error={
                errors?.cloudId?.message ? errors.cloudId.message : undefined
              }
            />
          </FormGroup>
          <FormGroup className="w-full lg:flex-1 col-span-1">
            <Label htmlFor="name">Provider*</Label>
            <PickProviderForm
              location={providerWatch}
              onSelectLocation={(value) => {
                setValue("providerId", value);
              }}
              error={
                errors?.cloudId?.message ? errors.cloudId.message : undefined
              }
            />
          </FormGroup>
          <FormGroup className="w-full lg:flex-1 col-span-1">
            <Label htmlFor="name">Price*</Label>
            <Input
              name="price"
              type="number"
              placeholder={"Price"}
              control={control}
            />
          </FormGroup>
          <FormGroup className="w-full lg:flex-1 col-span-2">
            <Label htmlFor="name">Description*</Label>
            <Textarea
              name="remark"
              placeholder={"Remark"}
              control={control}
              className="!h-[100px]"
            />
          </FormGroup>
          <div className="w-full lg:flex-1 col-span-2">
            <Button
              className="w-full px-5 py-2 text-white bg-secondary20"
              type="submit"
            >
              Sửa cloud
            </Button>
          </div>
        </form>
      </div>
    </RequireAuthPage>
  );
};
