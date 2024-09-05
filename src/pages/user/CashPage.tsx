import {
  DatePicker,
  DatePickerProps,
  Modal,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import Heading from "../../components/common/Heading";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { CashType} from "../../type";
import { api } from "../../api";
import { toast } from "react-toastify";
import {
  ACCOUNT_NO,
  BANK_ID,
  DAY_FORMAT,
  TEMPLATE,
  isSameOrAfter,
  isSameOrBefore,
  messages,
} from "../../constants";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import dayjs from "dayjs";
import RechargePage from "./RechargePage";
import { useTranslation } from "react-i18next";
import Loading from "../../components/common/Loading";
import { useFormatPrice } from "../../hooks/useFormatPrice";

const CashPage = () => {
  const priceFomat = useFormatPrice();
  const { i18n, t } = useTranslation();
  const { _id } = useSelector((state: RootState) => state.auth);
  const [listCash, setListCash] = useState<CashType[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>();
  const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>();
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      listCash.forEach((item) => {
        const currentTime = new Date().getTime(); // Thời gian hiện tại (timestamp)
        const createdAtTime = new Date(item.createdAt).getTime(); // Thời gian tạo (timestamp)
        const tenMinutesInMilliseconds = 10 * 60 * 1000; // 10 phút tính bằng mili giây
        // console.log(
        //   `${item.code} - `,
        //   currentTime - createdAtTime > tenMinutesInMilliseconds
        // );
        if (
          item.status === 2 &&
          item.type === 0 &&
          currentTime - createdAtTime > tenMinutesInMilliseconds
        )
          handleCheckCash(item);
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCash]);
  const handleCheckCash = async (cash: CashType) => {
    try {
      console.log("abc");
      const result = await api.get<{
        data: {
          "Mã GD": number;
          "Mô tả": string;
          "Giá trị": number;
          "Ngày diễn ra": Date;
          "Số tài khoản": string;
        }[];
      }>(
        "https://script.google.com/macros/s/AKfycby4nlJ_Q-Ppsf6V72FIZ5a7gM-HE8ZryCXiRRLHFZnnB94TX_FXJIWjMpeCNtvMdaz-_Q/exec"
      );
      console.log("data - ", result.data.data);
      if (
        result.data.data.some(
          (item) =>
            cash.content &&
            item["Giá trị"] >= cash.money &&
            (item["Mô tả"].includes(cash.content) ||
              item["Mô tả"].toLowerCase().includes(cash.content.toLowerCase()))
        )
      ) {
        await api.get(`/cashs/approve/${cash._id}`);
        fetchData();
      } else {
        await api.post(`/cashs/reject/${cash._id}`, {
          description: "We can not find out your payment. Please contact Admin",
        });
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const listCashFilter =
    startDate && endDate
      ? listCash.filter(
          (item) =>
            isSameOrAfter(item.createdAt, startDate) &&
            isSameOrBefore(item.createdAt, endDate)
        )
      : listCash;
  const fetchData = useCallback(async () => {
    try {
      const result = await api.get<CashType[]>(`/cashs?userId=${_id}`);
      setListCash(result.data);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  }, [_id]);
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
        render: (text: string, record) => (
          <ButtonDetailCash code={text} cash={record} onSuccess={fetchData} />
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
              <Tag color="blue">
                {i18n.language === "ci" ? "自动银行支付" : "Auto Banking"}
              </Tag>
            ) : (
              <Tag color="pink-inverse">
                {i18n.language === "ci" ? "手动" : "Manual Banking"}
              </Tag>
            )}
          </p>
        ),
        filters: [
          {
            text: i18n.language === "ci" ? "自动银行支付" : "Auto Banking",
            value: 0,
          },
          {
            text: i18n.language === "ci" ? "手动" : "Manual Banking",
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
            {t("page.cash.history.field.money")}
          </p>
        ),
        dataIndex: "money",
        key: "money",
        render: (text: number) => (
          <p className="text-sm font-primary">{priceFomat(text)}</p>
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
                  {t("page.cash.history.status.approve")}
                </span>
              </Tag>
            ) : null}
            {record.status === 2 ? (
              <Tag color="lime">
                <span className="font-primary">
                  {t("page.cash.history.status.pending")}
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
        render: (text: string) => (
          <p className="text-sm font-primary font-semibold">{text}</p>
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
    <RequireAuthPage rolePage={[2]}>
      <RechargePage />
      <div className="mt-10 space-y-4 md:space-y-6">
        <Heading>
          {t("page.cash.history.heading")}{" "}
          {priceFomat(
            listCash
              .filter((item) => item.status === 1)
              .map((item) => item.money)
              .reduce((prev, cur) => (prev += cur), 0)
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
            scroll={{ x: 1300, y: 600 }}
          />
        </div>
      </div>
    </RequireAuthPage>
  );
};

const ButtonDetailCash = ({
  code,
  cash,
  onSuccess,
}: {
  code: string;
  cash: CashType;
  onSuccess: () => void;
}) => {
  const priceFomat = useFormatPrice();
  const { i18n, t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentTime = new Date().getTime(); // Thời gian hiện tại (timestamp)
  const createdAtTime = new Date(cash.createdAt).getTime(); // Thời gian tạo (timestamp)
  const tenMinutesInMilliseconds = 10 * 60 * 1000; // 10 phút tính bằng mili giây
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCheckCash = async () => {
    try {
      setLoading(true);
      const result = await api.get<{
        data: {
          "Mã GD": number;
          "Mô tả": string;
          "Giá trị": number;
          "Ngày diễn ra": Date;
          "Số tài khoản": string;
        }[];
      }>(
        "https://script.google.com/macros/s/AKfycby4nlJ_Q-Ppsf6V72FIZ5a7gM-HE8ZryCXiRRLHFZnnB94TX_FXJIWjMpeCNtvMdaz-_Q/exec"
      );
      console.log("data - ", result.data.data);
      if (
        result.data.data.some(
          (item) =>
            cash.content &&
            item["Giá trị"] >= cash.money &&
            (item["Mô tả"].includes(cash.content) ||
              item["Mô tả"].toLowerCase().includes(cash.content.toLowerCase()))
        )
      ) {
        await api.get(`/cashs/approve/${cash._id}`);
      } else {
        await api.post(`/cashs/reject/${cash._id}`, {
          description: "We can not find out your payment. Please contact Admin",
        });
      }
      handleOk();
      onSuccess();
      toast("Success checked");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? <Loading className="bg-[#00000027]" /> : null}
      <button className="text-primary" onClick={showModal}>
        {code}
      </button>
      <Modal
        title={
          i18n.language === "vi"
            ? "Chi tiết giao dịch"
            : i18n.language === "ci"
            ? "交款的仔细"
            : "Detail of transaction"
        }
        footer={[]}
        onCancel={handleCancel}
        open={isModalOpen}
        centered
      >
        <div className="font-primary space-y-2 text-base relative">
          <p>
            {t("page.cash.history.field.code")}: {cash.code}
          </p>
          <p>
            {t("page.cash.history.field.transactionType")}:{" "}
            {cash.type === 0 ? (
              <Tag color="blue">
                {i18n.language === "ci" ? "自动银行支付" : "Auto Banking"}
              </Tag>
            ) : (
              <Tag color="pink-inverse">
                {i18n.language === "ci" ? "手动" : "Manual Banking"}
              </Tag>
            )}
          </p>
          <p>
            {t("page.cash.history.field.money")}:{" "}
            <span className="font-semibold">{priceFomat(cash.money)}</span>
          </p>
          <p>
            {t("page.cash.history.field.created_at")}:{" "}
            {DAY_FORMAT(cash.createdAt)}
          </p>
          {cash.status !== 2 ? (
            <p>
              {t("page.cash.history.field.updated_at")}:{" "}
              {DAY_FORMAT(cash.updatedAt)}
            </p>
          ) : null}

          <p>
            {t("page.cash.history.field.status")}:{" "}
            {cash.status === 0 ? (
              <Tag color="red">
                <span className="font-primary">
                  {t("page.cash.history.status.reject")}
                </span>
              </Tag>
            ) : null}
            {cash.status === 1 ? (
              <Tag color="green">
                <span className="font-primary">
                  {t("page.cash.history.status.approve")}
                </span>
              </Tag>
            ) : null}
            {cash.status === 2 ? (
              <Tag color="lime">
                <span className="font-primary">
                  {t("page.cash.history.status.pending")}
                </span>
              </Tag>
            ) : null}
          </p>
          {cash.status === 0 && cash.description ? (
            <p>
              {t("page.cash.history.field.description")}:{" "}
              <span className="text-error">{cash.description}</span>
            </p>
          ) : null}
          {cash.type === 0 && (
            <img
              src={`https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${cash.money}&addInfo=${cash.content}`}
              className="w-52 h-auto mx-auto py-5 object-cover"
            />
          )}
          {cash.content ? (
            <p>
              {i18n.language === "vi"
                ? "Nội dung chuyển khoản"
                : i18n.language === "ci"
                ? "支付的内容"
                : "Content"}
              : <span className="text-primary">{cash.content}</span>
            </p>
          ) : null}
          {cash.status === 2 &&
          cash.type === 0 &&
          currentTime - createdAtTime > tenMinutesInMilliseconds ? (
            <div className="mt-5">
              <p>
                Nếu bạn đã chuyển khoản vui lòng{" "}
                <span
                  className="font-semibold text-primary underline cursor-pointer"
                  onClick={handleCheckCash}
                >
                  click vào đây
                </span>{" "}
                để kiểm tra lại. Nếu chưa được vui lòng liên hệ admin.
              </p>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
};
export default CashPage;
