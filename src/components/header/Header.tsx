import Container from "../common/Container";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import IconChevronDown from "../../icons/IconChevronDown";
import { setLanguage } from "../../store/lang/languageSlice";
import chinaFlag from "../../assets/flag/china.png";
import vietnamlag from "../../assets/flag/vietnam.png";
import engFlag from "../../assets/flag/united-kingdom.png";

const Header = () => {
  const { t, i18n } = useTranslation();
  const { email, username, role } = useSelector(
    (state: RootState) => state.auth
  );
  const menu = useMemo(
    () => [
      { title: t("header.home"), to: "#home" },
      { title: t("header.pricing"), to: "#pricing" },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language]
  );
  const getURL = () => {
    if (role === 1) return "admin/dashboard";
    if (role === 2) return "/user/dashboard";
    if (role === 3) return "/admin/list-key";
    return "/";
  };
  return (
    <div
      className="z-20 shadow-sm bg-black"
      // className="fixed top-0 left-0 right-0 w-screen bg-white z-20 shadow-sm"
    >
      <Container className="py-2">
        <div className="flex items-start justify-end">
          {/* <Logo /> */}
          <div className="flex gap-3 md:gap-7 items-center mt-2">
            {menu.map((item) => (
              <a
                key={uuidv4()}
                href={item.to}
                className={classNames(
                  "font-medium text-sm xl:text-lg hidden md:block",
                  item.to === "#home" ? "text-primary" : "text-icon-color"
                )}
              >
                {item.title}
              </a>
            ))}
            <div className="font-medium text-icon-color cursor-pointer relative group">
              <div className="text-sm xl:text-lg">
                {i18n.language === "ci" ? "下载" : "Download"}
              </div>
              <div className="absolute z-50 right-0 top-[calc(100%+1rem)] invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:top-full transition-all duration-300">
                <div className="py-4 px-8 mt-3 rounded-lg shadow-xl bg-white space-y-2 flex flex-col text-black">
                  <Link
                    to={
                      "https://s3.ap-northeast-3.amazonaws.com/vpncn2.top/outlinefiles/Outline-Client-1.12.apk"
                    }
                    download
                    className="text-sm hover:text-primary transition-all duration-200"
                  >
                    Android
                  </Link>
                  <Link
                    to={
                      "https://apps.apple.com/us/app/outline-secure-internet-access/id1356178125?mt=12"
                    }
                    target="_blank"
                    className="text-sm hover:text-primary transition-all duration-200"
                  >
                    AppStore(MacOS)
                  </Link>
                  <Link
                    to={
                      "https://apps.apple.com/us/app/outline-app/id1356177741"
                    }
                    target="_blank"
                    className="text-sm hover:text-primary transition-all duration-200"
                  >
                    AppStore(iOS)
                  </Link>
                  <Link
                    to={
                      "https://s3.ap-northeast-3.amazonaws.com/vpncn2.top/outlinefiles/win-outline-client-1.12.exe"
                    }
                    download
                    className="text-sm hover:text-primary transition-all duration-200"
                  >
                    Windows
                  </Link>
                  <Link
                    to={
                      "https://s3.ap-northeast-3.amazonaws.com/vpncn2.top/outlinefiles/linux-Outline-Client_1.12.appimage"
                    }
                    download
                    className="text-sm hover:text-primary transition-all duration-200"
                  >
                    Linux
                  </Link>
                </div>
              </div>
            </div>
            {!email ? (
              <div className="flex items-center gap-5">
                <Link
                  to={"/sign-in"}
                  className="font-medium text-sm xl:text-base text-primary underline decoration-primary"
                >
                  {t("authen.sign_in")}
                </Link>
              </div>
            ) : (
              <Link to={getURL()} className="flex gap-3 items-center">
                <div className="text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 md:w-10 md:h-10"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="hidden md:block">
                  {/* <p>Xin chào</p> */}
                  <p className="font-medium text-primary">
                    {username || email}
                  </p>
                </div>
              </Link>
            )}
            <SelectLanguage />
          </div>
        </div>
      </Container>
    </div>
  );
};

const languages = [
  { key: "en", title: "English" },
  { key: "ci", title: "中文" },
  { key: "vi", title: "Vietnamese" },
];

export const SelectLanguage = () => {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.lang);

  return (
    <div className="font-medium text-icon-color cursor-pointer relative group">
      <div className="text-xs md:text-sm flex items-center gap-1">
        {/* {languages.find((item) => item.key === language)?.title} */}
        <img
          src={
            language === "vi"
              ? vietnamlag
              : language === "ci"
              ? chinaFlag
              : engFlag
          }
          alt="country flag"
          className="w-5 md:w-7 h-auto rounded-md"
        />
        <span>
          <IconChevronDown />
        </span>
      </div>
      <div className="absolute z-50 right-0 top-[calc(100%+1rem)] invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:top-full transition-all duration-300">
        <div className="p-4 mt-3 rounded-md shadow-xl bg-white space-y-2 flex flex-col text-black">
          {languages.map((item) => (
            <div
              onClick={() => dispatch(setLanguage(item.key))}
              className={classNames(
                "text-xs md:text-sm hover:text-primary transition-all duration-200",
                item.key === language ? "text-primary" : "text-icon-color"
              )}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;
