import { message } from "antd";

export function copyToClipboard(text: string) {
    // Tạo một phần tử textarea ẩn
    const textarea = document.createElement("textarea");
    textarea.value = text;
  
    // Thêm phần tử vào DOM để có thể lựa chọn nội dung
    document.body.appendChild(textarea);
  
    // Chọn toàn bộ nội dung trong textarea
    textarea.select();
    textarea.setSelectionRange(0, 99999); // Đối với một số trình duyệt di động
  
    // Sao chép nội dung vào clipboard
    document.execCommand("copy");
  
    // Loại bỏ phần tử textarea đã thêm vào
    document.body.removeChild(textarea);
  
    // Thông báo hoặc thực hiện bất kỳ hành động nào khác ở đây
    message.info("Sao chép thành công");
  }