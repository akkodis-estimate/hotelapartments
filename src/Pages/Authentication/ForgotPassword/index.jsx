import {  useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { actions } from "reducers/customer/auth/auth.actions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import maskingActions from "reducers/masking/masking.actions";
import forgetPasswordService from "Services/ForgetPasswordService";
import authCustomers from "Services/AuthCustomers";
import "./forgotpassword.css";
import PasswordEye from "Components/Shared/PasswordEye/PasswordEye";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";
import validationHelper from "Helpers/validationHelper";
import SuccessPage from "../SuccessPage/success";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import { addStateToUrl } from "Helpers/commonMethodHelper";

const ForgotPassword = (props) => {
  const defaultPhoneForm = {
    phone: "",
  };

  const defaultPhoneFormValidation = {
    phone: "",
  };
  const defaultVerifyForm = {
    phone: "",
    code: "",
  };

  const defaultChangePassForm = {
    phone: "",
    confirm_password: "",
    new_password: "",
  };

  const defaultchangePassFormValidation = {
    phone: "",
    confirm_password: "",
    new_password: "",
  };

  const [setScreen, setsetScreen] = useState(1);
  const [successModal, setSuccessModal] = useState(false);

  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.customerAuth);

  const [phoneFormData, setPhoneFormData] = useState(defaultPhoneForm);
  const [verifyFormData, setverifyFormData] = useState(defaultVerifyForm);
  const [changePassFormData, setChangePassFormData] = useState(
    defaultChangePassForm
  );

  const [phoneFormValidation, setPhoneFormValidation] = useState(
    defaultPhoneFormValidation
  );
  const [changePassFormValidation, setChangePassFormValidation] = useState(
    defaultchangePassFormValidation
  );

  const [isMobileiew, setIsMobileView] = useState();

  const [disableResetPassword, setDisableResetPassword] = useState(true);
  const [showPassword, setshowPassword] = useState(false);
  const [showResetPassword, setshowResetPassword] = useState(false);
  const [disablePasswordButton, setdisablePasswordButton] = useState(true); // this for save one item Data and show it to mobile view only.

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
    const storedData = localStorage.getItem("userDetails");

    var UserData = JSON.parse(storedData);

    var payload = {
      phone: phoneFormData.phone,
      code: otp ? otp : "",
    };

    dispatch(maskingActions.showMasking());
    // debugger
    authCustomers
      .forget_password_verify(payload)
      .then((res) => {
        
        if (res.data.statusCode !== 400) {
          setOtp("");
        }
        dispatch(actions.verifyUserSuccess());
        if (res.data.status === "OK") {
          setsetScreen(3);
          const newUrl = window.location.pathname + "#newpassword";
          const statenew = { screen_id: 2 };
          addStateToUrl(window.location.pathname, newUrl, statenew, {
            screen_id: 3,
          });
        } else {
          setSuccessModal(true);
        }
      })
      .catch((error) => {
        setOtp("");
        // console.error(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again");
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  const { t } = useTranslation();

  const runPhoneValidations = () => {
    const updatedValidations = {
      phone:
        setScreen === 1
          ? phoneFormData.phone
            ? isValidPhoneNumber(phoneFormData.phone)
              ? ""
              : "validation.invalid_input"
            : "validation.required"
          : "",
    };
    return updatedValidations;
  };

  const runPasswordValidations = () => {
    const updatedValidations = {
      new_password: validationHelper.validatePasswordPolicy(
        changePassFormData.new_password
      ),
      confirm_password: validationHelper.validateCPassword(
        changePassFormData.confirm_password,
        changePassFormData.new_password
      ),
    };
    return updatedValidations;
  };

  const PhoneFormSubmit = async (e) => {
    e.preventDefault();
    const errors = runPhoneValidations();

    
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;

    if (isRequiredFieldsAreValid) {
      dispatch(maskingActions.showMasking());
      forgetPasswordService
        .forget_password_by_mobile(phoneFormData)
        .then((res) => {
          // toast.success(t('toaster_message.edit_success'));
          //setPhoneFormData(res.data);
          setsetScreen(2);
          const newUrl = window.location.pathname + "#verify";
          const statenew = { screen_id: 1 };
          addStateToUrl(window.location.pathname, newUrl, statenew, {
            screen_id: 2,
          });
          // setdrawerOpen(false);
          // setdrawerOpenOtp(true);
          // props.setAddCustomers(false);
        })
        .catch((res) => {
          // if (
          //   res?.response?.data?.errors?.message &&
          //   res?.response?.data?.errors?.message?.includes(
          //     "Email is already taken"
          //   )
          // ) {
          //   toast.error(res?.response?.data?.message);
          // } else {
          //   toast.error(res.message);
          // }
          toast.error(res?.response?.data?.message);
        })
        .finally(() => {
          dispatch(maskingActions.hideMasking());
        });
    } else {
      setPhoneFormValidation(errors);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const errors = runPasswordValidations();
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;

    if (isRequiredFieldsAreValid) {
      var data = {
        phone: phoneFormData.phone,
        password: changePassFormData.new_password,
        password2: changePassFormData.confirm_password,
      };
      dispatch(maskingActions.showMasking());
      authCustomers
        .change_password_verify(data)
        .then((res) => {
          
          if (res.status === 200) {
            setsetScreen(4);
            const newUrl = window.location.pathname + "#success";
            const statenew = { screen_id: 3 };
            addStateToUrl(window.location.pathname, newUrl, statenew, {
              screen_id: 4,
            });
          }
        })
        .finally(() => {
          dispatch(maskingActions.hideMasking());
        });
    } else {
      setChangePassFormValidation(errors);
    }
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const errors = {
      ...changePassFormValidation,
    };

    switch (name) {
      case "new_password":
        errors[name] = validationHelper.validatePasswordPolicy(value);
        break;

      case "confirm_password": //new_password
        errors[name] = validationHelper.validateCPassword(
          value,
          changePassFormData.new_password
        );
        break;

      default:
        console.error(`Found unknown field - ${name}`);
    }

    setChangePassFormValidation(errors);
    setChangePassFormData({
      ...changePassFormData,
      [name]: value,
    });
  };

  const [seconds, setSeconds] = useState(60);
  const requestRef = useRef();
  const startTimeRef = useRef();
  const [drawerOpen, setdrawerOpen] = useState(false);
  const navigate = useNavigate();

  const animate = (timestamp) => {
    // debugger
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsedTime = timestamp - startTimeRef.current;
    const remainingSeconds = Math.max(60 - Math.floor(elapsedTime / 1000), 0);

    setSeconds(remainingSeconds);

    if (remainingSeconds > 0) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (setScreen === 2) {
      // debugger;
      startTimeRef.current = performance.now(); // Update the start time
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [setScreen]);

  // useEffect(() => {
  //   if (otp.length === 4) {
  //     handleOtpVerification();
  //   }
  // }, [otp]);

  const handleResendOtp = () => {
    dispatch(maskingActions.showMasking());
    forgetPasswordService
      .forget_password_by_mobile(phoneFormData)
      .then((res) => {
        toast.success("Otp sent successfully");
        //setPhoneFormData(res.data);
        // setsetScreen(2);
        resetTimer();

        // props.setAddCustomers(false);
      })
      .catch((res) => {
        toast.error(res?.response?.data?.message);
        // if (
        //   res?.response?.data?.errors?.message &&
        //   res?.response?.data?.errors?.message?.includes(
        //     "Email is already taken"
        //   )
        // ) {
        //   toast.error(res?.response?.data?.message);
        // } else {
        //   toast.error(res.message);
        // }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  const resetTimer = () => {
    setSeconds(60);
    startTimeRef.current = performance.now(); // Update the start time
    requestRef.current = requestAnimationFrame(animate);
  };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      // debugger;
      if (windowWidth <= ScreenResolutions.Width) {
        setdrawerOpen(true);
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (windowWidth <= ScreenResolutions.Width) {
      setdrawerOpen(true);
    }
  }, []);
  useEffect(() => {
    // Add a popstate event listener to handle changes to the URL/state
    const handlePopState = (event) => {
      // // Get the state from the event object
      const newState = event.state;
      // // Update the component's state with the new state
      if (newState.screen_id) {
        // setMessage(newState.message);
        
        setsetScreen(newState.screen_id ? newState.screen_id : 1);
      } else {
        setsetScreen(1);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleDrawerClose = (value) => {
    setdrawerOpen(value);
    navigate(RoutePaths.AUTHORISATION.SIGN_IN);
  };

  return (
    <>
      {setScreen === 1 && (
        <>
          {windowWidth > ScreenResolutions.Width ? (
            <div className="otpMainDes ha--forgotFlow">
              <div className="ha--forgotFlowDes">
                <form>
                  <div className="otpDesign ">
                    <div className="otpHeader ">
                      <h2 className="text-center">{t("pages.login.forgot")}</h2>
                      <p className="text-center">
                        {t("pages.login.forgot_text")} <br />
                        {t("pages.login.verify_code")}
                      </p>
                    </div>
                    <div className="frgtNumberInput ha--frgtNumberInput">
                      <label className="label">
                        {t("pages.AccountSettings.personal_info.phone_number")}{" "}
                        <span className="required">*</span>
                      </label>

                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        className="form-control frgtInput d-flex"
                        placeholder={t(
                          "pages.AccountSettings.personal_info.phone_number"
                        )}
                        value={phoneFormData.phone}
                        name="phone"
                        defaultCountry="AE"
                        onChange={(e) => {
                          
                          const errors = {
                            ...phoneFormValidation,
                          };
                          
                          errors["phone"] = e
                            ? isValidPhoneNumber(e)
                              ? undefined
                              : "validation.invalid_input"
                            : "validation.required";
                            if (!errors["phone"]) {
                              setdisablePasswordButton(false);                              
                            }else{
                              setdisablePasswordButton(true);                              
                            }
                          setPhoneFormValidation(errors);

                          setPhoneFormData((prevState) => {
                            return { ...prevState, phone: e };
                          });
                        }}
                      />
                      {phoneFormValidation.phone && (
                        <div className="invalid">
                          {t(phoneFormValidation.phone)}
                        </div>
                      )}
                    </div>
                    <div className="d-none">
                      <input type="number" className="form-control" />
                    </div>
                    <div className="actionBtn">
                      {/* <NavLink to=""> */}
                        <button
                          type="button"
                          className={`AuthBtn frgtBtn ${
                            disablePasswordButton
                              ? "disable"
                              : ""
                          }`} 
                          //onClick={handleSendOtp}
                          onClick={PhoneFormSubmit}
                          disabled={
                            disablePasswordButton
                             ? true
                             : false
                         }
                        >
                          {t("pages.login.continue")}
                        </button>
                      {/* </NavLink> */}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <>
              <MobileDrawer
                openDrawer={drawerOpen}
                setopenDrawer={handleDrawerClose}
                isFullScreen={true}
              >
                <div className="ha--mobileForgotPass">
                  
                    <form>
                     
                        <div className="ha--mobileForgotPass-header">
                          <h2 className="text-center">
                            {t("pages.login.forgot")}
                          </h2>
                          <p className="text-center">
                            {t("pages.login.forgot_text")} <br />
                            {t("pages.login.verify_code")}
                          </p>
                        </div>
                        <div className="ha--mobileForgotPass-input">
                          <label className="label">
                            {t(
                              "pages.AccountSettings.personal_info.phone_number"
                            )}{" "}
                            <span className="required">*</span>
                          </label>

                          <PhoneInput
                            international
                            countryCallingCodeEditable={false}
                            className="form-control frgtInput d-flex"
                            placeholder={t(
                              "pages.AccountSettings.personal_info.phone_number"
                            )}
                            value={phoneFormData.phone}
                            name="phone"
                            defaultCountry="AE"
                            onChange={(e) => {
                              
                              const errors = {
                                ...phoneFormValidation,
                              };
                              
                              errors["phone"] = e
                                ? isValidPhoneNumber(e)
                                  ? undefined
                                  : "validation.invalid_input"
                                : "validation.required";
                                if (!errors["phone"]) {
                                  setdisablePasswordButton(false);                              
                                }else{
                                  setdisablePasswordButton(true);                              
                                }
                              setPhoneFormValidation(errors);

                              setPhoneFormData((prevState) => {
                                return { ...prevState, phone: e };
                              });
                            }}
                          />
                          {phoneFormValidation.phone && (
                            <div className="invalid">
                              {t(phoneFormValidation.phone)}
                            </div>
                          )}
                        </div>
                        <div className="d-none">
                          <input type="number" className="form-control" />
                        </div>
                        <div className="actionBtn">
                          {/* <NavLink to=""> */}
                            <button
                              type="button"
                              // className="AuthBtn"
                              className={`AuthBtn ${
                                disablePasswordButton
                                  ? "disable"
                                  : ""
                              }`} 
                              //onClick={handleSendOtp}
                              onClick={PhoneFormSubmit}
                              disabled={
                                disablePasswordButton
                                 ? true
                                 : false
                             }
                            >
                              {t("pages.login.continue")}
                            </button>
                          {/* </NavLink> */}
                        </div>
                      
                    </form>
                  
                </div>
              </MobileDrawer>
            </>
          )}
        </>
      )}
      {setScreen === 2 && (
        <>
          {windowWidth > ScreenResolutions.Width ? (
            <>
              <div className="otpMainDes ha--forgotFlow">
                <div className="ha--forgotFlowDes">
                  <div className="otpDesign">
                    <div className="otpHeader">
                      <h2 className="text-center">
                        {t("pages.AccountSettings.otp_verify.verification")}
                      </h2>
                      <p className="text-center">
                        {t(
                          "pages.AccountSettings.otp_verify.verification_code"
                        )}
                        .{" "}
                      </p>
                    </div>
                    <div className="otpInput ha--otpInput">
                      <input
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[0] || ""}
                        onChange={(e) => handleInputChange(e, 0)}
                      />
                      <input
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[1] || ""}
                        onChange={(e) => handleInputChange(e, 1)}
                      />
                      <input
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[2] || ""}
                        onChange={(e) => handleInputChange(e, 2)}
                      />
                      <input
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[3] || ""}
                        onChange={(e) => handleInputChange(e, 3)}
                      />
                    </div>
                   
                    <p className="sendAgainCode ha--SendAgain">
                    <span className="counterSec">{seconds} sec.</span>
                      Don't get a code? &nbsp;
                      <span
                        className={`text-decoration-underline cursor-pointer ${
                          seconds === 0 ? "" : "otpDisabled"
                        }`}
                        onClick={handleResendOtp}
                      >
                        Send again
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <ModalPopup
                show={successModal}
                dialogClassName="applicationModal"
              >
                <SuccessModalPopup
                  setSuccessModal={setSuccessModal}
                  Title={"Incorrect OTP"}
                  Message={"Please Check the OTP."}
                  ShowButton={false}
                />
              </ModalPopup>
            </>
          ) : (
            <>
              <MobileDrawer
                openDrawer={drawerOpen}
                setopenDrawer={handleDrawerClose}
                size="100%"
                isFullScreen={true}
              >
                <div className="ha--mobileForgotPass">
                  
                    <div className="ha--mobileForgotPass-header">
                      <div className="otpHeader">
                        <h2 className="text-center">
                          {t("pages.AccountSettings.otp_verify.verification")}
                        </h2>
                        <p className="text-center">
                          {t(
                            "pages.AccountSettings.otp_verify.verification_code"
                          )}
                          .{" "}
                        </p>
                      </div>
                      <div className="otpInput ha--mobileOtp">
                        <input
                          type="text"
                          maxLength={1}
                          className="form-control"
                          value={otp[0] || ""}
                          onChange={(e) => handleInputChange(e, 0)}
                        />
                        <input
                          type="text"
                          maxLength={1}
                          className="form-control"
                          value={otp[1] || ""}
                          onChange={(e) => handleInputChange(e, 1)}
                        />
                        <input
                          type="text"
                          maxLength={1}
                          className="form-control"
                          value={otp[2] || ""}
                          onChange={(e) => handleInputChange(e, 2)}
                        />
                        <input
                          type="text"
                          maxLength={1}
                          className="form-control"
                          value={otp[3] || ""}
                          onChange={(e) => handleInputChange(e, 3)}
                        />
                      </div>
                     
                      <p className="sendAgainCode">
                      <span className="counterSec">{seconds} sec.</span>
                        Don't get a code? &nbsp;
                        <span
                          className={`text-decoration-underline cursor-pointer ${
                            seconds === 0 ? "" : "otpDisabled"
                          }`}
                          onClick={handleResendOtp}
                        >
                          Send again
                        </span>
                      </p>
                    </div>
                  
                </div>
              </MobileDrawer>
            </>
          )}
        </>
      )}
      {setScreen === 3 && (
        <>
          {windowWidth > ScreenResolutions.Width ? (
            <div className="otpMainDes ha--forgotFlow">
              <div className="ha--forgotFlowDes">
               
                  <form>
                    <div className="otpDesign">
                      <div className="otpHeader ha--setNewPass">
                        <h2>{t("pages.login.set_new_pswd")}</h2>
                        <p>{t("pages.login.new_password")}</p>
                      </div>
                      <div className="frgtNumberInput ha--frgtNumberInput ha--setPassCust">
                        <div>
                          <label className="form-label">
                            {t("pages.login.new_password")}
                          </label>
                          <div className="w-100 position-relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              name="new_password"
                              // value={formData.new_password}
                              className="form-control"
                              placeholder="New Password"
                              onChange={handleTextChange}
                            />
                            {changePassFormValidation.new_password && (
                              <div className="invalid">
                                {t(changePassFormValidation.new_password)}
                              </div>
                            )}
                            <PasswordEye
                              paddingStyle={"9px 9px"}
                              showPassword={showPassword}
                              setshowPassword={setshowPassword}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="form-label">
                            {t("pages.login.confirm_password")}
                          </label>
                          <div className="w-100 position-relative">
                            <input
                              type={showResetPassword ? "text" : "password"}
                              name="confirm_password"
                              //    value={formData.confirm_password}
                              className="form-control"
                              placeholder="Confirm Password"
                              onChange={handleTextChange}
                            />
                            {changePassFormValidation.confirm_password && (
                              <div className="invalid">
                                {t(changePassFormValidation.confirm_password)}
                              </div>
                            )}
                            <PasswordEye
                              paddingStyle={"9px 9px"}
                              showPassword={showResetPassword}
                              setshowPassword={setshowResetPassword}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="actionBtn ha--SetPassBtn">
                        <button
                          type="button"
                         // className="AuthBtn"
                          onClick={handleFormSubmit}

                          className={`AuthBtn ${(() => {
                            const errors = runPasswordValidations();
                            const isRequiredFieldsAreValid = Object.keys(errors).filter((key) => errors[key]).length === 0;
                            return isRequiredFieldsAreValid ? '' : 'disable';
                          })()}`}
          
                          disabled={(() => {
                            const errors = runPasswordValidations();
                            const isRequiredFieldsAreValid = Object.keys(errors).filter((key) => errors[key]).length === 0;
                            return isRequiredFieldsAreValid ? false : true;
                          })()}
                        >
                          {t("pages.login.update")}
                        </button>
                      </div>
                    </div>
                  </form>
                
              </div>
            </div>
          ) : (
            <>
              <MobileDrawer
                openDrawer={drawerOpen}
                setopenDrawer={handleDrawerClose}
                isFullScreen={true}
              >
                <div className="ha--mobileForgotPass">
                 
                  
                      <form>
                        <div className="ha--mobileForgotPass-header">
                          <div className="otpHeader text-center">
                            <h2>{t("pages.login.set_new_pswd")}</h2>
                            <p>{t("pages.login.new_password")}</p>
                          </div>
                          <div className="authForm w-100">
                            <div className="ha--mobileForgotPass-input">
                              <label className="form-label">
                                {t("pages.login.new_password")}
                              </label>
                              <div className="w-100 position-relative">
                                <input
                                  type={showPassword ? "text" : "password"}
                                  name="new_password"
                                  // value={formData.new_password}
                                  className="form-control"
                                  placeholder="New Password"
                                  onChange={handleTextChange}
                                />
                                {changePassFormValidation.new_password && (
                                  <div className="invalid">
                                    {t(changePassFormValidation.new_password)}
                                  </div>
                                )}
                                <PasswordEye
                                  paddingStyle={"9px 9px"}
                                  showPassword={showPassword}
                                  setshowPassword={setshowPassword}
                                />
                              </div>
                            </div>

                            <div className="ha--mobileForgotPass-input">
                              <label className="form-label">
                                {t("pages.login.confirm_password")}
                              </label>
                              <div className="w-100 position-relative">
                                <input
                                  type={showResetPassword ? "text" : "password"}
                                  name="confirm_password"
                                  //    value={formData.confirm_password}
                                  className="form-control"
                                  placeholder="Confirm Password"
                                  onChange={handleTextChange}
                                />
                                {changePassFormValidation.confirm_password && (
                                  <div className="invalid">
                                    {t(
                                      changePassFormValidation.confirm_password
                                    )}
                                  </div>
                                )}
                                <PasswordEye
                                  paddingStyle={"9px 9px"}
                                  showPassword={showResetPassword}
                                  setshowPassword={setshowResetPassword}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="actionBtn w-100">
                            <button
                              type="button"
                              //className="AuthBtn"
                              
                              className={`AuthBtn ${(() => {
                                const errors = runPasswordValidations();
                                const isRequiredFieldsAreValid = Object.keys(errors).filter((key) => errors[key]).length === 0;
                                return isRequiredFieldsAreValid ? '' : 'disable';
                              })()}`}
              
                              disabled={(() => {
                                const errors = runPasswordValidations();
                                const isRequiredFieldsAreValid = Object.keys(errors).filter((key) => errors[key]).length === 0;
                                return isRequiredFieldsAreValid ? false : true;
                              })()}

                              onClick={handleFormSubmit}
                            >
                              {t("pages.login.update")}
                            </button>
                          </div>
                        </div>
                      </form>
                   
                 
                </div>
              </MobileDrawer>
            </>
          )}
        </>
      )}
      {setScreen === 4 && (
        <>
          {windowWidth > ScreenResolutions.Width ? (
            <SuccessPage></SuccessPage>
          ) : (
            <MobileDrawer
              openDrawer={drawerOpen}
              setopenDrawer={handleDrawerClose}
              isFullScreen={true}
            >
              <SuccessPage></SuccessPage>
            </MobileDrawer>
          )}
        </>
      )}
      {/* <MyComponent /> */}
    </>
  );
};

export default ForgotPassword;
