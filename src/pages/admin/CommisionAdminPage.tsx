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
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Link } from "react-router-dom";
import { AuthState } from "../../store/auth/authSlice";
import { setCollab } from "../../store/collab/collabSlice";
import { useDispatch } from "react-redux";

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
    <div className="grid grid-cols-2 gap-20">
      <div className="space-y-6">
        <Heading>Chính sách CTV</Heading>
        <div className="">
          <p className="mb-5">
            Tỉ lệ % hoa hồng mà người dùng nhận được khi giới thiệu người dùng.
            <br />
            Chính sách hiện tại: {commision}%
          </p>
          <form
            className="space-y-[15px] md:space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormGroup>
              <Label htmlFor="value">
                Điều chỉnh chính sách hoa hồng mặc định:
              </Label>
              <div className="flex gap-6">
                <Input
                  name="value"
                  type="number"
                  placeholder={"% Hoa hồng"}
                  control={control}
                  containerclass="flex-1"
                >
                  <span className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2 font-semibold text-icon-color">
                    %
                  </span>
                </Input>
              </div>
            </FormGroup>{" "}
            <Button type="submit" className="px-5 text-white bg-primary">
              Apply
            </Button>
          </form>
        </div>
      </div>
      <div className="space-y-6">
        <Heading>Chính sách Đại lý</Heading> <Collab />
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
  const [listUser, setListUser] = useState<AuthState[]>([]);
  const [collab, setcollab] = useState<CollabType>();
  const dispatch = useDispatch();
  const { handleSubmit, control, setValue } = useForm({
    resolver: yupResolver(schemaCollab),
    mode: "onSubmit",
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<AuthState[]>(`/users`);
        const data = result?.data?.filter((i) => i.role !== 1);
        setListUser(data);
      } catch (error) {
        toast.error(messages.error);
      }
    })();
  }, []);
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      dispatch(
        setCollab({
          level1: result.data.level1,
          level2: result.data.level2,
          level3: result.data.level3,
        })
      );
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
      await api.post("/collab", data);
      fetchData();
      toast.success("Thành công");
    } catch (error) {
      console.log(error);
      toast.error(messages.error);
    }
  };
  return (
    <RequireAuthPage rolePage={1}>
      <p className="mb-5">
        Tỉ lệ % chiết khấu mà Đại lý nhận được khi mua gói cước.
      </p>
      <form
        className="space-y-[15px] md:space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormGroup>
          <Label htmlFor="value">
            Đại lý cấp 1: [Hiện tại có{" "}
            {listUser.filter((item) => item.level === 1).length} đại lý.{" "}
            <Link
              to={"/admin/account?level=1"}
              className="text-primary font-medium underline decoration-primary"
            >
              Chi tiết
            </Link>
            ]
          </Label>
          <Label htmlFor="value">Mức chiết khấu</Label>
          <Input
            name="level1"
            type="number"
            placeholder={"% Hoa hồng"}
            control={control}
            containerclass="flex-1"
          >
            <span className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2 font-semibold text-icon-color">
              %
            </span>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="value">
            Đại lý cấp 2: [Hiện tại có{" "}
            {listUser.filter((item) => item.level === 2).length} đại lý.{" "}
            <Link
              to={"/admin/account?level=2"}
              className="text-primary font-medium underline decoration-primary"
            >
              Chi tiết
            </Link>
            ]
          </Label>
          <Label htmlFor="value">Mức chiết khấu</Label>
          <Input
            name="level2"
            type="number"
            placeholder={"% Hoa hồng"}
            control={control}
            containerclass="flex-1"
          >
            <span className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2 font-semibold text-icon-color">
              %
            </span>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="value">
            Đại lý cấp 3: [Hiện tại có{" "}
            {listUser.filter((item) => item.level === 3).length} đại lý.{" "}
            <Link
              to={"/admin/account?level=3"}
              className="text-primary font-medium underline decoration-primary"
            >
              Chi tiết
            </Link>
            ]
          </Label>
          <Label htmlFor="value">Mức chiết khấu</Label>
          <Input
            name="level3"
            type="number"
            placeholder={"% Hoa hồng"}
            control={control}
            containerclass="flex-1"
          >
            <span className="absolute -translate-y-1/2 cursor-pointer right-5 top-1/2 font-semibold text-icon-color">
              %
            </span>
          </Input>
        </FormGroup>
        <Button type="submit" className="px-5 text-white bg-primary">
          Apply
        </Button>
      </form>
    </RequireAuthPage>
  );
};

export default CommisionAdminPage;
