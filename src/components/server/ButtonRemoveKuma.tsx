import React, { useState } from "react";
import Swal from "sweetalert2";
import { api } from "../../api";
import { ServerType } from "../../type";
import { FC } from "react";
import { toast } from "react-toastify";
import IconBoltSplash from "../../icons/IconBoltSplash";
import classNames from "../../utils/classNames";

type Props = {
  server: ServerType;
  onSubmit?: () => void;
  icon?: boolean;
};

const ButtonRemoveKuma: FC<Props> = ({
  server,
   onSubmit = () => {},
  icon = false,
}) => {
  const [enable, setEnable] = useState(
    server.isConnectKuma === 0 ? false : true
  );
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
          id: server._id,
        });
        setEnable(false);
        onSubmit();
        toast.success("Thành công");
      }
    } catch (error) {
      toast.error("Xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };
  if (!enable) return;
  return (
    <button
      type="button"
      className={classNames(
        "text-xs font-medium text-white rounded-lg bg-error flex items-center justify-center",
        icon ? "w-7 aspect-square" : "p-2 w-28"
      )}
      onClick={handleRemoveKuma}
    >
      {loading ? (
        <div className="w-4 h-4 border-white border-2 border-solid border-t-transparent animate-spin rounded-full" />
      ) : (
        <React.Fragment>
          {icon ? <IconBoltSplash /> : "Remove Kuma"}
        </React.Fragment>
      )}
    </button>
  );
};

export default ButtonRemoveKuma;
