import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Heading from "../common/Heading";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../api";

ChartJS.register(ArcElement, Tooltip, Legend);
type DataType = {
  _id: [number];
  totalMoney: number;
  level: [number];
};
const UserPieChart = () => {
  const [satify, setSatify] = useState<DataType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<DataType[]>("/satisfy/get-by-level");
        setSatify(result.data.sort((a, b) => a.level[0] - b.level[0]));
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  console.log(satify.sort((a, b) => a.level[0] - b.level[0]));
  const data = useMemo(
    () => ({
      labels: satify.map((item) =>
        item.level[0] === 0 ? "Cộng tác viên" : `Đại lý cấp ${item.level[0]}`
      ),
      datasets: [
        {
          label: "Tổng nạp: ",
          data: satify.map((item) => item.totalMoney),
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
    [satify]
  );
  if (satify.length > 0)
    return (
      <div className="space-y-5 col-span-12 md:col-span-4">
        <Heading>Loại người dùng</Heading>
        <Pie data={data} />
      </div>
    );
  return;
};

export default UserPieChart;
