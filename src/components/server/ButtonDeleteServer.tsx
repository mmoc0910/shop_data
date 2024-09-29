import { useState } from "react";
import IconTrash from "../../icons/IconTrash";
import Swal from "sweetalert2";
import { FC } from "react";
import { api } from "../../api";
import { KeySeverType } from "../../type";
import { toast } from "react-toastify";
import axios from "axios";

type Props = {
  serverId: string;
  serverName: string;
  handleFetchData: () => void;
};
export const ButtonDeleteServer: FC<Props> = ({
  serverId,
  handleFetchData,
  serverName,
}) => {
  const [loading, setLoading] = useState(false);
  const handleRemoveServer = async (_id: string) => {
    try {
      const { isConfirmed, isDenied } = await Swal.fire({
        title: `<p class="leading-tight">Xóa máy chủ ${serverName}</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Xóa cùng Kuma",
        denyButtonText: "Chỉ xóa",
        denyButtonColor: "#d33",
        showDenyButton: true,
      });
      if (isConfirmed) {
        setLoading(true);
        const result = await api.get<KeySeverType[]>(
          `/keys?serverId=${_id}&status=1`
        );
        if (result.data.length > 0) {
          toast.warn(
            "Bạn phải migrate key sang server khác trước khi muốn xóa"
          );
        } else {
          await api.delete(`/servers/${_id}`, {
            params: { isDeleteKuma: 1 },
          });
          handleFetchData();
          toast.success("Xóa thành công");
        }
      }
      if (isDenied) {
        setLoading(true);
        const result = await api.get<KeySeverType[]>(
          `/keys?serverId=${_id}&status=1`
        );
        if (result.data.length > 0) {
          toast.warn(
            "Bạn phải migrate key sang server khác trước khi muốn xóa"
          );
        } else {
          await api.delete(`/servers/${_id}`);
          handleFetchData();
          toast.success("Xóa thành công");
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      className="w-7 flex items-center justify-center aspect-square text-xs font-medium text-white rounded-md bg-error font-primary"
      onClick={() => handleRemoveServer(serverId)}
    >
      {loading ? (
        <div className="w-3 h-3 border-white border-2 border-solid border-t-transparent animate-spin rounded-full" />
      ) : (
        <IconTrash className="size-4" />
      )}
    </button>
  );
};
