import React, { FC } from "react";
import classNames from "../../utils/classNames";

type CheckboxType = {
  checked?: boolean;
  onClick?: (checked: boolean) => void;
  children?: React.ReactNode;
};
const Checkbox: FC<CheckboxType> = ({
  checked = false,
  onClick = () => {},
  children,
}) => {
  return (
    <div className="flex items-start gap-4 max-sm:items-start max-md:items-center">
      <div
        className={classNames(
          "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all duration-75 cursor-pointer",
          checked
            ? "border-primary bg-primary text-white"
            : "border-text4 text-white"
        )}
        onClick={() => onClick(checked)}
      >
        <input type="checkbox" className="hidden" />
        <span>
          <IconCheck />
        </span>
      </div>
      {children && (
        <div className="flex-1 cursor-pointer select-none text-sm" onClick={() => onClick(checked)}>
          {children}
        </div>
      )}
    </div>
  );
};

export const IconCheck = () => {
  return (
    <svg
    className="w-[10px] h-[10px]"
      width="12"
      height="9"
      viewBox="0 0 12 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 4.5L4.33333 8L11 1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Checkbox;
