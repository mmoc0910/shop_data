import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api";
import { toast } from "react-toastify";
import { messages } from "../../../constants";
import { Modal, Table, Tag, Tooltip } from "antd";
import { TableColumnsType } from "antd";
import { Link } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import { AndroidXML } from "../../../pages/user/OrderPage";
import { copyToClipboard } from "../../../utils/copyToClipboard";
import UpdateExtensionKey from "../../key/UpdateExtensionKey";
import { FC } from "react";
import { KeyExpriredTodayType } from "../../../type";

type Props = { title: String; date: Date | Dayjs };
export const KeyExpriredToday: FC<Props> = ({ date, title }) => {
  const [data, setData] = useState<KeyExpriredTodayType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
    try {
      const result = await api.post("/satisfy/expried-key", {
        day: dayjs(date).format("YYYY-MM-DD"),
      });
      setData(result.data);
    } catch (error) {
      toast.error(messages.error);
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
  const columns: TableColumnsType<KeyExpriredTodayType> = useMemo(
    () => [
      {
        title: () => <p className="font-semibold font-primary">STT</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: string) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
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
            to={`/admin/account/${record.user[0]._id}`}
            className="text-sm font-primary text-primary"
          >
            {record.user[0].username}
          </Link>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Server Name</p>
        ),
        dataIndex: "server",
        key: "server",
        render: (_, record) => (
          <p className="text-sm font-primary">{record.server[0].name}</p>
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
      {
        title: <p className="font-semibold font-primary">Key</p>,
        dataIndex: "key",
        key: "key",
        render: (_: string, record) => {
          const { aws, accessUrl, keyId, name, server } = record;
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tooltip title="Copy link chính">
                  <button
                    className="text-white px-2 w-fit aspect-square rounded-md bg-secondary20"
                    onClick={() =>
                      copyToClipboard(
                        `${aws[0].fileName.replace(/https/g, "ssconf")}#${name}`
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
                        `${accessUrl}#${server[0].name}-k${keyId}`
                      )
                    }
                  >
                    <AndroidXML />
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="space-y-2 cursor-pointer" onClick={showModal}>
        <div className="">
          <p className="text-gray-500 md:text-lg">{title}</p>
        </div>
        <p className="font-semibold text-xl md:text-2xl">{data.length}</p>
      </div>
      <Modal
        title={<p className="font-primary">{title}</p>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
        width={"80%"}
      >
        <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
          <Table
            dataSource={data.map((item, index) => ({
              index,
              ...item,
            }))}
            columns={columns}
            pagination={{ hideOnSinglePage: true }}
          />
        </div>
      </Modal>
    </>
  );
};
