import React, { FC } from "react";
import classNames from "../../utils/classNames";

type RadioType = {
  checked?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
};
const Radio: FC<RadioType> = ({
  checked = false,
  onClick = () => {},
  children,
}) => {
  return (
    <div className="flex items-start gap-2 max-sm:items-start max-md:items-center">
      <div
        className={classNames(
          "w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-75 cursor-pointer",
          checked
            ? "border-primary bg-primary text-white"
            : "border-text4 text-white"
        )}
        onClick={onClick}
      >
        <input type="checkbox" className="hidden" />
        <div className={classNames("w-2 h-2 rounded-full bg-white",checked ? "block" : "hidden")}></div>
      </div>
      {children && (
        <div className="flex-1 cursor-pointer select-none text-sm" onClick={onClick}>
          {children}
        </div>
      )}
    </div>
  );
};



export default Radio;
