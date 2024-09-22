import { FC, memo, useState } from "react";
import { ServerType } from "../../type";
import { Modal, Tooltip } from "antd";
import { DropdownWithComponents } from "../dropdown";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../common/Loading";
import { api } from "../../api";
import { useTranslation } from "react-i18next";
import classNames from "../../utils/classNames";
import IconArrowRightLeft from "../../icons/IconArrowRightLeft";

type MoveServerProps = {
  servers: ServerType[];
  // gist: GistType;
  gist: {
    key_id: string;
    key_name: string;
    server_id: string;
  };
  handleReloadData: () => void;
};
const MoveServer: FC<MoveServerProps> = memo(
  ({ servers, gist, handleReloadData }) => {
    const { i18n } = useTranslation();
    const [selectServer, setSelectServer] = useState<
      { id: string; name: string } | undefined
    >({ id: gist.key_id, name: gist.key_name });
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
        <Tooltip title="Move server">
          <button
            className="px-2 aspect-square grow-0 w-fit text-xs font-medium text-white rounded-md bg-secondary40 font-primary"
            onClick={showModal}
          >
            <IconArrowRightLeft className="size-4" />
          </button>
        </Tooltip>
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
              Máy chủ hiện tại:{" "}
              {servers.find((item) => item._id === gist.server_id)?.name}(
              {servers.find((item) => item._id === gist.server_id)?.numberKey})
            </p>
          </div>
          <div className="mb-5">
            <p className="font-primary text-base font-semibold mb-2">
              {i18n.language === "vi"
                ? "Chọn máy chủ"
                : i18n.language === "ci"
                ? "选server location"
                : "Select server location"}
            </p>
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
                {/* {servers.map(
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
                )} */}
                {[
                  ...servers.filter((item) => item.status === 1),
                  ...servers.filter((item) => item.status === 3),
                ].map((item) => {
                  if (item._id !== gist.server_id) {
                    return (
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
                          {item.name} ({item.numberKey} keys){" "}
                          {item.status === 3 && (
                            <span className="text-error">*</span>
                          )}
                        </span>
                      </DropdownWithComponents.Option>
                    );
                  }
                  return;
                })}
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
                    gist.key_id,
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
