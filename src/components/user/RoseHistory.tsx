import { RoseType } from "../../type";
import Heading from "../common/Heading";
import classNames from "../../utils/classNames";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";

const RoseHistory = ({ roseHistory }: { roseHistory: RoseType[] }) => {
  if (roseHistory.length)
    return (
      <div className="space-y-4">
        <Heading>Lịch sử nhận hoa hồng</Heading>
        <div className="">
          {roseHistory.length === 0 ? (
            <p>Chưa có giao dịch nạp nào được thực hiện</p>
          ) : (
            <div className="">
              {roseHistory.slice(0, 5).map((item, index) => (
                <div
                  key={uuidv4()}
                  className={classNames(
                    index === roseHistory.slice(0, 5).length - 1
                      ? "mb-5 space-y-1 pl-10 relative after:absolute after:w-3 after:h-3 after:bg-white after:border-2 after:border-primary after:rounded-full after:left-0 after:top-1/2 after:-translate-y-1/2"
                      : "mb-5 space-y-1 pl-10 relative after:absolute after:w-3 after:h-3 after:bg-white after:border-2 after:border-primary after:rounded-full after:left-0 after:top-1/2 after:-translate-y-1/2 before:absolute before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-primary before:left-[5px] before:top-1/2"
                  )}
                >
                  <div className="p-3 shadow-xl rounded-lg">
                    <p className="text-sm">
                      Bạn nhận được{" "}
                      <span className="font-medium">
                        {VND.format(item.recive)}VND({item.percent}%)
                      </span>
                      tiền hoa hồng từ{" "}
                      <span className="font-medium">
                        {item.introducedId.email}
                      </span>{" "}
                      khi mua gói{" "}
                      <span className="font-medium">{item.plan}</span> vào ngày{" "}
                      {dayjs(item.createdAt).format("DD/MM/YYYY HH:MM")}
                    </p>
                  </div>
                </div>
              ))}
              {roseHistory.length > 5 ? (
                <Link
                  to={"/user/invite"}
                  className="text-primary underline decoration-primary text-center block"
                >
                  Xem tất cả
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  return;
};

export default RoseHistory;
