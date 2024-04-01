import {
  DatePicker,
  DatePickerProps,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import Heading from "../../components/common/Heading";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Key, useEffect, useMemo, useState } from "react";
import { CashType, CoutryType } from "../../type";
import { api } from "../../api";
import { toast } from "react-toastify";
import {
  DAY_FORMAT,
  isSameOrAfter,
  isSameOrBefore,
  messages,
} from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import dayjs from "dayjs";
import RechargePage from "./RechargePage";
import { useTranslation } from "react-i18next";
import { priceFomat } from "../../utils/formatPrice";

const CashPage = () => {
  const { i18n, t } = useTranslation();
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
      setListCash(result.data);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const columns: TableColumnsType<CashType> = useMemo(
    () => [
      {
        title: () => <p className="font-semibold font-primary"></p>,
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
            {t("page.cash.history.field.code")}
          </p>
        ),
        dataIndex: "code",
        key: "code",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.cash.history.field.transactionType")}
          </p>
        ),
        dataIndex: "type",
        key: "type",
        render: (text: number) => (
          <p className="text-sm font-primary">
            {text === 0 ? (
              <Tag color="blue">{i18n.language === 'ci' ? "自动银行支付" : "Auto Banking"}</Tag>
            ) : (
              <Tag color="pink-inverse">{i18n.language === 'ci' ? "手动" : "Manual Banking"}</Tag>
            )}
          </p>
        ),
        filters: [
          {
            text: i18n.language === 'ci' ? "自动银行支付" : "Auto Banking",
            value: 0,
          },
          {
            text: i18n.language === 'ci' ? "手动" : "Manual Banking",
            value: 1,
          },
        ],
        onFilter: (value: boolean | Key, record: CashType) => {
          if (typeof value === "boolean") {
            // Xử lý trường hợp value là boolean
            return record.type === (value ? 1 : 0);
          } else {
            // Xử lý trường hợp value là Key (đối với trường hợp khi dùng dropdown filter)
            return record.type === value;
          }
        },
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.cash.history.field.username")}
          </p>
        ),
        dataIndex: "username",
        key: "username",
        render: (_: string, record: CashType) => (
          <p className="text-sm font-primary">{record.userId?.username}</p>
        ),
      },
      // {
      //   title: () => (
      //     <p className="text-sm font-semibold font-primary">{t("page.cash.history.field.email")}</p>
      //   ),
      //   dataIndex: "email",
      //   key: "email",
      //   render: (_: string, record: CashType) => (
      //     <p className="text-sm font-primary">{record.userId.email}</p>
      //   ),
      // },
      // {
      //   title: () => (
      //     <p className="text-sm font-semibold font-primary">{t("page.cash.history.field.phone")}</p>
      //   ),
      //   dataIndex: "phone",
      //   key: "phone",
      //   render: (_: string, record: CashType) => (
      //     <p className="text-sm font-primary">{record.userId.phone}</p>
      //   ),
      // },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.cash.history.field.money")}
          </p>
        ),
        dataIndex: "money",
        key: "money",
        render: (text: number) => (
          <p className="text-sm font-primary">
            {priceFomat(text, i18n.language as CoutryType)}
          </p>
        ),
        sorter: (a, b) => a.money - b.money,
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.cash.history.field.created_at")}
          </p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.cash.history.field.updated_at")}
          </p>
        ),
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (text: Date, record: CashType) => (
          <p className="text-sm font-primary">
            {record.status !== 2 ? DAY_FORMAT(text) : null}
          </p>
        ),
        sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.cash.history.field.status")}
          </p>
        ),
        dataIndex: "status",
        key: "status",
        render: (_: number, record: CashType) => (
          <div className="text-sm font-primary">
            {record.status === 0 ? (
              <Tag color="red">
                <span className="font-primary">
                  {t("page.cash.history.status.reject")}
                </span>
              </Tag>
            ) : null}
            {record.status === 1 ? (
              <Tag color="green">
                <span className="font-primary">
                  {t("page.cash.history.status.pending")}
                </span>
              </Tag>
            ) : null}
            {record.status === 2 ? (
              <Tag color="lime">
                <span className="font-primary">
                  {t("page.cash.history.status.approve")}
                </span>
              </Tag>
            ) : null}
          </div>
        ),
        filters: [
          {
            text: t("page.cash.history.status.reject"),
            value: 0,
          },
          {
            text: t("page.cash.history.status.approve"),
            value: 1,
          },
          {
            text: t("page.cash.history.status.pending"),
            value: 2,
          },
        ],
        onFilter: (value: boolean | Key, record: CashType) => {
          if (typeof value === "boolean") {
            // Xử lý trường hợp value là boolean
            return record.status === (value ? 1 : 0);
          } else {
            // Xử lý trường hợp value là Key (đối với trường hợp khi dùng dropdown filter)
            return record.status === value;
          }
        },
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.cash.history.field.content")}
          </p>
        ),
        dataIndex: "content",
        key: "content",
        render: (text?: string) => (
          <p className="text-sm font-primary text-primary">{text || ""}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">
            {t("page.cash.history.field.description")}
          </p>
        ),
        dataIndex: "description",
        key: "description",
        render: (text: string) => (
          <p className="text-sm font-primary text-error">{text}</p>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
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
      <RechargePage />
      <div className="mt-10 space-y-4 md:space-y-6">
        <Heading>
          {t("page.cash.history.heading")}{" "}
          {priceFomat(
            listCash
              .filter((item) => item.status === 1)
              .map((item) => item.money)
              .reduce((prev, cur) => (prev += cur), 0),
            i18n.language as CoutryType
          )}
        </Heading>
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
            dataSource={listCashFilter.map((item, index) => ({
              index,
              ...item,
            }))}
            columns={columns}
            scroll={{ x: 1300 }}
          />
        </div>
      </div>
    </RequireAuthPage>
  );
};

export default CashPage;
