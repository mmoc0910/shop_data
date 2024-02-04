import React from "react";

export const useToogleValue = (initialValue: boolean = false) => {
  const [value, setValue] = React.useState<boolean>(initialValue);
  const handleToogleValue = () => {
    setValue(!value);
  };

  return {
    value,
    handleToogleValue,
  };
};
