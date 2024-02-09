import { useEffect, useState } from "react";
import PasswordEye from "Components/Shared/PasswordEye/PasswordEye";
import FBIcon from "Assets/Images/AuthenticationIcons/FBIcon";
import GoogleIcon from "Assets/Images/AuthenticationIcons/GoogleIcon";
import AuthImg from "Assets/Images/AuthenticationIcons/authImg.png";
import {  useLocation, useNavigate } from "react-router-dom";
import validationHelper from "Helpers/validationHelper";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { actions } from "reducers/customer/auth/auth.actions";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";
import { userRegisterAsync } from "reducers/customer/auth/auth.thunks";
import maskingActions from "reducers/masking/masking.actions";
import authenticationService from "Services/authenticationService";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import ReactFacebookLogin from "react-facebook-login";
import { environment } from "environment";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import OTPVerify from "../OtpVerify";
import "Pages/Authentication/Signup/Signup.css"

const Signup = () => {
  // Set default form data
  const defaultFormData = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    cpassword: "",
  };

  // Declare a constant variable to store the default form validation values
  const defaultFormValidation = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    cpassword: "",
  };

  // Initialize formData and formValidation states
  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);

  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [button, setButtonState] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isRegisterSuccess, userDetails } = useSelector(
    (state) => state.customerAuth
  );
  const { t } = useTranslation();
  const [openDrawer, setopenDrawer] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (isRegisterSuccess) {
      //   showSuccessToast({
      //   	title: 'User registered successfully.',
      //   	message: 'Check mail for account verification.',
      //   })
      //   dispatch(authActions.resetState())
      const { innerWidth: width, innerHeight: height } = window;

      dispatch(actions.resetState());
      

      if (width <= ScreenResolutions.Width) {
        //device is mobile
        setopenDrawer(true);
      } else {
        navigate(RoutePaths.AUTHORISATION.OTP_VERIFY, {
          state: { email: formData.email, number: formData.phone_number, password: formData.password, start_date: location.state?.start_date, end_date: location?.state?.end_date, returnPath: location?.state?.returnPath },
        });
      // debugger

        setFormData(defaultFormData);
      }
    }
    // if (userDetails) {
    //   navigate("/");
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRegisterSuccess]);

  // useEffect(() => {
  //   if (userDetails) {
  //     // debugger

  //      // Navigate the user back to the specific page
  //      const { innerWidth: width, innerHeight: height } = window;
  //      if (width <= ScreenResolutions.Width) {
  //        const returnPath = redirectState?.returnPath || "/";
  //        if (redirectState?.start_date && redirectState?.end_date) {
  //          navigate(returnPath, {
  //            state: {
  //              start_date: redirectState?.start_date,
  //              end_date: redirectState?.end_date,
  //            },
  //          });
  //        } else {
  //          navigate(returnPath);
  //        }
  //      }
  //      else{
  //        const returnPath = location.state?.returnPath || "/";
  //        if (location.state?.start_date && location?.state?.end_date) {
  //          navigate(returnPath, {
  //            state: {
  //              start_date: location.state?.start_date,
  //              end_date: location?.state?.end_date,
  //            },
  //          });
  //        } else {
  //          navigate(returnPath);
  //        }
  //      }

  //     navigate("/");
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [userDetails]);

  const runValidations = () => {
    const updatedValidations = {
      first_name: validationHelper.validateName(formData.first_name),
      last_name: validationHelper.validateName(formData.last_name),
      password: validationHelper.validatePasswordPolicy(
        formData.password,
        formData.first_name,
        formData.last_name
      ),
      email: validationHelper.validateMailId(formData.email),
      // phone_number: validationHelper.validateMobileNo(formData.phone_number),
      cpassword: validationHelper.validateCPassword(
        formData.password,
        formData.cpassword
      ),
    };

    // Set updated validation errors
    return updatedValidations;
  };

  // Function to handle text change in the form
  const handleTextChange = (e) => {
    e.preventDefault();
    // Get the name and value of the field
    const { name, value } = e.target;
    // Copy the existing form validation object
    const errors = {
      ...formValidation,
    };
    // Switch on the field name to validate the value
    switch (name) {
      case "first_name":
        errors[name] = validationHelper.validateName(value, "First Name");
        break;

      case "password":
        errors[name] = validationHelper.validatePasswordPolicy(
          value,
          formData.first_name,
          formData.last_name
        );
        break;

      case "email":
        errors[name] = validationHelper.validateMailId(value);
        break;

      case "last_name":
        errors[name] = validationHelper.validateName(value, "Last Name");
        break;

      // case "phone_number":
      //   errors[name] = validationHelper.validateMobileNo(value);
      //   break;

      case "cpassword":
        errors[name] = validationHelper.validateCPassword(
          formData.password,
          value
        );
        break;

      default:
        console.error(`Found unknown field - ${name}`);
    }

    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;

    if (isRequiredFieldsAreValid) {
      setButtonState(false);
    } else {
      setButtonState(true);
    }

    // Update the form validation object
    setFormValidation(errors);
    // Update the form data
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    // Prevent the default form submission
    if (e) e.preventDefault();
    // Run validations on the form fields
    const errors = runValidations();
    // Check if all required fields are valid
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;
    // If all required fields are valid, create the payload
    if (isRequiredFieldsAreValid) {
      var { cpassword, ...payload } = { ...formData };
      
      dispatch(userRegisterAsync(payload));
      // dispatch(
      //   actions.registerCustomerSuccess({
      //     customer_id: 49,
      //     customer_sid: "CUS-B3216DCD-A674-42DA-959B-142201A8B935",
      //     email_address: "a.k@yopmail.com",
      //     first_name: "Aarti",
      //     is_password_updated: false,
      //     last_name: "kantariya",
      //     phone_number: "+971745312653",
      //     type: 1,
      //   })
      // );
      // dispatch(userLoginAsync(payload));
    } else {
      // Otherwise, set the form validation errors
      setFormValidation(errors);
      // showErrorToast('To complete the registration please fill the mandatory filed data.')
    }
  };

  // Use the useGoogleLogin hook
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleLogin(tokenResponse),
    onError: () => {
      toast.error(<span>{t("toaster_message.error")}</span>);
    },
    flow: "auth-code",
    cookiePolicy: "single_host_origin",
  });

  const handleGoogleLogin = async (googleData) => {
    try {
      
      dispatch(maskingActions.showMasking());
      const response = await authenticationService.google_login({
        token: googleData.code, // Use the code from googleData instead of googleData.credential
      });
      
      dispatch(actions.loginCustomerSuccess(response.data));
      dispatch(maskingActions.hideMasking());
      toast.success("Login successful 🔓");

      // const data = await authService.googleLogin(googleData.tokenId);
      // setTimeout(() => {
      //   setUserState(data);
      //   setRedirectToReferrer(true);
      //   setIsLoading(false);
      // }, 1500);
    } catch (error) {
      // setIsLoading(false);
      
    }
    dispatch(maskingActions.hideMasking());
  };

  const handleFacebookLogin = async (facebookData) => {
    try {
      
      dispatch(maskingActions.showMasking());
      const response = await authenticationService.facebook_login({
        token: facebookData.accessToken,
      });
      
      dispatch(actions.loginCustomerSuccess(response.data));
      dispatch(maskingActions.hideMasking());
      toast.success("Login successful 🔓");
    } catch (error) {
      // setIsLoading(false);
      
    }
  };

  const handleKeyDown = (e) => {
    
    if (e.key === "Enter") {
      handleFormSubmit();
    }
  };

  const navigateTOSignIN = () => {
    if (location.state?.start_date && location?.state?.end_date) {
      navigate(RoutePaths.AUTHORISATION.SIGN_IN, {
        state: {
          start_date: location.state?.start_date,
          end_date: location?.state?.end_date,
          returnPath: location?.state?.returnPath
        },
      });
    } else {
      navigate(RoutePaths.AUTHORISATION.SIGN_IN);
    }
  }

  return (
    <>
      <div className="ha--auth-container">
      <div className="authColumns ha--signUp-Auth">
         
            <div className="signInContent">
              <form>
                <div className="authTitle">
                  <h3>{t("pages.login.sign_up").toUpperCase()}!</h3>
                </div>
                <div className="authForm">
                  <div className="ha--name-surname">
                    <div className="">
                      <label className="form-label">
                        {t("pages.AccountSettings.personal_info.name")}
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          t("pages.login.type") +
                          " " +
                          t("pages.AccountSettings.personal_info.name")
                        }
                        aria-label="First name"
                        name="first_name"
                        onChange={handleTextChange}
                      />
                      {formValidation.first_name && (
                        <div className="invalid">
                          {t(formValidation.first_name)}
                        </div>
                      )}
                    </div>
                    <div className="">
                      <label className="form-label">
                        {t("pages.AccountSettings.personal_info.surname")}
                        <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={
                          t("pages.login.type") +
                          " " +
                          t("pages.AccountSettings.personal_info.surname")
                        }
                        aria-label="Last name"
                        onChange={handleTextChange}
                        name="last_name"
                      />
                      {formValidation.last_name && (
                        <div className="invalid">
                          {t(formValidation.last_name)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <label className="label">
                      {t("pages.AccountSettings.personal_info.phone_number")}{" "}
                      <span className="required">*</span>
                    </label>

                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      className="form-control frgtInput d-flex"
                      placeholder={
                        t("pages.login.type") +
                        " " +
                        t("pages.AccountSettings.personal_info.phone_number")
                      }
                      name="phone_number"
                      defaultCountry="AE"
                      onChange={(e) => {
                        
                        const errors = { ...formValidation };
                        
                        errors["phone_number"] = e
                          ? isValidPhoneNumber(e)
                            ? undefined
                            : "validation.invalid_input"
                          : "validation.required";
                        setFormValidation(errors);
                        setFormData({
                          ...formData,
                          phone_number: e,
                        });
                      }}
                    />
                    {formValidation.phone_number && (
                      <div className="invalid">
                        {t(formValidation.phone_number)}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <label className="form-label">
                      {t("pages.AccountSettings.personal_info.email")}
                      <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={
                        t("pages.login.type") +
                        " " +
                        t("pages.AccountSettings.personal_info.email")
                      }
                      onChange={handleTextChange}
                      name="email"
                    />
                    {formValidation.email && (
                      <div className="invalid">{t(formValidation.email)}</div>
                    )}
                  </div>
                  <div className="">
                    <label className="form-label">
                      {t("pages.login.password")}
                      <span className="required">*</span>
                    </label>
                    <div className="w-100 position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        placeholder={
                          t("pages.login.type") +
                          " " +
                          t("pages.login.password")
                        }
                        onChange={handleTextChange}
                        name="password"
                      />
                      <PasswordEye
                        paddingStyle={"9px 9px"}
                        showPassword={showPassword}
                        setshowPassword={setshowPassword}
                      />
                      {formValidation.password && (
                        <div className="invalid">
                          {t(formValidation.password)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <label className="form-label">
                      {t("pages.login.confirm_password")}
                      <span className="required">*</span>
                    </label>
                    <div className="w-100 position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        placeholder={
                          "Your" + " " + t("pages.login.confirm_password")
                        }
                        onChange={handleTextChange}
                        name="cpassword"
                        onKeyDown={handleKeyDown}
                      />
                      <PasswordEye
                        paddingStyle={"9px 9px"}
                        showPassword={showConfirmPassword}
                        setshowPassword={setshowConfirmPassword}
                      />
                      {formValidation.cpassword && (
                        <div className="invalid">
                          {t(formValidation.cpassword)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="actionBtn">
                  <button
                    type="submit"
                    className="AuthBtn"
                    // disabled={button ? true : false}
                    disabled={false}
                    onClick={handleFormSubmit}
                  >
                    {t("pages.login.create_account")}
                  </button>
                </div>

                <div className="signInOptions">
                  {/* <button type="button" className="signInOptionBtn mb-3">
                    <GoogleIcon /> Sign in with Google
                  </button>
                  <button type="button" className="signInOptionBtn">
                    <FBIcon /> Sign in with Facebook
                  </button> */}
                  <button
                    type="button"
                    className="signInOptionBtn"
                    onClick={login}
                  >
                    <GoogleIcon /> Sign in with Google
                  </button>
                  {/* <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={handleGoogleLogin}
                    theme="filled_blue"
                    size="large"
                    cookiePolicy={"single_host_origin"}
                  /> */}

                  {/* <ReactFacebookLogin
                    appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={handleFacebookLogin}
                    cssClass="signInOptionBtn w-100"
                    icon={<FBIcon />}
                  /> */}
                </div>
               
              </form>
              <div className="signUpBtn">
                  <span className="cursor-pointer ha--textUnderlineMain" onClick={() => {navigateTOSignIN()}}>
                    {t("pages.login.existing_account")}
                    {/* <NavLink to="/sign-in">{t("pages.login.sign_in")}</NavLink> */}
                    <span className="ha--textUnderline">
                    Sign in</span>
                  </span>
                </div>
           
          </div>
          <div className="ha--Auth-main-img">
            <div className="authImg">
              <img src={AuthImg} alt="AuthImg" className="w-100" />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Drawer */}
      <MobileDrawer openDrawer={openDrawer} setopenDrawer={setopenDrawer}>
        <OTPVerify
          userData={{
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password
          }}
          redirectState={{start_date: location.state?.start_date, end_date: location?.state?.end_date, returnPath: location?.state?.returnPath}}
        />
      </MobileDrawer>
    </>
  );
};
export default Signup;
