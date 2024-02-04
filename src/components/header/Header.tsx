import Logo from "../logo/Logo";
import Container from "../common/Container";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";

const menu = [
  { title: "Trang chủ", to: "#home" },
  { title: "Dịch vụ", to: "#service" },
  { title: "Tính năng", to: "#feature" },
  { title: "Bảng giá", to: "#pricing" },
];
const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white">
      <Container className="py-5">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex gap-5 items-center">
            {menu.map((item) => (
              <a
                href={item.to}
                className={classNames(
                  "font-medium text-base",
                  item.to === "#home" ? "text-primary" : "text-icon-color"
                )}
              >
                {item.title}
              </a>
            ))}
            <Link
              to={"/sign-in"}
              className="font-medium text-base text-primary underline decoration-primary"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Header;
