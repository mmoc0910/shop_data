import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import Heading from "../common/Heading";

ChartJS.register(ArcElement, Tooltip, Legend);
const data = {
  labels: ["Cộng tác viên", "Đại lý cấp 1", "Đại lý cấp 2", "Đại lý cấp 3"],
  datasets: [
    {
      label: "Số lượng",
      data: [12, 19, 3, 5],
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
};
const UserPieChart = () => {
  return (
    <div className="space-y-4">
      <Heading>Loại người dùng</Heading>
      <Pie data={data} />
    </div>
  );
};

export default UserPieChart;
