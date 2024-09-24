import { useState } from "react";
import { EditServerForm } from "../../pages/admin/ServerDetailAdminPage";
import { FC } from "react";
import { api } from "../../api";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import IconXCircle from "../../icons/IconXCircle";
import IconEdit from "../../icons/IconEdit";
import { Link } from "react-router-dom";

type Props = { serverName: string; serverId: string; onSuccess: () => void };
export const ButtonChangeServerName: FC<Props> = ({
  serverName,
  serverId,
  onSuccess = () => {},
}) => {
  const [edit, setEdit] = useState(false);
  if (!edit)
    return (
      <div className="flex items-center gap-3">
        <Link
          to={`/admin/server/${serverId}`}
          className="text-sm font-primary text-primary"
          target="_blank"
        >
          {serverName}
        </Link>
        <div
          className="text-gray-400 cursor-pointer hover:text-black"
          onClick={() => setEdit(true)}
        >
          <IconEdit />
        </div>
      </div>
    );
  return (
    <div className="flex items-center gap-3">
      <EditServerForm containerClass="w-[120px]"
        isButtonSubmit={false}
        placeholder={serverName}
        handleEdit={async (value: string) => {
          try {
            await api.patch(`/servers/name-server/${serverId}`, {
              name: value,
            });
            onSuccess();
            toast.success("Thành công");
          } catch (error) {
            toast.error(messages.error);
          }
        }}
      />
      <div
        className="text-gray-400 cursor-pointer hover:text-black"
        onClick={() => setEdit(false)}
      >
        <IconXCircle />
      </div>
    </div>
  );
};
