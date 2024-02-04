import bg from "../assets/hero-1-bottom-shape.png";
import Container from "../components/common/Container";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { IconCheck } from "../components/checkbox/Checkbox";
import Header from "../components/header/Header";

const sliders = [
  "https://images.unsplash.com/photo-1559613671-dfe2fb6a7680?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="pt-[72px]">
        <div
          id="home"
          className="bg-[url('https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center relative z-[-3]"
        >
          <img src={bg} className="absolute bottom-0 left-0 right-0 z-[-1]" />
          <div className="absolute w-full h-full inset-0 bg-[#00000074] z-[-2]"></div>
          <Container className="py-20 grid grid-cols-10">
            <div className="col-span-4">
              <h1 className="text-5xl font-medium leading-relaxed text-white mb-10">
                Dịch vụ VPN chuyển tiếp mạng toàn cầu, sử dụng mọi lúc, mọi nơi
              </h1>
              <div className="space-y-8 mb-20">
                <div className="flex gap-5">
                  <div className="w-2 h-2 bg-gray-300 rounded-full shrink-0 mt-[6px]" />
                  <p className="text-gray-300">
                    Hệ thống phân luồng thông minh, kết nối trực tiếp các trang
                    web trong nước để nâng cao trải nghiệm người dùng, tăng tốc
                    dịch vụ Apple
                  </p>
                </div>
                <div className="flex gap-5">
                  <div className="w-2 h-2 bg-gray-300 rounded-full shrink-0 mt-[6px]" />
                  <p className="text-gray-300">
                    Tăng tốc các trang web thường được sử dụng ở nước ngoài
                    (Google/Youtube/Twitter/Instgram/Github)
                  </p>
                </div>
                <div className="flex gap-5">
                  <div className="w-2 h-2 bg-gray-300 rounded-full shrink-0 mt-[6px]" />
                  <p className="text-gray-300">
                    Sử dụng phương pháp mã hóa mạnh nhất trong quá trình truyền
                    để bảo vệ dữ liệu và quyền riêng tư của người dùng
                  </p>
                </div>
                <div className="flex gap-5">
                  <div className="w-2 h-2 bg-gray-300 rounded-full shrink-0 mt-[6px]" />
                  <p className="text-gray-300">
                    Tương thích với các ứng dụng tuyệt vời trên nhiều nền tảng
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-6 pl-28 flex items-center justify-center">
              <Swiper
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                modules={[Autoplay]}
              >
                {sliders.map((item) => (
                  <SwiperSlide>
                    <img
                      src={item}
                      className="aspect-video rounded-2xl object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Container>
        </div>
        <div className="py-28" id="pricing">
          <Container className="flex flex-col items-center">
            <div className="w-3/5 space-y-5">
              <h2 className="font-medium text-2xl text-center">
                Trải nghiệm tuyệt vời, giá bất ngờ
              </h2>
              <p className="text-center text-gray-400">
                Đừng lãng phí thời gian quý báu của bạn để chờ đợi. Mở ngay dịch
                vụ chuyển tiếp mạng toàn cầu và truy cập Internet toàn cầu mọi
                lúc, mọi nơi.
              </p>
            </div>
            <div className="my-14 py-2 px-7 bg-[#f2f4f7] rounded-full">
              <div className="font-medium text-white bg-primary px-4 py-3 rounded-full">
                Thanh toán hàng tháng
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 w-full">
              <div className="col-span-1 shadow-xl flex flex-col items-center rounded-2xl overflow-hidden">
                <h4 className="font-medium text-primary bg-primary bg-opacity-5 px-3 py-2 rounded-br-lg rounded-bl-lg">
                  Gói M- ChinaVIP
                </h4>
                <div className="pb-10 pt-14">
                  <p className="text-primary text-4xl font-medium mb-3">
                    65.000đ
                  </p>
                  <p className="text-primary text-center">Mỗi tháng</p>
                </div>
                <div className="w-3/4 mx-auto space-y-5 pb-20">
                  <Check content="Không giới hạn thiết bị" />
                  <Check content="Hỗ trợ tất cả nền tảng" />
                  <Check content="120GB xoay vòng mỗi tháng" />
                  <Check content="Truy cập FB, GG, Youtube, Telegram, Whatsapp, Tiktok" />
                  <Check content="Thanh toán tự động" />
                </div>
                <div className="flex items-center justify-center bg-primary w-full py-4">
                  <p className="font-medium text-white text-lg">Đăng ký</p>
                </div>
              </div>
              <div className="col-span-1 shadow-xl flex flex-col items-center rounded-2xl overflow-hidden">
                <h4 className="font-medium text-primary bg-primary bg-opacity-5 px-3 py-2 rounded-br-lg rounded-bl-lg">
                  Gói H- ChinaVIP
                </h4>
                <div className="pb-10 pt-14">
                  <p className="text-primary text-4xl font-medium mb-3">
                    270.000đ
                  </p>
                  <p className="text-primary text-center">06 tháng</p>
                </div>
                <div className="w-3/4 mx-auto space-y-5 pb-20">
                  <Check content="Không giới hạn thiết bị" />
                  <Check content="Hỗ trợ tất cả nền tảng" />
                  <Check content="120GB xoay vòng mỗi tháng" />
                  <Check content="Truy cập FB, GG, Youtube, Telegram, Whatsapp, Tiktok" />
                  <Check content="Thanh toán tự động" />
                </div>
                <div className="flex items-center justify-center bg-primary w-full py-4">
                  <p className="font-medium text-white text-lg">Đăng ký</p>
                </div>
              </div>
              <div className="col-span-1 shadow-xl flex flex-col items-center rounded-2xl overflow-hidden">
                <h4 className="font-medium text-primary bg-primary bg-opacity-5 px-3 py-2 rounded-br-lg rounded-bl-lg">
                  Gói Y-ChinaVIP
                </h4>
                <div className="pb-10 pt-14">
                  <p className="text-primary text-4xl font-medium mb-3">
                    420.000đ
                  </p>
                  <p className="text-primary text-center">1 năm</p>
                </div>
                <div className="w-3/4 mx-auto space-y-5 pb-20">
                  <Check content="Không giới hạn thiết bị" />
                  <Check content="Hỗ trợ tất cả nền tảng" />
                  <Check content="120GB xoay vòng mỗi tháng" />
                  <Check content="Truy cập FB, GG, Youtube, Telegram, Whatsapp, Tiktok" />
                  <Check content="Thanh toán tự động" />
                </div>
                <div className="flex items-center justify-center bg-primary w-full py-4">
                  <p className="font-medium text-white text-lg">Đăng ký</p>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};

export const Check = ({ content }: { content: string }) => {
  return (
    <div className="flex gap-3">
      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center translate-y-[2px] shrink-0">
        <span className="text-white">
          <IconCheck />
        </span>
      </div>
      <p className="">{content}</p>
    </div>
  );
};

export default HomePage;
