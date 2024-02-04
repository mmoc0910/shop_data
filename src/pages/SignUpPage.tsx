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
import { Checkbox } from "../components/checkbox";

const countries = [
  { key: "en", title: "English" },
  { key: "vi", title: "VietNam" },
  { key: "ci", title: "Chinese" },
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
    phone: yup.string().required(),
    name: yup.string().required(),
    country: yup.string().required(),
  })
  .required();

const SignUpPage = () => {
  const { value: tooglePassword, handleToogleValue: handleTooglePassword } =
    useToogleValue();
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const country = watch("country");
  console.log("country - ", country);
  const onSubmit = (data: unknown) => {
    try {
      console.log("data sign in - ", data);
    } catch (error) {
      console.log(error);
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
          <Label htmlFor="country">Country*</Label>
          <div className="grid grid-cols-3 gap-5">
            {countries.map((item) => (
              <Checkbox
                checked={item.key === country}
                key={item.key}
                onClick={() => setValue("country", item.key)}
              >
                {item.title}
              </Checkbox>
            ))}
          </div>
          {errors.country?.message ? (
            <p className="text-sm font-medium text-error">
              {errors.country.message}
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
        {/* <div className="pr-[14px] md:pr-5">
        <Checkbox
          checked={acceptTerm}
          onClick={handleToogleTerm}
          control={control}
          name={"acceptTerm"}
        >
          <p className="flex-1 text-xs md:text-sm text-text2 dark:text-text3">
            I agree to the{" "}
            <span className="text-secondary">Tearms of Use</span> and have
            read and understand the{" "}
            <span className="text-secondary">Privacy policy</span>.
          </p>
        </Checkbox>
      </div> */}
        <Button type="submit" className="w-full text-white bg-primary">
          Create my account
        </Button>
      </form>
    </LayoutAuthentication>
  );
};

export default SignUpPage;
