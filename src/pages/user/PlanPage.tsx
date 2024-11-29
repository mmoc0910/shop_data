import { useEffect, useState } from "react";
import { PricingItem } from "../../components/home/PricingBox";
import { GistType, PlanType } from "../../type";
import { api } from "../../api";
import { v4 as uuidv4 } from "uuid";
import RequireAuthPage from "../../components/common/RequireAuthPage";
import { Modal, Tooltip } from "antd";
import { copyToClipboard } from "../../utils/copyToClipboard";
import { AndroidXML } from "./OrderPage";
import { DAY_FORMAT, messages } from "../../constants";
import EditKeyNameForm from "../../components/server/EditKeyNameForm";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const PlanPage = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gist, setGist] = useState<{
    _id: string;
    startDate: Date;
    endDate: Date;
    bandWidth: number;
    day: number;
    planName: string;
    extension: string;
    fileName: string;
  }>();
  useEffect(() => {
    (async () => {
      try {
        const result = await api.get<PlanType[]>("/plans");
        setPlans(
          result.data
            .filter((item) => item.status === 1)
            .sort((a, b) => b.numberPurchase - a.numberPurchase)
        );
      } catch (error) {}
    })();
  }, []);
  const handleSuccess = (gist: GistType) => {
    const {
      _id,
      planId: { name: planName, day, bandWidth },
      keyId: {
        startDate,
        endDate,
        awsId: { fileName },
      },
      extension,
    } = gist;
    setGist({
      _id,
      bandWidth,
      day,
      endDate,
      extension,
      fileName,
      planName,
      startDate,
    });
    showModal();
  };
  const handleUpdateExtension = async (_id: string, value: string) => {
    try {
      await api.patch(`/gists/extension/${_id}`, { extension: value });

      setGist((prev) =>
        prev
          ? {
              ...prev,
              extension: value,
            }
          : undefined
      );
      toast.success("Success");
    } catch (error) {
      toast.error(messages.error);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setGist(undefined);
  };
  if (plans.length > 0)
    return (
      <RequireAuthPage rolePage={[2]}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-9 w-full px-5">
          {plans.filter(item => item.enable === 1).map((plan) => (
            <PricingItem key={uuidv4()} plan={plan} onSuccess={handleSuccess} />
          ))}
        </div>
        <Modal open={isModalOpen} onCancel={handleCancel} footer={[]} centered>
          {gist && (
            <div className="pt-5 font-primary">
              <p className="text-center font-medium text-xl w-3/4 mx-auto">
                {t("packModal.heading", {
                  planName: gist.planName,
                })}
              </p>
              <div className="space-y-2 pt-5">
                <p>
                  <span className="font-medium">
                    {t("packModal.date", {
                      bandWidth: gist.bandWidth,
                      day: gist.day,
                    })}
                  </span>{" "}
                  <span>
                    <span className="text-secondary">
                      {DAY_FORMAT(gist.startDate)}
                    </span>{" "}
                    -{" "}
                    <span className="text-secondary">
                      {DAY_FORMAT(gist.endDate)}
                    </span>
                  </span>
                </p>
                <div className="flex items-baseline gap-2">
                  <div className="font-medium"> {t("packModal.keyName")}:</div>{" "}
                  <EditKeyNameForm
                    placeholder={gist.extension}
                    handleRenameKey={(name) =>
                      handleUpdateExtension(gist._id, name)
                    }
                    className="w-full flex-1"
                    inputClassName="!text-secondary"
                  />
                </div>
                <p className="font-medium flex items-center gap-1">
                  Click{" "}
                  <span>
                    <Tooltip title="Copy key">
                      <button
                        className="text-white px-2 w-fit aspect-square rounded-md bg-secondary20"
                        onClick={() =>
                          copyToClipboard(
                            `${gist.fileName.replace(/https/g, "ssconf")}#${
                              gist.extension
                            }`
                          )
                        }
                      >
                        <AndroidXML />
                      </button>
                    </Tooltip>
                  </span>{" "}
                  {t("packModal.click")}
                </p>
                <p className="">
                  [{gist.fileName.replace(/https/g, "ssconf")}#$
                  {gist.extension}]
                </p>
              </div>
            </div>
          )}
        </Modal>
      </RequireAuthPage>
    );
};

export default PlanPage;
