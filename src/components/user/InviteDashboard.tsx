import { Table } from "antd";
import { RoseType } from "../../type";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { useEffect, useState } from "react";
import { api } from "../../api";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import Heading from "../common/Heading";

const InviteDashboard = () => {
  const { _id } = useSelector((state: RootState) => state.auth);
  const [roseHistory, setRoseHistory] = useState<RoseType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<RoseType[]>(`/roses?reciveRoseId=${_id}`);
        setRoseHistory(result.data);
      } catch (error) {
        console.log("error - ", error);
        toast.error(messages.error);
      }
    })();
  }, [_id]);
  const columns = [
    {
      title: <p className="font-primary font-semibold">Tên gói</p>,
      dataIndex: "namePlan",
      key: "namePlan",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">{record.plan}</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">% hoa hồng</p>,
      dataIndex: "percent",
      key: "percent",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">{record.percent}%</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Tiền hoa hồng</p>,
      dataIndex: "moneyPercent",
      key: "moneyPercent",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">{VND.format(record.recive)}VND</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Người mua</p>,
      dataIndex: "moneyPercent",
      key: "moneyPercent",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">{record.reciveRoseId.email}</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Ngày nhận</p>,
      dataIndex: "moneyPercent",
      key: "moneyPercent",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">
          {dayjs(record.createdAt).format("DD-MM-YYYY")}
        </p>
      ),
    },
  ];
  if (roseHistory.length > 0)
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Heading>Bạn bè được giới thiệu</Heading>
          <button className="text-primary font-medium underline decoration-primary">
            Xem tất cả
          </button>
        </div>
        <Table dataSource={roseHistory} columns={columns} />
      </div>
    );
  return;
};

export default InviteDashboard;
