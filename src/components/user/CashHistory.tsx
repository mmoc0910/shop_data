import { CashType } from "../../type";
import Heading from "../common/Heading";
import classNames from "../../utils/classNames";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CashHistory = ({ userCashHistory }: { userCashHistory: CashType[] }) => {
  const { t } = useTranslation();
  if (userCashHistory.length > 0)
    return (
      <div className="space-y-4">
        <Heading>{t("page.dashboard.depositHistory.heading")}</Heading>
        <div className="">
          {userCashHistory.length === 0 ? (
            <p>Chưa có giao dịch nạp nào được thực hiện</p>
          ) : (
            <div className="">
              {userCashHistory.slice(0, 5).map((item, index) => (
                <div
                  key={uuidv4()}
                  className={classNames(
                    index === userCashHistory.slice(0, 5).length - 1
                      ? "mb-5 space-y-1 lg:pl-7 xl:pl-10 relative after:absolute after:w-3 after:h-3 after:bg-white after:border-2 after:border-primary after:rounded-full after:left-0 after:top-1/2 after:-translate-y-1/2"
                      : "mb-5 space-y-1 lg:pl-7 xl:pl-10 relative after:absolute after:w-3 after:h-3 after:bg-white after:border-2 after:border-primary after:rounded-full after:left-0 after:top-1/2 after:-translate-y-1/2 before:absolute before:h-[calc(100%+1.5rem)] before:w-[2px] before:bg-primary before:left-[5px] before:top-1/2"
                  )}
                >
                  <div className="p-3 shadow-xl rounded-lg">
                    {item.status === 0 ? (
                      <p className="text-sm">
                        {t("page.dashboard.depositHistory.content_refuse", {
                          prive: `${VND.format(item.money)}VND`,reason: item.description
                        })}{" "}
                        {dayjs(item.updatedAt).format("DD/MM/YYYY HH:MM")}
                      </p>
                    ) : (
                      <p className="text-sm">
                        {t("page.dashboard.depositHistory.content", {
                          price: `${VND.format(item.money)}VND`,
                        })}{" "}
                        {dayjs(item.updatedAt).format("DD/MM/YYYY HH:MM")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {userCashHistory.length > 5 ? (
                <Link
                  to={"/user/cash"}
                  className="text-primary underline decoration-primary text-center block"
                >
                  {t("page.dashboard.seeAll")}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </div>
    );
  return;
};

export default CashHistory;
