import { useEffect, useMemo, useState } from "react";
import { AuthState } from "../../store/auth/authSlice";
import { toast } from "react-toastify";
import { countries, messages } from "../../constants";
import { api } from "../../api";
import { Modal, Table } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import Button from "../../components/button/Button";
import Radio from "../../components/radio/Radio";
import { VND } from "../../utils/formatPrice";

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
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listUser, setListUser] = useState<AuthState[]>([]);
  const [selectRow, setSelectRow] = useState<AuthState | undefined>(undefined);
  const { handleSubmit, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const levelWatch = watch("level");
  console.log(levelWatch, selectRow);
  useEffect(() => {
    if (selectRow) {
      selectRow.level && setValue("level", selectRow.level);
    }
  }, [selectRow, setValue]);
  useEffect(() => {
    fetchData(search);
  }, [search]);
  const onSubmit = async (data: { level: number }) => {
    try {
      if (selectRow) {
        console.log("data - ", data);
        await api.patch(`/users/${selectRow?._id}`, { ...data });
        fetchData("");
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
  const fetchData = async (text?: string) => {
    try {
      setLoading(true);
      const result = await api.get<AuthState[]>(`/users?email=${text}`);
      const data = result?.data?.filter((i) => i.role !== 1);
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
  const columns = useMemo(
    () => [
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Email</p>
        ),
        dataIndex: "email",
        key: "email",
        render: (_: string, record: AuthState) => (
          <p className="font-primary text-sm">{record.email}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Số điện thoại</p>
        ),
        dataIndex: "phone",
        key: "phone",
        render: (_: string, record: AuthState) => (
          <p className="font-primary text-sm">{record.phone}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Mã giới thiệu</p>
        ),
        dataIndex: "id",
        key: "id",
        render: (_: string, record: AuthState) => (
          <p className="font-primary text-sm">{record._id}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Quốc gia</p>
        ),
        dataIndex: "country",
        key: "country",
        render: (_: string, record: AuthState) => (
          <p className="font-primary text-sm">
            {countries.find((item) => item.key === record.country)?.title || ""}
          </p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Số tiền nạp</p>
        ),
        dataIndex: "money",
        key: "money",
        render: (_: string, record: AuthState) => (
          <p className="font-primary text-sm">
            {record.money && VND.format(record.money)}VND
          </p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Số gói đã mua</p>
        ),
        dataIndex: "transaction",
        key: "transaction",
        render: (_: string, record: AuthState) => (
          <p className="font-primary text-sm">{record.transaction}</p>
        ),
      },
      {
        title: () => (
          <p className="font-primary text-base font-semibold">Đại lý</p>
        ),
        dataIndex: "country",
        key: "country",
        render: (_: string, record: AuthState) => (
          <p
            className="font-primary text-sm text-primary cursor-pointer"
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
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <>
      <div className="space-y-6">
        <div className="relative">
          <input
            className="focus:border-primary text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none dark:placeholder:text-text2 border-strock dark:border-dark-strock text-text1 dark:text-white pr-16 "
            placeholder="Tìm kiếm"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          {search && search?.length > 0 ? (
            <span
              className="text-[#A2A2A8] dark:text-[#4B5264] absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
              onClick={() => setSearch("")}
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
                  d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>
          ) : null}
        </div>
        <Table dataSource={listUser} columns={columns} loading={loading} />
      </div>{" "}
      <Modal
        title="Thay dổi cấp độ"
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
                  <p className="font-primary">{item.title}</p>
                </Radio>
              ))}
            </div>
          </FormGroup>

          <Button type="submit" className="w-full text-white bg-primary">
            Thay đổi
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default AccountAdminPage;
