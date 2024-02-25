import { useState } from "react";

const UpdateExtension = ({
  placeholder = "",
  onSubmit,
}: {
  placeholder?: string;
  onSubmit: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>();
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        value && onSubmit(value);
      }}
    >
      <input
        className="px-3 py-1 rounded-lg border border-gray-300 w-[100px] outline-none text-sm"
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
};

export default UpdateExtension;
