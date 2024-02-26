
import Container from "../common/Container";

const AboutBox = () => {
  return (
    <Container className="xl:w-[1000px] py-10 lg:py-20">
      <p className="font-medium text-2xl lg:text-4xl mb-5 lg:mb-7">
        Understanding about VPN ChinaVIP
      </p>
      <ul className="list-decimal pl-5 space-y-2">
        <li className="font-medium text-lg">VPN là gi</li>
        <p>
          VPN là ứng dụng cho phép bạn tạo một kết nối riêng để tăng tốc truy
          cập các Website thường được sử dụng ở nước ngoài
          (Google/Youtube/Twitter/Instgram/Github), mà kết nối đó mạng của bạn
          bị chặn hoặc hạn chế.
          <br />
          <br /> Giả dụ bạn ở Trung Quốc, thì do chính sách viễn thông của chính
          phủ Trung Quốc, bạn không thể truy cập được các dịch vụ ngoài lãnh thổ
          Trung Quốc, đặc biệt là các ứng dụng, website của MỸ, EU - Chính là
          Google, Facebook, Youtube, hoặc Google Play store, những kho ứng dụng
          của Android ...
        </p>
        <li className="font-medium text-lg">VPN tại Trung Quốc để làm gì</li>
        <p>
          Vì lý do trên, với người nước ngoài đến hoặc du học sinh tại Trung
          Quốc đều phải dùng VPN mới có thể sử dụng được các dịch vụ đã quen,
          phổ biến của nước họ. Ví dụ: Các bạn Việt Nam, Laos, Cambodia cần VPN
          để vô Facebook, Gmail, Play ... bạn Russia cần VPN để vô Telegram ...
        </p>
        <li className="font-medium text-lg">Lưu ý gì khi mua VPN</li>
        <p>
          Tốc độ truy cập mạng sau khi kết nối VPN phụ thuộc vào các yếu tố :
          <br />
          (a) Gói cước mạng (4G, 5G hoặc Gói internet cáp quang của bạn - Nếu là
          du học sinh sẽ phụ thuộc vào internet của ký túc xá, hoặc trường học,
          ngoài ra cũng bị ảnh hưởng bởi thiết bị wifi phát cho thiết bị của bạn
          nữa)
          <br />(b) Gói cước hoặc nhà cung cấp dịch vụ VPN cho bạn Các bên bán
          VPN sẽ tuỳ vào nhu cầu sử dụng của bạn để chia ra các gói VPN khác
          nhau, có gói chi phí rẻ nhưng tốc độ bạn truy cập được rất chậm hoặc
          giới hạn ứng dụng (ví dụ chỉ vô được google nhưng không load được
          video, hình ảnh ...). Nếu có nhu cầu sử dụng thời gian dài, (như đối
          với du học sinh thì thời gian sử dụng ít nhất 6 tháng- 1 nắm), thì tốt
          nhất bạn nên tìm hiểu hoặc dùng thử ít nhất 3 nhà cung cấp để so sánh
          trước khi đưa ra quyết định.
        </p>
      </ul>
    </Container>
  );
};

export default AboutBox;
