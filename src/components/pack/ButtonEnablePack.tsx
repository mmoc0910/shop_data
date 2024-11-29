import axios from "axios";
import { FC } from "react";
import Swal from "sweetalert2";
import { api } from "../../api";
import IconCloseLock from "../../icons/IconCloseLock";
import IconLockOpen from "../../icons/IconLockOpen";
import { toast } from "react-toastify";
import classNames from "../../utils/classNames";

type Props = { _id: string; enable: boolean; onSuccess: () => void };
export const ButtonEnablePack: FC<Props> = ({ _id, onSuccess, enable }) => {
  console.log("enable ~ ", enable);
  const handleSubmit = async () => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn ${
          enable ? "disable" : "enable"
        } gói cước này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.patch(`/plans/${_id}`, { enable: enable ? 0 : 1 });
        onSuccess();
        toast.success("Chỉnh sửa thành công");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Xảy ra lỗi trong quá trình xử lý");
      }
    }
  };
  return (
    <button
      className={classNames(
        "px-2 aspect-square text-xs font-medium text-white rounded-md font-primary",
        enable ? "bg-primary20" : "bg-error"
      )}
      onClick={handleSubmit}
    >
      {enable ? <IconLockOpen /> : <IconCloseLock />}
    </button>
  );
};
