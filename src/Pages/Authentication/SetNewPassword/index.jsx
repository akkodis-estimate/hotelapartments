import { useState, useEffect } from "react";
import PasswordEye from "Components/Shared/PasswordEye/PasswordEye";
import { NavLink, useNavigate, useSearchParams, } from "react-router-dom";
import { useTranslation } from "react-i18next";
import authCustomers from 'Services/AuthCustomers';
import maskingActions from "reducers/masking/masking.actions";
import SuccessPage from '../SuccessPage/success';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from "react-redux";
import validationHelper from "Helpers/validationHelper";

const SetNewPassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const defaultChangePassForm = {
    password: "",
    confirm_password: "",
  };

  const defaultchangePassFormValidation = {
    confirm_password: "",
    password: ""
  };

  const [showPassword, setshowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [changePassFormData, setChangePassFormData] = useState(defaultChangePassForm);
  const [changePassFormValidation, setChangePassFormValidation] = useState(defaultchangePassFormValidation);
  const [resetUserData, setResetUserData] = useState();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showConfirmPassword, setshowConfirmPassword] = useState(false);

  useEffect(() => {
    // if (!userDetails) {
    //   navigate("/login");
    // }
    if (searchParams.get("email") && searchParams.get("token")) {

      setResetUserData({
        email: searchParams.get("email"),
        token: searchParams.get("token"),
      });
    } else if (
      !(searchParams.get("email") && searchParams.get("token"))
    ) {
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (resetUserData) {
      authCustomers
        .verify_customer_token(resetUserData)
        .then(() => {
          //do something
        })
        .catch((err) => {
          toast.error(err.data.message);
          toast.error("Please try again");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetUserData]);

  const runValidations = () => {
    const updatedValidations = {
      password: validationHelper.validatePasswordPolicy(
        changePassFormData.password,
        "Password",
        false
      ),
      confirm_password: validationHelper.validateCPassword(
        changePassFormData.confirm_password,
        changePassFormData.password
      ),
    };
    // Set updated validation errors
    return updatedValidations;
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const errors = {
      ...changePassFormValidation,
    };

    switch (name) {

      case "password":
        errors[name] = validationHelper.validatePasswordPolicy(value);
        break;


      case "confirm_password": //password
        errors[name] = validationHelper.validateCPassword(value, changePassFormData.password);
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

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   const errors = runValidations();
  //   const isRequiredFieldsAreValid =
  //     Object.keys(errors).filter((key) => errors[key]).length === 0;
  //   if (isRequiredFieldsAreValid) {
  //     var data = {
  //       password: formData.password,
  //       password2: formData.password,
  //     };
  //     if (resetUserData) {
  //       data = {
  //         ...data,
  //         email: resetUserData.email,
  //         token: resetUserData.token,
  //       };
  //       dispatch(maskingActions.showMasking());
  //       if(fromPath == RoutePaths.AUTHORISATION.RESET_CUSTOMER_PASSWORD){
  //         authenticationService
  //         .reset_customer_password(data)
  //         .then((res) => {
  //           toast.success("Pasword Changed Successfully");
  //           dispatch(actions.logoutUser());
  //           setResetUserData(null);
  //           // navigate(RoutePaths.AUTHORISATION.LOGIN);
  //           setShowSuccess(true);
  //         }).catch((error)=>{
  //           toast.error(error.response.data.message)
  //         })
  //         .finally(() => {
  //           dispatch(maskingActions.hideMasking());
  //         });
  //       }else if(fromPath == RoutePaths.AUTHORISATION.RESET_PASSWORD){
  //         authenticationService
  //         .reset_password(data)
  //         .then((res) => {
  //           toast.success("Pasword Changed Successfully");
  //           dispatch(actions.logoutUser());
  //           setResetUserData(null);
  //           // navigate(RoutePaths.AUTHORISATION.LOGIN);
  //           setShowSuccess(true);
  //         }).catch((error)=>{
  //           toast.error(error.response.data.message)
  //         })
  //         .finally(() => {
  //           dispatch(maskingActions.hideMasking());
  //         });
  //       }
        
  //     } else {
  //       dispatch(userSetNewPassword(data));
  //       dispatch(actions.logoutUser());
  //       // navigate(RoutePaths.AUTHORISATION.LOGIN);
  //       setShowSuccess(true);
  //     }
  //   } else {
  //     setFormValidation(errors);
  //   }
  // };

  const handleFormSubmit = (e) => {

  if(e) e.preventDefault();

    const errors = runValidations();
    const isRequiredFieldsAreValid = Object.keys(errors).filter((key) => errors[key]).length === 0;

    if (isRequiredFieldsAreValid) {

      var data = {
        password: changePassFormData.password,
        password2: changePassFormData.confirm_password
      };
      data = {
        ...data,
        email: resetUserData?.email,
        token: resetUserData?.token,
      };
      dispatch(maskingActions.showMasking());
      authCustomers
        .reset_customer_password(data)
        .then((res) => {
          setResetUserData(null);
          setShowSuccess(true);
        }).finally(() => {
          dispatch(maskingActions.hideMasking());
        })

    } else {
      setChangePassFormValidation(errors);
    }
  }

  
  const handleKeyDown = (e) => {
    
    if (e.key === "Enter") {
      handleFormSubmit();
    }
  };



  return (
    <>{
      !showSuccess ?
      <div className="row otpMainDes d-flex flex-column align-items-center justify-content-center w-100">

      <div className="col-lg-3">
        <div className="signInContent PIContent w-100">
          <form>
            <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
              <div className="otpHeader mb-5 mt-4 text-center">
                <h2>{t("pages.login.set_new_pswd")}</h2>
                <p>{t("pages.login.password")}</p>
              </div>
              <div className="authForm w-100">
  
                <div className="mb-3">
                  <label className="form-label">{t("pages.login.password")}</label>
                  <div className="w-100 position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      // value={changePassFormData.password}
                      className="form-control"
                      placeholder="New Password"
                      onChange={handleTextChange}
                    />
                    {changePassFormValidation.password && (
                      <div className="invalid">{t(changePassFormValidation.password)}</div>
                    )}
                    <PasswordEye
                      paddingStyle={"9px 9px"}
                      showPassword={showPassword}
                      setshowPassword={setshowPassword}
                    />
                  </div>
                </div>
  
                <div className="mb-3">
                  <label className="form-label">{t("pages.login.confirm_password")}</label>
                  <div className="w-100 position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      //    value={changePassFormData.confirm_password}
                      className="form-control"
                      placeholder="Confirm Password"
                      onChange={handleTextChange}
                      onKeyDown={handleKeyDown}
                    />
                    {changePassFormValidation.confirm_password && (
                      <div className="invalid">{t(changePassFormValidation.confirm_password)}</div>
                    )}
                    <PasswordEye
                      paddingStyle={"9px 9px"}
                      showPassword={showConfirmPassword}
                      setshowPassword={setshowConfirmPassword}
                    />
                  </div>
                </div>
              </div>
              <div className="actionBtn w-100">
                <button type="button" className="AuthBtn"
                  onClick={handleFormSubmit}
                >
                  {t("pages.login.update")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
       : 
       <SuccessPage></SuccessPage>
    }
    </>
  );
};

export default SetNewPassword;
