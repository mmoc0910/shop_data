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
import { Input } from "../../components/input";
import Button from "../../components/button/Button";
import { Table, TableColumnsType, Tag } from "antd";
import Swal from "sweetalert2";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import axios from "axios";

const schema = yup
  .object({
    apiUrl: yup.string().required("This field is required"),
    fingerPrint: yup.string().required("This field is required"),
    numberRecomendKey: yup.number().required("This field is required"),
    location: yup.string().required("This field is required"),
  })
  .required();

const ServerAdminPage = () => {
  const [servers, setServers] = useState<ServerType[]>([]);
  const [listServerHistory, setListServerHistory] = useState<ServerType[]>([]);
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
    try {
      const [resultServer, resultHistory] = await Promise.all([
        api.get("/servers?status=1"),
        api.get("/servers"),
      ]);
      console.log(resultServer.data);
      setServers(resultServer.data);
      setListServerHistory(resultHistory.data);
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

  const onSubmit = async (data: {
    apiUrl: string;
    fingerPrint: string;
    location: string;
    numberRecomendKey: number;
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
      Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn xóa máy chủ này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Xóa",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await api.delete(`/servers/${_id}`);
          handleFetchData();
          toast.success("Xóa thành công");
        }
      });
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
  const columns: TableColumnsType<ServerType> = useMemo(
    () => [
      {
        title: () => (
          <p className="font-primary text-base font-semibold">STT</p>
        ),
        dataIndex: "index",
        render: (_text: string, _record: ServerType, index: number) => (
          <p className="font-primary text-sm">{index + 1}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Server Name</p>
        ),
        dataIndex: "email",
        key: "email",
        render: (_: string, record: ServerType) => (
          <Link
            to={`/admin/server/${record._id}`}
            className="font-primary text-sm text-primary"
          >
            {record.name}
          </Link>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Location</p>
        ),
        dataIndex: "location",
        key: "location",
        render: (_: string, record: ServerType) => (
          <p className="font-primary text-sm">{record.location}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">
            Số key giới hạn
          </p>
        ),
        dataIndex: "numberRecomendKey",
        key: "numberRecomendKey",
        render: (_: string, record: ServerType) => (
          <p className="font-primary text-sm">{record.numberRecomendKey}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">
            Tổng key đã sử dụng
          </p>
        ),
        dataIndex: "usedkey",
        key: "usedkey",
        render: (_: string, record: ServerType) => (
          <p className="font-primary text-sm">
            <TotalKeyUsage serverId={record._id} />
          </p>
        ),
      },
      {
        title: () => <p className="font-primary text-base font-semibold"></p>,
        dataIndex: "action",
        key: "action",
        render: (_: string, record: ServerType) => (
          <button
            className="px-4 py-2 rounded-lg bg-error font-medium text-white font-primary text-sm"
            onClick={() => handleRemoveServer(record._id)}
          >
            Xóa máy chủ
          </button>
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
          <p className="font-primary text-base font-semibold">STT</p>
        ),
        dataIndex: "index",
        render: (_text: string, _record: ServerType, index: number) => (
          <p className="font-primary text-sm">{index + 1}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Server Name</p>
        ),
        dataIndex: "email",
        key: "email",
        render: (_: string, record: ServerType) => (
          <Link
            to={`/admin/server/${record._id}`}
            className="font-primary text-sm text-primary"
          >
            {record.name}
          </Link>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Location</p>
        ),
        dataIndex: "location",
        key: "location",
        render: (_: string, record: ServerType) => (
          <p className="font-primary text-sm">{record.location}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">
            Số key giới hạn
          </p>
        ),
        dataIndex: "numberRecomendKey",
        key: "numberRecomendKey",
        render: (_: string, record: ServerType) => (
          <p className="font-primary text-sm">{record.numberRecomendKey}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Trạng thái</p>
        ),
        dataIndex: "status",
        key: "status",
        render: (status: 0 | 1) => (
          <p className="font-primary text-sm">
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
          <p className="font-primary text-base font-semibold">Ngày tạo</p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: Date) => (
          <p className="font-primary text-sm">{DAY_FORMAT(date)}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Ngày cập nhật</p>
        ),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (date: Date) => (
          <p className="font-primary text-sm">{DAY_FORMAT(date)}</p>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const totalKey =
    servers.length > 0
      ? servers
          .map((item) => item.numberRecomendKey)
          .reduce((prev, cur) => (prev += cur), 0)
      : 0;
  return (
    <RequireAuthPage rolePage={1}>
      <div className="space-y-10">
        <div className="flex items-start rounded-xl border-2 border-[#eeeeed]">
          <div className="p-5 flex-1 space-y-3">
            <p className="text-gray-500 text-lg">Tổng số máy chủ</p>
            <p className="font-medium text-2xl">{servers.length}</p>
          </div>
          <div className="p-5 flex-1 space-y-3">
            <p className="text-gray-500 text-lg">Tổng số key</p>
            <p className="font-medium text-2xl">{totalKey}</p>
          </div>
          <div className="p-5 flex-1 space-y-3">
            <p className="text-gray-500 text-lg">Tổng key đang sử dụng</p>
            <p className="font-medium text-2xl">{TotalKeyUsage({})}</p>
          </div>
          <div className="p-5 flex-1 space-y-3">
            <p className="text-gray-500 text-lg">Số key có thể cấp</p>
            <p className="font-medium text-2xl">
              {totalKey - TotalKeyUsage({})}
            </p>
          </div>
        </div>
        <div className="space-y-5">
          <Heading>Thêm máy chủ</Heading>
          <form
            className="flex items-center gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex-1">
              <Input
                name="location"
                placeholder={"Location"}
                control={control}
              />
            </div>
            <div className="flex-1">
              <Input
                name="numberRecomendKey"
                type="number"
                placeholder={"Tổng key giới hạn"}
                control={control}
              />
            </div>
            <div className="flex-1">
              <Input name="apiUrl" placeholder={"apiUrl"} control={control} />
            </div>
            <div className="flex-1">
              <Input
                name="fingerPrint"
                placeholder={"fingerPrint"}
                control={control}
              />
            </div>
            <Button className="text-white bg-secondary20 px-5" type="submit">
              Thêm máy chủ
            </Button>
          </form>
        </div>

        <Heading>Danh sách máy chủ({servers.length})</Heading>
        <Table dataSource={servers} columns={columns} />
        <Heading>Lịch sử máy chủ</Heading>
        <Table dataSource={listServerHistory} columns={columnsHistory} />
      </div>
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
