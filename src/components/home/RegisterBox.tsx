import Container from "../common/Container";
import { Label } from "../label";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useToogleValue } from "../../hooks/useToogleValue";
import IconEyeToogle from "../../icons/IconEyeToogle";
import Button from "../button/Button";
import { Input } from "../input";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { AuthState } from "../../store/auth/authSlice";
import { DropdownWithComponents } from "../dropdown";
import { countries, purposes } from "../../constants";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";

const schema = yup
  .object({
    username: yup.string().required("This field is required"),
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
    country: yup.string().required(),
    purpose: yup.number().required(),
    introduceCode: yup.string(),
    // job: yup.string().required(),
  })
  .required();

const RegisterBox = () => {
  const { _id } = useSelector((state: RootState) => state.auth);
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
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const country = watch("country");
  const purpose = watch("purpose");
  const onSubmit = async (data: {
    username: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    purpose: number;
    introduceCode?: string;
    rePassword: string;
  }) => {
    try {
      const {
        username,
        email,
        password,
        country,
        phone,
        purpose,
        rePassword,
        introduceCode,
      } = data;
      if (password === rePassword) {
        if (introduceCode) {
          if (introduceCode.length === 7) {
            await api.post<{ data: AuthState }>("/users", {
              username,
              email,
              password,
              country,
              phone,
              purpose,
              introduceCode,
            });
            navigation("/sign-in");
            toast.success("Đăng ký tài khoản thành công");
          } else {
            setError("introduceCode", {
              message: "Mã giới thiệu phải có độ dài 7 ký tự",
            });
          }
        } else {
          await api.post<{ data: AuthState }>("/users", {
            username,
            email,
            password,
            country,
            phone,
            purpose,
          });
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
    <Container className="py-10 lg:py-20 space-y-5 lg:space-y-10 xl:w-[1000px] relative z-10">
      <div className="grid grid-cols-5 md:grid-cols-10 gap-5">
        <div className="col-span-5 space-y-5">
          <p className="font-medium text-2xl lg:text-4xl">Liên hệ</p>
          <p className="w-full lg:w-3/4">
            Vui lòng liên hệ với chúng tôi qua số điện thoại, email hoặc fanpage
            dưới đây
          </p>
          <div className="">
            <div className="mb-7 space-y-1 pl-8 relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-full after:left-0 after:top-[8px] before:absolute before:h-[calc(100%+1.75rem)] before:w-[1px] before:bg-primary before:left-[6px] before:top-[8px]">
              <p className="font-medium text-primary text-xl lg:text-2xl tracking-wider">
                Số điện thoại
              </p>
              <div className="">
                <a href="tel:+186 8415 2243" className="block">
                  +86 8415 2243
                </a>
                <a href="tel:+84 909 084 883" className="block">
                  +84 909 084 883
                </a>
              </div>
            </div>
            <div className="mb-7 space-y-1 pl-8 relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-full after:left-0 after:top-[8px] before:absolute before:h-[calc(100%+1.75rem)] before:w-[1px] before:bg-primary before:left-[6px] before:top-[8px]">
              <p className="font-medium text-primary text-xl lg:text-2xl tracking-wider">
                Địa chỉ email
              </p>
              <div className="">
                <a href="mailto:vpncn2.top@gmail.com">vpncn2.top@gmail.com</a>
              </div>
            </div>
            <div className="mb-7 space-y-1 pl-8 relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-full after:left-0 after:top-[8px] before:absolute before:h-[calc(100%+1.75rem)] before:w-[1px] before:bg-primary before:left-[6px] before:top-[8px]">
              <p className="font-medium text-primary text-xl lg:text-2xl tracking-wider">
                Địa chỉ Website
              </p>
              <div className="">
                <Link to={"http://vpncn2.top"} target="_blank">
                  www.vpncn2.top
                </Link>
              </div>
            </div>
            <div className="mb-7 space-y-1 pl-8 relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-full after:left-0 after:top-[8px]">
              <p className="font-medium text-primary text-xl lg:text-2xl tracking-wider">
                Fanpage
              </p>
              <div className="">
                <div className="flex mt-7 gap-4 md:gap-7">
                  <Link
                    to={
                      "https://www.facebook.com/profile.php?id=61555234487511"
                    }
                    target="_blank"
                    className="flex flex-col items-center gap-5"
                  >
                    <svg
                      className="w-8 h-8 lg:w-16 lg:h-16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
                    </svg>
                    <p className="text-xs lg:text-base font-medium">Facebook</p>
                  </Link>
                  <Link to={""} className="flex flex-col items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-8 h-8 lg:w-16 lg:h-16"
                    >
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                    <p className="text-xs lg:text-base font-medium">
                      Instagram
                    </p>
                  </Link>
                  <Link to={""} className="flex flex-col items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-8 h-8 lg:w-16 lg:h-16"
                    >
                      <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                    </svg>
                    <p className="text-xs lg:text-base font-medium">Tiktok</p>
                  </Link>
                  <Link to={""} className="flex flex-col items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-8 h-8 lg:w-16 lg:h-16"
                    >
                      <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                    </svg>
                    <p className="text-xs lg:text-base font-medium">Douyin</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        {_id ? null : (
          <form
            className="col-span-5 space-y-4 md:space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="flex-1 space-y-[10px]">
                <Label htmlFor="username">Username*</Label>
                <Input
                  name="username"
                  placeholder={"Username"}
                  control={control}
                  className="border-strock"
                />
              </div>
              <div className="flex-1 space-y-[10px]">
                <Label htmlFor="email">Email*</Label>
                <Input
                  name="email"
                  placeholder={"example@gmail.com"}
                  control={control}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="col-span-1 space-y-[10px]">
                <Label htmlFor="phone">Phone*</Label>
                <Input
                  name="phone"
                  placeholder={"0123456789"}
                  control={control}
                />
              </div>
              <div className="col-span-1 space-y-[10px]">
                <Label htmlFor="introduceCode">Introduce Code</Label>
                <Input
                  name="introduceCode"
                  placeholder={""}
                  control={control}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="col-span-1 space-y-[10px]">
                <Label>Select country*</Label>
                <DropdownWithComponents>
                  <DropdownWithComponents.Select
                    placeholder={
                      country ? (
                        <span className="text-black">
                          {countries.find((i) => i.key === country)?.title}
                        </span>
                      ) : (
                        <span className="text-text4">Select one</span>
                      )
                    }
                  ></DropdownWithComponents.Select>
                  <DropdownWithComponents.List>
                    {countries.length > 0 &&
                      countries.map((country) => (
                        <DropdownWithComponents.Option
                          key={uuidv4()}
                          onClick={() => setValue("country", country.key)}
                        >
                          <span className="capitalize">{country.title}</span>
                        </DropdownWithComponents.Option>
                      ))}
                  </DropdownWithComponents.List>
                </DropdownWithComponents>
                {errors.country?.message ? (
                  <p className="text-sm font-medium text-error">
                    {errors.country.message}
                  </p>
                ) : null}
              </div>
              <div className="col-span-1 space-y-[10px]">
                <Label>Purpose using VPN*</Label>
                <DropdownWithComponents>
                  <DropdownWithComponents.Select
                    placeholder={
                      purpose ? (
                        <span className="text-black">
                          {purposes.find((i) => i.id === purpose)?.title}
                        </span>
                      ) : (
                        <span className="text-text4">Select one</span>
                      )
                    }
                  ></DropdownWithComponents.Select>
                  <DropdownWithComponents.List>
                    {purposes.length > 0 &&
                      purposes.map((item) => (
                        <DropdownWithComponents.Option
                          key={uuidv4()}
                          onClick={() => setValue("purpose", item.id)}
                        >
                          <span className="capitalize">{item.title}</span>
                        </DropdownWithComponents.Option>
                      ))}
                  </DropdownWithComponents.List>
                </DropdownWithComponents>
                {errors.purpose?.message ? (
                  <p className="text-sm font-medium text-error">
                    {errors.purpose.message}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div className="col-span-1 space-y-[10px]">
                <Label htmlFor="password">Password*</Label>
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
              </div>
              <div className="col-span-1 space-y-[10px]">
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
              </div>
            </div>
            <Button type="submit" className="w-full text-white bg-primary">
              Create my account
            </Button>
          </form>
        )}
      </div>
    </Container>
  );
};

export default RegisterBox;
