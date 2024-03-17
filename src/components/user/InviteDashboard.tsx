import { Table, TableColumnsType } from "antd";
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
import { Link } from "react-router-dom";

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
  const columns: TableColumnsType<RoseType> = [
    {
      title: () => <p className="text-base font-semibold font-primary">STT</p>,
      dataIndex: "index",
      key: "index",
      render: (text: number) => (
        <p className="text-sm font-primary">{text + 1}</p>
      ),
    },
    {
      title: <p className="font-semibold font-primary">Tên gói</p>,
      dataIndex: "namePlan",
      key: "namePlan",
      render: (_: string, record: RoseType) => (
        <p className="text-sm font-primary">{record.plan}</p>
      ),
    },
    {
      title: <p className="font-semibold font-primary">% hoa hồng</p>,
      dataIndex: "percent",
      key: "percent",
      render: (_: string, record: RoseType) => (
        <p className="text-sm font-primary">{record.percent}%</p>
      ),
    },
    {
      title: <p className="font-semibold font-primary">Tiền hoa hồng</p>,
      dataIndex: "moneyPercent",
      key: "moneyPercent",
      render: (_: string, record: RoseType) => (
        <p className="text-sm font-primary">{VND.format(record.recive)}VND</p>
      ),
    },
    {
      title: <p className="font-semibold font-primary">Người mua</p>,
      dataIndex: "name",
      key: "name",
      render: (_: string, record: RoseType) => (
        <p className="text-sm font-primary">{record.introducedId.username}</p>
      ),
    },
    {
      title: <p className="font-semibold font-primary">SDT</p>,
      dataIndex: "phone",
      key: "phone",
      render: (_: string, record: RoseType) => (
        <p className="text-sm font-primary">{record.introducedId.phone}</p>
      ),
    },
    {
      title: <p className="font-semibold font-primary">Ngày nhận</p>,
      dataIndex: "moneyPercent",
      key: "moneyPercent",
      render: (_: string, record: RoseType) => (
        <p className="text-sm font-primary">
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
          {roseHistory.length > 5 ? (
            <Link
              to={"/user/invite"}
              className="font-medium underline text-primary decoration-primary"
            >
              Xem tất cả
            </Link>
          ) : null}
        </div>
        <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
          <Table
            dataSource={roseHistory
              .slice(0, 5)
              .map((item, index) => ({ index, ...item }))}
            columns={columns}
            pagination={false}
            scroll={{ x: 700 }}
          />
        </div>
      </div>
    );
  return;
};

export default InviteDashboard;
