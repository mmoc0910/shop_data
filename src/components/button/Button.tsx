import React, { FC } from "react";
import { Link } from "react-router-dom";
import classNames from "../../utils/classNames";

type ButtonType = {
  type?: "button" | "submit" | "reset";
  children: React.ReactNode;
  className?: string;
  href?: string;
};

const Button: FC<ButtonType> = ({
  children,
  type = "button",
  className = "text-white",
  href,
  ...rest
}) => {
  if (href)
    return (
      <Link
        to={href}
        type={type}
        className={classNames(
          "font-semibold lg:py-3 rounded-[10px] lg:min-h-[52px] flex items-center justify-center select-none text-sm lg:text-base min-h-[40px] py-2",
          className
        )}
        {...rest}
      >
        {children}
      </Link>
    );
  return (
    <button
      type={type}
      className={classNames(
        "font-semibold lg:py-3 rounded-[10px] lg:min-h-[52px] flex items-center justify-center select-none text-sm lg:text-base min-h-[40px] py-2",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
