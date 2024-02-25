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
  const { email } = useSelector((state: RootState) => state.auth);
  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-20 shadow-sm">
      <Container className="py-5">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex gap-7 items-center">
            {menu.map((item) => (
              <a
                key={uuidv4()}
                href={item.to}
                className={classNames(
                  "font-medium text-base",
                  item.to === "#home" ? "text-primary" : "text-icon-color"
                )}
              >
                {item.title}
              </a>
            ))}
            <div className="font-medium text-icon-color cursor-pointer relative group">
              <div className="">Download</div>
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
              <Link
                to={"/sign-in"}
                className="font-medium text-base text-primary underline decoration-primary pl-5"
              >
                Đăng nhập
              </Link>
            ) : (
              <Link to={"/user/dashboard"} className="flex gap-3">
                <div className="w-10 h-10 bg-slate-400 rounded-full" />
                <div className="">
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
