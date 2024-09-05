
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { ListKeyAdmin } from "../../components/key/ListKeyAdmin";
import { FormProvider, useForm } from "react-hook-form";
import { SearchKeyAdmin } from "../../components/key/SearchKeyAdmin";

export type ListKeyForm = { searchTerm: string };
const ListKeyAdminPage = () => {
  const methods = useForm<ListKeyForm>();
  return (
    <RequireAuthPage rolePage={[1,3]}>
      <FormProvider {...methods}>
        <div className="space-y-5">
          <div className="grid grid-cols-2 p-5 gap-5 md:grid-cols-5 rounded-xl border-2 border-[#eeeeed]">
            <div className="flex-1 space-y-3">
              <p className="text-lg text-gray-500">Total keys(Active)</p>
              <p className="text-2xl font-medium">100</p>
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-lg text-primary20">Expire today</p>
              <p className="text-2xl font-medium text-primary20">10</p>
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-lg text-[#ffaa01]">Buy Today</p>
              <p className="text-2xl font-medium text-[#ffaa01]">10</p>
            </div>
            <div className="flex-1 space-y-3">
              <p className="text-lg text-error">Over BW today</p>
              <p className="text-2xl font-medium text-error">{10}</p>
            </div>
          </div>
          <SearchKeyAdmin />
          <ListKeyAdmin />
        </div>
      </FormProvider>
    </RequireAuthPage>
  );
};

export default ListKeyAdminPage;
