
import { FC } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "../../api";
import { AdjustmentsHorizontal } from "../../icons/AdjustmentsHorizontal";

type Props = {
  serverId: string;
  status: number;
  handleFetchData: () => void;
};

const SERVER_STATUS = [
  { id: 1, title: "Active" },
  { id: 2, title: "Down" },
  { id: 3, title: "Maintenance" },
];

const ChangeStatusServerButton: FC<Props> = ({
  serverId,
  status,
  handleFetchData,
}) => {
  const handleChangeStatusServer = async (
    _id: string,
    statusServer: number
  ) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn thay đổi trạng thái máy chủ này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.patch(`/servers/status-server/${_id}`, {
          status: statusServer,
        });
        handleFetchData();
        toast.success("Thành công");
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
    <div className="flex gap-2 relative group">
      <div className="size-7 rounded-md bg-primary40 flex items-center justify-center text-white">
        <AdjustmentsHorizontal />
      </div>
      <div className="absolute z-[10000000000] bg-primary40 rounded-md overflow-hidden shadow-xl bottom-full left-0 opacity-0 invisible group-hover:opacity-100 group-hover:visible">
        {SERVER_STATUS.map((item) =>
          item.id !== status ? (
            <button
              type="button"
              key={item.id}
              // className="px-2 text-xs font-medium text-white rounded-md bg-secondary40 font-primary"
              className="px-5 py-1 font-medium text-white"
              onClick={() => handleChangeStatusServer(serverId, item.id)}
            >
              {item.title}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
};

export default ChangeStatusServerButton;
