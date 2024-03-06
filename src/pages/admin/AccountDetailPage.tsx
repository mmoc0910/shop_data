import { useParams } from "react-router-dom";
import { UserState } from "../../type";
import { countries, purposes } from "../../constants";
import {
  DatePicker,
  DatePickerProps,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { GistType } from "../../type";
import { toast } from "react-toastify";
import {
  isSameOrAfter,
  isSameOrBefore,
  linkGist,
  messages,
} from "../../constants";
import { api } from "../../api";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import Heading from "../../components/common/Heading";
import UpdateExtension from "../../components/user/UpdateExtension";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { AndroidXML, IosXML } from "../user/OrderPage";

const AccountDetailPage = () => {
  const { accountId } = useParams();
  const [user, setUser] = useState<UserState>();
  useEffect(() => {
    (async () => {
      try {
        const resultUser = await api.get<UserState>(`/users/${accountId}`);
        setUser(resultUser.data);
      } catch (error) {
        console.log("error - ", error);
        // toast.error(messages.error);
      }
    })();
  }, [accountId]);
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <Heading>Chi tiết người dùng</Heading>
        {user ? (
          <div className="grid grid-cols-3 gap-3">
            <p>
              Tên người dùng:{" "}
              <span className="font-medium">{user.username}</span>
            </p>
            <p>
              Email: <span className="font-medium">{user.email}</span>
            </p>
            <p>
              Số điện thoại: <span className="font-medium">{user.phone}</span>
            </p>
            <p>
              Mã giới thiệu:{" "}
              <span className="font-medium">{user.introduceCode}</span>
            </p>
            <p>
              Loại người dùng:{" "}
              <span className="font-medium">
                {user.level === 0
                  ? "Cộng tác viên"
                  : `Đại lý cấp ${user.level}`}
              </span>
            </p>
            <p>
              Số dư:{" "}
              <span className="font-medium">{VND.format(user.money)}VND</span>
            </p>
            <p>
              Quốc gia:{" "}
              <span className="font-medium">
                {countries.find((i) => i.key === user.country)?.title}
              </span>
            </p>
            <p>
              Mục đích sử dụng:{" "}
              <span className="font-medium">
                {purposes.find((i) => i.id === user.purpose)?.title}
              </span>
            </p>
          </div>
        ) : null}
      </div>
      <OrderKeyUser accountId={accountId as string} />
    </div>
  );
};

const OrderKeyUser = ({ accountId }: { accountId: string }) => {
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [listGist, setListGist] = useState<GistType[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>();
  const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>();
  const [inputValue, setInputValue] = useState<string>("");
  const listGistFilter =
    startDate && endDate && !inputValue
      ? listGist.filter(
          (item) =>
            isSameOrAfter(item.keyId.startDate, startDate) &&
            isSameOrBefore(item.keyId.endDate, endDate)
        )
      : startDate && endDate && inputValue
      ? listGist.filter(
          (item) =>
            item?.planId &&
            item.planId.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            dayjs(item.keyId.startDate).isAfter(startDate) &&
            dayjs(item.keyId.endDate).isBefore(endDate)
        )
      : inputValue
      ? listGist.filter(
          (item) =>
            item?.planId &&
            item.planId.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      : listGist;
  useEffect(() => {
    setLoadingTable(true);
    handleFetchData();
    setLoadingTable(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleFetchData = async () => {
    try {
      const result = await api.get<GistType[]>(`/gists?userId=${accountId}`);
      setListGist(result.data);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };

  const handleUpdateExtension = async (_id: string, value: string) => {
    try {
      await api.patch(`/gists/extension/${_id}`, { extension: value });
    } catch (error) {
      toast.error(messages.error);
    }
  };

  const columns: TableColumnsType<GistType> = useMemo(
    () => [
      {
        title: () => (
          <p className="font-primary text-base font-semibold">STT</p>
        ),
        dataIndex: "index",
        width: 70,
        render: (_text: string, _record: GistType, index: number) => (
          <p className="font-primary text-sm">{index + 1}</p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Tên gói</p>,
        dataIndex: "name",
        key: "name",
        width: 150,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">{record.planId?.name}</p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Thời gian</p>,
        dataIndex: "day",
        key: "day",
        width: 120,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">
            {dayjs(record.keyId.startDate).format("DD/MM/YYYY")} <br />-{" "}
            {dayjs(record.keyId.endDate).format("DD/MM/YYYY")}
          </p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Data limit</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        width: 120,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">
            {record.keyId.dataLimit / 1000 / 1000 / 1000}GB
          </p>
        ),
        sorter: {
          compare: (a, b) => a.keyId.dataLimit - b.keyId.dataLimit,
          multiple: 1,
        },
      },
      {
        title: <p className="font-primary font-semibold">Data Usage</p>,
        dataIndex: "dataUsage",
        key: "dataUsage",
        width: 150,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">
            {(record.keyId.dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB
          </p>
        ),
        sorter: {
          compare: (a, b) => a.keyId.dataUsage - b.keyId.dataUsage,
          multiple: 2,
        },
      },
      {
        title: <p className="font-primary font-semibold">Trạng thái</p>,
        dataIndex: "status",
        key: "status",
        width: 130,
        render: (_: number, record: GistType) => (
          <div className="font-primary text-sm">
            {record.status ? (
              <Tag color="green">
                <span className="font-primary">Còn hạn</span>
              </Tag>
            ) : (
              <Tag color="red">
                <span className="font-primary">Hết hạn</span>
              </Tag>
            )}
          </div>
        ),
        // filters: [
        //   {
        //     text: "Còn hạn",
        //     value: "1",
        //   },
        //   {
        //     text: "Hết hạn",
        //     value: "0",
        //   },
        // ],
        // onFilter: (value: number, record: GistType) =>
        //   record.status === Number(value) ? true : false,
      },
      {
        title: <p className="font-primary font-semibold">Key</p>,
        dataIndex: "key",
        key: "key",
        render: (_: string, record: GistType) => {
          const key = `${linkGist}/${record.gistId}/raw/${record?.fileName}#`;
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tooltip title="copy for Android, Windows, MacOS, Linux">
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `${record.keyId.awsId?.fileName.replace(
                          /https/g,
                          "ssconf"
                        )}#${record.extension}`
                      )
                    }
                  >
                    <AndroidXML />
                  </button>
                </Tooltip>
                <p className="font-primary text-sm w-[100px] md:w-[350px] line-clamp-1">
                  {record.keyId.awsId?.fileName.replace(/https/g, "ssconf")}#
                  {record.extension}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip title="copy for Iphone">
                  <button
                    onClick={() => copyToClipboard(`${key}${record.extension}`)}
                  >
                    <IosXML />
                  </button>
                </Tooltip>
                <p className="font-primary text-sm w-[100px] md:w-[350px] line-clamp-1">
                  {key}
                  {record.extension}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        title: <p className="font-primary font-semibold">Đặt tên key</p>,
        dataIndex: "extension",
        key: "extension",
        width: 150,
        render: (_: string, record: GistType) => {
          return (
            <UpdateExtension
              initialValue={record.extension}
              // placeholder={record.extension}
              onSubmit={(value: string) => {
                handleUpdateExtension(record._id, value);
                handleFetchData();
                toast.success("Thay đổi thành công");
              }}
            />
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
    <div>
      <Heading className="mb-4">Danh sách key đã mua</Heading>
      <div className="flex items-center gap-5 pb-5">
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
          dataSource={listGistFilter}
          columns={columns}
          loading={loadingTable}
            scroll={{ x: 1120 }}
        />
      </div>
    </div>
  );
};

export default AccountDetailPage;
