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
import { useEffect, useRef, useState } from "react";
import { RootState } from "../store/configureStore";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { SelectLanguage } from "../components/header/Header";

const menu = [
  { to: "/admin/dashboard", title: "Dashboard" },
  { to: "/admin/pack", title: "Gói cước" },
  { to: "/admin/extend-plan", title: "Gói cước mở rộng" },
  { to: "/admin/account", title: "Người dùng" },
  { to: "/admin/server", title: "Quản lý máy chủ" },
  // { to: "/admin/key", title: "Quản lý key" },
  { to: "/admin/cash", title: "Yêu cầu nạp" },
  { to: "/admin/commision", title: "Chính sách CTV-Đại lý" },
  // { to: "/admin/post", title: "Bài viết" },
];

const LayoutAdmin = () => {
  const { email } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsopen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsopen(false));
  const navigation = useNavigate();
  const dispatch = useDispatch();
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
  return (
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
          <div className="block mr-6 xl:hidden" onClick={() => setIsopen(true)}>
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
          <div className="flex ml-auto gap-5">
            <div className="flex gap-1 items-center text-white bg-primary px-4 py-2 rounded-xl">
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
          </div>
        </div>
        <div className="py-14">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
