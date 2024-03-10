import { useEffect, useMemo, useState } from "react";
import IconQuesionMarkCircle from "../../icons/IconQuesionMarkCircle";
import {
  DatePicker,
  DatePickerProps,
  Table,
  TableColumnsType,
  Tooltip,
} from "antd";
import { api } from "../../api";
import { CommisionType, RoseType, SatisfyType } from "../../type";
import { RootState } from "../../store/configureStore";
import { useSelector } from "react-redux";
import { VND } from "../../utils/formatPrice";
import { AuthState } from "../../store/auth/authSlice";
import { toast } from "react-toastify";
import {
  DAY_FORMAT,
  isSameOrAfter,
  isSameOrBefore,
  messages,
} from "../../constants";
import dayjs from "dayjs";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import Heading from "../../components/common/Heading";

const InvitePage = () => {
  const collab = useSelector((state: RootState) => state.collab);
  const { _id } = useSelector((state: RootState) => state.auth);
  const [satisfy, setSatisfy] = useState<SatisfyType>();
  const [user, setUser] = useState<AuthState>();
  const [commision, setCommision] = useState<CommisionType>();
  const [roseHistory, setRoseHistory] = useState<RoseType[]>([]);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>();
  const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>();
  const [inputValue, setInputValue] = useState<string>("");
  const listRoseHistoryFilter =
    startDate && endDate && !inputValue
      ? roseHistory.filter(
          (item) =>
            isSameOrAfter(item.createdAt, startDate) &&
            isSameOrBefore(item.createdAt, endDate)
        )
      : startDate && endDate && inputValue
      ? roseHistory.filter(
          (item) =>
            (item.plan.toLocaleLowerCase().includes(inputValue.toLowerCase()) ||
              item.reciveRoseId.email
                .toLocaleLowerCase()
                .includes(inputValue.toLowerCase()) ||
              item.reciveRoseId.username
                .toLocaleLowerCase()
                .includes(inputValue.toLowerCase()) ||
              item.reciveRoseId.phone
                .toLocaleLowerCase()
                .includes(inputValue.toLowerCase())) &&
            isSameOrAfter(item.createdAt, startDate) &&
            isSameOrBefore(item.createdAt, endDate)
        )
      : inputValue
      ? roseHistory.filter(
          (item) =>
            item.plan.toLocaleLowerCase().includes(inputValue.toLowerCase()) ||
            item.reciveRoseId.email
              .toLocaleLowerCase()
              .includes(inputValue.toLowerCase()) ||
            item.reciveRoseId.username
              .toLocaleLowerCase()
              .includes(inputValue.toLowerCase()) ||
            item.reciveRoseId.phone
              .toLocaleLowerCase()
              .includes(inputValue.toLowerCase())
        )
      : roseHistory;
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);
  const fetchData = async () => {
    try {
      const [resultSatify, resultUser, resultCommision, resultRose] =
        await Promise.all([
          api.get<SatisfyType>(`/satisfy/${_id}`),
          api.get<AuthState>(`/users/${_id}`),
          api.get<CommisionType>("/commisions"),
          api.get<RoseType[]>(`/roses?reciveRoseId=${_id}`),
        ]);
      setSatisfy(resultSatify.data);
      setUser(resultUser.data);
      setCommision(resultCommision.data);
      setRoseHistory(resultRose.data);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const columns: TableColumnsType<RoseType> = useMemo(
    () => [
      {
        title: () => (
          <p className="text-base font-semibold font-primary">STT</p>
        ),
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Tên gói</p>,
        dataIndex: "plan",
        key: "plan",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">% hoa hồng</p>,
        dataIndex: "percent",
        key: "percent",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}%</p>
        ),
        sorter: {
          compare: (a, b) => a.percent - b.percent,
          multiple: 1,
        },
      },
      {
        title: <p className="font-semibold font-primary">Tiền hoa hồng</p>,
        key: "recive",
        render: (_: string, record: RoseType) => (
          <p className="text-sm font-primary">{VND.format(record.recive)}VND</p>
        ),
        sorter: {
          compare: (a, b) => a.recive - b.recive,
          multiple: 2,
        },
      },
      {
        title: <p className="font-semibold font-primary">Người mua</p>,
        key: "username",
        render: (_: string, record: RoseType) => (
          <p className="text-sm font-primary">{record.introducedId.username}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Email</p>,
        key: "email",
        render: (_: string, record: RoseType) => (
          <p className="text-sm font-primary">{record.introducedId.email}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">SDT</p>,
        key: "email",
        render: (_: string, record: RoseType) => (
          <p className="text-sm font-primary">{record.introducedId.phone}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Ngày nhận</p>,
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
    ],
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
  const tolltip = `User/CTV: 
  Nhận được ${commision?.value}% hoa hồng cho mỗi đơn hàng của người được giới thiệu || 
  Đại lý Cấp 1: 
  Chiết khấu [${collab.level1}%] cho mỗi đơn hàng mới ||
  Đại lý Cấp 2: 
  Chiết khấu [${collab.level2}%] cho mỗi đơn hàng mới ||
  Đại lý Cấp 3: 
  Chiết khấu [${collab.level3}%] cho mỗi đơn hàng mới || Để được nâng cấp lên làm đại lý vui lòng lien hệ trực tiếp admin
  `;
  return (
    <RequireAuthPage rolePage={2}>
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 items-start rounded-xl border-2 border-[#eeeeed]">
          <div className="flex flex-col items-center flex-1 px-5 py-5 space-y-2 md:py-7 rounded-xl md:space-y-4">
            <p className="text-xl font-medium lg:text-2xl xl:text-4xl">
              {user?.level === 0 ? "Cộng tác viên" : `Đại lý cấp${user?.level}`}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-lg">Cấp độ</p>
              <Tooltip title={tolltip}>
                <span>
                  <IconQuesionMarkCircle />
                </span>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col items-center flex-1 px-5 py-5 space-y-2 md:py-7 rounded-xl md:space-y-4">
            <p className="text-xl font-medium lg:text-2xl xl:text-4xl">
              {satisfy?.numberIntoduce || 0}
            </p>
            <div className="flex items-center gap-1">
              <p className="text-lg">Đã mời</p>
            </div>
          </div>
          <div className="flex flex-col items-center flex-1 px-5 py-5 space-y-2 md:py-7 rounded-xl md:space-y-4">
            <p className="text-xl font-medium lg:text-2xl xl:text-4xl">
              {commision ? commision.value : 0}%
            </p>
            <div className="flex items-center gap-1">
              <p className="text-lg">% hoa hồng</p>
              {/* <Tooltip title="Cấp 1: Nạp Đơn Giá Trị 1.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 10% || Cấp 2: Nạp Đơn Giá Trị 3.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 20% || Cấp 3: Nạp Đơn Giá Trị 10.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 50%">
                <span>
                  <IconQuesionMarkCircle />
                </span>
              </Tooltip> */}
            </div>
          </div>
          <div className="flex flex-col items-center flex-1 px-5 py-5 space-y-2 md:py-7 rounded-xl md:space-y-4">
            <p className="text-xl font-medium lg:text-2xl xl:text-4xl">
              {satisfy && satisfy.rose.length > 0
                ? VND.format(satisfy.rose[0].money)
                : 0}
              VND
            </p>

            <div className="flex items-center gap-1">
              <p className="text-lg">Tiền hoa hồng</p>
              {/* <Tooltip title="Cấp 1: Nạp Đơn Giá Trị 1.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 10% || Cấp 2: Nạp Đơn Giá Trị 3.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 20% || Cấp 3: Nạp Đơn Giá Trị 10.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 50%">
                <span>
                  <IconQuesionMarkCircle />
                </span>
              </Tooltip> */}
            </div>
          </div>
        </div>
        <div className="font-medium">
          <p>
            User/CTV: Nhận được{" "}
            <span className="font-medium text-secondary20">
              [{commision?.value}%]
            </span>{" "}
            hoa hồng cho mỗi đơn hàng của người được giới thiệu.
          </p>
          <p>
            Đại lý Cấp 1: Chiết khấu{" "}
            <span className="font-medium text-secondary20">
              [{collab.level1}%]
            </span>{" "}
            cho mỗi đơn hàng mới.
          </p>
          <p>
            Đại lý Cấp 2: Chiết khấu{" "}
            <span className="font-medium text-secondary20">
              [{collab.level2}%]
            </span>{" "}
            cho mỗi đơn hàng mới.
          </p>
          <p>
            Đại lý Cấp 3: Chiết khấu{" "}
            <span className="font-medium text-secondary20">
              [{collab.level3}%]
            </span>{" "}
            cho mỗi đơn hàng mới.
          </p>
          <p className="text-lg font-medium text-secondary20">
            Để được nâng cấp lên làm đại lý vui lòng lien hệ trực tiếp admin.
          </p>
        </div>
        <div className="space-y-4">
          <Heading>Lịch sử nhận hoa hồng</Heading>
          <div className="items-center block gap-5 mb-5 space-y-3 md:flex md:space-y-0">
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
              dataSource={listRoseHistoryFilter.map((item, index) => ({
                index,
                ...item,
              }))}
              columns={columns}
              scroll={{ x: 1180 }}
            />
          </div>
        </div>
      </div>
    </RequireAuthPage>
  );
};

export default InvitePage;
