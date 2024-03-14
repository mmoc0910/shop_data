import { Control, useController } from "react-hook-form";
import classNames from "../../utils/classNames";
import { FC } from "react";

type TextareaType = {
  className?: string;
  control: Control<any>;
  name: string;
  placeholder?: string;
};
const Textarea: FC<TextareaType> = ({
  className = "",
  control,
  name,
  placeholder = "",
}) => {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name, defaultValue: "" });
  return (
    <div className="relative">
      <textarea
        autoComplete="off"
        className={classNames(
          "outline-none text-sm focus:border-primary font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer resize-none ",
          error?.message
            ? "border-error text-error"
            : "border-strock text-text1",
          className
        )}
        placeholder={placeholder}
        id={name}
        {...field}
      />
      {error?.message && (
        <div className="peer-focus:hidden w-full font-medium text-error absolute pointer-events-none py-[15px] px-[25px] top-0 left-0">
          <p className="text-sm bg-white">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default Textarea;
