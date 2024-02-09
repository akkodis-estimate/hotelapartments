import { useTranslation } from "react-i18next";

const ThankyouModal = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="modal-header border-0 p-0">
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            props.setSuccessModal(false);
          }}
        ></button>
      </div>
      <div className="modal-body p-0">
        <div className="row successModal d-flex flex-column align-items-center justify-content-center w-100">
          <div className="col-lg-12">
            <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
              <div className="otpHeader mb-5">
                <h2 className="text-center">{t("pages.thankyou_modal.thank_you")}</h2>
                <p className="text-center">
                  {t("pages.thankyou_modal.account_created")}
                </p>
              </div>

              <div className="actionBtn w-100 pt-5">
                <button
                  type="button"
                  className="AuthBtn homeBtn"
                  onClick={() => {
                    props.setSuccessModal(false);
                  }}
                >
                  {t("common_lables.Done")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThankyouModal;
