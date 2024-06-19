import { DatePicker, DatePickerProps, Table, TableColumnsType } from "antd";
import Heading from "../common/Heading";
import { useEffect, useMemo, useState } from "react";
import { UserState } from "../../type";
import { api } from "../../api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useFormatPrice } from "../../hooks/useFormatPrice";

type DataType = {
  _id: string;
  totalMoney: number;
  user: [UserState];
};
const TopUserByMonth = () => {
  const priceFomat = useFormatPrice();
  const { i18n } = useTranslation();
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.post("/satisfy/get-top-user-by-month", {
          month: `${dayjs(date).get("year")}-${dayjs(date).get("months") + 1}`,
        });
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [date]);
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
      {
        title: () => (
          <p className="font-semibold font-primary">Số điện thoại</p>
        ),
        dataIndex: "name",
        key: "name",
        render: (_: string, record: DataType) => (
          <p className="text-sm font-primary">{record.user[0].phone}</p>
        ),
      },
      {
        title: () => <p className="font-semibold font-primary">Tổng nạp</p>,
        dataIndex: "totalMoney",
        key: "totalMoney",
        render: (text: number) => (
          <p className="text-sm font-primary">
            {priceFomat(text)}
          </p>
        ),
      },
    ],
    [i18n.language]
  );
  const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
    setDate(date);
  };
  return (
    <div className="space-y-5">
      <Heading className="flex items-center gap-5">
        <p>Top người dùng theo tháng</p>
        <DatePicker
          value={date}
          onChange={onChangeStartDate}
          className="!focus:border-primary text-black font-medium placeholder:text-base placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid bg-inherit peer outline-none border-strock"
          placeholder="Select month"
          picker="month"
        />
      </Heading>
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

export default TopUserByMonth;
