import { actions } from "reducers/customer/auth/auth.actions";
import { RoutePaths } from "Constants/Constants";
import {  useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import authenticationService from "Services/authenticationService";
import maskingActions from "reducers/masking/masking.actions";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";
import { useTranslation } from "react-i18next";
import "./otpverify.css";

const OtpPage = (props) => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorForOtp, setErrorForOtp] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (otp.length === 4) {
      handleOtpVerification();
    }
  }, [otp]);

  const handleInputChange = (e, position) => {
    const { value } = e.target;

    setOtp(otp + value);

    // Move focus to the next input field
    if (value.length === 1 && e.target.nextElementSibling) {
      e.target.nextElementSibling.focus();
    }

    // Move focus to the previous input field on backspace/delete key press
    if (value.length === 0 && e.target.previousElementSibling) {
      e.target.previousElementSibling.focus();
    }

    if (value.length === 0) {
      let newStr = otp.slice(0, position) + otp.slice(position + 1);
      setOtp(newStr);
    }
  };


  const handleOtpVerification = () => {

    const storedData = localStorage.getItem('userDetails');
    let UserData = (JSON.parse(storedData));
    let payload = {
      otp: otp,
      email: UserData ? UserData.email_address : "",
      customer_id: UserData ? UserData.customer_id : ""
    };

    dispatch(maskingActions.showMasking());
    authenticationService
      .verify_otp(payload)
      .then((res) => {

        if (res.data.statusCode !== 400) {
          navigate(RoutePaths.ACCOUNT.ACCOUNT_SETTINGS, { state: { isUpdatedOtp: true } });
          setErrorForOtp(false)
        }
        dispatch(actions.verifyUserSuccess());
      }).catch((error) => {
        setErrorForOtp(true)
        console.error(error);
        // Set error state or handle the error in another way
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  return (
    <>
      <div className="row otpMainDes accountSettingOtpDesign w-100 ">
        <div className="col-lg-6">

          <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
            <div className="otpHeader mb-5">

              <h2 className="text-center">{t("pages.AccountSettings.otp_verify.verification")}</h2>

              <p className="text-center">
                {t("pages.AccountSettings.otp_verify.verification_code")} <br /> { }
              </p>
            </div>

            <div className="otpInput d-flex gap-3 mb-5">
              {/* <input type="number" class="form-control" />
            <input type="number" class="form-control" />
            <input type="number" class="form-control" />
            <input type="number" class="form-control" /> */}
              <input
                type="text"
                maxLength={1}
                class="form-control"
                value={otp[0] || ""}
                onChange={(e) => handleInputChange(e, 0)}
              />
              <input
                type="text"
                maxLength={1}
                class="form-control"
                value={otp[1] || ""}
                onChange={(e) => handleInputChange(e, 1)}
              />
              <input
                type="text"
                maxLength={1}
                class="form-control"
                value={otp[2] || ""}
                onChange={(e) => handleInputChange(e, 2)}
              />
              <input
                type="text"
                maxLength={1}
                class="form-control"
                value={otp[3] || ""}
                onChange={(e) => handleInputChange(e, 3)}
              />
            </div>

            <span className="counterSec">60 sec.</span>

            <p className="sendAgainCode">
              {t("pages.AccountSettings.otp_verify.nootp")}{" "}

              <span className="text-decoration-underline cursor-pointer">
                {t("pages.AccountSettings.otp_verify.send_again")}
              </span>
            </p>

          </div>
        </div>
      </div>

      <ModalPopup
        show={errorForOtp}
        dialogClassName="applicationModal"
      >
        <SuccessModalPopup setSuccessModal={setErrorForOtp} Title={'Error'} Message={'Something Went Wrong With OTP, Please Check Again.'} ShowButton={false} />
      </ModalPopup>

    </>

  );
};

export default OtpPage;
