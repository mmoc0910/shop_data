import {
  DatePicker,
  DatePickerProps,
  Modal,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { Key, useEffect, useMemo, useState } from "react";
import { ExtendPlanType, GistType } from "../../type";
import { toast } from "react-toastify";
import {
  DAY_FORMAT,
  isSameOrAfter,
  isSameOrBefore,
  // linkGist,
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
            item.extension.toLowerCase().includes(inputValue.toLowerCase()) &&
            dayjs(item.keyId.startDate).isAfter(startDate) &&
            dayjs(item.keyId.endDate).isBefore(endDate)
        )
      : inputValue
      ? listGist.filter(
          (item) =>
            item?.planId &&
            item.planId.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            item.extension.toLowerCase().includes(inputValue.toLowerCase())
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
      const result = await api.get<GistType[]>(`/gists?userId=${_id}`);
      setListGist(result.data.filter((item) => item.status !== 2));
      console.log("abc");
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<ExtendPlanType[]>(
          "/extend-plans?status=1"
        );
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
        title: `<p class="leading-tight">Bạn có muốn gia hạn gói <span class="text-secondary">${name}(${VND.format(
          price
        )}VND) ${bandWidth}GB/${type}</span></p>`,
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
        title: () => <p className="text-base font-semibold font-primary"></p>,
        dataIndex: "index",
        key: "index",
        width: 50,
        fixed: "left",
        render: (text: string, record: GistType) => (
          <Link
            to={`/admin/key/${record.keyId._id}`}
            className="text-sm font-primary text-primary"
          >
            {text + 1}
          </Link>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Mã GD</p>,
        dataIndex: "code",
        key: "code",
        width: 150,
        render: (text: string, record: GistType) => (
          <Link
            to={`/admin/key/${record.keyId._id}`}
            className="text-sm font-primary text-primary"
          >
            {text}
          </Link>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Tên gói</p>,
        dataIndex: "name",
        key: "name",
        width: 100,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">{record.planId?.name}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Thời gian</p>,
        dataIndex: "day",
        key: "day",
        width: 170,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">
            {DAY_FORMAT(record.keyId.startDate)} <br />-{" "}
            {DAY_FORMAT(record.keyId.endDate)}
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Usage</p>,
        dataIndex: "dataUsage",
        key: "dataUsage",
        width: 100,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">
            {record.keyId.dataUsage
              ? `${(record.keyId.dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB`
              : "0GB"}
          </p>
        ),
        sorter: {
          compare: (a, b) => a.keyId.dataUsage - b.keyId.dataUsage,
          multiple: 2,
        },
      },
      {
        title: <p className="font-semibold font-primary">Data limit</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        width: 100,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">
            {record.keyId.dataExpand / 1000 / 1000 / 1000}GB
          </p>
        ),
        sorter: {
          compare: (a, b) => a.keyId.dataExpand - b.keyId.dataExpand,
          multiple: 1,
        },
      },
      // {
      //   title: <p className="font-semibold font-primary">Data Expand</p>,
      //   dataIndex: "dataExtend",
      //   key: "dataExtend",
      //   width: 120,
      //   render: (_: string, record: GistType) => (
      //     <p className="text-sm font-primary">
      //       {(record.keyId.dataExpand - record.keyId.dataLimit) /
      //         1000 /
      //         1000 /
      //         1000}
      //       GB
      //     </p>
      //   ),
      //   sorter: {
      //     compare: (a, b) => a.keyId.dataLimit - b.keyId.dataLimit,
      //     multiple: 1,
      //   },
      // },
      {
        title: <p className="font-semibold font-primary"> eDate Expand</p>,
        dataIndex: "endExpandDate",
        key: "endExpandDate",
        width: 120,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">
            {record.keyId?.endExpandDate &&
              DAY_FORMAT(record.keyId.endExpandDate)}
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Key</p>,
        dataIndex: "key",
        key: "key",
        // fixed: "right",
        render: (_: string, record: GistType) => {
          // const key = `${linkGist}/${record.gistId}/raw/${record?.fileName}#`;
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tooltip title="copy">
                  <button
                    className="text-secondary20"
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
              {/* <div className="flex items-center gap-2">
                <Tooltip title="copy">
                  <button
                    onClick={() => copyToClipboard(`${key}${record.extension}`)}
                  >
                    <AndroidXML />
                  </button>
                </Tooltip>
                <p className="font-primary text-sm w-[350px] line-clamp-1">
                  {key}
                  {record.extension}
                </p>
              </div> */}
            </div>
          );
        },
      },
      {
        title: <p className="font-semibold font-primary">Trạng thái</p>,
        dataIndex: "status",
        key: "status",
        width: 100,
        // fixed: "right",
        render: (_: string, record: GistType) => (
          <div className="text-sm font-primary">
            {record.status === 1 && (
              <Tag color="green">
                <span className="font-primary">Còn hạn</span>
              </Tag>
            )}
            {record.status === 0 && (
              <Tag color="red">
                <span className="font-primary">Hết hạn</span>
              </Tag>
            )}
          </div>
        ),
        filters: [
          {
            text: "Còn hạn",
            value: 1,
          },
          {
            text: "Hết hạn",
            value: 0,
          },
        ],
        onFilter: (value: boolean | Key, record: GistType) => {
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
        title: <p className="font-semibold font-primary">Đặt tên key</p>,
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
        title: <p className="font-semibold font-primary"></p>,
        dataIndex: "action",
        key: "action",
        render: (_: string, record: GistType) =>
          record.status ? (
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 justify-end w-[150px] lg:w-[250px] px-5">
              {!record.keyId.endExpandDate ||
              (record.keyId.endExpandDate &&
                dayjs().isAfter(record.keyId.endExpandDate, "day") &&
                record.planId.price > 0) ? (
                <button
                  className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-secondary40 font-primary"
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
                className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-primary font-primary"
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
        Vui lòng lấy key bên dưới của bạn và dán vào phần mềm theo hướng dẫn{" "}
        <Link to={""} className="underline text-primary decoration-primary">
          hướng dẫn
        </Link>
        :
      </p>
      <p className="flex items-center gap-2 mb-5">
        <span className="text-secondary20">
          <AndroidXML />
        </span>
        : nhấn để copy Link kết nối
      </p>
      {/* <p className="flex items-center gap-2 mb-5">
        <span>
          <AndroidXML />
        </span>
        : Link kết nối phụ khi link chính bị chết
      </p> */}
      <div className="items-center block gap-5 pb-5 space-y-3 md:flex md:space-y-0">
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
          dataSource={listGistFilter.map((item, index) => ({ index, ...item }))}
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
        <div className="grid grid-cols-1 gap-5 py-3 md:grid-cols-2 lg:grid-cols-3">
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
        <div className="flex justify-end mt-5">
          <button
            className="px-4 py-2 font-medium text-white rounded-lg bg-error font-primary"
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
        title: `<p class="leading-tight">Bạn có muốn mua thêm <span class="text-secondary">${bandWidth}GB</span> băng thông</p>`,
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
      className="flex flex-col justify-between p-5 space-y-3 rounded-lg shadow-xl font-primary"
    >
      <p className="text-base font-semibold text-center">{extendPlan.name}</p>
      <p className="text-xl font-medium text-center">
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
        className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-secondary40 font-primary"
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
      viewBox="0 0 576 512"
      className="w-4 h-4"
    >
      <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
    </svg>
  );
};

export const AndroidXML = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className="w-4 h-4 fill-current"
    >
      <path d="M384 336H192c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16l140.1 0L400 115.9V320c0 8.8-7.2 16-16 16zM192 384H384c35.3 0 64-28.7 64-64V115.9c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1H192c-35.3 0-64 28.7-64 64V320c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H256c35.3 0 64-28.7 64-64V416H272v32c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V192c0-8.8 7.2-16 16-16H96V128H64z" />
    </svg>
  );
};

export default OrderPage;
