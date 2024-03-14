import { useState } from "react";
import IconPlus from "../../icons/IconPlus";

const Search = ({
  placeholder,
  onSubmit,
}: {
  placeholder: string;
  onSubmit: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>("");
  return (
    <div className="sticky top-0 z-10 p-2 bg-inherit flex items-center w-full">
      <input
        type="text"
        placeholder={placeholder}
        className="text-sm font-medium placeholder:text-text4 py-[12px] px-[25px] pr-10 rounded-[10px] border border-solid w-full bg-inherit peer border-strock text-text1 outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <span
        className="absolute right-4 cursor-pointer"
        onClick={() => {
          onSubmit(value);
          setValue("");
        }}
      >
        <IconPlus className="w-[20px] h-[20px] text-icon-color hover:text-secondary" />
      </span>
    </div>
  );
};

export default Search;
