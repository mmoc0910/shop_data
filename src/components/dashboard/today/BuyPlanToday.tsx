import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api";
import { toast } from "react-toastify";
import { DAY_FORMAT, messages } from "../../../constants";
import { Modal, Table } from "antd";
import { TableColumnsType } from "antd";
import { Link } from "react-router-dom";
import { useFormatPrice } from "../../../hooks/useFormatPrice";
import { BuyPlanTodayType } from "../../../type";

export const BuyPlanToday = () => {
  const priceFomat = useFormatPrice();
  const [data, setData] = useState<BuyPlanTodayType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/satisfy/buy-plan-today");
        setData(result.data);
      } catch (error) {
        toast.error(messages.error);
      }
    })();
  }, []);
  const columns: TableColumnsType<BuyPlanTodayType> = useMemo(
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
          <p className="text-sm font-semibold font-primary">Tên gói</p>
        ),
        dataIndex: "name",
        key: "name",
        render: (_text: string, record) => (
          <p className="text-sm font-primary">
            {record.extendPlan.length > 0
              ? record.extendPlan[0].name
              : record.plan[0].name}
          </p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Dung lượng</p>
        ),
        dataIndex: "bandWidth",
        key: "bandWidth",
        render: (_text: string, record) => (
          <p className="text-sm font-primary">
            {record.plan[0].bandWidth}GB / {record.plan[0].day} ngày
          </p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Username</p>
        ),
        dataIndex: "username",
        key: "username",
        render: (_text: string, record) => (
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
          <p className="text-sm font-semibold font-primary">Mô tả</p>
        ),
        dataIndex: "description",
        key: "description",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Triết khấu</p>
        ),
        dataIndex: "discount",
        key: "discount",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}%</p>
        ),
      },
      {
        title: () => <p className="text-sm font-semibold font-primary">Giá</p>,
        dataIndex: "money",
        key: "money",
        render: (_text: string, record) => (
          <p className="text-sm font-primary">
            {priceFomat(record.money * ((100 - record.discount) / 100))}
          </p>
        ),
      },

      {
        title: <p className="font-semibold font-primary">Ngày mua</p>,
        dataIndex: "day",
        key: "day",
        width: 120,
        render: (_: string, record) => (
          <p className="text-sm font-primary">{DAY_FORMAT(record.createdAt)}</p>
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
          <p className="text-gray-500 md:text-lg">Buy Plan Today</p>
        </div>
        <p className="font-semibold text-xl md:text-2xl">{data.length}</p>
      </div>
      <Modal
        title={<p className="font-primary">Buy Plan Today</p>}
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
