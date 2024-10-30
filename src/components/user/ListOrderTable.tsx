import React, { useEffect, useMemo, useState } from "react";
import { ExtendPlanType } from "../../type";
import { RoseExtendType } from "../../type";
import { ServerType } from "../../type";
import Swal from "sweetalert2";
import axios from "axios";
import { api } from "../../api";
import { Modal, Table, TableColumnsType, Tag, Tooltip } from "antd";
import { GistType } from "../../type";
import { useFormatPrice } from "../../hooks/useFormatPrice";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { AndroidXML, ExtendPlanItem } from "../../pages/user/OrderPage";
import UpdateExtension from "./UpdateExtension";
import { toast } from "react-toastify";
import { DAY_FORMAT, messages, translateType } from "../../constants";
import dayjs from "dayjs";
import IconDocumentPlus from "../../icons/IconDocumentPlus";
import IconArrowPathRoundSquare from "../../icons/IconArrowPathRoundSquare";
import MoveServer from "./MoveServer";
import { PaginationProps } from "antd";
import Loading from "../common/Loading";
import Heading from "../common/Heading";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { FC } from "react";
import { UserState } from "../../type";
import { Key } from "react";

type Props = { status: 0 | 1 };
export const ListOrderTable: FC<Props> = ({ status }) => {
  const priceFomat = useFormatPrice();
  const { t, i18n } = useTranslation();
  const navigation = useNavigate();
  const [loadingTable, setLoadingTable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectRow, setSelectRow] = useState<
    { id: string; endDate: Date } | undefined
  >();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [listExtendPlan, setListExtendPlan] = useState<ExtendPlanType[]>([]);
  const { _id } = useSelector((state: RootState) => state.auth);
  const [listGist, setListGist] = useState<{
    data: GistType[];
    totalItems: number;
  }>();
  const [inputValue, setInputValue] = useState<string>("");
  const [roseExtend, setRoseExtend] = useState<RoseExtendType>();
  const [servers, setServers] = useState<ServerType[]>([]);
  const [canMigrate, setCanMigrate] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {
        const [{ data: infoUser }, { data: dataServers }] = await Promise.all([
          api.get<UserState>(`/users/${_id}`),
          api.get<ServerType[]>("/servers/server-to-migrate?status=1"),
        ]);
        console.log(infoUser, dataServers);
        setServers(dataServers);
        setCanMigrate(infoUser.canMigrate);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [_id]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<RoseExtendType>("/rose-extends");
        setRoseExtend(result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  useEffect(() => {
    handleFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, inputValue, pageSize]);
  const handleFetchData = async () => {
    try {
      setLoadingTable(true);
      const result = await api.get<{
        data: GistType[];
        totalItems: number;
      }>(`/gists`, {
        params: {
          userId: _id,
          page,
          extension: inputValue,
          pageSize,
          status,
        },
      });
      setListGist({
        data: result.data.data,
        totalItems: result.data.totalItems,
      });
      console.log("abc");
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    } finally {
      setLoadingTable(false);
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
        title: `<p class="leading-tight">${t(
          "page.myOrder.swal.extend.title"
        )} <span class="text-secondary">${name}(${priceFomat(
          price
        )}) ${bandWidth}GB/${translateType(type, i18n.language)}</span></p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: t("page.myOrder.swal.extend.cancelButton"),
        confirmButtonText: t("page.myOrder.swal.extend.confirmButton"),
      });
      if (isConfirmed) {
        setLoading(true);
        await api.post("/upgrades/plan", { gistId });
        handleOk();
        handleFetchData();
        toast.success(t("page.myOrder.swal.extend.success"));
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
          toast.warn(t("page.myOrder.swal.extend.error"));
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
      // {
      //   title: () => <p className="font-semibold font-primary text-sm"></p>,
      //   dataIndex: "index",
      //   key: "index",
      //   width: 50,
      //   fixed: "left",
      //   render: (text: string) => (
      //     <p className="text-sm font-primary">{text + 1}</p>
      //   ),
      // },
      {
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.code")}
          </p>
        ),
        dataIndex: "code",
        key: "code",
        width: 150,
        render: (text: string) => (
          <p className="text-sm font-primary text-primary">{text}</p>
        ),
      },
      {
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.package")}
          </p>
        ),
        dataIndex: "name",
        key: "name",
        width: 100,
        render: (_: string, record: GistType) => (
          <p className="text-sm font-primary">{record.planId?.name}</p>
        ),
      },
      {
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.key")}
          </p>
        ),
        dataIndex: "key",
        key: "key",
        width: 120,
        render: (_: string, record: GistType) => {
          // const key = `${linkGist}/${record.gistId}/raw/${record?.fileName}#`;
          const {
            keyId: { accessUrl, keyId, serverId },
          } = record;
          return (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tooltip title="Copy link chính">
                  <button
                    className="text-white px-2 w-fit aspect-square rounded-md bg-secondary20"
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
                <Tooltip title="Copy link dự phòng">
                  <button
                    className="text-white px-2 w-fit aspect-square rounded-md bg-gray-400"
                    onClick={() =>
                      copyToClipboard(
                        `${accessUrl}#${
                          typeof serverId === "object"
                            ? serverId?.name
                            : serverId
                        }-k${keyId}`
                      )
                    }
                  >
                    <AndroidXML />
                  </button>
                </Tooltip>
              </div>
            </div>
          );
        },
      },
      {
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.extension")}
          </p>
        ),
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
        title: <p className="font-semibold font-primary text-sm">Location</p>,
        dataIndex: "location",
        key: "location",
        width: 100,
        render: (_: string, record: GistType) => {
          return (
            <p className="text-sm font-primary">
              {typeof record.keyId.serverId === "object"
                ? record.keyId.serverId?.location
                : record.keyId.serverId}
            </p>
          );
        },
      },
      {
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.status")}
          </p>
        ),
        dataIndex: "status",
        key: "status",
        width: 100,
        // fixed: "right",
        render: (_: string, record: GistType) => (
          <div className="text-sm font-primary">
            {record.status === 1 && (
              <Tag color="green">
                <span className="font-primary">
                  {t("page.myOrder.field.statusLabel.active")}
                </span>
              </Tag>
            )}
            {record.status === 0 && (
              <Tag color="red">
                <span className="font-primary">
                  {t("page.myOrder.field.statusLabel.inactive")}
                </span>
              </Tag>
            )}
          </div>
        ),
        filters: [
          {
            text: t("page.myOrder.field.statusLabel.active"),
            value: 1,
          },
          {
            text: t("page.myOrder.field.statusLabel.inactive"),
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
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.day")}
          </p>
        ),
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
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.useage")}
          </p>
        ),
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
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.dataLimit")}
          </p>
        ),
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
      {
        title: (
          <p className="font-semibold font-primary text-sm">
            {t("page.myOrder.field.dateExpand")}
          </p>
        ),
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
        title: <p className="font-semibold font-primary text-sm"></p>,
        dataIndex: "action",
        key: "action",
        width: 120,
        render: (_: string, record: GistType) =>
          record.status ? (
            <div className="flex gap-3 lg:gap-2 justify-end w-[150px] lg:w-[250px] px-5">
              {!record.keyId.endExpandDate ||
              (record.keyId.endExpandDate &&
                dayjs().isAfter(record.keyId.endExpandDate, "day") &&
                record.planId.price > 0) ? (
                // <button
                //   className="px-2 py-1 text-xs font-medium text-white rounded-lg bg-secondary40 font-primary shrink-0"
                //   onClick={() => {
                //     setSelectRow({
                //       id: record._id,
                //       endDate: record.keyId.endDate,
                //     });
                //     showModal();
                //   }}
                // >
                //   {t("page.myOrder.field.buyData")}
                // </button>
                <Tooltip title={t("page.myOrder.field.buyData")}>
                  <button
                    className="px-2 aspect-square grow-0 w-fit text-xs font-medium text-white rounded-md bg-primary font-primary"
                    onClick={() => {
                      setSelectRow({
                        id: record._id,
                        endDate: record.keyId.endDate,
                      });
                      showModal();
                    }}
                  >
                    <IconDocumentPlus className="size-4" />
                  </button>
                </Tooltip>
              ) : null}
              <Tooltip title={t("page.myOrder.field.extend")}>
                <button
                  className="px-2 aspect-square grow-0 w-fit text-xs font-medium text-white rounded-md bg-primary font-primary"
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
                  <IconArrowPathRoundSquare className="size-4" />
                </button>
              </Tooltip>
              {/* <button
                  className="px-2 py-1 text-xs font-medium text-white rounded-lg bg-primary font-primary shrink-0"
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
                  {t("page.myOrder.field.extend")}
                </button> */}
              {canMigrate && (
                <MoveServer
                  servers={servers}
                  // gist={record}
                  gist={{
                    key_id: record.keyId._id,
                    key_name: record.keyId.name,
                    // server_id: record.keyId.serverId,
                    server_id:
                      typeof record.keyId.serverId === "object"
                        ? record.keyId.serverId._id
                        : "",
                  }}
                  handleReloadData={handleFetchData}
                />
              )}
            </div>
          ) : null,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, canMigrate, i18n.language, servers]
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };
  const onShowSizeChange: PaginationProps["onShowSizeChange"] = (
    _current,
    pageSize
  ) => {
    setPage(1);
    setPageSize(pageSize);
  };
  if (!listGist) return null;
  return (
    <div>
      {loading ? <Loading /> : null}
      <div className="items-center block gap-5 pb-5 space-y-3 md:flex md:space-y-0">
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
        {/* <div className="flex items-center gap-5">
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
  </div> */}
      </div>
      <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
        <Table
          // dataSource={listGist.data.map((item, index) => ({ index, ...item }))}
          dataSource={listGist.data}
          columns={columns}
          loading={loadingTable}
          scroll={{ x: 1400, y: 500 }}
          pagination={{
            defaultCurrent: 1,
            total: listGist.totalItems,
            onChange: (index) => setPage(index),
            pageSize,
            onShowSizeChange,
          }}
        />
      </div>
      <Modal
        width={1200}
        open={isModalOpen}
        onCancel={() => {
          handleCancel();
          setSelectRow(undefined);
        }}
        footer={[]}
      >
        <Heading className="font-primary">
          {t("page.myOrder.swal.buyData.title2")}
        </Heading>
        <div className="grid grid-cols-1 gap-5 py-3 md:grid-cols-2 lg:grid-cols-3">
          {roseExtend &&
            listExtendPlan.map((item) => (
              <ExtendPlanItem
                key={uuidv4()}
                extendPlan={item}
                onSubmit={() => {
                  handleOk();
                  handleFetchData();
                }}
                selectRow={selectRow}
                setLoading={(value: boolean) => setLoading(value)}
                roseExtend={roseExtend}
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
            {t("page.myOrder.swal.buyData.cancelModal")}
          </button>
        </div>
      </Modal>
    </div>
  );
};
