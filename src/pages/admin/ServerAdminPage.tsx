import { useEffect, useMemo, useState } from "react";
import { api } from "../../api";
import Heading from "../../components/common/Heading";
import { KeySeverType, ServerType } from "../../type";
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
import Radio from "../../components/radio/Radio";
import Loading from "../../components/common/Loading";
import PickLocationForm from "../../components/server/PickLocationForm";

const schema = yup
  .object({
    apiUrl: yup.string().required("This field is required"),
    fingerPrint: yup.string().required("This field is required"),
    remark: yup.string().required("This field is required"),
    // numberRecomendKey: yup.number(),
    location: yup.string().required("This field is required"),
    // defaultBandWidth: yup.number().required("This field is required"),
    totalBandWidth: yup.number().required("This field is required"),
  })
  .required();

const ServerAdminPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingtable, setLoadingTable] = useState<boolean>(false);
  const [servers, setServers] = useState<ServerType[]>([]);
  const [listServerHistory, setListServerHistory] = useState<ServerType[]>([]);
  const [selectRow, setSelectRow] = useState<string | undefined>();
  const [selectServer, setSelectServer] = useState<string | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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
  }, []);
  const handleFetchData = async () => {
    try {
      setLoadingTable(true);
      const resultServer = await api.get<ServerType[]>("/servers");
      setServers(resultServer.data.filter((item) => item.status === 1));
      setListServerHistory(resultServer.data);
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
        render: (text: number) => (
          <p className="text-sm font-primary">{text / 1000 / 1000 / 1000}GB</p>
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
    []
  );
  const columnsHistory: TableColumnsType<ServerType> = useMemo(
    () => [
      {
        title: () => (
          <p className="text-base font-semibold font-primary">STT</p>
        ),
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: () => (
          <p className="text-base font-semibold font-primary">Server Name</p>
        ),
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
        title: () => (
          <p className="text-base font-semibold font-primary">Location</p>
        ),
        dataIndex: "location",
        key: "location",
        render: (_: string, record: ServerType) => (
          <p className="text-sm font-primary">{record.location}</p>
        ),
      },
      {
        title: () => (
          <p className="text-base font-semibold font-primary">Trạng thái</p>
        ),
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
        title: () => (
          <p className="text-base font-semibold font-primary">Ngày tạo</p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(date)}</p>
        ),
      },
      {
        title: () => (
          <p className="text-base font-semibold font-primary">Ngày cập nhật</p>
        ),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (date: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(date)}</p>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
  return (
    <RequireAuthPage rolePage={1}>
      {loading && <Loading />}
      <div className="space-y-10">
        <div className="flex items-start rounded-xl border-2 border-[#eeeeed]">
          <div className="flex-1 p-5 space-y-3">
            <p className="text-lg text-gray-500">Tổng số máy chủ</p>
            <p className="text-2xl font-medium">{servers.length}</p>
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

        <Heading>Danh sách máy chủ({servers.length})</Heading>
        <Table
          loading={loadingtable}
          dataSource={servers.map((item, index) => ({ index, ...item }))}
          columns={columns}
          scroll={{ x: 1120 }}
        />
        <Heading>Lịch sử máy chủ</Heading>
        <Table
          loading={loadingtable}
          dataSource={listServerHistory.map((item, index) => ({
            index,
            ...item,
          }))}
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
        <div className="mb-5">
          <p className="font-primary">Chọn máy chủ để migrate key</p>
          {selectRow &&
            servers.filter((item) => item._id !== selectRow).length === 0 && (
              <p className="text-error font-primary">
                Bạn cần thêm server mới để migrate key sang
              </p>
            )}
        </div>
        <div>
          {selectRow &&
            servers.map((item) =>
              item._id !== selectRow ? (
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
