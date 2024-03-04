import { useNavigate } from "react-router-dom";
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
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { api } from "../api";
import Loading from "../components/common/Loading";

const schema = yup
  .object({
    email: yup
      .string()
      .required("This field is required")
      .email("Incorrect email format"),
  })
  .required();

const FogotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { email, role } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigate();
  const { handleSubmit, control } = useForm({
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
  const onSubmit = async (data: { email: string }) => {
    try {
      setLoading(true);
      await api.post("/users/forgot-password", data);
      toast.success("Kiểm tra email của bạn để đặt lại mật khẩu");
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
    <LayoutAuthentication heading="">
      {loading && <Loading />}
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="email">Email*</Label>
          <Input
            name="email"
            placeholder={"example@gmail.com"}
            control={control}
          />
        </FormGroup>
        <Button type="submit" className="w-full text-white bg-primary">
          Forgot password
        </Button>
      </form>
    </LayoutAuthentication>
  );
};

export default FogotPassword;
