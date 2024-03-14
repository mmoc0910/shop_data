import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { KeyDetailType, ServerType } from "../../type";
import { api } from "../../api";
import Heading from "../../components/common/Heading";
import { DAY_FORMAT } from "../../constants";
import { Modal, Tooltip } from "antd";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { AndroidXML } from "../user/OrderPage";
import EditKeyLimitForm from "../../components/server/EditKeyLimitForm";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import EditStatusForm from "../../components/server/EditStatusForm";
import Radio from "../../components/radio/Radio";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import Loading from "../../components/common/Loading";

const KeyDetailAdminPage = () => {
  const { keyId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [servers, setServers] = useState<ServerType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectRow, setSelectRow] = useState<string | undefined>();
  const [selectServer, setSelectServer] = useState<string | undefined>(
    undefined
  );
  const [key, setKey] = useState<KeyDetailType>();
  console.log("key - ", key);
  useEffect(() => {
    if (keyId) {
      fetchData(keyId);
      handleFetchDataServer();
    }
  }, [keyId]);
  const handleFetchDataServer = async () => {
    try {
      const resultServer = await api.get("/servers?status=1");
      setServers(resultServer.data);
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

  const fetchData = async (keyId: string) => {
    try {
      const result = await api.get<KeyDetailType>(`/keys/${keyId}`);
      setKey(result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const handleAddLimitData = async (keyId: string, data: number) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn sửa data limit key này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.patch(`/keys/add-data-limit/${keyId}`, { data });
        fetchData(keyId);
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
  const handleDisableKey = async (keyId: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn disable key này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.get(`/keys/disable/${keyId}`);
        fetchData(keyId);
        toast.success("Disable thành công");
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
  const handleEnableKey = async (keyId: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn enable key này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.get(`/keys/enable/${keyId}`);
        fetchData(keyId);
        toast.success("Enable thành công");
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
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    if (selectRow) {
      setSelectRow(undefined);
      setSelectServer(undefined);
    }
    setIsModalOpen(false);
  };
  const handleMigratekey = async (keyId: string, serverId: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn migate key này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        setLoading(true);
        await api.post(`/keys/migrate`, {
          keyId,
          serverId,
        });
        fetchData(keyId);
        handleCancel();
        toast.success("Migrate key thành công");
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
  console.log("key id - ", keyId);
  if (key) {
    const {
      gist,
      awsId,
      dataLimit,
      dataUsage,
      dataExpand,
      status,
      enable,
      startDate,
      endDate,
      serverId,
    } = key;
    return (
      <RequireAuthPage rolePage={1}>
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <Heading>Chi tiết key</Heading>
            {status === 1 ? (
              <div className="flex items-center gap-5">
                <button
                  className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-secondary40 font-primary"
                  onClick={() => {
                    setSelectRow(key._id);
                    showModal();
                  }}
                >
                  Migrate key
                </button>
                <button
                  className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-primary20 font-primary"
                  onClick={async () => {
                    if (keyId) {
                      try {
                        const { isConfirmed } = await Swal.fire({
                          title: `<p class="leading-tight">Bạn có gia hạn key này</p>`,
                          icon: "success",
                          showCancelButton: true,
                          confirmButtonColor: "#1DC071",
                          cancelButtonColor: "#d33",
                          cancelButtonText: "Thoát",
                          confirmButtonText: "Có, nâng cấp ngay",
                        });
                        if (isConfirmed) {
                          await api.patch(`/keys/upgrade/${key._id}`);
                          fetchData(keyId);
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
                    }
                  }}
                >
                  Gia hạn gói
                </button>
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-10">
            <div className="flex flex-col xl:flex-row xl:items-center col-span-1 md:col-span-2 xl:col-span-3 gap-1">
              <div className="">Link key: </div>
              <div className="flex items-baseline gap-2">
                <p className="font-primary line-clamp-1 font-medium">
                  {awsId?.fileName.replace(/https/g, "ssconf")}#
                  {gist?.extension}
                </p>
                <Tooltip title="copy">
                  <button
                    className="text-secondary20"
                    onClick={() =>
                      copyToClipboard(
                        `${awsId?.fileName.replace(/https/g, "ssconf")}#${
                          gist?.extension
                        }`
                      )
                    }
                  >
                    <AndroidXML />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className="self-center">
              Mã giao dịch: <span className="font-medium">{gist.code}</span>
            </div>
            <div className="">
              Người dùng:{" "}
              <Link
                to={`/admin/account/${gist.userId._id}`}
                className="font-medium text-primary hover:underline hover:decoration-primary"
              >
                {gist.userId.username}
              </Link>
            </div>
            <div className="self-center">
              Email: <span className="font-medium">{gist.userId.email}</span>
            </div>
            <div className="self-center">
              Số điện thoại:{" "}
              <span className="font-medium">{gist.userId.phone}</span>
            </div>
            <div className="self-center">
              Tên gói: <span className="font-medium">{gist.planId.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <p>Trạng thái gói:</p>{" "}
              <div className="flex items-center gap-4">
                <Radio checked={status === 1}>Active</Radio>
                <Radio checked={status === 0}>Inactive</Radio>
                <Radio checked={status === 2}>Migrate</Radio>
              </div>
            </div>
            <div className="self-center">
              Thời gian:{" "}
              <span className="font-medium">
                {DAY_FORMAT(startDate)} - {DAY_FORMAT(endDate)}
              </span>
            </div>
            <div className="self-center">
              Tên key: <span className="font-medium">{gist.extension}</span>
            </div>
            <div className="flex items-center gap-3">
              <p>Trạng thái key:</p>{" "}
              <EditStatusForm
                enableSubmit={status === 1}
                initialValue={enable ? "enable" : "disable"}
                onSubmit={(value) => {
                  console.log("value - ", value);
                  if (value === "disable") {
                    handleDisableKey(key._id);
                  } else if (value === "enable") {
                    handleEnableKey(key._id);
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <p>Data Limit: </p>
              <EditKeyLimitForm
                type="number"
                placeholder={`${dataLimit / 1000 / 1000 / 1000} GB`}
                handleAddLimitData={(bytes: number) =>
                  handleAddLimitData(key._id, bytes)
                }
              />
            </div>
            <div className="self-center">
              Data useage:{" "}
              <span className="font-medium">
                {dataUsage
                  ? `${(dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB`
                  : "00.00GB"}
              </span>
            </div>
            <div className="self-center">
              Data expand:{" "}
              <span className="font-medium">
                {dataExpand / 1000 / 1000 / 1000}GB
              </span>
            </div>
          </div>
        </div>
        {loading && <Loading />}
        <Modal
          title="Chọn máy chủ"
          open={isModalOpen}
          onCancel={() => {
            handleCancel();
          }}
          footer={[]}
        >
          <div className="mb-5">
            <p className="font-primary">Chọn máy chủ để migrate key</p>
            {selectRow &&
              servers.filter((item) => item._id !== serverId._id).length ===
                0 && (
                <p className="text-error font-primary">
                  Bạn cần thêm server mới để migrate key sang
                </p>
              )}
          </div>
          <div>
            {selectRow &&
              servers.map((item) =>
                item._id !== serverId._id ? (
                  <Radio
                    checked={item._id === selectServer}
                    onClick={() => setSelectServer(item._id)}
                  >
                    <span className="block font-primary">{item.name}</span>
                  </Radio>
                ) : null
              )}
          </div>
          <div className="flex items-center justify-end gap-5">
            <button
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-error font-primary"
              onClick={() => handleCancel()}
            >
              Thoát
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-secondary40 font-primary"
              onClick={() => {
                if (selectRow && selectServer) {
                  handleMigratekey(selectRow, selectServer);
                } else {
                  toast.warn("bạn chưa chọn server để migrate key sang");
                }
              }}
            >
              Migrate key
            </button>
          </div>
        </Modal>
      </RequireAuthPage>
    );
  }
  return;
};

export default KeyDetailAdminPage;
