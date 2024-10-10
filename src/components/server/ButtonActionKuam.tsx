import React from "react";
import ButtonConnectKuma from "./ButtonConnectKuma";
import ButtonRemoveKuma from "./ButtonRemoveKuma";
import { ServerType } from "../../type";
import { FC } from "react";

type Props = { server: ServerType; handleSubmit: () => void };
export const ButtonActionKuam: FC<Props> = ({ server, handleSubmit }) => {
  return (
    <React.Fragment>
      <ButtonConnectKuma server={server} handleSubmit={handleSubmit} />
      <ButtonRemoveKuma server={server} onSubmit={handleSubmit} icon={true} />
    </React.Fragment>
  );
};
