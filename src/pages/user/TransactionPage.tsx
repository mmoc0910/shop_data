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
import RequireAuthPage from "../../components/common/RequireAuthPage";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useFormatPrice } from "../../hooks/useFormatPrice";

const TransactionPage = () => {
  const priceFomat = useFormatPrice();
  const { t, i18n } = useTranslation();
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
        title: () => <p className="text-base font-semibold font-primary"></p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: () => (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.code")}
          </p>
        ),
        dataIndex: "code",
        key: "code",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.package")}
          </p>
        ),
        dataIndex: "name",
        key: "name",
        render: (_: string, record: TransactionType) => (
          <p className="text-sm font-primary">
            {record.extendPlanId
              ? record.extendPlanId.name
              : record.planId?.name}
          </p>
        ),
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.pricePackage")}
          </p>
        ),
        dataIndex: "price",
        key: "price",
        render: (_: string, record: TransactionType) => (
          <p className="text-sm font-primary">
            {priceFomat(
              record.money / ((100 - record.discount) / 100)
            )}
          </p>
        ),
        sorter: {
          compare: (a, b) =>
            a.money / ((100 - a.discount) / 100) -
            b.money / ((100 - b.discount) / 100),
          multiple: 3,
        },
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.discount")}
          </p>
        ),
        dataIndex: "discount",
        key: "discount",
        render: (_: string, record: TransactionType) => (
          <p className="text-sm font-primary">{record.discount}%</p>
        ),
        sorter: {
          compare: (a, b) => a.discount - b.discount,
          multiple: 2,
        },
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.disCountPrice")}
          </p>
        ),
        dataIndex: "money",
        key: "money",
        render: (_: string, record: TransactionType) => (
          <p className="text-sm font-primary">
            {priceFomat(record.money)}
          </p>
        ),
        sorter: {
          compare: (a, b) => a.money - b.money,
          multiple: 1,
        },
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.createdAt")}
          </p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };

  const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
    setStartDate(date);
  };
  const onChangeEndDate: DatePickerProps["onChange"] = (date) => {
    setEndDate(date);
  };
  return (
    <RequireAuthPage rolePage={[2]}>
      <div className="space-y-6">
        <Heading>{t("page.transaction.heading")}</Heading>
        <p className="text-base font-semibold">
          {t("page.transaction.total")}:{" "}
          <span className="text-lg">
            {priceFomat(
              transactions
                .map((item) => item.money)
                .reduce((prev, cur) => (prev += cur), 0)
            )}
          </span>
        </p>
        <div className="items-center block gap-5 space-y-3 md:flex md:space-y-0">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              className="focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
              placeholder={t("page.searchPlaceholder")}
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
            dataSource={listTransactions.map((item, index) => ({
              index,
              ...item,
            }))}
            columns={columns}
            loading={loading}
            scroll={{ x: 1180 }}
          />
        </div>
      </div>
    </RequireAuthPage>
  );
};

export default TransactionPage;
