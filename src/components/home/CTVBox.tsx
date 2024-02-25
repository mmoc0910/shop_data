import React from "react";
import Container from "../common/Container";

const CTVBox = () => {
  return (
    <Container className="w-[1000px] pt-20 pb-10 grid grid-cols-2 gap-20">
      <div className="col-span-1">
        <p className="font-medium text-4xl mb-7">
          Tuyển CTV chính sách hấp dẫn
        </p>
        <ul className="list-disc pl-5 space-y-5">
          <li>
            Bất kỳ người dùng đều có thể làm CTV khi chia sẻ mã giới thiệu cho
            người khác
          </li>
          <li>Giảm 30% cho đơn hàng đầu tiên có mã giới thiệu</li>
          <li>Giảm 10% cho các đơn hàng tiếp theo</li>
          <li>Cộng ngay 20% cho mỗi đơn hàng vào tài khoản hoa hồng</li>
        </ul>
      </div>
      <div className="col-span-1">
        <p className="font-medium text-4xl mb-7">
          Chính sách phát triển đại lý
        </p>
        <ul className="list-disc pl-5 space-y-5">
          <li>Mức hoa hồng cho đại lý lên tới 35%</li>
          <li>Phát triển đại lý nhiều cấp</li>
        </ul>
      </div>
    </Container>
  );
};

export default CTVBox;
