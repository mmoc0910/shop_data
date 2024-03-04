import {
  DatePicker,
  DatePickerProps,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import Heading from "../../components/common/Heading";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { useEffect, useMemo, useState } from "react";
import { CashType } from "../../type";
import { api } from "../../api";
import { toast } from "react-toastify";
import {
  DAY_FORMAT,
  isSameOrAfter,
  isSameOrBefore,
  messages,
} from "../../constants";
import { VND } from "../../utils/formatPrice";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import dayjs from "dayjs";

const CashPage = () => {
  const { _id } = useSelector((state: RootState) => state.auth);
  const [listCash, setListCash] = useState<CashType[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>();
  const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>();
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const listCashFilter =
    startDate && endDate
      ? listCash.filter(
          (item) =>
            isSameOrAfter(item.createdAt, startDate) &&
            isSameOrBefore(item.createdAt, endDate)
        )
      : listCash;
  const fetchData = async () => {
    try {
      const result = await api.get<CashType[]>(`/cashs?userId=${_id}`);
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
        render: (text: number) => (
          <p className="font-primary text-sm">{VND.format(text)}VND</p>
        ),
        sorter: (a, b) => a.money - b.money,
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
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Ngày duyệt</p>
        ),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (text: Date, record: CashType) => (
          <p className="font-primary text-sm">
            {record.status === 1 ? DAY_FORMAT(text) : null}
          </p>
        ),
        sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      },
      {
        title: () => (
          <p className="font-primary text-sm font-semibold">Trạng thái</p>
        ),
        dataIndex: "status",
        key: "status",
        render: (_: number, record: CashType) => (
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
        // filters: [
        //   {
        //     text: "Đã hủy",
        //     value: 0,
        //   },
        //   {
        //     text: "Đã hoàn thành",
        //     value: 1,
        //   },
        //   {
        //     text: "Chờ phê duyệt",
        //     value: 2,
        //   },
        // ],
        // onFilter: (value: number, record: CashType) => record.status === value,
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
  const onChangeStartDate: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setStartDate(date);
  };
  const onChangeEndDate: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
    setEndDate(date);
  };

  return (
    <RequireAuthPage rolePage={2}>
      <div className="space-y-4 md:space-y-6">
        <Heading>Lịch sử nạp</Heading>
        <div className="flex items-center justify-end gap-5">
          <div className="flex items-center gap-5">
            <DatePicker
              onChange={onChangeStartDate}
              className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
              placeholder="Start date"
            />
            <DatePicker
              onChange={onChangeEndDate}
              className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
              placeholder="End date"
            />
          </div>
        </div>
        <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
          <Table
            dataSource={listCashFilter}
            columns={columns}
            scroll={{ x: 1180 }}
          />
        </div>
      </div>
    </RequireAuthPage>
  );
};

export default CashPage;
