
import { NewUserToday } from "./NewUserToday";
import { NewCashToday } from "./NewCashToday";
import { FullDataToday } from "./FullDataToday";
import { BuyPlanToday } from "./BuyPlanToday";
import { KeyExpriredToday } from "./KeyExpriredToday";
import dayjs from "dayjs";

export const DashboardToday = () => {
  return (
    <div className="p-5 gap-y-5 grid grid-cols-2 md:grid-cols-4 rounded-xl border-2 border-[#eeeeed]">
      <KeyExpriredToday date={dayjs()} title={"Key Exprired Today"} />
      <KeyExpriredToday date={dayjs().add(1, 'day')} title={"Key Exprired Tomorrow"} />
      <NewUserToday />
      <NewCashToday />
      <FullDataToday />
      <BuyPlanToday />
    </div>
  );
};
