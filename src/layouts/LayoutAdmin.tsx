import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/logo/Logo";
import classNames from "../utils/classNames";
import IconProfile from "../icons/IconProfile";
import IconLogout from "../icons/IconLogout";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { setAuth } from "../store/auth/authSlice";

const menu = [
  { to: "/admin/dashboard", title: "Dashboard" },
  { to: "/admin/pack", title: "Gói cước" },
  { to: "/admin/extend-plan", title: "Gói cước mở rộng" },
  { to: "/admin/account", title: "Người dùng" },
  { to: "/admin/server", title: "Quản lý máy chủ" },
  // { to: "/admin/key", title: "Quản lý key" },
  { to: "/admin/cash", title: "Yêu cầu nạp" },
  { to: "/admin/commision", title: "Chính sách CTV & Đại lý" },
  // { to: "/admin/post", title: "Bài viết" },
];

const LayoutAdmin = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="grid grid-cols-12 w-full h-screen">
      <div
        className={
          "relative col-span-2 h-full overflow-hidden bg-[url('https://images.unsplash.com/photo-1545987796-200677ee1011?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center bg-cover"
        }
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute w-full z-5 h-full py-10 px-5 ">
          <Logo className="text-4xl text-white" />
          <div className="flex flex-col gap-5 pt-28">
            {menu.map((item) => {
              return (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      "",
                      isActive ? "text-primary font-medium" : "text-white"
                    )
                  }
                  key={uuidv4()}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
      <div className="col-span-10 h-full overflow-y-scroll py-10 px-7">
        <div className="flex justify-end gap-5">
          <Link
            to={"/user/account"}
            className="flex gap-1 items-center text-white bg-primary px-4 py-2 rounded-xl"
          >
            <span>
              <IconProfile />
            </span>
            <p>account@gmail.com</p>
          </Link>
          <div
            className="flex gap-2 items-center text-white bg-primary px-4 py-2 rounded-xl cursor-pointer"
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
        </div>
        <div className="py-14">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default LayoutAdmin;
