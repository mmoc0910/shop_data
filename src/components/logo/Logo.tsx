import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";
import logo from '../../assets/logo.svg'
const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <Link
      to={"https://home.vpncn2.net"}
      className={classNames(
        "font-semibold text-lg xl:text-2xl text-primary uppercase block",
        className
      )}
    >
      {/* vpncn2 */}
      <img src={logo} className="w-32 object-cover"/>
    </Link>
  );
};

export default Logo;
