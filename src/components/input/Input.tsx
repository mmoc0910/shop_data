import React, { FC } from "react";
import { Control, useController } from "react-hook-form";
import classNames from "../../utils/classNames";

// type FormValues = {
//   email: string;
//   password: string;
//   name: string;
// };

type InputType = {
  containerclass?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  control: Control<any>;
  name: string;
  placeholder?: string;
  children?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const Input: FC<InputType> = ({
  containerclass = "",
  type = "text",
  className = "",
  control,
  name,
  placeholder = "",
  children,
  ...rest
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name, defaultValue: "" });
  return (
    <div className={classNames("relative", containerclass)}>
      <input
        autoComplete="off"
        type={type}
        className={classNames(
          "focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none",
          error
            ? "border-error text-error"
            : "border-strock text-text1",
          children ? "pr-16" : "",
          className
        )}
        placeholder={error ? "" : placeholder}
        id={name}
        {...rest}
        {...field}
      />
      {error && (
        <div className="peer-focus:hidden w-full font-medium text-error absolute pointer-events-none h-full flex items-center justify-start px-[25px] top-0 left-0">
          <p className="text-sm bg-white line-clamp-1 w-3/4">
            {error.message}
          </p>
        </div>
      )}
      {children}
    </div>
  );
};

export default Input;
