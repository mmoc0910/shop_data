import { Link } from "react-router-dom";
import Heading from "../common/Heading";
import { useTranslation } from "react-i18next";

const Post = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <Heading>{t("page.dashboard.userManual.userManual")}</Heading>
      <div className="space-y-6">
        <Link
          to={"/user/dashboard/post/android-vi_outline-phone-guide"}
          className="block overflow-hidden bg-gray-100 border rounded-lg"
        >
          <p className="px-5 py-3 text-lg font-medium">Thông tin cần biết</p>
          <div className="px-5 py-3 bg-white border rounded-lg">
            <p className="font-medium">
              HƯỚNG DẪN CÀI ĐẶT VÀ KÍCH HOẠT VPNCN2 CHO THIẾT BỊ DÙNG ANDROID
            </p>
            <p className="mt-4 text-sm text-gray-400">
              Lần Cập Nhật Cuối Cùng Vào: 25/04/2024
            </p>
          </div>
        </Link>
        <Link
          to={"/user/dashboard/post/tiktok-iphone-guide"}
          className="block overflow-hidden bg-gray-100 border rounded-lg"
        >
          <p className="px-5 py-3 text-lg font-medium">Thông tin cần thiết</p>
          <div className="px-5 py-3 bg-white border rounded-lg">
            <p className="font-medium">Hướng dẫn truy cập Tiktok Iphone</p>
            <p className="mt-4 text-sm text-gray-400">
              Lần Cập Nhật Cuối Cùng Vào: 25/04/2024
            </p>
          </div>
        </Link>
        <Link
          to={"/user/dashboard/post/questions"}
          className="block overflow-hidden bg-gray-100 border rounded-lg"
        >
          <p className="px-5 py-3 text-lg font-medium">Câu hỏi thường gặp</p>
          <div className="px-5 py-3 bg-white border rounded-lg">
            <p className="font-medium">Câu hỏi thường gặp</p>
            <p className="mt-4 text-sm text-gray-400">
              Lần Cập Nhật Cuối Cùng Vào: 25/04/2024
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Post;
