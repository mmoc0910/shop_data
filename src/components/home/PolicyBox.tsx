import { Link } from "react-router-dom";
import Container from "../common/Container";

const PolicyBox = () => {
  return (
    <Container className="xl:w-[1000px] pt-10 pb-10">
      <div className="col-span-1">
        <p className="font-medium text-2xl lg:text-4xl mb-5 lg:mb-7">
          Vietnamese VPNCN2 Policy
        </p>
        <ul className="list-decimal pl-5 space-y-2">
          <li className="">
            Mỗi key không giới hạn số lượng thiết bị kết nối nhưng sẽ bị giới
            hạn tổng băng thông sử dụng hàng tháng là 150GB, việc giới hạn này
            với mục đích hạn chế chia sẻ key sử dụng cho người khác.
          </li>
          <li className="">
            Phần mềm kết nối VPN là "OUTLINE" có trên tất cả các loại thiết bị
            (điện thoại, máy tính, máy tính bảng) và hệ điều hành (Windows, MAC,
            Chromebook, iOS iphone, Android), có thể kết nối VPN nhiều thiết bị
            cùng 1 lúc, Nhưng khuyến cáo KHÔNG ĐƯỢC chia sẻ cho người khác cùng
            sử dụng, nếu vượt quá băng thông bạn sẽ không thể tiếp tục sử dụng,
            khi đó bạn phải mua thêm băng thông hoặc chờ cho đến khi băng thông
            được reset xoay vòng 30 ngày
          </li>
          <li>
            Phần mềm OUTLINE có thể cài đặt trực tiếp từ AppStore(iOS) hoặc
            GooglePlay (Android).
            <div className="flex flex-wrap items-center gap-10 md:gap-16 lg:gap-20 py-10 ">
              <Link
                to={
                  "https://play.google.com/store/apps/details?id=org.outline.android.client&pcampaignid=web_share"
                }
                target="_blank"
                className="flex flex-col items-center gap-7 group"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-12 h-12 md:w-20 md:h-20 text-white fill-current group-hover:fill-primary transition-all duration-300"
                  >
                    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                  </svg>
                </span>
                <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                  GooglePlay (Android)
                </span>
              </Link>
              <Link
                to={
                  "https://apps.apple.com/us/app/outline-secure-internet-access/id1356178125?mt=12"
                }
                target="_blank"
                className="flex flex-col items-center gap-7 group"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-12 h-12 md:w-20 md:h-20 text-white fill-current group-hover:fill-primary transition-all duration-300"
                  >
                    <path d="M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z" />
                  </svg>
                </span>
                <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                  AppStore(MacOS)
                </span>
              </Link>
              <Link
                to={"https://apps.apple.com/us/app/outline-app/id1356177741"}
                target="_blank"
                className="flex flex-col items-center gap-7 group"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-12 h-12 md:w-20 md:h-20 text-white fill-current group-hover:fill-primary transition-all duration-300"
                  >
                    <path d="M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z" />
                  </svg>
                </span>
                <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                  AppStore(iOS)
                </span>
              </Link>
            </div>
            <span className="font-medium text-secondary40 text-xl">
              Nếu bạn đang ở China và không tải được trên kho ứng dụng, thì có
              thể dùng link download dưới đây.
            </span>
            <div className="flex flex-wrap items-stretch gap-10 md:gap-16 lg:gap-20 py-10">
              <Link
                to={"http://woot2.vn/vpncn2/Win-outline-client.zip"}
                download
                className="flex flex-col items-center gap-7 group"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-12 h-12 md:w-20 md:h-20 text-white fill-current group-hover:fill-primary transition-all duration-300"
                  >
                    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                  </svg>
                </span>
                <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                  For Windows
                </span>
              </Link>
              <Link
                to={"http://woot2.vn/vpncn2/Outline-Client-1.12.apk"}
                download
                className="flex flex-col items-center gap-7 group"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-12 h-12 md:w-20 md:h-20 text-white fill-current group-hover:fill-primary transition-all duration-300"
                  >
                    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                  </svg>
                </span>
                <span className="font-medium text-sm group-hover:text-primary transition-all duration-300 text-center">
                  For Android: New version <br/>(Recommend)
                </span>
              </Link>
              <Link
                to={"http://woot2.vn/vpncn2/Outline_1.11.0_Apkpure.apk"}
                download
                className="flex flex-col items-center gap-7 group"
              >
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="w-12 h-12 md:w-20 md:h-20 text-white fill-current group-hover:fill-primary transition-all duration-300"
                  >
                    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
                  </svg>
                </span>
                <span className="font-medium text-sm group-hover:text-primary transition-all duration-300">
                  For Android: Old version
                </span>
              </Link>
            </div>
          </li>
        </ul>
      </div>
    </Container>
  );
};

export default PolicyBox;
