import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import FormGroup from "../common/FormGroup";
import { Label } from "../label";
import { Input } from "../input";
import Button from "../button/Button";
import { useEffect, useState } from "react";
import { RoseExtendType } from "../../type";
import { api } from "../../api";

const schema = yup
  .object({
    level1: yup.number().required("This field is required"),
    level2: yup.number().required("This field is required"),
    level3: yup.number().required("This field is required"),
  })
  .required();
const RoseExtendPlan = () => {
  const [roseExtend, setRoseExtend] = useState<RoseExtendType>();
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (roseExtend) {
      const { level1, level2, level3 } = roseExtend;
      setValue("level1", level1);
      setValue("level2", level2);
      setValue("level3", level3);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roseExtend]);
  const fetchData = async () => {
    try {
      const result = await api.get<RoseExtendType>("/rose-extends");
      setRoseExtend(result.data);
    } catch (error) {
      console.log("error - ", error);
    }
  };
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = async (data: {
    level1: number;
    level2: number;
    level3: number;
  }) => {
    try {
      console.log("data - ", data);
      await api.post("/rose-extends", data);
      fetchData();
      toast.success("Apply thành công");
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex items-end gap-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
          <FormGroup>
            <Label htmlFor="price">{`<=`}4 tháng(%)*</Label>
            <Input
              name="level1"
              placeholder={""}
              control={control}
              type="number"
              min={0}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="price">5-8 tháng(%)*</Label>
            <Input
              name="level2"
              placeholder={""}
              control={control}
              type="number"
              min={0}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="price">{`>=`}9 tháng(%)*</Label>
            <Input
              name="level3"
              placeholder={""}
              control={control}
              type="number"
              min={0}
            />
          </FormGroup>
        </div>
        <Button type="submit" className="px-5 text-white bg-primary">
          Apply
        </Button>
      </div>
    </form>
  );
};

export default RoseExtendPlan;
