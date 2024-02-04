import React, { FC } from "react";
import classNames from "../../utils/classNames";

type LabelType = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
};
const Label: FC<LabelType> = ({ children, htmlFor = "", className = "" }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={classNames(
        "text-sm font-medium capitalize text-text-2 dark:text-text3",
        className
      )}
    >
      {children}
    </label>
  );
};

export default Label;
