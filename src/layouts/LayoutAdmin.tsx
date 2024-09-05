import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/logo/Logo";
import classNames from "../utils/classNames";
import IconProfile from "../icons/IconProfile";
import IconLogout from "../icons/IconLogout";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/auth/authSlice";
import { setCollab } from "../store/collab/collabSlice";
import { CollabType } from "../type";
import { api } from "../api";
import { useEffect, useMemo, useRef, useState } from "react";
import { RootState } from "../store/configureStore";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { SelectLanguage } from "../components/header/Header";
import { Modal } from "antd";
import { Input } from "../components/input";
import { Label } from "../components/label";
import FormGroup from "../components/common/FormGroup";
import IconEyeToogle from "../icons/IconEyeToogle";
import { toast } from "react-toastify";
import axios from "axios";
import { useToogleValue } from "../hooks/useToogleValue";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Button from "../components/button/Button";
import * as yup from "yup";
import SelectCurrency from "../components/common/SelectCurrency";

const menu = [
  { to: "/admin/dashboard", title: "Dashboard", rolePage: [1, 3] },
  { to: "/admin/pack", title: "QL gói cước", rolePage: [1, 3] },
  // { to: "/admin/extend-plan", title: "Gói cước mở rộng" },
  { to: "/admin/account", title: "Người dùng", rolePage: [1, 3] },
  { to: "/admin/server", title: "Quản lý máy chủ", rolePage: [1, 3] },
  { to: "/admin/list-key", title: "Quản lý key", rolePage: [1, 3] },
  { to: "/admin/cloud", title: "Quản lý Cloud", rolePage: [1] },
  { to: "/admin/cash", title: "Yêu cầu nạp", rolePage: [1, 3] },
  { to: "/admin/commision", title: "QL CTV-Đại lý", rolePage: [1] },
  // { to: "/admin/post", title: "Bài viết" },
];

const LayoutAdmin = () => {
  const { email, _id, role } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsopen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsopen(false));
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<CollabType>("/collab");
        dispatch(
          setCollab({
            level1: data.level1,
            level2: data.level2,
            level3: data.level3,
            minLevel1: data.minLevel1,
            minLevel2: data.minLevel2,
            minLevel3: data.minLevel3,
          })
        );
      } catch (error) {
        console.log("error - ", error);
      }
    })();
  }, [dispatch]);
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
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  if (role)
    return (
      <>
        <div className="grid grid-cols-12 w-full h-screen bg-[#191918]">
          <div
            ref={ref}
            // className={
            //   "relative col-span-2 h-full overflow-hidden bg-[url('https://imas.unsplash.com/photo-1545987796-200677ee1011?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center bg-cover"
            // }
            className={classNames(
              "transition-all duration-300 fixed top-0 bottom-0 w-4/6 md:w-1/3 z-20 xl:left-0 xl:right-0 xl:w-full xl:block xl:relative col-span-2 h-full overflow-hidden bg-center bg-cover",
              isOpen ? "left-0" : "-left-full"
            )}
          >
            <div className="absolute inset-0 bg-black xl:bg-opacity-50" />
            <div className="absolute w-full z-5 h-full py-10 px-5 ">
              <div className="flex justify-center">
                <Logo className="text-4xl text-white" />
              </div>
              <div className="flex flex-col gap-2 pt-10">
                {menu.map((item) => {
                  if (item.rolePage.includes(role))
                    return (
                      <div className="w-full" onClick={() => setIsopen(false)}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            classNames(
                              "hover:bg-[#403f3f] px-4 py-3 rounded-lg transition-all duration-200 block",
                              isActive
                                ? "text-white font-medium bg-[#403f3f]"
                                : "text-icon-color"
                            )
                          }
                          key={uuidv4()}
                        >
                          {item.title}
                        </NavLink>
                      </div>
                    );
                  return;
                })}
                <div
                  onClick={() => {
                    dispatch(setAuth({}));
                    navigation("/");
                  }}
                  className={classNames(
                    "hover:bg-[#403f3f] px-4 py-3 rounded-lg transition-all duration-200 text-icon-color block md:hidden"
                  )}
                >
                  Đăng xuất
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-10 h-full overflow-y-scroll py-10 px-5 lg:px-10 bg-white xl:rounded-3xl">
            <div className="flex items-center justify-between">
              <div
                className="block mr-6 xl:hidden"
                onClick={() => setIsopen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12H12m-8.25 5.25h16.5"
                  />
                </svg>
              </div>
              <div className="flex ml-auto items-center gap-5">
                <div
                  className="flex gap-1 items-center text-white bg-primary px-4 py-2 rounded-xl cursor-pointer"
                  onClick={showModal}
                >
                  <span>
                    <IconProfile />
                  </span>
                  <p>{email}</p>
                </div>
                <div
                  className="gap-2 items-center text-white bg-primary px-4 py-2 rounded-xl cursor-pointer hidden md:flex"
                  onClick={() => {
                    dispatch(setAuth({}));
                    navigation("/sign-in");
                  }}
                >
                  <span className="-translate-y-[2px]">
                    <IconLogout />
                  </span>
                  <p>Đăng xuất</p>
                </div>
                <SelectLanguage />
                <SelectCurrency />
              </div>
            </div>
            <div className="py-14">
              <Outlet></Outlet>
            </div>
          </div>
        </div>
        <Modal
          title="Đổi mật khẩu"
          open={isModalOpen}
          onCancel={() => {
            handleCancel();
          }}
          footer={[]}
        >
          <form
            className="space-y-[15px] md:space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormGroup>
              <Label htmlFor="oldPassword">
                {t("form.old_password.label")}
              </Label>
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
              <Label htmlFor="newPassword">
                {t("form.new_password.label")}
              </Label>
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
        </Modal>
      </>
    );
  return;
};

export default LayoutAdmin;
