import { Check } from "../HomePage";

const PlanPage = () => {
  return (
    <div className="grid grid-cols-3 gap-9 w-full px-5">
      <div className="col-span-1 shadow-xl flex flex-col items-center rounded-2xl overflow-hidden">
        <h4 className="font-medium text-primary bg-primary bg-opacity-5 px-3 py-2 rounded-br-lg rounded-bl-lg">
          Gói M- ChinaVIP
        </h4>
        <div className="pb-10 pt-14">
          <p className="text-primary text-4xl font-medium mb-3">65.000đ</p>
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
          <p className="text-primary text-4xl font-medium mb-3">270.000đ</p>
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
          <p className="text-primary text-4xl font-medium mb-3">420.000đ</p>
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
  );
};

export default PlanPage;
