import { useEffect, useState } from "react";
import IconQuesionMarkCircle from "../../icons/IconQuesionMarkCircle";
import { Table, Tooltip } from "antd";
import { api } from "../../api";
import { CommisionType, RoseType, SatisfyType } from "../../type";
import { RootState } from "../../store/configureStore";
import { useSelector } from "react-redux";
import { VND } from "../../utils/formatPrice";
import { AuthState } from "../../store/auth/authSlice";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import dayjs from "dayjs";

const InvitePage = () => {
  const { _id } = useSelector((state: RootState) => state.auth);
  const [satisfy, setSatisfy] = useState<SatisfyType>();
  const [user, setUser] = useState<AuthState>();
  const [commision, setCommision] = useState<CommisionType>();
  const [roseHistory, setRoseHistory] = useState<RoseType[]>([]);
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
      console.log("result - ", resultSatify.data);
      setSatisfy(resultSatify.data);
      setUser(resultUser.data);
      setCommision(resultCommision.data);
      setRoseHistory(resultRose.data);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  const columns = [
    {
      title: <p className="font-primary font-semibold">Tên gói</p>,
      dataIndex: "namePlan",
      key: "namePlan",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">{record.plan}</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">% hoa hồng</p>,
      dataIndex: "percent",
      key: "percent",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">{record.percent}%</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Tiền hoa hồng</p>,
      dataIndex: "moneyPercent",
      key: "moneyPercent",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">{VND.format(record.recive)}VND</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Người mua</p>,
      dataIndex: "moneyPercent",
      key: "moneyPercent",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">{record.reciveRoseId.email}</p>
      ),
    },
    {
      title: <p className="font-primary font-semibold">Ngày nhận</p>,
      dataIndex: "moneyPercent",
      key: "moneyPercent",
      render: (_: string, record: RoseType) => (
        <p className="font-primary text-sm">
          {dayjs(record.createdAt).format("DD-MM-YYYY")}
        </p>
      ),
    },
  ];
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-4 gap-8">
        <div className="col-span-1 shadow-xl px-5 py-7 flex flex-col items-center rounded-xl space-y-4">
          <p className="font-medium text-4xl">{user?.level || 0}</p>
          <div className="flex items-center gap-1">
            <p className="text-lg">Cấp độ</p>
            <Tooltip title="Cấp 1: Nạp Đơn Giá Trị 1.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 10% || Cấp 2: Nạp Đơn Giá Trị 3.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 20% || Cấp 3: Nạp Đơn Giá Trị 10.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 50%">
              <span>
                <IconQuesionMarkCircle />
              </span>
            </Tooltip>
          </div>
        </div>
        <div className="col-span-1 shadow-xl px-5 py-7 flex flex-col items-center rounded-xl space-y-4">
          <p className="font-medium text-4xl">{satisfy?.numberIntoduce || 0}</p>
          <div className="flex items-center gap-1">
            <p className="text-lg">Đã mời</p>
          </div>
        </div>
        <div className="col-span-1 shadow-xl px-5 py-7 flex flex-col items-center rounded-xl space-y-4">
          <p className="font-medium text-4xl">
            {commision ? commision.value : 0}%
          </p>
          <div className="flex items-center gap-1">
            <p className="text-lg">Phần trăm hoa hồng</p>
            <Tooltip title="Cấp 1: Nạp Đơn Giá Trị 1.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 10% || Cấp 2: Nạp Đơn Giá Trị 3.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 20% || Cấp 3: Nạp Đơn Giá Trị 10.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 50%">
              <span>
                <IconQuesionMarkCircle />
              </span>
            </Tooltip>
          </div>
        </div>
        <div className="col-span-1 shadow-xl px-5 py-7 flex flex-col items-center rounded-xl space-y-4">
          <p className="font-medium text-4xl">
            {satisfy && satisfy.rose.length > 0
              ? VND.format(satisfy.rose[0].money)
              : 0}
            VND
          </p>
          
          <div className="flex items-center gap-1">
            <p className="text-lg">Tiền hoa hồng</p>
            <Tooltip title="Cấp 1: Nạp Đơn Giá Trị 1.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 10% || Cấp 2: Nạp Đơn Giá Trị 3.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 20% || Cấp 3: Nạp Đơn Giá Trị 10.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 50%">
              <span>
                <IconQuesionMarkCircle />
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
      <Table dataSource={roseHistory} columns={columns} />
    </div>
  );
};

export default InvitePage;
