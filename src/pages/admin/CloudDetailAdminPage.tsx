import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { CloudManagerType } from "../../type";
import { toast } from "react-toastify";
import { api } from "../../api";
import { BoxInfo } from "../../components/common/BoxInfo";
import dayjs from "dayjs";
import { VND } from "../../utils/formatPrice";
import axios from "axios";
import classNames from "../../utils/classNames";
import Swal from "sweetalert2";
import { Tag } from "antd";

export const CloudDetailAdminPage = () => {
  const { cloudId } = useParams();
  const [cloudDetail, setCloudDetail] = useState<CloudManagerType>();
  const [clouds, setClouds] = useState<{ name: string; _id: string }[]>([]);
  const [providers, setProviders] = useState<{ name: string; _id: string }[]>(
    []
  );
  useEffect(() => {
    handleFetchData();
  }, [cloudId]);
  useEffect(() => {
    handleFetchCloudsAndProviders();
  }, []);
  const handleFetchData = async () => {
    try {
      const response = await api(`/cloud-managers/${cloudId}`);
      setCloudDetail(response.data);
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trình xử lý");
    }
  };
  const handleFetchCloudsAndProviders = async () => {
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
  if (!cloudDetail) return null;
  return (
    <RequireAuthPage rolePage={[1]}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <BoxInfo label={"Cloud Name"}>{cloudDetail.name}</BoxInfo>
        <BoxInfo label={"Status"}>
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
        </BoxInfo>
        <BoxInfo label={"Valid"}>
          {cloudDetail.remain >= 0 ? (
            <Tag color="green">Valid</Tag>
          ) : (
            <Tag color="red">Expired</Tag>
          )}
        </BoxInfo>
        <BoxInfo label={"Provider"}>
          {providers.find((item) => item._id === cloudDetail.providerId)?.name}
        </BoxInfo>
        <BoxInfo label={"Cloud"}>
          {clouds.find((item) => item._id === cloudDetail.providerId)?.name}
        </BoxInfo>
        <BoxInfo label={"Key"}>{cloudDetail.key}</BoxInfo>
        <BoxInfo label={"Remark"}>{cloudDetail.remark}</BoxInfo>
        <BoxInfo label={"Start Date"}>
          {dayjs(cloudDetail.startDate).format("DD-MM-YYYY")}
        </BoxInfo>
        <BoxInfo label={"End Date"}>
          {dayjs(cloudDetail.endDate).format("DD-MM-YYYY")}
        </BoxInfo>
        <BoxInfo label={"Remain"}>{cloudDetail.remain}</BoxInfo>
        <BoxInfo label={"Server"}>{cloudDetail.server}</BoxInfo>
        <BoxInfo label={"Price"}>{`${VND.format(
          cloudDetail.price
        )}VND`}</BoxInfo>
      </div>
    </RequireAuthPage>
  );
};
