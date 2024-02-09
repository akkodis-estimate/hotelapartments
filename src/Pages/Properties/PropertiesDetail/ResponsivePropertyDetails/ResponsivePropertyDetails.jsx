import {
  BsArrowLeft,
  BsArrowRight,
  BsCheck2,
  BsChevronDown,
  BsChevronUp,
  BsEnvelope,
  BsFacebook,
  BsStarFill,
  BsWhatsapp,
  BsXLg,
} from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { HiOutlineEnvelope } from "react-icons/hi2";
import {
  SetDynamicEndpoint,
  dateFormat,
  disableDates,
  emailInquiry,
  navigateToWhatsApp,
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

import PropertiesCard from "../../FeaturedProperties/Components/PropertiesCard/PropertiesCard";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import maskingActions from "reducers/masking/masking.actions";
import AmmenitiesModal from "../Components/AmmenitiesModal/AmmenitiesModal";
import Gallery from "../Components/Gallery/Gallery";
import apartmentService from "Services/apartmentService";

import ApartmentDetailsMap from "Components/Shared/GoogleMap/ApartmentDetailsMap";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import bookingService from "Services/bookingService";
import validationHelper from "Helpers/validationHelper";
import PhoneInput from "react-phone-number-input";
import contactusService from "Services/contactus";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";
import VideoGallery from "../Components/VideoGallery/VideoGallery";
import DefaultImage from "Assets/Images/3d (1).jpg";
import moment from "moment";
import ThreeSixtyView from "../Components/ThreeSixtyView/ThreeSixtyView";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import "Pages/Properties/PropertiesDetail/ResponsivePropertyDetails/ResponsivePropertyDetails.css";

import { Carousel } from "@mantine/carousel";
import { Image, Group, Skeleton } from "@mantine/core";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import CalendarIcon from "Assets/Images/BookingIcons/CalendarIcon";
import { DatePicker } from "@mantine/dates";
import NoFilterImg from "Assets/Images/PropertiesDetailsIcons/NoFilterImg.png";

const ResponsivePropertiesDetails = (props) => {
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

  const subject_categories = [
    "pages.AccountSettings.personal_info.opt1",
    "pages.AccountSettings.personal_info.opt2",
    "pages.AccountSettings.personal_info.opt3",
  ];

  const { userDetails } = useSelector((state) => state.customerAuth);

  const dispatch = useDispatch();
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showAmmenities, setShowAmmenities] = useState(false);
  const [allAmenities, setAllAmenities] = useState([]);

  const [apartmentDetails, setapartmentDetails] = useState([]);
  const [activeItem, setActiveItem] = useState(0);
  const [showInquery, setShowInquery] = useState(false);
  const [filterPlaces, setFilteredPlace] = useState([]);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);
  const [viewerOpen, setViewerOpen] = useState(true);
  const [zoomLevel, setzoomLevel] = useState(13);
  const [activeCityHighlightsItem, setActiveCityHighlightsItem] = useState(-1);

  //GET BOOKING DATA
  const [dateValue, setDateValue] = useState([null, null]);
  const [tempDateValue, setTempDateValue] = useState([null, null]);
  const [requestBooking, setRequestBooking] = useState(false);
  const [bookingPrice, setBookingPrice] = useState(null);
  const [isAddToCart, setIsAddToCart] = useState(false);
  const [checkPropertyType, setcheckPropertyType] = useState();
  const [formData, setFormData] = useState(defaultFormData);
  const [successModal, setSuccessModal] = useState(false);

  const [dynamicShowDate, setDynamicShowDate] = useState([]);

  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const { language, currency_code } = useSelector((state) => state.language);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllHighlights, setShowAllHighlights] = useState(false);
  // const [showFullText, setShowFullText] = useState(false);
  const [showFullText, setShowFullText] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [forDateOption, setForDateOption] = useState(false);
  const [forCalendarOption, setForCalendarOption] = useState(false);
  const [forContinuePage, setForContinuePage] = useState(false);

  const [forDateOptionReqQuote, setForDateOptionReqQuote] = useState(false);
  const [forCalendarOptionReqQuote, setForCalendarOptionReqQuote] =
    useState(false);

  const [forDateOptionCart, setForDateOptionCart] = useState(false);
  const [forCalendarOptionCart, setForCalendarOptionCart] = useState(false);

  const [quoteSID, setQuoteSID] = useState();
  const [quoteStartDate, setQuoteStartDate] = useState();
  const [quoteEndDate, setQuoteEndDate] = useState();

  const [dateValueFromHeader, setDateValueFromHeader] = useState();

  const [subjectCategories, setSubjectCategoriesList] =
    useState(subject_categories);

  const [loadingData, setLoadingData] = useState(true);

  const [forAmmenities, setForAmmenities] = useState(false);

  const [spOfferFromParam, setSpOfferFromParam] = useState(false);
  //const [nightsFromParam, setNightsFromParam] = useState();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    // if (searchParams.get("quotesid") != null && searchParams.get("quotestartdate") != null && searchParams.get("quoteenddate") != null) {
    // setQuoteSID(searchParams.get("quotesid"))
    // setQuoteStartDate(searchParams.get("quotestartdate"))
    // setQuoteEndDate(searchParams.get("quoteenddate"))

    if(searchParams.get("specialOffer") != null && searchParams.get("specialOffer") == "true"){
      setSpOfferFromParam(true);
      //setNightsFromParam(searchParams.get("no_of_nights") != null ? Number(searchParams.get("no_of_nights")) : null)
    }

    if (
      searchParams.get("checkIn") != null &&
      searchParams.get("checkOut") != null
    ) {
      if (searchParams.get("quotesid") != null) {
        setQuoteSID(searchParams.get("quotesid"));
      }

      setQuoteStartDate(searchParams.get("checkIn"));
      setQuoteEndDate(searchParams.get("checkOut"));

      //setDateValue([dateFormat(new Date(searchParams.get("quotestartdate")), DATE_FORMATS.YMD), dateFormat(new Date(searchParams.get("quoteenddate")), DATE_FORMATS.YMD)])

      const startDateString = searchParams.get("checkIn");
      const endDateString = searchParams.get("checkOut");

      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);

      setTempDateValue([startDate, endDate]);

      setDateValueFromHeader([startDate, endDate]);

      //getBookingPrice(startDate ? dateFormat(startDate, DATE_FORMATS.YMD) : false, endDate ? dateFormat(endDate, DATE_FORMATS.YMD) : false);

      // if (startDate && endDate) {
      //   getBookingPrice(
      //     startDate ? dateFormat(startDate, DATE_FORMATS.YMD) : false,
      //     endDate ? dateFormat(endDate, DATE_FORMATS.YMD) : false
      //   );
      // }
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const checkIn = moment(new Date(searchParams.get("checkIn")));
    const checkOut = moment(new Date(searchParams.get("checkOut")));
    if (
      checkIn.isValid() && checkOut.isValid()
    ) {
      getBookingPrice(
        new Date(searchParams.get("checkIn")),
        new Date(searchParams.get("checkOut"))
      );
    }
  }, [currency_code]);

  const getapartmentDetails = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    dispatch(maskingActions.showMasking());
    const searchParams = new URLSearchParams(location.search);
    apartmentService
      //.apartmentDetails(id)
      .apartmentDetails(id, {applied_offer: searchParams.get("specialOffer"), start_date: searchParams.get("checkIn") != null ? dateFormat(searchParams.get("checkIn"), DATE_FORMATS.YMD)  : dateFormat(new Date(), DATE_FORMATS.YMD), end_date: searchParams.get("checkOut") ? dateFormat(searchParams.get("checkOut"), DATE_FORMATS.YMD) : dateFormat(new Date(), DATE_FORMATS.YMD)})
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
          res?.data?.close_to_apartment?.length > 0
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
    dispatch(maskingActions.showMasking());
    setLoadingData(true);
    getapartmentDetails();
    setActiveItem(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, currency_code]);

  useEffect(() => {
    if (apartmentDetails?.apartment_title) {
      // Create or update meta tags
      let metaDescription = document.querySelector('meta[name="description"]');
      let metaTitle = document.querySelector('meta[name="title"]');
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      let titleTag = document.querySelector("title");

      if (!metaDescription) {
        // If meta tag doesn't exist, create and add it to the head
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }

      if (!metaTitle) {
        // If meta tag doesn't exist, create and add it to the head
        metaTitle = document.createElement("meta");
        metaTitle.name = "title";
        document.head.appendChild(metaTitle);
        // debugger;
      }

      if (!canonicalLink) {
        // If link doesn't exist, create and add it to the head
        canonicalLink = document.createElement("link");
        canonicalLink.rel = "canonical";
        canonicalLink.href = window.location.href;
        document.head.appendChild(canonicalLink);
      }

      if(!titleTag){
        //If link doesn't exist, create and add it to the head
        titleTag = document.createElement("title");
        document.head.appendChild(titleTag);
      }

      // const regex_expression = /^[^.]+\.(?= [A-Z])/;
      // let description;
      // if (
      //   (description = regex_expression.exec(
      //     apartmentDetails?.about_this_listing
      //   )) !== null
      // ) {
      
      // }

      const regex_expression = /\./;

      if (
        regex_expression.exec(apartmentDetails?.about_this_listing) !== null
      ) {
        // If a full stop is found, return the full stop
        const firstSentence =
          apartmentDetails?.about_this_listing.split(".")[0];
        metaDescription.content = firstSentence.trim();
      } else {
        // If no full stop is found, return the entire string
        metaDescription.content = apartmentDetails?.about_this_listing;
      }

      // Update the content of the meta tag
      //metaDescription.content = description ? description[0] : "";
      metaTitle.content = apartmentDetails?.apartment_title;

      titleTag.textContent = apartmentDetails?.apartment_title ? apartmentDetails?.apartment_title : "Hotel Apartments";
      // You can repeat the above process for other meta tags as well

      // Clean up the effect on component unmount
      return () => {
        // Remove the added/updated meta tags on component unmount
        if (metaDescription) {
          metaDescription.parentNode.removeChild(metaDescription);
        }
        if (metaTitle) {
          metaTitle.parentNode.removeChild(metaTitle);
        }
        if (canonicalLink) {
          canonicalLink.parentNode.removeChild(canonicalLink);
        }
        if (titleTag) {
          titleTag.parentNode.removeChild(titleTag);
        }
      };
    }
  }, [apartmentDetails]); // Empty dependency array ensures the effect runs only once

  const handleClick = (index, category_sid) => {
    setActiveCityHighlightsItem(-1);
    setzoomLevel(13);
    setActiveItem(index);
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
    const searchParams = new URLSearchParams(location.search);
    if (end_value != null && end_value !== false) {
      var requestBody = {
        start_date: dateFormat(start_value, DATE_FORMATS.YMD),
        end_date: dateFormat(end_value, DATE_FORMATS.YMD),
        customer_id: userDetails?.customer_id,
        quotation_sid: searchParams.get("quotesid"), //location.state?.quotationSID,
      };
      //dispatch(maskingActions.showMasking());

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
  };

  const onRequestBooking = () => {
    setRequestBooking(true);
  };

  const onAddToBookingCart = () => {
    const searchParams = new URLSearchParams(location.search);
    var reqBody = {
      start_date: dateFormat(dateValue[0], DATE_FORMATS.YMD),
      end_date: dateFormat(dateValue[1], DATE_FORMATS.YMD),
      customer_id: userDetails?.customer_id,
      property_id: apartmentDetails?.property_id,
      apartment_id: apartmentDetails?.apartment_id,
      currency_id: apartmentDetails?.currency_id,
      guests: 1,
      quotation_sid: searchParams.get("quotesid"), //location.state?.quotationSID,
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

  const onAcceptBooking = () => {
    const searchParams = new URLSearchParams(location.search);
    if (userDetails) {
      if (id)
        navigate(`${SetDynamicEndpoint(RoutePaths.BOOKING.BOOKING, [id])}${location.search}`, {
          state: {
            start_date: dateValue[0],
            end_date: dateValue[1],
            quotationSID: searchParams.get("quotesid"), //location.state?.quotationSID,
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
          quotationSID: searchParams.get("quotesid"), //location.state?.quotationSID,
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

  // const slides = apartmentDetails.apartment_images?.map((url, index) => (
  //   <Carousel.Slide key={url}>
  //     <Image src={url?.image_url} />
  //   </Carousel.Slide>
  // ));

  const slides = apartmentDetails.apartment_images?.map((image, index) => (
    <Carousel.Slide key={index}>
      <Image
        src={
          image?.image_url
            ? `${image.image_url.replace(/\/([^/]+)$/, "/thumb_$1")}`
            : AppartmentImg
        }
        alt={image?.image_url ? "Carousel Image" : "No Preview"}
        onError={(event) => {
          event.target.src = image?.image_url || AppartmentImg;
        }}
      />
    </Carousel.Slide>
  ));

  const handleSlideChange = (newIndex) => {
    setCurrentIndex(newIndex);
  };

  const onBack = () => {
    navigate(
      `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`
    );
  };

  const viewAllApartments = () => {
    navigate(
      `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`
    );
  };

  const highlightedAmenities = allAmenities?.filter(
    (item) => item?.is_highlighted
  );
  const displayedHighlights = showAllHighlights
    ? highlightedAmenities
    : highlightedAmenities?.slice(0, 4);

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

  const visibleReviews = showAllReviews
    ? apartmentDetails.reviews
    : apartmentDetails.reviews?.slice(0, 3);

  const viewAllReviews = () => {
    // Your function to handle the action when "Show All Reviews" button is clicked
    setShowAllReviews(true);
  };

  const handleDateChange = (newValue) => {
    setTempDateValue(newValue);
  };

  const handleApplyClick = () => {
    setDateValue(tempDateValue);
    setForCalendarOption(false);
  };

  const onCancelBtn = () => {
    setDateValue([null, null]);
    setTempDateValue([null, null]);
    setForContinuePage(false);
    setForCalendarOption(false);
  };
  const [currentSlideNumber, setcurrentSlideNumber] = useState(1);

  useEffect(() => {
    const carouselElement = document.querySelector(
      "#carouselExampleIndicators"
    );
    carouselElement?.addEventListener("slide.bs.carousel", handleSlide);
    return () =>
      carouselElement?.removeEventListener("slide.bs.carousel", handleSlide);
  }, [apartmentDetails]);

  const handleSlide = (event) => {
    
    setcurrentSlideNumber(Number(event.to) + 1);
    // setCurrentSlide(event.detail.index);
  };

  const setInquiryFields = (start_value, end_value) => {
    // const searchParams = new URLSearchParams(location.search);
    // if (end_value != null && end_value !== false) {
    //   var requestBody = {
    //     start_date: start_value,
    //     end_date: end_value,
    //     customer_id: userDetails?.customer_id,
    //     quotation_sid: searchParams.get("quotesid")   //location.state?.quotationSID,
    //   };
    //dispatch(maskingActions.showMasking());

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
    // apartmentService
    //   .getBookingPrice(id, requestBody)
    //   .then((res) => {
    //     setBookingPrice(res.data);
    //     if (res.data?.quotation_warning) {
    //       toast.warning(t("validation.quote_err_msg"));
    //     }
    //   })
    //   .catch((res) => {
    //     toast.error(t("toaster_message.error"));
    //   })
    //   .finally(() => {
    //     dispatch(maskingActions.hideMasking());
    //   });
    //}
  };

  // const isSameDay = (date1, date2) => {
  //   return (
  //     date1.getDate() === date2.getDate() &&
  //     date1.getMonth() === date2.getMonth() &&
  //     date1.getFullYear() === date2.getFullYear()
  //   );
  // };

  // const disableDates = (date) => {
  //   if (!tempDateValue) return false; // No date selected, all dates enabled
  //   if (tempDateValue[0]) {
  //     const startDate = new Date(tempDateValue[0]);
  //     const endDate = new Date(tempDateValue[0]);
  //     endDate.setDate(endDate.getDate() + 30);
  //     const openDate = new Date(tempDateValue[0]);
  //     openDate.setDate(startDate.getDate() - 30); // Previous 30 days from the selected date

  //     return (
  //       (date < startDate ||
  //         (date < endDate && !isSameDay(date, tempDateValue[0]))) &&
  //       date > openDate
  //     );
  //   }
  // };

  return (
    <>
      {isVisible && (
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
              {/* <Link
                activeClass="active"
                to="explore-section"
                spy={true}
                smooth={true}
                offset={-130}
                duration={500}
              >
                {t("pages.properties.explore")}
              </Link> */}
              {(apartmentDetails.close_to_apartment?.length > 0 ||
                apartmentDetails.close_to_city_highlights?.length > 0) && (
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
      )}
      {!loadingData && apartmentDetails ? (
        apartmentDetails?.status === 55 &&
        apartmentDetails?.property_status === 1 ? (
          <div className="container propertyDetailPage pt-4 pb-4">
            <div className="propertyDetailHeader mb-4">
              <div className="row align-items-center justify-content-between">
                <div className="col p-0">
                  <div className="breadcrumbTitle">
                    <div className="d-flex align-items-start gap-2 w-100">
                      <span
                        onClick={() => {
                          onBack();
                        }}
                      >
                        <BsArrowLeft size={25} />
                      </span>
                      <h4>
                        {apartmentDetails.apartment_title}{" "}
                        {t("pages.properties.feature_properties.at")}{" "}
                        {apartmentDetails.area_name}
                      </h4>
                    </div>

                    {apartmentDetails?.property_name && <span className="hotelNameText">{apartmentDetails?.property_name}</span>}
                    {/* {apartmentDetails?.property_ratings > 0 && (
                      <div className="ratingDetail d-flex align-items-center gap-1">
                        {[...Array(apartmentDetails?.property_ratings)].map(
                          (_, index) => (
                            <BsStarFill key={index} />
                          )
                        )}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
            </div>

            <div className="position-relative">
              {apartmentDetails.apartment_images && (
                <Carousel
                  maw={320}
                  mx="auto"
                  withControls={false}
                  className="mobilePropertySlider"
                  onSlideChange={(e) => {
                    handleSlideChange(e);
                  }}
                >
                  {slides}
                </Carousel>
              )}

              {apartmentDetails.apartment_images && (
                <div className="imagesTotalCount">
                  <span>
                    {currentIndex + 1} /{" "}
                    {apartmentDetails.apartment_images?.length}
                  </span>
                </div>
              )}
            </div>

            <div className="row spacing32">
              <div className="col-lg-8 p-0 smPropertyDetail">
                <div className="ammenitiesHighlights spacing32">
                  <div className="d-flex align-items-start gap-3">
                    {/* <span >{t("pages.properties.highlights")}:</span> */}
                    <div className="d-flex align-items-center flex-wrap gap-2 w-100">
                      <div className="d-flex align-items-center gap-2 ammenities">
                        <AmmenitesBed />
                        <span>{apartmentDetails.no_of_rooms}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 ammenities">
                        <AmmenitesTub />
                        <span>{apartmentDetails.no_of_bathrooms}</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 ammenities">
                        <TotalGuestIcon />
                        <span>{apartmentDetails.accomodation}</span>
                      </div>
                      {apartmentDetails.apartment_area && (
                        <div className="d-flex align-items-center gap-2 ammenities">
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

                <div className="propertiesHighlights spacing32">
                  <div className="propertyDetailSectionTitle mb-4">
                    <h6>{t("pages.properties.highlights")}</h6>
                  </div>

                  {allAmenities && (
                    <div>
                      <div className="d-flex flex-wrap smHighlightsCardCust">
                        {displayedHighlights.map((item, index) => (
                          <div
                            className="d-inline-flex align-items-center highlightsCard"
                            key={index}
                          >
                            {/* <FrontDeskIcon /> */}
                            {item?.image_url &&
                            item?.image_url != null &&
                            item?.image_url != "" ? (
                              <div>
                                {" "}
                                <img
                                  src={item?.image_url}
                                  alt="icon"
                                  height={26}
                                  width={26}
                                />
                              </div>
                            ) : (
                              <div>
                                <FrontDeskIcon />
                              </div>
                            )}
                            {item?.name}
                          </div>
                        ))}
                      </div>

                      {highlightedAmenities.length > 4 &&
                        !showAllHighlights && (
                          <div
                            className="showMoreHighlights mt-3 d-flex justify-content-center"
                            onClick={() => setShowAllHighlights(true)}
                          >
                            <BsChevronDown size={25} />
                          </div>
                        )}

                      {highlightedAmenities.length > 4 && showAllHighlights && (
                        <div
                          className="showMoreHighlights mt-3 d-flex justify-content-center"
                          onClick={() => setShowAllHighlights(false)}
                        >
                          <BsChevronUp size={25} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {apartmentDetails &&
                  (apartmentDetails?.apartment_videos ||
                    apartmentDetails?.apartment360_images) && (
                    <div className="videoSection spacing32" id="video-section">
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
                  className="propertiesAboutListing spacing32"
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
                  <div className="propertiesAboutListing spacing32">
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
                          if (index < 6) {
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
                      {allAmenities && allAmenities.length > 6 && (
                        <div className="col-lg-4">
                          <span
                            className="ammenitiesModal"
                            onClick={() => {
                              setShowAmmenities(true);
                              setForAmmenities(true);
                            }}
                          >
                            {t("pages.properties.show_all")}{" "}
                            {allAmenities.length}{" "}
                            {t("pages.properties.amenities")}
                          </span>
                          {/* <ModalPopup
                            show={showAmmenities}
                            dialogClassName="AmmenitiesModal"
                          >
                            <AmmenitiesModal
                              setShowAmmenities={setShowAmmenities}
                              apartmentAmmenities={allAmenities}
                            />
                          </ModalPopup> */}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {apartmentDetails.terms_and_rules?.length > 0 && (
                  <div className="termsRules spacing40" id="terms-rule-section">
                    <div className="propertyDetailSectionTitle mb-4">
                      <h6>{t("pages.properties.terms_rules")}</h6>
                    </div>
                    <div className="row smTermsList">
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

                {(apartmentDetails.close_to_apartment?.length > 0 ||
                  apartmentDetails.close_to_city_highlights?.length > 0) && (
                  <div
                    className="closeToAppartment ha--closeToApartment spacing40"
                    id="close-to-apartment-section"
                  >
                    <div className="row">
                      {apartmentDetails.close_to_apartment &&
                        apartmentDetails.close_to_apartment?.length > 0 && (
                          <div className="col-lg-2">
                            <div className="propertyDetailSectionTitle mb-4">
                              <h6>{t("pages.properties.close_apartment")}</h6>
                            </div>
                            <ul className="closeChecklist gap-2">
                              {apartmentDetails.close_to_apartment &&
                                apartmentDetails.close_to_apartment.length >
                                  0 &&
                                apartmentDetails.close_to_apartment.map(
                                  (item, index) => (
                                    <li
                                      key={index}
                                      className={`closeChecklistItem d-inline-flex align-items-center gap-3 ${
                                        activeItem === index ? "active" : ""
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
                                        height={25}
                                        width={25}
                                      />
                                      {item.display_name}
                                    </li>
                                  )
                                )}
                            </ul>
                          </div>
                        )}

                      {apartmentDetails.close_to_city_highlights &&
                        apartmentDetails.close_to_city_highlights?.length >
                          0 && (
                          <div className="col-lg-2">
                            <div className="propertyDetailSectionTitle mb-4">
                              <h6>City Highlights</h6>
                            </div>
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
                                apartmentDetails.close_to_city_highlights
                                  .length > 0 &&
                                apartmentDetails.close_to_city_highlights.map(
                                  (item, index) => (
                                    <li
                                      key={index}
                                      className={`closeChecklistItem d-inline-flex align-items-center ${
                                        activeCityHighlightsItem === index
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleCityHighlightsClick(
                                          index,
                                          item?.category_sid
                                        )
                                      }
                                    >
                                      {/* <LocationPinIcon /> */}
                                      <img
                                        src={item?.url}
                                        alt="Icon"
                                        //style={{ filter: "grayscale(100%)" }}
                                        height={25}
                                        width={25}
                                      />
                                      {item.display_name}
                                    </li>
                                  )
                                )}
                            </ul>
                          </div>
                        )}

                      {filterPlaces && filterPlaces.length > 0 && (
                        <div className="col-lg-9">
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
                  </div>
                )}

                {apartmentDetails.reviews &&
                  apartmentDetails.reviews.length > 0 && (
                    <div
                      className="reviewSection pt-3 spacing40"
                      id="reviews-section"
                    >
                      <div className="col-lg-12">
                        <div className="propertyDetailSectionTitle mb-1">
                          <h6>{t("pages.properties.reviews")}</h6>
                        </div>
                      </div>
                      <div className="reviewSectionList mb-3">
                        {visibleReviews.map((item, index) => (
                          <div className="reviewSectionItem" key={index}>
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
                                {item.description.length <= 100 ? (
                                  <p>{item.description}</p>
                                ) : (
                                  // <>
                                  //   <p>
                                  //     {showFullText
                                  //       ? item.description
                                  //       : item.description?.slice(0, 100) +"..."}
                                  //   </p>
                                  //   <div className="reviewMoreBtn d-inline-flex">
                                  //     {showFullText ? (
                                  //       <span className="cursor-pointer" onClick={toggleShowFullText}>
                                  //         {t("pages.properties.show_less")}{" "}
                                  //         <BsChevronUp />
                                  //       </span>
                                  //     ) : (
                                  //       <span className="cursor-pointer" onClick={toggleShowFullText}>
                                  //         {t("pages.properties.show_more")}{" "}
                                  //         <BsChevronDown />
                                  //       </span>
                                  //     )}
                                  //   </div>
                                  // </>

                                  <>
                                    <p>
                                      {showFullText[index]
                                        ? item.description
                                        : item.description?.slice(0, 100) +
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
                      {apartmentDetails.reviews.length > 3 &&
                        !showAllReviews && (
                          <div className="viewAllPropertiesSm mt-4">
                            <div className="animateBtn me-3">
                              <button
                                type="button"
                                className="appBtn bg-white w-100 d-flex align-items-center justify-content-center"
                                onClick={viewAllReviews}
                              >
                                {t("pages.properties.show_all_reviews")}
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  )}
              </div>

              <div className="reqBookinSm">
                <div className="bookingCount d-flex align-items-center gap-1 justify-content-between w-100">
                  <div className="reqBookingPriceSM">
                    {apartmentDetails && (
                      <div className="d-flex flex-column align-items-start">
                        {/* <span>{t("pages.properties.starts_from")}</span> */}
                        {/* {quoteSID ?
                      <>
                        {bookingPrice &&
                          bookingPrice?.per_night_price &&
                          !isNaN(bookingPrice?.per_night_price) && (
                            <>
                              <p>
                                {validationHelper.formatFloatValue(
                                  bookingPrice?.per_night_price
                                )}{" "}
                                {bookingPrice?.currency_code}/
                                {t("common_lables.night")}
                              </p>
                            </>
                          )}
                      </>
                      : <p>
                        {apartmentDetails?.monthly_price}{" "}
                        {apartmentDetails?.currency_code_display}/{t("common_lables.month")}
                      </p>} */}

                        {dateValueFromHeader &&
                        dateValueFromHeader[0] &&
                        dateValueFromHeader[1] &&
                        bookingPrice ? (
                          <>
                            <span>{t("pages.properties.price")}</span>
                            <p>
                              {validationHelper.formatFloatValue(
                                bookingPrice?.booking_price
                              )}{" "}
                              {apartmentDetails?.currency_code_display}
                              {/* /{t("common_lables.month")} */}
                            </p>
                          </>
                        ) : (
                          apartmentDetails &&
                          apartmentDetails?.monthly_price && (
                            <>
                              <span>{t("pages.properties.starts_from")}</span>
                              <p>
                                {validationHelper.formatFloatValue(
                                  apartmentDetails?.monthly_price
                                )}{" "}
                                {apartmentDetails?.currency_code_display}/
                                {t("common_lables.month")}
                              </p>
                            </>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="animateBtn bookingReqBtn">
                    {/* <button
                    type="button"
                    className="appBtn bg-black w-100 d-flex justify-content-center disableButton"
                    onClick={() => {
                      setForDateOption(true);
                      setDateValue([null, null]);
                    }}
                  >
                    Request Booking
                  </button> */}

                    {checkPropertyType &&
                      checkPropertyType !== 71 &&
                      checkPropertyType !== 70 &&
                      (userDetails?.customer_sid && userDetails?.type == 2 ? (
                        <button
                          type="button"
                          className="appBtn bg-black w-100 d-flex justify-content-center"
                          onClick={() => {
                            setForDateOptionCart(true);
                            //setDateValue([null, null]);
                            setDateValue([
                              quoteStartDate ? new Date(quoteStartDate) : null,
                              quoteEndDate ? new Date(quoteEndDate) : null,
                            ]);
                          }}
                        >
                          {t("common_lables.add_cart")}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="appBtn bg-black d-flex justify-content-center w-100"
                          onClick={() => {
                            setForDateOption(true);
                            //setDateValue([null, null]);
                            setDateValue([
                              quoteStartDate ? new Date(quoteStartDate) : null,
                              quoteEndDate ? new Date(quoteEndDate) : null,
                            ]);
                          }}
                        >
                          {t("pages.properties.request_booking")}
                        </button>
                      ))}

                    {checkPropertyType &&
                      (checkPropertyType === 71 ||
                        checkPropertyType === 70) && (
                        <button
                          type="button"
                          className="appBtn bg-black d-flex justify-content-center w-100"
                          onClick={() => {
                            setForDateOptionReqQuote(true);
                            setDateValue([null, null]);
                          }}
                          //onClick={onRequestInquiry}
                        >
                          {t("pages.properties.request_for_quotation")}
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 p-0">
                <div className="propertyDetailSectionTitle mb-4">
                  <h6>{t("pages.properties.similar_properties")}</h6>
                </div>
              </div>
              <div className="col-lg-12 p-0">
                <div
                  id="carouselExampleIndicators"
                  class="carousel slide"
                  data-bs-ride="true"
                >
                  <div class="carousel-inner">
                    {apartmentDetails.similar_apartments &&
                      apartmentDetails.similar_apartments.length > 0 && (
                        <div
                          class="carousel-item active"
                          onClick={() => {
                            onAparmentDetails(
                              apartmentDetails?.similar_apartments[0]
                                ?.apartment_sid
                            );
                          }}
                        >
                          <PropertiesCard
                            data={apartmentDetails.similar_apartments[0]}
                          />
                        </div>
                      )}

                    {apartmentDetails.similar_apartments &&
                      apartmentDetails.similar_apartments.length > 1 && (
                        <div
                          class="carousel-item"
                          onClick={() => {
                            onAparmentDetails(
                              apartmentDetails?.similar_apartments[1]
                                ?.apartment_sid
                            );
                          }}
                        >
                          <PropertiesCard
                            data={apartmentDetails.similar_apartments[1]}
                          />
                        </div>
                      )}

                    {apartmentDetails.similar_apartments &&
                      apartmentDetails.similar_apartments.length > 2 && (
                        <div
                          class="carousel-item"
                          onClick={() => {
                            onAparmentDetails(
                              apartmentDetails?.similar_apartments[2]
                                ?.apartment_sid
                            );
                          }}
                        >
                          <PropertiesCard
                            data={apartmentDetails.similar_apartments[2]}
                          />
                        </div>
                      )}
                  </div>

                  <div className="d-flex align-items-center justify-content-center gap-3 productDetailSLiderAction mt-3">
                    <button
                      class="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide="prev"
                    >
                      <span
                        class="carousel-control-prev-icon"
                        aria-hidden="true"
                      >
                        <BsArrowLeft />
                      </span>
                      <span class="visually-hidden"></span>
                    </button>

                    <div class="carousel-indicators-custom">
                      <button
                        type="button"
                        data-bs-target="#carouselExampleIndicators"
                        data-bs-slide-to="0"
                        class="active"
                        aria-current="true"
                        aria-label="Slide 1"
                      >
                        {currentSlideNumber}/
                        {apartmentDetails.similar_apartments?.length > 3
                          ? 3
                          : apartmentDetails.similar_apartments?.length}
                      </button>
                      {/* <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="1"
                      aria-label="Slide 2"
                    >
                      2/
                      {apartmentDetails.similar_apartments?.length > 3
                        ? 3
                        : apartmentDetails.similar_apartments?.length}
                    </button>
                    <button
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide-to="2"
                      aria-label="Slide 3"
                    >
                      3/
                      {apartmentDetails.similar_apartments?.length > 3
                        ? 3
                        : apartmentDetails.similar_apartments?.length}
                    </button> */}
                    </div>

                    <button
                      class="carousel-control-next"
                      type="button"
                      data-bs-target="#carouselExampleIndicators"
                      data-bs-slide="next"
                    >
                      <span
                        class="carousel-control-next-icon"
                        aria-hidden="true"
                      >
                        {" "}
                        <BsArrowRight />
                      </span>
                      <span class="visually-hidden"></span>
                    </button>
                  </div>
                </div>

                <div className="viewAllPropertiesSm mt-4">
                  <div className="animateBtn me-3">
                    <button
                      type="button"
                      className="appBtn bg-white w-100 d-flex align-items-center justify-content-center"
                      onClick={() => {
                        viewAllApartments();
                      }}
                    >
                      {t("pages.properties.view_all")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex justify-content-center flex-column align-items-center gap-5">
                  <div className="noLongerContent d-flex justify-content-center mt-5 w-100">
                    {t("common_lables.no_longer_apt")}
                  </div>

                  <div className="troubleDes">
                    <div className="d-flex align-items-center gap-5">
                      <img src={NoFilterImg} alt="" />
                      <div className="troubleContent">
                        <h5 className="mb-3">
                          {t(
                            "pages.properties.feature_properties.having_trouble"
                          )}
                        </h5>
                        <p className="mb-3">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: t(
                                "pages.properties.feature_properties.requirement"
                              ),
                            }}
                          />
                        </p>
                        <div className="contactDtl d-flex align-items-center gap-4">
                          <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => navigateToWhatsApp('9710585080101')}>
                            <div>
                              {" "}
                              <BsWhatsapp />
                            </div>
                            <span>+971 (0) 58 508 01 01</span>
                          </div>
                          <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => emailInquiry()}>
                            <div>
                              {" "}
                              <BsEnvelope />
                            </div>
                            <span>info@hotelapartments.com</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      ) : (
        <>
          <div className="container propertyDetailPage pt-4 pb-4">
            <div className="col-lg-12 text-center mb-3 noBkkingContent">
              <h4>{t("common_lables.loading")}</h4>
            </div>
            <div className="col-lg-12">
              <div className="row flex-wrap">
                <div className="col-lg-12 mb-2">
                  <Skeleton height={250} mb="xl"></Skeleton>
                </div>
                <div className="col-lg-12 mb-5">
                  <Skeleton height={250} mb="xl"></Skeleton>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
                <div className="invalid">{t(formValidation.surname)}</div>
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
                <div className="invalid">{t(formValidation.phone_number)}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                {t("pages.AccountSettings.personal_info.subject_category")}
              </label>
              <select
                id="inputState"
                name="category"
                onChange={handleTextChange}
                value={formData.category}
                className="form-select"
                // disabled={props.updateProfile}
              >
                <option value="">
                  {t("pages.AccountSettings.personal_info.ph_subject_category")}
                </option>
                {subjectCategories.map((item, key) => {
                  return (
                    <option value={item} key={key}>
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
                <div className="invalid">{t(formValidation.subject)}</div>
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
                <div className="invalid">{t(formValidation.message)}</div>
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
      <ModalPopup show={successModal} dialogClassName="applicationModal">
        <SuccessModalPopup
          setSuccessModal={setSuccessModal}
          Title={"Thank You"}
          Message={
            "Your Inquiry Request for Booking has been Sent Successfully."
          }
          ShowButton={true}
        />
      </ModalPopup>

      <MobileDrawer
        openDrawer={forDateOption}
        setopenDrawer={setForDateOption}
        classText={true}
      >
        <div className="bookingDetailCustSm">
          <h4>{t("pages.properties.when_to_stay")}?</h4>
          <div>
          <div className="bookinginfoTextDtls">
            {/* {spOfferFromParam === true && nightsFromParam != null && nightsFromParam != 30 && (
                <p className="minRentalText">
                {nightsFromParam < 365 ? (
                  <>{t("common_lables.min")} {nightsFromParam}{" "}{t("common_lables.days_rental")}{" "}</>
                ) : (
                  <>{t("common_lables.min")} {t("common_lables.yearly_rental").toLowerCase()}</>
                )}
                </p>
              )} */}
            {apartmentDetails && apartmentDetails?.no_of_nights && apartmentDetails?.no_of_nights != null && apartmentDetails?.no_of_nights != 30 && (
                <p className="minRentalText">
                {apartmentDetails?.no_of_nights < 365 ? (
                  <>{t("common_lables.min")} {apartmentDetails?.no_of_nights}{" "}{t("common_lables.days_rental")}{" "}</>
                ) : (
                  <>{t("common_lables.min")} {t("common_lables.yearly_rental").toLowerCase()}</>
                )}
              </p>
              )}
            {apartmentDetails && apartmentDetails?.is_instant_booking === true && <p className="minRentalText">({t("common_lables.instant_booking")})</p>}
          </div>
            {dateValue[0] && dateValue[1] ? (
              <div className="bookingCalendarSm">
                <div className="calBookIcon">
                  <FilterCalendarIcon />
                </div>
                <div
                  className="calContentSm "
                  onClick={() => setForCalendarOption(true)}
                >
                  <p>
                    {t(
                      "pages.properties.feature_properties.checkin_checkout_label"
                    )}
                  </p>
                  <span>
                    {dateFormat(dateValue[0], DATE_FORMATS.CUSTOMDMY)} -{" "}
                    {dateFormat(dateValue[1], DATE_FORMATS.CUSTOMDMY)}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="bookingCalendarSm"
                onClick={() => {
                  setForCalendarOption(true);
                  setTempDateValue([null, null]);
                }}
              >
                <div className="calBookIcon">
                  <FilterCalendarIcon />
                </div>
                <div className="calContentSm ">
                  <p>
                    {t(
                      "pages.properties.feature_properties.checkin_checkout_label"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bookBtnSm">
            <div className="animateBtn">
              <button
                type="button"
                //className={`appBtn bg-black w-100 d-flex align-items-center justify-content-center disableButton"${dateValue[1] ? "": " disabled" }`}

                className={`appBtn bg-black w-100 d-flex justify-content-center disableButton${
                  dateValue[0] === null && dateValue[1] === null
                    ? " disabled"
                    : ""
                }`}
                disabled={dateValue[0] === null && dateValue[1] === null}
                onClick={() => setForContinuePage(true)}
              >
                {t("pages.properties.book_now")}
              </button>
            </div>
          </div>
          <div className="noHiddenText">
            <span>{t("pages.properties.no_hidden_fees")}!</span>
          </div>
          {spOfferFromParam && apartmentDetails && apartmentDetails.offer_start_date && apartmentDetails.offer_end_date && <div className="pt-2"><span className="text-danger" style={{fontSize: '15px'}}>{t("common_lables.offer")} {t("common_lables.valid")} {t("common_lables.from")} {apartmentDetails.offer_start_date} {t("common_lables.to")} {apartmentDetails.offer_end_date}</span></div>}
        </div>
      </MobileDrawer>

      <MobileDrawer
        openDrawer={forCalendarOption}
        setopenDrawer={setForCalendarOption}
      >
        <div className="mainCalBooking responisveCalDateCust">
          <Group position="center">
            <DatePicker
              type="range"
              numberOfColumns={2}
              //   value={dateValue}
              //   onChange={setDateValue}
              value={tempDateValue}
              onChange={handleDateChange}
              className="bookingCustomDR"
              minDate={new Date()}
              // excludeDate={disableDates}
              excludeDate={(e) =>
                disableDates(
                  e,
                  tempDateValue ? tempDateValue[0] : "",
                  apartmentDetails &&
                    apartmentDetails?.no_of_nights &&
                    apartmentDetails?.no_of_nights != null &&
                    apartmentDetails?.no_of_nights != 30
                    ? apartmentDetails?.no_of_nights
                    : 30
                )
              }
              // excludeDate={(e) => (spOfferFromParam === true && nightsFromParam != null) 
              //                     ? disableDates(e, tempDateValue ? tempDateValue[0] : "", ((nightsFromParam && nightsFromParam != 30) ? nightsFromParam : 30)) 
              //                     : disableDates(e, tempDateValue ? tempDateValue[0] : "", (apartmentDetails && apartmentDetails?.no_of_nights && apartmentDetails?.no_of_nights != null && apartmentDetails?.no_of_nights != 30) ? apartmentDetails?.no_of_nights : 30)}
            />
          </Group>

          
        </div>
        <div className="resBookingDateBtn">
        <div className="animateBtn">
            <button
              type="button"
              //className="appBtn bg-black w-100 d-flex align-items-center justify-content-center"
              className={`appBtn bg-black w-100 d-flex align-items-center justify-content-center disableButton${
                tempDateValue[1] === null
                  ? " disabled"
                  : ""
              }`}
              disabled={tempDateValue[1] === null}

              onClick={() => {
                setForCalendarOption(false);
                handleApplyClick();
              }}
            >
              {t("common_lables.apply")}
            </button>
          </div>
          </div>
      </MobileDrawer>

      <MobileDrawer
        openDrawer={forContinuePage}
        setopenDrawer={setForContinuePage}
      >
        <div className="policyNote">
          <h4>{t("pages.properties.note")}:</h4>
          <div className="policyNoteTitle">
            <h6>{t("pages.properties.approval")}.</h6>
            <p>{t("pages.properties.confirmation")}. </p>
          </div>
          <div className="d-flex align-items-center gap-4 policyNoteAction justify-content-center">
            <div className="animateBtn">
              <button
                type="button"
                className="appBtn bg-white w-100 d-flex align-items-center justify-content-center"
                onClick={() => {
                  onCancelBtn();
                }}
              >
                {t("pages.properties.cancel")}
              </button>
            </div>
            <div className="animateBtn">
              <button
                type="button"
                className="appBtn bg-black w-100 d-flex align-items-center justify-content-center"
                onClick={() => {
                  onAcceptBooking();
                }}
              >
                {t("pages.properties.accept_continue")}
              </button>
            </div>
          </div>
        </div>
      </MobileDrawer>

      {/* For Request Quotation */}

      <MobileDrawer
        openDrawer={forDateOptionReqQuote}
        setopenDrawer={setForDateOptionReqQuote}
        classText={true}
      >
        <div className="bookingDetailCustSm">
          <h4>{t("pages.properties.when_to_stay")}?</h4>

          <div>
          <div className="bookinginfoTextDtls">
            {/* {spOfferFromParam === true && nightsFromParam != null && nightsFromParam != 30 && (
                <p className="minRentalText">
                {nightsFromParam < 365 ? (
                  <>{t("common_lables.min")} {nightsFromParam}{" "}{t("common_lables.days_rental")}{" "}</>
                ) : (
                  <>{t("common_lables.min")} {t("common_lables.yearly_rental").toLowerCase()}</>
                )}
                </p>
              )} */}
            {apartmentDetails && apartmentDetails?.no_of_nights && apartmentDetails?.no_of_nights != null && apartmentDetails?.no_of_nights != 30 && (
                <p className="minRentalText">
                {apartmentDetails?.no_of_nights < 365 ? (
                  <>{t("common_lables.min")} {apartmentDetails?.no_of_nights}{" "}{t("common_lables.days_rental")}{" "}</>
                ) : (
                  <>{t("common_lables.min")} {t("common_lables.yearly_rental").toLowerCase()}</>
                )}
              </p>
            )}
            {apartmentDetails && apartmentDetails?.is_instant_booking === true && <p className="minRentalText">({t("common_lables.instant_booking")})</p>}
          </div>
            {dateValue[0] && dateValue[1] ? (
              <div className="bookingCalendarSm">
                <div className="calBookIcon">
                  <FilterCalendarIcon />
                </div>
                <div
                  className="calContentSm "
                  onClick={() => setForCalendarOptionReqQuote(true)}
                >
                  <p>
                    {t(
                      "pages.properties.feature_properties.checkin_checkout_label"
                    )}
                  </p>
                  <span>
                    {dateFormat(dateValue[0], DATE_FORMATS.CUSTOMDMY)} -{" "}
                    {dateFormat(dateValue[1], DATE_FORMATS.CUSTOMDMY)}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="bookingCalendarSm"
                onClick={() => {
                  setForCalendarOptionReqQuote(true);
                  setTempDateValue([null, null]);
                }}
              >
                <div className="calBookIcon">
                  <FilterCalendarIcon />
                </div>
                <div className="calContentSm ">
                  <p>
                    {t(
                      "pages.properties.feature_properties.checkin_checkout_label"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bookBtnSm">
            <div className="animateBtn me-3">
              <button
                type="button"
                //className={`appBtn bg-black w-100 d-flex align-items-center justify-content-center disableButton"${dateValue[1] ? "": " disabled" }`}

                className={`appBtn bg-black w-100 d-flex justify-content-center disableButton${
                  dateValue[0] === null && dateValue[1] === null
                    ? " disabled"
                    : ""
                }`}
                disabled={dateValue[0] === null && dateValue[1] === null}
                onClick={() => {
                  setInquiryFields(dateValue[0], dateValue[1]);
                  setForDateOptionReqQuote(false);
                  onRequestInquiry();
                }}
              >
                {t("pages.properties.request")}
              </button>
            </div>
          </div>
          <div className="noHiddenText">
            <span>{t("pages.properties.no_hidden_fees")}!</span>
          </div>
          {spOfferFromParam && apartmentDetails && apartmentDetails.offer_start_date && apartmentDetails.offer_end_date && <div className="pt-2"><span className="text-danger" style={{fontSize: '15px'}}>{t("common_lables.offer")} {t("common_lables.valid")} {t("common_lables.from")} {apartmentDetails.offer_start_date} {t("common_lables.to")} {apartmentDetails.offer_end_date}</span></div>}
        </div>
      </MobileDrawer>

      <MobileDrawer
        openDrawer={forCalendarOptionReqQuote}
        setopenDrawer={setForCalendarOptionReqQuote}
        classText={true}
      >
        <div className="mainCalBooking responisveCalDateCust">
          <Group position="center">
            <DatePicker
              type="range"
              numberOfColumns={2}
              //   value={dateValue}
              //   onChange={setDateValue}
              value={tempDateValue}
              onChange={handleDateChange}
              className="bookingCustomDR"
              //excludeDate={disableDates}
              excludeDate={(e) =>
                disableDates(
                  e,
                  tempDateValue ? tempDateValue[0] : "",
                  apartmentDetails &&
                    apartmentDetails?.no_of_nights &&
                    apartmentDetails?.no_of_nights != null &&
                    apartmentDetails?.no_of_nights != 30
                    ? apartmentDetails?.no_of_nights
                    : 30
                )
              }
              // excludeDate={(e) => (spOfferFromParam === true && nightsFromParam != null) 
              //   ? disableDates(e, tempDateValue ? tempDateValue[0] : "", ((nightsFromParam && nightsFromParam != 30) ? nightsFromParam : 30)) 
              //   : disableDates(e, tempDateValue ? tempDateValue[0] : "", (apartmentDetails && apartmentDetails?.no_of_nights && apartmentDetails?.no_of_nights != null && apartmentDetails?.no_of_nights != 30) ? apartmentDetails?.no_of_nights : 30)}
              minDate={new Date()}
            />
          </Group>

          
        </div>
        <div className="resBookingDateBtn">
        <div className="animateBtn">
            <button
              type="button"
              //className="appBtn bg-black w-100 d-flex align-items-center justify-content-center"

              className={`appBtn bg-black w-100 d-flex align-items-center justify-content-center disableButton${
                tempDateValue[1] === null
                  ? " disabled"
                  : ""
              }`}
              disabled={tempDateValue[1] === null}

              onClick={() => {
                setForCalendarOptionReqQuote(false);
                handleApplyClick();
              }}
            >
              {t("common_lables.apply")}
            </button>
          </div>
          </div>
      </MobileDrawer>

      {/* For Add to Cart Drawers */}
      <MobileDrawer
        openDrawer={forDateOptionCart}
        setopenDrawer={setForDateOptionCart}
        classText={true}
      >
        <div className="bookingDetailCustSm">
          <h4>{t("pages.properties.when_to_stay")}?</h4>

          <div>
            <div className="bookinginfoTextDtls">
              {/* {spOfferFromParam === true && nightsFromParam != null && nightsFromParam != 30 && (
                <p className="minRentalText">
                {nightsFromParam < 365 ? (
                  <>{t("common_lables.min")} {nightsFromParam}{" "}{t("common_lables.days_rental")}{" "}</>
                ) : (
                  <>{t("common_lables.min")} {t("common_lables.yearly_rental").toLowerCase()}</>
                )}
                </p>
              )} */}
              {apartmentDetails && apartmentDetails?.no_of_nights && apartmentDetails?.no_of_nights != null && apartmentDetails?.no_of_nights != 30 && (
                <p className="minRentalText">
                {apartmentDetails?.no_of_nights < 365 ? (
                  <>{t("common_lables.min")} {apartmentDetails?.no_of_nights}{" "}{t("common_lables.days_rental")}{" "}</>
                ) : (
                  <>{t("common_lables.min")} {t("common_lables.yearly_rental").toLowerCase()}</>
                )}
                </p>
              )}
              {apartmentDetails && apartmentDetails?.is_instant_booking === true && <p className="minRentalText">({t("common_lables.instant_booking")})</p>}
            </div>
            {dateValue[0] && dateValue[1] ? (
              <div className="bookingCalendarSm">
                <div className="calBookIcon">
                  <FilterCalendarIcon />
                </div>
                <div
                  className="calContentSm "
                  onClick={() => setForCalendarOptionCart(true)}
                >
                  <p>
                    {t(
                      "pages.properties.feature_properties.checkin_checkout_label"
                    )}
                  </p>
                  <span>
                    {dateFormat(dateValue[0], DATE_FORMATS.CUSTOMDMY)} -{" "}
                    {dateFormat(dateValue[1], DATE_FORMATS.CUSTOMDMY)}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className="bookingCalendarSm"
                onClick={() => {
                  setForCalendarOptionCart(true);
                  setTempDateValue([null, null]);
                }}
              >
                <div className="calBookIcon">
                  <FilterCalendarIcon />
                </div>
                <div className="calContentSm ">
                  <p>
                    {t(
                      "pages.properties.feature_properties.checkin_checkout_label"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="bookBtnSm">
            <div className="animateBtn me-3">
              <button
                type="button"
                //className={`appBtn bg-black w-100 d-flex align-items-center justify-content-center disableButton"${dateValue[1] ? "": " disabled" }`}

                className={`appBtn bg-black w-100 d-flex justify-content-center disableButton${
                  dateValue[0] === null && dateValue[1] === null
                    ? " disabled"
                    : ""
                }`}
                disabled={dateValue[0] === null && dateValue[1] === null}
                onClick={() => {
                  setForDateOptionCart(false);
                  onAddToBookingCart();
                }}
              >
                {t("common_lables.add_cart")}
              </button>
            </div>
          </div>
          <div className="noHiddenText">
            <span>{t("pages.properties.no_hidden_fees")}!</span>
          </div>
          {spOfferFromParam && apartmentDetails && apartmentDetails.offer_start_date && apartmentDetails.offer_end_date && <div className="pt-2"><span className="text-danger" style={{fontSize: '15px'}}>{t("common_lables.offer")} {t("common_lables.valid")} {t("common_lables.from")} {apartmentDetails.offer_start_date} {t("common_lables.to")} {apartmentDetails.offer_end_date}</span></div>}
        </div>
      </MobileDrawer>

      <MobileDrawer
        openDrawer={forCalendarOptionCart}
        setopenDrawer={setForCalendarOptionCart}
        classText={true}
      >
        <div className="mainCalBooking responisveCalDateCust">
          <Group position="center">
            <DatePicker
              type="range"
              numberOfColumns={2}
              //   value={dateValue}
              //   onChange={setDateValue}
              value={tempDateValue}
              onChange={handleDateChange}
              className="bookingCustomDR"
              //excludeDate={disableDates}
              excludeDate={(e) =>
                disableDates(
                  e,
                  tempDateValue ? tempDateValue[0] : "",
                  apartmentDetails &&
                    apartmentDetails?.no_of_nights &&
                    apartmentDetails?.no_of_nights != null &&
                    apartmentDetails?.no_of_nights != 30
                    ? apartmentDetails?.no_of_nights
                    : 30
                )
              }
              // excludeDate={(e) => (spOfferFromParam === true && nightsFromParam != null) 
              //   ? disableDates(e, tempDateValue ? tempDateValue[0] : "", ((nightsFromParam && nightsFromParam != 30) ? nightsFromParam : 30)) 
              //   : disableDates(e, tempDateValue ? tempDateValue[0] : "", (apartmentDetails && apartmentDetails?.no_of_nights && apartmentDetails?.no_of_nights != null && apartmentDetails?.no_of_nights != 30) ? apartmentDetails?.no_of_nights : 30)}
              minDate={new Date()}
            />
          </Group>

          
        </div>
        <div className="resBookingDateBtn">
        <div className="animateBtn">
            <button
              type="button"
              //className="appBtn bg-black w-100 d-flex align-items-center justify-content-center"
              className={`appBtn bg-black w-100 d-flex align-items-center justify-content-center disableButton${
                tempDateValue[1] === null
                  ? " disabled"
                  : ""
              }`}
              disabled={tempDateValue[1] === null}
              onClick={() => {
                setForCalendarOptionCart(false);
                handleApplyClick();
              }}
            >
              {t("common_lables.apply")}
            </button>
          </div>
          </div>
      </MobileDrawer>

      {/* For Ammenities */}

      <MobileDrawer className="mobileDrawerForAmmenities" title="Ammenities" openDrawer={forAmmenities} setopenDrawer={setForAmmenities}>
        <AmmenitiesModal
          setShowAmmenities={setShowAmmenities}
          apartmentAmmenities={allAmenities}
        />
      </MobileDrawer>
    </>
  );
};

export default ResponsivePropertiesDetails;
