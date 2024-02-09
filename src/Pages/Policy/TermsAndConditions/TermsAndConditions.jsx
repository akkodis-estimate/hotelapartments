import "Pages/Policy/Policy.css";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  return (
    <>
       <div className="ha--PolicyContainer">
        <div className="container">
        <div className="ha--PolicyDes">
        <div className="ha--PolicyDesHeader">
              <div className="sectionTitleDesc">
                <h2>{t("pages.policy.tandc_policy.title")}</h2>
              </div>
            </div>

            <div className="ha--PolicyDesContent">
              <div className="policyContent">
                <p>
                {t("pages.policy.tandc_policy.content1")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content15")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content2")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content16")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content3")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content17")}</h4>
                <p>
                {t("pages.policy.tandc_policy.content4")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content18")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content5")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content19")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content6")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content20")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content7")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content21")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content8")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content22")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content9")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content23")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content10")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content24")}</h4>

                <p>
                {t("pages.policy.tandc_policy.content11")}
                </p>

                <h4>{t("pages.policy.tandc_policy.content12")}</h4>

                <p>{t("pages.policy.tandc_policy.content13")}</p>

                <p>{t("pages.policy.tandc_policy.content14")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndConditions;
