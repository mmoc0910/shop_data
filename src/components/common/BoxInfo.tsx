import { FC } from "react";
import classNames from "../../utils/classNames";

type Props = { className?: String; label: String; children?: React.ReactNode };
export const BoxInfo: FC<Props> = ({ className = "", label, children }) => {
  return (
    <div
      className={classNames(
        "col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg flex flex-col gap-1",
        className
      )}
    >
      {label}: <div className="font-medium">{children}</div>
    </div>
  );
};
