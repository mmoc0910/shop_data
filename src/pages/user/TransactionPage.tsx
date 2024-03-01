import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { TransactionType } from "../../type";
import { api } from "../../api";
import { toast } from "react-toastify";
import {
  DAY_FORMAT,
  isSameOrAfter,
  isSameOrBefore,
  messages,
} from "../../constants";
import Heading from "../../components/common/Heading";
import { DatePicker, DatePickerProps, Table, TableColumnsType } from "antd";
import { VND } from "../../utils/formatPrice";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { debounce } from "lodash";
import dayjs from "dayjs";

const TransactionPage = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { _id } = useSelector((state: RootState) => state.auth);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>();
  const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>();
  const listTransactions =
    startDate && endDate && !inputValue
      ? transactions.filter(
          (item) =>
            isSameOrAfter(item.createdAt, startDate) &&
            isSameOrBefore(item.createdAt, endDate)
        )
      : startDate && endDate && inputValue
      ? transactions.filter(
          (item) =>
            ((item?.planId &&
              item.planId.name
                .toLowerCase()
                .includes(inputValue.toLowerCase())) ||
              (item?.extendPlanId &&
                item.extendPlanId?.name
                  .toLocaleLowerCase()
                  .includes(inputValue.toLowerCase()))) &&
            isSameOrAfter(item.createdAt, startDate) &&
            isSameOrBefore(item.createdAt, endDate)
        )
      : inputValue
      ? transactions.filter((item) =>
          item?.planId
            ? item.planId.name.toLowerCase().includes(inputValue.toLowerCase())
            : item.extendPlanId?.name
                .toLocaleLowerCase()
                .includes(inputValue.toLowerCase())
        )
      : transactions;
  console.log("list trấnction - ", listTransactions);
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
  const columns: TableColumnsType<TransactionType> = useMemo(
    () => [
      {
        title: () => (
          <p className="font-primary text-base font-semibold">STT</p>
        ),
        dataIndex: "index",
        render: (_text: string, _record: TransactionType, index: number) => (
          <p className="font-primary text-sm">{index + 1}</p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Tên gói</p>,
        dataIndex: "name",
        key: "name",
        render: (_: string, record: TransactionType) => (
          <p className="font-primary text-sm">
            {record.extendPlanId
              ? record.extendPlanId.name
              : record.planId?.name}
          </p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Giá gói</p>,
        dataIndex: "price",
        key: "price",
        render: (_: string, record: TransactionType) => (
          <p className="font-primary text-sm">{VND.format(record.money)}VND</p>
        ),
        sorter: {
          compare: (a, b) => a.money - b.money,
          multiple: 3,
        },
      },
      {
        title: <p className="font-primary font-semibold">Chiết khấu</p>,
        dataIndex: "discount",
        key: "discount",
        render: (_: string, record: TransactionType) => (
          <p className="font-primary text-sm">{record.discount}%</p>
        ),
        sorter: {
          compare: (a, b) => a.discount - b.discount,
          multiple: 2,
        },
      },
      {
        title: <p className="font-primary font-semibold">Giá mua</p>,
        dataIndex: "priceDiscount",
        key: "priceDiscount",
        render: (_: string, record: TransactionType) => (
          <p className="font-primary text-sm">
            {VND.format(record.money * ((100 - record.discount) / 100))}VND
          </p>
        ),
        sorter: {
          compare: (a, b) =>
            a.money * ((100 - a.discount) / 100) -
            b.money * ((100 - b.discount) / 100),
          multiple: 1,
        },
      },
      {
        title: <p className="font-primary font-semibold">Ngày tạo</p>,
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="font-primary text-sm">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
    ],
    []
  );

  const handleInputChange = debounce((value: string) => {
    console.log(value); // Xử lý giá trị input ở đây
  }, 1000);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    handleInputChange(value);
  };

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
      <div className="space-y-6">
        <Heading>Lịch sử mua</Heading>
        <p className="text-base font-semibold">
          Tổng mua:{" "}
          <span className="text-lg">
            {VND.format(
              transactions
                .map((item) => item.money)
                .reduce((prev, cur) => (prev += cur), 0)
            )}
            VND
          </span>
        </p>
        <div className="flex items-center gap-5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              className="focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
              placeholder="Tìm kiếm"
            />
            {inputValue.length > 0 ? (
              <span
                className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
                onClick={() => setInputValue("")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-icon-color"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            ) : null}
          </div>
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
            dataSource={listTransactions}
            columns={columns}
            loading={loading}
          />
        </div>
      </div>
    </RequireAuthPage>
  );
};

export default TransactionPage;
