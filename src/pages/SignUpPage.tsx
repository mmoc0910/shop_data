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
// import { countries, purposes } from "../constants";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import axios from "axios";
// import { DropdownWithComponents } from "../components/dropdown";
// import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";
import Loading from "../components/common/Loading";

const SignUpPage = () => {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const { email, role } = useSelector((state: RootState) => state.auth);
  const navigation = useNavigate();
  const { value: tooglePassword, handleToogleValue: handleTooglePassword } =
    useToogleValue();
  const { value: toogleRePassword, handleToogleValue: handleToogleRePassword } =
    useToogleValue();
  const schema = useMemo(
    () =>
      yup
        .object({
          username: yup
            .string()
            .required(t("form.username.error.required"))
            .matches(/^[a-zA-Z0-9]+$/, {
              message: "Không được để khoảng trắng",
            }),
          // .matches(/^\S+$/, { message: "Không được để khoảng trắng" }),
          // .matches(regexUserName, t("form.username.error.reg")),
          email: yup
            .string()
            .required(t("form.email.error.required"))
            .email(t("form.email.error.email")),
          password: yup
            .string()
            .required(t("form.password.error.required"))
            .min(8, t("form.old_password.error.min")),
          rePassword: yup
            .string()
            .required(t("form.re_password.error.required"))
            .min(8, t("form.old_password.error.min")),
          phone: yup.string().required(t("form.phone.error.required")),
          // country: yup.string().required(t("form.country.error.required")),
          // purpose: yup.number().required(t("form.purpose.error.required")),
          introduceCode: yup.string(),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        .required(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
  );
  const { handleSubmit, control, setError } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  useEffect(() => {
    if (email) {
      role === 1
        ? navigation("/admin/dashboard")
        : navigation("/user/dashboard");
    }
  }, [email, navigation, role]);
  const onSubmit = async (data: {
    username: string;
    email: string;
    password: string;
    phone: string;
    // country: string;
    // purpose: number;
    introduceCode?: string;
    rePassword: string;
  }) => {
    try {
      const {
        username,
        email,
        password,
        // country,
        phone,
        // purpose,
        rePassword,
        introduceCode,
      } = data;
      if (password === rePassword) {
        setLoading(true);
        if (introduceCode) {
          if (introduceCode.length === 7) {
            await api.post<{ data: AuthState }>("/users", {
              username: username.toLowerCase(),
              email,
              password,
              country: "",
              phone,
              purpose: 1,
              introduceCode,
            });
            navigation("/sign-in");
            toast.success("Đăng ký tài khoản thành công");
          } else {
            // setError("introduceCode", {
            //   message: "Mã giới thiệu phải có độ dài 7 ký tự",
            // });
            toast.warn(
              i18n.language === "vi"
                ? "Mã giới thiệu phải có độ dài 7 ký tự"
                : i18n.language === "en"
                ? "Introduction code 07 charecters"
                : "Introduction code 07 charecters"
            );
          }
        } else {
          await api.post<{ data: AuthState }>("/users", {
            username: username.toLowerCase(),
            email,
            password,
            country: "",
            phone,
            purpose: 1,
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <LayoutAuthentication heading={t("authen.sign_up")}>
      {loading && <Loading />}
      <p className="mb-[25px] md:mb-[30px] text-xs font-normal text-center md:text-sm md:font-medium text-text3">
        {t("login.have_account")}{" "}
        <Link
          to={"/sign-in"}
          className="inline font-medium underline text-primary"
        >
          {t("authen.sign_in")}
        </Link>
      </p>
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="username">{t("form.username.label")}</Label>
          <Input
            name="username"
            placeholder={t("form.username.placeholder")}
            control={control}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email">{t("form.email.label")}</Label>
          <Input
            name="email"
            placeholder={"example@gmail.com"}
            control={control}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="phone">{t("form.phone.label")}</Label>
          <Input
            name="phone"
            placeholder={t("form.phone.placeholder")}
            control={control}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="introduceCode">
            {t("form.introduce_code.label")}
          </Label>
          <Input
            name="introduceCode"
            placeholder={t("form.introduce_code.placeholder")}
            control={control}
          />
        </FormGroup>
        {/* <FormGroup>
          <Label>{t("form.country.label")}</Label>
          <DropdownWithComponents>
            <DropdownWithComponents.Select
              placeholder={
                country ? (
                  <span className="text-black">
                    {countries.find((i) => i.key === country)?.title}
                  </span>
                ) : (
                  <span className="text-text4">
                    {t("form.country.placeholder")}
                  </span>
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
        </FormGroup>
        <FormGroup>
          <Label>{t("form.purpose.label")}</Label>
          <DropdownWithComponents>
            <DropdownWithComponents.Select
              placeholder={
                purpose ? (
                  <span className="text-black">
                    {purposes.find((i) => i.id === purpose)?.title}
                  </span>
                ) : (
                  <span className="text-text4">
                    {t("form.purpose.placeholder")}
                  </span>
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
        </FormGroup> */}
        <FormGroup>
          <Label htmlFor="password">{t("form.password.label")}</Label>
          <Input
            type={tooglePassword ? "text" : "password"}
            name="password"
            placeholder={t("form.password.placeholder")}
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
          <Label htmlFor="password">{t("form.re_password.label")}</Label>
          <Input
            type={toogleRePassword ? "text" : "password"}
            name="rePassword"
            placeholder={t("form.re_password.placeholder")}
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
          {t("authen.sign_up")}
        </Button>
      </form>
    </LayoutAuthentication>
  );
};

export default SignUpPage;
