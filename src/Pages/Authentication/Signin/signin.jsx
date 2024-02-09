import { useEffect, useState } from "react";
import PasswordEye from "Components/Shared/PasswordEye/PasswordEye";
import FBIcon from "Assets/Images/AuthenticationIcons/FBIcon";
import AuthImg from "Assets/Images/AuthenticationIcons/authImg.png";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import validationHelper from "Helpers/validationHelper";
import "./signin.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { userLoginAsync } from "reducers/customer/auth/auth.thunks";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import authenticationService from "Services/authenticationService";
import maskingActions from "reducers/masking/masking.actions";
import { actions } from "reducers/customer/auth/auth.actions";
import { toast } from "react-toastify";
import ReactFacebookLogin from "react-facebook-login";
import { environment } from "environment";
import GoogleIcon from "Assets/Images/AuthenticationIcons/GoogleIcon";
import { RoutePaths } from "Constants/Constants";
const SignIn = () => {
  // Set default form data
  const defaultFormData = {
    email: "",
    password: "",
  };

  // Declare a constant variable to store the default form validation values
  const defaultFormValidation = {
    email: "",
    password: "",
  };

  // Initialize formData and formValidation states
  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);
  // Initialize showPassword state
  const [showPassword, setshowPassword] = useState(false);

  const [button, setButtonState] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userDetails } = useSelector((state) => state.customerAuth);

  // destructure the useTranslation hook to get access to t
  const { t } = useTranslation();

  useEffect(() => {
    if (userDetails) {
      // navigate("/");
      // Get the return path from the location state
      const returnPath = location.state?.returnPath || "/";

      // Navigate the user back to the specific page
      if (location.state?.start_date && location?.state?.end_date) {
        navigate(returnPath, {
          state: {
            start_date: location.state?.start_date,
            end_date: location?.state?.end_date,
          },
        });
      } else {
        navigate(returnPath);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const runValidations = () => {
    const updatedValidations = {
      email: validationHelper.validateMailId(formData.email, "Email"),
      password: validationHelper.validatePasswordPolicy(formData.password),
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
      case "email":
        errors[name] = validationHelper.validateMailId(value, "Email");
        break;

      case "password":
        errors[name] = validationHelper.validatePasswordPolicy(value);
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
      var payload = { ...formData };

      dispatch(userLoginAsync(payload));
    } else {
      // Otherwise, set the form validation errors
      setFormValidation(errors);
      // showErrorToast('To complete the registration please fill the mandatory filed data.')
    }
  };

  // Function to handle Google login
  const handleGoogleLogin = async (googleData) => {
    try {
      dispatch(maskingActions.showMasking());
      // Call the API to perform Google login
      const response = await authenticationService.google_login({
        token: googleData.code, // Use the code from googleData instead of googleData.credential
      });
      // Dispatch the login success action and hide the masking
      dispatch(actions.loginCustomerSuccess(response.data));
      dispatch(maskingActions.hideMasking());
      // Show success toast message
      toast.success("Login successful 🔓");
    } catch (error) {}
    // Hide the masking
    dispatch(maskingActions.hideMasking());
  };

  // Use the useGoogleLogin hook
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => await handleGoogleLogin(tokenResponse),
    onError: () => {
      toast.error(<span>{t("toaster_message.error")}</span>);
    },
    flow: "auth-code",
    cookiePolicy: "single_host_origin",
  });

  const handleFacebookLogin = async (facebookData) => {
    try {
      // Log the Facebook data
      if (facebookData?.accessToken) {
        // Show masking (loading spinner)
        dispatch(maskingActions.showMasking());
        // Call the authentication service to log in with Facebook
        const response = await authenticationService.facebook_login({
          token: facebookData.accessToken,
        });
        // Dispatch the login success action with the response data
        dispatch(actions.loginCustomerSuccess(response.data));
        // Hide masking (loading spinner)
        dispatch(maskingActions.hideMasking());
        // Show success message
        toast.success("Login successful 🔓");
      } else {
        throw new Error();
      }
    } catch (error) {
      // Log any errors
      dispatch(maskingActions.hideMasking());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleFormSubmit();
    }
  };

  const navigateTOSignUP = () => {
    if (location.state?.start_date && location?.state?.end_date) {
      navigate(RoutePaths.AUTHORISATION.SIGN_UP, {
        state: {
          start_date: location.state?.start_date,
          end_date: location?.state?.end_date,
          returnPath: location?.state?.returnPath,
        },
      });
    } else {
      navigate(RoutePaths.AUTHORISATION.SIGN_UP);
    }
  };

  return (
    <>
      {/* Sign In component */}
      <div className="ha--auth-container">
        <div className="authColumns">
          <div className="signInContent">
            <form>
              {/* Auth title */}
              <div className="authTitle">
                <h3>{t("pages.login.sign_in").toUpperCase()}!</h3>
              </div>
              {/* Auth form */}
              <div className="authForm">
                {/* Email input */}
                <div className="">
                  <label class="form-label">{t("pages.login.email")}</label>
                  <input
                    type="email"
                    class="form-control"
                    placeholder={
                      t("pages.login.type") + " " + t("pages.login.email")
                    }
                    name="email"
                    onChange={handleTextChange}
                    value={formData.email}
                    onBlur={handleTextChange}
                  />
                  {formValidation.email && (
                    <div className="invalid">{t(formValidation.email)}</div>
                  )}
                </div>
                {/* Password input */}
                <div className="">
                  <label className="form-label">
                    {t("pages.login.password")}
                  </label>
                  <div className="w-100 position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder={
                        t("pages.login.type") + " " + t("pages.login.password")
                      }
                      name="password"
                      onChange={handleTextChange}
                      onBlur={handleTextChange}
                      value={formData.password}
                      onKeyDown={handleKeyDown}
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
                {/* Forgot password link */}
                <div className="ha--fotgot-password">
                  <div className="forgotPassword">
                    <NavLink to="/forgot-password">
                      {t("pages.login.forgot")}
                    </NavLink>
                  </div>
                </div>
              </div>
              {/* Sign in button */}
              <div className="actionBtn">
                <button
                  type="button"
                  className={`AuthBtn ${button ? "disable" : ""}`}
                  onClick={handleFormSubmit}
                >
                  {t("pages.login.sign_in")}
                </button>
              </div>
              {/* Sign in options */}
              <div className="signInOptions">
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
                    render={(renderProps) => (
                      <button onClick={renderProps.onClick}>
                        This is my custom Google button
                      </button>
                    )}
                  />
                   */}
                   
                {/* <ReactFacebookLogin
                  appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={handleFacebookLogin}
                  cssClass="signInOptionBtn w-100"
                  icon={<FBIcon />}
                /> */}
              </div>
              {/* Sign up link */}
              <div className="signUpBtn">
                <span
                  className="cursor-pointer ha--textUnderlineMain"
                  onClick={() => {
                    navigateTOSignUP();
                  }}
                >
                  {t("pages.login.register")}
                  {/* <NavLink to="/sign-up">{t("pages.login.sign_up")}</NavLink> */}
                  <span className="ha--textUnderline">Sign up</span>
                </span>
              </div>
            </form>
          </div>

          {/* Auth image */}
          <div className="ha--Auth-main-img">
            <div className="authImg">
              <img src={AuthImg} alt="AuthImg" className="w-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignIn;
