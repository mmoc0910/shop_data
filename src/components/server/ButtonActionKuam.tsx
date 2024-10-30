import React from "react";
import ButtonConnectKuma from "./ButtonConnectKuma";
import ButtonRemoveKuma from "./ButtonRemoveKuma";
import { ServerType } from "../../type";
import { FC } from "react";

type Props = { server: ServerType };
export const ButtonActionKuam: FC<Props> = ({ server }) => {
  return (
    <React.Fragment>
      <ButtonConnectKuma
        server={server}
        // handleSubmit={handleSubmit}
        icon={true}
      />
      <ButtonRemoveKuma
        server={server}
        // onSubmit={handleSubmit}
        icon={true}
      />
    </React.Fragment>
  );
};
