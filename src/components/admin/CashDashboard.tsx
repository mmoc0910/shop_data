import { useEffect, useState } from "react";
import Heading from "../common/Heading";
import { CashType } from "../../type";
import classNames from "../../utils/classNames";
import { v4 as uuidv4 } from "uuid";
import { VND } from "../../utils/formatPrice";
import { DAY_FORMAT } from "../../constants";
import { api } from "../../api";
import { toast } from "react-toastify";

const CashDashboard = () => {
  const [listCash, setListCash] = useState<CashType[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const result = await api.get<CashType[]>("/cashs?status=2");
      setListCash(result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const handleApproveCash = async (_id: string) => {
    try {
      await api.get(`/cashs/approve/${_id}`);
      fetchData();
      toast.success("Thành công");
    } catch (error) {
      console.log(error);
    }
  };
  if (listCash.length > 0)
    return (
      <div className="space-y-4">
        <Heading>Yêu cầu nạp gần đây </Heading>
        <div className="">
          <div className="">
            {listCash.slice(0, 5).map((item, index) => (
              <div
                key={uuidv4()}
                className={classNames(
                  index === listCash.length - 1
                    ? "mb-5 space-y-1 pl-10 relative after:absolute after:w-3 after:h-3 after:bg-white after:border-2 after:border-primary after:rounded-full after:left-0 after:top-1/2 after:-translate-y-1/2"
                    : "mb-5 space-y-1 pl-10 relative after:absolute after:w-3 after:h-3 after:bg-white after:border-2 after:border-primary after:rounded-full after:left-0 after:top-1/2 after:-translate-y-1/2 before:absolute before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-primary before:left-[5px] before:top-1/2"
                )}
              >
                <div className="p-3 shadow-xl rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">
                      {item.userId.username}(sdt: {item.userId.phone})
                    </span>{" "}
                    yêu cầu nạp{" "}
                    <span className="font-semibold">
                      {VND.format(item.money)}VND
                    </span>{" "}
                    vào {DAY_FORMAT(item.updatedAt)}{" "}
                    <span
                      className="text-primary font-medium underline decoration-primary cursor-pointer"
                      onClick={() => handleApproveCash(item._id)}
                    >
                      Approve
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  return;
};

export default CashDashboard;
