import Heading from "../../components/common/Heading";
import { useToogleValue } from "../../hooks/useToogleValue";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import IconEyeToogle from "../../icons/IconEyeToogle";
import Button from "../../components/button/Button";
import { RootState } from "../../store/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { countries } from "../../constants";
import { useEffect, useMemo, useState } from "react";
import { AuthState, setAuth } from "../../store/auth/authSlice";
import { api } from "../../api";
import { toast } from "react-toastify";
import axios from "axios";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import IconQuesionMarkCircle from "../../icons/IconQuesionMarkCircle";
import { DropdownWithComponents } from "../../components/dropdown";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AccountPage = () => {
  const { t, i18n } = useTranslation();
  const schema = useMemo(
    () =>
      yup
        .object({
          oldPassword: yup
            .string()
            .required(t("form.old_password.error.required"))
            .min(8, t("form.old_password.error.min")),
          newPassword: yup
            .string()
            .required(t("form.new_password.error.required"))
            .min(8, t("form.old_password.error.min")),
          reNewPassword: yup
            .string()
            .required(t("form.re_new_password.error.required"))
            .min(8, t("form.old_password.error.min")),
        })
        .required(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
  );
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const commision = useSelector((state: RootState) => state.commision);
  const collab = useSelector((state: RootState) => state.collab);
  const { cash } = useSelector((state: RootState) => state.satisfy);
  const { _id, email, level, introduceCode, username } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    value: toogleOldPassword,
    handleToogleValue: handleToogleOldPassword,
  } = useToogleValue();
  const {
    value: toogleNewPassword,
    handleToogleValue: handleToogleNewPassword,
  } = useToogleValue();
  const {
    value: toogleReNewPassword,
    handleToogleValue: handleToogleReNewPassword,
  } = useToogleValue();
  const { handleSubmit, control, setError } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: {
    oldPassword: string;
    newPassword: string;
    reNewPassword: string;
  }) => {
    const { newPassword, oldPassword, reNewPassword } = data;
    try {
      if (newPassword === reNewPassword) {
        await api.patch(`/users/change-password/${_id}`, {
          oldPassword,
          newPassword,
        });
        dispatch(setAuth({}));
        navigation("/sign-in");
        toast.success(t("page.account.change_pass.success"));
      } else {
        setError("reNewPassword", {
          message: t("form.old_password.error.match"),
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

  const tooltip = t("page.account.info.tooltip", {
    commision: commision,
    level1: collab.level1,
    level2: collab.level2,
    level3: collab.level3,
  });
  return (
    <div className="gap-16 grid grid-cols-5 md:grid-cols-10">
      <div className="space-y-4 col-span-5">
        <Heading>{t("page.account.info.heading")}</Heading>
        <div className="space-y-4">
          {cash >= 50000 && (
            <div className="flex items-center gap-2">
              <Tooltip
                title={`Giới thiệu mã CTV này cho bạn bè bạn sẽ nhận được [${commision}%] hoa hồng cho mỗi giao dịch.`}
              >
                <p className="">
                  <span className="font-medium">
                    {t("page.account.info.field.code")}
                  </span>{" "}
                  <span className="text-[#3d6dae] font-semibold">
                    {introduceCode || ""}
                  </span>
                </p>
              </Tooltip>
              <Tooltip title="copy">
                <button
                  className="-translate-y-[2px] text-[#3d6dae]"
                  onClick={() =>
                    introduceCode && copyToClipboard(introduceCode)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                  </svg>
                </button>
              </Tooltip>
            </div>
          )}

          <p className="">
            <span className="font-medium">
              {t("page.account.info.field.email")}
            </span>{" "}
            <span className="text-[#3d6dae] font-semibold">{email}</span>
          </p>
          <p className="">
            <span className="font-medium">
              {t("page.account.info.field.username")}
            </span>{" "}
            <span className="text-[#3d6dae] font-semibold">{username}</span>
          </p>
          <div className="">
            <div className="flex items-center gap-2">
              <p className="">
                <span className="font-medium">
                  {t("page.account.info.field.level")}
                </span>{" "}
                <span className="text-[#3d6dae] font-semibold">
                  {level === 0
                    ? t("page.account.info.level")
                    : t("page.account.info.leveln", { level: level })}
                </span>
              </p>
              <Tooltip title={tooltip}>
                <span className="cursor-pointer text-[#3d6dae]">
                  <IconQuesionMarkCircle />
                </span>
              </Tooltip>
            </div>
            <p className="text-secondary20">
              {t("page.account.info.field.note")}
            </p>
          </div>
        </div>
        <ChangeProfile />
      </div>
      <div className="space-y-4 col-span-5">
        <Heading>{t("page.account.change_pass.heading")}</Heading>
        <form
          className="space-y-[15px] md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <Label htmlFor="oldPassword">{t("form.old_password.label")}</Label>
            <Input
              type={toogleOldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder={t("form.old_password.placeholder")}
              control={control}
            >
              <IconEyeToogle
                className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
                open={toogleOldPassword}
                onClick={handleToogleOldPassword}
              ></IconEyeToogle>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="newPassword">{t("form.new_password.label")}</Label>
            <Input
              type={toogleNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder={t("form.new_password.placeholder")}
              control={control}
            >
              <IconEyeToogle
                className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
                open={toogleNewPassword}
                onClick={handleToogleNewPassword}
              ></IconEyeToogle>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="reNewPassword">
              {t("form.re_new_password.label")}
            </Label>
            <Input
              type={toogleReNewPassword ? "text" : "password"}
              name="reNewPassword"
              placeholder={t("form.re_new_password.placeholder")}
              control={control}
            >
              <IconEyeToogle
                className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
                open={toogleReNewPassword}
                onClick={handleToogleReNewPassword}
              ></IconEyeToogle>
            </Input>
          </FormGroup>
          <Button type="submit" className="w-full text-white bg-primary">
            {t("page.account.applyBtn")}
          </Button>
        </form>
      </div>
    </div>
  );
};

const ChangeProfile = () => {
  const { t, i18n } = useTranslation();
  const schemaProfile = useMemo(
    () =>
      yup
        .object({
          phone: yup.string().required(t("form.phone.error.required")),
          country: yup.string().required(t("form.country.error.required")),
        })
        .required(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
  );
  const { _id } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<AuthState>();
  const dispatch = useDispatch();
  const { handleSubmit, control, setValue, watch } = useForm({
    resolver: yupResolver(schemaProfile),
    mode: "onSubmit",
  });
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);
  const fetchData = async () => {
    try {
      const resultUser = await api.get<AuthState>(`/users/${_id}`);
      setUser(resultUser.data);
    } catch (error) {
      console.log("error - ", error);
      // toast.error(messages.error);
    }
  };
  useEffect(() => {
    if (user) {
      user.country && setValue("country", user.country);
      user.phone && setValue("phone", user.phone);
      // user.username && setValue("username", user.username);
    }
  }, [user, setValue]);
  const onSubmit = async (data: {
    phone: string;
    country: string;
    // username: string;
  }) => {
    try {
      await api.patch(`/users/${_id}`, { ...data });
      const resultUser = await api.get<AuthState>(`/users/${_id}`);
      dispatch(setAuth(resultUser.data));
      toast.success(t("page.account.info.success"));
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
  const country = watch("country");
  return (
    <RequireAuthPage rolePage={[2]}>
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="email">{t("form.phone.label")}</Label>
          <Input name="phone" placeholder={""} control={control} />
        </FormGroup>
        <FormGroup>
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
        </FormGroup>
        <Button type="submit" className="w-full text-white bg-primary">
          {t("page.account.applyBtn")}
        </Button>
      </form>
    </RequireAuthPage>
  );
};

export default AccountPage;
