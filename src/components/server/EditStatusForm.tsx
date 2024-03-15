import { FC, useState } from "react";
import Radio from "../radio/Radio";

export type StatusType = "enable" | "disable";
type EditStatusFormProps = {
  enableSubmit?: boolean;
  initialValue: StatusType;
  onSubmit: (value: StatusType) => void;
};
const EditStatusForm: FC<EditStatusFormProps> = ({
  enableSubmit = true,
  initialValue,
  onSubmit,
}) => {
  const [value, setValue] = useState<StatusType>(initialValue);
  return (
    <div className="flex items-center gap-4">
      <Radio
        checked={value === "enable"}
        onClick={() => enableSubmit && setValue("enable")}
      >
        Enable
      </Radio>
      <Radio
        checked={value === "disable"}
        onClick={() => enableSubmit && setValue("disable")}
      >
        Disabled
      </Radio>
      {enableSubmit ? (
        <button
          className="px-4 py-2 text-xs font-medium text-white rounded-lg bg-secondary20 font-primary"
          onClick={() => onSubmit(value)}
        >
          Apply
        </button>
      ) : null}
    </div>
  );
};

export default EditStatusForm;
