import IconQuesionMarkCircle from "../../icons/IconQuesionMarkCircle";
import { Tooltip } from "antd";

const InvitePage = () => {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="col-span-1 shadow-xl px-5 py-7 flex flex-col items-center rounded-xl space-y-4">
        <p className="font-medium text-4xl">0</p>
        <div className="flex items-center gap-1">
          <p className="text-lg">Cấp độ</p>
          <Tooltip title="Cấp 1: Nạp Đơn Giá Trị 1.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 10% || Cấp 2: Nạp Đơn Giá Trị 3.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 20% || Cấp 3: Nạp Đơn Giá Trị 10.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 50%">
            <span>
              <IconQuesionMarkCircle />
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="col-span-1 shadow-xl px-5 py-7 flex flex-col items-center rounded-xl space-y-4">
        <p className="font-medium text-4xl">0</p>
        <div className="flex items-center gap-1">
          <p className="text-lg">Đã mời</p>
        </div>
      </div>
      <div className="col-span-1 shadow-xl px-5 py-7 flex flex-col items-center rounded-xl space-y-4">
        <p className="font-medium text-4xl">0</p>
        <div className="flex items-center gap-1">
          <p className="text-lg">Phần trăm hoa hồng</p>
          <Tooltip title="Cấp 1: Nạp Đơn Giá Trị 1.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 10% || Cấp 2: Nạp Đơn Giá Trị 3.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 20% || Cấp 3: Nạp Đơn Giá Trị 10.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 50%">
            <span>
              <IconQuesionMarkCircle />
            </span>
          </Tooltip>
        </div>
      </div>
      <div className="col-span-1 shadow-xl px-5 py-7 flex flex-col items-center rounded-xl space-y-4">
        <p className="font-medium text-4xl">0</p>
        <div className="flex items-center gap-1">
          <p className="text-lg">Tiền hoa hồng</p>
          <Tooltip title="Cấp 1: Nạp Đơn Giá Trị 1.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 10% || Cấp 2: Nạp Đơn Giá Trị 3.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 20% || Cấp 3: Nạp Đơn Giá Trị 10.000.000 ₫ , Mua Gói Hoặc Giới Thiệu Khách Nạp Số Dư Sẽ Được Hưởng 50%">
            <span>
              <IconQuesionMarkCircle />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
