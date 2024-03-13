import { Link, useParams } from "react-router-dom";
import Heading from "../../components/common/Heading";
import { useEffect, useState } from "react";
import { KeySeverType, ServerType } from "../../type";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { api } from "../../api";
import dayjs from "dayjs";
import Radio from "../../components/radio/Radio";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";
import { Input } from "../../components/input";
import Button from "../../components/button/Button";
import IconEdit from "../../icons/IconEdit";
import Swal from "sweetalert2";
import axios from "axios";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Modal, Tag } from "antd";
import Loading from "../../components/common/Loading";
import EditKeyLimitForm from "../../components/server/EditKeyLimitForm";
import EditRemarkServer from "../../components/server/EditRemarkServer";

const ServerDetailAdminPage = () => {
  const { serverId } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [servers, setServers] = useState<ServerType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [serverDetail, setServerDetail] = useState<ServerType>();
  const [listKey, setListKey] = useState<KeySeverType[]>([]);
  const [selectRow, setSelectRow] = useState<string | undefined>();
  const [selectServer, setSelectServer] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
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
  useEffect(() => {
    handleFetchServerDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);
  const handleFetchServerDetail = async () => {
    try {
      const [resultServer, resultKey] = await Promise.all([
        api.get<ServerType>(`/servers/${serverId}`),
        api.get<KeySeverType[]>(`/keys?serverId=${serverId}`),
      ]);
      setServerDetail(resultServer.data);
      setListKey(resultKey.data.filter((item) => item.status !== 0));
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  // const handleSync = async (apiUrl: string, fingerPrint: string) => {
  //   try {
  //     await api.post("/servers", {
  //       apiUrl,
  //       fingerPrint,
  //     });
  //     handleFetchServerDetail();
  //   } catch (error) {
  //     console.log("error - ", error);
  //   }
  // };

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
        handleFetchServerDetail();
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
        handleFetchServerDetail();
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
        handleFetchServerDetail();
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
        handleFetchServerDetail();
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
  return (
    <RequireAuthPage rolePage={1}>
      <div className="space-y-10">
        {serverDetail && (
          <>
            <div className="space-y-7">
              <Heading>Server</Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Remark</div>
                  <div>
                    <EditRemarkServer
                      placeholder="Remark"
                      initialValue={serverDetail.remark}
                      handleSubmitRemark={async (value: string) => {
                        try {
                          await api.patch(
                            `/servers/remark/${serverDetail._id}`,
                            { remark: value }
                          );
                          handleFetchServerDetail();
                          toast.success("Thành công");
                        } catch (error) {
                          console.log("error - ", error);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Server name</div>
                  <div>
                    <EditServerForm
                      placeholder={serverDetail.name}
                      handleEdit={async (value: string) => {
                        try {
                          await api.patch(
                            `/servers/name-server/${serverDetail._id}`,
                            { name: value }
                          );
                          handleFetchServerDetail();
                          toast.success("Thành công");
                        } catch (error) {
                          console.log("error - ", error);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Location</div>
                  <div>
                    <EditServerForm
                      placeholder={serverDetail.location}
                      handleEdit={async (value: string) => {
                        try {
                          await api.patch(
                            `/servers/location/${serverDetail._id}`,
                            { location: value }
                          );
                          handleFetchServerDetail();
                          toast.success("Thành công");
                        } catch (error) {
                          console.log("error - ", error);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Hostname</div>
                  <div>{serverDetail.hostnameForAccessKeys}</div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">
                    Port for new access key
                  </div>
                  <div>{serverDetail.portForNewAccessKeys}</div>
                </div>
                {/* <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-500">
                  Data transferred / last 30 days
                </div>
                <div>{serverDetail.name}</div>
              </div> */}
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Created</div>
                  <div>
                    {dayjs(serverDetail.createdAt).format("YYYY-MM-DD HH:MM")}
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Server ID</div>
                  <div>{serverDetail.serverId}</div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">
                    Share anonymous metrics
                  </div>
                  <div className="flex items-center gap-4">
                    <Radio checked={serverDetail.metricsEnabled ? true : false}>
                      Enable
                    </Radio>
                    <Radio checked={serverDetail.metricsEnabled ? false : true}>
                      Disabled
                    </Radio>
                    {/* <button className="px-4 py-2 text-white rounded-md bg-primary">
                    Apply
                  </button> */}
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">
                    Server version
                  </div>
                  <div>{serverDetail.version}</div>
                </div>
              </div>
            </div>
            {listKey.filter((item) => item.status === 1).length > 0 ? (
              <div className="space-y-7">
                <Heading>Keys Active</Heading>
                <div className="w-full space-y-5 overflow-x-scroll">
                  {/* <CreateNewKeyForm
                handleAddNewKey={() =>
                  handleAddNewKey(serverDetail.apiUrl, serverDetail.fingerPrint)
                }
              /> */}
                  <div className="grid grid-cols-5 w-[1180px] lg:w-full">
                    <div className="flex col-span-2 pb-3">
                      <div className="px-4 font-semibold">#</div>
                      <div className="flex-1 px-4 font-semibold">OrderID</div>
                      <div className="flex-1 px-4 font-semibold">Email</div>
                      <div className="px-4 font-semibold">Usage</div>
                    </div>
                    <div className="flex col-span-3 pb-3">
                      <div className="px-4 font-semibold">Limit</div>
                      <div className="px-4 font-semibold">Status</div>
                      <div className="text-end flex-1 px-4 font-semibold">
                        Actions
                      </div>
                    </div>
                    {listKey.length > 0 &&
                      listKey.map((item) =>
                        item.status === 1 ? (
                          <div
                            className="grid grid-cols-5 col-span-5 py-5 border border-gray-200 rounded-xl"
                            key={uuidv4()}
                          >
                            <div className="flex items-center col-span-2">
                              <div className="px-4">{item.keyId}</div>
                              <Link
                                to={`/admin/key/${item._id}`}
                                className="flex-1 px-4 text-primary font-medium hover:underline hover:decoration-primary"
                              >
                                {item.name || "no name"}
                              </Link>
                              <div className="flex-1 px-4">{item.account}</div>
                              <div className="px-4 flex-1">
                                {item.dataUsage
                                  ? `${(
                                      item.dataUsage /
                                      1000 /
                                      1000 /
                                      1000
                                    ).toFixed(2)} GB`
                                  : "00.00 GB"}
                              </div>
                            </div>
                            <div className="flex items-center col-span-3">
                              <div className="px-4">
                                {item.dataLimit / 1000 / 1000 / 1000}GB
                              </div>
                              <div className="px-4">
                                {item?.enable && (
                                  <Tag color="green">Hoạt động</Tag>
                                )}
                                {!item?.enable && (
                                  <Tag color="red">Ngưng hoạt động</Tag>
                                )}
                              </div>
                              <div className="flex items-center justify-end flex-1 gap-2 px-4">
                                {item.status === 1 && item.enable ? (
                                  <>
                                    <EditKeyLimitForm
                                      placeholder={`${
                                        item.dataLimit / 1000 / 1000 / 1000
                                      } GB`}
                                      handleAddLimitData={(bytes: number) =>
                                        handleAddLimitData(item.keyId, bytes)
                                      }
                                    />
                                    <button
                                      className="p-2 text-xs font-medium text-white rounded-lg bg-secondary20"
                                      onClick={() => {
                                        setSelectRow(item._id);
                                        showModal();
                                      }}
                                    >
                                      Migrate
                                    </button>
                                    <button
                                      className="p-2 text-xs font-medium text-white rounded-lg bg-secondary20"
                                      onClick={() => handleDisableKey(item._id)}
                                    >
                                      Disable
                                    </button>
                                    <button
                                      className="p-2 text-xs font-medium text-white rounded-lg bg-secondary20"
                                      onClick={async () => {
                                        try {
                                          const { isConfirmed } =
                                            await Swal.fire({
                                              title: `<p class="leading-tight">Bạn có nâng cấp key này</p>`,
                                              icon: "success",
                                              showCancelButton: true,
                                              confirmButtonColor: "#1DC071",
                                              cancelButtonColor: "#d33",
                                              cancelButtonText: "Thoát",
                                              confirmButtonText:
                                                "Có, nâng cấp ngay",
                                            });
                                          if (isConfirmed) {
                                            await api.patch(
                                              `/keys/upgrade/${item._id}`
                                            );
                                            handleFetchServerDetail();
                                            toast.success("Thành công");
                                          }
                                        } catch (error) {
                                          if (axios.isAxiosError(error)) {
                                            console.log(
                                              "error message: ",
                                              error
                                            );
                                            toast.error(
                                              error.response?.data.message
                                            );
                                          } else {
                                            console.log(
                                              "unexpected error: ",
                                              error
                                            );
                                            return "An unexpected error occurred";
                                          }
                                        }
                                      }}
                                    >
                                      Gia hạn
                                    </button>
                                  </>
                                ) : null}
                                {item.status === 1 && !item.enable && (
                                  <button
                                    className="p-2 text-xs font-medium text-white rounded-lg bg-secondary20"
                                    onClick={() => handleEnableKey(item._id)}
                                  >
                                    Enable
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : null
                      )}
                    {listKey.length > 0 &&
                      listKey.map((item) =>
                        item.status === 0 ? (
                          <div
                            className="grid grid-cols-5 col-span-5 py-5 border border-gray-200 rounded-xl"
                            key={uuidv4()}
                          >
                            <div className="flex items-center col-span-2">
                              <div className="px-4">{item.keyId}</div>
                              <div className="flex-1 px-4">
                                {item.name || "no name"}
                              </div>
                              <div className="flex-1 px-4">{item.account}</div>
                              <div className="px-4">
                                {item.dataUsage
                                  ? `${(
                                      item.dataUsage /
                                      1000 /
                                      1000 /
                                      1000
                                    ).toFixed(2)} GB`
                                  : "00.00 GB"}
                              </div>
                            </div>
                            <div className="flex items-center col-span-3">
                              <div className="px-4">
                                {item.dataLimit / 1000 / 1000 / 1000}GB
                              </div>
                              <div className="px-4">
                                <Tag color="red">Hết hạn</Tag>
                              </div>
                            </div>
                          </div>
                        ) : null
                      )}
                  </div>
                </div>
              </div>
            ) : null}

            {listKey.filter((item) => item.status === 0).length > 0 ? (
              <div className="space-y-7">
                <Heading>Keys Inactive</Heading>
                <div className="w-full space-y-5 overflow-x-scroll">
                  {/* <CreateNewKeyForm
                handleAddNewKey={() =>
                  handleAddNewKey(serverDetail.apiUrl, serverDetail.fingerPrint)
                }
              /> */}
                  <div className="grid grid-cols-5 w-[1180px] lg:w-full">
                    <div className="flex col-span-2 pb-3">
                      <div className="px-4 font-semibold">#</div>
                      <div className="flex-1 px-4 font-semibold">OrderID</div>
                      <div className="flex-1 px-4 font-semibold">Email</div>
                    </div>
                    <div className="flex col-span-3 pb-3">
                      <div className="px-4 font-semibold flex-1">Usage</div>
                      <div className="px-4 font-semibold flex-1">Limit</div>
                      <div className="px-4 font-semibold flex-1">Status</div>
                    </div>
                    {listKey.length > 0 &&
                      listKey.map((item) =>
                        item.status === 0 ? (
                          <div
                            className="grid grid-cols-5 col-span-5 py-5 border border-gray-200 rounded-xl"
                            key={uuidv4()}
                          >
                            <div className="flex items-center col-span-2">
                              <div className="px-4">{item.keyId}</div>
                              <div className="flex-1 px-4">
                                {item.name || "no name"}
                              </div>
                              <div className="flex-1 px-4">{item.account}</div>
                            </div>
                            <div className="flex items-center col-span-3 flex-1">
                              <div className="px-4">
                                {item.dataUsage
                                  ? `${(
                                      item.dataUsage /
                                      1000 /
                                      1000 /
                                      1000
                                    ).toFixed(2)} GB`
                                  : "00.00 GB"}
                              </div>
                              <div className="px-4 flex-1">
                                {item.dataLimit / 1000 / 1000 / 1000}GB
                              </div>
                              <div className="px-4 flex-1">
                                <Tag color="red">Hết hạn</Tag>
                              </div>
                            </div>
                          </div>
                        ) : null
                      )}
                  </div>
                </div>
              </div>
            ) : null}
            {listKey.filter((item) => item.status === 2).length > 0 ? (
              <div className="space-y-7">
                <Heading>Keys Migrate</Heading>
                <div className="w-full space-y-5 overflow-x-scroll">
                  {/* <CreateNewKeyForm
                handleAddNewKey={() =>
                  handleAddNewKey(serverDetail.apiUrl, serverDetail.fingerPrint)
                }
              /> */}
                  <div className="grid grid-cols-5 w-[1180px] lg:w-full">
                    <div className="flex col-span-2 pb-3">
                      <div className="px-4 font-semibold">#</div>
                      <div className="flex-1 px-4 font-semibold">OrderID</div>
                      <div className="flex-1 px-4 font-semibold">Email</div>
                    </div>
                    <div className="flex col-span-3 pb-3">
                      <div className="px-4 font-semibold flex-1">Usage</div>
                      <div className="px-4 font-semibold flex-1">Limit</div>
                      <div className="px-4 font-semibold flex-1">Status</div>
                    </div>
                    {listKey.length > 0 &&
                      listKey.map((item) =>
                        item.status === 2 ? (
                          <div
                            className="grid grid-cols-5 col-span-5 py-5 border border-gray-200 rounded-xl"
                            key={uuidv4()}
                          >
                            <div className="flex items-center col-span-2">
                              <div className="px-4">{item.keyId}</div>
                              <div className="flex-1 px-4">
                                {item.name || "no name"}
                              </div>
                              <div className="flex-1 px-4">{item.account}</div>
                            </div>
                            <div className="flex items-center col-span-3">
                              <div className="px-4 flex-1">
                                {item.dataUsage
                                  ? `${(
                                      item.dataUsage /
                                      1000 /
                                      1000 /
                                      1000
                                    ).toFixed(2)} GB`
                                  : "00.00 GB"}
                              </div>
                              <div className="px-4 flex-1">
                                {item.dataLimit / 1000 / 1000 / 1000}GB
                              </div>
                              <div className="px-4 flex-1">
                                <Tag color="blue">Migrate</Tag>
                              </div>
                            </div>
                          </div>
                        ) : null
                      )}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
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
            servers.filter((item) => item._id !== serverId).length === 0 && (
              <p className="text-error font-primary">
                Bạn cần thêm server mới để migrate key sang
              </p>
            )}
        </div>
        <div>
          {selectRow &&
            servers.map((item) =>
              item._id !== serverId ? (
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
};

const schema = yup
  .object({
    value: yup.string(),
  })
  .required();
const EditServerForm = ({
  placeholder = "",
  handleEdit,
}: {
  placeholder?: string;
  handleEdit: (value: string) => void;
}) => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = (data: { value?: string }) => {
    try {
      data.value && handleEdit(data.value);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="flex items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full">
        <Input
          name="value"
          placeholder={placeholder}
          control={control}
          className="placeholder:text-gray-500"
        />
      </div>
      <Button type="submit" className="px-4 text-gray-500">
        <IconEdit />
      </Button>
    </form>
  );
};

export default ServerDetailAdminPage;
