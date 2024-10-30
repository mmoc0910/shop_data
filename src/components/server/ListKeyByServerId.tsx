import { useEffect, useState } from "react";
import EditKeyLimitForm from "./EditKeyLimitForm";
import Swal from "sweetalert2";
import { api } from "../../api";
import { toast } from "react-toastify";
import Heading from "../common/Heading";
import { KeySeverType, ServerType } from "../../type";
import axios from "axios";
import { FC } from "react";
import { Checkbox } from "../checkbox";
import { v4 as uuidv4 } from "uuid";
import { Modal, Pagination, PaginationProps, Tag } from "antd";
import { DropdownWithComponents } from "../dropdown";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import Loading from "../common/Loading";

type Props = {
  handleFetchServerDetail: () => void;
  serverId: string;
  status: number;
  heading: string;
};
export const ListKeyByServerId: FC<Props> = ({
  handleFetchServerDetail,
  serverId,
  status,
  heading,
}) => {
  const [loadingTable, setLoadingTable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servers, setServer] = useState<ServerType[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [listKey, setListKey] = useState<{
    data: KeySeverType[];
    totalItems: number;
  }>();
  const [selectKeys, setSelectKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectRow, setSelectRow] = useState<string | undefined>();
  const [selectServer, setSelectServer] = useState<string | undefined>(
    undefined
  );
  const [migrateMode, setMigrateMode] = useState<
    "multiple" | "single" | undefined
  >();

  useEffect(() => {
    handleFetchNormalData();
  }, []);
  useEffect(() => {
    handleFetchKeyByServerId();
  }, [page, pageSize]);
  const handleFetchNormalData = async () => {
    try {
      const result = await api.get<ServerType[]>("/servers/server-to-migrate");
      setServer(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleFetchKeyByServerId = async () => {
    try {
      setLoadingTable(true);
      const response = await api.get<{
        data: KeySeverType[];
        totalItems: number;
      }>(`/keys/outline-data-usage?serverId=${serverId}`, {
        params: { page, status, pageSize },
      });
      setListKey({
        data: response.data.data,
        totalItems: response.data.totalItems,
      });
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trình xử lý");
    } finally {
      setLoadingTable(false);
    }
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
        // console.log("migrate signle key");
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
  const handelMigrateMultipleKey = async (
    selectServer: string,
    selectKeys: string[]
  ) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn migate những key đã chọn</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        // console.log(selectServer, selectKeys);
        setLoading(true);
        await api.post(`/keys/multi-migrate`, {
          listKeyId: selectKeys,
          serverId: selectServer,
        });
        handleFetchServerDetail();
        handleCancel();
        setSelectKeys([]);
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
    }
    setSelectServer(undefined);
    setMigrateMode(undefined);
    setIsModalOpen(false);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    _current,
    pageSize
  ) => {
    setPage(1);
    setPageSize(pageSize);
  };
  if (!listKey || listKey.data.length === 0) return null;
  if (listKey.data.length > 0)
    return (
      <>
        {loading && <Loading />}
        <div className="space-y-7">
          <div className="flex items-center justify-between h-14">
            <Heading>{heading}</Heading>
            {status === 1 && (
              <button
                className="p-2 text-xs font-medium text-white rounded-lg bg-secondary20"
                onClick={() => {
                  if (selectKeys.length > 0) {
                    setMigrateMode("multiple");
                    showModal();
                  } else {
                    toast.warn("Bạn chưa chọn key để migrate");
                  }
                }}
              >
                Migrate (select {selectKeys.length} keys)
              </button>
            )}
          </div>
          {loadingTable ? (
            <p className="text-center">Loading ...</p>
          ) : (
            <div className="w-full space-y-5 overflow-x-scroll text-sm">
              <div className="grid grid-cols-5 w-[1180px] lg:w-full">
                <div className="flex col-span-2 pb-3">
                  <div className="px-4 font-semibold">
                    <Checkbox
                      checked={selectKeys.length === listKey.data.length}
                      onClick={(checked) =>
                        checked
                          ? setSelectKeys([])
                          : setSelectKeys(listKey.data.map((item) => item._id))
                      }
                    />
                  </div>
                  <div className="px-4 font-semibold">#</div>
                  <div className="flex-1 px-4 font-semibold">OrderID</div>
                  <div className="flex-1 px-4 font-semibold">Email</div>
                  <div className="flex-1 px-4 font-semibold">Usage</div>
                  <div className="flex-1 px-4 font-semibold">Outline Usage</div>
                </div>
                <div className="flex col-span-3 pb-3">
                  <div className="px-4 font-semibold">Limit</div>
                  <div className="px-4 font-semibold">Status</div>
                  <div className="text-end flex-1 px-4 font-semibold">
                    Actions
                  </div>
                </div>
                {listKey.data.length > 0 &&
                  listKey.data.map((item) => (
                    <div
                      className="grid grid-cols-5 col-span-5 py-5 border border-gray-200 rounded-xl"
                      key={uuidv4()}
                    >
                      <div className="flex items-center col-span-2">
                        <div className="px-4 font-semibold">
                          <Checkbox
                            checked={selectKeys.some((i) => i === item._id)}
                            onClick={(checked) =>
                              checked
                                ? setSelectKeys((prev) =>
                                    prev.filter((i) => i !== item._id)
                                  )
                                : setSelectKeys((prev) => [...prev, item._id])
                            }
                          />
                        </div>
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
                            ? `${(item.dataUsage / 1000 / 1000 / 1000).toFixed(
                                2
                              )} GB`
                            : "00.00 GB"}
                        </div>
                        <div className="px-4 flex-1">
                          {item.dataUsage
                            ? `${(
                                item.realtimeDataUsage /
                                1000 /
                                1000 /
                                1000
                              ).toFixed(2)} GB`
                            : "00.00 GB"}
                        </div>
                      </div>
                      <div className="flex items-center col-span-3">
                        <div className="px-4">
                          {item.dataExpand / 1000 / 1000 / 1000}GB
                        </div>
                        <div className="px-4">
                          {item?.enable && <Tag color="green">Hoạt động</Tag>}
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
                                  setMigrateMode("single");
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
                                      toast.error(error.response?.data.message);
                                    } else {
                                      console.log("unexpected error: ", error);
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
                  ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Pagination
              defaultCurrent={1}
              total={listKey.totalItems}
              onChange={(index) => setPage(index)}
              pageSize={pageSize}
              hideOnSinglePage
              onShowSizeChange={onShowSizeChange}
              showSizeChanger
            />
          </div>
        </div>
        <Modal
          title="Chọn máy chủ"
          open={isModalOpen}
          onCancel={() => {
            handleCancel();
          }}
          footer={[]}
        >
          <div className="mb-3">
            <p className="font-primary">Chọn máy chủ để migrate key</p>
            {selectRow &&
              servers.filter((item) => item._id !== serverId).length === 0 && (
                <p className="text-error font-primary">
                  Bạn cần thêm server mới để migrate key sang
                </p>
              )}
          </div>
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
                if (migrateMode === "single") {
                  if (selectRow && selectServer) {
                    handleMigratekey(selectRow, selectServer);
                  } else {
                    toast.warn("bạn chưa chọn server để migrate key sang");
                  }
                } else if (migrateMode === "multiple") {
                  if (selectServer) {
                    handelMigrateMultipleKey(selectServer, selectKeys);
                  } else {
                    toast.warn("bạn chưa chọn server để migrate key sang");
                  }
                }
              }}
            >
              Migrate key
            </button>
          </div>
        </Modal>
      </>
    );
  return null;
};
