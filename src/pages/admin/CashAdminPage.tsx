/* eslint-disable @typescript-eslint/no-unused-vars */
import { Key, useEffect, useMemo, useState } from "react";
import Heading from "../../components/common/Heading";
import { CashType } from "../../type";
import { toast } from "react-toastify";
import {
  DAY_FORMAT,
  isSameOrAfter,
  isSameOrBefore,
  messages,
} from "../../constants";
import { api } from "../../api";
import {
  DatePicker,
  DatePickerProps,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { VND } from "../../utils/formatPrice";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import Swal from "sweetalert2";
import axios from "axios";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import IconCheckBadge from "../../icons/IconCheckBadge";
import IconXCircle from "../../icons/IconXCircle";
import { useFormatPrice } from "../../hooks/useFormatPrice";

const CashAdminPage = () => {  const priceFomat = useFormatPrice();
  const { i18n } = useTranslation();
  const [listCash, setListCash] = useState<CashType[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>();
  const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>();
  const [inputValue, setInputValue] = useState<string>("");
  const listCashFilter =
    startDate && endDate && !inputValue
      ? listCash.filter(
          (item) =>
            isSameOrAfter(item.createdAt, startDate) &&
            isSameOrBefore(item.createdAt, endDate)
        )
      : startDate && endDate && inputValue
      ? listCash.filter(
          (item) =>
            (item.userId?.username
              ?.toLowerCase()
              .includes(inputValue.toLowerCase()) ||
              item.userId?.phone
                ?.toLowerCase()
                .includes(inputValue.toLowerCase()) ||
              item.userId?.email
                ?.toLowerCase()
                .includes(inputValue.toLowerCase())) &&
            isSameOrAfter(item.createdAt, startDate) &&
            isSameOrBefore(item.createdAt, endDate)
        )
      : inputValue
      ? listCash.filter(
          (item) =>
            item.userId?.username
              ?.toLowerCase()
              .includes(inputValue.toLowerCase()) ||
            item.userId?.phone
              ?.toLowerCase()
              .includes(inputValue.toLowerCase()) ||
            item.userId?.email?.toLowerCase().includes(inputValue.toLowerCase())
        )
      : listCash;
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
        title: `<p class="leading-tight">Bạn có muốn nạp cho người dùng <span class="text-secondary">${
          username || email
        }</span> số tiền <span class="text-secondary">${VND.format(
          money
        )}VND</span></p>`,
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
        title: `<p class="leading-tight">Bạn từ chối nạp cho người dùng <span class="text-secondary">${
          username || email
        }</span> số tiền <span class="text-secondary">${VND.format(
          money
        )}VND</span></p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        const { value } = await Swal.fire({
          title: "<p class='leading-tight'>Lý do từ chối</p>",
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
              `<p class="leading-tight">Bạn từ chối nạp cho <span class="text-secondary">${username} số tiền ${VND.format(
                money
              )}NVD</span> với lý do <span class="text-secondary">${value}</span></p>`
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
        title: () => <p className="font-semibold font-primary">STT</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Mã giao dịch</p>,
        dataIndex: "code",
        key: "code",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Loại giao dịch</p>,
        dataIndex: "type",
        key: "type",
        render: (text: number) => (
          <p className="text-sm font-primary">
            {text === 0 ? (
              <Tag color="blue">Auto Banking</Tag>
            ) : (
              <Tag color="pink-inverse">Manual Banking</Tag>
            )}
          </p>
        ),
        filters: [
          {
            text: "Auto Banking",
            value: 0,
          },
          {
            text: "Manual Banking",
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
          <p className="text-sm font-semibold font-primary">Username</p>
        ),
        dataIndex: "username",
        key: "username",
        render: (_: string, record: CashType) => (
          <Link
            to={`/admin/account/${record.userId._id}`}
            className="text-sm font-medium font-primary text-primary"
          >
            {record.userId?.username}
          </Link>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Số tiền nạp</p>
        ),
        dataIndex: "money",
        key: "money",
        render: (_: string, record: CashType) => (
          <p className="text-sm font-primary">
            {" "}
            {priceFomat(record.money)}
          </p>
        ),
        sorter: (a, b) => a.money - b.money,
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Ngày nạp</p>
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
          <p className="text-sm font-semibold font-primary">Ngày duyệt</p>
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
          <p className="text-sm font-semibold font-primary">Trạng thái</p>
        ),
        dataIndex: "status",
        key: "status",
        render: (_: string, record: CashType) => (
          <div className="text-sm font-primary">
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
        filters: [
          {
            text: "Đã hủy",
            value: 0,
          },
          {
            text: "Đã hoàn thành",
            value: 1,
          },
          {
            text: "Chờ phê duyệt",
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
            Nội dung chuyển khoản
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
          <p className="text-sm font-semibold font-primary">Lý do hủy</p>
        ),
        dataIndex: "description",
        key: "description",
        render: (text: string) => (
          <p className="text-sm font-primary text-error">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Action</p>
        ),
        dataIndex: "action",
        key: "action",
        // fixed: "right",
        width: 200,
        render: (_: string, record: CashType) => (
          <div className="flex gap-2 text-xs font-primary">
            {/* {record.status !== 2 ? null : ( */}
              <>
                <Tooltip title="Approve">
                  <button
                    className="px-2 aspect-square font-medium text-white rounded-md bg-[#389e0d]"
                    onClick={() => handleApproveCash(record)}
                  >
                    <IconCheckBadge className="size-5" />
                  </button>
                </Tooltip>
                <Tooltip title="Cancel">
                  <button
                    className="px-2 aspect-square font-medium text-white rounded-md bg-error"
                    onClick={() => handleCancelCash(record)}
                  >
                    <IconXCircle className="size-5" />
                  </button>
                </Tooltip>
              </>
            {/* )} */}
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language]
  );
  const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
    setStartDate(date);
  };
  const onChangeEndDate: DatePickerProps["onChange"] = (date) => {
    setEndDate(date);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };
  return (
    <RequireAuthPage rolePage={[1,3]}>
      <div className="space-y-6">
        <Heading>Danh sách yêu cầu nạp</Heading>
        <div className="items-center block gap-5 space-y-3 md:flex md:space-y-0">
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
            dataSource={listCashFilter.map((item, index) => ({
              index,
              ...item,
            }))}
            columns={columns}
            scroll={{ x: 1500, y: 400 }}
          />
        </div>
      </div>
    </RequireAuthPage>
  );
};

export default CashAdminPage;
