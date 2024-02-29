/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import Heading from "../../components/common/Heading";
import { CashType } from "../../type";
import { toast } from "react-toastify";
import { DAY_FORMAT, messages } from "../../constants";
import { api } from "../../api";
import { Table, TableColumnsType, Tag } from "antd";
import { VND } from "../../utils/formatPrice";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import Swal from "sweetalert2";
import axios from "axios";

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
  const handleApproveCash = async (cash: CashType) => {
    const {
      _id,
      userId: { username, email },
      money,
    } = cash;
    try {
      const { isConfirmed } = await Swal.fire({
        title: `Bạn có muốn nạp cho người dùng ${
          username || email
        } số tiền ${VND.format(money)}VND`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.get(`/cashs/approve/${_id}`);
        fetchData();
        toast.success("Thành công");
      }
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const handleCancelCash = async (cash: CashType) => {
    const {
      _id,
      userId: { username, email },
      money,
    } = cash;
    try {
      const { isConfirmed } = await Swal.fire({
        title: `Bạn từ chối nạp cho người dùng ${
          username || email
        } số tiền ${VND.format(money)}VND`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        const { value } = await Swal.fire({
          title: "Lý do từ chối",
          input: "text",
          showCancelButton: true,
          cancelButtonText: "Thoát",
          confirmButtonText: "Đồng ý",
          inputValidator: (value: string) => {
            if (!value) {
              return "You need to write something!";
            }
          },
        });
        if (value) {
          try {
            const { isConfirmed } = await Swal.fire(
              `Bạn từ chối nạp cho ${username} số tiền ${VND.format(
                money
              )}NVD với lý do ${value}`
            );
            if (isConfirmed) {
              await api.post(`/cashs/reject/${_id}`, { description: value });
              fetchData();
              toast.success("Thành công");
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.log("error message: ", error);
              toast.error(error.response?.data.message);
            } else {
              console.log("unexpected error: ", error);
              return "An unexpected error occurred";
            }
          }
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
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
      {
        title: "",
        dataIndex: "action",
        key: "action",
        fixed: "right",
        width: 200,
        render: (_: string, record: CashType) => (
          <div className="font-primary text-xs flex gap-2">
            {record.status !== 2 ? null : (
              <>
                <button
                  className="px-4 py-2 rounded-lg bg-primary font-medium text-white"
                  onClick={() => handleApproveCash(record)}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-error font-medium text-white"
                  onClick={() => handleCancelCash(record)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  console.log("list cash - ", listCash);
  return (
    <RequireAuthPage rolePage={1}>
      <div className="space-y-6">
        <Heading>Danh sách yêu cầu nạp</Heading>
        <Table
          dataSource={listCash}
          columns={columns}
          scroll={{ x: 1500, y: 450 }}
        />
      </div>
    </RequireAuthPage>
  );
};

export default CashAdminPage;
