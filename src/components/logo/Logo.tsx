import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link
      to={"/"}
      className={classNames("font-semibold text-2xl text-primary", className)}
    >
      Logo
    </Link>
  );
};

export default Logo;
