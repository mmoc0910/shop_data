import { useTranslation } from "react-i18next";
import Container from "../common/Container";

const AboutBox = () => {
  const { t } = useTranslation();
  return (
    <Container className="xl:w-[1000px] py-10 lg:py-20">
      <p className="font-medium text-2xl lg:text-4xl mb-5 lg:mb-7">
        {t("page.home.about.title")}
      </p>
      <ul className="list-decimal pl-5 space-y-2">
        <li className="font-medium text-lg">{t("page.home.about.heading1")}</li>
        <p>
          {t("page.home.about.content1_1")}
          <br />
          <br /> {t("page.home.about.content2_1")}
        </p>
        <li className="font-medium text-lg">{t("page.home.about.heading2")}</li>
        <p>{t("page.home.about.content2_2")}</p>
        <li className="font-medium text-lg">{t("page.home.about.heading3")}</li>
        <p>
          {t("page.home.about.content3_1")}
          <br />
          <ul className="list-disc pl-5">
            <li> {t("page.home.about.content3_1_1")}</li>
            <li> {t("page.home.about.content3_1_2")}</li>
            <li> {t("page.home.about.content_3_1_3")}</li>
          </ul>
        </p>
      </ul>
    </Container>
  );
};

export default AboutBox;
