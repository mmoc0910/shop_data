import { Link } from "react-router-dom";
import Heading from "../common/Heading";

const Post = () => {
  return (
    <div className="space-y-4">
      <Heading>Hướng dẫn sử dụng</Heading>
      <div className="space-y-6">
        <Link to={"/user/dashboard/post/abc"} className="block overflow-hidden bg-gray-100 border rounded-lg">
          <p className="px-5 py-3 text-lg font-medium">Thông tin cần biết</p>
          <div className="px-5 py-3 bg-white border rounded-lg">
            <p className="font-medium">
              Thông tin cần biết VPN 4G là gì ? Tại sao lại cần đến ?
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Lần Cập Nhật Cuối Cùng Vào:08/2/2023
            </p>
          </div>
        </Link>
        <div className="bg-gray-100 border rounded-lg overflow-hidde">
          <p className="px-5 py-3 text-lg font-medium">Chương trình CTV</p>
          <div className="px-5 py-3 bg-white border rounded-lg">
            <p className="font-medium">Hưởng hoa hồng 30% trọn đời</p>
            <p className="mt-4 text-sm text-gray-400">
              Lần Cập Nhật Cuối Cùng Vào:07/11/2022
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
