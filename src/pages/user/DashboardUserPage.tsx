import { Modal } from "antd";
import Heading from "../../components/common/Heading";
import { VND } from "../../utils/formatPrice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../components/button/Button";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { Input } from "../../components/input";
import { useSelector } from "react-redux";
import { RootState } from "../../store/configureStore";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { api } from "../../api";
import CashHistory from "../../components/user/CashHistory";
import TransactionHistory from "../../components/user/TransactionHistory";
import RoseHistory from "../../components/user/RoseHistory";
import { SatisfyType } from "../../type";
import Swal from "sweetalert2";

const schema = yup
  .object({
    money: yup.number().required("This field is required"),
  })
  .required();

const DashboardUserPage = () => {
  const { _id } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [satisfy, setSatisfy] = useState<SatisfyType>();
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  useEffect(() => {
    fetchSatify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);
  const fetchSatify = async () => {
    try {
      const result = await api.get<SatisfyType>(`/satisfy/${_id}`);
      console.log("result - ", result.data);
      setSatisfy(result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const onSubmit = async (data: { money: number }) => {
    try {
      Swal.fire({
        title: `Bạn có muốn nạp ${VND.format(data.money)}VND`,
        // text: `${bandWidth}GB - ${VND.format(price)}VND/${type}`,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#1DC071",
        cancelButtonColor: "#d33",
        cancelButtonText: "Thoát",
        confirmButtonText: "Đồng ý",
      }).then(async (result) => {
        if (result.isConfirmed) {
          console.log("data - ", data);
          await api.post("/cashs", { ...data, userId: _id });
          handleOk();
          toast.success("Nạp tiền thành công. Vui lòng chờ admin phê duyệt");
        }
      });
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-8 space-y-10">
          <div className="space-y-4">
            {/* <Heading>Thống kê chi tiết</Heading> */}
            <div className="grid grid-cols-3 gap-7">
              <div className="p-5 rounded-lg shadow-xl space-y-3">
                <p className="text-gray-500 text-lg">Tổng nạp</p>
                <p className="font-semibold text-2xl">
                  {VND.format(
                    satisfy && satisfy.cash.length > 0
                      ? satisfy.cash[0].money
                      : 0
                  )}
                  VND
                </p>
              </div>
              <div className="p-5 rounded-lg shadow-xl space-y-3">
                <p className="text-gray-500 text-lg">Số dư hiện tại</p>
                <p className="font-semibold text-2xl">
                  {VND.format(satisfy ? satisfy.currentMoney : 0)}VND
                </p>
              </div>
              <div className="p-5 rounded-lg shadow-xl space-y-3">
                <p className="text-gray-500 text-lg">Số tiền đã sử dụng</p>
                <p className="font-semibold text-2xl text-error">
                  {VND.format(
                    satisfy && satisfy.transaction.length > 0
                      ? satisfy.transaction[0].money
                      : 0
                  )}
                  VND
                </p>
                <div
                  className="text-primary underline decoration-primary cursor-pointer"
                  onClick={showModal}
                >
                  Nạp tiền ngay
                </div>
              </div>
              <div className="p-5 rounded-lg shadow-xl space-y-3">
                <p className="text-gray-500 text-lg">Tiền hoa hồng</p>
                <p className="font-semibold text-2xl">
                  {VND.format(
                    satisfy && satisfy.rose.length > 0
                      ? satisfy.rose[0].money
                      : 0
                  )}
                  VND
                </p>
              </div>
              <div className="p-5 rounded-lg shadow-xl space-y-3">
                <p className="text-gray-500 text-lg">Đã mời</p>
                <p className="font-semibold text-2xl">
                  {satisfy?.numberIntoduce || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Heading>Liên hệ</Heading>
            <div className="">
              <p>Chào mừng quý khách đến với hệ thống của chúng tôi !</p>
              <p>
                Nếu gặp khó khăn trong quá trình giao dịch quý khách hãy liên hệ
                với admin qua :
              </p>
              <p className="text-lg font-medium">Zalo: 0123456799</p>
              <p className="text-lg font-medium">Zalo: 0123456799</p>
              <p className="text-lg font-medium">Zalo: 0123456799</p>
            </div>
          </div>
          <div className="space-y-4">
            <Heading>Hướng dẫn sử dụng</Heading>
            <div className="space-y-6">
              <div className="rounded-lg border overflow-hidden bg-gray-100">
                <p className="px-5 py-3 font-medium text-lg">
                  Thông tin cần biết
                </p>
                <div className="rounded-lg border px-5 py-3 bg-white">
                  <p className="font-medium">
                    Thông tin cần biết VPN 4G là gì ? Tại sao lại cần đến ?
                  </p>
                  <p className="text-gray-400 text-sm mt-4">
                    Lần Cập Nhật Cuối Cùng Vào:08/2/2023
                  </p>
                </div>
              </div>
              <div className="rounded-lg border overflow-hidde bg-gray-100">
                <p className="px-5 py-3 font-medium text-lg">
                  Chương trình CTV
                </p>
                <div className="rounded-lg border px-5 py-3 bg-white">
                  <p className="font-medium">Hưởng hoa hồng 30% trọn đời</p>
                  <p className="text-gray-400 text-sm mt-4">
                    Lần Cập Nhật Cuối Cùng Vào:07/11/2022
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-4 space-y-10">
          <CashHistory />
          <RoseHistory />
          <TransactionHistory />
        </div>
      </div>
      <Modal
        title="Nạp tiền"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[]}
      >
        <form
          className="space-y-[15px] md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="font-primary text-icon-color">
            Bạn vui lòng nhập số tiền cần nạp sau đó liên hệ với admin để có thể
            nạp tiền hoặc đợi admin liên hệ trong ít phút nữa.
          </p>
          <FormGroup>
            <Label htmlFor="money">Số tiền*</Label>
            <Input name="money" placeholder={""} control={control} />
          </FormGroup>
          <Button type="submit" className="w-full text-white bg-primary">
            Nạp tiền
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default DashboardUserPage;
