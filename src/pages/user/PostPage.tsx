import Heading from "../../components/common/Heading";
import img1 from "../../assets/install-outline-for-android_post/img1.jpg";
import img2 from "../../assets/install-outline-for-android_post/img2.jpg";
import img3 from "../../assets/install-outline-for-android_post/img3.jpg";
import img4 from "../../assets/install-outline-for-android_post/img4.jpg";
import img5 from "../../assets/install-outline-for-android_post/img5.jpg";
import img6 from "../../assets/install-outline-for-android_post/img6.jpg";
import img7 from "../../assets/install-outline-for-android_post/img7.jpg";
import { Link } from "react-router-dom";
const PostPage = () => {
  return (
    <div className="space-y-7">
      <Heading>
        HƯỚNG DẪN CÀI ĐẶT VÀ KÍCH HOẠT VPNCN2 CHO THIẾT BỊ DÙNG ANDROID
      </Heading>
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="font-semibold">
            <span className="underline decoration-black">Bước 1: </span>Tải app
            “Outline”{" "}
          </p>
          <div className="space-y-3">
            <p>
              <span className="underline decoration-black font-semibold">
                Cách 1:
              </span>{" "}
              Tải trực tiếp từ Google Play (Nếu bạn đang ở Việt Nam)
            </p>
            <img src={img1} className="w-[350px] h-auto py-5" />
            <p>
              <span className="underline decoration-black font-semibold">
                Cách 2:
              </span>{" "}
              Cài đặt từ file APK (Nếu bạn đang ở Trung Quốc và không thể truy
              cập Google Play)
            </p>
            <p className="underline decoration-black">
              <span className="font-medium">Link download: </span>
              <Link
                to={"http://woot2.vn/vpncn2/Outline-Client-1.12.apk"}
                download
              >
                http://woot2.vn/vpncn2/Outline-Client-1.12.apk
              </Link>
            </p>
            <p className="underline decoration-black">
              <span className="font-medium">Link dự phòng: </span>
              <Link
                to={"http://woot2.vn/vpncn2/Outline-Client-1.12.apk"}
                download
              >
                http://woot2.vn/vpncn2/Outline_1.11.0_Apkpure.apk(link version
                cũ)
              </Link>
            </p>
            <p>
              Mở link bên trên hoặc Copy và dán vào trình duyệt Chrome trên điện
              thoại
            </p>
            <p>
              Sau đó nhấn nút “ba chấm” ở góc phải màn hình, chọn mục “Tệp đã
              tải xuống”
            </p>
            <img src={img2} className="w-[350px] h-auto py-5" />
            <p>Mở file apk đã tải xuống (chọn trực tiếp) để ra phần cài đặt.</p>
            <img src={img3} className="w-[350px] h-auto py-5" />
            <p>
              Điện thoại sẽ hỏi bạn quyền cài đặt cho ứng dụng tải về từ Chrome,
              Nhấn cài đặt.
            </p>
            <img src={img4} className="w-[350px] h-auto py-5" />
            <p>
              Bật “cho phép các ứng dụng từ nguồn này”, sau đó nhấn nút quay trở
              lại.
            </p>
            <img src={img5} className="w-[350px] h-auto py-5" />
            <p>Cử sổ cài đặt phần mềm Outline hiện lên, chọn nút “Cài đặt”.</p>
            <img src={img6} className="w-[350px] h-auto py-5" />
            <p>Cài đặt Outline thành công.</p>
            <img src={img7} className="w-[350px] h-auto py-5" />
          </div>
        </div>
      </div>
      <div className="space-y-5">
        <div className="space-y-3">
          <p className="font-semibold">
            <span className="underline decoration-black">Bước 2: </span>Kích
            hoạt key phần mềm
          </p>
          <div className="space-y-3">
            <p>
              Nhận link key từ admin hoặc website và copy toàn bộ nội dung key
              bắt đầu từ <span className="text-error">ssconf://</span>{" "}
            </p>
            <p>
              Ví dụ:{" "}
              <span className="font-semibold">
                “ssconf://s3.ap-northeast-3.amazonaws.com/vpncn2.top/20240305-mchina-manhnguyen-r06m.json#m-user-20240225”
              </span>
            </p>
            <img src={img1} className="w-[350px] h-auto py-5" />
            <p>
              <span className="underline decoration-black font-semibold">
                Cách 2:
              </span>{" "}
              Cài đặt từ file APK (Nếu bạn đang ở Trung Quốc và không thể truy
              cập Google Play)
            </p>
            <p className="underline decoration-black">
              <span className="font-medium">Link download: </span>
              <Link
                to={"http://woot2.vn/vpncn2/Outline-Client-1.12.apk"}
                download
              >
                http://woot2.vn/vpncn2/Outline-Client-1.12.apk
              </Link>
            </p>
            <p className="underline decoration-black">
              <span className="font-medium">Link dự phòng: </span>
              <Link
                to={"http://woot2.vn/vpncn2/Outline-Client-1.12.apk"}
                download
              >
                http://woot2.vn/vpncn2/Outline_1.11.0_Apkpure.apk(link version
                cũ)
              </Link>
            </p>
            <p>
              Mở link bên trên hoặc Copy và dán vào trình duyệt Chrome trên điện
              thoại
            </p>
            <p>
              Sau đó nhấn nút “ba chấm” ở góc phải màn hình, chọn mục “Tệp đã
              tải xuống”
            </p>
            <img src={img2} className="w-[350px] h-auto py-5" />
            <p>Mở file apk đã tải xuống (chọn trực tiếp) để ra phần cài đặt.</p>
            <img src={img3} className="w-[350px] h-auto py-5" />
            <p>
              Điện thoại sẽ hỏi bạn quyền cài đặt cho ứng dụng tải về từ Chrome,
              Nhấn cài đặt.
            </p>
            <img src={img4} className="w-[350px] h-auto py-5" />
            <p>
              Bật “cho phép các ứng dụng từ nguồn này”, sau đó nhấn nút quay trở
              lại.
            </p>
            <img src={img5} className="w-[350px] h-auto py-5" />
            <p>Cử sổ cài đặt phần mềm Outline hiện lên, chọn nút “Cài đặt”.</p>
            <img src={img6} className="w-[350px] h-auto py-5" />
            <p>Cài đặt Outline thành công.</p>
            <img src={img7} className="w-[350px] h-auto py-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
