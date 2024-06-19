import { useEffect, useMemo, useState } from "react";
import { SatifyItem } from "../../pages/admin/DashboardAdminPage";
import { PlanType } from "../../type";
import Heading from "../common/Heading";
import { api } from "../../api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { useFormatPrice } from "../../hooks/useFormatPrice";
ChartJS.register(ArcElement, Tooltip, Legend);

type DataType = {
  _id: string;
  count: number;
  totalMoney: number;
  plan: [PlanType];
};
const TopPlan = () => {
  const priceFomat = useFormatPrice();
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
  const totalMoney = data.reduce(
    (total, prev) => (total += prev.totalMoney),
    0
  );
  const dataPie = useMemo(
    () => ({
      labels: data.map((item) => item.plan[0].name),
      datasets: [
        {
          label: "% Tổng nạp ",
          data: data.map((item) =>
            Math.round((item.totalMoney / totalMoney) * 100)
          ),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    }),
    [data]
  );
  if (data.length > 0)
    return (
      <div className="col-span-12 grid grid-cols-12 gap-10">
        <div className="col-span-4">
          <Pie data={dataPie} />
        </div>
        <div className="col-span-8 space-y-5">
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
                      Tổng thu: {priceFomat(item.totalMoney)}
                    </p>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>
    );
  return;
};

export default TopPlan;
