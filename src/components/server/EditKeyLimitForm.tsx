import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../button/Button";
import { Input } from "../input";
import IconEdit from "../../icons/IconEdit";
import React from "react";

const schema = yup
  .object({
    name: yup.string(),
  })
  .required();

const EditKeyLimitForm = ({
  placeholder,
  handleAddLimitData,
  type = "text",
}: {
  placeholder: string;
  handleAddLimitData: (bytes: number) => void;
  type?: React.HTMLInputTypeAttribute;
}) => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = (data: { name?: string }) => {
    try {
      data.name && handleAddLimitData(Number(data.name));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      className="flex items-center w-[200px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full">
        <Input
          type={type}
          name="name"
          placeholder={placeholder}
          control={control}
          // className=" h-[40px]"
        />
      </div>
      <Button type="submit" className="px-4 text-gray-500">
        <IconEdit />
      </Button>
    </form>
  );
};

export default EditKeyLimitForm;
