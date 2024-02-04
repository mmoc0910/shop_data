import React from "react";

const FormRow = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] lg:gap-[45px]">
      {children}
    </div>
  );
};

export default FormRow;
