import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import { Link } from "react-router-dom";
import { api } from "../../api";
import { PlanType } from "../../type";
import { v4 as uuidv4 } from "uuid";
import { VND } from "../../utils/formatPrice";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { messages } from "../../constants";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { Input } from "../../components/input";
import { Check } from "../../components/home/PricingBox";

// const schema = yup
//   .object({
//     search: yup.string(),
//   })
//   .required();
const PackPage = () => {
  const [plans, setPlans] = useState<PlanType[]>([]);
  // const { handleSubmit, control } = useForm({
  //   resolver: yupResolver(schema),
  //   mode: "onSubmit",
  // });
  // const onSubmit = (data: unknown) => {
  //   try {
  //     console.log("data sign in - ", data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
    handleFetchPlans();
  }, []);
  const handleFetchPlans = async () => {
    try {
      const result = await api.get("/plans");
      setPlans(result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const handleRemovePlan = async (_id: string) => {
    try {
      await api.delete(`/plans/${_id}`);
      handleFetchPlans();
      toast.success("Xóa thành công");
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  return (
    <div className="pb-10">
      <div className="mb-16 flex gap-10 justify-end">
        {/* <form onSubmit={handleSubmit(onSubmit)} className="flex-1">
          <Input name="search" placeholder={"Tìm kiếm"} control={control}>
            <button
              type="submit"
              className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </Input>
        </form> */}
        <Button className="px-5 text-white bg-secondary" href="/admin/pack/add">
          Thêm gói cước
        </Button>
      </div>
      {plans.length > 0 ? (
        <div className="grid grid-cols-3 gap-x-6 gap-y-14">
          {plans.map((plan) => (
            <PackDataItem
              plan={plan}
              key={uuidv4()}
              onRemove={() => handleRemovePlan(plan._id)}
            />
          ))}
        </div>
      ) : (
        <p className="pt-10 text-center">
          Chưa có gói cước nào để hiện thị{" "}
          <Link
            to={"/admin/pack/add"}
            className="text-primary underline decoration-primary font-medium"
          >
            Thêm mới
          </Link>
        </p>
      )}
    </div>
  );
};

const PackDataItem = ({
  plan,
  onRemove,
}: {
  plan: PlanType;
  onRemove: () => void;
}) => {
  const { _id, createdAt, name, price, description, type, bandWidth } = plan;
  return (
    <div className="col-span-1 shadow-xl flex flex-col items-center rounded-2xl overflow-hidden">
      <h4 className="font-medium text-primary bg-primary bg-opacity-5 px-3 py-2 rounded-br-lg rounded-bl-lg">
        {name}
      </h4>{" "}
      <p className="pt-5">
        Ngày tạo:{" "}
        <span className="font-medium">
          {dayjs(createdAt).format("YYYY-MM-DD")}
        </span>
      </p>
      <div className="pb-10 pt-7">
        <p className="text-primary text-4xl font-medium mb-2">
          {VND.format(price)}
          <span className="text-primary text-center text-xl">VND/{type}</span>
        </p>
        <p className="font-semibold text-center text-primary text-3xl mt-3">{bandWidth}GB</p>
      </div>
      <div className="w-[80%] mx-auto space-y-5 pb-20">
        {description.map((desc) => (
          <Check content={desc} key={uuidv4()} />
        ))}
      </div>
      <div className="w-full mt-auto cursor-pointer flex">
        <button
          className="font-medium text-white text-xl flex items-center justify-center py-4 w-1/2 bg-slate-400"
          onClick={() => onRemove()}
        >
          Xóa
        </button>
        <Link
          to={`/admin/pack/edit/${_id}`}
          className="font-medium text-white text-xl flex items-center justify-center py-4 w-1/2 bg-primary"
        >
          Chỉnh sửa
        </Link>
      </div>
    </div>
  );
};

export default PackPage;
