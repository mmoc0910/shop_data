import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../button/Button";
import { Input } from "../input";

const schema = yup
  .object({
    name: yup.string(),
    // .required("This field is required")
    // .email("Incorrect email format"),
  })
  .required();

const CreateNewKeyForm = ({
  handleAddNewKey,
}: {
  handleAddNewKey: () => void;
}) => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  const onSubmit = (data: unknown) => {
    try {
      console.log("data sign in - ", data)
      handleAddNewKey();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className="flex items-center gap-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full">
        <Input
          name="name"
          placeholder={"<Enter new key name>"}
          control={control}
        />
      </div>
      <Button type="submit" className="w-[200px] text-white bg-primary">
        Create new key
      </Button>
    </form>
  );
};

export default CreateNewKeyForm;
