import { Key, useEffect, useMemo, useState } from "react";
import { api } from "../../api";
import Heading from "../../components/common/Heading";
import { KeySeverType, LocationType, ServerType } from "../../type";
import { toast } from "react-toastify";
import { DAY_FORMAT } from "../../constants";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Textarea } from "../../components/input";
import Button from "../../components/button/Button";
import { Modal, Table, TableColumnsType, Tag } from "antd";
import Swal from "sweetalert2";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import axios from "axios";
import Loading from "../../components/common/Loading";
import PickLocationForm from "../../components/server/PickLocationForm";
import EditKeyLimitForm from "../../components/server/EditKeyLimitForm";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { setServer } from "../../store/server/serverSlice";
import { DropdownWithComponents } from "../../components/dropdown";
import { v4 as uuidv4 } from "uuid";

const schema = yup
  .object({
    apiUrl: yup.string().required("This field is required"),
    fingerPrint: yup.string().required("This field is required"),
    remark: yup.string().required("This field is required"),
    location: yup.string().required("This field is required"),
    totalBandWidth: yup.number().required("This field is required"),
  })
  .required();

const ServerAdminPage = () => {
  const dispatch = useDispatch();
  const listServerStore = useSelector((state: RootState) => state.server);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingtable, setLoadingTable] = useState<boolean>(false);
  const [selectRow, setSelectRow] = useState<string | undefined>();
  const [selectServer, setSelectServer] = useState<string | undefined>(
    undefined
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [locations, setLocations] = useState<LocationType[]>([]);
  const listFilterServerStore = listServerStore.filter(
    (item) =>
      item.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.hostnameForAccessKeys
        .toLowerCase()
        .includes(inputValue.toLowerCase())
  );
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<LocationType[]>("/locations");
        setLocations(result.data);
      } catch (error) {
        console.log("error - ", error);
      }
    })();
  }, []);
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
  });
  const locationWatch = watch("location");
  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleFetchData = async () => {
    try {
      console.log("load server");
      setLoadingTable(true);
      const resultServer = await api.get<ServerType[]>("/servers");
      dispatch(setServer(resultServer.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    } finally {
      setLoadingTable(false);
    }
  };

  const onSubmit = async (data: {
    apiUrl: string;
    fingerPrint: string;
    remark: string;
    location: string;
    // numberRecomendKey: number;
    // defaultBandWidth: number;
    totalBandWidth: number;
  }) => {
    try {
      try {
        await api.post("/servers", data);
        handleFetchData();
        toast.success("Import Server thành công");
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
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveServer = async (_id: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn xóa máy chủ này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Xóa",
      });
      if (isConfirmed) {
        const result = await api.get<KeySeverType[]>(
          `/keys?serverId=${_id}&status=1`
        );
        if (result.data.length > 0) {
          toast.warn(
            "Bạn phải migrate key sang server khác trước khi muốn xóa"
          );
        } else {
          await api.delete(`/servers/${_id}`);
          handleFetchData();
          toast.success("Xóa thành công");
        }
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
  const handleMigrateServer = async (_oldId: string, _newId: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn migate key máy chủ này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        setLoading(true);
        await api.post(`/servers/migrate`, {
          oldServerId: _oldId,
          newServerId: _newId,
        });
        handleFetchData();
        handleCancel();
        toast.success("Migrate server thành công");
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
  const handleChangeLimitData = async (_id: string, totalBandwidth: number) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn chỉnh sửa total bandwidth máy chủ này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        setLoading(true);
        await api.patch(`/servers/total-bandwidth/${_id}`, {
          totalBandwidth,
        });
        toast.success("Chỉnh sửa thành công");
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
  const columns: TableColumnsType<ServerType> = useMemo(
    () => [
      {
        title: () => <p className="text-sm font-semibold font-primary">STT</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Server Name</p>
        ),
        dataIndex: "name",
        key: "name",
        render: (text: string, record: ServerType) => (
          <Link
            to={`/admin/server/${record._id}`}
            className="text-sm font-primary text-primary"
          >
            {text}
          </Link>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Location</p>
        ),
        dataIndex: "location",
        key: "location",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
        filters: locations.map((item) => ({
          text: item.name,
          value: item.name,
        })),
        onFilter: (value: boolean | Key, record: ServerType) => {
          if (typeof value === "boolean") {
            // Xử lý trường hợp value là boolean
            return record.location === (value ? "1" : "0");
          } else {
            // Xử lý trường hợp value là Key (đối với trường hợp khi dùng dropdown filter)
            return record.location === value;
          }
        },
      },
      {
        title: () => <p className="text-sm font-semibold font-primary">IP</p>,
        dataIndex: "hostnameForAccessKeys",
        key: "hostnameForAccessKeys",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Total BandWidth</p>
        ),
        dataIndex: "totalBandWidth",
        key: "totalBandWidth",
        render: (text: number, record: ServerType) => (
          <EditKeyLimitForm
            className="!w-[170px]"
            type="number"
            placeholder={`${text / 1000 / 1000 / 1000}GB`}
            handleAddLimitData={(value) => {
              handleChangeLimitData(record._id, Number(value));
            }}
          />
          // <p className="text-sm font-primary">{text / 1000 / 1000 / 1000}GB</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Tổng key sử dụng</p>
        ),
        dataIndex: "usedkey",
        key: "usedkey",
        render: (_: string, record: ServerType) => (
          <p className="text-sm font-primary">
            <TotalKeyUsage serverId={record._id} />
          </p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Max using</p>
        ),
        dataIndex: "maxUsage",
        key: "maxUsage",
        render: (text?: number) => (
          <p className="text-sm font-primary">
            {text ? text / 1000 / 1000 / 1000 : "00.00"}GB
          </p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">dataTransfer</p>
        ),
        dataIndex: "dataTransfer",
        key: "dataTransfer",
        render: (text?: number) => (
          <p className="text-sm font-primary">
            {text ? (text / 1000 / 1000 / 1000).toFixed(2) : "00.00"}GB
          </p>
        ),
      },
      {
        title: () => <p className="text-sm font-semibold font-primary"></p>,
        dataIndex: "action",
        key: "action",
        width: 170,
        render: (_: string, record: ServerType) => (
          <div className="flex flex-col gap-2">
            <button
              className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-secondary40 font-primary"
              onClick={() => {
                setSelectRow(record._id);
                showModal();
              }}
            >
              Migrate server
            </button>
            <button
              className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-error font-primary"
              onClick={() => handleRemoveServer(record._id)}
            >
              Xóa máy chủ
            </button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locations]
  );
  const columnsHistory: TableColumnsType<ServerType> = useMemo(
    () => [
      {
        title: () => <p className="font-semibold font-primary">STT</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Server Name</p>,
        dataIndex: "email",
        key: "email",
        render: (_: string, record: ServerType) => (
          <Link
            to={`/admin/server/${record._id}`}
            className="text-sm font-primary text-primary"
          >
            {record.name}
          </Link>
        ),
      },
      {
        title: () => <p className="text-sm font-semibold font-primary">IP</p>,
        dataIndex: "hostnameForAccessKeys",
        key: "hostnameForAccessKeys",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            Tổng ngày hoạt động
          </p>
        ),
        dataIndex: "hostnameForAccessKeys",
        key: "hostnameForAccessKeys",
        render: (_text: string, record: ServerType) => {
          const diff = dayjs(record.updatedAt).diff(
            dayjs(record.createdAt),
            "days"
          );
          return (
            <p className="text-sm font-primary">
              {diff < 1
                ? `${dayjs(record.updatedAt).diff(
                    dayjs(record.createdAt),
                    "hour"
                  )} giờ`
                : `${diff} ngày`}
            </p>
          );
        },
      },
      {
        title: () => <p className="font-semibold font-primary">Location</p>,
        dataIndex: "location",
        key: "location",
        render: (_: string, record: ServerType) => (
          <p className="text-sm font-primary">{record.location}</p>
        ),
        filters: locations.map((item) => ({
          text: item.name,
          value: item.name,
        })),
        onFilter: (value: boolean | Key, record: ServerType) => {
          if (typeof value === "boolean") {
            // Xử lý trường hợp value là boolean
            return record.location === (value ? "1" : "0");
          } else {
            // Xử lý trường hợp value là Key (đối với trường hợp khi dùng dropdown filter)
            return record.location === value;
          }
        },
      },
      {
        title: () => <p className="font-semibold font-primary">Trạng thái</p>,
        dataIndex: "status",
        key: "status",
        render: (status: 0 | 1) => (
          <p className="text-sm font-primary">
            {status ? (
              <Tag color="green">
                <span className="font-primary">Đang hoạt động</span>
              </Tag>
            ) : (
              <Tag color="red">
                <span className="font-primary">Đã xóa</span>
              </Tag>
            )}
          </p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Ngày tạo</p>,
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(date)}</p>
        ),
      },
      {
        title: () => (
          <p className="font-semibold font-primary">Ngày cập nhật</p>
        ),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (date: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(date)}</p>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locations]
  );
  // const totalKey =
  //   servers.length > 0
  //     ? servers
  //         .map((item) => item.numberRecomendKey)
  //         .reduce((prev, cur) => (prev += cur), 0)
  //     : 0;
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };
  return (
    <RequireAuthPage rolePage={1}>
      {loading && <Loading />}
      <div className="space-y-10">
        <div className="flex items-start rounded-xl border-2 border-[#eeeeed]">
          <div className="flex-1 p-5 space-y-3">
            <p className="text-lg text-gray-500">Tổng số máy chủ</p>
            <p className="text-2xl font-medium">{listServerStore.length}</p>
          </div>
          {/* <div className="flex-1 p-5 space-y-3">
            <p className="text-lg text-gray-500">Tổng số key</p>
            <p className="text-2xl font-medium">{totalKey}</p>
          </div> */}
          <div className="flex-1 p-5 space-y-3">
            <p className="text-lg text-gray-500">Tổng key đang sử dụng</p>
            <p className="text-2xl font-medium">{TotalKeyUsage({})}</p>
          </div>
          {/* <div className="flex-1 p-5 space-y-3">
            <p className="text-lg text-gray-500">Số key có thể cấp</p>
            <p className="text-2xl font-medium">
              {totalKey - TotalKeyUsage({})}
            </p>
          </div> */}
        </div>
        <div className="space-y-5">
          <Heading>Thêm máy chủ</Heading>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full lg:flex-1">
              <Textarea
                name="remark"
                placeholder={"remark"}
                control={control}
                className="!h-[100px]"
              />
            </div>
            <div className="flex flex-col items-center gap-5 lg:flex-row">
              <div className="w-full lg:flex-1">
                <PickLocationForm
                  location={locationWatch}
                  onSelectLocation={(value) => {
                    console.log("value - ", value);
                    setValue("location", value);
                  }}
                  error={
                    errors?.location?.message
                      ? errors.location.message
                      : undefined
                  }
                />
              </div>
              <div className="w-full lg:flex-1">
                <Input
                  name="totalBandWidth"
                  type="number"
                  placeholder={"Total BandWidth"}
                  control={control}
                />
              </div>
              <div className="w-full lg:flex-1">
                <Input name="apiUrl" placeholder={"apiUrl"} control={control} />
              </div>
              <div className="w-full lg:flex-1">
                <Input
                  name="fingerPrint"
                  placeholder={"fingerPrint"}
                  control={control}
                />
              </div>
              <Button
                className="w-full px-5 text-white bg-secondary20 lg:w-fit"
                type="submit"
              >
                Thêm máy chủ
              </Button>
            </div>
          </form>
        </div>
        <Heading>
          Danh sách máy chủ(
          {listServerStore.filter((item) => item.status === 1).length})
        </Heading>
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
            placeholder={"Search..."}
          />
          {inputValue.length > 0 ? (
            <span
              className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
              onClick={() => setInputValue("")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-icon-color"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          ) : null}
        </div>
        <Table
          loading={loadingtable}
          dataSource={listFilterServerStore
            .filter((item) => item.status === 1)
            .map((item, index) => ({ index, ...item }))}
          columns={columns}
          scroll={{ x: 1120 }}
        />
        <Heading>Lịch sử máy chủ</Heading>
        <Table
          loading={loadingtable}
          dataSource={listFilterServerStore
            .filter((item) => item.status === 0)
            .map((item, index) => ({ index, ...item }))}
          columns={columnsHistory}
          scroll={{ x: 1120 }}
        />
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
            listServerStore.filter((item) => item._id !== selectRow).length ===
              0 && (
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
                    {listServerStore.find((i) => i._id === selectServer)?.name}
                  </span>
                ) : (
                  <span className="text-text4">Chọn server</span>
                )
              }
            ></DropdownWithComponents.Select>
            <DropdownWithComponents.List>
              {listServerStore
                .filter((item) => item.status === 1)
                .map((item) =>
                  item._id !== selectRow ? (
                    <DropdownWithComponents.Option
                      key={uuidv4()}
                      onClick={() => setSelectServer(item._id)}
                    >
                      <span className="capitalize">{item.name}</span>
                    </DropdownWithComponents.Option>
                  ) : null
                )}
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
                handleMigrateServer(selectRow, selectServer);
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

const TotalKeyUsage = ({ serverId = "" }: { serverId?: string }) => {
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<KeySeverType[]>(
          `/keys?serverId=${serverId}&status=1`
        );
        setTotal(result.data.length);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [serverId]);
  return total;
};

export default ServerAdminPage;
