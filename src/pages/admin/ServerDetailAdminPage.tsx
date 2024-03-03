import { useParams } from "react-router-dom";
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
      console.log(resultServer.data);
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
      console.log("result - ", resultServer.data);
      setServerDetail(resultServer.data);
      setListKey(resultKey.data);
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
        await api.post(`/keys`, {
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
  // const handleRemoveKey = async (
  //   keyId: number,
  //   apiUrl: string,
  //   fingerPrint: string
  // ) => {
  //   try {
  //     const { isConfirmed } = await Swal.fire({
  //       title: `<p class="leading-tight">Bạn có muốn xóa key này</p>`,
  //       icon: "success",
  //       showCancelButton: true,
  //       confirmButtonColor: "#1DC071",
  //       cancelButtonColor: "#d33",
  //       cancelButtonText: "Thoát",
  //       confirmButtonText: "Xóa",
  //     });
  //     if (isConfirmed) {
  //       await api.delete(`/servers/remove-key/${keyId}`, {
  //         data: { apiUrl, fingerPrint },
  //       });
  //       // handleSync(apiUrl, fingerPrint);
  //       toast.success("Xóa thành công");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(messages.error);
  //   }
  // };
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
              <div className="grid grid-cols-3">
                <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
                  <div className="font-medium text-gray-500">Server name</div>
                  <div>
                    <EditServerForm
                      placeholder={serverDetail.name}
                      handleEdit={async (value: string) => {
                        try {
                          console.log("abc - ");
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
                <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
                  <div className="font-medium text-gray-500">Location</div>
                  <div>
                    <EditServerForm
                      placeholder={serverDetail.location}
                      handleEdit={async (value: string) => {
                        try {
                          console.log("abc - ");
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
                <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
                  <div className="font-medium text-gray-500">Hostname</div>
                  <div>{serverDetail.hostnameForAccessKeys}</div>
                </div>
                <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
                  <div className="font-medium text-gray-500">
                    Port for new access key
                  </div>
                  <div>{serverDetail.portForNewAccessKeys}</div>
                </div>
                {/* <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
                <div className="font-medium text-gray-500">
                  Data transferred / last 30 days
                </div>
                <div>{serverDetail.name}</div>
              </div> */}
                <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
                  <div className="font-medium text-gray-500">Created</div>
                  <div>
                    {dayjs(serverDetail.createdAt).format("YYYY-MM-DD HH:MM")}
                  </div>
                </div>
                <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
                  <div className="font-medium text-gray-500">Server ID</div>
                  <div>{serverDetail.serverId}</div>
                </div>
                <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
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
                    {/* <button className="bg-primary text-white px-4 rounded-md py-2">
                    Apply
                  </button> */}
                  </div>
                </div>
                <div className="col-span-1 border border-gray-200 rounded-lg p-3 space-y-1">
                  <div className="font-medium text-gray-500">
                    Server version
                  </div>
                  <div>{serverDetail.version}</div>
                </div>
              </div>
            </div>
            <div className="space-y-7">
              <Heading>Keys</Heading>
              <div className="space-y-5">
                {/* <CreateNewKeyForm
                handleAddNewKey={() =>
                  handleAddNewKey(serverDetail.apiUrl, serverDetail.fingerPrint)
                }
              /> */}
                <div className="grid grid-cols-2">
                  <div className="col-span-1 pb-3 flex">
                    <div className="px-4 font-semibold">#</div>
                    <div className="flex-1 px-4 font-semibold">Name</div>
                    <div className="flex-1 px-4 font-semibold">Email</div>
                    <div className="px-4 font-semibold">Usage</div>
                  </div>
                  <div className="col-span-1 pb-3 flex">
                    <div className="flex-1 px-4 font-semibold">Limit</div>
                    <div className="flex-1 px-4 font-semibold">Status</div>
                    <div className="px-4 font-semibold flex-1 justify-end">
                      Actions
                    </div>
                  </div>
                  {listKey.length > 0 &&
                    listKey.map((item) => (
                      <div
                        className="col-span-2 border border-gray-200 rounded-xl grid grid-cols-2 py-5"
                        key={uuidv4()}
                      >
                        <div className="flex items-center">
                          <div className="px-4">{item.keyId}</div>
                          <div className="flex-1 px-4">
                            no name
                            {/* {item.name} */}
                            {/* <EditKeyNameForm
                            placeholder={item.name}
                            handleRenameKey={(name: string) =>
                              handleRenameKey(
                                Number(item.keyId),
                                name,
                                serverDetail.apiUrl,
                                serverDetail.fingerPrint
                              )
                            }
                          /> */}
                          </div>
                          <div className="flex-1 px-4">{item.account}</div>
                          <div className="px-4">
                            {(item.dataUsage / 1000 / 1000 / 1000).toFixed(2)}{" "}
                            GB
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="flex-1 px-4">
                            {item.dataLimit / 1000 / 1000 / 1000}GB
                            {/* <EditKeyLimitForm
                            placeholder={`${
                              item.dataLimit / 1000 / 1000 / 1000
                            } GB`}
                            handleAddLimitData={(bytes: number) =>
                              handleAddLimitData(
                                Number(item.keyId),
                                bytes,
                                serverDetail.apiUrl,
                                serverDetail.fingerPrint
                              )
                            }
                          /> */}
                          </div>
                          <div className="flex-1 px-4">
                            {item.status ? (
                              <Tag color="green">Active</Tag>
                            ) : (
                              <Tag color="red">Inactive</Tag>
                            )}
                          </div>
                          <div className="px-4 flex items-center gap-4 flex-1">
                            {item.status ? (
                              <>
                                {" "}
                                <button
                                  className="bg-secondary20 text-white rounded-lg p-3 font-semibold"
                                  onClick={() => {
                                    setSelectRow(item._id);
                                    showModal();
                                  }}
                                >
                                  Migrate key
                                </button>
                                <button
                                  className="bg-secondary20 text-white rounded-lg p-3 font-semibold"
                                  onClick={async () => {
                                    try {
                                      const { isConfirmed } = await Swal.fire({
                                        title: `<p class="leading-tight">Bạn có nâng cấp key này</p>`,
                                        icon: "success",
                                        showCancelButton: true,
                                        confirmButtonColor: "#1DC071",
                                        cancelButtonColor: "#d33",
                                        cancelButtonText: "Thoát",
                                        confirmButtonText: "Có, nâng cấp ngay",
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
                                        console.log("error message: ", error);
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

                            {/* <button
                              className="bg-error text-white rounded-lg p-3"
                              onClick={() =>
                                handleRemoveKey(
                                  Number(item.keyId),
                                  serverDetail.apiUrl,
                                  serverDetail.fingerPrint
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                              </svg>
                            </button> */}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
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
                  <span className="font-primary block">{item.name}</span>
                </Radio>
              ) : null
            )}
        </div>
        <div className="flex items-center justify-end gap-5">
          <button
            className="px-4 py-2 rounded-lg bg-error font-medium text-white font-primary text-sm"
            onClick={() => handleCancel()}
          >
            Thoát
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-secondary40 font-medium text-white font-primary text-sm"
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
      console.log("data sign in - ", data);
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
      <Button type="submit" className="text-gray-500 px-4">
        <IconEdit />
      </Button>
    </form>
  );
};

export default ServerDetailAdminPage;
