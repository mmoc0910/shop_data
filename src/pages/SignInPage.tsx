import IconEyeToogle from "../icons/IconEyeToogle";
import { Link, useNavigate } from "react-router-dom";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { useToogleValue } from "../hooks/useToogleValue";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/button/Button";
import FormGroup from "../components/common/FormGroup";
import { Label } from "../components/label";
import { Input } from "../components/input";
import { useDispatch, useSelector } from "react-redux";
import { api } from "../api";
import { AuthState, setAuth } from "../store/auth/authSlice";
import { RootState } from "../store/configureStore";
import { useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const schema = yup
  .object({
    account: yup
      .string()
      .required("This field is required"),
      // .email("Incorrect email format"),
    password: yup.string().required("This field is required"),
    // .min(8, "Minimum of 8 characters"),
  })
  .required();

const SignInPage = () => {
  const { email, role } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { value: tooglePassword, handleToogleValue: handleTooglePassword } =
    useToogleValue();
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
  const onSubmit = async (data: { account: string; password: string }) => {
    try {
      console.log("data sign in - ", data);
      const result = await api.post<{ data: AuthState }>("/users/login", data);
      console.log("resut - ", result.data);
      dispatch(setAuth(result.data.data));
      if (result.data.data.role === 1) {
        navigation("/admin/dashboard");
      } else if (result.data.data.role === 2) {
        navigation("/user/dashboard");
      }
      toast.success("Đăng nhập thành công");
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
    <LayoutAuthentication heading="Welcome Back!">
      <p className="mb-[25px] md:mb-[30px] text-xs font-normal text-center md:text-sm md:font-medium text-text3">
        Dont have an account?{" "}
        <Link
          to={"/sign-up"}
          className="inline font-medium underline text-primary"
        >
          Sign up
        </Link>
      </p>
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="account">Username or Email*</Label>
          <Input
            name="account"
            // placeholder={"example@gmail.com"}
            control={control}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">password*</Label>
          <Input
            type={tooglePassword ? "text" : "password"}
            name="password"
            placeholder={"Enter Password"}
            control={control}
          >
            <IconEyeToogle
              className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
              open={tooglePassword}
              onClick={handleTooglePassword}
            ></IconEyeToogle>
          </Input>
        </FormGroup>
        <div className="flex justify-end">
          <Link to={'/forgot-password'} className="text-sm font-medium cursor-pointer select-none text-primary">
            Forgot password
          </Link>
        </div>
        <Button type="submit" className="w-full text-white bg-primary">
          Sign in
        </Button>
      </form>
    </LayoutAuthentication>
  );
};

export default SignInPage;
