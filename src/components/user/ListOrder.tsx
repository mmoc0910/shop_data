import { PaginationProps, Table, Tag, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import MoveServer from "./MoveServer";
import dayjs from "dayjs";
import UpdateExtension from "./UpdateExtension";
import { AndroidXML } from "../../pages/user/OrderPage";
import { Link } from "react-router-dom";
import { TableColumnsType } from "antd";
import { GistType } from "../../type";
import { api } from "../../api";
import { FC } from "react";
import { ServerType } from "../../type";
import { messages } from "../../constants";
import { useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { Key } from "react";

type Props = { accountId: string; status: 0 | 1 };
const ListOrder: FC<Props> = ({ accountId, status }) => {
  const extensionSearchTermWatch = useWatch({
    name: "extensionSearchTerm",
    exact: true,
  });
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [listGist, setListGist] = useState<{
    data: GistType[];
    totalItems: number;
  }>();
  const [servers, setServers] = useState<ServerType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  useEffect(() => {
    (async () => {
      try {
        const { data: dataServers } = await api.get<ServerType[]>(
          "/servers/server-to-migrate"
        );
        setServers(dataServers);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, extensionSearchTermWatch, pageSize]);
  const handleFetchData = async () => {
    try {
      setLoadingTable(true);
      const result = await api.get<{
        data: GistType[];
        totalItems: number;
      }>(`/gists`, {
        params: {
          status,
          userId: accountId,
          page,
          extension: extensionSearchTermWatch,
          pageSize,
        },
      });
      setListGist({
        data: result.data.data,
        totalItems: result.data.totalItems,
      });
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleUpdateExtension = async (_id: string, value: string) => {
    try {
      await api.patch(`/gists/extension/${_id}`, { extension: value });
    } catch (error) {
      toast.error(messages.error);
    }
  };
  const columns: TableColumnsType<GistType> = useMemo(
    () => [
      //   {
      //     title: () => (
      //       <p className="text-base font-semibold font-primary">STT</p>
      //     ),
      //     dataIndex: "index",
      //     key: "index",
      //     width: 70,
      //     render: (text: string, record: GistType) => (
      //       <Link
      //         to={`/admin/key/${record.keyId._id}`}
      //         className="text-sm font-primary text-primary"
      //       >
      //         {text + 1}
      //       </Link>
      //     ),
      //   },
      {
        title: <p className="font-semibold font-primary">Order code</p>,
        dataIndex: "code",
        key: "code",
        render: (text: string, record: GistType) => (
          <Link
            to={`/admin/key/${record.keyId._id}`}
            className="text-sm font-primary text-primary"
          >
            {text || '...............'}
          </Link>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Tên gói</p>,
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">{record.planId?.name}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Key</p>,
        dataIndex: "key",
        key: "key",
        // fixed: "right",
        render: (_: string, record: GistType) => {
          const {
            keyId: { accessUrl, keyId, serverId },
          } = record;
          // const key = `${linkGist}/${record.gistId}/raw/${record?.fileName}#`;
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tooltip title="Copy link chính">
                  <button
                    className="text-white px-2 w-fit aspect-square rounded-md bg-secondary20"
                    onClick={() =>
                      copyToClipboard(
                        `${record.keyId.awsId?.fileName.replace(
                          /https/g,
                          "ssconf"
                        )}#${record.extension}`
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
                            ? serverId?.name
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
        title: <p className="font-semibold font-primary">Tên key</p>,
        dataIndex: "extension",
        key: "extension",
        // width: 150,
        render: (_: string, record: GistType) => {
          return (
            <UpdateExtension
              initialValue={record.extension}
              onSubmit={(value: string) => {
                handleUpdateExtension(record._id, value);
                handleFetchData();
                toast.success("Thay đổi thành công");
              }}
            />
          );
        },
      },
      {
        title: <p className="font-semibold font-primary">Trạng thái</p>,
        dataIndex: "status",
        key: "status",
        width: 130,
        render: (_: number, record: GistType) => (
          <div className="text-sm font-primary space-y-1">
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
            {!record.keyId.enable ? (
              <Tag color="red">
                <span className="font-primary">Locked</span>
              </Tag>
            ) : (
              ""
            )}
          </div>
        ),
        filters: [
          {
            text: "Còn hạn",
            value: 1,
          },
          {
            text: "Hết hạn",
            value: 0,
          },
          // {
          //   text: "Migrate",
          //   value: 2,
          // },
        ],
        onFilter: (value: boolean | Key, record: GistType) => {
          if (typeof value === "boolean") {
            // Xử lý trường hợp value là boolean
            return record.status === (value ? 1 : 0);
          } else {
            // Xử lý trường hợp value là Key (đối với trường hợp khi dùng dropdown filter)
            return record.status === value;
          }
        },
      },
      {
        title: <p className="font-semibold font-primary">Thời gian</p>,
        dataIndex: "day",
        key: "day",
        width: 120,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">
            {dayjs(record.keyId.startDate).format("DD/MM/YYYY")} <br />-{" "}
            {dayjs(record.keyId.endDate).format("DD/MM/YYYY")}
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Data limit</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        width: 120,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">
            {record.keyId.dataLimit / 1000 / 1000 / 1000}GB/
            {record.keyId.dataExpand / 1000 / 1000 / 1000}GB
          </p>
        ),
        sorter: {
          compare: (a: GistType, b: GistType) =>
            a.keyId.dataLimit - b.keyId.dataLimit,
          multiple: 1,
        },
      },
      {
        title: <p className="font-semibold font-primary">Data Usage</p>,
        dataIndex: "dataUsage",
        key: "dataUsage",
        width: 150,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">
            {record.keyId.dataUsage
              ? `${(record.keyId.dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB`
              : "0GB"}
          </p>
        ),
        sorter: {
          compare: (a, b) => a.keyId.dataUsage - b.keyId.dataUsage,
          multiple: 2,
        },
      },
      // {
      //   title: (
      //     <p className="font-semibold font-primary text-sm">Date Expand</p>
      //   ),
      //   dataIndex: "endExpandDate",
      //   key: "endExpandDate",
      //   width: 120,
      //   render: (_: string, record: GistType) => (
      //     <p className="text-sm font-primary">
      //       {record.keyId?.endExpandDate &&
      //         DAY_FORMAT(record.keyId.endExpandDate)}
      //     </p>
      //   ),
      // },
      {
        title: <p className="font-semibold font-primary text-sm"></p>,
        dataIndex: "action",
        key: "action",
        // width: 100,
        render: (_: string, record: GistType) =>
          record.status ? (
            <MoveServer
              servers={servers}
              gist={{
                key_id: record.keyId._id,
                key_name: record.keyId.name,
                server_id: record.keyId.serverId as string,
              }}
              handleReloadData={handleFetchData}
            />
          ) : null,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [servers]
  );
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    _current,
    pageSize
  ) => {
    setPage(1);
    setPageSize(pageSize);
  };
  if (!listGist) return null;
  return (
    <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
      <Table
        dataSource={listGist.data}
        // dataSource={listGist.data.map((item, index) => ({ index, ...item }))}
        columns={columns}
        loading={loadingTable}
        scroll={{ x: 1120 }}
        pagination={{
          defaultCurrent: 1,
          total: listGist.totalItems,
          onChange: (index) => setPage(index),
          pageSize,
          onShowSizeChange: onShowSizeChange,
        }}
      />
    </div>
  );
};

export default ListOrder;
