import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export const SearchOrderBar = () => {
  const { setValue, watch } = useFormContext();
  const extensionSearchTermWatch = watch("extensionSearchTerm");
    console.log("extensionSearchTermWatch ~", extensionSearchTermWatch);
  //   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = event.target.value;
  //     setValue("extensionSearchTerm", value);
  //   };
  //   const handleResetInput = () => setValue("extensionSearchTerm", "");
  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => {
    const timeout = setTimeout(() => setValue("extensionSearchTerm", inputValue), 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [inputValue]);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
  };
  const handleResetInput = () => {
    setInputValue("");
    setValue("extensionSearchTerm", "");
  };
  return (
    <div className="items-center block gap-5 mb-5 space-y-3 md:flex md:space-y-0">
      <div className="relative flex-1">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
          placeholder="Tìm kiếm"
        />
        {inputValue.length > 0 ? (
          <span
            className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
            onClick={handleResetInput}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 text-icon-color"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        ) : null}
      </div>
      {/* <div className="flex items-center gap-5">
              <DatePicker
                onChange={onChangeStartDate}
                className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
                placeholder="Start date"
              />
              <DatePicker
                onChange={onChangeEndDate}
                className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
                placeholder="End date"
              />
            </div> */}
    </div>
  );
};
