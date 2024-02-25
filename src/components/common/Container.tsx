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
    <div className={classNames("w-[1200px] mx-auto", className)}>
      {children}
    </div>
  );
};

export default Container;
