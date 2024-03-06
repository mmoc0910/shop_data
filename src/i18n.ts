import i18n, { init } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n.use(LanguageDetector).use(initReactI18next),
  init({
    debug: true,
    fallbackLng: "en",
    lng: "vi",
    resources: {
      en: {
        translation: {
          authen: {
            sign_in: "Sign in",
            sign_up: "Sign up",
            sign_out: "Sign out",
          },
          header: {
            home: "Home",
            pricing: "Pricing",
          },
          login: {
            welcome_back: "Welcome Back!",
            dont_have_account: "Dont have an account?",
            have_account: "Already have an account?",
            forgot_pass: "Forgot Password?",
          },
          form: {
            account: {
              label: "Username Or Email*",
              placeholder: "Enter your username or email",
              error: { required: "This field is required" },
            },
            password: {
              label: "Password*",
              placeholder: "Enter your Password",
              error: { required: "This field is required" },
            },
            re_password: {
              label: "Re-Type Password*",
              placeholder: "Enter Re-Type Password",
              error: { required: "This field is required" },
            },
            username: {
              label: "UserName*",
              placeholder: "Enter your username",
              error: {
                required: "This field is required",
                reg: "Username is consecutive letters, without accents",
              },
            },
            email: {
              label: "Email*",
              placeholder: "Enter your email",
              error: {
                required: "This field is required",
                email: "Incorrect email format",
              },
            },
            phone: {
              label: "Phone Number*",
              placeholder: "Enter your phone",
              error: { required: "This field is required" },
            },
            introduce_code: {
              label: "Introduce Code*",
              placeholder: "Enter your introduce code",
              error: { required: "This field is required" },
            },
            country: {
              label: "Country*",
              placeholder: "Select your country",
              error: { required: "This field is required" },
            },
            purpose: {
              label: "Purpose*",
              placeholder: "Select your purpose",
              error: { required: "This field is required" },
            },
          },
          menu_user: {
            dashboard: "Dashboard",
            recharge: "Recharge",
            pack_of_data: "Pack of data",
            my_order: "My order",
            transaction_history: "Transaction history",
            deposit_history: "Deposit history",
            collaborators: "Collaborators",
            user_information: "User information",
          },
        },
      },
      vi: {
        translation: {
          authen: {
            sign_in: "Đăng nhập",
            sign_up: "Đăng ký",
            sign_out: "Đăng xuất",
          },
          header: {
            home: "Trang chủ",
            pricing: "Bảng giá",
          },
          login: {
            welcome_back: "Chào mừng quay trở lại!",
            dont_have_account: "Bạn chưa có tài khoản?",
            have_account: "Bạn đã có tài khoản?",
            forgot_pass: "Quên mật khẩu?",
          },
          form: {
            account: {
              label: "Tên đăng nhập hoặc Email*",
              placeholder: "Nhập tên đăng nhập hoặc email của bạn",
              error: { required: "Trường này không được bỏ trống" },
            },
            password: {
              label: "Mật khẩu*",
              placeholder: "Nhập mật khẩu của bạn",
              error: { required: "Mật khẩu không được bỏ trống" },
            },
            re_password: {
              label: "Xác nhận mật khẩu*",
              placeholder: "Xác nhận mật khẩu của bạn",
              error: { required: "Xác nhận mật khẩu không được để trống" },
            },
            username: {
              label: "Tên đăng nhập*",
              placeholder: "NHập tên đăng nhập của bạn",
              error: {
                required: "Tên đăng nhập không được để trống",
                reg: "Ký tự liền nhau, không dấu",
              },
            },
            email: {
              label: "Email*",
              placeholder: "Nhập email của bạn",
              error: {
                required: "Email không được để trống",
                email: "Không đúng định dạng email",
              },
            },
            phone: {
              label: "Số điện thoại*",
              placeholder: "Nhập số điện thoại của bạn",
              error: { required: "Số điện thoại không được để trống" },
            },
            introduce_code: {
              label: "Mã giới thiệu*",
              placeholder: "Nhập mã giới thiệu",
              error: { required: "This field is required" },
            },
            country: {
              label: "Quốc gia*",
              placeholder: "Chọn quốc gia",
              error: { required: "Quốc gia không được để trống" },
            },
            purpose: {
              label: "Mục đích sử dụng*",
              placeholder: "Chọn mục đích sử dụng",
              error: { required: "Mục đích sử dụng không được để trống" },
            },
          },
          menu_user: {
            dashboard: "Dashboard",
            recharge: "Nạp tiền",
            pack_of_data: "Gói cước",
            my_order: "Đơn hàng của tôi",
            transaction_history: "Lịch sử giao dịch",
            deposit_history: "Lịch sử nạp",
            collaborators: "Cộng tác viên",
            user_information: "Thông tin người dùng",
          },
        },
      },
    },
  });

export default i18n;
