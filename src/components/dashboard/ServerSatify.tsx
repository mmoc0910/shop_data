import { useEffect, useState } from "react";
import { SatifyItem } from "../../pages/admin/DashboardAdminPage";
import Heading from "../common/Heading";
import { api } from "../../api";

type ServerSatifyType = {
  amountTotalServer: number;
  amountActiveServer: number;
  amountKeyActive: number;
  averageServerLive: number;
};
const ServerSatify = () => {
  const [satify, setSatify] = useState<ServerSatifyType>();
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<ServerSatifyType>("/satisfy/server");
        setSatify(result.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  if (satify){
    const {amountActiveServer,amountKeyActive,amountTotalServer,averageServerLive} = satify
    return (
      <div className="space-y-5 col-span-12">
        <Heading>Máy chủ</Heading>
        <div className="p-5 gap-y-5 grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 rounded-xl border-2 border-[#eeeeed]">
          <SatifyItem title="Tổng máy chủ" content={amountTotalServer} />
          <SatifyItem title="Máy chủ đang hoạt động" content={amountActiveServer} />
          <SatifyItem title="Tổng key đang hoạt động " content={amountKeyActive} />
          <SatifyItem
            title="Thời gian sống trung bình của máy chủ"
            content={`${averageServerLive.toFixed(2)} ngày`}
          />
        </div>
      </div>
    );}
  return;
};

export default ServerSatify;
