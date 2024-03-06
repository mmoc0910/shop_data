import { ReactNode } from "react";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import CashDashboard from "../../components/admin/CashDashboard";
import UserPieChart from "../../components/admin/UserPieChart";
import RevenueLineChart from "../../components/admin/RevenueLineChart";

const DashboardAdminPage = () => {
  return (
    <RequireAuthPage rolePage={1}>
      <div className="grid grid-cols-12 gap-x-5 gap-y-10">
        <div className="p-5 gap-y-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 rounded-xl border-2 border-[#eeeeed] col-span-12">
          <SatifyItem title="Tổng nguời dùng" content={0} />
          <SatifyItem title="Tổng nạp" content={"0VND"} />
          <SatifyItem title="Doanh thu" content={"0VND"} />
          <SatifyItem title="Máy chủ" content={0} />
          <SatifyItem title="Key sử dụng" content={0} />
          <SatifyItem title="Gói cước" content={0} />
          <SatifyItem title="Gói cước mở rộng" content={0} />
        </div>
        <div className="col-span-12 grid grid-cols-12 gap-x-5 gap-y-10">
          <div className="col-span-12 lg:col-span-8 p-5">
            <RevenueLineChart />
          </div>
          <div className="col-span-12 lg:col-span-4 p-5">
            <UserPieChart />
          </div>
        </div>
        <div className="col-span-4 p-5">
          <CashDashboard />
        </div>
      </div>
    </RequireAuthPage>
  );
};

const SatifyItem = ({
  content,
  title,
  desc,
}: {
  content: string | number;
  title: string;
  desc?: string | ReactNode;
}) => {
  return (
    <div className="space-y-2">
      <div className="">
        <p className="text-gray-500 md:text-lg">{title}</p>
        {desc && <div>{desc}</div>}
      </div>
      <p className="font-semibold text-xl md:text-2xl">{content}</p>
    </div>
  );
};

export default DashboardAdminPage;
