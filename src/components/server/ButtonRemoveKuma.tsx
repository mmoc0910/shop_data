import { useState } from "react";
import Swal from "sweetalert2";
import { api } from "../../api";
import { ServerType } from "../../type";
import { FC } from "react";
import { toast } from "react-toastify";

type Props = { server: ServerType; onSubmit: () => void };

const ButtonRemoveKuma: FC<Props> = ({ server, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const handleRemoveKuma = async () => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn remove kuma</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        setLoading(true);
        await api.post(`/kuma/remove`, {
          name: `${server.name}-${server.hostnameForAccessKeys}`,
        });
        onSubmit();
        toast.success("Thành công");
      }
    } catch (error) {
      toast.error("Xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };
  if (server.isConnectKuma === 0) return;
  return (
    <button
      type="button"
      className="p-2 text-xs font-medium text-white rounded-lg bg-error w-28 flex items-center justify-center"
      onClick={handleRemoveKuma}
    >
      {loading ? (
        <div className="w-4 h-4 border-white border-2 border-solid border-t-transparent animate-spin rounded-full" />
      ) : (
        "Remove Kuma"
      )}
    </button>
  );
};

export default ButtonRemoveKuma;
