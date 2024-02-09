import { actions } from "reducers/customer/auth/auth.actions";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CustomerPlatformType, DefaultCountry } from "Constants/Constants";
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import validationHelper from "Helpers/validationHelper";
import accountSettingService from "Services/AccountSettingService";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";
import authenticationService from "Services/authenticationService";
import maskingActions from "reducers/masking/masking.actions";
import commonService from "Services/commonService";
import DefaultUploadImg from "Assets/Images/SettingIcons/defaultUploadImage.png";
import TrashIcon from "Assets/Images/SettingIcons/trash-icon";
import MobileDrawerPopup from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import Select from "react-select";
import { customFilterForSelect } from "Helpers/commonMethodHelper";
import dropdownService from "Services/dropdownService";

const PersionalInformation = (props) => {

  const defaultFormData = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    credit_limit: "",
    address: "",
    billing_street: "",
    billing_apt_number: "",
    billing_city: "",
    billing_state: "",
    billing_zipcode: "",
    billing_country_id: "",
    profile_url: "",
  };

  const defaultFormValidation = {
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    company_name: "",
    credit_limit: "",
    address: "",
    profile_url: "",
    billing_street: "",
    billing_apt_number: "",
    billing_city: "",
    billing_state: "",
    billing_zipcode: "",
    billing_country_id: "",
  };

  const { t } = useTranslation();

  const [successModal, setSuccessModal] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);
  const { userDetails } = useSelector((state) => state.customerAuth);
  const [isUpdate, setIsUpdate] = useState(false);

  const [isUpdatedOtp, setIsUpdatedOtp] = useState(false);
  const [oldphoneNumber, setOldphoneNumber] = useState();
  const [userDetailsScreen, setUserDetailsScreen] = useState(true);
  const [otpScreen, setOtpScreen] = useState(false);

  const [corporateCustomer, setCorporateCustomer] = useState();
  const [onSubmitFlag, setOnSubmitFlag] = useState(false);
  const [openDrawerSuccess, setOpenDrawerSuccess] = useState(false); // change when 600px (mobile view Status change).
  const [openDrawerUpdateNumberSuccess, setOpenDrawerUpdateNumberSuccess] =
    useState(false); // change when 600px (mobile view Status change).
  const [openDrawerforOtp, setOpenDrawerforOtp] = useState(false); // change when 600px (mobile view Status change).
  const [openmobileDrawer, setOpenmobileDrawer] = useState(false); // this for save one item Data and show it to mobile view only.
  const [countryDropdown, setCountryDropdown] = useState([]);
  const { language } = useSelector((state) => state.language);
  const [disableButton, setDisableButton] = useState(true); // this for save one item Data and show it to mobile view only.

  // api call

  const personalDataApi = () => {
    if (userDetails !== null) {
      dispatch(maskingActions.showMasking());

      accountSettingService
        .get_user_by_sid(userDetails.customer_sid)
        .then((res) => {
          setFormData((prevState) => {
            return {
              ...prevState,
              ...res.data.info,
              // billing_country_id: res.data.info?.billing_country_id
              //   ? res.data.info.billing_country_id
              //   : DefaultCountry.UAE,
            };
          });
          setCorporateCustomer(res.data.info?.address);
          setOldphoneNumber(res.data.info.phone_number);
          if (res.data.info.platform !== "Normal")
            props.setIsEditPassword(false);
        })
        .finally(() => {
          dispatch(maskingActions.hideMasking());
        });
    }
  };

  //api call for the get the user details from user sid
  useEffect(() => {
    personalDataApi();
  }, [isUpdatedOtp, openDrawerUpdateNumberSuccess]);

  useEffect(() => {
    const errors = runValidations();
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;
    if (isUpdatedOtp === true) {
      if (isRequiredFieldsAreValid) {
        let payload = { ...formData };

        accountSettingService
          .update_user_by_sid(userDetails.customer_sid, payload)
          .then((res) => {
            setOpenDrawerUpdateNumberSuccess(true);
            setIsUpdatedOtp(true);
            setIsUpdate(true);
            dispatch(actions.updateUserDetails({
              ...userDetails,
              first_name : payload.first_name,
              last_name : payload.last_name,
              profile_url : payload?.profile_url
            }));
          })
          .finally(() => {
          });
      } else {
        setFormValidation(errors);
      }
    }
  }, [isUpdatedOtp]);

  // on submit check the validation.
  const runValidations = () => {
    if (corporateCustomer) {
      const updatedValidations = {
        email: validationHelper.validateMailId(formData.email, "Email"),
        first_name: validationHelper.validateName(formData.first_name),
        last_name: validationHelper.validateName(formData.last_name),
        phone_number: validationHelper.validateMobileNo(formData.phone_number),
        address: validationHelper.validateAddress(formData.address),
        company_name: validationHelper.validateName(formData.company_name),
        // billing_street: validationHelper.validateAddress(
        //   formData.billing_street,
        //   "street_address"
        // ),
        // billing_apt_number: validationHelper.validTermRule(
        //   formData.billing_apt_number,
        //   "apt_number"
        // ),
        // billing_city: validationHelper.validTermRule(
        //   formData.billing_city,
        //   "city"
        // ),
        // billing_state: validationHelper.validTermRule(
        //   formData.billing_state,
        //   "state"
        // ),
        // billing_zipcode: validationHelper.validateNaturalNumberForZIPCODE(
        //   formData.billing_zipcode,
        //   "zip_code"
        // ),
        // billing_country_id: validationHelper.validateDropdown(
        //   formData.billing_country_id,
        //   "country"
        // ),
      };
      return updatedValidations;
    }

    const updatedValidations = {
      email: validationHelper.validateMailId(formData.email, "Email"),
      first_name: validationHelper.validateName(formData.first_name),
      last_name: validationHelper.validateName(formData.last_name),
      phone_number: validationHelper.validateMobileNo(formData.phone_number),
      // billing_street: validationHelper.validateAddress(
      //   formData.billing_street,
      //   "street_address"
      // ),
      // billing_apt_number: validationHelper.validTermRule(
      //   formData.billing_apt_number,
      //   "apt_number"
      // ),
      // billing_city: validationHelper.validTermRule(
      //   formData.billing_city,
      //   "city"
      // ),
      // billing_state: validationHelper.validTermRule(
      //   formData.billing_state,
      //   "state"
      // ),
      // billing_zipcode: validationHelper.validateNaturalNumberForZIPCODE(
      //   formData.billing_zipcode,
      //   "zip_code"
      // ),
      // billing_country_id: validationHelper.validateDropdown(
      //   formData.billing_country_id,
      //   "country"
      // ),
    };

    // Set updated validation errors
    return updatedValidations;
  };

  // on change check the validation.
  const handleTextChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setDisableButton(false);
    const errors = {
      ...formValidation,
    };
    switch (name) {
      case "address":
        errors[name] = validationHelper.validateAddress(value);
        break;

      case "company_name":
        errors[name] = validationHelper.validateName(value);
        break;

      case "phone_number":
        errors[name] = validationHelper.validateMobileNo(value, "Phone Number");
        break;

      case "first_name":
        errors[name] = validationHelper.validateName(value);
        break;

      case "last_name":
        errors[name] = validationHelper.validateName(value);
        break;

      // case "billing_street":
      //   errors[name] = validationHelper.validateAddress(
      //     value,
      //     "street_address"
      //   );
      //   break;

      // case "billing_apt_number":
      //   errors[name] = validationHelper.validTermRule(value, "apt_number");
      //   break;

      // case "billing_city":
      //   errors[name] = validationHelper.validTermRule(value, "city");
      //   break;

      // case "billing_state":
      //   errors[name] = validationHelper.validTermRule(value, "state");
      //   break;

      // case "billing_zipcode":
      //   // debugger;
      //   errors[name] = validationHelper.validateNaturalNumberForZIPCODE(
      //     value,
      //     "zip_code"
      //   );
      //   break;

      default:
        console.error(`Found unknown field - ${name}`);
    }

    // Update the form validation object
    setFormValidation(errors);
    // Update the form data
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // states for count down Seconds
  const [countdownSeconds, setCountdownSeconds] = useState(60);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);

  // on changes of state
  useEffect(() => {
    let countdown;
    if (onSubmitFlag) {
      if (!inputDisabled) {
        if (countdownSeconds > 0 && !taskCompleted) {
          countdown = setInterval(() => {
            setCountdownSeconds((prevSeconds) => prevSeconds - 1);
          }, 1000);
        } else {
          setInputDisabled(true);
        }
        return () => clearInterval(countdown);
      }
    }
  }, [countdownSeconds, taskCompleted, onSubmitFlag]);

  // disable and enable the Input for Otp
  const enableInput = () => {
    setInputDisabled(false);
    setCountdownSeconds(60);
    setTaskCompleted(false);
    setErrorForOtp(false);
  };

  // api call for the  send otp
  const SendotpCode = () => {
    dispatch(maskingActions.showMasking());
    accountSettingService
      .send_otp_code(userDetails.email_address)
      .then((res) => {
  
        console.clear();
        setIsUpdate(true);
        if (isDisplayUnder600px) {
          setUserDetailsScreen(true);
        } else {
          setUserDetailsScreen(false);
        }

        setOtpScreen(true);
        setOpenDrawerforOtp(true);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  // on submit function
  const handleFormSubmit = (e) => {
    enableInput();
    setOnSubmitFlag(true);
    e.preventDefault();
    const errors = runValidations();
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;

    if (oldphoneNumber !== formData.phone_number) {
      try {
        if (isRequiredFieldsAreValid) {
          SendotpCode();
        }
      } catch (error) {
        
      }
      if (isUpdatedOtp === true) {
        if (isRequiredFieldsAreValid) {
          setDisableButton(true);
          let payload = {
            ...formData,
            billing_country_id: formData.billing_country_id
              ? formData.billing_country_id
              : 0,
          };
          
          accountSettingService
            .update_user_by_sid(userDetails.customer_sid, payload)
            .then((res) => {
              personalDataApi();
              enableInput();
              
              setSuccessModal(true);
              setIsUpdate(true);
              dispatch(actions.updateUserDetails({
                ...userDetails,
                first_name : payload.first_name,
                last_name : payload.last_name,
                profile_url : payload?.profile_url
              }));
            })
            .finally(() => {
            });
        } else {
          setFormValidation(errors);
        }
      }
    } else {
      if (isRequiredFieldsAreValid) {
        let payload = {
          ...formData,
          billing_country_id: formData.billing_country_id
            ? formData.billing_country_id
            : 0,
        };
        setDisableButton(true);

        setOpenDrawerSuccess(true);
        accountSettingService
          .update_user_by_sid(userDetails.customer_sid, payload)
          .then((res) => {
            personalDataApi();
            
            setSuccessModal(true);
            setIsUpdate(true);
            setOnSubmitFlag(false);
            dispatch(actions.updateUserDetails({
              ...userDetails,
              first_name : payload.first_name,
              last_name : payload.last_name,
              profile_url : payload?.profile_url
            }));
          })

          .finally(() => {
          });
      } else {
        setFormValidation(errors);
      }
    }
  };

  const validateImageSize = (image_length, allowed_size) => {
    if (image_length <= allowed_size) {
      return true;
    } else {
      return false;
    }
  };

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

  /*-------------------- Code For OTP --------------------*/

  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const [errorForOtp, setErrorForOtp] = useState(false);

  useEffect(() => {
    
    if (otp.length === 4) {
      handleOtpVerification();
    }
  }, [otp]);

  // for otp verification api call
  const handleOtpVerification = () => {
    const storedData = localStorage.getItem("userDetails");
    let UserData = JSON.parse(storedData);
    let payload = {
      otp: otp,
      email: UserData ? UserData.email_address : "",
      customer_id: UserData ? UserData.customer_id : "",
    };

    dispatch(maskingActions.showMasking());
    authenticationService
      .verify_otp(payload)
      .then((res) => {
        if (res.data.statusCode !== 400) {
          setOpenDrawerUpdateNumberSuccess(true);
          
          setErrorForOtp(false);
          setIsUpdatedOtp(true);
          setUserDetailsScreen(true);
          setOtpScreen(false);
          setTaskCompleted(true);
          setOtp("");
        }
        dispatch(actions.verifyUserSuccess());
      })
      .catch((error) => {
        setErrorForOtp(true);
        setOtp("");
        console.error(error);
        // Set error state or handle the error in another way
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  // Function to handle file change
  const handleFileChange = (event) => {
    // Create a new FormData object
    let request = new FormData();
    
    const allowedSize = 10000000;
    const isImageValid = validateImageSize(
      event.target.files[0].size,
      allowedSize
    );

    if (isImageValid) {
      // Loop through the files in the event target
      for (let index = 0; index < event.target.files.length; index++) {
        // Append each file to the FormData object
        request.append("files", event.target.files[index]);
      }
      // Call the commonService file_upload function
      commonService
        .profile_upload(request)
        .then((res) => {
          // Update the formData state with the response data
          setFormData((prevState) => {
            return {
              ...prevState,
              profile_url: res.data[0],
            };
          });

          setDisableButton(false);
         
        })
        .catch(() => {
          // Display error toast message
          toast.error(<span>{t("toaster_message.error")}</span>);
        });
    } else {
      toast.error("Image should be less than or equal to 10mb");
    }
  };

  //delete the image file.
  const handleFileDelete = () => {
    debugger;
    setFormData((prevState) => {
      return {
        ...prevState,
        profile_url: "",
      };
    });
    setDisableButton(false);
  };

  // ---------------------------- Mobile View
  const [isDisplayUnder600px, setIsDisplayUnder600px] = useState(
    window.innerWidth < 600
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDisplayUnder600px(window.innerWidth < 600);
    };

    // Debounce the resize event to avoid excessive updates
    let timeoutId;
    const handleResizeDebounced = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", handleResizeDebounced);

    // Clean up the event listener on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResizeDebounced);
    };
  }, []);

  const handleDropdownChange = (value, name) => {
    const errors = {
      ...formValidation,
    };
    setDisableButton(false);
    switch (name) {
      case "billing_country_id":
        errors[name] = validationHelper.validateDropdown(value, "Country");
        break;
      default:
        break;
    }
    setFormValidation(errors);
  };

  useEffect(() => {
    dispatch(maskingActions.showMasking());
    dropdownService
      .get_master_country_dropdown()
      .then((res) => {
        
        const newArray = res.data?.map((obj) => ({
          ...obj,
          value: obj.country_master_id,
          label: obj.country_master_name,
        }));
        setFormData((prevState) => {
          return {
            ...prevState,
            billing_country_id: formData.billing_country_id,
          };
        });
        setCountryDropdown(newArray);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [language]);

  useEffect(() => {
    let country = countryDropdown.find((x) => x.label === DefaultCountry.UAE);
    setFormData((prevState) => {
      return {
        ...prevState,
        billing_country_id: country?.value,
      };
    });
  }, [countryDropdown]);
  return (
    <>
      {otpScreen === true && (
        <>
          {isDisplayUnder600px !== true ? (
            <>
              <div className="row otpMainDes accountSettingOtpDesign w-100  ">
                <div className="col-lg-6">
                  <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
                    <div className="otpHeader mb-5">
                      <h2 className="text-center">
                        {t("pages.AccountSettings.otp_verify.verification")}
                      </h2>

                      <p className="text-center">
                        {t(
                          "pages.AccountSettings.otp_verify.verification_code"
                        )}{" "}
                        <br /> {}
                      </p>
                    </div>

                    <div className="otpInput d-flex gap-3 mb-5">
                      <input
                        disabled={inputDisabled}
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[0] || ""}
                        onChange={(e) => handleInputChange(e, 0)}
                      />
                      <input
                        disabled={inputDisabled}
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[1] || ""}
                        onChange={(e) => handleInputChange(e, 1)}
                      />
                      <input
                        disabled={inputDisabled}
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[2] || ""}
                        onChange={(e) => handleInputChange(e, 2)}
                      />
                      <input
                        disabled={inputDisabled}
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[3] || ""}
                        onChange={(e) => handleInputChange(e, 3)}
                      />
                    </div>

                    <span className="counterSec">
                      {errorForOtp === true && (
                        <>
                          <span style={{ color: "red" }}>Incorrect Otp. </span>
                        </>
                      )}
                      {countdownSeconds
                      } sec.
                    </span>

                    <p className="sendAgainCode">
                      {t("pages.AccountSettings.otp_verify.nootp")}{" "}
                      <span
                        className="text-decoration-underline cursor-pointer"
                        onClick={() => {
                          SendotpCode();
                          enableInput();
                        }}
                      >
                        {t("pages.AccountSettings.otp_verify.send_again")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <MobileDrawerPopup
              position="bottom"
              setIsDrawerOpen={setOpenmobileDrawer}
              overlayProps={{ opacity: 0.5, blur: 4 }}
              className="mobileDrawer"
              openDrawer={openDrawerforOtp}
              setopenDrawer={setOpenDrawerforOtp}
            >
              <div className="row otpMainDes accountSettingOtpDesign w-100 accSecOtpSm">
                <div className="col-lg-6">
                  <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
                    <div className="otpHeader mb-5">
                      <h2 className="text-center">
                        {t("pages.AccountSettings.otp_verify.verification")}
                      </h2>

                      <p className="text-center">
                        {t(
                          "pages.AccountSettings.otp_verify.verification_code"
                        )}{" "}
                        <br />
                      </p>
                    </div>

                    <div className="otpInput d-flex gap-3 mb-5">
                      <input
                        disabled={inputDisabled}
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[0] || ""}
                        onChange={(e) => handleInputChange(e, 0)}
                      />
                      <input
                        disabled={inputDisabled}
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[1] || ""}
                        onChange={(e) => handleInputChange(e, 1)}
                      />
                      <input
                        disabled={inputDisabled}
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[2] || ""}
                        onChange={(e) => handleInputChange(e, 2)}
                      />
                      <input
                        disabled={inputDisabled}
                        type="text"
                        maxLength={1}
                        className="form-control"
                        value={otp[3] || ""}
                        onChange={(e) => handleInputChange(e, 3)}
                      />
                    </div>

                    <span className="counterSec">
                      {errorForOtp === true && (
                        <>
                          <span style={{ color: "red" }}>Incorrect Otp. </span>
                        </>
                      )}
                      {countdownSeconds} sec.
                    </span>

                    <p className="sendAgainCode">
                      {t("pages.AccountSettings.otp_verify.nootp")}{" "}
                      <span
                        className="text-decoration-underline cursor-pointer"
                        onClick={() => {
                          SendotpCode();
                          enableInput();
                        }}
                      >
                        {t("pages.AccountSettings.otp_verify.send_again")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </MobileDrawerPopup>
          )}
        </>
      )}

      {userDetailsScreen === true ? (
        <>
          <div className="ha--PIForm">
            <div className="signInContent PIContent w-100">
              <form>
                <fieldset
                  disabled={
                    formData.platform === CustomerPlatformType.NORMAL
                      ? false
                      : true
                  }
                >
                  <div className="ha--PiTitle">
                    <h3>{t("pages.AccountSettings.personal_info.title")}</h3>
                  </div>
                  <div className="authForm">
                    {/* <label className="form-label">Profile</label> */}

                    <div className="userImageUpload d-flex align-items-center">
                      <div className="input-file me-2 d-flex align-items-center">
                        <div className="input-file me-2 d-flex align-items-center">
                          <img
                            id="file_upload"
                            src={
                              formData.profile_url
                                ? formData.profile_url
                                : DefaultUploadImg
                            }
                            alt="Upload"
                            className="upload-img"
                          />
                          <div className="d-flex flex-column position-relative">
                            <div className="d-flex align-items-center">
                              {formData.platform ===
                              CustomerPlatformType.NORMAL ? (
                                <div className="input-file-upload">
                                  <span className="upload-label">
                                    <FiUpload className="me-2" /> Upload Image
                                  </span>
                                  <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    onClick={handleFileDelete}
                                    name="profile_url"
                                  />
                                </div>
                              ) : (
                                <div className="input-file-upload disabled">
                                  <span className="upload-label">
                                    <FiUpload className="me-2" /> Upload Image
                                  </span>
                                  <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    onClick={handleFileDelete}
                                    name="profile_url"
                                  />
                                </div>
                              )}
                              <button
                                type="button"
                                className="deleteBtn d-flex align-items-center ms-3 mt-1"
                                onClick={() => {
                                  setFormData((prevState) => {
                                    return {
                                      ...prevState,
                                      profile_url: "",
                                    };
                                  });
                                  setDisableButton(false);
                                }}
                              >
                                <TrashIcon />{" "}
                                <span className="ms-2">Delete</span>
                              </button>
                            </div>
                            {formValidation.profile_url && (
                              <div className="invalid">
                                {t(formValidation.profile_url)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">
                        {t("pages.AccountSettings.personal_info.name")}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleTextChange}
                      />
                      {formValidation.first_name && (
                        <div className="invalid">
                          {t(formValidation.first_name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="form-label">
                        {t("pages.AccountSettings.personal_info.surname")}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="last_name"
                        onChange={handleTextChange}
                        value={formData.last_name}
                      />
                      {formValidation.last_name && (
                        <div className="invalid">
                          {t(formValidation.last_name)}
                        </div>
                      )}
                    </div>
                    <div className="persionalInfoEmailDisabled">
                      <label className="form-label">
                        {t("pages.AccountSettings.personal_info.email")}
                      </label>
                      <input
                        type="text"
                        name="email"
                        className="form-control"
                        onChange={handleTextChange}
                        value={formData.email}
                        disabled
                      />
                    </div>
                    {corporateCustomer && (
                      <>
                        <div>
                          <label className="form-label">Company Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleTextChange}
                          />
                          {formValidation.company_name && (
                            <div className="invalid">
                              {t(formValidation.company_name)}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="form-label">Address</label>
                          <textarea
                            type="input"
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleTextChange}
                          />
                          {formValidation.address && (
                            <div className="invalid">
                              {t(formValidation.address)}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <div>
                      <label className="label">
                        {t("pages.AccountSettings.personal_info.phone_number")}{" "}
                        <span className="required">*</span>
                      </label>

                      <PhoneInput
                        international
                        countryCallingCodeEditable={false}
                        className="form-control frgtInput d-flex"
                        placeholder={t("pages.customer.add.ph_phone")}
                        name="phone_number"
                        value={formData.phone_number}
                        disabled={
                          formData.platform === CustomerPlatformType.NORMAL
                            ? false
                            : true
                        }
                        defaultCountry="AE"
                        onChange={(e) => {
                          
                          setDisableButton(false);
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

                      <label className="form-label">
                        {t(
                          "pages.AccountSettings.personal_info.verification_code"
                        )}
                      </label>
                    </div>
                  </div>
                </fieldset>
                <div className="ha--PaymentUI">
                  <div className="">
                    <div className="checkoutTitle ">
                      <h5>
                        {t(
                          "pages.booking.multibooking_payment.billing_address"
                        )}
                      </h5>
                    </div>
                  </div>
                  <div className="">
                    <label className="form-label">
                      {t(
                        "pages.booking.multibooking_payment.ph_billing_address"
                      )}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t(
                        "pages.booking.multibooking_payment.ph_billing_address"
                      )}
                      aria-label="First name"
                      name="billing_street"
                      onChange={handleTextChange}
                      value={formData.billing_street}
                    />
                    {formValidation.billing_street && (
                      <div className="invalid">
                        {t(formValidation.billing_street)}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <label className="form-label">
                      {t("pages.booking.multibooking_payment.apt/suite_number")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t(
                        "pages.booking.multibooking_payment.ph_apartment_details"
                      )}
                      aria-label="First name"
                      name="billing_apt_number"
                      onChange={handleTextChange}
                      value={formData.billing_apt_number}
                    />
                    {formValidation.billing_apt_number && (
                      <div className="invalid">
                        {t(formValidation.billing_apt_number)}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <label className="form-label">
                      {t("pages.booking.multibooking_payment.city")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t(
                        "pages.booking.multibooking_payment.ph_city"
                      )}
                      aria-label="First name"
                      name="billing_city"
                      onChange={handleTextChange}
                      value={formData.billing_city}
                    />
                    {formValidation.billing_city && (
                      <div className="invalid">
                        {t(formValidation.billing_city)}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <label className="form-label">
                      {t("pages.booking.multibooking_payment.state")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t(
                        "pages.booking.multibooking_payment.ph_state"
                      )}
                      aria-label="State"
                      name="billing_state"
                      onChange={handleTextChange}
                      value={formData.billing_state}
                    />
                    {formValidation.billing_state && (
                      <div className="invalid">
                        {t(formValidation.billing_state)}
                      </div>
                    )}
                  </div>
                  <div className="">
                    <label className="form-label">
                      {t("pages.booking.multibooking_payment.zip_code")}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t(
                        "pages.booking.multibooking_payment.ph_zipcode"
                      )}
                      aria-label="First name"
                      name="billing_zipcode"
                      onChange={handleTextChange}
                      value={formData.billing_zipcode}
                    />
                    {formValidation.billing_zipcode && (
                      <div className="invalid">
                        {t(formValidation.billing_zipcode)}
                      </div>
                    )}
                  </div>
                  <div className=" paymentSlctCountry">
                    <label className="form-label">
                      {t("pages.booking.multibooking_payment.select_country")}
                    </label>

                    <Select
                      placeholder={t(
                        "pages.booking.multibooking_payment.ph_country"
                      )}
                      options={countryDropdown}
                      value={
                        formData.billing_country_id
                          ? countryDropdown?.find(
                              (f) => f.value === formData.billing_country_id
                            )
                          : countryDropdown?.find(
                              (f) => f.label === DefaultCountry.UAE
                            )
                      }
                      onChange={(e) => {
                        setFormData((prevState) => {
                          return {
                            ...prevState,
                            billing_country_id: e.value,
                          };
                        });
                        handleDropdownChange(e.value, "billing_country_id");
                      }}
                      filterOption={customFilterForSelect}
                      getOptionLabel={(option) => option.label}
                    />
                    {formValidation.billing_country_id && (
                      <div className="invalid">
                        {t(formValidation.billing_country_id)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="actionBtn">
                  {formData.platform !== CustomerPlatformType.NORMAL ? (
                    <button
                      type="button"
                      className={`AuthBtn ${disableButton ? "disable" : ""}`}
                      onClick={handleFormSubmit}
                      disabled={disableButton}
                    >
                      {t("pages.AccountSettings.personal_info.update_btn")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`AuthBtn ${
                        formData.platform !== CustomerPlatformType.NORMAL ||
                        disableButton
                          ? "disable"
                          : ""
                      }`}
                      onClick={handleFormSubmit}
                      disabled={
                        formData.platform === CustomerPlatformType.NORMAL ||
                        disableButton
                          ? false
                          : true
                      }
                    >
                      {t("pages.AccountSettings.personal_info.update_btn")}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {isDisplayUnder600px !== true ? (
            <>
              <ModalPopup
                show={successModal}
                dialogClassName="applicationModal ha--successModal"
              >
                <SuccessModalPopup
                  setSuccessModal={setSuccessModal}
                  Title={"Success"}
                  Message={"Account details has been Updated"}
                  ShowButton={false}
                />
              </ModalPopup>
            </>
          ) : (
            <MobileDrawerPopup
              position="bottom"
              setIsDrawerOpen={setOpenmobileDrawer}
              overlayProps={{ opacity: 0.5, blur: 4 }}
              className="mobileDrawer"
              openDrawer={openDrawerSuccess}
              setopenDrawer={setOpenDrawerSuccess}
            >
              <SuccessModalPopup
                false={true}
                setSuccessModal={setSuccessModal}
                Title={"Success"}
                Message={"Account details has been Updated"}
                ShowButton={false}
              />
            </MobileDrawerPopup>
          )}

          {isDisplayUnder600px === true && isUpdatedOtp === true ? (
            <>
              <MobileDrawerPopup
                position="bottom"
                setIsDrawerOpen={setOpenmobileDrawer}
                overlayProps={{ opacity: 0.5, blur: 4 }}
                className="mobileDrawer"
                openDrawer={openDrawerUpdateNumberSuccess}
                setopenDrawer={setOpenDrawerUpdateNumberSuccess}
              >
                <SuccessModalPopup
                  false={true}
                  setSuccessModal={setIsUpdatedOtp}
                  Title={"Success"}
                  Message={"The Number has Been Updated"}
                  ShowButton={false}
                />
              </MobileDrawerPopup>
            </>
          ) : (
            <ModalPopup show={isUpdatedOtp} dialogClassName="applicationModal">
              <SuccessModalPopup
                setSuccessModal={setIsUpdatedOtp}
                Title={"Success"}
                Message={"The Number has Been Updated"}
                ShowButton={false}
              />
            </ModalPopup>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default PersionalInformation;
