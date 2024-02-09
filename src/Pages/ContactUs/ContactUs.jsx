import HomeIcon from "Assets/Images/BlogIcons/HomeIcon";
import ContactBanner from "Assets/Images/CorporateCustomersIcons/CorporateBannerSM.png";
import ContactBannerMain from "Assets/Images/ContactUsIcons/ContactPageBannner.jpg";
import "Pages/ContactUs/contactus.css";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";
import { useDispatch } from "react-redux";
import validationHelper from "Helpers/validationHelper";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useTranslation } from "react-i18next";
import contactusService from "Services/contactus";
import { toast } from "react-toastify";
import maskingActions from "reducers/masking/masking.actions";
import { useEffect } from "react";
import MobileCalendar from "Assets/Images/ContactUsIcons/MobileCalendar";
import MobileCallIcon from "Assets/Images/ContactUsIcons/MobileCallIcon";
import MobileWpIcon from "Assets/Images/ContactUsIcons/MobileWpIcon";
import MobileMailIcon from "Assets/Images/ContactUsIcons/MobileMailIcon";
import MobileMapIcon from "Assets/Images/ContactUsIcons/MobileMapIcon";

const ContactUs = () => {
  // Set default form data
  const defaultFormData = {
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    subject: "",
    category: "",
    message: "",
  };

  // Declare a constant variable to store the default form validation values
  const defaultFormValidation = {
    name: "",
    surname: "",
    email: "",
    phone_number: "",
    subject: "",
    category: "",
    message: "",
  };

  const subject_categories = [
    "Apartment Enquiry",
    "Please call me back",
    "Need more information",
  ];

  // Initialize formData and formValidation states
  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);
  const [messageCharCount, setmessageCharCount] = useState(0);
  const [subjectCategories, setSubjectCategoriesList] =
    useState(subject_categories);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [successModal, setSuccessModal] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const runValidations = () => {
    const updatedValidations = {
      name: validationHelper.validateName(formData.name),
      surname: validationHelper.validateName(formData.surname),
      email: validationHelper.validateMailId(formData.email),
      phone_number: handlePhoneNumberValidation(formData.phone_number),
      subject: validationHelper.validateSubject(formData.subject),
      category: validationHelper.validateDropdown(formData.category),
      message: validationHelper.validateMessageDescription(formData.message),
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
      case "name":
        errors[name] = validationHelper.validateName(value, "Name");
        break;

      case "surname":
        errors[name] = validationHelper.validateOptionalfields(value);
        break;

      case "subject":
        errors[name] = validationHelper.validateSubject(value, "Subject");
        break;

      case "email":
        errors[name] = validationHelper.validateMailId(value, "email");
        break;

      case "category":
        errors[name] = validationHelper.validateDropdown(value);
        break;

      case "message":
        errors[name] = validationHelper.validateMessageDescription(value);
        setmessageCharCount(value ? value.length : 0);
        break;

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

  const handleFormSubmit = (e) => {
    // Prevent the default form submission
    e.preventDefault();
    // Run validations on the form fields
    const errors = runValidations();
    // Check if all required fields are valid
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;
    // If all required fields are valid, create the payload
    if (isRequiredFieldsAreValid) {
      var { cpassword, ...payload } = { ...formData };
      
      dispatch(maskingActions.showMasking());
      //api call
      contactusService
        .add_inquiry(payload)
        .then((res) => {
          setFormData((prevState) => {
            return {
              ...prevState,
              name: "",
              surname: "",
              email: "",
              phone_number: "",
              subject: "",
              message: "",
              category: "",
            };
          });
          setSuccessModal(true);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again");
        })
        .finally(() => {
          dispatch(maskingActions.hideMasking());
        });

      // debugger;
    } else {
      // Otherwise, set the form validation errors
      setFormValidation(errors);
      // showErrorToast('To complete the registration please fill the mandatory filed data.')
    }
  };

  const handlePhoneNumberChange = (event) => {
    

    let name = "phone_number";
    const errors = {
      ...formValidation,
    };
    // var test = isValidPhoneNumber(event);
    

    errors[name] = handlePhoneNumberValidation(event);

    setFormValidation(errors);

    setFormData((prevState) => {
      return {
        ...prevState,
        phone_number: event,
      };
    });
  };

  const handlePhoneNumberValidation = (event) => {
    if (event && isValidPhoneNumber(event)) {
      return "";
    } else {
      if (event) {
        return "validation.invalid_input";
      } else {
        return "validation.required";
      }
    }
  };

  return (
    <>
      <div className="ha--banner-container">
        <div
          className="bannerSection ha--contactBnrSec"
          style={{ backgroundImage: `url(${ContactBannerMain})` }}
        >
          <div className="ha--bannerSection-breadcrumb">
            <div className="ha--appBreadCrumb contactBreadCrumb">
              <ul className="ha--breadcrumbList breadcrumbList">
                <li
                  className="breadcrumbItem cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  {/* <NavLink to=""> */}
                  <HomeIcon />
                  {/* </NavLink> */}
                </li>
                <li className="breadcrumbItem">
                  {/* <NavLink to=""> */}
                  {t("pages.contact_us.title")}
                  {/* </NavLink> */}
                </li>
              </ul>
            </div>
            <div className="sectionTitleDesc">
              <h2>{t("pages.contact_us.title")}</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="ha--contact-main-container">
        <div className="ha--contactForm">
          <div className="ha--contactForm-content">
            <div className="contactDetailsSm">
              <div className="contactSummary ">
                <h4 className="contactTimingSm">
                  {t("pages.contact_us.get_in_touch")}
                </h4>
                <h6>{t("pages.contact_us.contact_text")}</h6>
              </div>
              <div className="contactBlurb">
                <div className="ha--contactBlurb-iconText">
                  <div className="contactBlurbIconLg"> 
                    <FaCalendarAlt />
                  </div>
                  <div className="contactBlurbIconSm">
                    <MobileCalendar/>
                  </div>
                  <span className="contactTimingLg contactBlurb--content">
                  {t("pages.contact_us.timing")}
                  </span>
                  <span className="contactTimingSm">
                  {t("pages.contact_us.timing_mob")}
                  </span>
                </div>

                <div className="ha--contactBlurb-iconText">
                  <NavLink to="tel:+97143919826">
                  <div className="contactBlurbIconLg"> 
                      <FaPhoneAlt />
                    </div>
                    <div className="contactBlurbIconSm">
                    <MobileCallIcon/>
                  </div>
                    <span className="contactBlurb--content">+971 (4) 391-9826</span>
                  </NavLink>
                </div>
                <div className="ha--contactBlurb-iconText">
                  <NavLink to="tel:+9710585080101">
                  <div className="contactBlurbIconLg"> 

                      <FaWhatsapp />
                    </div>
                    <div className="contactBlurbIconSm">
                    <MobileWpIcon/>
                  </div>
                 
                    <span className="contactBlurb--content">
                      {" "}
                      +971 (0) 58 508 01 01
                    </span>
                  </NavLink>
                </div>
                <div className="ha--contactBlurb-iconText">
                  <NavLink to="mailto:info@hotelapartments.com">
                  <div className="contactBlurbIconLg"> 
                      {" "}
                      <FaEnvelope />
                    </div>
                    <div className="contactBlurbIconSm">
                    <MobileMailIcon/>
                  </div>
                    <span className="contactBlurb--content">
                      info@hotelapartments.com
                    </span>
                  </NavLink>
                </div>
                <div className="ha--contactBlurb-iconText">
                <div className="contactBlurbIconLg"> 
                    <FaMapMarkerAlt />
                  </div>
                  <div className="contactBlurbIconSm">
                    <MobileMapIcon/>
                  </div>
                  <span className="contactBlurb--content">
                    Office 401, Code Business Tower, Dubai
                  </span>
                </div>
              </div>
            </div>
            <div className="ha--contactForm-form">
              <div className="contactFormFields">
                <div className="">
                  <label className="form-label">
                    {t("pages.AccountSettings.personal_info.name")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      t("pages.login.type") +
                      " " +
                      t("pages.AccountSettings.personal_info.name")
                    }
                    name="name"
                    onChange={handleTextChange}
                    value={formData.name}
                  />
                  {formValidation.name && (
                    <div className="invalid">{t(formValidation.name)}</div>
                  )}
                </div>
                <div className="">
                  <label className="form-label">
                    {t("pages.AccountSettings.personal_info.surname")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={
                      t("pages.login.type") +
                      " " +
                      t("pages.AccountSettings.personal_info.surname")
                    }
                    name="surname"
                    value={formData.surname}
                    onChange={handleTextChange}
                  />
                  {formValidation.surname && (
                    <div className="invalid">{t(formValidation.surname)}</div>
                  )}
                </div>
                <div className="">
                  <label className="form-label">{t("pages.login.email")}</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("pages.login.type") + t("pages.login.email")}
                    name="email"
                    value={formData.email}
                    onChange={handleTextChange}
                  />
                  {formValidation.email && (
                    <div className="invalid">{t(formValidation.email)}</div>
                  )}
                </div>
                <div className="">
                  <label className="form-label">
                    {t("pages.AccountSettings.personal_info.phone_number")}
                  </label>
                  {/* <input
                  type="number"
                  className="form-control"
                  placeholder="Type your phone number"
                  name="phone_number"
                  onChange={handleTextChange}
                /> */}
                  <PhoneInput
                    placeholder={
                      t("pages.login.type") +
                      " " +
                      t("pages.AccountSettings.personal_info.phone_number")
                    }
                    value={formData.phone_number}
                    // initialValueFormat="national"
                    international
                    countryCallingCodeEditable={false}
                    className="form-control frgtInput d-flex"
                    onChange={handlePhoneNumberChange}
                    inputProps={{
                      className: "form-control", // Add a custom CSS class to the input element
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
                    {t("pages.contact_us.subject_category")}
                  </label>
                  {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Select Subject Category"
                  name="subject_category"
                  onChange={handleTextChange}
                  value={formData.subject_category}
                /> */}
                  <select
                    id="inputState"
                    name="category"
                    onChange={handleTextChange}
                    value={formData.category}
                    className="form-select"
                    // disabled={props.updateProfile}
                  >
                    <option value="">
                      {t("pages.login.type") +
                        t("pages.contact_us.subject_category")}
                    </option>
                    {subjectCategories.map((item, key) => {
                      return (
                        <option value={item} key={key}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                  {formValidation.category && (
                    <div className="invalid">{t(formValidation.category)}</div>
                  )}
                </div>
                <div className="">
                  <label className="form-label">
                    {t("pages.contact_us.subject")}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder={t("pages.contact_us.sub_plchldr")}
                    name="subject"
                    onChange={handleTextChange}
                    value={formData.subject}
                  />
                  {formValidation.subject && (
                    <div className="invalid">{t(formValidation.subject)}</div>
                  )}
                </div>
                <div class="d-flex flex-column align-items-start">
                  <label className="form-label">
                    {t("pages.contact_us.message")}
                  </label>
                  <textarea
                    class="form-control"
                    name="message"
                    rows="4"
                    placeholder={t(
                      "pages.AccountSettings.booking.leave_review.message"
                    )}
                    onChange={handleTextChange}
                    value={formData.message}
                  ></textarea>
                  <label class="form-label">
                    {messageCharCount}/{t("pages.contact_us.limit")}
                  </label>
                  {formValidation.message && (
                    <div className="invalid">{t(formValidation.message)}</div>
                  )}
                </div>
                <div className="hotelListingSubmit">
                  <div className="actionBtn mb-0">
                    <button
                      type="button"
                      className="appBtn bg-black"
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      <span>
                        {" "}
                        {t("pages.AccountSettings.booking.extension.send")}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="actionBtn mb-0">
                  {/* <button
                  type="button"
                  className="AuthBtn"
                  onClick={(e) => handleFormSubmit(e)}
                >
                  {t("pages.AccountSettings.booking.extension.send")}
                </button> */}
                  <ModalPopup
                    show={successModal}
                    dialogClassName="applicationModal"
                  >
                    <SuccessModalPopup
                      setSuccessModal={setSuccessModal}
                      Title={"Thank You"}
                      Message={"Your message has been successfully sent"}
                      ShowButton={true}
                    />
                  </ModalPopup>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
