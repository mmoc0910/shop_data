import { Table, TableColumnsType, Tag, Tooltip } from "antd";
import { useMemo } from "react";
import { CloudManagerType } from "../../type";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { ButtonDeleteCloud } from "../../pages/admin/CloudAdminPage";
import { FC } from "react";
import Heading from "../common/Heading";
import { DAY_FORMAT } from "../../constants";
import classNames from "../../utils/classNames";
import { VND } from "../../utils/formatPrice";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../../api";

type Props = {
  heading: string;
  handleFetchData: () => void;
  listCloud: CloudManagerType[];
  clouds: { name: string; _id: string }[];
  providers: { name: string; _id: string }[];
  loading: boolean;
};

export const ListCloudManager: FC<Props> = ({
  heading,
  clouds,
  handleFetchData,
  listCloud,
  loading,
  providers,
}) => {
  const handleChangeStatus = async (_id: string, status: 0 | 1) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn đổi status cloud này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      console.log("isComfirm ~ ", isConfirmed);
      if (isConfirmed) {
        await api.patch(`/cloud-managers/${_id}`, {
          status,
        });
        handleFetchData();
        toast.success("Đổi trạng thái thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        // console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };
  const columns: TableColumnsType<CloudManagerType> = useMemo(
    () => [
      {
        title: () => <p className="font-semibold font-primary">No</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: number) => (
          <p className="text-sm font-primary">{text + 1}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Name</p>,
        dataIndex: "name",
        key: "name",
        render: (text: string, record) => (
          <Link
            to={`/admin/cloud/${record._id}`}
            className="text-sm font-primary text-primary"
          >
            {text}
          </Link>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Status</p>,
        dataIndex: "status",
        key: "status",
        render: (status: 0 | 1, record) => {
          // const remain = dayjs(record.endDate).diff(dayjs(), "days");
          return (
            <div className="flex items-center gap-5">
              <Tooltip
                title={
                  status === 0 && record?.dieDate
                    ? DAY_FORMAT(record.dieDate)
                    : ""
                }
              >
                <div
                  onClick={() =>
                    handleChangeStatus(record._id, status === 0 ? 1 : 0)
                  }
                  className={classNames(
                    "w-2 h-2 rounded-full shrink-0",
                    status === 1 ? "bg-primary20" : "bg-error"
                  )}
                ></div>
              </Tooltip>

              {/* {remain >= 0 ? (
                    <Tag color="green">Valid</Tag>
                  ) : (
                    <Tag color="red">Expired</Tag>
                  )} */}

              {/* {record > 0 ? (
                    <Tag color="green">Valid</Tag>
                  ) : (
                    <Tag color="red">Expired</Tag>
                  )} */}
              {/* {dayjs(
                    record.status === 0 ? record.dieDate : record.endDate
                  ).diff(dayjs(), "days") > 0 ? (
                    <Tag color="green">Valid</Tag>
                  ) : (
                    <Tag color="red">Expired</Tag>
                  )} */}
              {dayjs(record.endDate).diff(dayjs(), "days") > 0 ? (
                <Tag color="green">Valid</Tag>
              ) : (
                <Tag color="red">Expired</Tag>
              )}
            </div>
          );
        },
      },
      {
        title: <p className="font-semibold font-primary">Live/Valid</p>,
        dataIndex: "Live",
        key: "Live",
        render: (_, record) => {
          // const live = dayjs().diff(
          //   dayjs(
          //     record.status === 0 && record?.dieDate
          //       ? record.dieDate
          //       : record.startDate
          //   ),
          //   "days"
          // );
          // const valid = dayjs(record.endDate).diff(
          //   dayjs(record.startDate),
          //   "days"
          // );
          const live =
            record.live ||
            dayjs().diff(dayjs(record.startDate), "days");
          return (
            <p>
              {live} / {record.valid} days
            </p>
          );
        },
        width: 120,
      },
      {
        title: <p className="font-semibold font-primary">Date</p>,
        dataIndex: "date",
        key: "date",
        render: (_, record) => {
          return (
            <>
              <p className="text-sm font-primary">
                {dayjs(record.startDate).format("DD-MM-YYYY")}
              </p>
              <p className="text-sm font-primary">
                {dayjs(record.endDate).format("DD-MM-YYYY")}
              </p>
            </>
          );
        },
        width: 120,
      },
      // {
      //   title: <p className="font-semibold font-primary">Remain</p>,
      //   dataIndex: "remain",
      //   key: "remain",
      //   render: (text: number) => (
      //     <p className="text-sm font-primary">{text}</p>
      //   ),
      // },
      {
        title: <p className="font-semibold font-primary">Provider</p>,
        dataIndex: "provider",
        key: "provider",
        render: (_, record) => (
          <p className="text-sm font-primary">
            {providers.find((item) => item._id === record.providerId)?.name}
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Cloud</p>,
        dataIndex: "cloud",
        key: "cloud",
        render: (_, record) => (
          <p className="text-sm font-primary">
            {clouds.find((item) => item._id === record.cloudId)?.name}
          </p>
        ),
      },
      // {
      //   title: <p className="font-semibold font-primary">Key</p>,
      //   dataIndex: "key",
      //   key: "key",
      //   render: (text: number) => (
      //     <p className="text-sm font-primary">{text}</p>
      //   ),
      // },
      {
        title: <p className="font-semibold font-primary">Server</p>,
        dataIndex: "server",
        key: "server",
        render: (text: number) => (
          <p className="text-sm font-primary">{text}</p>
        ),
        width: 80,
      },
      {
        title: <p className="font-semibold font-primary">Price</p>,
        dataIndex: "price",
        key: "price",
        render: (text: number) => (
          <p className="text-sm font-primary">{VND.format(text)}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary"></p>,
        dataIndex: "action",
        key: "action",
        render: (_, record) => (
          <ButtonDeleteCloud
            cloudId={record._id}
            cloudName={record.name}
            handleFetchData={handleFetchData}
          />
        ),
        width: 80,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clouds, providers, listCloud]
  );
  return (
    <div className="space-y-7">
      <Heading>{heading}</Heading>
      <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
        <Table
          loading={loading}
          dataSource={listCloud}
          columns={columns}
          scroll={{ x: 1000, y: 400 }}
        />
      </div>
    </div>
  );
};
