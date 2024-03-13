import { FC, useEffect, useState } from "react";
import { DropdownWithComponents } from "../dropdown";
import { LocationType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../api";
import classNames from "../../utils/classNames";
import { toast } from "react-toastify";

type PickLocationFormProps = {
  error?: string;
  location?: string;
  onSelectLocation: (location: string) => void;
};
const PickLocationForm: FC<PickLocationFormProps> = ({
  error,
  location,
  onSelectLocation,
}) => {
  console.log("error - ", error);
  const [locations, setLocations] = useState<LocationType[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await api.get<LocationType[]>("/locations");
      setLocations(result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };

  const handleAddLocation = async (value: string) => {
    try {
      await api.post("/locations", {
        name: value,
      });
      fetchData();
      toast.success("Thêm thành công");
    } catch (error) {
      console.log("error - ", error);
    }
  };

  return (
    <DropdownWithComponents>
      <DropdownWithComponents.Select
        className={classNames(error ? "!border-error" : "")}
        placeholder={
          location ? (
            <span className="text-black">
              {locations.find((i) => i.name === location)?.name}
            </span>
          ) : error ? (
            <span className="text-error">{error}</span>
          ) : (
            <span className="text-text4">Select Location</span>
          )
        }
      ></DropdownWithComponents.Select>

      <DropdownWithComponents.List>
        <DropdownWithComponents.Search
          placeholder="Add location"
          onSubmit={(value) => handleAddLocation(value)}
        ></DropdownWithComponents.Search>
        {locations.length > 0 &&
          locations.map((item) => (
            <DropdownWithComponents.Option
              key={uuidv4()}
              onClick={() => onSelectLocation(item.name)}
            >
              <span className="capitalize">{item.name}</span>
            </DropdownWithComponents.Option>
          ))}
      </DropdownWithComponents.List>
    </DropdownWithComponents>
  );
};

export default PickLocationForm;
