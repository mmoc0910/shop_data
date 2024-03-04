import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../button/Button";
import { Input } from "../input";
import IconEdit from "../../icons/IconEdit";

const schema = yup
  .object({
    name: yup.string(),
  })
  .required();

const EditKeyNameForm = ({
  placeholder,
  handleRenameKey,
}: {
  placeholder: string;
  handleRenameKey: (name: string) => void;
}) => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = (data: { name?: string }) => {
    try {
      data.name && handleRenameKey(data.name);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="flex items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full">
        <Input name="name" placeholder={placeholder} control={control} />
      </div>
      <Button type="submit" className="text-gray-500 px-4">
        <IconEdit />
      </Button>
    </form>
  );
};

export default EditKeyNameForm;
