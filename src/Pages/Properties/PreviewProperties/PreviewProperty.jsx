import {
  BsArrowRight,
  BsCheck2,
  BsChevronDown,
  BsChevronUp,
  BsFacebook,
  BsStarFill,
  BsXLg,
} from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { HiOutlineEnvelope } from "react-icons/hi2";
import {
  SetDynamicEndpoint,
  dateFormat,
  truncateText,
} from "Helpers/commonMethodHelper";
import { DATE_FORMATS, RoutePaths } from "Constants/Constants";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-scroll";
import { DatePickerInput } from "@mantine/dates";
import { isValidPhoneNumber } from "react-phone-number-input";
import { IoVideocam } from "react-icons/io5";
import { Tb360View } from "react-icons/tb";

import ShareIcon from "Assets/Images/PropertiesDetailsIcons/ShareIcon";
import AmmenitesBed from "Assets/Images/PropertiesDetailsIcons/AmmenitesBed";
import AmmenitesTub from "Assets/Images/PropertiesDetailsIcons/AmmenitesTub";
import TotalGuestIcon from "Assets/Images/PropertiesDetailsIcons/TotalGuestIcon";
import RuleYardIcon from "Assets/Images/PropertiesDetailsIcons/RuleYardIcon";
import FrontDeskIcon from "Assets/Images/PropertiesDetailsIcons/FrontDeskIcon";

import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import maskingActions from "reducers/masking/masking.actions";
import apartmentService from "Services/apartmentService";

import ApartmentDetailsMap from "Components/Shared/GoogleMap/ApartmentDetailsMap";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import bookingService from "Services/bookingService";
import validationHelper from "Helpers/validationHelper";
import PhoneInput from "react-phone-number-input";
import contactusService from "Services/contactus";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";
import DefaultImage from "Assets/Images/3d (1).jpg";
import moment from "moment";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import "Pages/Properties/PropertiesDetail/PropertyDetail/propertiesdetails.css";
import Gallery from "../PropertiesDetail/Components/Gallery/Gallery";
import VideoGallery from "../PropertiesDetail/Components/VideoGallery/VideoGallery";
import AmmenitiesModal from "../PropertiesDetail/Components/AmmenitiesModal/AmmenitiesModal";
import ThreeSixtyView from "../PropertiesDetail/Components/ThreeSixtyView/ThreeSixtyView";
import { ScrollArea, Skeleton } from "@mantine/core";

const PreviewProperty = (props) => {
  const location = useLocation();
  const [showVideoGallery, setShowVideoGallery] = useState(false);
  const [show360Image, setShow360Image] = useState(false);
  const [isVisible, setIsVisible] = useState(true); //Scroll Top Navbar
  const [videoClick, setVideoClick] = useState();

  //Navigation Scroll
  useEffect(() => {
    window.addEventListener("scroll", listenToScroll);
    return () => window.removeEventListener("scroll", listenToScroll);
  }, []);

  const listenToScroll = () => {
    let heightToHideFrom = 200;
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      isVisible && setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

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

  const { userDetails } = useSelector((state) => state.customerAuth);

  const dispatch = useDispatch();
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showAmmenities, setShowAmmenities] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);

  const [apartmentDetails, setapartmentDetails] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [activeCityHighlightsItem, setActiveCityHighlightsItem] = useState(-1);
  const [zoomLevel, setzoomLevel] = useState(13);
  const [showInquery, setShowInquery] = useState(false);
  const [filterPlaces, setFilteredPlace] = useState([]);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);
  const [viewerOpen, setViewerOpen] = useState(true);

  //GET BOOKING DATA
  const [dateValue, setDateValue] = useState([null, null]);
  const [requestBooking, setRequestBooking] = useState(false);
  const [bookingPrice, setBookingPrice] = useState(null);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const [checkPropertyType, setcheckPropertyType] = useState();
  const [formData, setFormData] = useState(defaultFormData);
  const [successModal, setSuccessModal] = useState(false);

  const [dynamicShowDate, setDynamicShowDate] = useState([]);

  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const { language, currency_code } = useSelector((state) => state.language);

  const [showAllHighlights, setShowAllHighlights] = useState(false);

  const [loadingData, setLoadingData] = useState(true);
  const { isMasked } = useSelector((state) => state.masking);

  const { isLoading } = useSelector((state) => state.customerAuth);

  const [showFullText, setShowFullText] = useState([]);

  const getapartmentDetails = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    dispatch(maskingActions.showMasking());
    apartmentService
      .apartmentDetails(id)
      .then((res) => {

        setapartmentDetails(res.data ? res.data : []);

        //apartment_amenities and apartment_facilities and store in allAmenities
        //const combinedArray = ([...res?.data?.apartment_amenities, ...res?.data?.property_facilities])

        const combinedArray = [
          ...(res?.data?.apartment_amenities ?? []),
          ...(res?.data?.property_facilities ?? []),
        ];
        setAllAmenities(combinedArray);
        if (
          res?.data?.close_to_apartment &&
          res?.data?.close_to_apartment.length > 0
        ) {
          const filteredPlace = res?.data?.near_by_places?.filter(
            (item) =>
              item.category_sid ===
              res?.data?.close_to_apartment[0].category_sid
          );
          setFilteredPlace(filteredPlace);
        }
        setcheckPropertyType(
          res.data.property_type_id ? res.data.property_type_id : ""
        );

        if (
          !res?.data?.close_to_apartment ||
          res?.data?.close_to_apartment.length <= 0
        ) {
          setActiveCityHighlightsItem(0);
          setzoomLevel(10);
          const filteredPlaceForCity = res?.data?.city_highlight_places?.filter(
            (item) =>
              item.category_sid ===
              res?.data?.close_to_city_highlights[0].category_sid
          );
          setFilteredPlace(filteredPlaceForCity);
        }

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
        setLoadingData(false);
        dispatch(maskingActions.hideMasking());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getapartmentDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, currency_code]);

  const handleClick = (index, category_sid) => {
    setActiveItem(index);
    setActiveCityHighlightsItem(-1);
    setzoomLevel(13);
    const filteredPlace = apartmentDetails?.near_by_places?.filter(
      (item) => item.category_sid === category_sid
    );
    setFilteredPlace(filteredPlace);
  };

  const handleCityHighlightsClick = (index, category_sid) => {
    setActiveCityHighlightsItem(index);
    setActiveItem(-1);
    setzoomLevel(10);
    const filteredPlaceForCity =
      apartmentDetails?.city_highlight_places?.filter(
        (item) => item.category_sid === category_sid
      );
    setFilteredPlace(filteredPlaceForCity);
  };

  const getBookingPrice = (start_value, end_value) => {
    if (checkPropertyType !== 71 && checkPropertyType !== 70) {
      if (end_value != null && end_value !== false) {
        var requestBody = {
          start_date: start_value,
          end_date: end_value,
          customer_id: userDetails?.customer_id,
          quotation_sid: location.state?.quotationSID,
        };
        dispatch(maskingActions.showMasking());

        var listOfData = [start_value, end_value];

        setDynamicShowDate(listOfData);

        setFormData((prevState) => {
          return {
            ...prevState,

            subject:
              t("pages.properties.request_for") +
              formData.apartment_title +
              " at " +
              formData.area_name,
            message:
              t("pages.properties.request_quotation_message") +
              formData.apartment_title +
              " at " +
              formData.area_name +
              " from " +
              moment(listOfData[0]).format("Do MMMM YYYY") +
              " To " +
              moment(listOfData[1]).format("Do MMMM YYYY"),
          };
        });
        apartmentService
          .getBookingPrice(id, requestBody)
          .then((res) => {
            setBookingPrice(res.data);
            if (res.data?.quotation_warning) {
              toast.warning(t("validation.quote_err_msg"));
            }
          })
          .catch((res) => {
            toast.error(t("toaster_message.error"));
          })
          .finally(() => {
            dispatch(maskingActions.hideMasking());
          });
      }
    }
  };

  const onRequestBooking = () => {
    setRequestBooking(true);
  };

  const onAddToBookingCart = () => {
    var reqBody = {
      start_date: dateFormat(dateValue[0], DATE_FORMATS.YMD),
      end_date: dateFormat(dateValue[1], DATE_FORMATS.YMD),
      customer_id: userDetails?.customer_id,
      property_id: apartmentDetails?.property_id,
      apartment_id: apartmentDetails?.apartment_id,
      currency_id: apartmentDetails?.currency_id,
      guests: 1,
      quotation_sid: location.state?.quotationSID,
    };
    dispatch(maskingActions.showMasking());

    bookingService
      .add_to_booking_cart(reqBody)
      .then((res) => {

        setIsAddToCart(true);
        navigate("/bookings-cart-list");
        //setBookingPrice(res.data)
      })
      .catch((res) => {
        toast.error(t("toaster_message.error"));
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  // click on Request Inquiry  Show the Popup
  const onRequestInquiry = () => {
    getapartmentDetails();
    setShowInquery(true);
  };

  // Run the Validation on Submit
  const runValidations = () => {
    const updatedValidations = {
      name: validationHelper.validateName(formData.name),
      surname: validationHelper.validateName(formData.surname),
      phone_number: handlePhoneNumberValidation(formData.phone_number),
      subject: validationHelper.validateEmptyColumn(formData.subject),
      message: validationHelper.validateEmptyColumn(formData.message),
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
        errors[name] = validationHelper.validateEmptyColumn(value, "Subject");
        break;

      case "phone_number":
        errors[name] = validationHelper.validateMobileNo(value);
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

  const onAcceptBooking = () => {
    if (userDetails) {
      if (id)
        navigate(`${SetDynamicEndpoint(RoutePaths.BOOKING.BOOKING, [id])}`, {
          state: {
            start_date: dateValue[0],
            end_date: dateValue[1],
            quotationSID: location.state?.quotationSID,
          },
        });
      else
        navigate(
          `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [id])}`
        );
    } else {
      //history.push(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}?redirect=${encodeURIComponent(window.location.pathname)}`);
      navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`, {
        state: {
          returnPath: `${SetDynamicEndpoint(RoutePaths.BOOKING.BOOKING, [id])}`,
          start_date: dateValue[0],
          end_date: dateValue[1],
          quotationSID: location.state?.quotationSID,
        },
      });
      //navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`);
    }
  };

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

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        toast.success(t("toaster_message.link_copied"));
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard:", error);
      });
  };

  const handleEmailClick = () => {
    // const currentURL = window.location.href;
    // navigator.clipboard.writeText(currentURL)
    //   .then(() => {
    //     const emailContent = 'Hello, I wanted to share this URL with you: ' + currentURL;
    //     const emailLink = `mailto:?subject=Check out this URL&body=${encodeURIComponent(emailContent)}`;
    //     window.location.href = emailLink;
    //   })
    //   .catch((error) => {
    //     console.error('Failed to copy URL to clipboard:', error);
    //   });

    //const recipientEmail = 'example@example.com'; // Replace with the recipient's email address
    const subject = "Shared Property By Service Apartment"; // Replace with the subject of the email
    const body =
      "Hello, I would like to share apartment with you: " +
      window.location.href; // Replace with the body of the email

    const emailContent = `mailto:info@hotelapartments.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    // navigator.clipboard.writeText(emailContent)
    //   .then(() => {
    //     // You can show a success message to the user if needed
    //   })
    //   .catch((error) => {
    //     console.error('Failed to copy email content to clipboard:', error);
    //     // You can show an error message to the user if needed
    //   });

    //window.open(emailContent);
    window.location.href = emailContent;
  };

  const handleFacebookClick = () => {
    const fixedContent = "Hello, I would like to share apartment with you: ";
    const shareUrl = window.location.href; // Replace with your website URL

    // Generate the Facebook share URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(fixedContent)}`;

    // Open the Facebook share dialog in a new window
    window.open(facebookShareUrl, "_blank");
  };

  const onAparmentDetails = (apartment_sid) => {
    navigate(
      `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [
        apartment_sid,
      ])}`,
      { state: { apartment_sid: apartment_sid } }
    );
    window.location.reload();
  };

  const highlightedAmenities = allAmenities?.filter(
    (item) => item?.is_highlighted
  );
  const displayedHighlights = showAllHighlights
    ? highlightedAmenities
    : highlightedAmenities?.slice(0, 7);

  // const toggleShowFullText = () => {
  //   setShowFullText((prev) => !prev);
  // };

  const toggleShowFullText = (index) => {
    setShowFullText((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <>
      {/* {isVisible && (
        <div id="hide">
          <div className="sectionNavbar">
            <ul className="sectionNavbarList d-flex align-items-center justify-content-around">
              <Link
                activeClass="active"
                to="technology-section"
                spy={true}
                smooth={true}
                offset={-130}
                duration={500}
              >
                {t("pages.properties.about")}
              </Link>
              {allAmenities.length > 0 && (
                <Link
                  activeClass="active"
                  to="amenities-section"
                  spy={true}
                  smooth={true}
                  offset={-130}
                  duration={500}
                >
                  {t("pages.properties.amenities")}
                </Link>
              )}
              {apartmentDetails.terms_and_rules?.length > 0 && (
                <Link
                  activeClass="active"
                  to="terms-rule-section"
                  spy={true}
                  smooth={true}
                  offset={-130}
                  duration={500}
                >
                  {t("pages.properties.terms_rules")}
                </Link>
              )}
              
              {apartmentDetails.close_to_apartment?.length > 0 && (
                <Link
                  activeClass="active"
                  to="close-to-apartment-section"
                  spy={true}
                  smooth={true}
                  offset={-130}
                  duration={500}
                >
                  {t("pages.properties.close_apartment")}
                </Link>
              )}
              {apartmentDetails.reviews && apartmentDetails.reviews.length > 0 && <Link
                activeClass="active"
                to="reviews-section"
                spy={true}
                smooth={true}
                offset={-130}
                duration={500}
              >
                {t("pages.AccountSettings.booking.property_info.review")}
              </Link>}
            </ul>
          </div>
        </div>
      )} */}
      {/* {apartmentDetails && ( */}
      {!loadingData && !isMasked && !isLoading && apartmentDetails ? (
        <div className="propertyDetailPage">
          <div className="container">
            <div className="propertyDetailHeader">
              <div>
                <div className="breadcrumbTitle">
                  {/* <div className="breadCrumbProperties">
                    <div className="appBreadCrumb mb-3">
                      <ul className="breadcrumbList d-flex align-items-center">
                        <li className="breadcrumbItem active">
                          {t("pages.properties.feature_properties.home")}
                        </li>
                        <li className="breadcrumbItem active">
                          {t("pages.properties.feature_properties.search")}
                        </li>
                        <li className="breadcrumbItem">
                          {apartmentDetails.apartment_title}{" "}
                          {t("pages.properties.feature_properties.at")}{" "}
                          {apartmentDetails.area_name}
                        </li>
                      </ul>
                    </div>
                  </div> */}
                  <h4>
                    {apartmentDetails.apartment_title}{" "}
                    {t("pages.properties.feature_properties.at")}{" "}
                    {apartmentDetails.area_name}
                  </h4>
                  <div className="d-flex align-items-center gap-4">
                    {apartmentDetails?.property_ratings > 0 && (
                      <div className="ratingDetail d-flex align-items-center gap-1">
                        {[...Array(apartmentDetails?.property_ratings)].map(
                          (_, index) => (
                            <BsStarFill key={index} />
                          )
                        )}
                      </div>
                    )}
                    {apartmentDetails?.property_name && <span className="hotelNameText">{apartmentDetails?.property_name}</span>}
                  </div>
                </div>
              </div>
            </div>

            {apartmentDetails.apartment_images && (
              <Gallery galleryImages={apartmentDetails.apartment_images} />
            )}

            <div className="propertyDetailContainer">
              <div className="col8column">
                <div className="ammenitiesHighlights">
                  <div className="d-flex align-items-center gap-3">
                    <span>{t("pages.properties.highlights")}:</span>
                    <div className="d-flex align-items-center ">
                      <div className="d-flex align-items-center gap-3 ammenities">
                        <AmmenitesBed />
                        <span>{apartmentDetails.no_of_rooms}</span>
                      </div>
                      <div className="d-flex align-items-center gap-3 ammenities">
                        <AmmenitesTub />
                        <span>{apartmentDetails.no_of_bathrooms}</span>
                      </div>
                      <div className="d-flex align-items-center gap-3 ammenities">
                        <TotalGuestIcon />
                        <span>{apartmentDetails.accomodation}</span>
                      </div>
                      {apartmentDetails.apartment_area && (
                        <div className="d-flex align-items-center gap-3 ammenities">
                          <RuleYardIcon />
                          <span>
                            {apartmentDetails.apartment_area}{" "}
                            {apartmentDetails.apartment_area_unit}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="propertiesHighlights">
                  <div className="propertyDetailSectionTitle">
                    <h6>{t("pages.properties.highlights")}</h6>
                  </div>

                  <div className="d-flex align-items-center flex-wrap gap-3">
                    {/* {allAmenities &&
                    allAmenities.length > 0 &&
                    allAmenities.map((item, index) => {
                      if (item?.is_highlighted) {
                        return (
                          <div className=" d-inline-flex align-items-center gap-2 highlightsCard">
                            <FrontDeskIcon />
                            {item?.name}
                          </div>
                        );
                      }
                    })} */}

                    {allAmenities && (
                      <div>
                        <div className="d-flex align-items-center flex-wrap gap-3">
                          {displayedHighlights.map((item, index) => (
                            <div
                              className="d-inline-flex align-items-center gap-2 highlightsCard"
                              key={index}
                            >
                              {item?.image_url &&
                                item?.image_url != null &&
                                item?.image_url != "" ? (
                                <img
                                  src={item?.image_url}
                                  alt="icon"
                                  height={26}
                                  width={26}
                                />
                              ) : (
                                <FrontDeskIcon />
                              )}
                              {item?.name}
                            </div>
                          ))}

                          {highlightedAmenities.length > 7 &&
                            !showAllHighlights && (
                              <div
                                className="showMoreHighlights d-flex justify-content-center align-items-center"
                                onClick={() => setShowAllHighlights(true)}
                              >
                                <BsChevronDown size={25} />
                              </div>
                            )}

                          {highlightedAmenities.length > 7 &&
                            showAllHighlights && (
                              <div
                                className="showMoreHighlights d-flex justify-content-center align-items-center"
                                onClick={() => setShowAllHighlights(false)}
                              >
                                <BsChevronUp size={25} />
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {apartmentDetails &&
                  (apartmentDetails?.apartment_videos ||
                    apartmentDetails?.apartment360_images) && (
                    <div className="videoSection mb-5" id="video-section">
                      <div className="propertyDetailSectionTitle mb-4">
                        <h6>{t("pages.properties.video_gallery")}</h6>
                      </div>
                      <div className="d-flex align-items-center gap-3">
                        {apartmentDetails &&
                          apartmentDetails?.apartment_videos && (
                            <div
                              className="d-inline-flex align-items-center gap-2 highlightsCard"
                              onClick={() => {
                                setShowVideoGallery(true);
                                setVideoClick(1);
                              }}
                            >
                              <IoVideocam />
                              {t("pages.properties.video")}
                            </div>
                          )}

                        {apartmentDetails &&
                          apartmentDetails?.apartment360_images && (
                            <div
                              className=" d-inline-flex align-items-center gap-2 highlightsCard"
                              onClick={() => {
                                setShowVideoGallery(true);
                                setVideoClick(2);
                              }}
                            >
                              <Tb360View />
                              {t("pages.properties.360_view")}
                            </div>
                          )}
                      </div>

                      <ModalPopup
                        show={showVideoGallery}
                        dialogClassName="GalleryModal videoGalleryModalDes"
                      >
                        {videoClick == 1 &&
                          apartmentDetails?.apartment_videos && (
                            <VideoGallery
                              setShowVideoGallery={setShowVideoGallery}
                              videoData={apartmentDetails?.apartment_videos}
                            />
                          )}
                        {videoClick == 2 &&
                          apartmentDetails?.apartment360_images && (
                            <ThreeSixtyView
                              setShowVideoGallery={setShowVideoGallery}
                              images360Data={
                                apartmentDetails?.apartment360_images
                              }
                            />
                          )}
                        <button
                          type="button"
                          className="btn-close galleryBtn"
                          onClick={() => {
                            setShowVideoGallery(false);
                          }}
                        ></button>
                      </ModalPopup>
                    </div>
                  )}

                <div
                  className="propertiesAboutListing mb-5"
                  id="technology-section"
                >
                  <div className="propertyDetailSectionTitle mb-4">
                    <h6>{t("pages.properties.about_listing")}</h6>
                  </div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: apartmentDetails.about_this_listing?.replace(
                        /\n/g,
                        "<br>"
                      ),
                    }}
                  ></p>

                  {apartmentDetails?.additional_description && apartmentDetails?.additional_description != "" && <p
                    dangerouslySetInnerHTML={{
                      __html: apartmentDetails.additional_description?.replace(
                        /\n/g,
                        "<br>"
                      ),
                    }}
                  ></p>}

                  {/* <p>{apartmentDetails.about_this_listing}</p> */}
                </div>

                {allAmenities.length > 0 && (
                  <div className="propertiesAboutListing mb-5">
                    <div
                      className="propertyDetailSectionTitle mb-4"
                      id="amenities-section"
                    >
                      <h6>{t("pages.properties.amenities")}</h6>
                    </div>

                    <div className="ammenitiesRow row flex-wrap">
                      {allAmenities &&
                        allAmenities.length > 0 &&
                        allAmenities.map((item, index) => {
                          if (index < 14) {
                            return (
                              <div className="col-lg-4">
                                <div className="d-flex align-items-center ammenitiesItem gap-3">
                                  <span></span>
                                  <p>{item.name}</p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      {allAmenities && allAmenities.length > 14 && (
                        <div className="col-lg-4">
                          <span
                            className="ammenitiesModal"
                            onClick={() => setShowAmmenities(true)}
                          >
                            {t("pages.properties.show_all")}{" "}
                            {allAmenities.length}{" "}
                            {t("pages.properties.amenities")}
                          </span>
                          <ModalPopup
                            show={showAmmenities}
                            dialogClassName="AmmenitiesModal"
                          >
                            <AmmenitiesModal
                              setShowAmmenities={setShowAmmenities}
                              apartmentAmmenities={allAmenities}
                            />
                          </ModalPopup>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {apartmentDetails.terms_and_rules?.length > 0 && (
                  <div className="termsRules mb-5" id="terms-rule-section">
                    <div className="propertyDetailSectionTitle mb-4">
                      <h6>{t("pages.properties.terms_rules")}</h6>
                    </div>
                    <div className="row">
                      {apartmentDetails.terms_and_rules &&
                        apartmentDetails.terms_and_rules.length > 0 &&
                        apartmentDetails?.terms_and_rules?.filter(
                          (item) => item?.is_allowed == false
                        )?.length > 0 && (
                          <div className="col-lg-2">
                            <ul className="termsList notAllowed">
                              {apartmentDetails.terms_and_rules &&
                                apartmentDetails.terms_and_rules.length > 0 &&
                                apartmentDetails.terms_and_rules.map(
                                  (item, index) => {
                                    if (!item?.is_allowed) {
                                      return (
                                        <li>
                                          <div className="d-flex align-items-center gap-3">
                                            <BsXLg />
                                            {item.title}
                                          </div>
                                        </li>
                                      );
                                    }
                                  }
                                )}
                            </ul>
                          </div>
                        )}
                      <div className="col-lg-2">
                        <ul className="termsList Allowed">
                          {apartmentDetails.terms_and_rules &&
                            apartmentDetails.terms_and_rules.length > 0 &&
                            apartmentDetails.terms_and_rules.map(
                              (item, index) => {
                                if (item?.is_allowed) {
                                  return (
                                    <li>
                                      <div className="d-flex align-items-center gap-3">
                                        <BsCheck2 />
                                        {item.title}
                                      </div>
                                    </li>
                                  );
                                }
                              }
                            )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* {apartmentDetails.close_to_apartment?.length > 0 && (
                <div
                  className="closeToAppartment mb-3"
                  id="close-to-apartment-section"
                >
                  <div className="propertyDetailSectionTitle mb-4">
                    <h6>{t("pages.properties.close_apartment")}</h6>
                  </div>
                  <div className="row">
                    <div className="col-lg-3">
                      <ul className="closeChecklist">

                        {apartmentDetails.close_to_apartment &&
                          apartmentDetails.close_to_apartment.length > 0 &&
                          apartmentDetails.close_to_apartment.map(
                            (item, index) => (
                              <li
                                key={index}
                                className={`closeChecklistItem d-inline-flex align-items-center gap-3 ${activeItem === index ? "active" : ""
                                  }`}
                                onClick={() =>
                                  handleClick(index, item?.category_sid)
                                }
                              >
                                <img
                                  src={item?.url}
                                  alt="Icon"
                                  style={{ filter: "grayscale(100%)" }}
                                />
                                {item.display_name}
                              </li>
                            )
                          )}
                      </ul>
                    </div>
                    {apartmentDetails?.latitude && apartmentDetails?.longitude && filterPlaces && filterPlaces.length > 0 && (
                      <div className="col-lg-9">
                        <ApartmentDetailsMap
                          property={apartmentDetails.original_property_name}
                          filterPlaces={filterPlaces}
                          lat={apartmentDetails?.latitude}
                          long={apartmentDetails?.longitude}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )} */}

                {(apartmentDetails.close_to_apartment?.length > 0 || apartmentDetails.close_to_city_highlights?.length > 0) && (
                  <div //className="closeToAppartment" 
                    className={`closeToAppartment mb-5 ${(apartmentDetails.close_to_apartment?.length > 0) !== (apartmentDetails.close_to_city_highlights?.length > 0) ? "closeApartmentWhenTwo" : ""}`} id="close-to-apartment-section">

                    {apartmentDetails.close_to_apartment && apartmentDetails.close_to_apartment?.length > 0 && <div className="facelities_list">
                      <div className="propertyDetailSectionTitle">
                        <h6>{t("pages.properties.close_apartment")}</h6>
                      </div>
                      <ScrollArea height={350}>
                        <ul className="closeChecklist">
                          {/* <li className="closeChecklistItem d-inline-flex align-items-center gap-3 active">
                      <CartIcon />
                      Supermarkets
                    </li>
                    <li className="closeChecklistItem d-inline-flex align-items-center gap-3 ">
                      <ParkingIcon />
                      Parking lots
                    </li>
                    <li className="closeChecklistItem d-inline-flex align-items-center gap-3 ">
                      <BarbellIcon />
                      Gyms
                    </li> */}

                          {/* {apartmentDetails.close_to_apartment && apartmentDetails.close_to_apartment.length > 0 &&  apartmentDetails.close_to_apartment?.map((item, index) => (
                      <li className="closeChecklistItem d-inline-flex align-items-center gap-3 active">
                        <CartIcon />
                        Supermarkets
                      </li>
                    )} */}

                          {apartmentDetails.close_to_apartment &&
                            apartmentDetails.close_to_apartment.length > 0 &&
                            apartmentDetails.close_to_apartment.map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className={`closeChecklistItem d-inline-flex align-items-center ${activeItem === index ? "active" : ""
                                    }`}
                                  onClick={() =>
                                    handleClick(index, item?.category_sid)
                                  }
                                >
                                  {/* <LocationPinIcon /> */}
                                  <img
                                    src={item?.url}
                                    alt="Icon"
                                    //style={{ filter: "grayscale(100%)" }}
                                    height={26}
                                    width={26}
                                  />
                                  {item.display_name}
                                </li>
                              )
                            )}
                        </ul>
                      </ScrollArea>
                    </div>}
                    {apartmentDetails.close_to_city_highlights && apartmentDetails.close_to_city_highlights.length > 0 && <div className="facelities_list">
                      <div className="propertyDetailSectionTitle mb-4">
                        <h6>City <br /> Highlights</h6>
                      </div>
                      <ScrollArea height={350}>
                        <ul className="closeChecklist">
                          {/* <li className="closeChecklistItem d-inline-flex align-items-center gap-3 active">
                      <CartIcon />
                      Supermarkets
                    </li>
                    <li className="closeChecklistItem d-inline-flex align-items-center gap-3 ">
                      <ParkingIcon />
                      Parking lots
                    </li>
                    <li className="closeChecklistItem d-inline-flex align-items-center gap-3 ">
                      <BarbellIcon />
                      Gyms
                    </li> */}

                          {/* {apartmentDetails.close_to_apartment && apartmentDetails.close_to_apartment.length > 0 &&  apartmentDetails.close_to_apartment?.map((item, index) => (
                      <li className="closeChecklistItem d-inline-flex align-items-center gap-3 active">
                        <CartIcon />
                        Supermarkets
                      </li>
                    )} */}

                          {apartmentDetails.close_to_city_highlights &&
                            apartmentDetails.close_to_city_highlights.length > 0 &&
                            apartmentDetails.close_to_city_highlights.map(
                              (item, index) => (
                                <li
                                  key={index}
                                  className={`closeChecklistItem d-inline-flex align-items-center ${activeCityHighlightsItem === index ? "active" : ""
                                    }`}
                                  onClick={() =>
                                    handleCityHighlightsClick(index, item?.category_sid)
                                  }
                                >
                                  {/* <LocationPinIcon /> */}
                                  <img
                                    src={item?.url}
                                    alt="Icon"
                                    //style={{ filter: activeCityHighlightsItem === index ? "brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(260deg) brightness(102%) contrast(108%);" : "none" }}
                                    height={26}
                                    width={26}
                                  />
                                  {item.display_name}
                                </li>
                              )
                            )}
                        </ul>
                      </ScrollArea>
                    </div>}
                    {filterPlaces && filterPlaces.length > 0 && (
                      <div className="facelities_map">
                        <ApartmentDetailsMap
                          property={apartmentDetails.original_property_name}
                          // area={apartmentDetails?.original_area_name}
                          // city={apartmentDetails?.original_city_name}
                          // country={apartmentDetails?.original_country_name}
                          filterPlaces={filterPlaces}
                          zoom={zoomLevel}
                          lat={apartmentDetails?.latitude}
                          long={apartmentDetails?.longitude}
                        />
                      </div>
                    )}
                  </div>
                )}

                {apartmentDetails.reviews &&
                  apartmentDetails.reviews.length > 0 && (
                    <div className="reviewSection pt-3" id="reviews-section">
                      <div className="reviewSectionList">
                        {apartmentDetails.reviews &&
                          apartmentDetails.reviews.length > 0 &&
                          apartmentDetails.reviews.map((item, index) => (
                            <div className="reviewSectionItem">
                              <div className="d-flex flex-column">
                                <div className="d-flex align-items-center gap-3 mb-3">
                                  <div className="reviewerIcon">
                                    <img
                                      src={
                                        item?.customer_image
                                          ? item?.customer_image
                                          : AppartmentImg
                                      }
                                      alt="ReviewIcon"
                                    />
                                  </div>
                                  <div className="reviewerName ">
                                    <h6>{item.customer_name}</h6>
                                    <span className="reviewDate">
                                      {dateFormat(
                                        item.review_date,
                                        DATE_FORMATS.DDMMMYYYY
                                      )}
                                    </span>
                                  </div>
                                </div>
                                <div className="reviewPara mb-2">
                                  {item.description.length <= 180 ? (
                                    <p>{item.description}</p>
                                  ) : (
                                    <>
                                      <p>
                                        {showFullText[index]
                                          ? item.description
                                          : item.description?.slice(0, 180) +
                                          "..."}
                                      </p>
                                      <div className="reviewMoreBtn d-inline-flex">
                                        {showFullText[index] ? (
                                          <span
                                            className="cursor-pointer"
                                            onClick={() =>
                                              toggleShowFullText(index)
                                            }
                                          >
                                            {t("pages.properties.show_less")}{" "}
                                            <BsChevronUp />
                                          </span>
                                        ) : (
                                          <span
                                            className="cursor-pointer"
                                            onClick={() =>
                                              toggleShowFullText(index)
                                            }
                                          >
                                            {t("pages.properties.show_more")}{" "}
                                            <BsChevronDown />
                                          </span>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      {apartmentDetails.reviews &&
                        apartmentDetails.reviews.length > 5 && (
                          <div className="animateBtn">
                            <button type="button" className="appBtn">
                              {t("pages.all_areas.load_more")}
                              <span className="btnIcon">
                                <BsArrowRight />
                              </span>
                            </button>
                          </div>
                        )}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="container propertyDetailPage pt-4 pb-4">
            <div className="col-lg-12 text-center mb-3 noBkkingContent">
              <h4>{t("common_lables.loading")}</h4>
            </div>
            <div className="col-lg-12">
              <div className="row flex-wrap">
                <div className="col-lg-12 mb-2">
                  <Skeleton height={50} mb="xl"></Skeleton>
                </div>
                <div className="col-lg-12 mb-5">
                  <Skeleton height={450} mb="xl"></Skeleton>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PreviewProperty;
