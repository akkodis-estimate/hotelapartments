import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const SuccessPage = () => {
  const { t } = useTranslation();
  return (
    <div className="otpMainDes ha--forgotFlow ha--successFlow">
      
        <div className="ha--forgotFlowDes">
          <div className="otpHeader">
            <h2 className="text-center">{t("pages.login.success.title")}</h2>
            <p className="text-center">
              {t("pages.login.success.save_success")}
            </p>
          </div>

          <div className="actionBtn w-100 ">
            <NavLink to="/sign-in">
              <button type="button" className="AuthBtn homeBtn">
                {t("pages.login.sign_in")}
              </button>
            </NavLink>
          </div>
        </div>
     
    </div>
  );
};

export default SuccessPage;
