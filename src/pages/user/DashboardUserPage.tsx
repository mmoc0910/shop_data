import React from "react";
import Heading from "../../components/common/Heading";
import { Progress } from "antd";

const DashboardUserPage = () => {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <Heading>Thông tin người dùng</Heading>
        <div className="space-y-3">
          <p>
            <span className="font-medium">Email:</span> Account@gmail.com
          </p>
          <p>
            <span className="font-medium">Số dư:</span> 0
            <span className="underline">đ</span>
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <Heading>
          <p>Gói dịch vụ của tôi</p>
          <p className="font-medium text-sm text-gray-400">
            Miễn phí (tốc độ thấp, dùng hết nâng cấp gói)
          </p>
          <p className="font-medium text-sm text-gray-400">
            Hết Hạn Vào Ngày 07/02/2024，Còn 2 Ngày.
          </p>
        </Heading>
        <div className="space-y-3">
          <div className="">
            <Progress percent={50} showInfo={false} strokeColor={"#1DC071"} />
            <p>Dung Lượng Sử Dụng: 0 bytes / 5.00 GB</p>
          </div>
          <div className="">
            <Progress percent={0} showInfo={false} strokeColor={"#1DC071"} />
            <p>Thiết Bị Kết Nối: 0 / 1</p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Heading>Hướng dẫn sử dụng</Heading>
        <div className="space-y-6">
          <div className="rounded-lg border overflow-hidden">
            <p className="px-5 py-3 font-medium bg-gray-100 text-lg">
              Thông tin cần biết
            </p>
            <div className="rounded-lg border px-5 py-3">
              <p className="font-medium">
                Thông tin cần biết VPN 4G là gì ? Tại sao lại cần đến ?
              </p>
              <p className="text-gray-400 text-sm mt-4">
                Lần Cập Nhật Cuối Cùng Vào:08/2/2023
              </p>
            </div>
          </div>
          <div className="rounded-lg border overflow-hidden">
            <p className="px-5 py-3 font-medium bg-gray-100 text-lg">
              Chương trình CTV
            </p>
            <div className="rounded-lg border px-5 py-3">
              <p className="font-medium">Hưởng hoa hồng 30% trọn đời</p>
              <p className="text-gray-400 text-sm mt-4">
                Lần Cập Nhật Cuối Cùng Vào:07/11/2022
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardUserPage;
