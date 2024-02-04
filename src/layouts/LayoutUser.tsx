import { Link, NavLink, Outlet } from "react-router-dom";
import Logo from "../components/logo/Logo";
import classNames from "../utils/classNames";
import IconProfile from "../icons/IconProfile";
import IconLogout from "../icons/IconLogout";
import { v4 as uuidv4 } from "uuid";
import IconChevronDown from "../icons/IconChevronDown";

const menu = [
  { to: "/user/dashboard", title: "Dashboard" },
  {
    to: "",
    title: "Người dùng",
    children: [{ to: "/user/account", title: "Thông tin người dùng" }],
  },
  {
    to: "",
    title: "Mua hàng",
    children: [
      { to: "/plan", title: "Mua gói cước" },
      { to: "/order", title: "Đơn hàng của tôi" },
      { to: "/invite", title: "Cộng tác viên" },
    ],
  },
];

const LayoutUser = () => {
  return (
    <div className="grid grid-cols-12 w-full h-screen">
      <div
        className={
          "relative col-span-2 h-full overflow-hidden bg-[url('https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=1896&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center bg-cover"
        }
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute w-full z-5 h-full py-10 px-5 ">
          <Logo className="text-4xl text-white" />
          <div className="flex flex-col gap-7 pt-28">
            {menu.map((item) => {
              if (item.children) {
                return (
                  <div className="space-y-3">
                    <p className="text-gray-100 font-medium flex items-center justify-between">
                      {item.title}{" "}
                      <span>
                        <IconChevronDown />
                      </span>
                    </p>
                    <div className="flex flex-col gap-3">
                      {item.children.map((i) => (
                        <NavLink
                          to={i.to}
                          className={({ isActive }) =>
                            classNames(
                              "",
                              isActive
                                ? "text-primary font-medium"
                                : "text-white"
                            )
                          }
                          key={uuidv4()}
                        >
                          {i.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                );
              }
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
          <div className="flex gap-2 items-center text-white bg-primary px-4 py-2 rounded-xl">
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

export default LayoutUser;
