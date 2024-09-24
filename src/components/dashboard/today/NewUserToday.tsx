import { useEffect, useMemo, useState } from "react";
import { UserState } from "../../../type";
import { api } from "../../../api";
import { toast } from "react-toastify";
import { messages } from "../../../constants";
import { Modal, Table } from "antd";
import { useTranslation } from "react-i18next";
import { TableColumnsType } from "antd";
import { Link } from "react-router-dom";

export const NewUserToday = () => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<UserState[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/satisfy/new-user-today");
        setData(result.data);
      } catch (error) {
        toast.error(messages.error);
      }
    })();
  }, []);
  const columns: TableColumnsType<UserState> = useMemo(
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
        title: () => <p className="font-semibold font-primary">Người dùng</p>,
        dataIndex: "name",
        key: "name",
        render: (_: string, record) => (
          <Link
            to={`/admin/account/${record._id}`}
            className="text-sm font-primary text-primary font-medium"
          >
            {record.username}
          </Link>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Email</p>,
        dataIndex: "name",
        key: "name",
        render: (_: string, record) => (
          <p className="text-sm font-primary">{record.email}</p>
        ),
      },
    ],
    [i18n.language]
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
          <p className="text-gray-500 md:text-lg">New User Today</p>
        </div>
        <p className="font-semibold text-xl md:text-2xl">{data.length}</p>
      </div>
      <Modal
        title={<p className="font-primary">New User Today</p>}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
        width={"50%"}
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
