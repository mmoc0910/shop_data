/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import Heading from "../../components/common/Heading";
import { CashType } from "../../type";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { api } from "../../api";
import { Table, Tag } from "antd";
import { VND } from "../../utils/formatPrice";

const CashAdminPage = () => {
  const [listCash, setListCash] = useState<CashType[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const result = await api.get<CashType[]>("/cashs");
      setListCash(result.data);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const handleApproveCash = async (_id: string) => {
    try {
      await api.get(`/cashs/approve/${_id}`);
      fetchData();
      toast.success("Thành công");
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const columns = useMemo(
    () => [
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Email</p>
        ),
        dataIndex: "email",
        key: "email",
        render: (_: string, record: CashType) => (
          <p className="font-primary text-sm">{record.userId.email}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Số điện thoại</p>
        ),
        dataIndex: "phone",
        key: "phone",
        render: (_: string, record: CashType) => (
          <p className="font-primary text-sm">{record.userId.phone}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Số tiền nạp</p>
        ),
        dataIndex: "money",
        key: "money",
        render: (_: string, record: CashType) => (
          <p className="font-primary text-sm">{VND.format(record.money)}VND</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Trạng thái</p>
        ),
        dataIndex: "approve",
        key: "approve",
        render: (_: string, record: CashType) => (
          <div className="font-primary text-sm">
            {record.approve ? (
              <Tag color="green">
                <span className="font-primary">Hoàn thành</span>
              </Tag>
            ) : (
              <Tag color="red">
                <span className="font-primary">Chưa hoàn thành</span>
              </Tag>
            )}
          </div>
        ),
      },
      {
        title: "",
        dataIndex: "action",
        key: "action",
        render: (_: string, record: CashType) => (
          <p className="font-primary text-sm">
            {record.approve ? null : (
              <button
                className="px-4 py-2 rounded-lg bg-primary font-medium text-white"
                onClick={() => handleApproveCash(record._id)}
              >
                Approve
              </button>
            )}
          </p>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <div className="space-y-6">
      <Heading>Danh sách yêu cầu nạp</Heading>
      <Table dataSource={listCash} columns={columns} />
    </div>
  );
};

export default CashAdminPage;
