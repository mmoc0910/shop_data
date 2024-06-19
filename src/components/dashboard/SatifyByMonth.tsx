import { DatePicker, DatePickerProps } from "antd";
import Heading from "../common/Heading";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { api } from "../../api";
import { SatifyItem } from "../../pages/admin/DashboardAdminPage";
import { useFormatPrice } from "../../hooks/useFormatPrice";

type DataType = {
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
const SatifyByMonth = () => {
  const priceFomat = useFormatPrice();
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs());
  const [data, setData] = useState<DataType>();
  console.log(dayjs(date).get("months"), dayjs(date).get("year"));
  console.log(data);
  useEffect(() => {
    (async () => {
      try {
        const result = await api.post<DataType>("/satisfy/get-by-month", {
          month: `${dayjs(date).get("year")}-${dayjs(date).get("months") + 1}`,
        });
        setData(result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [date]);
  const onChangeStartDate: DatePickerProps["onChange"] = (date) => {
    setDate(date);
  };
  if (data)
    return (
      <div className="space-y-5">
        <Heading className="flex items-center gap-5">
          <p>Doanh số theo tháng</p>
          <DatePicker
            value={date}
            onChange={onChangeStartDate}
            className="!focus:border-primary text-black font-medium placeholder:text-base placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid bg-inherit peer outline-none border-strock"
            placeholder="Select month"
            picker="month"
          />
        </Heading>
        <div className="p-5 gap-y-5 grid grid-cols-2 md:grid-cols-3 rounded-xl border-2 border-[#eeeeed]">
          <SatifyItem
            title="Tổng nạp tiền"
            content={priceFomat(data.cash[0]?.money || 0)}
          />
          <SatifyItem
            title="Tổng đã mua"
            content={priceFomat(data.transaction[0]?.money || 0)}
          />
          <SatifyItem
            title="Tổng hoa hồng đã trừ"
            content={priceFomat(data.rose[0]?.money || 0)}
          />
        </div>
      </div>
    );
  return;
};

export default SatifyByMonth;
