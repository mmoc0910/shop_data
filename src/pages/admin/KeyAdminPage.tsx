import { useEffect, useState } from "react";
import { KeySeverType, ServerType } from "../../type";
import { api } from "../../api";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import RequireAuthPage from "../../components/common/RequireAuthPage";
// import { Checkbox } from "../../components/checkbox";

const KeyAdminPage = () => {
  const [keys, setKeys] = useState<KeySeverType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [selectRowKeys, setSelectRowKeys] = useState<number[]>([]);
  useEffect(() => {
    handleFetchData();
  }, []);
  const handleFetchData = async () => {
    try {
      setLoading(true);
      const result = await api.get<ServerType[]>("/servers");
      setKeys(
        result.data
          .map((item) => (item.listKeys ? [...item.listKeys] : []))
          .reduce((prev, cur) => [...prev, ...cur], [])
      );
      setLoading(false);
    } catch (error) {
      console.log("err - ", error);
      toast.error(messages.error);
    }
  };
  return (
    <RequireAuthPage rolePage={[1, 3]}>
      {keys.length > 0 && !loading ? (
        <div className="space-y-7">
          <div className="grid grid-cols-4 gap-6">
            <div className="p-5 rounded-lg bg-slate-400 space-y-3 text-white">
              <p className="text-lg">Tổng số key đang active</p>
              <p className="font-semibold text-4xl">
                {/* {keys.filter((item) => item.used).length} */}
              </p>
            </div>
            <div className="p-5 rounded-lg bg-slate-400 space-y-3 text-white">
              <p className="text-lg">Tổng số key có thể cấp</p>
              {/* <p className="font-semibold text-4xl">
              {keys.filter((item) => !item.used).length}
            </p> */}
            </div>
          </div>
          <div className="space-y-7">
            <div className="flex justify-end">
              <button className="px-4 py-3 rounded-md bg-primary font-semibold text-white">
                Migrate key
              </button>
            </div>

            <div className="space-y-5">
              {/* <CreateNewKeyForm
              handleAddNewKey={() =>
                handleAddNewKey(serverDetail.apiUrl, serverDetail.fingerPrint)
              }
            /> */}
              <div className="grid grid-cols-2">
                <div className="col-span-1 pb-3 flex">
                  <div className="px-4 font-semibold">#</div>
                  <div className="px-4 font-semibold">id</div>
                  <div className="flex-1 px-4 font-semibold">Name</div>
                  <div className="px-4 font-semibold">Usage</div>
                </div>
                <div className="col-span-1 pb-3 flex">
                  <div className="flex-1 px-4 font-semibold">Limit</div>
                  <div className="px-4 font-semibold">Actions</div>
                </div>
                {keys.map((item) => (
                  <div
                    className="col-span-2 border border-gray-200 rounded-xl grid grid-cols-2 py-5"
                    key={uuidv4()}
                  >
                    <div className="flex items-center">
                      {/* <div className="px-4">
                      <Checkbox
                        checked={selectRowKeys.some((i) => i === item.keyId)}
                        onClick={() =>
                          setSelectRowKeys((prev) =>
                            prev.some((i) => i === item.keyId)
                              ? prev.filter((i) => i !== item.keyId)
                              : [...prev, item.keyId]
                          )
                        }
                      />
                    </div> */}
                      <div className="px-4">{item.keyId}</div>
                      <div className="flex-1 px-4">
                        {item.name}
                        {/* <EditKeyNameForm
                        placeholder={item.name}
                        handleRenameKey={
                          (name: string) => {}
                          // handleRenameKey(
                          //   Number(item.keyId),
                          //   name,
                          //   serverDetail.apiUrl,
                          //   serverDetail.fingerPrint
                          // )
                        }
                      /> */}
                      </div>
                      <div className="px-4">0.0 GB</div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 px-4">
                        {`${item.dataLimit / 1000 / 1000 / 1000} GB`}
                        {/* <EditKeyLimitForm
                        placeholder={`${
                          item.dataLimit / 1000 / 1000 / 1000
                        } GB`}
                        handleAddLimitData={
                          (bytes: number) => {}
                          // handleAddLimitData(
                          //   Number(item.keyId),
                          //   bytes,
                          //   serverDetail.apiUrl,
                          //   serverDetail.fingerPrint
                          // )
                        }
                      /> */}
                      </div>
                      <div className="px-4 flex gap-5">
                        <button
                          className="bg-error text-white rounded-lg p-3"
                          //   onClick={() =>
                          //     handleRemoveKey(
                          //       Number(item.keyId),
                          //       serverDetail.apiUrl,
                          //       serverDetail.fingerPrint
                          //     )
                          //   }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                        <button className="px-4 py-2 rounded-md bg-secondary font-semibold text-white">
                          Gia hạn
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="pt-10 text-center">
          Chưa có key nào được thêm{" "}
          <Link
            to={"/admin/server"}
            className="font-medium text-primary underline decoration-primary"
          >
            Thêm máy chủ
          </Link>
        </p>
      )}
    </RequireAuthPage>
  );
};

export default KeyAdminPage;
