import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/logo/Logo";
import classNames from "../utils/classNames";
import IconProfile from "../icons/IconProfile";
import IconLogout from "../icons/IconLogout";
import { v4 as uuidv4 } from "uuid";
// import IconChevronDown from "../icons/IconChevronDown";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { setAuth } from "../store/auth/authSlice";
import { useEffect } from "react";
import { api } from "../api";
import { SatisfyType } from "../type";
import { setSatify } from "../store/satisfy/satisfySlice";
import { setCommision } from "../store/commision/commisionSlice";
import { Tooltip } from "antd";
import { copyToClipboard } from "../utils/copyToClipboard";

const menu = [
  { to: "/user/dashboard", title: "Dashboard" },
  { to: "/user/plan", title: "Mua gói cước" },
  { to: "/user/order", title: "Đơn hàng của tôi" },
  { to: "/user/transaction", title: "Lịch sử giao dịch" },
  { to: "/user/invite", title: "Cộng tác viên" },
  { to: "/user/account", title: "Thông tin người dùng" },
];
// const menu = [
//   { to: "/user/dashboard", title: "Dashboard" },
//   {
//     to: "",
//     title: "Người dùng",
//     children: [{ to: "/user/account", title: "Thông tin người dùng" }],
//   },
//   {
//     to: "",
//     title: "Mua hàng",
//     children: [
//       { to: "/user/plan", title: "Mua gói cước" },
//       { to: "/user/order", title: "Đơn hàng của tôi" },
//       { to: "/user/transaction", title: "Lịch sử giao dịch" },
//       { to: "/user/invite", title: "Cộng tác viên" },
//     ],
//   },
// ];

const LayoutUser = () => {
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { email, _id } = useSelector((state: RootState) => state.auth);
  const commision = useSelector((state: RootState) => state.commision);
  const { cash } = useSelector((state: RootState) => state.satisfy);
  useEffect(() => {
    (async () => {
      try {
        const [{ data: dataSatify }, { data: dataCommision }] =
          await Promise.all([
            api.get<SatisfyType>(`/satisfy/${_id}`),
            api.get<{ value: number }>("/commisions"),
          ]);
        // console.log("result - ", data);
        dispatch(
          setSatify({
            cash: dataSatify.cash[0]?.money || 0,
            rose: dataSatify.rose[0]?.money || 0,
            currentMoney: dataSatify.currentMoney,
            numberIntoduce: dataSatify.numberIntoduce,
            transaction: dataSatify.transaction[0]?.money || 0,
          })
        );
        dispatch(setCommision(dataCommision.value));
      } catch (error) {
        console.log("error - ", error);
      }
    })();
  }, [_id, dispatch]);
  return (
    <div className="grid grid-cols-12 w-full h-screen bg-[#191918]">
      <div
        className={
          "relative col-span-2 h-full overflow-hidden bg-[url('https://image.unsplash.com/photo-1545987796-200677ee1011?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-center bg-cover"
        }
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute w-full z-5 h-full py-10 px-5 ">
          <Logo className="text-4xl text-white" />
          <div className="flex flex-col gap-2 pt-28">
            {menu.map((item) => {
              return (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    classNames(
                      "hover:bg-[#403f3f] px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "text-white font-medium bg-[#403f3f]"
                        : "text-icon-color"
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
      <div className="col-span-10 h-full overflow-y-scroll py-10 px-10 bg-white rounded-3xl">
        <div className="flex items-center justify-between">
          {cash >= 50000 && (
            <div className="flex items-center gap-2">
              <Tooltip
                title={`Giới thiệu mã CTV này cho bạn bè bạn sẽ nhận được [${commision}%] hoa hồng cho mỗi giao dịch.`}
              >
                <p className="text-sm">
                  <span className="font-medium">Mã CTV:</span> {_id}
                </p>
              </Tooltip>

              <Tooltip title="copy">
                <button
                  className="-translate-y-[2px]"
                  onClick={() => _id && copyToClipboard(_id)}
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
          <div className="flex gap-5 items-center ml-auto">
            <Link
              to={"/user/account"}
              className="flex gap-1 items-center text-white bg-primary px-4 py-2 rounded-xl"
            >
              <span>
                <IconProfile />
              </span>
              <p>{email}</p>
            </Link>
            <div
              className="flex gap-2 items-center text-white bg-primary px-4 py-2 rounded-xl cursor-pointer"
              onClick={() => {
                dispatch(setAuth({}));
                navigation("/");
              }}
            >
              <span className="-translate-y-[2px]">
                <IconLogout />
              </span>
              <p>Đăng xuất</p>
            </div>
          </div>
        </div>
        <div className="py-14">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};
{
  /* {menu.map((item) => {
              if (item.children) {
                return (
                  <div className="space-y-3" key={uuidv4()}>
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
                              "pl-5",
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
            })} */
}
export default LayoutUser;
