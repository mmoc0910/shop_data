import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import Logo from "../components/logo/Logo";
import classNames from "../utils/classNames";
import IconProfile from "../icons/IconProfile";
import IconLogout from "../icons/IconLogout";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import { setAuth } from "../store/auth/authSlice";
import { useMemo, useRef, useState } from "react";
import { Tooltip } from "antd";
import { copyToClipboard } from "../utils/copyToClipboard";
import useOnClickOutside from "../hooks/useOnClickOutside";
import { useTranslation } from "react-i18next";
import { SelectLanguage } from "../components/header/Header";
import { setCurrency } from "../store/currency/currencySlice";
import { useFormatPrice } from "../hooks/useFormatPrice";
import { setLanguage } from "../store/lang/languageSlice";
import SelectCurrency from "../components/common/SelectCurrency";

const LayoutUser = () => {
  const priceFomat = useFormatPrice();
  const { t, i18n } = useTranslation();
  const menu = useMemo(
    () => [
      { to: "/user/dashboard", title: t("menu_user.dashboard") },
      // { to: "/user/recharge", title: t("menu_user.recharge") },
      { to: "/user/plan", title: t("menu_user.pack_of_data") },
      { to: "/user/order", title: t("menu_user.my_order") },
      { to: "/user/transaction", title: t("menu_user.transaction_history") },
      { to: "user/cash", title: t("menu_user.deposit_history") },
      { to: "/user/invite", title: t("menu_user.collaborators") },
      { to: "/user/account", title: t("menu_user.user_information") },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
  );
  const [isOpen, setIsopen] = useState<boolean>(false);
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsopen(false));
  const { email, introduceCode, username } = useSelector(
    (state: RootState) => state.auth
  );
  const commision = useSelector((state: RootState) => state.commision);
  const { currentMoney, cash } = useSelector(
    (state: RootState) => state.satisfy
  );

  return (
    <div className="grid grid-cols-12 w-full h-screen bg-[#191918]">
      <div
        ref={ref}
        className={classNames(
          "transition-all duration-300 fixed top-0 bottom-0 w-4/6 md:w-1/3 z-20 xl:left-0 xl:right-0 xl:w-full xl:block xl:relative col-span-2 h-full overflow-hidden bg-center bg-cover",
          isOpen ? "left-0" : "-left-full"
        )}
      >
        <div className="absolute inset-0 bg-black xl:bg-opacity-50" />
        <div className="absolute w-full h-full px-5 py-10 z-5 ">
          <div className="flex justify-center">
            <Logo className="text-4xl text-white" />
          </div>
          <div className="flex flex-col gap-2 pt-10">
            {menu.map((item) => {
              return (
                <div onClick={() => setIsopen(false)}>
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
              className={classNames(
                "hover:bg-[#403f3f] px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer",
                "text-white font-medium bg-[#403f3f]"
              )}
              onClick={() => {
                dispatch(setAuth({}));
                dispatch(setLanguage("en"));
                dispatch(setCurrency("en"));
                navigation("/");
              }}
            >
              <span className="-translate-y-[2px]">
                <IconLogout />
              </span>
              <p> {t("authen.sign_out")}</p>
            </div>
            {/* <div
              onClick={() => {
                dispatch(setAuth({}));
                navigation("/");
              }}
              className={classNames(
                "hover:bg-[#403f3f] px-4 py-3 rounded-lg transition-all duration-200 text-icon-color block xl:hidden"
              )}
            >
              {t("authen.sign_out")}
            </div> */}
          </div>
        </div>
      </div>
      <div className="h-full col-span-12 px-5 py-10 overflow-y-scroll bg-white xl:col-span-10 lg:px-10 xl:rounded-3xl">
        <div className="flex items-start justify-between">
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
          <div className="space-y-2">
            <Link
              to={"/user/account"}
              className="items-center md:hidden gap-1 px-4 py-2 text-white flex bg-primary rounded-xl shrink-0 w-fit"
            >
              <span>
                <IconProfile />
              </span>
              <p>{username || email}</p>
              <p className=""> - {priceFomat(currentMoney)}</p>
            </Link>
            {cash >= commision.min && (
              <div className="hidden md:block w-full flex-1 space-y-2 mr-5">
                <div className="flex items-center gap-2">
                  <p className="">
                    <span className="font-medium">
                      {t("page.dashboard.ctvcode.ctv")}
                    </span>{" "}
                    <span className="text-sm md:text-lg font-medium text-secondary20">
                      {introduceCode || ""}
                    </span>
                  </p>
                  <Tooltip title="copy">
                    <button
                      className="-translate-y-[2px]"
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
                {/* <p className="opacity-0">
                  {t("page.dashboard.ctvcode.desc", {
                    amount: commision.value,
                  })}
                </p> */}
              </div>
            )}
          </div>

          <div className="flex items-center gap-5 pl-auto flex-1 justify-end">
            <Link
              to={"/user/account"}
              className="items-center hidden gap-1 px-4 py-2 text-white md:flex bg-primary rounded-xl ml-5 shrink-0"
            >
              <span>
                <IconProfile />
              </span>
              <p>{username || email}</p>
              <p className="hidden xl:block"> - {priceFomat(currentMoney)}</p>
            </Link>
            <SelectLanguage />
            <SelectCurrency />
          </div>
        </div>
        {cash >= commision.min && (
          <div className="block md:hidden mt-5 rounded-xl border-2 border-[#eeeeed] p-5 w-full md:w-5/6 lg:w-[80%] space-y-2 mr-5">
            <div className="flex items-center gap-2">
              <p className="">
                <span className="font-medium">
                  {t("page.dashboard.ctvcode.ctv")}
                </span>{" "}
                <span className="text-sm md:text-lg font-medium text-secondary20">
                  {introduceCode || ""}
                </span>
              </p>
              <Tooltip title="copy">
                <button
                  className="-translate-y-[2px]"
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
            <p className="">
              {t("page.dashboard.ctvcode.desc", {
                amount: commision.value,
              })}
            </p>
          </div>
        )}
        <div className="pt-5 pb-14">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
};

export default LayoutUser;
