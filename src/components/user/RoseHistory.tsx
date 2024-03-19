import { RoseType } from "../../type";
import Heading from "../common/Heading";
import classNames from "../../utils/classNames";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const RoseHistory = ({ roseHistory }: { roseHistory: RoseType[] }) => {
  const { t } = useTranslation();
  if (roseHistory.length)
    return (
      <div className="space-y-4">
        <Heading>{t("page.dashboard.roseHistory.heading")}</Heading>
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
                      {t("page.dashboard.roseHistory.content", {
                        price: `${VND.format(item.recive)}VND`,
                        discount: item.percent,
                        user: item.introducedId.username,
                        package: item.plan,
                      })}{" "}
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

export default RoseHistory;
