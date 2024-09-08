import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IconXCircle from "../../icons/IconXCircle";
import IconEdit from "../../icons/IconEdit";

const UpdateExtensionKey = ({
  initialValue,
  placeholder = "",
  onSubmit,
  key_id,
}: {
  initialValue?: string;
  placeholder?: string;
  onSubmit: (value: string) => void;
  key_id: string;
}) => {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState<string>();
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  if (!edit)
    return (
      <div className="flex items-center gap-3">
        <Link target="_blank"
          to={`/admin/key/${key_id}`}
          className="text-sm font-primary text-primary"
        >
          {initialValue}
        </Link>
        <div
          className="text-gray-400 cursor-pointer hover:text-black"
          onClick={() => setEdit(true)}
        >
          <IconEdit />
        </div>
      </div>
    );
  if (edit)
    return (
      <div className="flex items-center gap-3">
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
        <div
          className="text-gray-400 cursor-pointer hover:text-black"
          onClick={() => setEdit(false)}
        >
          <IconXCircle />
        </div>
      </div>
    );
};

export default UpdateExtensionKey;
