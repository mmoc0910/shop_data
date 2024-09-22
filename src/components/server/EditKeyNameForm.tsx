import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../button/Button";
import { Input } from "../input";
import IconEdit from "../../icons/IconEdit";
import classNames from "../../utils/classNames";

const schema = yup
  .object({
    name: yup.string(),
  })
  .required();

const EditKeyNameForm = ({
  placeholder,
  handleRenameKey,
  className = "",
  inputClassName = "",
}: {
  placeholder: string;
  handleRenameKey: (name: string) => void;
  className?: string;
  inputClassName?: string;
}) => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: { name: placeholder },
  });
  const onSubmit = (data: { name?: string }) => {
    data.name && handleRenameKey(data.name);
  };
  return (
    <form
      className={classNames("flex items-center w-[200px]", className)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        name="name"
        placeholder={placeholder}
        control={control}
        containerclass={classNames("w-full")}
        className={inputClassName}
      />
      <Button type="submit" className="text-gray-500 px-4">
        <IconEdit className="size-6" />
      </Button>
    </form>
  );
};

export default EditKeyNameForm;
