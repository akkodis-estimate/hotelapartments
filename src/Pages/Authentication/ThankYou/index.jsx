import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const ThankYou = () => {
  const { t } = useTranslation
  return (
    <div className="row otpMainDes d-flex flex-column align-items-center justify-content-center w-100">
      <div className="col-lg-3">
        <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
          <div className="otpHeader mb-5">
            <h2 className="text-center">{t("pages.thankyou_modal.thank_you")}</h2>
            <p className="text-center">
              {t("pages.thankyou_modal.account_created")}
            </p>
          </div>

          <div className="actionBtn w-100 pt-5">
            <NavLink to="/">
              <button type="button" className="AuthBtn homeBtn">
                {t("pages.thankyou_modal.go_home_page")}
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
