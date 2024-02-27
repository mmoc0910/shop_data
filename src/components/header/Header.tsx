import Logo from "../logo/Logo";
import Container from "../common/Container";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";

const menu = [
  { title: "Trang chủ", to: "#home" },
  { title: "Bảng giá", to: "#pricing" },
];
const Header = () => {
  const { email, role } = useSelector((state: RootState) => state.auth);
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-20 shadow-sm">
      <Container className="py-3 xl:py-5">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex gap-3 md:gap-7 items-center">
            {menu.map((item) => (
              <a
                key={uuidv4()}
                href={item.to}
                className={classNames(
                  "font-medium text-sm xl:text-base",
                  item.to === "#home" ? "text-primary" : "text-icon-color"
                )}
              >
                {item.title}
              </a>
            ))}
            <div className="font-medium text-icon-color cursor-pointer relative group">
              <div className="text-sm xl:text-base">Download</div>
              <div className="absolute right-0 top-[calc(100%+1rem)] invisible opacity-0 group-hover:visible group-hover:opacity-100 group-hover:top-full transition-all duration-300">
                <div className="py-4 px-8 mt-3 rounded-lg shadow-xl bg-white space-y-2 flex flex-col text-black">
                  <Link to={"/ô"} download className="text-sm">
                    Macos
                  </Link>
                  <Link to={""} download className="text-sm">
                    Window
                  </Link>
                  <Link to={""} download className="text-sm">
                    Android
                  </Link>
                </div>
              </div>
            </div>
            {!email ? (
              <div className="flex items-stretch gap-3">
                <Link
                  to={"/sign-in"}
                  className="font-medium text-sm xl:text-base text-primary underline decoration-primary xl:pl-5"
                >
                  Đăng nhập
                </Link>
                <Link
                  to={"/sign-up"}
                  className="font-medium text-sm xl:text-base text-secondary underline decoration-secondary"
                >
                  Đăng ký
                </Link>
              </div>
            ) : (
              <Link
                to={role === 2 ? "/user/dashboard" : "admin/dashboard"}
                className="flex gap-3 items-center"
              >
                <div className="text-icon-color">
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
                  <p>Xin chào</p>
                  <p className="font-medium">{email}</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
