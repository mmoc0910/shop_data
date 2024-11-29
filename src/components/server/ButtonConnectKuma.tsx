import React, { useState } from "react";
import { ServerType } from "../../type";
import { FC } from "react";
import { toast } from "react-toastify";
import { api } from "../../api";
import classNames from "../../utils/classNames";
import IconBolt from "../../icons/IconBolt";

type Props = {
  server: ServerType;
  handleSubmit?: () => void;
  icon?: boolean;
};
const ButtonConnectKuma: FC<Props> = ({
  server,
  handleSubmit = () => {},
  icon = false,
}) => {
  const [enable, setEnable] = useState(
    server.isConnectKuma === 1 ? false : true
  );
  const [loading, setLoading] = useState(false);
  const handleConnectKuma = async () => {
    try {
      setLoading(true);
      const { name, hostnameForAccessKeys, portForNewAccessKeys } = server;
      await api.post("/kuma/create", {
        name,
        hostname: hostnameForAccessKeys,
        portC: `${portForNewAccessKeys}`,
        status: server.status,
      });
      setEnable(false);
      handleSubmit();
      toast.success("Connect Kuma success");
    } catch (error) {
      toast.error("Xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };
  if (!enable) return;
  return (
    <button
      type="button"
      className={classNames(
        "text-xs font-medium text-white rounded-lg bg-primary20 flex items-center justify-center",
        icon ? "w-7 aspect-square" : "p-2 w-28"
      )}
      onClick={handleConnectKuma}
    >
      {loading ? (
        <div className="w-4 h-4 border-white border-2 border-solid border-t-transparent animate-spin rounded-full" />
      ) : (
        <React.Fragment>{icon ? <IconBolt /> : "Connect"}</React.Fragment>
      )}
    </button>
  );
};

export default ButtonConnectKuma;
