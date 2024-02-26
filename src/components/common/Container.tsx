import React from "react";
import classNames from "../../utils/classNames";

const Container = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={classNames("w-full xl:w-[1200px] mx-auto px-6", className)}>
      {children}
    </div>
  );
};

export default Container;
