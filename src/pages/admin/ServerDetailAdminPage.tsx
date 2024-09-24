import { useParams } from "react-router-dom";
import Heading from "../../components/common/Heading";
import { useEffect, useState } from "react";
import { ServerType } from "../../type";
import { toast } from "react-toastify";
import { api } from "../../api";
import dayjs from "dayjs";
import Radio from "../../components/radio/Radio";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../../components/input";
import Button from "../../components/button/Button";
import IconEdit from "../../icons/IconEdit";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import EditRemarkServer from "../../components/server/EditRemarkServer";
import EditLocationServerForm from "../../components/server/EditLocationServerForm";
import ButtonConnectKuma from "../../components/server/ButtonConnectKuma";
import ButtonRemoveKuma from "../../components/server/ButtonRemoveKuma";
import { ListKeyByServerId } from "../../components/server/ListKeyByServerId";
import EditCloudServerForm from "../../components/server/EditCloudServerForm";
import { messages } from "../../constants";
import classNames from "../../utils/classNames";

const ServerDetailAdminPage = () => {
  const { serverId } = useParams();
  const [serverDetail, setServerDetail] = useState<ServerType>();

  useEffect(() => {
    handleFetchServerDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverId]);
  const handleFetchServerDetail = async () => {
    try {
      const response = await api.get<ServerType>(`/servers/${serverId}`);
      setServerDetail(response.data);
    } catch (error) {
      toast.error("Xảy ra lỗi trong quá trìn xử lý");
    }
  };

  const handleChangeLocation = async (value: string) => {
    if (serverDetail) {
      try {
        await api.patch(`/servers/location/${serverDetail._id}`, {
          location: value,
        });
        handleFetchServerDetail();
        toast.success("Thành công");
      } catch (error) {
        console.log("error - ", error);
      }
    }
  };
  const handleChangeCloud = async (value: string) => {
    if (serverDetail) {
      try {
        await api.patch(`/servers/cloud-manager/${serverDetail._id}`, {
          cloudManagerId: value,
        });
        handleFetchServerDetail();
        toast.success("Thành công");
      } catch (error) {
        console.log("error - ", error);
      }
    }
  };
  return (
    <RequireAuthPage rolePage={[1, 3]}>
      <div className="space-y-10">
        {serverDetail && (
          <>
            <div className="space-y-7">
              <Heading>Server</Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Remark</div>
                  <div>
                    <EditRemarkServer
                      placeholder="Remark"
                      initialValue={serverDetail.remark}
                      handleSubmitRemark={async (value: string) => {
                        try {
                          await api.patch(
                            `/servers/remark/${serverDetail._id}`,
                            { remark: value }
                          );
                          handleFetchServerDetail();
                          toast.success("Thành công");
                        } catch (error) {
                          console.log("error - ", error);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Server name</div>
                  <div>
                    <EditServerForm
                      placeholder={serverDetail.name}
                      handleEdit={async (value: string) => {
                        try {
                          await api.patch(
                            `/servers/name-server/${serverDetail._id}`,
                            { name: value }
                          );
                          handleFetchServerDetail();
                          toast.success("Thành công");
                        } catch (error) {
                          console.log("error - ", error);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Location</div>
                  <div>
                    <EditLocationServerForm
                      initialLocation={serverDetail.location}
                      onSubmit={(value) => {
                        handleChangeLocation(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Cloud</div>
                  <div>
                    <EditCloudServerForm
                      initialLocation={serverDetail.cloudManagerId}
                      onSubmit={(value) => {
                        console.log("value ~ ", value);
                        handleChangeCloud(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Hostname</div>
                  <div>{serverDetail.hostnameForAccessKeys}</div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">
                    Port for new access key
                  </div>
                  <div>{serverDetail.portForNewAccessKeys}</div>
                </div>
                {/* <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-500">
                  Data transferred / last 30 days
                </div>
                <div>{serverDetail.name}</div>
              </div> */}
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Created</div>
                  <div>
                    {dayjs(serverDetail.createdAt).format("YYYY-MM-DD HH:MM")}
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Server ID</div>
                  <div>{serverDetail.serverId}</div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">
                    Share anonymous metrics
                  </div>
                  <div className="flex items-center gap-4">
                    <Radio checked={serverDetail.metricsEnabled ? true : false}>
                      Enable
                    </Radio>
                    <Radio checked={serverDetail.metricsEnabled ? false : true}>
                      Disabled
                    </Radio>
                    {/* <button className="px-4 py-2 text-white rounded-md bg-primary">
                    Apply
                  </button> */}
                  </div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">
                    Server version
                  </div>
                  <div>{serverDetail.version}</div>
                </div>
                <div className="col-span-1 p-3 space-y-1 border border-gray-200 rounded-lg">
                  <div className="font-medium text-gray-500">Kuma</div>
                  <div className="flex gap-2 w-full">
                    <ButtonConnectKuma
                      server={serverDetail}
                      handleSubmit={handleFetchServerDetail}
                    />
                    <ButtonRemoveKuma
                      server={serverDetail}
                      onSubmit={handleFetchServerDetail}
                    />
                  </div>
                </div>
              </div>
            </div>
            <ListKeyByServerId
              handleFetchServerDetail={handleFetchServerDetail}
              serverId={serverId as string}
              status={1}
              heading={"Keys Active"}
            />
            <ListKeyByServerId
              handleFetchServerDetail={handleFetchServerDetail}
              serverId={serverId as string}
              status={0}
              heading={"Keys Inactive"}
            />
            <ListKeyByServerId
              handleFetchServerDetail={handleFetchServerDetail}
              serverId={serverId as string}
              status={2}
              heading={"Keys Migrate"}
            />
          </>
        )}
      </div>
    </RequireAuthPage>
  );
};

const schema = yup
  .object({
    value: yup.string(),
  })
  .required();
export const EditServerForm = ({
  placeholder = "",
  handleEdit,
  isButtonSubmit = true,
  containerClass = "",
}: {
  placeholder?: string;
  handleEdit: (value: string) => void;
  isButtonSubmit?: boolean;
  containerClass?: string;
}) => {
  const { handleSubmit, control } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    defaultValues: { value: placeholder },
  });
  const onSubmit = (data: { value?: string }) => {
    try {
      data.value && handleEdit(data.value);
    } catch (error) {
      toast.error(messages.error);
    }
  };
  return (
    <form
      className={classNames("flex items-center", containerClass)}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-full">
        <Input
          name="value"
          placeholder={placeholder}
          control={control}
          className="placeholder:text-gray-500"
        />
      </div>
      {isButtonSubmit && (
        <Button type="submit" className="px-4 text-gray-500">
          <IconEdit />
        </Button>
      )}
    </form>
  );
};

export default ServerDetailAdminPage;
