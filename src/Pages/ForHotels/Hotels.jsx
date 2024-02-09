import AccountManagerIcon from "Assets/Images/ForHotelsIcons/AccountManagerIcon";
import HomeIcon from "Assets/Images/ForHotelsIcons/HomeIcon";
import ForHotelBanner from "Assets/Images/ForHotelsIcons/HotelBanner.png";
import RatesIcon from "Assets/Images/ForHotelsIcons/RatesIcon";
import IncludeImage from "Assets/Images/ForHotelsIcons/ServiceIncludeImgOne.jpg";
import VolumeIcon from "Assets/Images/ForHotelsIcons/VolumeIcon";
import WideVarietyIcon from "Assets/Images/ForHotelsIcons/WideVarietyIcon";
import AvatarOne from "Assets/Images/ForHotelsIcons/avatarone.png";
import AvatarTwo from "Assets/Images/ForHotelsIcons/avatartwo.png";
import ListHotelBg from "Assets/Images/ForHotelsIcons/ListHotelsbanner.png";
import WhatYouGetImg from "Assets/Images/ForHotelsIcons/WhatYouGetImg.png";
import { useNavigate } from "react-router-dom";
import { Accordion } from "@mantine/core";
import "Pages/ForHotels/hotel.css";
import {  BsPlusCircle } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import validationHelper from "Helpers/validationHelper";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import maskingActions from "reducers/masking/masking.actions";
import { toast } from "react-toastify";
import Select from "react-select";
import dropdownService from "Services/dropdownService";
import { customFilterForSelect } from "Helpers/commonMethodHelper";
import contactusService from "Services/contactus";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";
import { isPossiblePhoneNumber } from "react-phone-number-input";

const ForHotels = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [successModal, setSuccessModal] = useState(false);

  const navigate = useNavigate();

  const defaultFormData = {
    name: "",
    surname: "",
    phone_number: "",
    email: "",

    hotel_name: "",
    hotel_address: "",
    hotel_city: "",
    hotel_country: "",
    hotel_accommodation_type: "",
    hotel_zipcode: "",

    message: "",
    subject: "Request to list hotel",
    category: "Hotel Request Enquiry",
  };

  const defaultFormValidation = {
    name: "",
    surname: "",
    phone_number: "",
    email: "",

    hotel_name: "",
    hotel_address: "",
    hotel_city: "",
    hotel_country: "",
    hotel_accommodation_type: "",
    hotel_zipcode: "",

    message: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);
  const { language, currency_code } = useSelector((state) => state.language);
  const [countryDropdown, setCountryDropdown] = useState([]);

  const [showMore, setShowMore] = useState(false);
  const longText = t("pages.for_hotels.person1_text");
  const toggleText = () => {
    setShowMore(!showMore);
  };


  const [showMore1, setShowMore1] = useState(false);
  const longText1 = t("pages.for_hotels.person2_text");
  const toggleText1 = () => {
    setShowMore1(!showMore1);
  };

  const accomodationType = [
    { value: "pages.for_hotels.opt1", label: "pages.for_hotels.opt1" },
    { value: "pages.for_hotels.opt2", label: "pages.for_hotels.opt2" },
    { value: "pages.for_hotels.opt3", label: "pages.for_hotels.opt3" },
    { value: "pages.for_hotels.opt4", label: "pages.for_hotels.opt4" },
    { value: "pages.for_hotels.opt5", label: "pages.for_hotels.opt5" },
    { value: "pages.for_hotels.opt6", label: "pages.for_hotels.opt6" },
  ];

  useEffect(() => {
    dispatch(maskingActions.showMasking());
    dropdownService
      .get_country_dropdown()
      .then((res) => {
        const newArray = res.data?.map((obj) => ({
          ...obj,
          value: obj.country_id,
          label: obj.country_name,
        }));
        setCountryDropdown(newArray);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [language]);

  const runValidations = () => {
    const updatedValidations = {
      name: validationHelper.validTermRule(formData.name, "First Name"),
      surname: validationHelper.validTermRule(formData.surname, "Last Name"),
      phone_number: formData.phone_number
        ? isValidPhoneNumber(formData.phone_number)
          ? ""
          : "validation.invalid_input"
        : "validation.required",
      email: validationHelper.validateMailId(formData.email, "Email Address"),

      hotel_name: validationHelper.validTermRule(
        formData.hotel_name,
        "Hotel Name"
      ),
      hotel_address: validationHelper.validateAddress(
        formData.hotel_address,
        "Hotel Address"
      ),
      hotel_city: validationHelper.validTermRule(
        formData.hotel_city,
        "Hotel City"
      ),
      hotel_country: validationHelper.validateDropdown(
        formData.hotel_country,
        "Hotel country"
      ),
      hotel_accommodation_type: validationHelper.validateDropdown(
        formData.hotel_accommodation_type,
        "Hotel Accommodation Type"
      ),
      hotel_zipcode: validationHelper.validateNaturalNumberForZIPCODE(
        formData.hotel_zipcode,
        "zip_code"
      ),

      message: validationHelper.validateOptionalDescriptionFor500Chars(
        formData.message,
        "message"
      ),
    };
    return updatedValidations;
  };

  const handleDropdownChange = (value, name) => {
    const errors = {
      ...formValidation,
    };
    switch (name) {
      case "hotel_country":
        errors[name] = validationHelper.validateDropdown(
          value,
          "hotel_country"
        );
        break;

      case "hotel_accommodation_type":
        errors[name] = validationHelper.validateDropdown(
          value,
          "hotel_accommodation_type"
        );
        break;
      default:
        break;
    }
    setFormValidation(errors);
  };

  const handleTextChange = (e) => {
    if (e.target.type !== "checkbox") {
      e.preventDefault();
    }
    const { name, value } = e.target;

    const errors = {
      ...formValidation,
    };
    // debugger;
    switch (name) {
      case "name":
        errors[name] = validationHelper.validTermRule(value, "name");
        break;

      case "surname":
        errors[name] = validationHelper.validTermRule(value, "surname");
        break;

      case "phone_number":
        errors[name] = validationHelper.validateMobileNo(value, "Phone Number");
        break;

      case "email":
        errors[name] = validationHelper.validateMailId(value, "Email Address");
        break;

      case "hotel_name":
        errors[name] = validationHelper.validTermRule(value, "hotel_name");
        break;

      case "hotel_address":
        errors[name] = validationHelper.validateAddress(value, "hotel_address");
        break;

      case "hotel_city":
        errors[name] = validationHelper.validTermRule(value, "hotel_city");
        break;

      case "hotel_zipcode":
        errors[name] = validationHelper.validateNaturalNumberForZIPCODE(
          value,
          "hotel_zipcode"
        );
        break;

      case "message":
        errors[name] = validationHelper.validateOptionalDescriptionFor500Chars(
          value,
          "message"
        );
        break;

      default:
        break;
    }

    setFormValidation(errors);
    if (e.target.type === "file") {
    } else {
      setFormData((prevState) => {
        return {
          ...prevState,
          [name]: e.target.type === "checkbox" ? e.target.checked : value,
        };
      });
    }
  };

  const submitHotelRequest = async (e) => {
    e.preventDefault();
    const errors = runValidations();
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;

    if (isRequiredFieldsAreValid) {
      // var req_body = {

      // };
      dispatch(maskingActions.showMasking());

      contactusService
        .add_inquiry(formData)
        .then((res) => {
          setFormData(defaultFormData);
          setSuccessModal(true);
        })
        .catch((error) => {
          console.error(error);
          toast.error(error?.response?.data?.message);
        })
        .finally(() => {
          dispatch(maskingActions.hideMasking());
        });
    } else {
      setFormValidation(errors);
    }
  };

  const characterCount = formData.message?.length;
  //const remainingCharacters = 500 - characterCount;

  return (
    <>
      <div class="ha--corporateCustomer ha--experienceUI">
        <div className="ha--banner-container">
          <div
            className="bannerSection ha--contactBnrSec"
            style={{ backgroundImage: `url(${ForHotelBanner})` }}
          >
            <div className="ha--bannerSection-breadcrumb">
              <div className="ha--appBreadCrumb contactBreadCrumb">
                <ul className="ha--breadcrumbList breadcrumbList">
                  <li
                    className="breadcrumbItem cursor-pointer"
                    onClick={() => navigate("/")}
                  >
                    {/* <NavLink to="/"> */}
                    <HomeIcon />
                    {/* </NavLink> */}
                  </li>
                  <li className="breadcrumbItem">
                    {/* <NavLink to=""> */}
                    {t("pages.for_hotels.title")}
                    {/* </NavLink> */}
                  </li>
                </ul>
              </div>
              <div className="sectionTitleDesc">
                <h2>{t("pages.for_hotels.header_title")}</h2>
                <p>
                  {t("pages.for_hotels.header_subtitle")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="ha--experienceContainer ha--HotelMainContainer">
          <div className="includedService forHotelIncluded">
            <div className="ha--ForHotelServices hotelSpacing">
              <div className="ha--ForHotelServicesImgCol">
                <div className="includedBlurb">
                  <div className="includeImage">
                    <img src={IncludeImage} alt="Included Servies" />
                  </div>
                  <div className="includedImageBox boxOne">
                    <div className="includedImageBoxImg">
                      <img src={AvatarOne} alt="Avatar" />
                    </div>
                    <div className="includedBlurbContent">
                      <h6>
                        {t("pages.for_hotels.person1")}
                      </h6>
                      {/* <p>
                        {t("pages.for_hotels.person1_text")}
                      </p> */}
                      <p>
                        {showMore
                          ? longText
                          : longText.slice(0, 165) + (longText.length > 165 ? '...' : '')}
                        {longText.length > 165 && (
                          <span
                            className="cursor-pointer"
                            style={{ fontWeight: 600 }}
                            onClick={toggleText}
                          >
                            {showMore ? " " + t('pages.properties.show_less') : t('pages.properties.show_more')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="includedImageBox boxTwo">
                    <div className="includedImageBoxImg">
                      <img src={AvatarTwo} alt="Avatar" />
                    </div>
                    <div className="includedBlurbContent">
                      <h6>{t("pages.for_hotels.person2")}</h6>
                      {/* <p>
                        {t("pages.for_hotels.person2_text")}
                      </p> */}

                      <p>
                        {showMore1
                          ? longText1
                          : longText1.slice(0, 165) + (longText1.length > 165 ? '...' : '')}
                        {longText1.length > 165 && (
                          <span
                            className="cursor-pointer"
                            style={{ fontWeight: 600 }}
                            onClick={toggleText1}
                          >
                            {showMore1 ? " " + t('pages.properties.show_less') : t('pages.properties.show_more')}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ha--ForHotelServicesContentCol">
                <div className="ourServiceIncluded">
                  <h2>{t("pages.for_hotels.our_service_include")}</h2>
                </div>
                <div className="serviceIconBoxes">
                  <div className="iconBox">
                    <div className="boxicon">
                      <AccountManagerIcon />
                    </div>
                    <div className="iconBoxContent">
                      <p>
                        {t("pages.for_hotels.dedicated_account")} <br />{" "}
                        {t("pages.for_hotels.manager")}
                      </p>
                      <span className="prsnlItemDes">
                        {t("pages.for_hotels.ser1")}
                      </span>
                    </div>
                  </div>
                  <div className="iconBox">
                    <div className="boxicon">
                      <VolumeIcon />
                    </div>
                    <div className="iconBoxContent">
                      <p>
                        {t("pages.for_hotels.marketing_your")}
                        <br /> {t("pages.for_hotels.property")}
                      </p>
                      <span className="prsnlItemDes">
                        {t("pages.for_hotels.ser2")}
                      </span>
                    </div>
                  </div>
                  <div className="iconBox">
                    <div className="boxicon">
                      <RatesIcon />
                    </div>
                    <div className="iconBoxContent">
                      <p>
                        {t("pages.for_hotels.best_competitive")}
                        <br /> {t("pages.for_hotels.rates")}
                      </p>
                      <span className="prsnlItemDes">
                        {t("pages.for_hotels.ser3")}
                      </span>
                    </div>
                  </div>
                  <div className="iconBox">
                    <div className="boxicon">
                      <WideVarietyIcon />
                    </div>
                    <div className="iconBoxContent">
                      <p>
                        {t("pages.for_hotels.ser4_heading")}
                        <br /> {t("pages.for_hotels.ser4_heading1")}
                      </p>
                      <span className="prsnlItemDes">
                        {t("pages.for_hotels.ser4")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="ha--listHotelForm listHotelForm">
              <div className="sectionTitleDesc text-center">
                <h2>{t("pages.for_hotels.list_your_hotel")}</h2>
                <p>
                  {t("pages.for_hotels.list_hotel_text")}
                </p>
              </div>

              <div className="ha--listHotelFormDes hotelSpacing">
                <div
                  className="hotelFormBg"
                  style={{ backgroundImage: `url(${ListHotelBg})` }}
                >
                  <div className="listingHotelForm">
                    <form>
                      <div className="row">
                        <div className="col-lg-6">
                          <h3>{t("pages.for_hotels.personal_info")}</h3>
                          <div className="row gap-3">
                            <div className="col p-0">
                              <label className="form-label">
                                {t("pages.for_hotels.name")}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={t("pages.for_hotels.name")}
                                aria-label="First name"
                                name="name"
                                onChange={handleTextChange}
                                value={formData.name}
                              />
                              {formValidation.name && (
                                <div className="invalid">
                                  {t(formValidation.name)}
                                </div>
                              )}
                            </div>
                            <div className="col p-0">
                              <label className="form-label">
                                {t("pages.for_hotels.surname")}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={t("pages.for_hotels.surname")}
                                aria-label="Surname"
                                name="surname"
                                onChange={handleTextChange}
                                value={formData.surname}
                              />
                              {formValidation.surname && (
                                <div className="invalid">
                                  {t(formValidation.surname)}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-12 p-0">
                              <label className="form-label">
                                {t("pages.for_hotels.mob_no")}
                              </label>
                              <PhoneInput
                                international
                                countryCallingCodeEditable={false}
                                className="form-control frgtInput d-flex"
                                placeholder={t("pages.for_hotels.mob_no")}
                                value={formData.phone_number}
                                name="phone_number"
                                defaultCountry="AE"
                                onChange={(e) => {
                                  const errors = {
                                    ...formValidation,
                                  };
                                  errors["phone_number"] = e
                                    ? isPossiblePhoneNumber(e)
                                      ? undefined
                                      : "validation.invalid_input"
                                    : "validation.required";
                                  setFormValidation(errors);
                                  setFormData((prevState) => {
                                    return {
                                      ...prevState,
                                      phone_number: e,
                                    };
                                  });
                                }}
                              />
                              {formValidation.phone_number && (
                                <div className="invalid">
                                  {t(formValidation.phone_number)}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-12 p-0">
                              <label className="form-label">
                                {t("pages.for_hotels.email")}
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                placeholder={t("pages.for_hotels.email")}
                                aria-label="Email address"
                                name="email"
                                onChange={handleTextChange}
                                value={formData.email}
                              />
                              {formValidation.email && (
                                <div className="invalid">
                                  {t(formValidation.email)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <h3 className="ps-2">
                            {t("pages.for_hotels.hotel_info")}
                          </h3>
                          <div className="row flex-wrap hotelInfoGap">
                            <div className="col-lg-6">
                              <label className="form-label">
                                {t("pages.for_hotels.hotel_name")}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={t("pages.for_hotels.hotel_name")}
                                aria-label="Hotel name"
                                name="hotel_name"
                                onChange={handleTextChange}
                                value={formData.hotel_name}
                              />
                              {formValidation.hotel_name && (
                                <div className="invalid">
                                  {t(formValidation.hotel_name)}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">
                                {t("pages.for_hotels.address")}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={t("pages.for_hotels.address")}
                                aria-label="Address"
                                name="hotel_address"
                                onChange={handleTextChange}
                                value={formData.hotel_address}
                              />
                              {formValidation.hotel_address && (
                                <div className="invalid">
                                  {t(formValidation.hotel_address)}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">
                                {t("pages.for_hotels.city")}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={t("pages.for_hotels.city")}
                                aria-label="City"
                                name="hotel_city"
                                onChange={handleTextChange}
                                value={formData.hotel_city}
                              />
                              {formValidation.hotel_city && (
                                <div className="invalid">
                                  {t(formValidation.hotel_city)}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-6 hotelSlctCountry">
                              <label className="form-label">
                                {t("pages.for_hotels.country")}
                              </label>
                              <Select
                                placeholder={t("pages.for_hotels.country")}
                                options={countryDropdown}
                                value={
                                  formData.hotel_country
                                    ? countryDropdown?.find(
                                      (f) =>
                                        f.value === formData.hotel_country
                                    )
                                    : null
                                }
                                onChange={(e) => {
                                  setFormData((prevState) => {
                                    return {
                                      ...prevState,
                                      hotel_country: e.value,
                                    };
                                  });
                                  handleDropdownChange(
                                    e.value,
                                    "hotel_country"
                                  );
                                }}
                                filterOption={customFilterForSelect}
                                getOptionLabel={(option) => option.label}
                              />
                              {formValidation.hotel_country && (
                                <div className="invalid">
                                  {t(formValidation.hotel_country)}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-6 hotelSlctCountry">
                              <label className="form-label">
                                {t("pages.for_hotels.type")}
                              </label>
                              {/* <select id="inputState" className="form-select">
                            <option selected>Type</option>
                            <option>Type</option>
                          </select> */}

                              <Select
                                isMulti={true}
                                placeholder={t("pages.for_hotels.select")}
                                // options={t(accomodationType)}
                                // value={t(accomodationType)?.find(f => f.value === formData.hotel_accommodation_type)}
                                // onChange={(e) => {
                                //   setFormData((prevState) => {
                                //     return {
                                //       ...prevState,
                                //       hotel_accommodation_type: e.value,
                                //     };
                                //   }); handleDropdownChange(e.value, "hotel_accommodation_type")
                                // }}

                                options={accomodationType.map((option) => ({
                                  value: option.value,
                                  label: t(option.label),
                                }))}
                                value={
                                  formData.hotel_accommodation_type
                                    ? accomodationType.find(
                                      (option) =>
                                        option.value ===
                                        formData.hotel_accommodation_type
                                    )
                                    : null
                                }
                                onChange={(selectedOptions) => {
                                  const selectedValues = selectedOptions?.map(
                                    (option) => t(option.value)
                                  );
                                  const selectedString =
                                    selectedValues.join(",");
                                  setFormData((prevState) => ({
                                    ...prevState,
                                    hotel_accommodation_type: selectedString,
                                  }));
                                  handleDropdownChange(
                                    selectedValues,
                                    "hotel_accommodation_type"
                                  );
                                }}
                                filterOption={customFilterForSelect}
                                getOptionLabel={(option) => option.label}
                              />
                              {formValidation.hotel_accommodation_type && (
                                <div className="invalid">
                                  {t(formValidation.hotel_accommodation_type)}
                                </div>
                              )}
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">
                                {t("pages.for_hotels.zip_code")}
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder={t("pages.for_hotels.zip_code")}
                                aria-label="Zip code"
                                name="hotel_zipcode"
                                onChange={handleTextChange}
                                value={formData.hotel_zipcode}
                              />
                              {formValidation.hotel_zipcode && (
                                <div className="invalid">
                                  {t(formValidation.hotel_zipcode)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-12 mt-3">
                          <label className="form-label">
                            {t("pages.for_hotels.message")}
                          </label>
                          <textarea
                            type="text"
                            rows={5}
                            name="message"
                            className="form-control"
                            placeholder={t("pages.for_hotels.message")}
                            onChange={handleTextChange}
                            value={formData.message}
                            maxLength={500}
                          />
                          <label class="form-label">
                            {formData.message?.length}/500{" "}
                            {t("pages.for_hotels.words")}
                          </label>
                          {formValidation.message && (
                            <div className="invalid">
                              {t(formValidation.message)}
                            </div>
                          )}
                        </div>
                        <div className="col-lg-12 mt-3">
                          <div className="hotelListingSubmit">
                            <div className="actionBtn mb-0">
                              <button
                                type="button"
                                className="appBtn bg-black"
                                onClick={(e) => submitHotelRequest(e)}
                              >
                                <span>{t("pages.for_hotels.request")}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="ha--WhatGetDes whatGetSm">
                <div className="sectionTitleDesc text-center">
                  <h2>{t("pages.for_hotels.what_you_get")}</h2>
                  {/* <p>{t("pages.for_hotels.what_you_get_text")}</p> */}
                </div>

                <div className="ha--ForHotelAccordian hotelSpacing accordianHotelSm">
                  <div className="ha--ForHotelAccordianLeft">
                    <div className="faqSection hotelAccordian">
                      <Accordion
                        variant="filled"
                        chevronPosition="left"
                        defaultValue="Exposure"
                        chevron={<BsPlusCircle size="2rem" />}
                      >
                        <Accordion.Item value="Exposure">
                          <Accordion.Control>
                            {t(
                              "pages.for_hotels.exposure_to_responsible_guests"
                            )}
                          </Accordion.Control>
                          <Accordion.Panel>
                            {t(
                              "pages.for_hotels.exposure_responsible_guests_text"
                            )}
                          </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="Extended">
                          <Accordion.Control>
                            {t("pages.for_hotels.repeated_stays")}
                          </Accordion.Control>
                          <Accordion.Panel>
                            {t("pages.for_hotels.repeated_stays_text")}
                          </Accordion.Panel>
                        </Accordion.Item>

                        {/* <Accordion.Item value="Dedicated">
                          <Accordion.Control>
                            {t("pages.for_hotels.dedicated_account_manager")}
                          </Accordion.Control>
                          <Accordion.Panel>
                            {t(
                              "pages.for_hotels.dedicated_account_manager_text"
                            )}
                          </Accordion.Panel>
                        </Accordion.Item> */}

                        <Accordion.Item value="Professional">
                          <Accordion.Control>
                            {t("pages.for_hotels.professional_services")}
                          </Accordion.Control>
                          <Accordion.Panel>
                            {t("pages.for_hotels.professional_services_text")}
                          </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="Community">
                          <Accordion.Control>
                            {t(
                              "pages.for_hotels.be_part_of_servicedapartment_community"
                            )}
                          </Accordion.Control>
                          <Accordion.Panel>
                            {t("pages.for_hotels.be_part_of_sacommunity_text")}
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </div>
                  <div
                    className="ha--ForHotelAccordianRight"
                  // style={{ backgroundImage: `url(${WhatYouGetImg})` }}
                  >
                    <img src={WhatYouGetImg} alt="WhatYouGetImg" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalPopup show={successModal} dialogClassName="applicationModal">
        <SuccessModalPopup
          setSuccessModal={setSuccessModal}
          Title={t("pages.for_hotels.thank_you")}
          Message={t("pages.for_hotels.success_msg")}
          ShowButton={true}
        />
      </ModalPopup>
    </>
  );
};

export default ForHotels;
