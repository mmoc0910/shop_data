import { useEffect, useState } from "react";
import { SatifyItem } from "../../pages/admin/DashboardAdminPage";
import { PlanType } from "../../type";
import Heading from "../common/Heading";
import { api } from "../../api";
import { priceFomat } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";

type DataType = {
  _id: string;
  count: number;
  totalMoney: number;
  plan: [PlanType];
};
const TopPlan = () => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<DataType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<DataType[]>("/satisfy/top-plan");
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  if (data.length > 0)
    return (
      <div className="col-span-12 space-y-5">
        <Heading>Top 3 gói mua nhiều nhất</Heading>
        <div className="p-5 gap-y-5 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 rounded-xl border-2 border-[#eeeeed]">
          {data.map((item) => (
            <SatifyItem
              key={item._id}
              title={`Gói: ${item.plan[0].name}`}
              content={
                <div className="flex flex-col gap-2 text-lg">
                  <p>Lượt mua: {item.count}</p>
                  <p>
                    Tổng thu: {priceFomat(item.totalMoney, i18n.language)}
                  </p>
                </div>
              }
            />
          ))}
        </div>
      </div>
    );
  return;
};

export default TopPlan;
