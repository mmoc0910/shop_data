import { useTranslation } from "react-i18next";
import Container from "../common/Container";
import { useEffect, useState } from "react";
import { CollabType, CommisionType } from "../../type";
import { api } from "../../api";

const CTVBox = () => {
  const { t } = useTranslation();
  const [collab, setCollab] = useState<CollabType>();
  const [commision, setCommision] = useState<CommisionType>()
  useEffect(() => {
    (async () => {
      try {
        const [
          { data: dataCommision },
          { data: dataCollab },
        ] = await Promise.all([
          api.get<CommisionType>("/commisions"),
          api.get<CollabType>("/collab"),
        ]);
        setCollab(dataCollab)
        setCommision(dataCommision)
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <Container className="xl:w-[1000px] pt-10 lg:pt-20 pb-10 ">
      <div className="">
        <p className="font-medium text-2xl lg:text-4xl mb-5 lg:mb-7">
          {t("page.home.ctv.heading")}
        </p>
        <ul className="list-disc pl-5 space-y-3 lg:space-y-5">
          <li>{t("page.home.ctv.content1", { amount: commision?.value})}</li>
          <li>{t("page.home.ctv.content2", { amount: collab?.level3})}</li>
          <li>{t("page.home.ctv.content3")}</li>
        </ul>
      </div>
    </Container>
  );
};

export default CTVBox;
