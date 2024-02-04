import React from "react";
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
    <div className="space-y-16">
      <div className="space-y-4">
        <Heading>Thông Tin Tài Khoản</Heading>
        <div className="space-y-4">
          <p>
            <span className="font-medium">Id:</span> 14968
          </p>
          <p>
            <span className="font-medium">Email:</span> Account@gmail.com
          </p>
          <p>
            <span className="font-medium">Cấp Độ:</span> 0
          </p>
          <p>
            <span className="font-medium">Giảm Giá Gói:</span> 0%
          </p>
          <div className="flex items-center gap-5">
            <p>
              <span className="font-medium">Số dư:</span> 0
              <span className="underline">đ</span>
            </p>
            <button
              type="button"
              className="bg-secondary px-4 py-2 rounded-xl text-white font-medium"
            >
              Nạp số dư
            </button>
          </div>
          <div className="flex items-center gap-5">
            <p>
              <span className="font-medium">Hoa hồng:</span> 0
              <span className="underline">đ</span>
            </p>
            <button
              type="button"
              className="bg-secondary px-4 py-2 rounded-xl text-white font-medium"
            >
              Rút hoa hồng
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Heading>Đổi Mật Khẩu</Heading>
        <form
          className="space-y-[15px] md:space-y-5 w-1/2"
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
