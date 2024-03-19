import Logo from "../logo/Logo";
import Container from "../common/Container";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import IconChevronDown from "../../icons/IconChevronDown";

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
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-20 shadow-sm">
      <Container className="py-2">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex gap-3 md:gap-7 items-center">
            {menu.map((item) => (
              <a
                key={uuidv4()}
                href={item.to}
                className={classNames(
                  "font-medium text-sm xl:text-lg",
                  item.to === "#home" ? "text-primary" : "text-icon-color"
                )}
              >
                {item.title}
              </a>
            ))}
            <div className="font-medium text-icon-color cursor-pointer relative group">
              <div className="text-sm xl:text-lg">Download</div>
              <div className="absolute right-0 top-[calc(100%+1rem)] invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:top-full transition-all duration-300">
                <div className="py-4 px-8 mt-3 rounded-lg shadow-xl bg-white space-y-2 flex flex-col text-black">
                  <Link
                    to={
                      "https://play.google.com/store/apps/details?id=org.outline.android.client&pcampaignid=web_share"
                    }
                    target="_blank"
                    className="text-sm hover:text-primary transition-all duration-200"
                  >
                    GooglePlay(Android)
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
                    to={"http://woot2.vn/vpncn2/Win-outline-client.zip"}
                    download
                    className="text-sm hover:text-primary transition-all duration-200"
                  >
                    Windows
                  </Link>
                </div>
              </div>
            </div>
            {!email ? (
              <div className="flex items-end gap-5">
                <Link
                  to={"/sign-in"}
                  className="font-medium text-sm xl:text-base text-primary underline decoration-primary"
                >
                  {t("authen.sign_in")}
                </Link>
                <SelectLanguage />
              </div>
            ) : (
              <Link
                to={role === 2 ? "/user/dashboard" : "admin/dashboard"}
                className="flex gap-3 items-center"
              >
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
          </div>
        </div>
      </Container>
    </div>
  );
};

const languages = [
  { key: "en", title: "English" },
  { key: "ci", title: "Chinese" },
  { key: "vi", title: "Vietnamese" },
];

const SelectLanguage = () => {
  const { i18n } = useTranslation();
  const [chooseLanguage, setChooseLanguage] = useState<{
    key: string;
    title: string;
  }>({ key: "en", title: "English" });
  useEffect(() => {
    i18n.changeLanguage(chooseLanguage.key);
  }, [chooseLanguage.key, i18n]);
  return (
    <div className="font-medium text-icon-color cursor-pointer relative group">
      <div className="text-sm flex items-center gap-1">
        {chooseLanguage.title}
        <span>
          <IconChevronDown />
        </span>
      </div>
      <div className="absolute left-0 top-[calc(100%+1rem)] invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:top-full transition-all duration-300">
        <div className="p-3 mt-3 rounded-md shadow-xl bg-white space-y-2 flex flex-col text-black">
          {languages.map((item) => (
            <div
              onClick={() => setChooseLanguage(item)}
              className={classNames(
                "text-sm hover:text-primary transition-all duration-200",
                item.key === chooseLanguage.key
                  ? "text-primary"
                  : "text-icon-color"
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
