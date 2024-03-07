import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link
      to={"/"}
      className={classNames("font-semibold text-lg xl:text-2xl text-primary uppercase", className)}
    >
      vpncn2
    </Link>
  );
};

export default Logo;
