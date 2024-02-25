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
import { api } from "../api";
import { AuthState } from "../store/auth/authSlice";
import { toast } from "react-toastify";
import { countries } from "../constants";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import Radio from "../components/radio/Radio";
import axios from "axios";

const purposes = [
  { id: 1, title: "Access global internet from China" },
  { id: 2, title: "Access global internet from Iran" },
  { id: 3, title: "Play Gaming" },
  { id: 4, title: "Others" },
];

const schema = yup
  .object({
    email: yup
      .string()
      .required("This field is required")
      .email("Incorrect email format"),
    password: yup
      .string()
      .required("This field is required")
      .min(8, "Minimum of 8 characters"),
    rePassword: yup
      .string()
      .required("This field is required")
      .min(8, "Minimum of 8 characters"),
    phone: yup.string().required(),
    // address: yup.string().required(),
    country: yup.string().required().default("vi"),
    purpose: yup.number().required().default(1),
    introduceCode: yup.string(),
    // job: yup.string().required(),
  })
  .required();

const SignUpPage = () => {
  const { email, role } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigate();
  const { value: tooglePassword, handleToogleValue: handleTooglePassword } =
    useToogleValue();
  const { value: toogleRePassword, handleToogleValue: handleToogleRePassword } =
    useToogleValue();
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
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
  const country = watch("country", "vi");
  const purpose = watch("purpose", 1);
  console.log("country - ", country);
  const onSubmit = async (data: {
    email: string;
    password: string;
    phone: string;
    country: string;
    purpose: number;
    introduceCode?: string;
    rePassword: string;
  }) => {
    try {
      console.log("data sign in - ", data);
      const {
        email,
        password,
        country,
        phone,
        purpose,
        rePassword,
        introduceCode,
      } = data;
      console.log("data sign in - ", data);
      if (password === rePassword) {
        if (introduceCode) {
          if (introduceCode.length === 24) {
            const result = await api.post<{ data: AuthState }>("/users", {
              email,
              password,
              country,
              phone,
              purpose,
              introduceCode,
            });
            console.log("result - ", result.data);
            navigation("/sign-in");
            toast.success("Đăng ký tài khoản thành công");
          } else {
            setError("introduceCode", {
              message: "Mã giới thiệu phải có độ dài 24 ký tự",
            });
          }
        } else {
          const result = await api.post<{ data: AuthState }>("/users", {
            email,
            password,
            country,
            phone,
            purpose,
          });
          console.log("result - ", result.data);
          navigation("/sign-in");
          toast.success("Đăng ký tài khoản thành công");
        }
      } else {
        setError("rePassword", { message: "Xác nhận mật khẩu không đúng" });
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
    <LayoutAuthentication heading="Sign Up">
      <p className="mb-[25px] md:mb-[30px] text-xs font-normal text-center md:text-sm md:font-medium text-text3">
        Already have an account?{" "}
        <Link
          to={"/sign-in"}
          className="inline font-medium underline text-primary"
        >
          Sign in
        </Link>
      </p>
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* <FormGroup>
          <Label htmlFor="name">full name*</Label>
          <Input name="name" placeholder={"Jhon Doe"} control={control} />
        </FormGroup> */}
        <FormGroup>
          <Label htmlFor="email">email*</Label>
          <Input
            name="email"
            placeholder={"example@gmail.com"}
            control={control}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phone">Phone*</Label>
          <Input name="phone" placeholder={"0123456789"} control={control} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="introduceCode">Introduce Code</Label>
          <Input name="introduceCode" placeholder={""} control={control} />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="country">Country*</Label>
          <div className="grid grid-cols-4 gap-5">
            {countries.map((item) => (
              <Radio
                checked={item.key === country}
                key={item.key}
                onClick={() => setValue("country", item.key)}
              >
                {item.title}
              </Radio>
            ))}
          </div>
          {errors.country?.message ? (
            <p className="text-sm font-medium text-error">
              {errors.country.message}
            </p>
          ) : null}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="country">Purpose using VPN</Label>
          <div className="flex  flex-col gap-3">
            {purposes.map((item) => (
              <Radio
                checked={item.id === purpose}
                key={item.id}
                onClick={() => setValue("purpose", item.id)}
              >
                {item.title}
              </Radio>
            ))}
          </div>
          {errors.purpose?.message ? (
            <p className="text-sm font-medium text-error">
              {errors.purpose.message}
            </p>
          ) : null}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">password*</Label>
          <Input
            type={tooglePassword ? "text" : "password"}
            name="password"
            placeholder={"Create a password"}
            control={control}
          >
            <IconEyeToogle
              className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
              open={tooglePassword}
              onClick={handleTooglePassword}
            ></IconEyeToogle>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password">Re-type Password*</Label>
          <Input
            type={toogleRePassword ? "text" : "password"}
            name="rePassword"
            placeholder={"Create a password"}
            control={control}
          >
            <IconEyeToogle
              className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
              open={toogleRePassword}
              onClick={handleToogleRePassword}
            />
          </Input>
        </FormGroup>
        <Button type="submit" className="w-full text-white bg-primary">
          Create my account
        </Button>
      </form>
    </LayoutAuthentication>
  );
};

export default SignUpPage;
