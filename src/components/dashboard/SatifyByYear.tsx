import { DatePicker, DatePickerProps } from "antd";
import Heading from "../common/Heading";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { SatifyItem } from "../../pages/admin/DashboardAdminPage";
import { useFormatPrice } from "../../hooks/useFormatPrice";

type DataType = {
  month: number;
  cash: [
    {
      _id: "cash";
      money: number;
    }
  ];
  rose: [
    {
      _id: "rose";
      money: number;
    }
  ];
  transaction: [
    {
      _id: "transaction";
      money: number;
    }
  ];
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};
const labels = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
const SatifyByYear = () => {
  const priceFomat = useFormatPrice();
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const [data, setData] = useState<DataType[]>([]);
  console.log(dayjs(date).get("months"), dayjs(date).get("year"));
  console.log(data);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.post<DataType[]>("/satisfy/get-by-year", {
          year: `${dayjs(date).get("year")}`,
        });
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [date]);

  const dataBar = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: "Tổng nạp",
          data: data.map((item) =>
            item.cash.length > 0 ? item.cash[0].money : 0
          ),
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
        {
          label: "Tổng đã mua",
          data: data.map((item) =>
            item.transaction.length > 0 ? item.transaction[0].money : 0
          ),
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
        {
          label: "Tổng hoa hồng đã trừ",
          data: data.map((item) =>
            item.rose.length > 0 ? item.rose[0].money : 0
          ),
          backgroundColor: "rgba(53, 162, 20, 0.5)",
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );
  const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
    setDate(date);
  };
  if (data.length > 0) {
    const totalSatify = data.map((item) => ({
      transaction: item.transaction[0]?.money || 0,
      rose: item.rose[0]?.money || 0,
      cash: item.cash[0]?.money || 0,
    }));
    return (
      <div className="space-y-5">
        <Heading className="flex items-center gap-5">
          <p>Doanh số theo năm</p>
          <DatePicker
            value={date}
            onChange={onChangeStartDate}
            className="!focus:border-primary text-black font-medium placeholder:text-base placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid bg-inherit peer outline-none border-strock"
            placeholder="Select month"
            picker="year"
          />
        </Heading>
        <div className="p-5 gap-y-5 grid grid-cols-2 md:grid-cols-3 rounded-xl border-2 border-[#eeeeed]">
          <SatifyItem
            title="Tổng nạp"
            content={priceFomat(
              totalSatify.reduce(
                (accumulator, currentItem) => (accumulator += currentItem.cash),
                0
              )
            )}
          />
          <SatifyItem
            title="Tổng mua"
            content={priceFomat(
              totalSatify.reduce(
                (accumulator, currentItem) =>
                  (accumulator += currentItem.transaction),
                0
              )
            )}
          />
          <SatifyItem
            title="Tổng hoa hồng"
            content={priceFomat(
              totalSatify.reduce(
                (accumulator, currentItem) => (accumulator += currentItem.rose),
                0
              )
            )}
          />
        </div>
        <Bar options={options} data={dataBar} />
      </div>
    );
  }
  return;
};

export default SatifyByYear;
