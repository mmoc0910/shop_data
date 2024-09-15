import { Table, TableColumnsType } from "antd";
import Heading from "../common/Heading";
import { useEffect, useMemo, useState } from "react";
import { UserState } from "../../type";
import { api } from "../../api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormatPrice } from "../../hooks/useFormatPrice";

type DataType = {
  _id: string;
  totalMoney: number;
  user: [UserState];
};
const TopUserRegister = () => {
  const priceFomat = useFormatPrice();
  const { i18n } = useTranslation();
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get("/satisfy/new-user-today");
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  const columns: TableColumnsType<DataType> = useMemo(
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
        render: (_: string, record: DataType) => (
          <Link
            to={`/admin/account/${record.user[0]._id}`}
            className="text-sm font-primary text-primary font-medium"
          >
            {record.user[0].username}
          </Link>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Email</p>,
        dataIndex: "name",
        key: "name",
        render: (_: string, record: DataType) => (
          <p className="text-sm font-primary">{record.user[0].email}</p>
        ),
      },
      // {
      //   title: () => (
      //     <p className="font-semibold font-primary">Số điện thoại</p>
      //   ),
      //   dataIndex: "name",
      //   key: "name",
      //   render: (_: string, record: DataType) => (
      //     <p className="text-sm font-primary">{record.user[0].phone}</p>
      //   ),
      // },
      {
        title: () => <p className="font-semibold font-primary">Tổng nạp</p>,
        dataIndex: "totalMoney",
        key: "totalMoney",
        render: (text: number) => (
          <p className="text-sm font-primary">{priceFomat(text)}</p>
        ),
      },
    ],
    [i18n.language]
  );
  return (
    <div className="space-y-5">
      <Heading>Người dùng mới</Heading>
      <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
        <Table
          dataSource={data.map((item, index) => ({
            index,
            ...item,
          }))}
          columns={columns}
          pagination={{ pageSize: 5 }}
          scroll={{ x: 770 }}
        />
      </div>
    </div>
  );
};

export default TopUserRegister;
