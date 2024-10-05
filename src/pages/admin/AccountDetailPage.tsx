import { useParams } from "react-router-dom";
import {
  CashType,
  CommisionType,
  SatisfyType,
  TransactionType,
  UserState,
} from "../../type";
import { countries, DAY_FORMAT, purposes } from "../../constants";
import { Table, TableColumnsType, Tag, Tooltip } from "antd";
import { Key, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  // linkGist,
  messages,
} from "../../constants";
import { api } from "../../api";
import dayjs from "dayjs";
import Heading from "../../components/common/Heading";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../../components/checkbox";
import { useFormatPrice } from "../../hooks/useFormatPrice";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import ListOrder from "../../components/user/ListOrder";
import { FormProvider, useForm } from "react-hook-form";
import { SearchOrderBar } from "../../components/user/SearchOrderBar";
import { AdminManualDeposit } from "../../components/user/AdminManualDeposit";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import IconQuesionMarkCircle from "../../icons/IconQuesionMarkCircle";

const AccountDetailPage = () => {
  const { t } = useTranslation();
  const methods = useForm({
    mode: "all",
    defaultValues: { extensionSearchTerm: "" },
  });
  const priceFomat = useFormatPrice();
  const { accountId } = useParams();
  const { role } = useSelector((state: RootState) => state.auth);
  const [satisfy, setSatify] = useState<{
    cash: number;
    rose: number;
    currentMoney: number;
    numberIntoduce: number;
    transaction: number;
    discount: number;
  }>();
  const [commision, setCommision] = useState<{ value: number; min: number }>();
  const [user, setUser] = useState<UserState>();
  const [canMigrate, setCanMigrate] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      if (accountId)
        try {
          const [{ data: dataSatify }, { data: dataCommision }] =
            await Promise.all([
              api.get<SatisfyType>(`/satisfy/${accountId}`),
              api.get<CommisionType>("/commisions"),
            ]);
          setSatify({
            cash: dataSatify.cash[0]?.money || 0,
            rose: dataSatify.rose[0]?.money || 0,
            currentMoney: dataSatify.currentMoney,
            numberIntoduce: dataSatify.numberIntoduce,
            transaction: dataSatify.transaction[0]?.money || 0,
            discount: dataSatify.discount[0]?.totalAdjustedMoney || 0,
          });
          setCommision({ value: dataCommision.value, min: dataCommision.min });
        } catch (error) {
          console.log("error - ", error);
        }
    })();
  }, [accountId]);
  useEffect(() => {
    if (accountId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);
  const fetchData = async () => {
    try {
      const resultUser = await api.get<UserState>(`/users/${accountId}`);
      setUser(resultUser.data);
      setCanMigrate(resultUser.data.canMigrate);
    } catch (error) {
      console.log("error - ", error);
      // toast.error(messages.error);
    }
  };
  const handleUpdateUser = async (userId: string, canMigrate: boolean) => {
    try {
      await api.patch(`/users/${userId}`, { canMigrate });
      fetchData;
      toast("Success");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <RequireAuthPage rolePage={[1, 3]}>
      <FormProvider {...methods}>
        <div className="space-y-10">
          {satisfy && commision && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 rounded-xl border-2 border-[#eeeeed]">
              <div className="flex-1 p-5 space-y-3">
                <p className="text-base text-gray-500 lg:text-lg">
                  {t("page.dashboard.satify.cash")}
                </p>
                <p className="text-xl font-medium md:text-2xl">
                  {priceFomat(satisfy.cash)}
                </p>
              </div>
              <div className="flex-1 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-base text-gray-500 lg:text-lg">
                    {t("page.dashboard.satify.currentMoney")}
                  </p>
                  <Tooltip title={t("page.dashboard.satify.currentMoneyNode")}>
                    <span className="cursor-pointer text-[#3d6dae]">
                      <IconQuesionMarkCircle />
                    </span>
                  </Tooltip>
                </div>
                <p className="text-xl font-medium md:text-2xl">
                  {priceFomat(satisfy?.currentMoney || 0)}
                </p>
              </div>
              <div className="flex-1 hidden p-5 space-y-3 md:block">
                <p className="text-base text-gray-500 lg:text-lg">
                  {t("page.dashboard.satify.transaction")}
                </p>
                <div className="">
                  <p className="text-xl font-medium md:text-2xl text-error">
                    {priceFomat(satisfy.transaction)}
                  </p>
                </div>
              </div>
              <div className="flex-1 hidden p-5 space-y-3 md:block">
                <p className="text-base text-gray-500 lg:text-lg">
                  Total Earn
                </p>
                <div className="">
                  <p className="text-xl font-medium md:text-2xl text-error">
                   {priceFomat(satisfy.discount)} 
                  </p>
                </div>
              </div>
              <div className="flex-1 hidden p-5 space-y-3 md:block">
                <div className="flex items-center gap-2">
                  <p className="text-base text-gray-500 lg:text-lg">
                    {t("page.dashboard.satify.rose")}
                  </p>
                  <Tooltip
                    title={t("page.dashboard.satify.roseNode", {
                      amount: commision,
                    })}
                  >
                    <span className="cursor-pointer text-[#3d6dae]">
                      <IconQuesionMarkCircle />
                    </span>
                  </Tooltip>
                </div>
                <p className="text-xl font-medium md:text-2xl">
                  {priceFomat(satisfy.rose)}
                </p>
              </div>
              <div className="flex-1 hidden p-5 space-y-3 md:block">
                <p className="text-base text-gray-500 lg:text-lg">
                  {t("page.dashboard.satify.numberIntoduce")}
                </p>
                <p className="text-xl font-medium md:text-2xl">
                  {satisfy.numberIntoduce}
                </p>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Heading>Chi tiết người dùng</Heading>
              <div className="flex items-center gap-5">
                <Checkbox
                  checked={canMigrate}
                  onClick={() => setCanMigrate((prev) => !prev)}
                >
                  Can Migrate
                </Checkbox>
                <button
                  className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-primary font-primary shrink-0"
                  onClick={() =>
                    accountId && handleUpdateUser(accountId, canMigrate)
                  }
                >
                  Apply
                </button>
              </div>
            </div>
            {user ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                <p>
                  Tên người dùng:{" "}
                  <span className="font-medium">{user.username}</span>
                </p>
                <p>
                  Email: <span className="font-medium">{user.email}</span>
                </p>
                <p>
                  Số điện thoại:{" "}
                  <span className="font-medium">{user.phone}</span>
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
                {/* <p>
              Tổng nạp:{" "}
              <span className="font-medium">
                {user?.cash ? VND.format(user.cash) : 0}VND
              </span>
            </p> */}
                <p>
                  Số dư:{" "}
                  <span className="font-medium"> {priceFomat(user.money)}</span>
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
          {role && role === 1 && (
            <AdminManualDeposit accountId={accountId || ""} />
          )}

          <div>
            <Heading className="mb-4">Danh sách key đã mua còn hạn</Heading>
            <SearchOrderBar />
            <ListOrder accountId={accountId as string} status={1} />
          </div>
          <div>
            <Heading className="mb-4">Danh sách key đã mua hết hạn</Heading>
            <SearchOrderBar />
            <ListOrder accountId={accountId as string} status={0} />
          </div>
          {/* <OrderKeyUser accountId={accountId as string} /> */}
          <HistoryCashUser accountId={accountId as string} />
          <HistoryTransactionUser accountId={accountId as string} />
        </div>
      </FormProvider>
    </RequireAuthPage>
  );
};

// const OrderKeyUser = ({ accountId }: { accountId: string }) => {
//   const [loadingTable, setLoadingTable] = useState<boolean>(false);
//   const [listGist, setListGist] = useState<GistType[]>([]);
//   const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>();
//   const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>();
//   const [inputValue, setInputValue] = useState<string>("");
//   const [servers, setServers] = useState<ServerType[]>([]);
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoadingTable(true);
//         const { data: dataServers } = await api.get<ServerType[]>(
//           "/servers/normal-server?status=1"
//         );
//         setServers(dataServers);
//       } catch (error) {
//         console.log(error);
//       } finally {
//         setLoadingTable(false);
//       }
//     })();
//   }, []);
//   const listGistFilter =
//     startDate && endDate && !inputValue
//       ? listGist.filter(
//           (item) =>
//             isSameOrAfter(item.keyId.startDate, startDate) &&
//             isSameOrBefore(item.keyId.endDate, endDate)
//         )
//       : startDate && endDate && inputValue
//       ? listGist.filter(
//           (item) =>
//             item?.planId &&
//             (item.planId.name
//               .toLowerCase()
//               .includes(inputValue.toLowerCase()) ||
//               item.extension
//                 .toLowerCase()
//                 .includes(inputValue.toLowerCase())) &&
//             isSameOrAfter(item.keyId.startDate, startDate) &&
//             isSameOrBefore(item.keyId.endDate, endDate)
//         )
//       : inputValue
//       ? listGist.filter(
//           (item) =>
//             item?.planId &&
//             (item.planId.name
//               .toLowerCase()
//               .includes(inputValue.toLowerCase()) ||
//               item.extension.toLowerCase().includes(inputValue.toLowerCase()))
//         )
//       : listGist;
//   useEffect(() => {
//     setLoadingTable(true);
//     handleFetchData();
//     setLoadingTable(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);
//   const handleFetchData = async () => {
//     try {
//       const result = await api.get<GistType[]>(`/gists?userId=${accountId}`);
//       setListGist(result.data.filter((item) => item.status !== 2));
//     } catch (error) {
//       console.log("error - ", error);
//       toast.error(messages.error);
//     }
//   };

//   const handleUpdateExtension = async (_id: string, value: string) => {
//     try {
//       await api.patch(`/gists/extension/${_id}`, { extension: value });
//     } catch (error) {
//       toast.error(messages.error);
//     }
//   };

//   const columns: TableColumnsType<GistType> = useMemo(
//     () => [
//       {
//         title: () => (
//           <p className="text-base font-semibold font-primary">STT</p>
//         ),
//         dataIndex: "index",
//         key: "index",
//         width: 70,
//         render: (text: string, record: GistType) => (
//           <Link
//             to={`/admin/key/${record.keyId._id}`}
//             className="text-sm font-primary text-primary"
//           >
//             {text + 1}
//           </Link>
//         ),
//       },
//       {
//         title: <p className="font-semibold font-primary">Order code</p>,
//         dataIndex: "code",
//         key: "code",
//         render: (text: string, record: GistType) => (
//           <Link
//             to={`/admin/key/${record.keyId._id}`}
//             className="text-sm font-primary text-primary"
//           >
//             {text}
//           </Link>
//         ),
//       },
//       {
//         title: <p className="font-semibold font-primary">Tên gói</p>,
//         dataIndex: "name",
//         key: "name",
//         width: 150,
//         render: (_: string, record: GistType) => (
//           <p className="text-sm font-primary">{record.planId?.name}</p>
//         ),
//       },
//       {
//         title: <p className="font-semibold font-primary">Key</p>,
//         dataIndex: "key",
//         key: "key",
//         // fixed: "right",
//         render: (_: string, record: GistType) => {
//           const {
//             keyId: { accessUrl, keyId, serverId },
//           } = record;
//           // const key = `${linkGist}/${record.gistId}/raw/${record?.fileName}#`;
//           return (
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Tooltip title="Copy link chính">
//                   <button
//                     className="text-white px-2 w-fit aspect-square rounded-md bg-secondary20"
//                     onClick={() =>
//                       copyToClipboard(
//                         `${record.keyId.awsId?.fileName.replace(
//                           /https/g,
//                           "ssconf"
//                         )}#${record.extension}`
//                       )
//                     }
//                   >
//                     <AndroidXML />
//                   </button>
//                 </Tooltip>
//                 <Tooltip title="Copy link dự phòng">
//                   <button
//                     className="text-white px-2 w-fit aspect-square rounded-md bg-gray-400"
//                     onClick={() =>
//                       copyToClipboard(`${accessUrl}#${serverId}-k${keyId}`)
//                     }
//                   >
//                     <AndroidXML />
//                   </button>
//                 </Tooltip>
//                 {/* <p className="font-primary text-sm w-[200px] line-clamp-1">
//                   {record.keyId.awsId?.fileName.replace(/https/g, "ssconf")}#
//                   {record.extension}
//                 </p> */}
//               </div>
//               {/* <div className="flex items-center gap-2">
//                 <Tooltip title="copy">
//                   <button
//                     onClick={() => copyToClipboard(`${key}${record.extension}`)}
//                   >
//                     <AndroidXML />
//                   </button>
//                 </Tooltip>
//                 <p className="font-primary text-sm w-[350px] line-clamp-1">
//                   {key}
//                   {record.extension}
//                 </p>
//               </div> */}
//             </div>
//           );
//         },
//       },
//       {
//         title: <p className="font-semibold font-primary">Tên key</p>,
//         dataIndex: "extension",
//         key: "extension",
//         // width: 150,
//         render: (_: string, record: GistType) => {
//           return (
//             <UpdateExtension
//               initialValue={record.extension}
//               onSubmit={(value: string) => {
//                 handleUpdateExtension(record._id, value);
//                 handleFetchData();
//                 toast.success("Thay đổi thành công");
//               }}
//             />
//           );
//         },
//       },
//       {
//         title: <p className="font-semibold font-primary">Trạng thái</p>,
//         dataIndex: "status",
//         key: "status",
//         width: 130,
//         render: (_: number, record: GistType) => (
//           <div className="text-sm font-primary">
//             {record.status === 1 && (
//               <Tag color="green">
//                 <span className="font-primary">Còn hạn</span>
//               </Tag>
//             )}
//             {record.status === 0 && (
//               <Tag color="red">
//                 <span className="font-primary">Hết hạn</span>
//               </Tag>
//             )}
//             {record.status === 2 && (
//               <Tag color="blue">
//                 <span className="font-primary">Migrate</span>
//               </Tag>
//             )}
//           </div>
//         ),
//         filters: [
//           {
//             text: "Còn hạn",
//             value: 1,
//           },
//           {
//             text: "Hết hạn",
//             value: 0,
//           },
//           // {
//           //   text: "Migrate",
//           //   value: 2,
//           // },
//         ],
//         onFilter: (value: boolean | Key, record: GistType) => {
//           if (typeof value === "boolean") {
//             // Xử lý trường hợp value là boolean
//             return record.status === (value ? 1 : 0);
//           } else {
//             // Xử lý trường hợp value là Key (đối với trường hợp khi dùng dropdown filter)
//             return record.status === value;
//           }
//         },
//       },
//       {
//         title: <p className="font-semibold font-primary">Thời gian</p>,
//         dataIndex: "day",
//         key: "day",
//         width: 120,
//         render: (_: string, record: GistType) => (
//           <p className="text-sm font-primary">
//             {dayjs(record.keyId.startDate).format("DD/MM/YYYY")} <br />-{" "}
//             {dayjs(record.keyId.endDate).format("DD/MM/YYYY")}
//           </p>
//         ),
//       },
//       {
//         title: <p className="font-semibold font-primary">Data limit</p>,
//         dataIndex: "bandWidth",
//         key: "bandWidth",
//         width: 120,
//         render: (_: string, record: GistType) => (
//           <p className="text-sm font-primary">
//             {record.keyId.dataLimit / 1000 / 1000 / 1000}GB/
//             {record.keyId.dataExpand / 1000 / 1000 / 1000}GB
//           </p>
//         ),
//         sorter: {
//           compare: (a: GistType, b: GistType) =>
//             a.keyId.dataLimit - b.keyId.dataLimit,
//           multiple: 1,
//         },
//       },
//       {
//         title: <p className="font-semibold font-primary">Data Usage</p>,
//         dataIndex: "dataUsage",
//         key: "dataUsage",
//         width: 150,
//         render: (_: string, record: GistType) => (
//           <p className="text-sm font-primary">
//             {record.keyId.dataUsage
//               ? `${(record.keyId.dataUsage / 1000 / 1000 / 1000).toFixed(2)}GB`
//               : "0GB"}
//           </p>
//         ),
//         sorter: {
//           compare: (a, b) => a.keyId.dataUsage - b.keyId.dataUsage,
//           multiple: 2,
//         },
//       },
//       // {
//       //   title: (
//       //     <p className="font-semibold font-primary text-sm">Date Expand</p>
//       //   ),
//       //   dataIndex: "endExpandDate",
//       //   key: "endExpandDate",
//       //   width: 120,
//       //   render: (_: string, record: GistType) => (
//       //     <p className="text-sm font-primary">
//       //       {record.keyId?.endExpandDate &&
//       //         DAY_FORMAT(record.keyId.endExpandDate)}
//       //     </p>
//       //   ),
//       // },
//       {
//         title: <p className="font-semibold font-primary text-sm"></p>,
//         dataIndex: "action",
//         key: "action",
//         // width: 100,
//         render: (_: string, record: GistType) =>
//           record.status ? (
//             <MoveServer
//               servers={servers}
//               gist={{
//                 key_id: record.keyId._id,
//                 key_name: record.keyId.name,
//                 server_id: record.keyId.serverId as string,
//               }}
//               handleReloadData={handleFetchData}
//             />
//           ) : null,
//       },
//     ],
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     [servers]
//   );

//   const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
//     setStartDate(date);
//   };
//   const onChangeEndDate: DatePickerProps["onChange"] = (date) => {
//     setEndDate(date);
//   };

//   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = event.target.value;
//     setInputValue(value);
//   };
//   return (
//     <RequireAuthPage rolePage={[1, 3]}>
//       <Heading className="mb-4">Danh sách key đã mua</Heading>
//       <div className="items-center block gap-5 mb-5 space-y-3 md:flex md:space-y-0">
//         <div className="relative flex-1">
//           <input
//             type="text"
//             value={inputValue}
//             onChange={handleChange}
//             className="focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
//             placeholder="Tìm kiếm"
//           />
//           {inputValue.length > 0 ? (
//             <span
//               className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
//               onClick={() => setInputValue("")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 className="w-5 h-5 text-icon-color"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </span>
//           ) : null}
//         </div>
//         <div className="flex items-center gap-5">
//           <DatePicker
//             onChange={onChangeStartDate}
//             className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
//             placeholder="Start date"
//           />
//           <DatePicker
//             onChange={onChangeEndDate}
//             className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
//             placeholder="End date"
//           />
//         </div>
//       </div>
//       <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
//         <Table
//           dataSource={listGistFilter.map((item, index) => ({ index, ...item }))}
//           columns={columns}
//           loading={loadingTable}
//           scroll={{ x: 1120 }}
//         />
//       </div>
//     </RequireAuthPage>
//   );
// };

const HistoryCashUser = ({ accountId }: { accountId: string }) => {
  const priceFomat = useFormatPrice();
  const { i18n, t } = useTranslation();
  const [listCash, setListCash] = useState<CashType[]>([]);
  const [isloading, setIsLoading] = useState(false);
  useEffect(() => {
    if (isloading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isloading, accountId]);
  const fetchData = useCallback(async () => {
    try {
      const result = await api.get<CashType[]>(`/cashs?userId=${accountId}`);
      setListCash(result.data.map((item, index) => ({ index, ...item })));
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  }, [accountId]);
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
        render: (text: string) => (
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
  return (
    <div className="space-y-5">
      <div onClick={() => setIsLoading(true)}>
        <Heading className="mb-4 cursor-pointer">Lịch sử nạp tiền</Heading>
      </div>

      {isloading && (
        <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
          <Table
            dataSource={listCash}
            columns={columns}
            scroll={{ x: 1300, y: 600 }}
          />
        </div>
      )}
    </div>
  );
};
const HistoryTransactionUser = ({ accountId }: { accountId: string }) => {
  const priceFomat = useFormatPrice();
  const { t, i18n } = useTranslation();
  const [isloading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const fetchUserCashHistory = async () => {
    try {
      setLoading(true);
      const result = await api.get<TransactionType[]>(
        `/transactions?userId=${accountId}&approve=true`
      );
      setTransactions(result.data.map((item, index) => ({ index, ...item })));
    } catch (error) {
      toast.error(messages.error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isloading) fetchUserCashHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isloading, accountId]);
  const columns: TableColumnsType<TransactionType> = useMemo(
    () => [
      {
        title: () => <p className="text-base font-semibold font-primary"></p>,
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
            {t("page.transaction.field.code")}
          </p>
        ),
        dataIndex: "code",
        key: "code",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
        // responsive: ["md"],
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.package")}
          </p>
        ),
        dataIndex: "name",
        key: "name",
        render: (_: string, record: TransactionType) => (
          <p className="text-sm font-primary">
            {record.extendPlanId
              ? record.extendPlanId.name
              : record.planId?.name}
          </p>
        ),
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.pricePackage")}
          </p>
        ),
        dataIndex: "price",
        key: "price",
        render: (_: string, record: TransactionType) => (
          <p className="text-sm font-primary">
            {priceFomat(record.money / ((100 - record.discount) / 100))}
          </p>
        ),
        sorter: {
          compare: (a, b) =>
            a.money / ((100 - a.discount) / 100) -
            b.money / ((100 - b.discount) / 100),
          multiple: 3,
        },
      },
      {
        title: <p className="font-semibold font-primary">CK</p>,
        dataIndex: "discount",
        key: "discount",
        render: (_: string, record: TransactionType) => (
          <p className="text-sm font-primary">{record.discount}%</p>
        ),
        sorter: {
          compare: (a, b) => a.discount - b.discount,
          multiple: 2,
        },
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.disCountPrice")}
          </p>
        ),
        dataIndex: "money",
        key: "money",
        render: (_: string, record: TransactionType) => (
          <p className="text-sm font-primary">{priceFomat(record.money)}</p>
        ),
        sorter: {
          compare: (a, b) => a.money - b.money,
          multiple: 1,
        },
      },
      {
        title: (
          <p className="font-semibold font-primary">
            {t("page.transaction.field.createdAt")}
          </p>
        ),
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
        sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
  );
  return (
    <div className="space-y-5">
      <div onClick={() => setIsLoading(true)}>
        <Heading className="mb-4 cursor-pointer">Lịch sử mua gói</Heading>
      </div>
      {isloading && (
        <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
          <Table
            dataSource={transactions}
            columns={columns}
            loading={loading}
            scroll={{ x: 1180 }}
          />
        </div>
      )}
    </div>
  );
};

export default AccountDetailPage;
