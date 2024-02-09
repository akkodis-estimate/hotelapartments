
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "reducers/customer/auth/auth.actions";
import maskingActions from "reducers/masking/masking.actions";
import forgetPasswordService from "Services/ForgetPasswordService";
import "./CSS/otpverify.css";
import { useTranslation } from "react-i18next";

const ForgetPasswordOtp = (props) => {

    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

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
            // setOtp(otp.slice(0, -1));
            let newStr = otp.slice(0, position) + otp.slice(position + 1);
            setOtp(newStr);
        }
    };
    const handleOtpVerification = () => {

        const storedData = localStorage.getItem('userDetails');
        var UserData = (JSON.parse(storedData));
        var payload = {
            otp: otp ? otp : "",
            email: UserData ? UserData.email_address : "",
            customer_id: UserData ? UserData.customer_id : ""
        };

        dispatch(maskingActions.showMasking());
        forgetPasswordService
            .verify_otp(payload)
            .then((res) => {

                if (res.data.statusCode !== 400) {
                    // navigate(RoutePaths.ACCOUNT.ACCOUNT_SETTINGS, { state: { isUpdatedOtp: true } });
                    // setErrorForOtp(false);
                    // setIsUpdatedOtp(true);
                    // setUserDetailsScreen(true);
                    // setOtpScreen(false);
                    setOtp("");
                }
                dispatch(actions.verifyUserSuccess());

            }).catch((error) => {
                //setErrorForOtp(true)
                setOtp("");
                console.error(error);
                // Set error state or handle the error in another way
            })
            .finally(() => {

                dispatch(maskingActions.hideMasking());
            });
    };

    const { t } = useTranslation();


    return (

        <div className="row otpMainDes d-flex flex-column align-items-center justify-content-center w-100 ha--Otp">
            <div className="col-lg-4">

                <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
                    <div className="otpHeader mb-5">
                        <h2 className="text-center">{t("pages.AccountSettings.otp_verify.verification")}</h2>
                        <p className="text-center">
                            {t("pages.AccountSettings.otp_verify.verification_code")}.{" "}
                        </p>
                    </div>
                    <div className="otpInput d-flex gap-3 mb-5">

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
    );
};

export default ForgetPasswordOtp;
