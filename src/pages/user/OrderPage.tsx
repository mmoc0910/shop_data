import {
  DatePicker,
  DatePickerProps,
  Modal,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { ExtendPlanType, GistType } from "../../type";
import { toast } from "react-toastify";
import {
  DAY_FORMAT,
  isSameOrAfter,
  isSameOrBefore,
  linkGist,
  messages,
} from "../../constants";
import { api } from "../../api";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import Heading from "../../components/common/Heading";
import UpdateExtension from "../../components/user/UpdateExtension";
import { copyToClipboard } from "../../utils/copyToClipboard";
import Swal from "sweetalert2";
import Loading from "../../components/common/Loading";
import axios from "axios";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Link, useNavigate } from "react-router-dom";
import Radio from "../../components/radio/Radio";

const OrderPage = () => {
  const navigation = useNavigate();
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectRow, setSelectRow] = useState<
    { id: string; endDate: Date } | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listExtendPlan, setListExtendPlan] = useState<ExtendPlanType[]>([]);
  const { _id } = useSelector((state: RootState) => state.auth);
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
      const result = await api.get<GistType[]>(`/gists?userId=${_id}&status=1`);
      setListGist(result.data);
      console.log("abc");
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<ExtendPlanType[]>("/extend-plans");
        setListExtendPlan(result.data);
      } catch (error) {
        console.log("error - ", error);
        toast.error(messages.error);
      }
    })();
  }, []);
  const handleUpgradPlan = async (
    gistId: string,
    name: string,
    price: number,
    bandWidth: number,
    type: string
  ) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn gia hạn gói ${name}(${VND.format(
          price
        )}VND) ${bandWidth}GB/${type}</p>`,
        // text: `${bandWidth}GB - ${VND.format(price)}VND/${type}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Có, gia hạn ngay",
      });
      if (isConfirmed) {
        setLoading(true);
        await api.post("/upgrades/plan", { gistId });
        handleOk();
        handleFetchData();
        toast.success("Gia hạn gói thành công");
        setLoading(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
        if (
          error.response?.data.message ===
            "Bạn không đủ tiền để đăng kí dịch vụ này" &&
          error.response.status === 400
        ) {
          toast.warn("Nạp thêm tiền để sử dụng dịch vụ");
          navigation("/user/dashboard");
        }
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateExtension = async (_id: string, value: string) => {
    try {
      await api.patch(`/gists/extension/${_id}`, { extension: value });
    } catch (error) {
      toast.error(messages.error);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setSelectRow(undefined);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns: TableColumnsType<GistType> = useMemo(
    () => [
      {
        title: () => <p className="font-primary text-base font-semibold"></p>,
        dataIndex: "index",
        width: 40,
        fixed: "left",
        render: (_text: string, _record: GistType, index: number) => (
          <p className="font-primary text-sm">{index + 1}</p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Tên gói</p>,
        dataIndex: "name",
        key: "name",
        width: 100,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">{record.planId?.name}</p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Thời gian</p>,
        dataIndex: "day",
        key: "day",
        width: 170,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">
            {DAY_FORMAT(record.keyId.startDate)} <br />-{" "}
            {DAY_FORMAT(record.keyId.endDate)}
          </p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Usage</p>,
        dataIndex: "dataUsage",
        key: "dataUsage",
        width: 100,
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
        title: <p className="font-primary font-semibold">Data limit</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        width: 100,
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
        title: <p className="font-primary font-semibold">Data Expand</p>,
        dataIndex: "dataExtend",
        key: "dataExtend",
        width: 120,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">
            {record.keyId.dataExpand / 1000 / 1000 / 1000}
            GB
          </p>
        ),
        sorter: {
          compare: (a, b) => a.keyId.dataLimit - b.keyId.dataLimit,
          multiple: 1,
        },
      },
      {
        title: <p className="font-primary font-semibold">endExpand Date</p>,
        dataIndex: "endExpandDate",
        key: "endExpandDate",
        width: 120,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">
            {record.keyId?.endExpandDate &&
              DAY_FORMAT(record.keyId.endExpandDate)}
          </p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Key</p>,
        dataIndex: "key",
        key: "key",
        // fixed: "right",
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
                <p className="font-primary text-sm w-[350px] line-clamp-1">
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
                <p className="font-primary text-sm w-[350px] line-clamp-1">
                  {key}
                  {record.extension}
                </p>
              </div>
            </div>
          );
        },
      },
      {
        title: <p className="font-primary font-semibold">Trạng thái</p>,
        dataIndex: "status",
        key: "status",
        width: 100,
        // fixed: "right",
        render: (_: string, record: GistType) => (
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
        // onFilter: (value: string, record: GistType) =>
        //   record.status === Number(value),
      },
      {
        title: <p className="font-primary font-semibold">Đặt tên key</p>,
        dataIndex: "extension",
        key: "extension",
        // width: 150,
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
      {
        title: <p className="font-primary font-semibold"></p>,
        dataIndex: "action",
        key: "action",
        render: (_: string, record: GistType) =>
          record.status ? (
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 justify-end w-[150px] lg:w-[250px] px-5">
              {!record.keyId.endExpandDate ||
              (record.keyId.endExpandDate &&
                dayjs().isAfter(record.keyId.endExpandDate, "day")) ? (
                <button
                  className="px-4 py-2 rounded-lg bg-secondary40 font-medium text-white font-primary text-xs"
                  onClick={() => {
                    setSelectRow({
                      id: record._id,
                      endDate: record.keyId.endDate,
                    });
                    showModal();
                  }}
                >
                  Mua data
                </button>
              ) : null}
              <button
                className="px-4 py-2 rounded-lg bg-primary font-medium text-white font-primary text-xs"
                onClick={() =>
                  handleUpgradPlan(
                    record._id,
                    record.planId.name,
                    record.planId.price,
                    record.planId.bandWidth,
                    record.planId.type
                  )
                }
              >
                Gia hạn
              </button>
            </div>
          ) : null,
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
    <RequireAuthPage rolePage={2}>
      {loading ? <Loading /> : null}
      <p className="">
        Vui lòng lấy key tương ứng với thiết bị của bạn và dán vào phần mềm theo
        hướng dẫn{" "}
        <Link to={""} className="text-primary underline decoration-primary">
          hướng dẫn
        </Link>
        :
      </p>
      <p className="flex items-center gap-2">
        <span>
          <IosXML />
        </span>
        : Link kết nối cho iphone
      </p>
      <p className="mb-5 flex items-center gap-2">
        <span>
          <AndroidXML />
        </span>
        : Link kết nối cho các thiết bị khác (Android, Windows, MACOS, Linux)
      </p>
      <div className="block md:flex space-y-3 md:space-y-0 items-center gap-5 pb-5">
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
          scroll={{ x: 1600 }}
        />
      </div>
      <Modal
        width={1000}
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setSelectRow(undefined);
        }}
        footer={[]}
      >
        <Heading className="font-primary">Danh sách gói cước mở rộng</Heading>
        <div className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listExtendPlan.map((item) => (
            <ExtendPlanItem
              key={uuidv4()}
              extendPlan={item}
              onSubmit={() => {
                handleOk();
                handleFetchData();
              }}
              selectRow={selectRow}
              setLoading={(value: boolean) => setLoading(value)}
            />
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-error font-medium text-white font-primary"
            onClick={() => {
              handleCancel();
              setSelectRow(undefined);
            }}
          >
            Thoát
          </button>
        </div>
      </Modal>
    </RequireAuthPage>
  );
};

const ExtendPlanItem = ({
  selectRow,
  extendPlan,
  setLoading,
  onSubmit,
}: {
  selectRow?: { id: string; endDate: Date };
  extendPlan: ExtendPlanType;
  setLoading: (value: boolean) => void;
  onSubmit: () => void;
}) => {
  const period =
    selectRow?.endDate && dayjs(selectRow.endDate).diff(dayjs(), "month") + 1;
  const [month, setMonth] = useState<number>(1);
  const discountPercent =
    month <= 4
      ? extendPlan.level1
      : month > 4 && month <= 8
      ? extendPlan.level2
      : extendPlan.level3;
  const priceDiscount =
    extendPlan.price * month * ((100 - discountPercent) / 100);
  const navigation = useNavigate();
  const handleUpgradeBrandWidth = async (
    extendPlanId: string,
    gistId: string,
    bandWidth: number,
    month: number
  ) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn mua thêm ${bandWidth}GB băng thông</p>`,
        // text: `${bandWidth}GB - ${VND.format(price)}VND/${type}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Có, mua ngay",
      });
      if (isConfirmed) {
        setLoading(true);
        await api.post("/upgrades/band-width", { gistId, extendPlanId, month });
        onSubmit();
        // handleOk();
        // handleFetchData();
        toast.success("Mua thêm băng thông thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
        if (
          error.response?.data.message ===
            "Bạn không đủ tiền để đăng kí dịch vụ này" &&
          error.response.status === 400
        ) {
          toast.warn("Nạp thêm tiền để sử dụng dịch vụ");
          navigation("/user/dashboard");
        }
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      key={uuidv4()}
      className="p-5 shadow-xl rounded-lg font-primary space-y-3 flex flex-col justify-between"
    >
      <p className="font-semibold text-base text-center">{extendPlan.name}</p>
      <p className="text-center font-medium text-xl">
        {extendPlan.bandWidth}GB/tháng - {VND.format(priceDiscount)}VND
        {/* {VND.format(extendPlan.price)} */}
      </p>
      <div className="flex items-center gap-5">
        <Radio checked={month === 1} onClick={() => setMonth(1)}>
          1 tháng
        </Radio>
        {period && period > 1 ? (
          <Radio checked={month === period} onClick={() => setMonth(period)}>
            {period} tháng còn lại
          </Radio>
        ) : null}
        {/* {!month && <p className="text-error">Bạn chưa chọn thời gian</p>} */}
      </div>
      <button
        className="px-4 py-2 rounded-lg bg-secondary40 font-medium text-white font-primary text-sm"
        onClick={() =>
          selectRow &&
          month &&
          handleUpgradeBrandWidth(
            extendPlan._id,
            selectRow.id,
            extendPlan.bandWidth,
            month
          )
        }
      >
        Mua ngay
      </button>
    </div>
  );
};

export const IosXML = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className="w-4 h-4"
    >
      <path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM127 384.5c-5.5 9.6-17.8 12.8-27.3 7.3-9.6-5.5-12.8-17.8-7.3-27.3l14.3-24.7c16.1-4.9 29.3-1.1 39.6 11.4L127 384.5zm138.9-53.9H84c-11 0-20-9-20-20s9-20 20-20h51l65.4-113.2-20.5-35.4c-5.5-9.6-2.2-21.8 7.3-27.3 9.6-5.5 21.8-2.2 27.3 7.3l8.9 15.4 8.9-15.4c5.5-9.6 17.8-12.8 27.3-7.3 9.6 5.5 12.8 17.8 7.3 27.3l-85.8 148.6h62.1c20.2 0 31.5 23.7 22.7 40zm98.1 0h-29l19.6 33.9c5.5 9.6 2.2 21.8-7.3 27.3-9.6 5.5-21.8 2.2-27.3-7.3-32.9-56.9-57.5-99.7-74-128.1-16.7-29-4.8-58 7.1-67.8 13.1 22.7 32.7 56.7 58.9 102h52c11 0 20 9 20 20 0 11.1-9 20-20 20z" />
    </svg>
  );
};

export const AndroidXML = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      className="w-4 h-4"
    >
      <path d="M420.6 301.9a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m273.7-144.5 47.9-83a10 10 0 1 0 -17.3-10h0l-48.5 84.1a301.3 301.3 0 0 0 -246.6 0L116.2 64.5a10 10 0 1 0 -17.3 10h0l47.9 83C64.5 202.2 8.2 285.6 0 384H576c-8.2-98.5-64.5-181.8-146.9-226.6" />
    </svg>
  );
};

export default OrderPage;
