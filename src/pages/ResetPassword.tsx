import { useNavigate, useParams } from "react-router-dom";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/button/Button";
import FormGroup from "../components/common/FormGroup";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../api";

const schema = yup
  .object({
    newPassword: yup.string().required("This field is required"),
    reNewPassword: yup.string().required("This field is required"),
  })
  .required();

const ResetPassword = () => {
  const { token } = useParams();
  console.log("token - ", token);
  const { email, role } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigate();
  const { handleSubmit, control, setError } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  useEffect(() => {
    if (email) {
      role === 1
        ? navigation("/admin/dashboard")
        : navigation("/user/dashboard");
    }
  }, [email, navigation, role]);
  const onSubmit = async (data: {
    newPassword: string;
    reNewPassword: string;
  }) => {
    const { newPassword, reNewPassword } = data;
    try {
      if (newPassword === reNewPassword) {
        console.log("data sign in - ", data);
        await api.patch(`/users/reset-password`, { token, newPassword });
        toast.success("Đặt lại mật khẩu thành công vui lòng đăng nhập lại");
        navigation("/sign-in");
      } else {
        setError("reNewPassword", {
          message: "Xác nhận lại mật khẩu không khớp",
        });
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
    <LayoutAuthentication heading="">
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="newPassword">Mật khẩu mới*</Label>
          <Input
            name="newPassword"
            control={control}
            placeholder="Nhập mật khẩu mới"
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="reNewPassword">Mật khẩu mới*</Label>
          <Input
            name="reNewPassword"
            placeholder="Xác nhận lại mật khẩu"
            control={control}
          />
        </FormGroup>
        <Button type="submit" className="w-full text-white bg-primary">
          Đặt lại mật khẩu
        </Button>
      </form>
    </LayoutAuthentication>
  );
};

export default ResetPassword;
