import i18n, { init } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n.use(LanguageDetector).use(initReactI18next),
  init({
    debug: true,
    fallbackLng: "en",
    lng: "en",
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
              error: {
                required: "This field is required",
                min: "Minimum of 8 characters",
              },
            },
            old_password: {
              label: "Old Password*",
              placeholder: "Enter your Old Password",
              error: {
                required: "This field is required",
                min: "Minimum of 8 characters",
              },
            },
            new_password: {
              label: "New Password*",
              placeholder: "Enter your New Password",
              error: {
                required: "This field is required",
                min: "Minimum of 8 characters",
              },
            },
            re_new_password: {
              label: "Re-Type New Password*",
              placeholder: "Enter Re-Type New Password",
              error: {
                required: "This field is required",
                min: "Minimum of 8 characters",
                match: "Confirm new password does not match",
              },
            },
            re_password: {
              label: "Re-Type Password*",
              placeholder: "Enter Re-Type Password",
              error: {
                required: "This field is required",
                min: "Minimum of 8 characters",
              },
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
              label: "Where are you from?*",
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
            // recharge: "Package",
            pack_of_data: "Package",
            my_order: "My Orders",
            transaction_history: "Transaction history",
            deposit_history: "Payment",
            collaborators: "Agency",
            user_information: "User information",
          },
          page: {
            searchPlaceholder: "Search",
            home: {
              home: {
                heading: "Cheapest Fastest VPN you may know",
                content: {
                  phr1: "Access global services such as Facebook, Google, Youtube, Telegram, Whatsapp, Tiktok ...",
                  phr2: "Fast and secure",
                  phr3: "Warranty whole lifetime, support 24/7",
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
                seemore: "See more",
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
              ctv: {
                heading: "Looking for AGENCY with excited commision",
                content1:
                  "Get {{amount}}% commission for order from invitation code",
                content2: "Commission for AGENCY upto {{amount}}%",
                content3: "No control Agency’s price or margin up",
              },
            },
            dashboard: {
              seeAll: "See All",
              buyNow: "Buy Now",
              ctvcode: {
                ctv: "Mã CTV:",
                desc: "Share your Introduction Code to your friends and get [{{amount}}]% comimission from their orders",
              },
              satify: {
                cash: "Total Payment",
                currentMoney: "Remaining",
                transaction: "Bought",
                rose: "Tips",
                numberIntoduce: "Invited",
                currentMoneyNode:
                  "Current balance = Total deposit - Used amount + Commission",
                roseNode:
                  "Commission = Total amount [{amount}%] received from the Collaboration program",
                depositNow: "Deposit Now",
              },
              userManual: {
                userManual: "User manual",
                heading: "Please carefully read our Service Policy:",
                title1:
                  "Each key will be unlimited number of devices but will have a limited total bandwidth of 30 days trailing. This limitation ensures you don’t share the key with other people.",
                title2:
                  "Please download Outline Client APP which is available for all platform devices from the link below.",
                title3:
                  "You can connect multiple devices at the same time, But if over limited bandwidth, please buy more data from “My orders” menu",
                title4: "Your data limit will be trailed 30 days.",
                title5:
                  "Please join ”VPNCN2 support team” to get instant updates from our team.",
                note: "If you are in China and cannot download it on the app store, you can use the download link below.",
                contact1: "Any concerns please contact admin:",
                contact2: "VPNCN2 Support Team:",
              },
              plan: {
                heading: "Package",
                field: {
                  name: "Package name",
                  type: "Usage cycle",
                  bandwidth: "Bandwidth",
                  price: "Price",
                },
              },
              invite: {
                heading: "Friends are introduced",
                field: {
                  name: "Package Name",
                  rose: "Commission Percentage",
                  rosePrice: "Commission",
                  introducedId: "Buyer",
                  sdt: "Phone",
                  receivedDate: "Received Date",
                },
              },
              depositHistory: {
                heading: "Deposit history",
                content: "You deposited {{price}} on",
                content_refuse:
                  "You were denied deposit {{prive}} with reason {{reason}} on",
              },
              roseHistory: {
                heading: "History of receiving commissions",
                content:
                  "You receive {{price}}({{discount}}%) commission from {{user}} when purchasing {{package}} package on",
              },
            },
            package: {
              buyNow: "Buy Now",
              swal: {
                title: "Do you want to buy a package",
                confirmButton: "Agree",
                cancelButton: "Exit",
                success: "Successful purchase",
                warn: "Deposit additional money to use the service",
              },
            },
            myOrder: {
              instruct1:
                "Please get the key below and Paste it into Outline software following",
              instruct2: "Click to get the key (Main)",
              instruct3:
                "Click to get Alternated key (Only use when Admin advises)",
              field: {
                code: "Trading code",
                package: "Package",
                day: "Used Time",
                useage: "Usage",
                dataLimit: "Data limit",
                dateExpand: "eDate Expand",
                key: "Key",
                status: "Status",
                extension: "Extension",
                buyData: "Buy Data",
                extend: "Extend",
                statusLabel: {
                  active: "Active",
                  inactive: "Expired",
                },
              },
              swal: {
                extend: {
                  title: "Do you want to renew your package",
                  success: "Package renewal successful",
                  error: "Deposit more money to use the service",
                  cancelButton: "Exit",
                  confirmButton: "Yes, renew now",
                },
                buyData: {
                  title: "Do you want to buy more data",
                  success: "successful purchase of additional data",
                  error: "Deposit more money to use the service",
                  cancelButton: "Exit",
                  confirmButton: "Yes, buy now",
                  buyNow: "Buy Now",
                  title2: "List of extended packages",
                  month: "1 Month",
                  months: "{{month}} months remaining",
                  cancelModal: "Exit",
                },
              },
            },
            transaction: {
              heading: "Transaction history",
              total: "Total purchase",
              field: {
                code: "Trading Code",
                package: "Package Name",
                pricePackage: "Package Price",
                discount: "Discount",
                disCountPrice: "Payment price",
                createdAt: "Created at",
              },
            },
            account: {
              applyBtn: "Apply",
              info: {
                level: "Normal User",
                leveln: "Agent level {{level}}",
                heading: "Account information",
                field: {
                  code: "Introduction Code:",
                  email: "Email:",
                  username: "Username:",
                  level: "User type:",
                  note: "To be upgraded to become an agent, please contact the admin directly",
                },
                success: "Editing success",
                tooltip:
                  "User/Contributor: Receive {{commision}}% commission for each referral's order || Level 1 Affiliate: [{{level1}}%] discount for each new order || Agent Level 2: Discount [{{level2}}%] for each new order || Agent Level 3: Discount [{{level3}}%] for each new order || To be upgraded to work Agents please contact admin directly",
              },
              change_pass: {
                heading: "Change Password",
                success: "Password change successful, please log in again",
              },
            },
            collaborator: {
              satify: {
                level: "Level",
                invite: "Invited",
                rose_percent: "Commission Percentage",
                rose: "Commission",
              },
              note: {
                content1:
                  "User/Contributor: Receive [{{amount}}%] commission for each referral's order.",
                content2:
                  "Level 1 Agent: Discount [{{amount}}%] for each new order. Requirement: You need to buy at least 02 monthly packages as {{money}}.",
                content3:
                  "Level 2 Agent: Discount [{{amount}}%] for each new order. Last month's bought amount reached at least {{money}}, The discount will be valid for next month.",
                content4:
                  "Level 3 Agent: Discount [{{amount}}%] for each new order. Last month's bought amount reached at least {{money}}, The discount will be valid for next month",
                note: "To be upgraded to become an agent, please contact admin directly.",
              },
              heading: "History of receiving commissions",
              field: {
                package: "Package name",
                rose_percent: "% commission",
                rose: "Commission",
                user: "Buyer",
                email: "Email",
                sdt: "Phone Number",
                created_at: "Received date",
              },
            },
            cash: {
              payment: {
                auto: {
                  title: " VNbanking automatic top-up",
                  desc: 'Please transfer the correct amount you want to deposit and the "Transfer content" provided. The system will automatically update after 5-10 seconds after confirming successful payment. If there are any problem, please contact admin.',
                  form: {
                    placeholder: "Enter the amount to deposit",
                    button: "Submit",
                    warn: "You have not entered the amount to deposit",
                  },
                  stk: "Account number:",
                  bank_name: "Account holder:",
                  money: "Amount:",
                  content: "Transfer content",
                  note: "Note: Please enter the correct transfer content.",
                  error:
                    "The system has not yet verified that you have transferred money. If you have transferred money but it has not been successful, please contact Admin for assistance.",
                  success: "Transaction successful.",
                },
                manual: {
                  title: "Manual deposit",
                  desc: "Payment approval may take 10-30 minutes. Please follow this below procedure:",
                  step1:
                    "1. Please transfer money to us via the following method:",
                  step2:
                    "2. Fill a deposit amount and “Submit” payment request.",
                  step3:
                    "3. Screenshot your Invoice and send it to Admin Contact to get approval as soon as possible..",
                  note: "*Other payment methods like Zalopay, Momo, Paypal, USDT… Please consider directly contacting Admin.",
                  form: {
                    placeholder: "Enter the amount to deposit",
                    button: "Request deposit",
                  },
                  ques: "Do you want to deposit ",
                  cancelButton: "Cancel",
                  confirmButton: "OK",
                  success:
                    "You have just successfully requested a deposit. Please send a photo of the receipt to admin via wechat/zalo for approval.",
                },
              },
              history: {
                heading: "Load history:",
                field: {
                  code: "Transaction code",
                  username: "Username",
                  email: "Email",
                  phone: "Phone number",
                  money: "Deposit amount",
                  created_at: "Load date",
                  updated_at: "Approved date",
                  status: "Status",
                  description: "Reason for cancellation",
                  transactionType: "Transaction Type",
                  content: "Content",
                },
                status: {
                  pending: "Waiting for approval",
                  approve: "Paid",
                  reject: "canceled",
                },
              },
            },
          },
          packModal: {
            date: "Valid date ({{bandWidth}} GB/{{day}} days):",
            keyName: "Key Name",
            heading: "{{planName}} has been bought successful",
            click: "to copy your key và paste it into OUTLINE app",
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
              error: {
                required: "Mật khẩu không được bỏ trống",
                min: "Minimum of 8 characters",
              },
            },
            re_password: {
              label: "Xác nhận mật khẩu*",
              placeholder: "Xác nhận mật khẩu của bạn",
              error: {
                required: "Xác nhận mật khẩu không được để trống",
                min: "Mật khẩu ít nhất 8 ký tự",
              },
            },
            old_password: {
              label: "Mật khẩu*",
              placeholder: "Vui lòng nhập mật khẩu cũ",
              error: {
                required: "Không được để trống",
                min: "Mật khẩu ít nhất 8 ký tự",
              },
            },
            new_password: {
              label: "Mật Khẩu Mới*",
              placeholder: "Vui lòng nhập mật khẩu mới",
              error: {
                required: "Không được để trống",
                min: "Mật khẩu ít nhất 8 ký tự",
              },
            },
            re_new_password: {
              label: "Mật Khẩu Mới*",
              placeholder: "Vui lòng xác nhận mật khẩu mới",
              error: {
                required: "Khẩu không được để trống",
                min: "Mật khẩu ít nhất 8 ký tự",
                match: "Xác nhận mật khẩu mới không khớp",
              },
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
              label: "Bạn đến từ đâu ?*",
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
            deposit_history: "Nạp tiền",
            collaborators: "Cộng tác viên",
            user_information: "Thông tin người dùng",
          },
          page: {
            searchPlaceholder: "Tìm kiếm",
            home: {
              home: {
                heading: "cung cấp dịch vụ VPN VIP với chi phí rẻ nhất",
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
                seemore: "Xem thêm",
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
              ctv: {
                heading: "Tuyển CTV và đại lý với  chính sách hấp dẫn",
                content1:
                  "Nhận ngay {{amount}}% cho các đơn hàng giới thiệu qua mã CTV",
                content2: "Đại lý chiết khấu lên tới {{amount}}%",
                content3: "Không giới hạn mức giá bán ra từ đại lý",
              },
            },
            dashboard: {
              seeAll: "Xem tất cả",
              buyNow: "Mua ngay",
              ctvcode: {
                ctv: "Mã CTV:",
                desc: "Giới thiệu mã CTV này cho bạn bè bạn sẽ nhận được [{{amount}}%] hoa hồng cho mỗi giao dịch.",
              },
              satify: {
                cash: "Tổng nạp",
                currentMoney: "Số dư hiện tại",
                transaction: "Số tiền đã sử dụng",
                rose: "Tiền hoa hồng",
                numberIntoduce: "Đã mời",
                currentMoneyNode:
                  "Số dư hiện tại = Tổng nạp - Số tiền đã sử dụng + Hoa hồng",
                roseNode:
                  "Hoa hồng = Tổng tiền [10%] nhận được từ chương trình CTV",
                depositNow: "Nạp tiền ngay",
              },
              userManual: {
                userManual: "Hướng dẫn sử dụng",
                heading:
                  "Trước khi bắt đầu sử dụng dịch vụ của VPNCN2, vui lòng đọc kỹ nội dung quy định sử dụng của chúng tôi.",
                title1:
                  "Mỗi key được cấp không giới hạn số lượng thiết bị kết nối nhưng sẽ bị giới hạn tổng băng thông sử dụng theo gói cước tương ứng. Việc giới hạn này với mục đích hạn chế bạn chia sẻ key sử dụng cho người khác.",
                title2:
                  'Tải phần mềm kết nối VPN là "OUTLINE" có trên tất cả các loại thiết bị (điện thoại, máy tính, máy tính bảng) và hệ điều hành (Windows, MAC, Chromebook, iOS iphone, Android). Vui lòng sử dụng link tải bên dưới.',
                title3:
                  "Bạn có thể kết nối VPN nhiều thiết bị cùng 1 lúc, Nhưng khuyến cáo KHÔNG ĐƯỢC chia sẻ cho người khác cùng sử dụng, nếu vượt quá băng thông sẽ không truy cập được tiếp mà sẽ phải mua thêm băng thông tại mục Đơn hàng của tôi > Chọn Key của bạn > Mua data",
                title4:
                  "Băng thông của bạn được giới hạn xoay vòng 30 ngày tính từ ngày mua key. Băng thông mở rộng được tính trong vòng 30 ngày trong điều kiện gói cước của bạn vẫn còn hạn.",
                title5:
                  "Để sử dụng lâu dài vui lòng tham gia nhóm wexin “VPNCN2 Support” và nhận thông báo mới nhất từ ban quản trị.",
                note: "Nếu bạn đang ở China và không tải được trên kho ứng dụng, thì có thể dùng link download dưới đây.",
                contact1:
                  "Mọi thắc mắc hoặc sự cố xin vui lòng liên hệ trực tiếp với admin",
                contact2: "Nhóm VPNCN2 Support",
              },
              plan: {
                heading: "Gói cước",
                field: {
                  name: "Tên gói",
                  type: "Chu kỳ",
                  bandwidth: "Băng thông",
                  price: "Giá",
                },
              },
              invite: {
                heading: "Bạn bè được giới thiệu",
                field: {
                  name: "Tên gói",
                  rose: "% Hóa hồng",
                  rosePrice: "Tiền hoa hồng",
                  introducedId: "Người mua",
                  sdt: "Số điện thoại",
                  receivedDate: "Ngày nhận",
                },
              },
              depositHistory: {
                heading: "Lịch sử nạp",
                content: "Bạn đã nạp {{price}} vào ngày",
                content_refuse:
                  "Bạn bị từ chối nạp {{prive}} với lý do {{reason}} vào ngày",
              },
              roseHistory: {
                heading: "Lịch sử nhận hoa hồng",
                content:
                  "Bạn nhận được {{price}}({{discount}}%) tiền hoa hồng từ {{user}} khi mua gói {{package}} vào ngày",
              },
            },
            package: {
              buyNow: "Đăng ký mua",
              swal: {
                title: "Bạn có muốn mua gói cước ",
                confirmButton: "Đồng ý",
                cancelButton: "Thoát",
                success: "Mua thành công",
                warn: "Nạp thêm tiền để sử dụng dịch vụ",
              },
            },
            myOrder: {
              instruct1:
                "Vui lòng lấy key bên dưới của bạn và dán vào phần mềm theo hướng dẫn",
              instruct2: "Nhấn để copy Link kết nối chính",
              instruct3:
                "Nhấn để copy Link kết nối dự phòng(Chỉ dùng trong trường hợp admin khuyến cáo)",
              field: {
                code: "Mã GD",
                package: "Tên gói",
                day: "Thời gian",
                useage: "Usage",
                dataLimit: "Data limit",
                dateExpand: "eDate Expand",
                key: "Key",
                status: "Trạng thái",
                extension: "Đặt tên key",
                buyData: "Mua Data",
                extend: "Gia hạn",
                statusLabel: {
                  active: "Còn hạn",
                  inactive: "Hết hạn",
                },
              },
              swal: {
                extend: {
                  title: "Bạn có muốn gia hạn gói",
                  success: "Gia hạn gói thành công",
                  error: "Nạp thêm tiền để sử dụng dịch vụ",
                  cancelButton: "Thoát",
                  confirmButton: "Có, gia hạn ngay",
                },
                buyData: {
                  title: "Bạn có muốn mua thêm data",
                  success: "Mua thêm data thành công",
                  error: "Nạp thêm tiền để sử dụng dịch vụ",
                  cancelButton: "Thoát",
                  confirmButton: "Có, mua ngay",
                  buyNow: "Mua ngay",
                  title2: "Danh sách gói cước mở rộng",
                  month: "1 Tháng",
                  months: "{{month}} tháng còn lại",
                  cancelModal: "Thoát",
                },
              },
            },
            transaction: {
              heading: "Lịch sử mua",
              total: "Tổng mua",
              field: {
                code: "Mã giao dịch",
                package: "Tên gói",
                pricePackage: "Giá gói",
                discount: "Chiết khấu",
                disCountPrice: "Giá mua",
                createdAt: "Ngày tạo",
              },
            },
            account: {
              applyBtn: "Lưu",
              info: {
                level: "Cộng tác viên",
                leveln: "Đại lý cấp {{level}}",
                heading: "Thông Tin Tài Khoản",
                field: {
                  code: "Mã CTV:",
                  email: "Email:",
                  username: "Tên đăng nhập:",
                  level: "Loại người dùng:",
                  note: "Để được nâng cấp lên làm đại lý vui lòng liên hệ trực tiếp admin",
                },
                success: "Chỉnh sửa thành công",
                tooltip:
                  "User/CTV: Nhận được {{commision}}% hoa hồng cho mỗi đơn hàng của người được giới thiệu || Đại lý Cấp 1: Chiết khấu [{{level1}}%] cho mỗi đơn hàng mới || Đại lý Cấp 2: Chiết khấu [{{level2}}%] cho mỗi đơn hàng mới || Đại lý Cấp 3: Chiết khấu [{{level3}}%] cho mỗi đơn hàng mới || Để được nâng cấp lên làm đại lý vui lòng lien hệ trực tiếp admin",
              },
              change_pass: {
                heading: "Đổi Mật Khẩu",
                success: "Đổi mật khẩu thành công vui lòng đăng nhập lại",
              },
            },
            collaborator: {
              satify: {
                level: "Cấp độ",
                invite: "Đã mời",
                rose_percent: "% Hóa hồng",
                rose: "Tiền hoa hồng",
              },
              note: {
                content1:
                  "User/CTV: Nhận được [{{amount}}%] hoa hồng cho mỗi đơn hàng của người được giới thiệu.",
                content2:
                  "Đại lý Cấp 1: Chiết khấu [{{amount}}%] cho mỗi đơn hàng mới. Điều kiện: đã mua ít nhất 02 gói tháng trở lên, tương ứng {{money}}",
                content3:
                  "Đại lý Cấp 2: Chiết khấu [{{amount}}%] cho mỗi đơn hàng mới. Điều kiện: Doanh số tháng trước đạt ít nhất {{money}}, Áp dụng trong vòng 1 tháng tiếp theo",
                content4:
                  "Đại lý Cấp 3: Chiết khấu [{{amount}}%] cho mỗi đơn hàng mới. Điều kiện: Doanh số tháng trước đạt ít nhất {{money}}, Áp dụng trong vòng 1 tháng tiếp theo",
                note: "Để được nâng cấp lên làm đại lý vui lòng lien hệ trực tiếp admin.",
              },
              heading: "Lịch sử nhận hoa hồng",
              field: {
                package: "Tên gói",
                rose_percent: "% hoa hồng",
                rose: "Tiền hoa hồng",
                user: "Người mua",
                email: "Email",
                sdt: "SDT",
                created_at: "Ngày nhận",
              },
            },
            cash: {
              payment: {
                auto: {
                  title: " Nạp tiền tự động VNbanking",
                  desc: 'Vui lòng chuyển đúng số tiền bạn muốn nạp và "Nội dung chuyển khoản" được cung cấp. Hệ thống sẽ tự động cập nhật sau 5-10s sau khi xác nhận thanh toán thành công. Nếu có sai sót vui lòng liên hệ admin.',
                  form: {
                    placeholder: "Nhập số tiền cần nạp",
                    button: "Nạp tiền",
                    warn: "Bạn chưa nhập số tiền cần nạp",
                  },
                  stk: "Số tài khoản:",
                  bank_name: "Chủ tài khoản:",
                  money: "Số tiền:",
                  content: "Nội dung chuyển khoản",
                  note: "Lưu ý: Quý khách vui lòng nhập đúng nội dung chuyển khoản.",
                  error:
                    "Hệ thống chưa kiểm tra ra bạn đã chuyển khoản, nếu bạn đã chuyển khoản nhưng chưa thành công vui lòng liên hệ với Admin để được hỗ trọ.",
                  success: "Giao dịch thành công.",
                },
                manual: {
                  title: "Nạp tiền thủ công",
                  desc: "Thời gian phê duyệt thanh toán có thể mất từ 10-30 phút. Vui lòng thao tác theo quy trình sau:",
                  step1:
                    "1. Vui lòng chuyển khoản cho chúng tôi qua các hình thức sau:",
                  step2: '2. Gửi yêu cầu nạp tiền và nhấn "Nạp tiền".',
                  step3:
                    "3. Chụp ảnh màn hình chuyển khoản và thông báo cho Admin để nhận đượcphê duỵệt nhanh nhất.",
                  note: "*Các hình thức chuyển tiền khác ZaloPay, Momo, Paypal, USDT ... vui lòng liên hệ trực tiếp với admin",
                  form: {
                    placeholder: "Nhập số tiền cần nạp",
                    button: "Yêu cầu nạp tiền",
                  },
                  ques: "Bạn có muốn nạp ",
                  cancelButton: "Hủy",
                  confirmButton: "Đồng ý",
                  success:
                    "Bạn vừa yêu cầu nạp tiền thành công. Vui lòng gửi ảnh hóa đơn cho admin qua wechat/zalo để được phê duyệt.",
                },
              },
              history: {
                heading: "Lịch sử nạp:",
                field: {
                  code: "Mã giao dịch",
                  username: "Username",
                  email: "Email",
                  phone: "Số điện thoại",
                  money: "Số tiền nạp",
                  created_at: "Ngày nạp",
                  updated_at: "Ngày duyệt",
                  status: "Trạng thái",
                  description: "Lý do hủy",
                  transactionType: "Loại giao dịch",
                  content: "Nội dung chuyển khoản",
                },
                status: {
                  pending: "Chờ phê duyệt",
                  approve: "Đã thanh toán",
                  reject: "bị hủy",
                },
              },
            },
          },
          packModal: {
            date: "Thời gian hiệu lực ({{bandWidth}} GB/{{day}} ngày):",
            keyName: "Tên key",
            heading: "Bạn vừa mua gói {{planName}}",
            click: "để copy key và dán vào OUTLINE",
          },
        },
      },
      ci: {
        translation: {
          authen: {
            sign_in: "登录",
            sign_up: "登记",
            sign_out: "登出",
          },
          header: {
            home: "主页",
            pricing: "价格表",
          },
          login: {
            welcome_back: "欢迎你回来!",
            dont_have_account: "还没有账号名?",
            have_account: "已有账号名?",
            forgot_pass: "忘记登录密码？",
          },
          form: {
            account: {
              label: "账号名或电子邮件*",
              placeholder: "输入您的账号名或电子邮件",
              error: { required: "不能空填" },
            },
            password: {
              label: "密码*",
              placeholder: "请输入密码",
              error: {
                required: "密码不能空填",
                min: "密码需要最少输入8个字",
              },
            },
            re_password: {
              label: "再输入密码*",
              placeholder: "再输入密码",
              error: {
                required: "再输入密码不能空填",
                min: "密码需要最少输入8个字",
              },
            },
            old_password: {
              label: "老密码*",
              placeholder: "请输入老密码",
              error: {
                required: "不能空填",
                min: "密码需要最少输入8个字",
              },
            },
            new_password: {
              label: "新的密码",
              placeholder: "请输入新的密码",
              error: {
                required: "不能空填",
                min: "密码需要最少输入8个字",
              },
            },
            re_new_password: {
              label: "新的密码*",
              placeholder: "再输入密码",
              error: {
                required: "密码不能空填",
                min: "密码需要最少输入8个字",
                match: "新密码不同一的",
              },
            },
            username: {
              label: "账号名*",
              placeholder: "请输入您的账号名",
              error: {
                required: "账号名不能空填",
                reg: "账号名不按照要求",
              },
            },
            email: {
              label: "电子邮件*",
              placeholder: "请输入您的电子邮件",
              error: {
                required: "电子邮件不能空填",
                email: "Không đúng định dạng email",
              },
            },
            phone: {
              label: "电话号码*",
              placeholder: "请输入电话号码",
              error: { required: "电话号码不能空" },
            },
            introduce_code: {
              label: "介绍代码",
              placeholder: "请输入介绍代码",
              error: { required: "介绍代码不对" },
            },
            country: {
              label: "你是哪国人*",
              placeholder: "选你的国家",
              error: { required: "还没选国家" },
            },
            purpose: {
              label: "你的VPN的目的*",
              placeholder: "选你的目的",
              error: { required: "目的还没选" },
            },
          },
          menu_user: {
            dashboard: "首页",
            recharge: "付款",
            pack_of_data: "包裹",
            my_order: "我的单",
            transaction_history: "买的历史",
            deposit_history: "付款",
            collaborators: "合作者",
            user_information: "用户信息",
          },
          page: {
            searchPlaceholder: "搜索",
            home: {
              home: {
                heading: "您可能知道的最便宜、最快的 翻墙访问外网",
                content: {
                  phr1: "能够访问被封锁或限制的软件如: Facebook, Google, Youtube, Telegram, Whatsapp, Tiktok ...",
                  phr2: "提供更快速、更安全的网络连接",
                  phr3: "软件质保期无限，24/7客服支持",
                  phr4: "支持多种支付方式：支付宝、微信、Paypal, USDT",
                  phr5: "安装及连接操作简单",
                  phr6: "主要针对中国、伊朗市场的用户",
                },
                download: "下载APP",
                contact: "扫我或者",
              },
              pricing: {
                title: " 绝佳体验，惊喜价格",
                desc: "不要为了等待而浪费你宝贵的时间。立即打开虚拟专用网络，随时随地访问各地网络资源.",
                desc2: "马上登记为了获得三天免费试用 《FREE TRIAL 03 DAYS》",
                seemore: "其他",
              },
              register: {
                title: "联系方式",
                desc: "请给我们联系通过下一些方式：",
                phone: "电话号码",
                email: "电子邮件",
                web: "网址",
                fanpage: "粉丝专页",
              },
              about: {
                title: "你对VPN有何了解?",
                heading1: "VPN是什么？",
                heading2: "VPNCN2 可以帮助您什么？",
                heading3: "选择 VPN 提供商时应注意什么？",
                content1_1:
                  "VPN 是一种服务，可以帮助您缺乏或提高您无法通过普通 Wifi/互联网访问的全球网站/应用程序（例如：Google/Youtube/Twiter/Instagram/Github/Telegram）的速度连接",
                content2_1:
                  "由于中国互联网不允许您访问中国大陆以外的网站，您无法访问 Google、Facebook、Youtube...我们的 VPNCN2 将通过优质连接帮助您解决此问题。",
                content2_2:
                  "另一方面，其他用户想要使用VPN进行流媒体、游戏、假IP……VPNCN2也可以帮助您，没有任何限制。 我们还可以为专门用户构建定制包。",
                content3_1: "您的 VPN 连接取决于以下一些原因：",
                content3_1_1:
                  "您的网速。它们是您的数据包（4G、5G）或 Wifi 互联网",
                content3_1_2:
                  "您的设备（手机、PC、旧设备或新设备），某些 VPN 服务与旧设备不兼容",
                content_3_1_3:
                  "VPN 套餐或您的 VPN 服务提供商.VPN服务提供商总是有很多客户级别设计的套餐，有人可能会给你很高的价格，但速度并不能让你满意。VPNCN2 可以为您提供超高速访问，这被视为其他提供商的高级 VIP 套餐。 我们还提供 24/7 客户服务支持，随时为您提供支持。",
              },
              ctv: {
                heading: "合作者招聘及福利政策",
                content1: "通过合作者介绍码每订单可收 {{amount}}% 提成",
                content2: "代理折扣 {{amount}}%",
                content3: "不限定代理销售的价位",
              },
            },
            dashboard: {
              seeAll: "一切",
              buyNow: "买它",
              ctvcode: {
                ctv: "介绍代码:",
                desc: "与您的朋友分享您的介绍代码，并从他们的订单中获得 [{{amount}}%] 的佣金.",
              },
              satify: {
                cash: "付款总额",
                currentMoney: "其余的",
                transaction: "已买",
                rose: "%得到",
                numberIntoduce: "已请",
                currentMoneyNode: "其余的 = 付款总额 - 已买 + 得到",
                roseNode: "得到 = 总共 [{{amount}}%] 收到从介绍代码",
                depositNow: "付款",
              },
              userManual: {
                userManual: "用户手册",
                heading: "请仔细阅读我们的服务政策：",
                title1:
                  "每个密钥的设备数量不受限制，但跟踪总带宽有限。 此限制可确保您不会与其他人共享密钥。",
                title2:
                  "请从以下链接下载适用于所有平台设备的Outline Client APP",
                title3:
                  "您可以同时连接多个设备，但如果超出带宽限制，请从“我的单”菜单购买更多数据。",
                title4: "您的数据限制将被跟踪 30 天。",
                title5: "请加入“VPNCN2 support team”以获取我们团队的即时更新。",
                note: "直接下载线 （如果你在用中国网络）：",
                contact1: "如有任何疑问，请联系管理员：:",
                contact2: "VPNCN2 支持的微信群:",
              },
              plan: {
                heading: "包裹",
                field: {
                  name: "包裹名",
                  type: "时期",
                  bandwidth: "流量",
                  price: "价格",
                },
              },
              invite: {
                heading: "已介绍的朋友",
                field: {
                  name: "包裹名",
                  rose: "% 佣金",
                  rosePrice: "佣金数",
                  introducedId: "买家",
                  sdt: "电话",
                  receivedDate: "时间",
                },
              },
              depositHistory: {
                heading: "付款的历史",
                content: "您刚付了 {{price}} 在 ",
                content_refuse: "你被拒绝 {{prive}} 为了 {{reason}}原因 在",
              },
              roseHistory: {
                heading: "佣金的历史",
                content:
                  "你收到 {{price}}({{discount}}%) 的佣金 从 {{user}} 买了 {{package}} 在",
              },
            },
            package: {
              buyNow: "买它",
              swal: {
                title: "您要买 ",
                confirmButton: "确定",
                cancelButton: "取消",
                success: "订单成功",
                warn: "你的钱不够，清付款",
              },
            },
            myOrder: {
              instruct1: "请获取下面的密钥并按照说明将其粘贴到 Outline 软件中",
              instruct2: "点击获取密钥（主要）",
              instruct3: "单击获取备用密钥（仅在管理员建议时使用）",
              field: {
                code: "单号",
                package: "包裹名",
                day: "时间",
                useage: "已用",
                dataLimit: "限制",
                dateExpand: "加时间",
                key: "Key 钥匙",
                status: "状态",
                extension: "改名",
                buyData: "加流量",
                extend: "延长",
                statusLabel: {
                  active: "有效",
                  inactive: "已过期",
                },
              },
              swal: {
                extend: {
                  title: "您要延长 ？",
                  success: "延长成功",
                  error: "你的钱不够，清付款",
                  cancelButton: "取消",
                  confirmButton: "好, 决定",
                },
                buyData: {
                  title: "你要加流量？",
                  success: "加流量成功",
                  error: "你的钱不够，清付款",
                  cancelButton: "取消",
                  confirmButton: "好, 买它",
                  buyNow: "买它",
                  title2: "增加流量的列表",
                  month: "1 个月",
                  months: "剩下 {{month}} 个月",
                  cancelModal: "取消",
                },
              },
            },
            transaction: {
              heading: "买的历史",
              total: "买总",
              field: {
                code: "单号",
                package: "包裹名",
                pricePackage: "价格",
                discount: "打折",
                disCountPrice: "买的",
                createdAt: "时间",
              },
            },
            account: {
              applyBtn: "确定",
              info: {
                level: "合作者",
                leveln: "代理 {{level}}",
                heading: "用户信息",
                field: {
                  code: "介绍代码:",
                  email: "电子邮件:",
                  username: "账号名:",
                  level: "用户等级:",
                  note: "如果您想成为我们的代理机构，请联系管理员",
                },
                success: "改变成功",
                tooltip:
                  "合作者: 每受邀者订单获得 {{commision}}%  || 代理1：每笔订单折扣 [{{level1}}%] || 代理2：每笔订单折扣 [{{level2}}%] || 代理3：每笔订单折扣 [{{level3}}%] ",
              },
              change_pass: {
                heading: "换密码",
                success: "换密码成功， 请再登入",
              },
            },
            collaborator: {
              satify: {
                level: "等级",
                invite: "已请",
                rose_percent: "% 佣金",
                rose: "佣金数",
              },
              note: {
                content1: "合作者: 每受邀者订单获得[{{amount}}%] .",
                content2:
                  "代理1：每笔订单折扣 [{{amount}}%]. 要求：要买了最少02每月包裹 [{{money}}]",
                content3:
                  "代理2：每笔订单折扣 [{{amount}}%]. 要求：上个月购买金额至少达到  [{{money}}], 折扣有效期为下个月",
                content4:
                  "代理3：每笔订单折扣 [{{amount}}%] .要求：上个月购买金额至少达到  [{{money}}], 折扣有效期为下个月",
                note: "如果您想成为我们的代理机构，请联系管理员.",
              },
              heading: "佣金的历史",
              field: {
                package: "包裹名",
                rose_percent: "% 佣金",
                rose: "佣金数",
                user: "买家",
                email: "电子邮件",
                sdt: "电话",
                created_at: "时间",
              },
            },
            cash: {
              payment: {
                auto: {
                  title: " 自动付款 VIETNAM BANKING",
                  desc: "请正确转账您要存入的金额以及提供的“支付内容”。 确认支付成功后，系统将在5-10秒后自动更新。 如有错误，请联系管理员。",
                  form: {
                    placeholder: "填入付款的数量",
                    button: "付款",
                    warn: "付款的数量还没填",
                  },
                  stk: "贷款号码:",
                  bank_name: "贷款的主人:",
                  money: "数量:",
                  content: "付款的内容",
                  note: "注意: 请准确填付款的内容.",
                  error:
                    "系统尚未检查您是否已转账，如果您已转账但未成功，请联系管理员寻求支持.",
                  success: "交易成功.请检查你的贷款",
                },
                manual: {
                  title: "手动付款",
                  desc: "付款批准可能需要 10-30 分钟。 请按照以下步骤操作:",
                  step1: "1. 通过以下方法之一向我们付款:",
                  step2: "2. 提交付款请求.",
                  step3:
                    "3. 截取您的发票并将其发送给管理员联系人以尽快获得批准。",
                  note: "*其他付款方式，如 Zalopay、Momo、Paypal、USDT…请考虑直接联系管理员。",
                  form: {
                    placeholder: "输入您的付款金额",
                    button: "提交",
                  },
                  ques: "您要付 ",
                  cancelButton: "取消",
                  confirmButton: "确定",
                  success:
                    "您刚刚成功申请存款。 请将发票照片通过微信/zalo发送给管理员审批。",
                },
              },
              history: {
                heading: "付款历史:",
                field: {
                  code: "交易吗",
                  username: "用户",
                  email: "电子邮件",
                  phone: "电话",
                  money: "付款数",
                  created_at: "付时",
                  updated_at: "批准时",
                  status: "状态",
                  description: "原因",
                  transactionType: "交易类型",
                  content: "支付内容",
                },
                status: {
                  pending: "等批准",
                  approve: "已付",
                  reject: "已取消",
                },
              },
            },
          },
          packModal: {
            date: "有效日期 ({{bandWidth}} GB/{{day}} 天):",
            keyName: "密钥名",
            heading: "刚买好{{planName}}包",
            click: "复制您的密钥然后粘贴到 OUTLINE app",
          },
        },
      },
    },
  });

export default i18n;
