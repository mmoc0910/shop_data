import { useEffect, useMemo, useState } from "react";
import { api } from "../../api";
import Heading from "../../components/common/Heading";
import { ServerType } from "../../type";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../../components/input";
import Button from "../../components/button/Button";
import { Table } from "antd";
import Swal from "sweetalert2";

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
  const { handleSubmit, control, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
    try {
      const result = await api.get("/servers");
      console.log(result.data);
      setServers(result.data);
    } catch (error) {
      console.log("err - ", error);
      toast.error(messages.error);
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
        console.log("error - ", error);
        toast.error(messages.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleRemoveServer = async (_id: string) => {
    try {
      Swal.fire({
        title: `Bạn có muốn xóa máy chủ này`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Có, mua ngay",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await api.delete(`/servers/${_id}`);
          handleFetchData();
          toast.success("Xóa thành công");
        }
      });
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const columns = useMemo(
    () => [
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
          <Link
            to={`/admin/server/${record._id}`}
            className="font-primary text-sm"
          >
            {10}
          </Link>
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
  return (
    <div className="space-y-10">
      <div className="space-y-5">
        <Heading>Thêm máy chủ</Heading>
        <form
          className="flex items-center gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex-1">
            <Input name="location" placeholder={"Location"} control={control} />
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
      {/* {servers.length > 0 ? (
        <div className="grid grid-cols-2 gap-8" key={uuidv4()}>
          {servers.map((server) => (
            <div className="p-5 rounded-xl shadow-xl cursor-pointer space-y-5" key={uuidv4()}>
              <Link to={`/admin/server/${server._id}`} className="space-y-3">
                <div className="grid grid-cols-2 gap-y-4">
                  <p>
                    Server name:{" "}
                    <span className="font-semibold text-lg">{server.name}</span>
                  </p>
                  <p>
                    Số key giới hạn:{" "}
                    <span className="font-semibold text-lg">{10}</span>
                  </p>
                  <p>
                    Tổng key đã sử dụng:{" "}
                    <span className="font-semibold text-lg">
                      {server.listKeys.filter((item) => item.used).length}
                    </span>
                  </p>
                </div>
              </Link>
              <button
                className="text-white bg-error px-5 rounded-lg py-3 font-semibold"
                onClick={() => handleRemoveServer(server._id)}
              >
                Xóa máy chủ
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center pt-20 font-medium">
          Chưa có máy chủ nào được thêm
        </p>
      )} */}
    </div>
  );
};

export default ServerAdminPage;
