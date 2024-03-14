import { FC, useEffect, useRef, useState } from "react";
import { DropdownWithComponents } from "../dropdown";
import { LocationType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { api } from "../../api";
import classNames from "../../utils/classNames";
import { toast } from "react-toastify";
import IconEdit from "../../icons/IconEdit";
import IconTrash from "../../icons/IconTrash";
import axios from "axios";
import Swal from "sweetalert2";
import EllipsisHorizontalCircle from "../../icons/EllipsisHorizontalCircle";
import IconCancel from "../../icons/IconCancel";

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
  const [mode, setMode] = useState<"action" | "normal">("normal");
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
  const handleRemoveLocation = async (_id: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn mua xóa location này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.delete(`/locations/${_id}`);
        fetchData();
        toast.success("Xóa thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };
  const handleEditLocation = async (_id: string, value: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn mua sửa location này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.patch(`/locations/${_id}`, { name: value });
        fetchData();
        toast.success("Sửa thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
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
        <div className="flex items-center gap-3 justify-between">
          <DropdownWithComponents.Search
            placeholder="Add location"
            onSubmit={(value) => handleAddLocation(value)}
          ></DropdownWithComponents.Search>
          {mode === "normal" ? (
            <span
              className="pr-5 cursor-pointer"
              onClick={() => setMode("action")}
            >
              <EllipsisHorizontalCircle className="w-5 h-5" />
            </span>
          ) : (
            <span
              className="pr-5 cursor-pointer"
              onClick={() => setMode("normal")}
            >
              <IconCancel className="w-5 h-5" />
            </span>
          )}
        </div>

        {locations.length > 0 &&
          mode === "normal" &&
          locations.map((item) => (
            <DropdownWithComponents.Option
              key={uuidv4()}
              onClick={() => onSelectLocation(item.name)}
            >
              <span className="capitalize">{item.name}</span>
            </DropdownWithComponents.Option>
          ))}
        {locations.length > 0 &&
          mode === "action" &&
          locations.map((item) => (
            <EditLocation
              key={uuidv4()}
              location={item}
              onRemove={() => handleRemoveLocation(item._id)}
              onEdit={(value) => handleEditLocation(item._id, value)}
            />
          ))}
      </DropdownWithComponents.List>
    </DropdownWithComponents>
  );
};

const EditLocation = ({
  location,
  onRemove,
  onEdit,
}: {
  location: LocationType;
  onRemove: () => void;
  onEdit: (value: string) => void;
}) => {
  const [value, setValue] = useState<string>(location.name);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="items-center flex gap-4 w-full px-5 py-4 text-sm">
      <div className="relative w-full">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="outline-none caret-primary w-full"
        />
      </div>
      <span onClick={() => onEdit(value)} className="cursor-pointer">
        <IconEdit className="w-4 h-4 text-icon-color hover:text-secondary" />
      </span>
      <span className="cursor-pointer" onClick={() => onRemove()}>
        <IconTrash className="w-5 h-5 text-icon-color hover:text-secondary" />
      </span>
    </div>
  );
};

export default PickLocationForm;
