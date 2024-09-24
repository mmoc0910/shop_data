import  { useEffect } from "react";
import { FC } from "react";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { api } from "../../api";
import Heading from "../common/Heading";

type Props = { keyId?: string };
export const HistoryExpandKey: FC<Props> = ({ keyId }) => {
  useEffect(() => {
    (async () => {
      try {
        const result = await api.post(`/transactions/history-extend-plan`, {
          keyId,
        });
        console.log("result data ~ ", result.data);
      } catch (error) {
        toast.error(messages.error);
      }
    })();
  }, [keyId]);
  return (
    <div className="space-y-7">
      <Heading>History expand key</Heading>
    </div>
  );
};
