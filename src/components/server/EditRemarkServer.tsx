import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../button/Button";
import {  Textarea } from "../input";
import IconEdit from "../../icons/IconEdit";

const schema = yup
  .object({
    value: yup.string(),
  })
  .required();

const EditRemarkServer = ({
  placeholder,
  initialValue,
  handleSubmitRemark,
}: {
  placeholder: string;
  initialValue?: string;
  handleSubmitRemark: (value: string) => void;
}) => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: { value: initialValue },
  });
  const onSubmit = (data: { value?: string }) => {
    try {
      data.value && handleSubmitRemark(data.value);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="flex items-end" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full">
        <Textarea
          name="value"
          placeholder={placeholder}
          control={control}
          className="h-[100px]"
        />
      </div>
      <Button type="submit" className="text-gray-500 px-4">
        <IconEdit />
      </Button>
    </form>
  );
};

export default EditRemarkServer;
