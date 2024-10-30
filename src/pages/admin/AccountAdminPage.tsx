import { Key, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { DAY_FORMAT, messages } from "../../constants";
import { api } from "../../api";
import { Modal, PaginationProps, Table, TableColumnsType } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import Button from "../../components/button/Button";
import Radio from "../../components/radio/Radio";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { UserState } from "../../type";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { useFormatPrice } from "../../hooks/useFormatPrice";

const levels = [
  { id: 0, title: "Cộng tác viên" },
  { id: 1, title: "Đại lý cấp 1" },
  { id: 2, title: "Đại lý cấp 2" },
  { id: 3, title: "Đại lý cấp 3" },
];

const schema = yup
  .object({
    level: yup.number().required("This field is required"),
  })
  .required();

const AccountAdminPage = () => {
  const priceFomat = useFormatPrice();
  const { i18n } = useTranslation();
  const collab = useSelector((state: RootState) => state.collab);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const level = searchParams.get("level");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listUser, setListUser] = useState<UserState[]>([]);
  const [selectRow, setSelectRow] = useState<UserState | undefined>(undefined);
  const [totalItems, setTotalItems] = useState<number>();
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [pageSize, setPageSize] = useState<number>(10);
  // const listUserFilter = inputValue
  //   ? listUser.filter((item) =>
  //       item?.username?.toLowerCase().includes(inputValue.toLowerCase())
  //     )
  //   : listUser;
  const { handleSubmit, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const levelWatch = watch("level");
  useEffect(() => {
    if (selectRow) {
      selectRow.level && setValue("level", selectRow.level);
    }
  }, [selectRow, setValue]);
  useEffect(() => {
    fetchData(page);
  }, [page, pageSize]);
  useEffect(() => {
    const timeout = setTimeout(() => fetchData(1, inputValue), 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue]);
  const onSubmit = async (data: { level: number }) => {
    try {
      if (selectRow) {
        await api.patch(`/users/${selectRow?._id}`, {
          ...data,
          username: selectRow.username,
          email: selectRow.email,
        });
        fetchData(page);
        toast.success("Thành công");
      }
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    } finally {
      setSelectRow(undefined);
      handleOk();
      reset();
    }
  };
  const fetchData = async (_page: number, search?: string) => {
    try {
      setLoading(true);
      const params: {
        page: number;
        username?: string;
        pageSize: number;
        level?: string;
      } = {
        page: _page,
        pageSize,
      };
      if (level) params.level = level;
      if (search) params.username = search;
      const result = await api.get<{
        resultList: UserState[];
        totalItems: number;
      }>(`/users`, {
        params,
      });
      const data = result?.data?.resultList.filter((i) => i.role !== 1);
      setTotalItems(result.data.totalItems);
      setListUser(data);
    } catch (error) {
      toast.error(messages.error);
    } finally {
      setLoading(false);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns: TableColumnsType<UserState> = useMemo(
    () => [
      {
        title: () => <p className="font-semibold font-primary">STT</p>,
        dataIndex: "index",
        key: "index",
        width: 70,
        render: (text: string) => (
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
          <p className="text-sm font-semibold font-primary">Tổng nạp</p>
        ),
        dataIndex: "cash",
        key: "cash",
        render: (text: number) => (
          <p className="text-sm font-primary">{priceFomat(text || 0)}</p>
        ),
        sorter: {
          compare: (a, b) => a.cash - b.cash,
          multiple: 1,
        },
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Số dư</p>
        ),
        dataIndex: "money",
        key: "money",
        render: (text: number) => (
          <p className="text-sm font-primary"> {priceFomat(text)}</p>
        ),
        sorter: {
          compare: (a, b) => a.money - b.money,
          multiple: 1,
        },
      },
      {
        title: () => (
          <p className="text-sm font-semibold font-primary">Số gói</p>
        ),
        dataIndex: "transaction",
        key: "transaction",
        width: 100,
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
          <p
            className="text-sm cursor-pointer font-primary text-primary"
            onClick={() => {
              setSelectRow(record);
              showModal();
            }}
          >
            {record.level === 0
              ? "Cộng tác viên"
              : `Đại lý cấp ${record.level}`}
          </p>
        ),
        filters: [
          {
            text: "Cộng tác viên",
            value: 0,
          },
          {
            text: "Đại lý cấp 1",
            value: 1,
          },
          {
            text: "Đại lý cấp 2",
            value: 2,
          },
          {
            text: "Đại lý cấp 3",
            value: 3,
          },
        ],
        onFilter: (value: boolean | Key, record: UserState) => {
          if (typeof value === "boolean") {
            // Xử lý trường hợp value là boolean
            return record.level === (value ? 1 : 0);
          } else {
            // Xử lý trường hợp value là Key (đối với trường hợp khi dùng dropdown filter)
            return record.level === value;
          }
        },
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
    [i18n.language]
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
    <RequireAuthPage rolePage={[1, 3]}>
      <div className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="relative w-1/2">
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
          <p>
            Total user:{" "}
            <span className="font-semibold text-xl text-error">
              {totalItems}
            </span>
          </p>
        </div>
        <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
          <Table
            dataSource={
              level
                ? listUser
                    .filter((item) => item.level === Number(level))
                    .map((item, index) => ({ index, ...item }))
                : listUser.map((item, index) => ({ index, ...item }))
            }
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
      </div>{" "}
      <Modal
        title="Thay đổi cấp độ"
        open={isModalOpen}
        onCancel={() => {
          if (selectRow) setSelectRow(undefined);
          handleCancel();
        }}
        footer={[]}
      >
        <form
          className="space-y-[15px] md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <Label htmlFor="name">Cấp độ*</Label>
            <div className="space-y-2">
              {levels.map((item) => (
                <Radio
                  key={item.id}
                  checked={
                    levelWatch || levelWatch === 0
                      ? levelWatch === item.id
                      : selectRow?.level === item.id
                  }
                  onClick={() => setValue("level", item.id)}
                >
                  <p className="font-primary w-fit">
                    {item.title} (
                    {item.id !== 0
                      ? `Chiết khấu [${
                          item.id === 1
                            ? collab.level1
                            : item.id === 2
                            ? collab.level2
                            : item.id === 3
                            ? collab.level3
                            : ""
                        }%]`
                      : ""}
                    )
                  </p>
                </Radio>
              ))}
            </div>
          </FormGroup>

          <Button type="submit" className="w-full text-white bg-primary">
            Thay đổi
          </Button>
        </form>
      </Modal>
    </RequireAuthPage>
  );
};

export default AccountAdminPage;
