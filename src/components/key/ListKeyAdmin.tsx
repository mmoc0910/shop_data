import { TableColumnsType, Tag } from "antd";
import { Table } from "antd";
import { useEffect, useMemo, useState } from "react";
import { KeySeverType } from "../../type";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { DAY_FORMAT } from "../../constants";
import { api } from "../../api";
import { useWatch } from "react-hook-form";

const DEFAULT_PAGE_SIZE = 10;
export const ListKeyAdmin = () => {
  const searchTerm = useWatch({ name: "searchTerm", exact: true });
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState<number>();
  const [page, setPage] = useState(1);
  const [listKey, setListKey] = useState<KeySeverType[]>([]);
  console.log("searchTerm ~ ", searchTerm);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.get(`/keys`, {
          params: {
            status: 1,
            page,
            name: searchTerm,
          },
        });
        setTotalItems(response.data.totalItems);
        setListKey(response.data.data);
        console.log("response ~ ", response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [page, searchTerm]);
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
        width: 150,
        dataIndex: "name",
        key: "name",
        render: (text: string, record) => (
          <Link
            to={`/admin/key/${record._id}`}
            className="text-sm font-primary text-primary"
          >
            {text}
          </Link>
        ),
      },

      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Account Name</p>
        ),
        width: 150,
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
        width: 150,
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
      {
        title: (
          <p className="font-semibold font-primary text-sm">Date Expand</p>
        ),
        dataIndex: "endExpandDate",
        key: "endExpandDate",
        width: 120,
        render: (_: string, record) => (
          <p className="text-sm font-primary">
            {record?.endExpandDate && DAY_FORMAT(record.endExpandDate)}
          </p>
        ),
      },
    ],
    []
  );
  return (
    <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
      <Table
        dataSource={listKey}
        columns={columns}
        loading={loading}
        scroll={{ y: 420, x: 1120 }}
        pagination={{
          defaultCurrent: 1,
          total: totalItems,
          onChange: (index) => setPage(index),
          pageSize: DEFAULT_PAGE_SIZE,
        }}
      />
    </div>
  );
};
