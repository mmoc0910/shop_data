import IconEyeToogle from "../icons/IconEyeToogle";
import { Link } from "react-router-dom";
import LayoutAuthentication from "../layouts/LayoutAuthentication";
import { useToogleValue } from "../hooks/useToogleValue";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../components/button/Button";
import FormGroup from "../components/common/FormGroup";
import { Label } from "../components/label";
import { Input } from "../components/input";

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
  })
  .required();

const SignInPage = () => {
  const { value: tooglePassword, handleToogleValue: handleTooglePassword } =
    useToogleValue();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = (data: unknown) => {
    try {
      console.log("data sign in - ", data);
    } catch (error) {
      console.log(error);
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
      {/* <ButtonGoogle text="Sign in with google"></ButtonGoogle> */}
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="email">email*</Label>
          <Input
            name="email"
            placeholder={"example@gmail.com"}
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
          <p className="text-sm font-medium cursor-pointer select-none text-primary">
            Forgot password
          </p>
        </div>
        <Button type="submit" className="w-full text-white bg-primary">
          Sign in
        </Button>
      </form>
    </LayoutAuthentication>
  );
};

export default SignInPage;
