import { useEffect, useState } from "react";
import { FC } from "react";
import { DropdownWithComponents } from "../dropdown";
import { CloudManagerType } from "../../type";
import { toast } from "react-toastify";
import { api } from "../../api";

type Props = {
  error?: string;
  data?: string;
  onSelect: (location: string) => void;
};
export const PickCloudManagerForm: FC<Props> = ({ onSelect, data, error }) => {
  const [listCloud, setListCloud] = useState<CloudManagerType[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const response = await api.get<{ listData: CloudManagerType[] }>(
          `/cloud-managers`
        );
        setListCloud(response.data.listData);
      } catch (error) {
        toast.error("Xảy ra lỗi trong quá trình xử lý");
      }
    })();
  }, []);
  return (
    <DropdownWithComponents>
      <DropdownWithComponents.Select
        placeholder={
          data ? (
            <span className="text-black">
              {listCloud.find((i) => i._id === data)?.name}
            </span>
          ) : error ? (
            <span className="text-error">{error}</span>
          ) : (
            <span className="text-text4">Select Cloud</span>
          )
        }
      ></DropdownWithComponents.Select>
      <DropdownWithComponents.List>
        {listCloud.length > 0 &&
          listCloud.map((cloud) =>
            cloud.status === 1 ? (
              <DropdownWithComponents.Option
                key={cloud._id}
                onClick={() => onSelect(cloud._id)}
              >
                <span className="capitalize">{cloud.name}</span>
              </DropdownWithComponents.Option>
            ) : null
          )}
      </DropdownWithComponents.List>
    </DropdownWithComponents>
  );
};
