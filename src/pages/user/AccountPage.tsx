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
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { countries } from "../../constants";
import { useEffect, useState } from "react";
import { AuthState, setAuth } from "../../store/auth/authSlice";
import { api } from "../../api";
import { toast } from "react-toastify";
import axios from "axios";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import IconQuesionMarkCircle from "../../icons/IconQuesionMarkCircle";
import { DropdownWithComponents } from "../../components/dropdown";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const schema = yup
  .object({
    oldPassword: yup
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
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const commision = useSelector((state: RootState) => state.commision);
  const collab = useSelector((state: RootState) => state.collab);
  const { cash } = useSelector((state: RootState) => state.satisfy);
  const { _id, email, level, introduceCode, username } = useSelector(
    (state: RootState) => state.auth
  );
  const {
    value: toogleOldPassword,
    handleToogleValue: handleToogleOldPassword,
  } = useToogleValue();
  const {
    value: toogleNewPassword,
    handleToogleValue: handleToogleNewPassword,
  } = useToogleValue();
  const {
    value: toogleReNewPassword,
    handleToogleValue: handleToogleReNewPassword,
  } = useToogleValue();
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  console.log("roor - ", errors);
  const onSubmit = async (data: {
    oldPassword: string;
    newPassword: string;
    reNewPassword: string;
  }) => {
    const { newPassword, oldPassword, reNewPassword } = data;
    try {
      console.log("data sign in - ", data);
      if (newPassword === reNewPassword) {
        await api.patch(`/users/change-password/${_id}`, {
          oldPassword,
          newPassword,
        });
        dispatch(setAuth({}));
        navigation("/sign-in");
        toast.success("Đổi mật khẩu thành công vui lòng đăng nhập lại");
      } else {
        setError("reNewPassword", {
          message: "Xác nhận mật khẩu mới không khớp",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };
  return (
    <div className="gap-16 grid grid-cols-10">
      <div className="space-y-4 col-span-5">
        <Heading>Thông Tin Tài Khoản</Heading>
        <div className="space-y-4">
          {cash >= 50000 && (
            <div className="flex items-center gap-2">
              <Tooltip
                title={`Giới thiệu mã CTV này cho bạn bè bạn sẽ nhận được [${commision}%] hoa hồng cho mỗi giao dịch.`}
              >
                <p className="text-sm">
                  <span className="font-medium">Mã CTV:</span>{" "}
                  {introduceCode || ""}
                </p>
              </Tooltip>

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
          )}

          <p className="text-sm">
            <span className="font-medium">Email:</span> {email}
          </p>
          <p className="text-sm">
            <span className="font-medium">Tên đăng nhập:</span> {username}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm">
              <span className="font-medium">Loại người dùng:</span>{" "}
              {level === 0 ? "Công tác  viên" : `Đại lý cấp ${level}`}
            </p>
            <Tooltip
              title={`User/CTV: 
Nhận được ${commision}% hoa hồng cho mỗi đơn hàng của người được giới thiệu || 
Đại lý Cấp 1: 
Chiết khấu [${collab.level1}%] cho mỗi đơn hàng mới ||
Đại lý Cấp 2: 
Chiết khấu [${collab.level2}%] cho mỗi đơn hàng mới ||
Đại lý Cấp 3: 
Chiết khấu [${collab.level3}%] cho mỗi đơn hàng mới
`}
            >
              <span className="cursor-pointer">
                <IconQuesionMarkCircle />
              </span>
            </Tooltip>
          </div>
        </div>
        <ChangeProfile />
      </div>
      <div className="space-y-4 col-span-5">
        <Heading>Đổi Mật Khẩu</Heading>
        <form
          className="space-y-[15px] md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <Label htmlFor="oldPassword">Mật khẩu*</Label>
            <Input
              type={toogleOldPassword ? "text" : "password"}
              name="oldPassword"
              placeholder={"Vui lòng nhập mật khẩu cũ"}
              control={control}
            >
              <IconEyeToogle
                className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
                open={toogleOldPassword}
                onClick={handleToogleOldPassword}
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
              type={toogleReNewPassword ? "text" : "password"}
              name="reNewPassword"
              placeholder={"Vui lòng nhập mật lại khẩu mới"}
              control={control}
            >
              <IconEyeToogle
                className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
                open={toogleReNewPassword}
                onClick={handleToogleReNewPassword}
              ></IconEyeToogle>
            </Input>
          </FormGroup>
          <Button type="submit" className="w-full text-white bg-primary">
            Lưu
          </Button>
        </form>
      </div>
    </div>
  );
};

const schemaProfile = yup
  .object({
    // ctv: yup.string(),
    phone: yup.string().required("This field is required"),
    country: yup.string().required("This field is required"),
    // username: yup.string().required("This field is required"),
  })
  .required();

const ChangeProfile = () => {
  const { _id, email } = useSelector((state: RootState) => state.auth);
  const [user, setUser] = useState<AuthState>();
  const dispatch = useDispatch();
  const { handleSubmit, control, setValue, watch } = useForm({
    resolver: yupResolver(schemaProfile),
    mode: "onSubmit",
  });
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);
  const fetchData = async () => {
    try {
      const resultUser = await api.get<AuthState>(`/users/${_id}`);
      console.log("result - ", resultUser.data);
      setUser(resultUser.data);
    } catch (error) {
      console.log("error - ", error);
      // toast.error(messages.error);
    }
  };
  useEffect(() => {
    if (user) {
      user.country && setValue("country", user.country);
      user.phone && setValue("phone", user.phone);
      // user.username && setValue("username", user.username);
    }
  }, [user, setValue]);
  const onSubmit = async (data: {
    phone: string;
    country: string;
    // username: string;
  }) => {
    try {
      console.log("data sign in - ", data);
      await api.patch(`/users/${_id}`, { ...data, email });
      const resultUser = await api.get<AuthState>(`/users/${_id}`);
      dispatch(setAuth(resultUser.data));
      toast.success("Chỉnh sửa thành công");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error message: ", error);
        toast.error(error.response?.data.message);
      } else {
        console.log("unexpected error: ", error);
        return "An unexpected error occurred";
      }
    }
  };
  const country = watch("country");
  return (
    <RequireAuthPage rolePage={2}>
      <form
        className="space-y-[15px] md:space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="email">Số điện thoại*</Label>
          <Input name="phone" placeholder={""} control={control} />
        </FormGroup>
        <FormGroup>
          <Label>Select country*</Label>
          <DropdownWithComponents>
            <DropdownWithComponents.Select
              placeholder={
                country ? (
                  <span className="text-black">
                    {countries.find((i) => i.key === country)?.title}
                  </span>
                ) : (
                  <span className="text-text4">Select one</span>
                )
              }
            ></DropdownWithComponents.Select>
            <DropdownWithComponents.List>
              {countries.length > 0 &&
                countries.map((country) => (
                  <DropdownWithComponents.Option
                    key={uuidv4()}
                    onClick={() => setValue("country", country.key)}
                  >
                    <span className="capitalize">{country.title}</span>
                  </DropdownWithComponents.Option>
                ))}
            </DropdownWithComponents.List>
          </DropdownWithComponents>
        </FormGroup>
        <Button type="submit" className="w-full text-white bg-primary">
          Lưu
        </Button>
      </form>
    </RequireAuthPage>
  );
};

export default AccountPage;
