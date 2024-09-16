import { FC, useState } from "react";
import IconEdit from "../../icons/IconEdit";
import PickCloudForm from "../cloud/PickCloudForm";
type EditLocationServerFormProps = {
  initialLocation: string;
  onSubmit: (value: string) => void;
};
const EditCloudServerForm: FC<EditLocationServerFormProps> = ({
  initialLocation,
  onSubmit,
}) => {
  const [location, setLocation] = useState<string>(initialLocation);
  return (
    <div className="flex items-center">
      <div className="w-full">
        <PickCloudForm
          onSelectCloud={(value) => setLocation(value)}
          location={location}
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

export default EditCloudServerForm;
