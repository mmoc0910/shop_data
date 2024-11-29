import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { DAY_FORMAT, messages } from "../../constants";
import Heading from "../../components/common/Heading";
import { Input } from "../../components/input";
import Button from "../../components/button/Button";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { api } from "../../api";
import { useEffect, useMemo, useState } from "react";
import { CollabType, CommisionType, UserState } from "../../type";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Link } from "react-router-dom";
import { setCollab } from "../../store/collab/collabSlice";
import { useDispatch } from "react-redux";
import { VND } from "../../utils/formatPrice";
import { PaginationProps, Table, TableColumnsType } from "antd";
import dayjs from "dayjs";

const schema = yup
  .object({
    value: yup.number().required("This field is required"),
    min: yup.number().required("This field is required"),
  })
  .required();

const CommisionAdminPage = () => {
  const [listUser, setListUser] = useState<UserState[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [commision, setCommision] = useState<CommisionType>();
  const [loading, setLoading] = useState<boolean>(false);
  const [totalItems, setTotalItems] = useState<number>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const listUserFilter = inputValue
    ? listUser.filter(
        (item) =>
          item?.username?.toLowerCase().includes(inputValue.toLowerCase()) ||
          item?.email?.toLowerCase().includes(inputValue.toLowerCase()) ||
          item?.phone?.toLowerCase().includes(inputValue.toLowerCase())
      )
    : listUser;
  useEffect(() => {
    fetchData();
  }, [page, pageSize]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await api.get<{
        resultList: UserState[];
        totalItems: number;
      }>(`/users`, {
        params: { page, pageSize, level: "1,2,3" },
      });
      // const data = result?.data?.resultList.filter(
      //   (i) => i.role !== 1 && i.level !== 0
      // );
      setListUser(result?.data?.resultList);
      setTotalItems(result.data.totalItems);
      // const data = result?.data?.resultList.filter((i) => i.role !== 1);
      // setListUser(data);
    } catch (error) {
      toast.error(messages.error);
    } finally {
      setLoading(false);
    }
  };
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  useEffect(() => {
    fetchCommision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (commision) {
      setValue("value", commision.value);
      setValue("min", commision.min);
    }
  }, [commision, setValue]);
  const onSubmit = async (data: { value: number; min: number }) => {
    try {
      await api.post("/commisions", data);
      //   handleOk();
      toast.success("Thành công");
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  const fetchCommision = async () => {
    try {
      const result = await api.get("/commisions");
      setCommision(result.data);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const columns: TableColumnsType<UserState> = useMemo(
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
        title: () => (
          <p className="text-sm font-semibold font-primary">Username</p>
        ),
        dataIndex: "username",
        key: "username",
        render: (text: string, record: UserState) => (
          <Link
            to={`/admin/account/${record._id}`}
            className="text-sm font-primary text-primary"
          >
            {text}
          </Link>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Mã giới thiệu</p>
        ),
        dataIndex: "introduceCode",
        key: "introduceCode",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Số dư</p>
        ),
        dataIndex: "money",
        key: "money",
        render: (text: number) => (
          <p className="text-sm font-primary">{VND.format(text)}VND</p>
        ),
        sorter: {
          compare: (a, b) => a.money - b.money,
          multiple: 1,
        },
        defaultSortOrder: "descend",
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Tổng nạp</p>
        ),
        dataIndex: "cash",
        key: "cash",
        render: (text: number) => (
          <p className="text-sm font-primary">{VND.format(text)}VND</p>
        ),
        sorter: {
          compare: (a, b) => a.cash - b.cash,
          multiple: 1,
        },
        defaultSortOrder: "descend",
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Số gói</p>
        ),
        dataIndex: "transaction",
        key: "transaction",width: 100,
        render: (_: string, record: UserState) => (
          <p className="text-sm font-primary">{record.transaction}</p>
        ),
        sorter: {
          compare: (a, b) => a.transaction - b.transaction,
          multiple: 2,
        },
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Đại lý</p>
        ),
        dataIndex: "level",
        key: "level",
        render: (_: string, record: UserState) => (
          <p className="text-sm cursor-pointer font-primary text-primary">
            {record.level === 0
              ? "Cộng tác viên"
              : `Đại lý cấp ${record.level}`}
          </p>
        ),
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Ngày tạo</p>
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
    []
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
  return (
    <div className="grid grid-cols-2 gap-10 lg:gap-20">
      <div className="col-span-2 space-y-6 md:col-span-1">
        <div className="space-y-6">
          <Heading>Chính sách CTV</Heading>
          <div className="">
            <p className="mb-5">
              Tỉ lệ % hoa hồng mà người dùng nhận được khi giới thiệu người
              dùng.
              <br />
              Chính sách hiện tại: {commision?.value}%
            </p>
            <form
              className="space-y-[15px] md:space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormGroup>
                <Label htmlFor="value">
                  Điều chỉnh chính sách hoa hồng mặc định:
                </Label>
                <div className="flex gap-6">
                  <Input
                    name="value"
                    type="number"
                    placeholder={"% Hoa hồng"}
                    control={control}
                    containerclass="flex-1"
                  >
                    <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
                      %
                    </span>
                  </Input>
                </div>
              </FormGroup>{" "}
              <FormGroup>
                <Label htmlFor="value">
                  Số tiền tối thiểu làm cộng tác viên
                </Label>
                <Input
                  name="min"
                  type="number"
                  // placeholder={"% Hoa hồng"}
                  control={control}
                  containerclass="flex-1"
                >
                  <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
                    VND
                  </span>
                </Input>
              </FormGroup>
              <Button type="submit" className="px-5 text-white bg-primary">
                Apply
              </Button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-span-2 space-y-6 md:col-span-1">
        <Heading>Chính sách Đại lý</Heading> <Collab />
      </div>
      <div className="col-span-2 space-y-4">
        <div className="flex flex-col justify-between md:flex-row md:items-center">
          <Heading>Danh sách đại lý</Heading>
          <p className="text-lg font-semibold">
            Tổng doanh thu đại lý:{" "}
            <span className="text-secondary20">
              {VND.format(1000000000)}VND
            </span>
          </p>
        </div>

        <div className="flex items-center gap-5">
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
        </div>
        <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
          <Table
            dataSource={listUserFilter.map((item, index) => ({
              index,
              ...item,
            }))}
            columns={columns}
            loading={loading}
            scroll={{ y: 420, x: 1120 }}
            pagination={{
              defaultCurrent: 1,
              total: totalItems,
              onChange: (index) => setPage(index),
              pageSize,
              onShowSizeChange: onShowSizeChange,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const schemaCollab = yup
  .object({
    level1: yup.number().required("This field is required"),
    level2: yup.number().required("This field is required"),
    level3: yup.number().required("This field is required"),
    minLevel1: yup.number().required("This field is required"),
    minLevel2: yup.number().required("This field is required"),
    minLevel3: yup.number().required("This field is required"),
  })
  .required();
const Collab = () => {
  // const [listUser, setListUser] = useState<AuthState[]>([]);
  const [collab, setcollab] = useState<CollabType>();
  const dispatch = useDispatch();
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schemaCollab),
    mode: "onSubmit",
  });

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const result = await api.get<{ resultList: AuthState[] }>(`/users`);
  //       const data = result?.data?.resultList.filter((i) => i.role !== 1);
  //       setListUser(data);
  //     } catch (error) {
  //       toast.error(messages.error);
  //     }
  //   })();
  // }, []);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (collab) {
      setValue("level1", collab.level1);
      setValue("level2", collab.level2);
      setValue("level3", collab.level3);
      setValue("minLevel1", collab.minLevel1);
      setValue("minLevel2", collab.minLevel2);
      setValue("minLevel3", collab.minLevel3);
    }
  }, [collab, setValue]);
  const fetchData = async () => {
    try {
      const result = await api.get<CollabType>("/collab");
      setcollab(result.data);
      dispatch(
        setCollab({
          level1: result.data.level1,
          level2: result.data.level2,
          level3: result.data.level3,
          minLevel1: result.data.minLevel1,
          minLevel2: result.data.minLevel2,
          minLevel3: result.data.minLevel3,
        })
      );
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  const onSubmit = async (data: {
    level1: number;
    level2: number;
    level3: number;
    minLevel1: number;
    minLevel2: number;
    minLevel3: number;
  }) => {
    try {
      await api.post("/collab", data);
      fetchData();
      toast.success("Thành công");
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  return (
    <RequireAuthPage rolePage={[1]}>
      <p className="mb-5">
        Tỉ lệ % chiết khấu mà Đại lý nhận được khi mua gói cước.
      </p>
      <form
        className="space-y-[15px] md:space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="value">
            Đại lý cấp 1: [Hiện tại có{" "}
            {/* {listUser.filter((item) => item.level === 1).length} đại lý.{" "} */}
            <TotalUser level={1} />{" "}
            <Link
              to={"/admin/account?level=1"}
              className="font-medium underline text-primary decoration-primary"
            >
              Chi tiết
            </Link>
            ]
          </Label>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="value">Mức chiết khấu</Label>
              <Input
                name="level1"
                type="number"
                placeholder={"% Hoa hồng"}
                control={control}
                containerclass="flex-1"
              >
                <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
                  %
                </span>
              </Input>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Mức doanh số tháng tối thiểu</Label>
              <Input
                name="minLevel1"
                type="number"
                control={control}
                containerclass="flex-1"
              >
                <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
                  VND
                </span>
              </Input>
            </div>
          </div>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="value">
            Đại lý cấp 2: [Hiện tại có{" "}
            {/* {listUser.filter((item) => item.level === 2).length} đại lý.{" "} */}
            <TotalUser level={2} />{" "}
            <Link
              to={"/admin/account?level=2"}
              className="font-medium underline text-primary decoration-primary"
            >
              Chi tiết
            </Link>
            ]
          </Label>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="value">Mức chiết khấu</Label>
              <Input
                name="level2"
                type="number"
                placeholder={"% Hoa hồng"}
                control={control}
                containerclass="flex-1"
              >
                <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
                  %
                </span>
              </Input>
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="value">Mức doanh số tháng tối thiểu</Label>
                <Input
                  name="minLevel2"
                  type="number"
                  control={control}
                  containerclass="flex-1"
                >
                  <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
                    VND
                  </span>
                </Input>
              </div>
            </div>
          </div>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="value">
            Đại lý cấp 3: [Hiện tại có{" "}
            {/* {listUser.filter((item) => item.level === 3).length} đại lý.{" "} */}
            <TotalUser level={3} />{" "}
            <Link
              to={"/admin/account?level=3"}
              className="font-medium underline text-primary decoration-primary"
            >
              Chi tiết
            </Link>
            ]
          </Label>
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="value">Mức chiết khấu</Label>
              <Input
                name="level3"
                type="number"
                placeholder={"% Hoa hồng"}
                control={control}
                containerclass="flex-1"
              >
                <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
                  %
                </span>
              </Input>
            </div>
            <div className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="value">Mức doanh số tháng tối thiểu</Label>
                <Input
                  name="minLevel3"
                  type="number"
                  control={control}
                  containerclass="flex-1"
                >
                  <span className="absolute font-semibold -translate-y-1/2 cursor-pointer right-5 top-1/2 text-icon-color">
                    VND
                  </span>
                </Input>
              </div>
            </div>
          </div>
        </FormGroup>
        <Button type="submit" className="px-5 text-white bg-primary">
          Apply
        </Button>
      </form>
    </RequireAuthPage>
  );
};

const TotalUser = ({ level }: { level: 1 | 2 | 3 }) => {
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<{
          resultList: UserState[];
          totalItems: number;
        }>(`/users`, {
          params: { level },
        });
        setTotal(result.data.totalItems);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);
  return total;
};

export default CommisionAdminPage;
