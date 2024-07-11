import { Link } from "react-router-dom";
import bg from "../../assets/hero-1-bottom-shape.png";
import Container from "../common/Container";
import qrWechat from "../../assets/qr-wechat.png";
import qrZalo from "../../assets/qr-zalo.png";
import img from "../../assets/illustration-of-a-blue-smartphone-with-a-security-shield-vpn-technology-privacy-and-security-on-the-internet-banner-on-blue-background-secure-access-to-online-data-free-vector-removebg.png";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";

const HomeBox = () => {
  const { t } = useTranslation();
  return (
    <div
      id="home"
      className="bg-[url('https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=1993&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center relative pt-4"
    >
      <img
        alt="background image"
        src={bg}
        className="absolute bottom-0 left-0 right-0 z-[2]"
      />
      <div className="absolute w-full h-full inset-0 bg-[#000000a0] z-[1]"></div>
      <Container className="pb-14 md:pb-20 grid grid-cols-10 relative z-10 md:gap-x-8">
        <div className="col-span-10 md:col-span-7">
          <div className="flex item md:items-center gap-2 mb-5">
            <img
              src={logo}
              alt="vncpn2 logo"
              className="w-40 md:w-56 xl:w-60 object-contain"
            />
            <h1 className="text-3xl lg:text-5xl font-medium text-white !leading-relaxed tracking-wide">
              {t("page.home.home.heading")}
            </h1>
          </div>

          <ul className="space-y-3 text-white list-disc pl-5 text-base lg:text-lg">
            <li>{t("page.home.home.content.phr1")}</li>
            <li>{t("page.home.home.content.phr2")}</li>
            <li>{t("page.home.home.content.phr3")}</li>
            <li>{t("page.home.home.content.phr4")}</li>
            <li>{t("page.home.home.content.phr5")}</li>
            <li>{t("page.home.home.content.phr6")}</li>
          </ul>
        </div>
        <div className="col-span-3 lg:pl-5 items-center justify-center hidden md:flex">
          <img src={img} alt="phone image" className="h-[400px] object-cover" />
        </div>
        <div className="col-span-10 mt-5 mb-0 lg:mb-24">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-6 lg:col-span-5">
              <p className="text-white font-medium mb-10 text-lg">
                {t("page.home.home.download")}
              </p>
              <div className="flex justify-between">
                <Link
                  to={
                    "https://apps.apple.com/us/app/outline-secure-internet-access/id1356178125?mt=12"
                  }
                  target="_blank"
                  className="col-span-1 flex flex-col gap-3 items-center group"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 384 512"
                      className="w-16 h-16 lg:w-20 lg:h-20 text-white group-hover:text-primary transition-all duration-200"
                      fill="currentColor"
                    >
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                  </span>
                  <span className="font-medium text-white group-hover:text-primary transition-all duration-200">
                    MACOS
                  </span>
                </Link>
                <Link
                  to={"https://apps.apple.com/us/app/outline-app/id1356177741"}
                  target="_blank"
                  className="col-span-1 flex flex-col gap-3 items-center group"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="w-16 h-16 lg:w-20 lg:h-20 text-white group-hover:text-primary transition-all duration-200"
                      fill="currentColor"
                    >
                      <path d="M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z" />
                    </svg>
                  </span>
                  <span className="font-medium text-white group-hover:text-primary transition-all duration-200">
                    iOS
                  </span>
                </Link>
                <Link
                  to={
                    "https://play.google.com/store/apps/details?id=org.outline.android.client&pcampaignid=web_share"
                  }
                  target="_blank"
                  className="col-span-1 flex flex-col gap-3 items-center group"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      className="w-16 h-16 lg:w-20 lg:h-20 text-white group-hover:text-primary transition-all duration-200"
                      fill="currentColor"
                    >
                      <path d="M420.6 301.9a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1 -24 24m273.7-144.5 47.9-83a10 10 0 1 0 -17.3-10h0l-48.5 84.1a301.3 301.3 0 0 0 -246.6 0L116.2 64.5a10 10 0 1 0 -17.3 10h0l47.9 83C64.5 202.2 8.2 285.6 0 384H576c-8.2-98.5-64.5-181.8-146.9-226.6" />
                    </svg>
                  </span>
                  <span className="font-medium text-white group-hover:text-primary transition-all duration-200">
                    ANDROID
                  </span>
                </Link>
                <Link
                  to={"http://woot2.vn/vpncn2/Win-outline-client.zip"}
                  download
                  className="col-span-1 flex flex-col gap-3 items-center group"
                >
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-16 h-16 lg:w-20 lg:h-20 text-white group-hover:text-primary transition-all duration-200"
                      fill="currentColor"
                    >
                      <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
                    </svg>
                  </span>
                  <span className="font-medium text-white group-hover:text-primary transition-all duration-200">
                    WINDOWS
                  </span>
                </Link>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6 lg:col-span-7 ml-0 md:ml-10 lg:ml-32 mt-10 md:mt-0">
              <p className="text-white font-medium mb-10 text-lg">
                {t("page.home.home.contact")}{" "}
                <Link
                  to={"/sign-up"}
                  className="font-medium underline decoration-primary text-primary text-2xl"
                >
                  {t("authen.sign_up")}
                </Link>
              </p>
              <div className="flex gap-5 justify-evenly xl:justify-start xl:gap-10">
                <div className="flex flex-col items-center gap-3">
                  <img
                    alt="QR Zalo"
                    src={qrZalo}
                    className="w-32 lg:w-40 aspect-square object-cover rounded-md"
                  />
                  <p className="font-medium text-white">Zalo</p>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <img
                    alt="QR Wechat"
                    src={qrWechat}
                    className="w-32 lg:w-40 aspect-square object-cover rounded-md"
                  />
                  <p className="font-medium text-white">Wechat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HomeBox;
