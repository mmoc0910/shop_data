import React from "react";
import classNames from "../../utils/classNames";
const FormGroup = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={classNames("flex flex-col gap-[10px]", className)}>
      {children}
    </div>
  );
};

export default FormGroup;
