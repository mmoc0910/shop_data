import { PaginationProps, TableColumnsType, Tag, Tooltip } from "antd";
import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { KeySeverType, ServerType } from "../../type";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { api } from "../../api";
import { useWatch } from "react-hook-form";
import { AndroidXML } from "../../pages/user/OrderPage";
import MoveServer from "../user/MoveServer";
import { toast } from "react-toastify";
import UpdateExtensionKey from "./UpdateExtensionKey";
import { copyToClipboard } from "../../utils/copyToClipboard";

export const ListKeyAdmin = () => {
  const [servers, setServers] = useState<ServerType[]>([]);
  const searchTerm = useWatch({ name: "searchTerm", exact: true });
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState<number>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [listKey, setListKey] = useState<KeySeverType[]>([]);
  useEffect(() => {
    handleFetchServer();
  }, []);
  useEffect(() => {
    handleFetchData();
  }, [page, searchTerm, pageSize]);
  const handleFetchServer = async () => {
    try {
      setLoading(true);
      const { data: dataServers } = await api.get<ServerType[]>(
        "/servers/server-to-migrate"
      );
      setServers(dataServers);
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trình xử lý");
    } finally {
      setLoading(false);
    }
  }
  const handleFetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/keys`, {
        params: {
          status: 1,
          page,
          name: searchTerm,
          pageSize,
        },
      });
      setTotalItems(response.data.totalItems);
      setListKey(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleUpdateExtension = async (_id: string, value: string) => {
    try {
      const response = await api.get(`/gists?keyId=${_id}&status=1`);
      if (response.data.data.length > 0) {
        await api.patch(`/gists/extension/${response.data.data[0]._id}`, {
          extension: value,
        });
        toast.success("Thay đổi thành công");
      }
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trình xử lý");
    }
  };
  const columns: TableColumnsType<KeySeverType> = useMemo(
    () => [
      // {
      //   title: () => <p className="font-semibold font-primary">STT</p>,
      //   dataIndex: "index",
      //   key: "index",
      //   width: 70,
      //   render: (text: string) => (
      //     <p className="text-sm font-primary">{text + 1}</p>
      //   ),
      // },

      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Key Name</p>
        ),
        width: 250,
        dataIndex: "name",
        key: "name",
        render: (text: string, record) => (
          // <Link
          //   to={`/admin/key/${record._id}`}
          //   className="text-sm font-primary text-primary"
          // >
          //   {text}
          // </Link>
          <UpdateExtensionKey
            initialValue={text}
            onSubmit={(value: string) => {
              handleUpdateExtension(record._id, value);
              handleFetchData();
            }}
            key_id={record._id}
          />
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Account Name</p>
        ),
        dataIndex: "account",
        key: "account",
        render: (_, record) => (
          <Link
            to={`/admin/account/${record.userId._id}`}
            className="text-sm font-primary text-primary"
          >
            {record.userId.username}
          </Link>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Server Name</p>
        ),
        dataIndex: "server",
        key: "server",
        render: (_, record) =>
          typeof record.serverId === "object" &&
          record.serverId !== null &&
          "name" in record.serverId && (
            <p className="text-sm font-primary">
              {record.serverId.name as string}
            </p>
          ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Trạng thái</p>
        ),
        width: 130,
        dataIndex: "status",
        key: "status",
        render: (_, record) => (
          <div className="text-sm font-primary">
            {record.status === 1 && (
              <Tag color="green">
                <span className="font-primary">Còn hạn</span>
              </Tag>
            )}
            {record.status === 0 && (
              <Tag color="red">
                <span className="font-primary">Hết hạn</span>
              </Tag>
            )}
            {record.status === 2 && (
              <Tag color="blue">
                <span className="font-primary">Migrate</span>
              </Tag>
            )}
            {!record.enable ? (
              <Tag color="red">
                <span className="font-primary">Locked</span>
              </Tag>
            ) : (
              ""
            )}
          </div>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Thời gian</p>,
        dataIndex: "day",
        key: "day",
        width: 120,
        render: (_: string, record) => (
          <p className="text-sm font-primary">
            {dayjs(record.startDate).format("DD/MM/YYYY")} <br />-{" "}
            {dayjs(record.endDate).format("DD/MM/YYYY")}
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Data limit</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        width: 120,
        render: (_: string, record) => (
          <p className="text-sm font-primary">
            {record.dataLimit / 1000 / 1000 / 1000}GB/
            {record.dataExpand / 1000 / 1000 / 1000}GB
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Data Usage</p>,
        dataIndex: "dataUsage",
        key: "dataUsage",
        width: 150,
        render: (_: string, record) => (
          <p className="text-sm font-primary">
            {record.dataUsage
              ? `${(record.dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB`
              : "0GB"}
          </p>
        ),
      },
      // {
      //   title: (
      //     <p className="font-semibold font-primary text-sm">Date Expand</p>
      //   ),
      //   dataIndex: "endExpandDate",
      //   key: "endExpandDate",
      //   width: 120,
      //   render: (_: string, record) => (
      //     <p className="text-sm font-primary">
      //       {record?.endExpandDate && DAY_FORMAT(record.endExpandDate)}
      //     </p>
      //   ),
      // },
      {
        title: <p className="font-semibold font-primary">Key</p>,
        dataIndex: "key",
        key: "key",
        render: (_: string, record) => {
          const { awsId, accessUrl, keyId, name, serverId } = record;
          // const key = `${linkGist}/${record.gistId}/raw/${record?.fileName}#`;
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tooltip title="Copy link chính">
                  <button
                    className="text-white px-2 w-fit aspect-square rounded-md bg-secondary20"
                    onClick={() =>
                      copyToClipboard(
                        `${awsId?.fileName.replace(/https/g, "ssconf")}#${name}`
                      )
                    }
                  >
                    <AndroidXML />
                  </button>
                </Tooltip>
                <Tooltip title="Copy link dự phòng">
                  <button
                    className="text-white px-2 w-fit aspect-square rounded-md bg-gray-400"
                    onClick={() =>
                      copyToClipboard(
                        `${accessUrl}#${
                          typeof serverId === "object"
                            ? serverId.name
                            : serverId
                        }-k${keyId}`
                      )
                    }
                  >
                    <AndroidXML />
                  </button>
                </Tooltip>
                {/* <p className="font-primary text-sm w-[200px] line-clamp-1">
                  {record.keyId.awsId?.fileName.replace(/https/g, "ssconf")}#
                  {record.extension}
                </p> */}
              </div>
              {/* <div className="flex items-center gap-2">
                <Tooltip title="copy">
                  <button
                    onClick={() => copyToClipboard(`${key}${record.extension}`)}
                  >
                    <AndroidXML />
                  </button>
                </Tooltip>
                <p className="font-primary text-sm w-[350px] line-clamp-1">
                  {key}
                  {record.extension}
                </p>
              </div> */}
            </div>
          );
        },
      },
      {
        title: <p className="font-semibold font-primary text-sm"></p>,
        dataIndex: "action",
        key: "action",
        // width: 100,
        render: (_: string, record) =>
          record.status ? (
            <MoveServer
              servers={servers}
              gist={{
                key_id: record._id,
                key_name: record.name,
                // server_id: record.serverId?._id,
                server_id:
                  typeof record.serverId === "object"
                    ? record.serverId._id
                    : record.serverId,
              }}
              handleReloadData={handleFetchData}
            />
          ) : null,
      },
    ],
    [servers]
  );
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    _current,
    pageSize
  ) => {
    setPage(1);
    setPageSize(pageSize);
  };
  return (
    <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
      <Table
        dataSource={listKey}
        columns={columns}
        loading={loading}
        scroll={{ y: 420, x: 1200 }}
        pagination={{
          defaultCurrent: 1,
          total: totalItems,
          onChange: (index) => setPage(index),
          pageSize,
          onShowSizeChange: onShowSizeChange,
        }}
      />
    </div>
  );
};
