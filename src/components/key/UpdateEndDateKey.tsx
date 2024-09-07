import { DatePicker, DatePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { FC } from "react";
import IconEdit from "../../icons/IconEdit";
import Swal from "sweetalert2";
import { api } from "../../api";
import { toast } from "react-toastify";

type Props = { defaultValue: Dayjs; key_id: string };
export const UpdateEndDateKey: FC<Props> = ({ defaultValue, key_id }) => {
  console.log("default value ~ ", defaultValue);
  const [date, setDate] = useState<Dayjs>(defaultValue);
  const onChangeEndDate: DatePickerProps["onChange"] = (date) => {
    setDate(date);
  };
  const handleSubmit = async (_id: string) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: `<p class="leading-tight">Bạn có muốn sửa ngày kết thúc của key này</p>`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      });
      if (isConfirmed) {
        await api.patch(`/keys/end-date/${_id}`, {
          endDate: date,
        });
        toast.success("Sửa thành công");
      }
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trình xử lý");
    }
  };
  return (
    <div className="flex items-center">
      <DatePicker
        onChange={onChangeEndDate}
        className="!focus:border-primary text-black text-sm font-medium placeholder:text-text4 py-[15px] px-[25px] rounded-[10px] border border-solid w-full bg-inherit peer outline-none border-strock"
        placeholder="End date"
        defaultValue={dayjs(defaultValue)}
      />
      <button
        onClick={() => handleSubmit(key_id)}
        type="submit"
        className="text-gray-500 px-4"
      >
        <IconEdit className="size-6" />
      </button>
    </div>
  );
};
