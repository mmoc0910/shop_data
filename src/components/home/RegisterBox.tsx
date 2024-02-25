import Container from "../common/Container";
import FormGroup from "../common/FormGroup";
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
import { AuthState, setAuth } from "../../store/auth/authSlice";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

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
    phone: yup.string(),
    name: yup.string(),
    // country: yup.string().required(),
  })
  .required();

const RegisterBox = () => {
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const { value: tooglePassword, handleToogleValue: handleTooglePassword } =
    useToogleValue();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: {
    email: string;
    password: string;
    phone?: string;
    name?: string;
  }) => {
    try {
      const { email, password } = data;
      console.log("data sign in - ", data);
      const result = await api.post<{ data: AuthState }>("/users", {
        email,
        password,
      });
      console.log("result - ", result.data);
      dispatch(setAuth(result.data.data));
      navigation("/#home");
    } catch (error) {
      console.log(error);
      toast.error(error?.response.data.message);
    }
  };
  return (
    <Container className="py-20 space-y-10 w-[1000px] relative z-10">
      <p className="font-medium text-4xl">Register</p>
      <div className="grid grid-cols-10 gap-5">
        <div className="col-span-5 space-y-5">
          <p className="w-3/4">
            Please fill the form right here to register or contact us via bellow
            information:
          </p>
          <div className="">
            <div className="mb-3 space-y-1 pl-8 relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-full after:left-0 after:top-[8px] before:absolute before:h-[calc(100%+0.75rem)] before:w-[1px] before:bg-primary before:left-[6px] before:top-[8px]">
              <p className="font-medium text-primary text-2xl tracking-wider">
                Phone Number
              </p>
              <div className="">
                <a href="tel:+186 8415 2243" className="block">
                  +186 8415 2243
                </a>
                <a href="tel:+84 909 084 883" className="block">
                  +84 909 084 883
                </a>
              </div>
            </div>
            <div className="mb-3 space-y-1 pl-8 relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-full after:left-0 after:top-[8px] before:absolute before:h-[calc(100%+0.75rem)] before:w-[1px] before:bg-primary before:left-[6px] before:top-[8px]">
              <p className="font-medium text-primary text-2xl tracking-wider">
                E-mail Address
              </p>
              <div className="">
                <a href="mailto:vpncn2@startcorp.vn">vpncn2@startcorp.vn</a>
              </div>
            </div>
            <div className="mb-3 space-y-1 pl-8 relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-full after:left-0 after:top-[8px] before:absolute before:h-[calc(100%+0.75rem)] before:w-[1px] before:bg-primary before:left-[6px] before:top-[8px]">
              <p className="font-medium text-primary text-2xl tracking-wider">
                Official Website
              </p>
              <div className="">
                <p>www.vpncn2.online</p>
              </div>
            </div>
            <div className="mb-3 space-y-1 pl-8 relative after:absolute after:w-3 after:h-3 after:bg-primary after:rounded-full after:left-0 after:top-[8px]">
              <p className="font-medium text-primary text-2xl tracking-wider">
                Fanpage
              </p>
              <div className="">
                <div className="flex mt-7 gap-7">
                  <Link to={""} className="flex flex-col items-center gap-5">
                    <svg
                      className="w-16 h-16"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z" />
                    </svg>
                    <p className="font-medium">Facebook</p>
                  </Link>
                  <Link to={""} className="flex flex-col items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-16 h-16"
                    >
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                    <p className="font-medium">Instagram</p>
                  </Link>
                  <Link to={""} className="flex flex-col items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-16 h-16"
                    >
                      <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                    </svg>
                    <p className="font-medium">Tiktok</p>
                  </Link>
                  <Link to={""} className="flex flex-col items-center gap-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-16 h-16"
                    >
                      <path d="M448 209.9a210.1 210.1 0 0 1 -122.8-39.3V349.4A162.6 162.6 0 1 1 185 188.3V278.2a74.6 74.6 0 1 0 52.2 71.2V0l88 0a121.2 121.2 0 0 0 1.9 22.2h0A122.2 122.2 0 0 0 381 102.4a121.4 121.4 0 0 0 67 20.1z" />
                    </svg>
                    <p className="font-medium">Douyin</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          className="space-y-[15px] md:space-y-5 col-span-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <Label htmlFor="name">full name*</Label>
            <Input name="name" placeholder={"Jhon Doe"} control={control} />
          </FormGroup>
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
              />
            </Input>
          </FormGroup>
          <Button type="submit" className="w-full text-white bg-primary">
            Sign Up
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default RegisterBox;
