import { FC, memo, useState } from "react";
import { GistType, ServerType } from "../../type";
import { Modal } from "antd";
import { DropdownWithComponents } from "../dropdown";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../common/Loading";
import { api } from "../../api";
import { useTranslation } from "react-i18next";
import classNames from "../../utils/classNames";

type MoveServerProps = {
  servers: ServerType[];
  gist: GistType;
  handleReloadData: () => void;
};
const MoveServer: FC<MoveServerProps> = memo(
  ({ servers, gist, handleReloadData }) => {
    const { i18n } = useTranslation();
    const [selectServer, setSelectServer] = useState<
      { id: string; name: string } | undefined
    >({ id: gist.keyId.serverId as string, name: gist.keyId.name });
    const [loading, setLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setSelectServer(undefined);
      setIsModalOpen(false);
    };
    const handleMigratekey = async (
      keyId: string,
      serverId: string,
      serverName: string
    ) => {
      try {
        const { isConfirmed } = await Swal.fire({
          title: `<p class="leading-tight">${
            i18n.language === "vi"
              ? `Bạn có muốn dổi sang server ${serverName}`
              : i18n.language === "en"
              ? `Do you wana change location to ${serverName}`
              : `你想换到  ${serverName}`
          }</p>`,
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#1DC071",
          cancelButtonColor: "#d33",
          cancelButtonText:
            i18n.language === "vi"
              ? "Thoát"
              : i18n.language === "ci"
              ? "取消"
              : "Cancel",
          confirmButtonText:
            i18n.language === "vi"
              ? "Đồng ý"
              : i18n.language === "ci"
              ? "确定"
              : "OK",
        });
        if (isConfirmed) {
          console.log("migrate signle key");
          setLoading(true);
          await api.post(`/keys/migrate`, {
            keyId,
            serverId,
          });
          handleReloadData();
          handleCancel();
          toast.success(
            i18n.language === "vi"
              ? "Chuyển server thành công thành công"
              : i18n.language === "ci"
              ? "换server成功"
              : "Move server completed"
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error message: ", error);
          toast.error(error.response?.data.message);
        } else {
          console.log("unexpected error: ", error);
          return "An unexpected error occurred";
        }
      } finally {
        setLoading(false);
      }
    };
    return (
      <>
        {loading && <Loading />}
        <button
          className="px-2 py-1 text-xs font-medium text-white rounded-lg bg-primary font-primary shrink-0"
          onClick={showModal}
        >
          Move server
        </button>
        <Modal
          title=""
          open={isModalOpen}
          onCancel={() => {
            handleCancel();
          }}
          footer={[]}
        >
          <div className="mb-3">
            <p className="font-primary text-xl font-semibold">
              {i18n.language === "vi"
                ? "Chọn máy chủ"
                : i18n.language === "ci"
                ? "选server location"
                : "Select server location"}
              [{servers.find((item) => item._id === gist.keyId.serverId)?.name}]
            </p>
          </div>
          <div className="mb-5">
            <DropdownWithComponents>
              <DropdownWithComponents.Select
                placeholder={
                  selectServer ? (
                    <span className="text-black">
                      {servers.find((i) => i._id === selectServer.id)?.name}
                    </span>
                  ) : (
                    <span className="text-text4">
                      {i18n.language === "vi"
                        ? "Chọn máy chủ"
                        : i18n.language === "ci"
                        ? "选server location"
                        : "Select server location"}
                    </span>
                  )
                }
              ></DropdownWithComponents.Select>
              <DropdownWithComponents.List>
                {servers.map(
                  (item) => (
                    // item._id !== (gist.keyId.serverId as string) ? (
                    <DropdownWithComponents.Option
                      key={uuidv4()}
                      onClick={() =>
                        setSelectServer({ id: item._id, name: item.name })
                      }
                    >
                      <span
                        className={classNames(
                          "capitalize",
                          item._id === selectServer?.id
                            ? "font-semibold text-primary"
                            : ""
                        )}
                      >
                        {item.name} ({item.numberKey} keys)
                      </span>
                    </DropdownWithComponents.Option>
                  )
                  // ) : null
                )}
              </DropdownWithComponents.List>
            </DropdownWithComponents>
          </div>
          <div className="flex items-center justify-end gap-5">
            <button
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-error font-primary"
              onClick={() => handleCancel()}
            >
              {i18n.language === "vi"
                ? "Thoát"
                : i18n.language === "ci"
                ? "取消"
                : "Cancel"}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-secondary40 font-primary"
              onClick={() => {
                if (selectServer)
                  handleMigratekey(
                    gist.keyId._id,
                    selectServer.id,
                    selectServer.name
                  );
                else
                  toast.warn(
                    i18n.language === "vi"
                      ? "Bạn chưa chọn server"
                      : i18n.language === "ci"
                      ? "您还没有选择服务器"
                      : "You have not selected a server"
                  );
              }}
            >
              {i18n.language === "vi"
                ? "Chuyển server"
                : i18n.language === "ci"
                ? "换server"
                : "Move server"}
            </button>
          </div>
        </Modal>
      </>
    );
  }
);

export default MoveServer;
