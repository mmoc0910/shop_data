import  { useEffect, useMemo, useState } from "react";
import { api } from "../../../api";
import { toast } from "react-toastify";
import { DAY_FORMAT, messages } from "../../../constants";
import { Modal, Table, Tag } from "antd";
import { useTranslation } from "react-i18next";
import { TableColumnsType } from "antd";
import { Link } from "react-router-dom";
import { NewCashType } from "../../../type";
import { useFormatPrice } from "../../../hooks/useFormatPrice";

export const NewCashToday = () => {
  const priceFomat = useFormatPrice();
  const { i18n } = useTranslation();
  const [data, setData] = useState<NewCashType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/satisfy/new-cash-today");
        setData(result.data);
      } catch (error) {
        toast.error(messages.error);
      }
    })();
  }, []);
  const columns: TableColumnsType<NewCashType> = useMemo(
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
        title: <p className="font-semibold font-primary">Mã giao dịch</p>,
        dataIndex: "code",
        key: "code",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Loại giao dịch</p>,
        dataIndex: "type",
        key: "type",
        render: (text: number) => (
          <p className="text-sm font-primary">
            {text === 0 ? (
              <Tag color="blue">Auto Banking</Tag>
            ) : (
              <Tag color="pink-inverse">Manual Banking</Tag>
            )}
          </p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Username</p>
        ),
        dataIndex: "username",
        key: "username",
        render: (_: string, record) => (
          <Link
            to={`/admin/account/${record.user[0]._id}`}
            className="text-sm font-medium font-primary text-primary"
          >
            {record.user[0].username}
          </Link>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Số tiền nạp</p>
        ),
        dataIndex: "money",
        key: "money",
        render: (_: string, record) => (
          <p className="text-sm font-primary">{priceFomat(record.money)}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Ngày nạp</p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Ngày duyệt</p>
        ),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (text: Date, record) => (
          <p className="text-sm font-primary">
            {record.status !== 2 ? DAY_FORMAT(text) : null}
          </p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Trạng thái</p>
        ),
        dataIndex: "status",
        key: "status",
        render: (_: string, record) => (
          <div className="text-sm font-primary">
            {record.status === 0 ? (
              <Tag color="red">
                <span className="font-primary">Đã hủy</span>
              </Tag>
            ) : null}
            {record.status === 1 ? (
              <Tag color="green">
                <span className="font-primary">Đã thanh toán</span>
              </Tag>
            ) : null}
            {record.status === 2 ? (
              <Tag color="lime">
                <span className="font-primary">Chờ phê duyệt</span>
              </Tag>
            ) : null}
          </div>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            Nội dung chuyển khoản
          </p>
        ),
        dataIndex: "content",
        key: "content",
        render: (text?: string) => (
          <p className="text-sm font-primary text-primary">{text || ""}</p>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <p className="text-gray-500 md:text-lg">New Cash Today</p>
        </div>
        <p className="font-semibold text-xl md:text-2xl">
          {priceFomat(data.reduce((prev, cur) => (prev += cur.money), 0))}
        </p>
      </div>
      <Modal
        title={<p className="font-primary">New Cash Today</p>}
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
