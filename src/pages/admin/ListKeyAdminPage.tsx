import RequireAuthPage from "../../components/common/RequireAuthPage";
import { ListKeyAdmin } from "../../components/key/ListKeyAdmin";
import { FormProvider, useForm } from "react-hook-form";
import { SearchKeyAdmin } from "../../components/key/SearchKeyAdmin";
import { api } from "../../api";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { useEffect, useState } from "react";
import { KeyExpriredToday } from "../../components/dashboard/today/KeyExpriredToday";
import dayjs from "dayjs";
import { BuyPlanToday } from "../../components/dashboard/today/BuyPlanToday";
import { FullDataToday } from "../../components/dashboard/today/FullDataToday";

export type ListKeyForm = { searchTerm: string };
const ListKeyAdminPage = () => {
  const methods = useForm<ListKeyForm>();
  const [totalItems, setTotalItems] = useState<number>();
  // const [todayInfo, setTodayInfo] = useState<{
  //   expireToday?: number;
  //   buyToday?: number;
  //   overbandWidthToday?: number;
  // }>({ buyToday: 0, expireToday: 0, overbandWidthToday: 0 });
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const result = await api.get<{
  //         expireToday?: number;
  //         buyToday?: number;
  //         overbandWidthToday?: number;
  //       }>(`/keys/today-info`);
  //       setTodayInfo(result.data);
  //     } catch (error) {
  //       toast.error(messages.error);
  //     }
  //   })();
  // }, []);
  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
    try {
      const response = await api.get(`/keys`, {
        params: {
          status: 1,
          page: 1,
          pageSize: 1,
        },
      });
      setTotalItems(response.data.totalItems);
    } catch (error) {
      toast.error(messages.error);
    }
  };
  return (
    <RequireAuthPage rolePage={[1, 3]}>
      <FormProvider {...methods}>
        <div className="space-y-5">
          <div className="grid grid-cols-2 p-5 gap-5 md:grid-cols-4 rounded-xl border-2 border-[#eeeeed]">
            <div className="flex-1 space-y-3">
              <p className="text-lg text-gray-500">Total keys(Active)</p>
              <p className="text-2xl font-medium">{totalItems}</p>
            </div>
            <KeyExpriredToday date={dayjs()} title={"Key Exprired Today"} />
            {/* <div className="flex-1 space-y-3">
              <p className="text-lg text-primary20">Expire today</p>
              <p className="text-2xl font-medium text-primary20">{todayInfo?.expireToday}</p>
            </div> */}
            <BuyPlanToday />
            {/* <div className="flex-1 space-y-3">
              <p className="text-lg text-[#ffaa01]">Buy Today</p>
              <p className="text-2xl font-medium text-[#ffaa01]">{todayInfo?.buyToday}</p>
            </div> */}
            <FullDataToday />
            {/* <div className="flex-1 space-y-3">
              <p className="text-lg text-error">Over BW today</p>
              <p className="text-2xl font-medium text-error">{todayInfo?.overbandWidthToday}</p>
            </div> */}
          </div>
          <SearchKeyAdmin />
          <ListKeyAdmin />
        </div>
      </FormProvider>
    </RequireAuthPage>
  );
};

export default ListKeyAdminPage;
