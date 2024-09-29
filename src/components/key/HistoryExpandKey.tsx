import { useEffect, useState } from "react";
import { FC } from "react";
import { toast } from "react-toastify";
import { messages } from "../../constants";
import { api } from "../../api";
import Heading from "../common/Heading";
import { HistoryExpandKeyType } from "../../type";

type Props = { keyId?: string };
export const HistoryExpandKey: FC<Props> = ({ keyId }) => {
  const [data, setData] = useState<HistoryExpandKeyType[]>([]);
  console.log('data ~ ', data)
  useEffect(() => {
    (async () => {
      try {
        const result = await api.post<HistoryExpandKeyType[]>(
          `/transactions/history-extend-plan`,
          {
            keyId,
          }
        );
        setData(result.data);
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
