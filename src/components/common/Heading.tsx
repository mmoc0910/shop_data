import React, { FC } from "react";
import classNames from "../../utils/classNames";

type HeadingType = { children: React.ReactNode; className?: string };
const Heading: FC<HeadingType> = ({ children, className = "" }) => {
  return (
    <h2
      className={classNames(
        "text-lg font-semibold text-text1",
        className
      )}
    >
      {children}
    </h2>
  );
};

export default Heading;
