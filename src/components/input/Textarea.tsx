import React from "react";
import { useController } from "react-hook-form";
import classNames from "../../utils/classNames";

const Textarea = ({
  className = "",
  control,
  name,
  placeholder = "",
  error = "",
  ...rest
}) => {
  const { field } = useController({ control, name, defaultValue: "" });
  return (
    <div className="relative">
      <textarea
        autoComplete="off"
        name
        className={classNames(
          "text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer dark:placeholder:text-text2 resize-none min-h-[140px]",
          error.length > 0
            ? "border-error text-error"
            : "border-strock dark:border-dark-strock text-text1 dark:text-white",
          className
        )}
        placeholder={placeholder}
        id={name}
        {...rest}
        {...field}
      />
      {error.length > 0 && (
        <div className="peer-focus:hidden w-full font-medium text-error absolute pointer-events-none py-[15px] px-[25px] top-0 left-0">
          <p className="text-sm bg-white dark:bg-dark-secondary">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Textarea;
