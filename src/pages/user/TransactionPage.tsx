import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { TransactionType } from "../../type";
import { api } from "../../api";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import Heading from "../../components/common/Heading";
import { Table } from "antd";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import RequireAuthPage from "../../components/common/RequireAuthPage";

const TransactionPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { _id } = useSelector((state: RootState) => state.auth);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const fetchUserCashHistory = async () => {
    try {
      setLoading(true);
      const result = await api.get<TransactionType[]>(
        `/transactions?userId=${_id}&approve=true`
      );
      setTransactions(result.data);
    } catch (error) {
      toast.error(messages.error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserCashHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const columns = [
    {
      title: <p className="font-primary font-semibold">Tên gói</p>,
      dataIndex: "name",
      key: "name",
      render: (_: string, record: TransactionType) => (
        <p className="font-primary text-sm">
          {record.extendPlanId ? record.extendPlanId.name : record.planId?.name}
        </p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Giá</p>,
      dataIndex: "price",
      key: "price",
      render: (_: string, record: TransactionType) => (
        <p className="font-primary text-sm">{VND.format(record.money)}VND</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Chiết khấu</p>,
      dataIndex: "discount",
      key: "discount",
      render: (_: string, record: TransactionType) => (
        <p className="font-primary text-sm">{record.discount}%</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Ngày tạo</p>,
      dataIndex: "price",
      key: "price",
      render: (text: string) => (
        <p className="font-primary text-sm">
          {dayjs(text).format("DD-MM-YYYY")}
        </p>
      ),
    },
  ];
  return (
    <RequireAuthPage rolePage={2}>
      <div className="space-y-6">
        <Heading>Lịch sử mua</Heading>
        <Table dataSource={transactions} columns={columns} loading={loading} />
      </div>
    </RequireAuthPage>
  );
};

export default TransactionPage;
