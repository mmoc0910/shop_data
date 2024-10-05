import  { useEffect, useMemo, useState } from "react";
import { api } from "../../../api";
import { toast } from "react-toastify";
import { messages } from "../../../constants";
import { Modal, Table, Tag } from "antd";
import { TableColumnsType } from "antd";
import { Link } from "react-router-dom";
import { KeySeverType } from "../../../type";
import dayjs from "dayjs";

export const FullDataToday = () => {
  const [data, setData] = useState<KeySeverType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/satisfy/full-data-today");
        setData(result.data);
      } catch (error) {
        toast.error(messages.error);
      }
    })();
  }, []);
  const columns: TableColumnsType<KeySeverType> = useMemo(
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
          <Link
            to={`/admin/key/${record._id}`}
            target="_blank"
            className="text-sm font-primary text-primary"
          >
            {text}
          </Link>
          //   <UpdateExtensionKey
          //     initialValue={text}
          //     onSubmit={(value: string) => {
          //       handleUpdateExtension(record._id, value);
          //       handleFetchData();
          //     }}
          //     key_id={record._id}
          //   />
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
          <p className="text-gray-500 md:text-lg">Over BandWidth</p>
        </div>
        <p className="font-semibold text-xl md:text-2xl">{data.length}</p>
      </div>
      <Modal
        title={<p className="font-primary">Over BandWidth</p>}
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
