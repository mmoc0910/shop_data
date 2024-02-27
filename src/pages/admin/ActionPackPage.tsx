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

const schema = yup
  .object({
    name: yup.string().required(),
    description: yup.string().required(),
    type: yup.string().required(),
    day: yup.number().required(),
    price: yup.number().required(),
    bandWidth: yup.number().required(),
  })
  .required();
const ActionPackPage = () => {
  const { packId } = useParams();
  const navigation = useNavigate();
  console.log("pack id - ", packId);
  const [plan, setPlan] = useState<PlanType>();
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
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
      const { name, price, description, type, day, bandWidth } = plan;
      setValue("name", name);
      setValue("type", type);
      setValue("day", day);
      setValue("description", description.join("\n"));
      setValue("price", price);
      setValue("bandWidth", bandWidth);
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
  }) => {
    try {
      if (plan) {
        const { name, type, day, description, price, bandWidth } = data;
        console.log("data sign in - ", data);
        console.log("description", description.split("\n"));
        await api.patch(`/plans/${packId}`, {
          name,
          price,
          type,
          day,
          description: description.split("\n"),
          bandWidth,
        });
        toast.success("Chỉnh sửa thành công");
        navigation("/admin/pack");
      } else {
        const { name, type, day, description, price, bandWidth } = data;
        console.log("data sign in - ", data);
        console.log("description", description.split("\n"));
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
    <RequireAuthPage rolePage={1}>
      <div>
        <Heading>Thêm gói cước mới</Heading>
        <form
          className="grid grid-cols-5 gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <Label htmlFor="name">Mã/Tên gói cước*</Label>
            <Input name="name" control={control} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="price">Giá gói cước*</Label>
            <Input name="price" control={control} type="number" min={0} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="bandWidth">Băng thông*</Label>
            <Input name="bandWidth" control={control} type="number" min={0} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="type">Chu kỳ*</Label>
            <Input name="type" control={control} />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="day">Ngày*</Label>
            <Input name="day" control={control} type="number" min={0} />
          </FormGroup>
          <FormGroup className="col-span-5">
            <Label htmlFor="description">Nội dung gói cước*</Label>
            <Textarea
              name="description"
              control={control}
              className="min-h-[200px]"
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
