import { Table, TableColumnsType, Tag } from "antd";
import Heading from "../../components/common/Heading";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { useEffect, useMemo, useState } from "react";
import { CashType } from "../../type";
import { api } from "../../api";
import { toast } from "react-toastify";
import { DAY_FORMAT, messages } from "../../constants";
import { VND } from "../../utils/formatPrice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";

const CashPage = () => {
  const { _id } = useSelector((state: RootState) => state.auth);
  const [listCash, setListCash] = useState<CashType[]>([]);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const fetchData = async () => {
    try {
      const result = await api.get<CashType[]>(`/cashs?userId=${_id}`);
      console.log(
        "result data - ",
        result.data.filter((item) => item.status !== 2)
      );
      setListCash(result.data.filter((item) => item.status !== 2));
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const columns: TableColumnsType<CashType> = useMemo(
    () => [
      {
        title: () => (
          <p className="font-primary text-base font-semibold">STT</p>
        ),
        dataIndex: "index",
        width: 70,
        render: (_text: string, _record: CashType, index: number) => (
          <p className="font-primary text-sm">{index + 1}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Username</p>
        ),
        dataIndex: "username",
        key: "username",
        render: (_: string, record: CashType) => (
          <p className="font-primary text-sm">{record.userId?.username}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Email</p>
        ),
        dataIndex: "email",
        key: "email",
        render: (_: string, record: CashType) => (
          <p className="font-primary text-sm">{record.userId.email}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Số điện thoại</p>
        ),
        dataIndex: "phone",
        key: "phone",
        render: (_: string, record: CashType) => (
          <p className="font-primary text-sm">{record.userId.phone}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Số tiền nạp</p>
        ),
        dataIndex: "money",
        key: "money",
        render: (_: string, record: CashType) => (
          <p className="font-primary text-sm">{VND.format(record.money)}VND</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Ngày nạp</p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="font-primary text-sm">{DAY_FORMAT(text)}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Ngày duyệt</p>
        ),
        dataIndex: "updated",
        key: "updated",
        render: (text: Date, record: CashType) => (
          <p className="font-primary text-sm">
            {record.status === 1 ? DAY_FORMAT(text) : null}
          </p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Trạng thái</p>
        ),
        dataIndex: "status",
        key: "status",
        render: (_: string, record: CashType) => (
          <div className="font-primary text-sm">
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
          <p className="font-primary text-sm font-semibold">Lý do hủy</p>
        ),
        dataIndex: "description",
        key: "description",
        render: (text: string) => (
          <p className="font-primary text-sm text-error">{text}</p>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <RequireAuthPage rolePage={2}>
      <div className="space-y-6">
        <Heading>Lịch sử nạp</Heading>
        <Table
          dataSource={listCash}
          columns={columns}
          //   scroll={{ x: 1500, y: 450 }}
        />
      </div>
    </RequireAuthPage>
  );
};

export default CashPage;
