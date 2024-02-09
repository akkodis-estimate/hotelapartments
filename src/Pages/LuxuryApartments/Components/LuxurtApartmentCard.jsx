import ULAImage from "Assets/Images/LuxuaryApartmentIcons/ula.png";
import "Pages/LuxuryApartments/LuxuryApartmentOne/luxuryapartments.css";
import { BsChevronDown } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import { useCallback, useState } from "react";
import { isValidPhoneNumber } from "react-phone-number-input";
import validationHelper from "Helpers/validationHelper";
import PhoneInput from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import maskingActions from "reducers/masking/masking.actions";
import contactusService from "Services/contactus";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";
import { toast } from "react-toastify";
import apartmentService from "Services/apartmentService";

const LuxuryApartmentsCard = (props) => {
    
    const defaultFormData = {
        name: "",
        surname: "",
        phone_number: "",
        subject: "",
        message: "",
        enquiry_type: "", // special(70,71) or general
        apartment_id: "",
        property_id: "",
    };

    const defaultFormValidation = {
        name: "",
        surname: "",
        phone_number: "",
        subject: "",
        message: "",
    };


    const subject_categories = [
        "pages.AccountSettings.personal_info.opt1",
        "pages.AccountSettings.personal_info.opt2",
        "pages.AccountSettings.personal_info.opt3",
    ];

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formValidation, setFormValidation] = useState(defaultFormValidation);
    const [formData, setFormData] = useState(defaultFormData);
    const [successModal, setSuccessModal] = useState(false);
    const [showInquery, setShowInquery] = useState(false);
    const [subjectCategories, setSubjectCategoriesList] = useState(subject_categories);
    const dispatch = useDispatch();

    // Run the Validation on Submit
    const runValidations = () => {
        const updatedValidations = {
            name: validationHelper.validateName(formData.name),
            surname: validationHelper.validateName(formData.surname),
            phone_number: handlePhoneNumberValidation(formData.phone_number),
            subject: validationHelper.validateDescription(formData.subject),
            message: validationHelper.validateDescription(formData.message),
            category: validationHelper.validateDropdown(formData.category),
        };

        // Set updated validation errors
        return updatedValidations;
    };

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
                errors[name] = validationHelper.validateDescription(value, "Subject");
                break;

            case "phone_number":
                errors[name] = validationHelper.validateMobileNo(value);
                break;

            case "category":
                errors[name] = validationHelper.validateDropdown(value);
                break;

            case "message":
                errors[name] = validationHelper.validateDescription(value);
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

    const setInquiryFields = () => {              //start_value, end_value
        // const searchParams = new URLSearchParams(location.search);
        // if (end_value != null && end_value !== false) {
        //   var requestBody = {
        //     start_date: start_value,
        //     end_date: end_value,
        //     customer_id: userDetails?.customer_id,
        //     quotation_sid: searchParams.get("quotesid")   //location.state?.quotationSID,
        //   };
        //dispatch(maskingActions.showMasking());
    
        //var listOfData = [start_value, end_value];
    
        //setDynamicShowDate(listOfData);
    
        setFormData((prevState) => {
          return {
            ...prevState,
    
            subject:
              t("pages.properties.request_for") +
              props?.data?.apartment_title + //formData.apartment_title +
              " at " +
              props?.data?.area_name, //formData.area_name,
            message:
              t("pages.properties.request_quotation_message") +
              props?.data?.apartment_title  + //formData.apartment_title +
              " at " +
              props?.data?.area_name
            //   +
            //   " from " +
            //   moment(listOfData[0]).format("Do MMMM YYYY") +
            //   " To " +
            //   moment(listOfData[1]).format("Do MMMM YYYY"),
          };
        });
      };

    const getapartmentDetails = useCallback((sid) => {
        // window.scrollTo({
        //     top: 0,
        //     left: 0,
        //     behavior: "smooth",
        // });

        dispatch(maskingActions.showMasking());
        apartmentService
            .apartmentDetails(sid)
            .then((res) => {
                setFormData((prevState) => {
                    return {
                        ...prevState,
                        area_name: res.data.area_name ? res.data.area_name : "",
                        apartment_title: res.data.apartment_title
                            ? res.data.apartment_title
                            : "",
                        enquiry_type:
                            res.data.property_type_id === 71 ||
                                res.data.property_type_id === 70
                                ? "special"
                                : "general",
                        apartment_id: res.data.apartment_id,
                        property_id: res.data.property_id,
                    };
                });
            })
            .finally(() => {
                dispatch(maskingActions.hideMasking());
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const errors = runValidations();

        const isRequiredFieldsAreValid =
            Object.keys(errors).filter((key) => errors[key]).length === 0;
        if (isRequiredFieldsAreValid) {
            var { cpassword, ...payload } = { ...formData };

            dispatch(maskingActions.showMasking());

            contactusService
                .add_inquiry(payload)
                .then((res) => {
                    setFormData((prevState) => {
                        return {
                            ...prevState,
                            name: "",
                            surname: "",
                            phone_number: "",
                            subject: "",
                            message: "",
                            enquiry_type: "",
                            apartment_id: "",
                            property_id: "",
                        };
                    });

                    setShowInquery(false);
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

    const onRequestInquiry = (sid) => {
        setInquiryFields();
        getapartmentDetails(sid);
        setShowInquery(true);
    };

    // const navigatePropertyDetail = (sid) => {

    //     if (sid) {
    //         if (props?.quotationSID && props?.startDateFromQuoteParam && props?.endDateFromQuoteParam) {
    //             const url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}?quotesid=${props?.quotationSID}&quotestartdate=${props?.startDateFromQuoteParam}&quoteenddate=${props?.endDateFromQuoteParam}`;
    //             const newTab = window.open(url, '_blank');
    //             if (newTab) {
    //                 newTab.location && newTab.location.href && newTab.location.replace(url);
    //             }
    //         }
    //         else {
    //             const url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`;
    //             const newTab = window.open(url, '_blank');
    //             if (newTab) {
    //                 newTab.location && newTab.location.href && newTab.location.replace(url);
    //             }
    //         }
    //     }
    //     else navigate(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
    // };

    return (
        <>
            <div className="ha--ULACard">
                <div className="ULACityImage">
                    {/* {props?.data?.image_urls?.find(f => f.is_primary == true) ? 
                        <img src={props?.data?.image_urls?.find(f => f.is_primary == true)?.src} alt="Ultra Luxury" />
                        :
                        <img src={props?.data?.image_urls[0]?.src} alt="Ultra Luxury" />
                    } */}

                    <Carousel fade>
                        {props?.data?.image_urls?.map((item, index) => (
                          <Carousel.Item>
                          <img
                            className="d-block w-100"
                            src={
                              item.src
                                ? item?.src?.replace(/\/([^/]+)$/, "/thumb_$1")
                                : ""
                            }
                            alt="First slide"
                            onError={(event) => {
                              event.target.src = item.src;
                            }}
                          />
                        </Carousel.Item>
                        ))}
                    </Carousel>
                </div>
                <div className="ULAFeatureTitle">
                    <h3>{props?.data?.apartment_title} {t("pages.properties.card.at")} {props?.data?.area_name}</h3>
                    <h3>{props?.data?.property_name}</h3>
                    <br />
                    <p>{props?.data?.description}</p>
                </div>
                <div className="ULAFeaturesLIst">
                    {/* <h5>{props?.data?.description}</h5> */}
                    {/* <ul className="ULAListing">
                        <li>Premium 2BR at Jumeirah Living MG</li>
                        <li>
                            Private balconies or terraces with panoramic views
                        </li>
                        <li>Luxurious bedding and linens</li>
                        <li>High-end bathroom amenities</li>
                        <li>24-hour room service</li>
                        <li>Fully-equipped kitchens or kitchenettes</li>
                        <li>
                            Private balconies or terraces with panoramic views
                        </li>
                        <li>24-hour room service</li>
                        <li>Fully-equipped kitchens or kitchenettes</li>
                        <li>
                            Private balconies or terraces with panoramic views
                        </li>
                        <li>Premium 2BR at Jumeirah Living MG</li>
                    </ul> */}
                </div>
                <div className="ULASendEnquiry d-flex justify-content-end">
                    <div className="animateBtn">
                        <button type="button" className="appBtn bg-white" onClick={() => { onRequestInquiry(props?.data?.apartment_sid)}}>             {/*  navigatePropertyDetail(props?.data?.apartment_sid) */}
                            {t("common_lables.send_enquiry")}
                        </button>
                    </div>
                </div>
                <hr className="ULLining" />
            </div>

            <ModalPopup show={showInquery} dialogClassName="applicationModal">
                <form>
                    <div className="modal-header border-0 p-0">
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => {
                                setShowInquery(false);
                            }}
                        ></button>
                    </div>
                    <h2>{t("pages.properties.request_for_quotation")}</h2>

                    <div className="modal-body p-0">
                        <div className="mb-3">
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
                        <div className="mb-3">
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
                                <div className="invalid">
                                    {t(formValidation.surname)}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">
                                {t("pages.AccountSettings.personal_info.phone_number")}
                            </label>
                            <PhoneInput
                                placeholder={
                                    t("pages.login.type") +
                                    " " +
                                    t("pages.AccountSettings.personal_info.phone_number")
                                }
                                value={formData.phone_number}
                                initialValueFormat="national"
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

                        <div className="mb-3">
                            <label className="form-label">{t("pages.AccountSettings.personal_info.subject_category")}</label>
                            <select
                                id="inputState"
                                name="category"
                                onChange={handleTextChange}
                                value={formData.category}
                                className="form-select"
                            // disabled={props.updateProfile}
                            >
                                <option value="">{t("pages.AccountSettings.personal_info.ph_subject_category")}</option>
                                {subjectCategories.map((item, key) => {
                                    return (
                                        <option value={t(item)} key={key}>
                                            {t(item)}
                                        </option>
                                    );
                                })}
                            </select>
                            {formValidation.category && (
                                <div className="invalid">{t(formValidation.category)}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">
                                {t("pages.contact_us.subject")}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Type the subject"
                                name="subject"
                                onChange={handleTextChange}
                                value={formData.subject}
                            />
                            {formValidation.subject && (
                                <div className="invalid">
                                    {t(formValidation.subject)}
                                </div>
                            )}
                        </div>
                        <div className="mb-3 d-flex flex-column align-items-start">
                            <label className="form-label">
                                {t("pages.contact_us.message")}
                            </label>
                            <textarea
                                className="form-control"
                                name="message"
                                rows="4"
                                placeholder="Say anything you want to say"
                                onChange={handleTextChange}
                                value={formData.message}
                            ></textarea>
                            {/* <label className="form-label">{messageCharCount}/400 words</label> */}
                            {formValidation.message && (
                                <div className="invalid">
                                    {t(formValidation.message)}
                                </div>
                            )}
                        </div>
                        <div className="actionBtn mb-0">
                            <button
                                type="button"
                                className="AuthBtn"
                                onClick={(e) => handleFormSubmit(e)}
                            >
                                {t("pages.AccountSettings.booking.extension.send")}
                            </button>
                        </div>
                    </div>
                </form>
            </ModalPopup>

            <ModalPopup
                show={successModal}
                dialogClassName="applicationModal"
            >
                <SuccessModalPopup
                    setSuccessModal={setSuccessModal}
                    Title={"Thank You"}
                    Message={
                        "Your Inquiry Request for Booking has been Sent Successfully."
                    }
                    ShowButton={true}
                />
            </ModalPopup>
        </>
    );
};
export default LuxuryApartmentsCard;