import { useEffect, useState } from "react";

const UpdateExtension = ({
  initialValue,
  placeholder = "",
  onSubmit,
}: {
  initialValue?: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>();
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        value && onSubmit(value);
      }}
    >
      <input
        value={value}
        className="px-3 py-1 rounded-lg border border-gray-300 outline-none text-sm "
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
};

export default UpdateExtension;
