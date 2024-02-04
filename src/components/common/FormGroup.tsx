import React from "react";
const FormGroup = ({ children }: {children: React.ReactNode}) => {
  return <div className="flex flex-col gap-[10px]">{children}</div>;
};

export default FormGroup;
