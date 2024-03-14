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
              label: "Introduce Code",
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
          page: {
            home: {
              home: {
                heading: "VPNCN2 Cheapest Fastest VPN you may know",
                content: {
                  phr1: "Access global services such as Facebook, Google, Youtube, Telegram, Whatsapp, Tiktok ...",
                  phr2: "Fast and secure",
                  phr3: "Warranty whole lifetime, support 7",
                  phr4: "Support payment: Alipay, Wechat, Paypal, USDT",
                  phr5: "Simple configure and connect",
                  phr6: "Dedicated for China, Iran users",
                },
                download: "Download app for all type of devices",
                contact: "Scan to connect us or",
              },
              pricing: {
                title: "Wonderful experience! Surprise costing",
                desc: "Don't wait your time, try our service to enjoy the best connectivity",
                desc2: "Register now to get FREE TRIAL 03 DAYS",
              },
              register: {
                title: "Register",
                desc: "Please fill the form right here to register or contact us via bellow information:",
                phone: "Phone Number",
                email: "E-mail Address",
                web: "Official Website",
                fanpage: "Fanpage",
              },
              about: {
                title: "How to understand VPN?",
                heading1: "What is VPN?",
                heading2: "What VPNCN2 could help you?",
                heading3: "What should you concern when choose VPN provider ?",
                content1_1:
                  "VPN is a kind of service that help you lack or increase your speed connectivity for global websites/App (like Google/Youtube/Twiter/Instagram/Github/Telegram), that you are not able to access with your normal Wifi/Internet",
                content2_1: "",
                content2_2:
                  "Because of China internet doesn’t allow you to go to websites outside of China mainland, You are not able to access Google, Facebook, Youtube ... Our VPNCN2 will help you solve this with premium connectivity. On the other hand, other users want to use VPN for streaming, Gaming, Fake IP ... VPNCN2 also can help you without any restrictions. We also can build a custom package for dedicated users...",
                content3_1:
                  "Your VPN connectivity is dependent from some bellow reasons:",
                content3_1_1:
                  "Your internet speed They are your Data package (4G, 5G ) or Wifi internet",
                content3_1_2:
                  "ou devices (phone, PC, Old or new), some VPN services not compatible with old devices",
                content_3_1_3:
                  "VPN package or your VPN service provider A VPN service provider always has many packages which designed by the customer level, someone may provide you high price but the speed does not make you satisfy. VPNCN2 can give you super-speed access which is considered as a Premium VIP package from other providers. We also have Customer service support 24/7 to support you anytime.",
              },
            },
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
              label: "Mã giới thiệu",
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
          page: {
            home: {
              home: {
                heading: "VPNCN2 cung cấp dịch vụ VPN VIP với chi phí rẻ nhất",
                content: {
                  phr1: "Giúp truy cập đến các ứng dụng bị chặn như Facebook, Google, Youtube, Telegram, Whatsapp, Tiktok ...",
                  phr2: "Tốc độ siêu nhanh, kết nối bảo mật",
                  phr3: "Bảo hành suốt quá trình sử dụng, Hỗ trợ 24/7",
                  phr4: "Hỗ trợ thanh toán Alipay, Wechat, Paypal, USDT",
                  phr5: "Dễ dàng cài đặt và kết nối",
                  phr6: "Chuyên thị trường China, Iran users",
                },
                download: "Tải  phần mềm cho tất cả các loại thiết bị",
                contact: "Quét mã để liên hệ đặt mua hoặc",
              },
              pricing: {
                title: " Trải nghiệm tuyệt vời, chi phí bất ngờ",
                desc: "Đừng lãng phí thời gian quý báu của bạn để chờ đợi. Mở ngay dịch vụ chuyển tiếp mạng toàn cầu và truy cập Internet toàn cầu mọi lúc, mọi nơi.",
                desc2: "Đăng ký ngay để nhận gói FREE TRIAL 03 DAYS",
              },
              register: {
                title: "Liên hệ",
                desc: "Vui lòng liên hệ với chúng tôi qua số điện thoại, email hoặc fanpage dưới đây",
                phone: "Số điện thoại",
                email: "Địa chỉ email",
                web: "Địa chỉ Website",
                fanpage: "Fanpage",
              },
              about: {
                title: "Bạn hiểu gì về VPN?",
                heading1: "VPN là gì",
                heading2: "VPN tại Trung Quốc để làm gì",
                heading3: "Lưu ý gì khi lựa chọn VPN",
                content1_1:
                  "VPN là ứng dụng cho phép bạn tạo một kết nối riêng để tăng tốc truy cập các Website thường được sử dụng ở nước ngoài (Google/Youtube/Twitter/Instgram/Github), mà kết nối đó mạng của bạn bị chặn hoặc tốc độ truy cập hạn chế.",
                content2_1:
                  "Giả dụ bạn ở Trung Quốc, thì do chính sách nhà mạng tạị nội địa, bạn không thể truy cập được các dịch vụ ngoài lãnh thổ Trung Quốc, đặc biệt là các ứng dụng, website nguồn gốc từ US - Chính là Google, Facebook, Instagram, Telegram, Youtube, hoặc Google Play store, những kho ứng dụng của Android ...",
                content2_2:
                  "Vì lý do trên, với người nước ngoài đến hoặc du học sinh tại  Trung Quốc đều phải dùng VPN mới có thể truy cập được các ứng dụng trên.",
                content3_1:
                  "Tốc độ truy cập mạng sau khi kết nối VPN phụ thuộc vào các yếu tố :",
                content3_1_1:
                  "Gói cước mạng (4G, 5G hoặc Gói internet cáp quang của bạn - Nếu là du học sinh sẽ phụ thuộc vào internet của ký túc xá, hoặc trường học, ngoài ra cũng bị ảnh hưởng bởi thiết bị wifi phát cho thiết bị của bạn nữa)",
                content3_1_2:
                  "Gói cước hoặc nhà cung cấp dịch vụ VPN cho bạn Các bên bán VPN sẽ tuỳ vào nhu cầu sử dụng của bạn để chia ra các gói VPN khác nhau, có gói chi phí rẻ nhưng tốc độ bạn truy cập được rất chậm hoặc giới hạn ứng dụng (ví dụ chỉ vô được google nhưng không load được video, hình ảnh ...)",
                content_3_1_3:
                  "Nếu có nhu cầu sử dụng thời gian dài, (như đối với du học sinh thì thời gian sử dụng ít nhất 6 tháng- 1 nắm), thì tốt nhất bạn nên tìm hiểu hoặc dùng thử ít nhất 3 nhà cung cấp để so sánh trước khi đưa ra quyết định.",
              },
            },
          },
        },
      },
      ci: {
        translation: {
          authen: {
            sign_in: "Đăng nhập",
            sign_up: "登记",
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
              label: "Mã giới thiệu",
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
          page: {
            home: {
              home: {
                heading: "VPNCN2 您可能知道的最便宜、最快的 VPN",
                content: {
                  phr1: "能够访问被封锁或限制的软件如：脸书、谷歌、油管、纸飞机、瓦次普、抖音国际版、等等",
                  phr2: "提供更快速、更安全的网络连接",
                  phr3: "软件质保期无限, 24/7客服支持",
                  phr4: "支持多种支付方式：支付宝、微信、贝宝、泰达等等",
                  phr5: "安装及连接操作简单",
                  phr6: "主要针对中国、伊朗市场的用户",
                },
                download: "下载APP",
                contact: "扫我或者",
              },
              pricing: {
                title: "绝佳体验，惊喜价格",
                desc: "不要为了等待而浪费你宝贵的时间。立即打开虚拟专用网络，随时随地访问各地网络资源。",
                desc2: "马上登记为了获得三天免费试用 《FREE TRIAL 03 DAYS》",
              },
              register: {
                title: "Register",
                desc: "Please fill the form right here to register or contact us via bellow information:",
                phone: "Phone Number",
                email: "E-mail Address",
                web: "Official Website",
                fanpage: "Fanpage",
              },
              about: {
                title: "你对VPN有何了解？",
                heading1: "VPN是什么",
                heading2: "VPNCN2 可以帮助您什么？",
                heading3: "选择 VPN 提供商时应注意什么？",
                content1_1:
                  "VPN 是一种服务，可以帮助您缺乏或提高您无法通过普通 Wifi/互联网访问的全球网站/应用程序（例如：Google/Youtube/Twiter/Instagram/Github/Telegram）的速度连接",
                content2_1: "",
                content2_2:
                  "由于中国互联网不允许您访问中国大陆以外的网站，您无法访问 Google、Facebook、Youtube...我们的 VPNCN2 将通过优质连接帮助您解决此问题。另一方面，其他用户想要使用VPN进行流媒体、游戏、假IP……VPNCN2也可以帮助您，没有任何限制。 我们还可以为专门用户构建定制包。",
                content3_1: "您的 VPN 连接取决于以下一些原因：",
                content3_1_1:
                  "您的网速它们是您的数据包（4G、5G）或 Wifi 互联网",
                content3_1_2:
                  "您的设备（手机、PC、旧设备或新设备），某些 VPN 服务与旧设备不兼容",
                content_3_1_3:
                  "VPN 套餐或您的 VPN 服务提供商VPN服务提供商总是有很多客户级别设计的套餐，有人可能会给你很高的价格，但速度并不能让你满意。VPNCN2 可以为您提供超高速访问，这被视为其他提供商的高级 VIP 套餐。 我们还提供 24/7 客户服务支持，随时为您提供支持。",
              },
            },
          },
        },
      },
    },
  });

export default i18n;
