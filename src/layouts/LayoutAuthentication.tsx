import React, { FC } from "react";
import bg from "../assets/Ellipse.png";
import Logo from "../components/logo/Logo";
import { SelectLanguage } from "../components/header/Header";

type LayoutAuthentication = {
  heading?: string;
  children: React.ReactNode;
};

const LayoutAuthentication: FC<LayoutAuthentication> = ({
  heading = "",
  children,
}) => {
  return (
    <div className="relative w-screen overflow-hidden xl:h-auto xl:overflow-auto">
      <div className="absolute top-5 right-5">
        <SelectLanguage />
      </div>
      <div className="w-full min-h-screen p-6 md:p-10 bg-lite">
        <div className="flex items-center justify-center">
          {" "}
          <Logo />
        </div>

        <div className="w-full sm:w-[556px] rounded-xl bg-white px-[20px] py-[30px] sm:px-[60px] sm:py-[50px] mx-auto relative z-[1]">
          <h1 className="text-lg font-semibold md:text-xl text-text1 mb-[5px] md:mb-[10px] text-center">
            {heading}
          </h1>
          {children}
        </div>
      </div>
      <div className="hidden md:block absolute w-[200%] right-1/2 translate-x-1/2 xl:translate-x-0 xl:w-full bottom-0 xl:right-0 h-auto z-[0]">
        <img src={bg} alt="background" className="object-cover w-full" />
      </div>
    </div>
  );
};

export default LayoutAuthentication;
