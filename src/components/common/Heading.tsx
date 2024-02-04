import React, { FC } from "react";
import classNames from "../../utils/classNames";

type HeadingType = { children: React.ReactNode; className?: string };
const Heading: FC<HeadingType> = ({ children, className = "mb-5" }) => {
  return (
    <h2
      className={classNames(
        "text-lg font-semibold text-text1 dark:text-white",
        className
      )}
    >
      {children}
    </h2>
  );
};

export default Heading;
