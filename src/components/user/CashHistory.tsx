import { CashType } from "../../type";
import Heading from "../common/Heading";
import classNames from "../../utils/classNames";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const CashHistory = ({ userCashHistory }: { userCashHistory: CashType[] }) => {
  return (
    <div className="space-y-4">
      <Heading>Lịch sử nạp</Heading>
      <div className="">
        {userCashHistory.length === 0 ? (
          <p>Chưa có giao dịch nạp nào được thực hiện</p>
        ) : (
          <div className="">
            {userCashHistory.map((item, index) => (
              <div
                key={uuidv4()}
                className={classNames(
                  index === userCashHistory.length - 1
                    ? "mb-5 space-y-1 pl-10 relative after:absolute after:w-3 after:h-3 after:bg-white after:border-2 after:border-primary after:rounded-full after:left-0 after:top-1/2 after:-translate-y-1/2"
                    : "mb-5 space-y-1 pl-10 relative after:absolute after:w-3 after:h-3 after:bg-white after:border-2 after:border-primary after:rounded-full after:left-0 after:top-1/2 after:-translate-y-1/2 before:absolute before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-primary before:left-[5px] before:top-1/2"
                )}
              >
                <div className="p-3 shadow-xl rounded-lg">
                  <p className="text-sm">
                    Bạn đã nạp{" "}
                    <span className="font-semibold">
                      {VND.format(item.money)}VND
                    </span>{" "}
                    vào ngày {dayjs(item.updatedAt).format("DD/MM/YYYY HH:MM")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CashHistory;
