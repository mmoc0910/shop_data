import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import Heading from "../../components/common/Heading";
import { Input } from "../../components/input";
import Button from "../../components/button/Button";
import FormGroup from "../../components/common/FormGroup";
import { Label } from "../../components/label";
import { api } from "../../api";
import { useEffect, useState } from "react";
import { CollabType } from "../../type";

const schema = yup
  .object({
    value: yup.number().required("This field is required"),
  })
  .required();

const CommisionAdminPage = () => {
  const [commision, setCommision] = useState<number>();
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });
  useEffect(() => {
    fetchCommision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(commision);
    commision && setValue("value", commision);
  }, [commision, setValue]);
  const onSubmit = async (data: { value: number }) => {
    try {
      await api.post("/commisions", data);
      //   handleOk();
      toast.success("Thành công");
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  const fetchCommision = async () => {
    try {
      const result = await api.get("/commisions");
      setCommision(result.data.value);
    } catch (error) {
      console.log("error - ", error);
      toast.error(messages.error);
    }
  };
  return (
    <div className="space-y-6">
      <Heading>Chính sách CTV</Heading>
      <div className="">
        <form
          className="space-y-[15px] md:space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormGroup>
            <Label htmlFor="value">Tỷ lệ % hoa hồng ( % )</Label>
            <div className="flex gap-6">
              <Input
                name="value"
                type="number"
                placeholder={"% Hoa hồng"}
                control={control}
                containerclass="flex-1"
              />
            </div>
          </FormGroup>{" "}
          <Button type="submit" className="px-5 text-white bg-primary">
            Chỉnh sửa
          </Button>
        </form>
        <Collab />
      </div>
    </div>
  );
};

const schemaCollab = yup
  .object({
    level1: yup.number().required("This field is required"),
    level2: yup.number().required("This field is required"),
    level3: yup.number().required("This field is required"),
  })
  .required();
const Collab = () => {
  const [collab, setcollab] = useState<CollabType>();
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schemaCollab),
    mode: "onSubmit",
  });

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (collab) {
      setValue("level1", collab.level1);
      setValue("level2", collab.level2);
      setValue("level3", collab.level3);
    }
  }, [collab, setValue]);
  const fetchData = async () => {
    try {
      const result = await api.get<CollabType>("/collab");
      setcollab(result.data);
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  const onSubmit = async (data: {
    level1: number;
    level2: number;
    level3: number;
  }) => {
    try {
      console.log("data - ", data);
      await api.post("/collab", data);
      toast.success("Thành công");
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  return (
    <form
      className="space-y-[15px] md:space-y-6 mt-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Heading>Chính sách Đại lý</Heading>
      <FormGroup>
        <Label htmlFor="value">Đại lý cấp 1</Label>
        <Input
          name="level1"
          type="number"
          placeholder={"% Hoa hồng"}
          control={control}
          containerclass="flex-1"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="value">Đại lý cấp 2</Label>
        <Input
          name="level2"
          type="number"
          placeholder={"% Hoa hồng"}
          control={control}
          containerclass="flex-1"
        />
      </FormGroup>
      <FormGroup>
        <Label htmlFor="value">Đại lý cấp 3</Label>
        <Input
          name="level3"
          type="number"
          placeholder={"% Hoa hồng"}
          control={control}
          containerclass="flex-1"
        />
      </FormGroup>
      <Button type="submit" className="px-5 text-white bg-primary">
        Chỉnh sửa
      </Button>
    </form>
  );
};

export default CommisionAdminPage;
