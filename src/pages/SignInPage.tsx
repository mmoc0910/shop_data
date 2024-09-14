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
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";
import Loading from "../components/common/Loading";
import { setLanguage } from "../store/lang/languageSlice";
import { setCurrency } from "../store/currency/currencySlice";
// import { regexUserName } from "../constants";

const SignInPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { t, i18n } = useTranslation();
  const schema = useMemo(
    () =>
      yup
        .object({
          account: yup.string().required(t("form.account.error.required")),
          // .matches(regexUserName, t("form.username.error.reg")),
          password: yup
            .string()
            .required(t("form.password.error.required"))
            .min(8, t("form.old_password.error.min")),
          // .min(8, "Minimum of 8 characters"),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
        .required(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n.language, t]
  );
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
      const { account, password } = data;
      setLoading(true);
      const result = await api.post<{ data: AuthState }>("/users/login", {
        account: account.toLowerCase(),
        password,
      });
      dispatch(setAuth(result.data.data));
      dispatch(setLanguage("en"));
      dispatch(setCurrency("en"));
      if (result.data.data.role === 1) {
        navigation("/admin/dashboard");
      } else if (result.data.data.role === 2) {
        navigation("/user/dashboard");
      } else if (result.data.data.role === 3) {
        navigation("/admin/list-key");
      }
      toast.success("Login Success");
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
    <LayoutAuthentication heading={t("login.welcome_back")}>
      {loading && <Loading />}
      <p className="mb-[25px] md:mb-[30px] text-xs font-normal text-center md:text-sm md:font-medium text-text3">
        {t("login.dont_have_account")}{" "}
        <Link
          to={"/sign-up"}
          className="inline font-medium underline text-primary"
        >
          {t("authen.sign_up")}
        </Link>
      </p>
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="account">{t("form.account.label")}</Label>
          <Input
            name="account"
            placeholder={t("form.account.placeholder")}
            control={control}
          />
        </FormGroup>
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
        <div className="flex justify-end">
          <Link
            to={"/forgot-password"}
            className="text-sm font-medium cursor-pointer select-none text-primary"
          >
            {t("login.forgot_pass")}
          </Link>
        </div>
        <Button type="submit" className="w-full text-white bg-primary">
          {t("authen.sign_in")}
        </Button>
      </form>
    </LayoutAuthentication>
  );
};

export default SignInPage;
