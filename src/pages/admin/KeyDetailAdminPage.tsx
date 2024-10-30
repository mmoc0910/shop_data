import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { KeyDetailType, ServerType } from "../../type";
import { api } from "../../api";
import Heading from "../../components/common/Heading";
import { DAY_FORMAT } from "../../constants";
import { Modal, Tag, Tooltip } from "antd";
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
import EditKeyNameForm from "../../components/server/EditKeyNameForm";
import { v4 as uuidv4 } from "uuid";
import { UpdateEndDateKey } from "../../components/key/UpdateEndDateKey";
import { KeyDataUseage } from "../../components/key/KeyDataUseage";
import { DropdownWithComponents } from "../../components/dropdown";
import classNames from "../../utils/classNames";
import { HistoryExpandKey } from "../../components/key/HistoryExpandKey";
import { HistoryUpgradeKey } from "../../components/key/HistoryUpgradeKey";
import _ from "lodash";

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
  useEffect(() => {
    if (keyId) {
      fetchData(keyId);
      handleFetchDataServer();
    }
  }, [keyId]);
  const handleFetchDataServer = async () => {
    try {
      const result = await api.get<ServerType[]>("/servers/server-to-migrate");
      setServers(result.data);
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
  const handleRenameKey = async (_id: string, name: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn sửa tên key này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        // await api.patch(`/keys/rename/${_id}`, { name });
        await api.patch(`/gists/extension/${_id}`, { extension: name });
        fetchData(_id);
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
      historyKey,
      accessUrl,
      arrayDataUsage,
      endExpandDate,
    } = key;
    return (
      <RequireAuthPage rolePage={[1, 3]}>
        <div className="space-y-10">
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              <div className="col-span-1 md:col-span-2 lg:col-span-3 p-3 space-y-1 border border-gray-200 rounded-lg gap-1">
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
                <p>Static key:</p>
                <div className="flex items-baseline gap-2">
                  <p className="line-clamp-1">
                    {accessUrl}#{serverId.name}-k{key.keyId}
                  </p>
                  <Tooltip title="copy">
                    <button
                      className="text-secondary20"
                      onClick={() =>
                        copyToClipboard(
                          `${accessUrl}#${serverId.name}-k${key.keyId}`
                        )
                      }
                    >
                      <AndroidXML />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Mã giao dịch: <span className="font-medium">{gist.code}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Người dùng:{" "}
                <Link
                  to={`/admin/account/${gist.userId._id}`}
                  className="font-medium text-primary hover:underline hover:decoration-primary"
                >
                  {gist.userId.username}
                </Link>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Email: <span className="font-medium">{gist.userId.email}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Số điện thoại:{" "}
                <span className="font-medium">{gist.userId.phone}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Tên gói: <span className="font-medium">{gist.planId.name}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                <p>Trạng thái gói:</p>{" "}
                <div className="flex items-center gap-4">
                  <Radio checked={status === 1}>Active</Radio>
                  <Radio checked={status === 0}>Inactive</Radio>
                  <Radio checked={status === 2}>Migrate</Radio>
                </div>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Thời gian bắt đầu:{" "}
                <span className="font-medium">{DAY_FORMAT(startDate)}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Thời gian kết thúc:{" "}
                <UpdateEndDateKey defaultValue={endDate} key_id={keyId || ""} />
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Key Id: <span className="font-medium">{key.keyId}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Tên key:{" "}
                {status === 1 ? (
                  <EditKeyNameForm
                    placeholder={gist.extension}
                    handleRenameKey={(name) => handleRenameKey(gist._id, name)}
                    className="w-full flex-1"
                  />
                ) : (
                  <p>{key.name}</p>
                )}
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Extension: <span className="font-medium">{gist.extension}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
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
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                <p>Data Limit: </p>
                {status === 1 ? (
                  <EditKeyLimitForm
                    type="number"
                    placeholder={`${dataLimit / 1000 / 1000 / 1000} GB`}
                    handleAddLimitData={(bytes: number) =>
                      handleAddLimitData(key._id, bytes)
                    }
                  />
                ) : (
                  <span className="font-medium">
                    {dataUsage
                      ? `${(dataLimit / 1000 / 1000 / 1000).toFixed(2)}GB`
                      : "00.00GB"}
                  </span>
                )}
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Data useage:{" "}
                <span className="font-medium">
                  {dataUsage
                    ? `${(dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB`
                    : "00.00GB"}
                </span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Data expand:{" "}
                <span className="font-medium">
                  {dataExpand / 1000 / 1000 / 1000}GB
                </span>
              </div>
              {endExpandDate && (
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                  End Date expand:{" "}
                  <span className="font-medium">
                    {DAY_FORMAT(endExpandDate)}
                  </span>
                </div>
              )}

              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Server Name:{" "}
                <span className="font-medium">{serverId.name}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Server Location:{" "}
                <span className="font-medium">{serverId.location}</span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Server IP:{" "}
                <span className="font-medium">
                  {serverId.hostnameForAccessKeys}
                </span>
              </div>
              <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1">
                Server status:{" "}
                <span className="font-medium">
                  {serverId.status === 1 ? (
                    <Tag color="green">
                      <span className="font-primary">Đang hoạt động</span>
                    </Tag>
                  ) : (
                    <Tag color="red">
                      <span className="font-primary">Ngừng hoạt động</span>
                    </Tag>
                  )}
                </span>
              </div>
            </div>
          </div>
          <KeyDataUseage
            arrayDataUsage={arrayDataUsage}
            dataUsage={dataUsage}
          />
          <HistoryExpandKey keyId={keyId} />
          <HistoryUpgradeKey keyId={keyId} />
          {historyKey.length > 0 && (
            <div className="space-y-7">
              <Heading>History key</Heading>
              <div className="w-full space-y-5 overflow-x-scroll">
                {/* <CreateNewKeyForm
                handleAddNewKey={() =>
                  handleAddNewKey(serverDetail.apiUrl, serverDetail.fingerPrint)
                }
              /> */}
                <div className="grid grid-cols-5 w-[1180px] lg:w-full">
                  <div className="flex col-span-2 pb-3">
                    <div className="px-4 font-semibold">#</div>
                    <div className="flex-1 px-4 font-semibold">Server name</div>
                    <div className="flex-1 px-4 font-semibold">IP</div>
                    <div className="flex-1 px-4 font-semibold">KeyId</div>
                  </div>
                  <div className="flex col-span-3 pb-3">
                    <div className="flex-1 px-4 font-semibold">Status</div>
                    <div className="flex-1 px-4 font-semibold">Data useage</div>
                    <div className="flex-1 px-4 font-semibold">Date start</div>
                    <div className="flex-1 px-4 font-semibold">Date end</div>
                  </div>
                  {historyKey.length > 0 &&
                    _.orderBy(historyKey, ["updatedAt"], ["desc"]).map(
                      (item, index) => {
                        const server = item.serverId as ServerType;
                        return (
                          <div
                            className="grid grid-cols-5 col-span-5 py-5 border border-gray-200 rounded-xl"
                            key={uuidv4()}
                          >
                            <div className="flex items-center col-span-2">
                              <div className="px-4">{index + 1}</div>
                              <div className="flex-1 px-4 text-primary font-medium hover:underlineff hover:decoration-primary">
                                {server.name}
                              </div>
                              <div className="flex-1 px-4">
                                {server.hostnameForAccessKeys}
                              </div>
                              <div className="px-4 flex-1">{item.keyId}</div>
                            </div>
                            <div className="flex items-center col-span-3">
                              <div className="flex-1 px-4">
                                {item.status === 1 ? (
                                  <Tag color="green">Active</Tag>
                                ) : null}
                                {item.status === 0 ? (
                                  <Tag color="red">Inactive</Tag>
                                ) : null}
                                {item.status === 2 ? (
                                  <Tag color="blue">Migrate</Tag>
                                ) : null}
                              </div>
                              <div className="flex-1 px-4">
                                {item.dataUsage
                                  ? `${(
                                      item.dataUsage /
                                      1000 /
                                      1000 /
                                      1000
                                    ).toFixed(2)} GB`
                                  : "00.00 GB"}
                              </div>
                              <div className="flex-1 px-4">
                                {DAY_FORMAT(item.createdAt)}
                              </div>
                              <div className="flex-1 px-4">
                                {DAY_FORMAT(item.updatedAt)}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              </div>
            </div>
          )}
        </div>
        {loading && <Loading />}
        <Modal
          title={`Máy chủ hiện tại (${
            servers.find((i) => i._id === serverId._id)?.name
          })`}
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
          {/* <div>
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
          </div> */}
          <div className="mb-5">
            <DropdownWithComponents>
              <DropdownWithComponents.Select
                placeholder={
                  selectServer ? (
                    <span className="text-black">
                      {servers.find((i) => i._id === selectServer)?.name}
                    </span>
                  ) : (
                    <span className="text-text4">Chọn server</span>
                  )
                }
              ></DropdownWithComponents.Select>
              <DropdownWithComponents.List>
                {[
                  ...servers.filter((item) => item.status === 1),
                  ...servers.filter((item) => item.status === 3),
                ].map((item) => (
                  <DropdownWithComponents.Option
                    key={uuidv4()}
                    onClick={() => setSelectServer(item._id)}
                  >
                    <span
                      className={classNames(
                        "capitalize",
                        selectServer === item._id
                          ? "font-semibold text-primary"
                          : ""
                      )}
                    >
                      {item.name} ({item.numberKey} keys){" "}
                      {item.status === 3 && (
                        <span className="text-error">*</span>
                      )}
                    </span>
                  </DropdownWithComponents.Option>
                ))}
              </DropdownWithComponents.List>
            </DropdownWithComponents>
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
