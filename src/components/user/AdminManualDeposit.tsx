
import Heading from "../common/Heading";
import { FC } from "react";
import { Input } from "../input";
import Button from "../button/Button";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "../../api";
import { VND } from "../../utils/formatPrice";

const schema = yup
  .object({
    money: yup.number().required("This field is required"),
  })
  .required();
type Props = { accountId: string };
export const AdminManualDeposit: FC<Props> = ({ accountId }) => {
  const { t } = useTranslation();
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: { money: number }) => {
    if (data.money > 0) {
      console.log("acgsc");
      try {
        Swal.fire({
          title: `<p class="leading-tight">${t(
            "page.cash.payment.manual.ques"
          )}<span class="text-secondary">${VND.format(
            data.money
          )}VND</span></p>`,
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#1DC071",
          cancelButtonColor: "#d33",
          cancelButtonText: t("page.cash.payment.manual.cancelButton"),
          confirmButtonText: t("page.cash.payment.manual.confirmButton"),
        }).then(async (result) => {
          if (result.isConfirmed) {
            // const money =
            //   currency === "vi"
            //     ? data.money
            //     : currency === "ci"
            //     ? data.money * EXCHANGE_RATE_CHINA
            //     : data.money * EXCHANGE_RATE_ENGLISH;
            await api.post("/cashs/cash-by-admin", {
              money: data.money,
              userId: accountId,
              content: "Admin nạp",
              description: "",
            });
            setValue("money", 0);
            Swal.fire(`<p class='leading-tight'>Nạp tiền thành công</p>`);
          }
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error message: ", error);
          toast.error(error.response?.data.message);
        } else {
          return "An unexpected error occurred";
        }
      }
    } else {
      toast.warn("Bạn nhập số tiền không hợp lệ");
    }
  };
  return (
    <div>
      <Heading className="mb-4">Nạp tiền cho người dùng</Heading>
      <form
        className="mt-5 flex items-center gap-5 w-full md:w-2/3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          min={0}
          type="number"
          name="money"
          placeholder={t("page.cash.payment.manual.form.placeholder")}
          control={control}
          containerclass="flex-1"
        ></Input>
        <Button type="submit" className="text-white bg-primary px-5">
          Nạp tiền
        </Button>
      </form>
    </div>
  );
};
