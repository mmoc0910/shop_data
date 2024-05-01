import img1 from "../../../assets/titok-iphone-guide/img1.jpg";
import img2 from "../../../assets/titok-iphone-guide/img2.jpg";
import img3 from "../../../assets/titok-iphone-guide/img3.jpg";
const TiTokIphoneGuide = () => {
  return (
    <div className="w-full xl:w-3/4">
      <h2 className="text-xl uppercase font-bold mb-5">
        Hướng dẫn truy cập Tiktok Iphone
      </h2>
      <div className="space-y-2">
        <p>
          Để truy cập được Tiktok, điện thoại bạn cần có sim VN(hoặc không phải
          Sim China) còn trên máy, mục đích để Tiktok không phát hiện ra bạn
          đang dùng tín hiệu mạng của china. Sim VN không cần roaming hay data,
          chỉ cẩn còn enable được trên điện thoại. Setting như bên dưới.
        </p>
        <p>
          **Nếu bạn không có sẵn Sim VN, và máy có hỗ trợ ESIM, bạn có thể mua 1
          esim của Wintel giá chỉ 85.000 VND, sau đó làm theo hướng dẫn của
          Wintel là bạn có thể dùng sim này dưới dạng chim mồi (Chỉ mua lần đầu,
          lưu ý không cần nạp tiền).
        </p>
      </div>
      <img src={img1} className="w-full md:w-[350px] h-auto object-cover my-3" />
      <p>Cài đặt này khi bạn lướt Tiktok bằng Wifi:</p>
      <img src={img2} className="w-full md:w-[350px] h-auto object-cover my-3" />
      <p>
        Nếu bạn muốn lướt Tiktok bằng 4G, chuyển cài đặt như bên dưới, tuy nhiên
        việc xem qua 4G không ổn định, không hoạt động trên tất cả các máy.
      </p>
      <img src={img3} className="w-full md:w-[350px] h-auto object-cover my-3" />
    </div>
  );
};

export default TiTokIphoneGuide;
