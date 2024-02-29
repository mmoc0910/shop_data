import { Modal, Table, TableColumnsType, Tag, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ExtendPlanType, GistType } from "../../type";
import { toast } from "react-toastify";
import { messages } from "../../constants";
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
import { Link } from "react-router-dom";

const linkGist = import.meta.env.VITE_LINK_GIST;
const OrderPage = () => {
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectRow, setSelectRow] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listExtendPlan, setListExtendPlan] = useState<ExtendPlanType[]>([]);
  const { _id } = useSelector((state: RootState) => state.auth);
  const [listGist, setListGist] = useState<GistType[]>([]);
  useEffect(() => {
    setLoadingTable(true);
    handleFetchData();
    setLoadingTable(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleFetchData = async () => {
    try {
      const result = await api.get<GistType[]>(`/gists?userId=${_id}`);
      console.log("data - ", result.data);
      setListGist(result.data);
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
  const handleUpgradeBrandWidth = async (
    extendPlanId: string,
    gistId: string,
    bandWidth: number
  ) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `Bạn có muốn mua thêm ${bandWidth}GB băng thông`,
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
        await api.post("/upgrades/band-width", { gistId, extendPlanId });
        handleOk();
        handleFetchData();
        toast.success("Mua thêm băng thông thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    } finally {
      setLoading(false);
    }
  };
  const handleUpgradPlan = async (
    gistId: string,
    name: string,
    price: number,
    bandWidth: number,
    type: string
  ) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `Bạn có muốn gia hạn gói ${name}(${VND.format(
          price
        )}VND) ${bandWidth}GB/${type}`,
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
        width: 100,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">
            {record.keyId.dataLimit / 1000 / 1000 / 1000}GB
          </p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Data Usage</p>,
        dataIndex: "dataUsage",
        key: "dataUsage",
        width: 120,
        render: (_: string, record: GistType) => (
          <p className="font-primary text-sm">
            {(record.keyId.dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB
          </p>
        ),
      },
      {
        title: <p className="font-primary font-semibold">Trạng thái</p>,
        dataIndex: "bandWidth",
        key: "bandWidth",
        width: 150,
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
      },
      {
        title: <p className="font-primary font-semibold">Key</p>,
        dataIndex: "key",
        key: "key",
        render: (_: string, record: GistType) => {
          const key = `${linkGist}/${record.gistId}/raw/${record.fileName}#`;
          return (
            <div className="flex items-center gap-2">
              <p className="font-primary text-sm w-[350px] line-clamp-1">
                {key}
                {record.extension}
              </p>
              <Tooltip title="copy">
                <button
                  className="-translate-y-[2px]"
                  onClick={() => copyToClipboard(`${key}${record.extension}`)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                  </svg>
                </button>
              </Tooltip>
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
              placeholder={record.extension}
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
        fixed: "right",
        width: 250,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render: (_: string, record: GistType) =>
          record.status ? (
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-secondary40 font-medium text-white font-primary text-xs"
                onClick={() => {
                  setSelectRow(record._id);
                  showModal();
                }}
              >
                Mua thêm data
              </button>
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

  return (
    <RequireAuthPage rolePage={2}>
      {loading ? <Loading /> : null}
      <p className="mb-5">
        Vui lòng sửa tên key hoặc copy trực tiếp key và dán vào phần mềm theo
        hướng dẫn để sử dụng{" "}
        <Link to={""} className="text-primary underline decoration-primary">
          Link hướng dẫn
        </Link>
      </p>
      <Table
        dataSource={listGist}
        columns={columns}
        loading={loadingTable}
        scroll={{ x: 1500 }}
      />
      <Modal
        width={900}
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setSelectRow(undefined);
        }}
        footer={[]}
      >
        <Heading className="font-primary">Danh sách gói cước mở rộng</Heading>
        <div className="py-3 grid grid-cols-3 gap-5">
          {listExtendPlan.map((item) => (
            <div
              key={uuidv4()}
              className="p-5 shadow-xl rounded-lg font-primary space-y-3 flex flex-col justify-between"
            >
              <p className="font-semibold text-base text-center mb-5">
                {item.name}
              </p>
              <p className="text-center font-medium text-xl">
                {item.bandWidth}GB - {VND.format(item.price)}VND
              </p>
              <button
                className="px-4 py-2 rounded-lg bg-secondary40 font-medium text-white font-primary text-sm"
                onClick={() =>
                  selectRow &&
                  handleUpgradeBrandWidth(item._id, selectRow, item.bandWidth)
                }
              >
                Mua ngay
              </button>
            </div>
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

export default OrderPage;
