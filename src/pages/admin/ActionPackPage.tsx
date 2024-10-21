import Heading from "../../components/common/Heading";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { Input, Textarea } from "../../components/input";
import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { PlanType } from "../../type";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Checkbox } from "../../components/checkbox";

const schema = yup
  .object({
    name: yup
      .string()
      .required()
      .matches(
        /^[a-zA-Z0-9_-]+$/,
        "Chỉ viết liền, ký tự thường, hoa, dấu -, _"
      ),
    description: yup.string().required(),
    type: yup.string().required(),
    day: yup.number().required(),
    price: yup.number().required(),
    bandWidth: yup.number().required(),
    enable: yup.boolean()
  })
  .required();
const ActionPackPage = () => {
  const { packId } = useParams();
  const navigation = useNavigate();
  const [plan, setPlan] = useState<PlanType>();
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  console.log("errors ~ ", errors);
  const enableWatch = watch("enable");
  console.log("enableWatch ~ ", enableWatch);
  useEffect(() => {
    if (packId) {
      (async () => {
        try {
          const result = await api.get(`/plans/${packId}`);
          setPlan(result.data);
        } catch (error) {
          console.log("error");
        }
      })();
    }
  }, [packId]);
  useEffect(() => {
    if (plan) {
      const { name, price, description, type, day, bandWidth, enable } = plan;
      setValue("name", name);
      setValue("type", type);
      setValue("day", day);
      setValue("description", description.join("\n"));
      setValue("price", price);
      setValue("bandWidth", bandWidth);
      setValue("enable", !!enable);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);

  const onSubmit = async (data: {
    price: number;
    type: string;
    day: number;
    description: string;
    name: string;
    bandWidth: number;
    enable?: boolean;
  }) => {
    try {
      if (plan) {
        const { name, type, day, description, price, bandWidth, enable } = data;
        await api.patch(`/plans/${packId}`, {
          name,
          price,
          type,
          day,
          description: description.split("\n"),
          bandWidth,
          enable: !!enable ? 1 : 0,
        });
        toast.success("Chỉnh sửa thành công");
        navigation("/admin/pack");
      } else {
        const { name, type, day, description, price, bandWidth } = data;
        await api.post("/plans", {
          name,
          price,
          type,
          day,
          description: description.split("\n"),
          bandWidth,
        });
        toast.success("Thêm thành công");
        navigation("/admin/pack");
      }
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  return (
    <RequireAuthPage rolePage={[1]}>
      <div className="space-y-4">
        <Heading>Thêm gói cước mới</Heading>
        <form
          className="grid grid-cols-2 lg:grid-cols-6 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup className="col-span-2">
            <Label htmlFor="name">Mã/Tên gói cước*</Label>
            <Input name="name" control={control} />
          </FormGroup>
          <FormGroup className="col-span-2">
            <Label htmlFor="price">Giá gói cước*</Label>
            <Input name="price" control={control} type="number" min={0}>
              <p className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2 font-semibold text-icon-color">
                VND
              </p>
            </Input>
          </FormGroup>
          <FormGroup className="col-span-2">
            <Label htmlFor="bandWidth">Băng thông*</Label>
            <Input name="bandWidth" control={control} type="number" min={0}>
              <p className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2 font-semibold text-icon-color">
                GB
              </p>
            </Input>
          </FormGroup>
          <FormGroup className="col-span-2">
            <Label htmlFor="type">Chu kỳ(Vietnam_English_Chinese)*</Label>
            <Input name="type" control={control} />
          </FormGroup>
          <FormGroup className="col-span-2">
            <Label htmlFor="day">Ngày*</Label>
            <Input name="day" control={control} type="number" min={0}>
              <p className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2 font-semibold text-icon-color">
                Ngày
              </p>
            </Input>
          </FormGroup>
          {plan && packId && (
            <FormGroup className="col-span-2">
              <Label htmlFor="day">Status*</Label>
              <div className="flex items-center h-full">
                <Checkbox
                  checked={enableWatch}
                  onClick={() => setValue("enable", !enableWatch)}
                >
                  Enable
                  {/* {enableWatch ? "Enable" : "Disable"} */}
                </Checkbox>
              </div>
            </FormGroup>
          )}
          <FormGroup className="col-span-2 lg:col-span-6">
            <Label htmlFor="description">Nội dung gói cước*</Label>
            <Textarea
              name="description"
              control={control}
              className="min-h-[300px]"
            />
          </FormGroup>
          <FormGroup>
            <Button
              type="submit"
              className="w-full text-white bg-primary mt-auto"
            >
              {plan ? "Chỉnh sửa" : "Thêm mới"}
            </Button>
          </FormGroup>
        </form>
      </div>
    </RequireAuthPage>
  );
};

export default ActionPackPage;
