import { useEffect, useMemo, useState } from "react";
import { FC } from "react";
import { toast } from "react-toastify";
import { DAY_FORMAT, messages } from "../../constants";
import { api } from "../../api";
import Heading from "../common/Heading";
import { Table, TableColumnsType } from "antd";
import { VND } from "../../utils/formatPrice";
import { HistoryUpgradeKeyType } from "../../type";

type Props = { keyId?: string };
export const HistoryUpgradeKey: FC<Props> = ({ keyId }) => {
  const [data, setData] = useState<HistoryUpgradeKeyType[]>([]);
  const [loading, setLoading] = useState(false);
  // 66e63db73bdbaf0c7b37a0ce
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const result = await api.post<HistoryUpgradeKeyType[]>(
          `/transactions/history-upgrade-plan`,
          {
            keyId,
          }
        );
        setData(result.data);
      } catch (error) {
        toast.error(messages.error);
      } finally {
        setLoading(false);
      }
    })();
  }, [keyId]);
  const columns: TableColumnsType<HistoryUpgradeKeyType> = useMemo(
    () => [
      {
        title: <p className="font-semibold font-primary">Plan Name</p>,
        dataIndex: "name",
        key: "name",
        render: (_text: string, record) => (
          <p className="text-sm font-primary">{record.planId.name}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Description</p>,
        dataIndex: "description",
        key: "description",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Price</p>,
        dataIndex: "money",
        key: "money",
        render: (text: number) => (
          <p className="text-sm font-primary">{VND.format(text)}VND</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Discount</p>,
        dataIndex: "discount",
        key: "discount",
        render: (text: string) => (
          <p className="text-sm font-primary">{text}%</p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Money</p>,
        dataIndex: "Price",
        key: "Price",
        render: (_, record) => (
          <p className="text-sm font-primary">
            {VND.format(record.money * ((100 - record.discount) / 100))}VND
          </p>
        ),
      },
      {
        title: <p className="font-semibold font-primary">Created At</p>,
        dataIndex: "createdAt",
        key: "createdAt",
        render: (text: Date) => (
          <p className="text-sm font-primary">{DAY_FORMAT(text)}</p>
        ),
      },
      // {
      //   title: <p className="font-semibold font-primary">EndExpand Date</p>,
      //   dataIndex: "endExpandDate",
      //   key: "endExpandDate",
      //   render: (_, record) => (
      //     <p className="text-sm font-primary">
      //       {record.gistId.keyId.endExpandDate &&
      //         DAY_FORMAT(record.gistId.keyId.endExpandDate)}
      //     </p>
      //   ),
      // },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  if (data.length === 0 && !loading) return;
  return (
    <div className="space-y-7">
      <Heading>History upgrade key</Heading>
      <div className="rounded-xl border-2 border-[#eeeeed] overflow-hidden">
        <Table
          loading={loading}
          dataSource={data}
          columns={columns}
          pagination={{ hideOnSinglePage: true }}
        />
      </div>
    </div>
  );
};
