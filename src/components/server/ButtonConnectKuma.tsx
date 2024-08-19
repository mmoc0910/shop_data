import { useState } from "react";
import { ServerType } from "../../type";
import { FC } from "react";
import { toast } from "react-toastify";
import { api } from "../../api";

type Props = { server: ServerType };
const ButtonConnectKuma: FC<Props> = ({ server }) => {
  const [loading, setLoading] = useState(false);
  const handleConnectKuma = async () => {
    try {
      setLoading(true);
      const { name, hostnameForAccessKeys, apiUrl, portForNewAccessKeys } =
        server;
      const parsedUrl = new URL(apiUrl);
      const portM = parsedUrl.port;
      await api.post("/kuma/create", {
        name,
        hostname: hostnameForAccessKeys,
        portC: `${portForNewAccessKeys}`,
        portM: portM,
      });
      toast.success("Connect Kuma success");
    } catch (error) {
      toast.error("Xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      type="button"
      className="p-2 text-xs font-medium text-white rounded-lg bg-secondary20 w-20 flex items-center justify-center"
      onClick={handleConnectKuma}
    >
      {loading ? (
        <div className="w-4 h-4 border-white border-2 border-solid border-t-transparent animate-spin rounded-full" />
      ) : (
        "Connect"
      )}
    </button>
  );
};

export default ButtonConnectKuma;
