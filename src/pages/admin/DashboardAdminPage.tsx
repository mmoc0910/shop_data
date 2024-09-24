import { ReactNode } from "react";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import UserPieChart from "../../components/admin/UserPieChart";
import ServerSatify from "../../components/dashboard/ServerSatify";
import TopUser from "../../components/dashboard/TopUser";
import TopPlan from "../../components/dashboard/TopPlan";
import SatifyByMonth from "../../components/dashboard/SatifyByMonth";
import SatifyByYear from "../../components/dashboard/SatifyByYear";
import TopUserByMonth from "../../components/dashboard/TopUserByMonth";
import TopUserRegister from "../../components/dashboard/TopUserRegister";
import { DashboardToday } from "../../components/dashboard/today/DashboardToday";

const DashboardAdminPage = () => {
  return (
    <RequireAuthPage rolePage={[1]}>
      <div className="grid grid-cols-12 gap-x-10 gap-y-10">
        <div className="col-span-12">
          <DashboardToday />
        </div>
        <div className="col-span-8 space-y-10">
          <SatifyByMonth />
          <SatifyByYear />
        </div>
        <TopPlan />
        <ServerSatify />
        <UserPieChart />
        <div className="space-y-10 col-span-12 md:col-span-8">
          <TopUserRegister />
          <TopUser />
          <TopUserByMonth />
        </div>
      </div>
    </RequireAuthPage>
  );
};

export const SatifyItem = ({
  content,
  title,
  desc,
}: {
  content: string | number | ReactNode;
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
