import { FC, useState } from "react";
import IconEdit from "../../icons/IconEdit";
import PickLocationForm from "./PickLocationForm";
type EditLocationServerFormProps = {
  initialLocation: string;
  onSubmit: (value: string) => void;
};
const EditLocationServerForm: FC<EditLocationServerFormProps> = ({
  initialLocation,
  onSubmit,
}) => {
  const [location, setLocation] = useState<string>(initialLocation);
  return (
    <div className="flex items-center">
      <div className="w-full">
        <PickLocationForm
          location={location}
          onSelectLocation={(value) => setLocation(value)}
        />
      </div>
      <button
        type="submit"
        className="text-gray-500 px-4"
        onClick={() => onSubmit(location)}
      >
        <IconEdit />
      </button>
    </div>
  );
};

export default EditLocationServerForm;
