import Heading from "../../components/common/Heading";
import { useToogleValue } from "../../hooks/useToogleValue";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import IconEyeToogle from "../../icons/IconEyeToogle";
import Button from "../../components/button/Button";
import { RootState } from "../../store/configureStore";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
import { copyToClipboard } from "../../utils/copyToClipboard";

const schema = yup
  .object({
    password: yup
      .string()
      .required("This field is required")
      .min(8, "Minimum of 8 characters"),
    newPassword: yup
      .string()
      .required("This field is required")
      .min(8, "Minimum of 8 characters"),
    reNewPassword: yup
      .string()
      .required("This field is required")
      .min(8, "Minimum of 8 characters"),
  })
  .required();
const AccountPage = () => {
  const { _id, email, level, phone } = useSelector(
    (state: RootState) => state.auth
  );
  const { value: tooglePassword, handleToogleValue: handleTooglePassword } =
    useToogleValue();
  const {
    value: toogleNewPassword,
    handleToogleValue: handleToogleNewPassword,
  } = useToogleValue();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = (data: unknown) => {
    try {
      console.log("data sign in - ", data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="gap-16 grid grid-cols-10">
      <div className="space-y-4 col-span-5">
        <Heading>Thông Tin Tài Khoản</Heading>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {" "}
            <p>
              <span className="font-medium">Mã CTV:</span> {_id}
            </p>
            <Tooltip title="copy">
              <button
                className="-translate-y-[2px]"
                onClick={() => _id && copyToClipboard(_id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                  />
                </svg>
              </button>
            </Tooltip>
          </div>

          <p>
            <span className="font-medium">Email:</span> {email}
          </p>
          <p>
            <span className="font-medium">Số điện thoại:</span> {phone}
          </p>
          <p>
            <span className="font-medium">Cấp Độ:</span>{" "}
            {level === 0 ? "Công tác  viên" : `Đại lý cấp ${level}`}
          </p>
        </div>
      </div>
      <div className="space-y-4 col-span-5">
        <Heading>Đổi Mật Khẩu</Heading>
        <form
          className="space-y-[15px] md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <Label htmlFor="email">Mật khẩu*</Label>
            <Input
              name="password"
              placeholder={"Vui lòng nhập mật khẩu cũ"}
              control={control}
            >
              <IconEyeToogle
                className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
                open={tooglePassword}
                onClick={handleTooglePassword}
              ></IconEyeToogle>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="newPassword">Mật khẩu mới*</Label>
            <Input
              type={toogleNewPassword ? "text" : "password"}
              name="newPassword"
              placeholder={"Vui lòng nhập mật khẩu mới"}
              control={control}
            >
              <IconEyeToogle
                className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
                open={toogleNewPassword}
                onClick={handleToogleNewPassword}
              ></IconEyeToogle>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="reNewPassword">Mật khẩu mới*</Label>
            <Input
              type={toogleNewPassword ? "text" : "password"}
              name="reNewPassword"
              placeholder={"Vui lòng nhập mật lại khẩu mới"}
              control={control}
            />
          </FormGroup>
          <Button type="submit" className="w-full text-white bg-primary">
            Lưu
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
