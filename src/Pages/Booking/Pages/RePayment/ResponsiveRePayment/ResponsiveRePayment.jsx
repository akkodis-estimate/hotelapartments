import "Pages/Booking/Pages/Booking/Bookings/Bookings.css";
import { BsChevronLeft } from "react-icons/bs";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import AppartImg from "Assets/Images/HomeIcons/AppartMentImages/Jumeriah.png";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import { SetDynamicEndpoint, customFilterForSelect, dateFormat } from "Helpers/commonMethodHelper";
import { DATE_FORMATS, DefaultCountry, RoutePaths, STATUS } from "Constants/Constants";
import ApartmentPreview from "Pages/Booking/Components/ApartmentPreview/apartmentPreview";
import PriceDetails from "Pages/Booking/Components/PriceDetails/priceDetails";
import BookingSuccessModal from "Pages/Booking/Components/BookingSuccess/BookingSuccessModal";
import { useEffect, useState } from "react";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import { useDispatch, useSelector } from "react-redux";
import maskingActions from "reducers/masking/masking.actions";
import bookingService from "Services/bookingService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import validationHelper from "Helpers/validationHelper";
import paymentService from "Services/PaymentService";
import "Pages/Booking/Pages/Booking/ResponsiveBooking/ResponsiveBooking.css"
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import dropdownService from "Services/dropdownService";
import Select from "react-select";
import { ScrollArea } from "@mantine/core";
import RefundPolicy from "Pages/Policy/RefundPolicy/RefundPolicy";
import accountSettingService from "Services/AccountSettingService";

const ResponsiveRePayment = () => {
    const { booking_sid } = useParams();
    const { t } = useTranslation();
    const { userDetails } = useSelector((state) => state.customerAuth);
    const navigate = useNavigate();

    const dispatch = useDispatch(); // For calling Reducers

    //To get Start Date and End Date
    const location = useLocation();


    const [isBookingSuccess, setBookingSuccess] = useState(false);

    const [bookingData, setBookingData] = useState(null);
    const [apartmentPreviewData, setApartmentPreviewData] = useState(null);
    const [priceData, setPriceData] = useState(null);
    const [finalPrice, setFinalPrice] = useState();
    const [totalTax, setTotalTax] = useState();
    const [totalDiscount, setTotalDiscount] = useState();
    const { language, currency_code } = useSelector((state) => state.language);

    const [paymentOption, setPaymentOption] = useState(location?.state?.paymentOption ? location.state?.paymentOption : 1);

    const [isLsChecked, setIsLsChecked] = useState(location?.state?.isLsChecked);

    const [isCreditChecked, setIsCreditChecked] = useState(false);

    const [payFullPrice, setPayFullPrice] = useState(0);
    const [payHalfPrice, setPayHalfPrice] = useState(0);
    const [defaultLP, setDefaultLP] = useState(0);
    const [remainingLP, setRemainingLP] = useState(0);
    const [usedLP, setUsedLP] = useState(0);

    const [defaultCL, setDefaultCL] = useState(0.00);
    const [remainingCL, setRemainingCL] = useState(0.00);
    const [usedCL, setUsedCL] = useState(0.00);

    const [cancellationPolicy, setCancellationPolicy] = useState(false);
    const [isChecked, setIsChecked] = useState(false);


    const defaultFormData = {
        street_address: "",
        apt_number: "",
        city: "",
        state: "",
        zip_code: "",
        country: ""
    };
    const defaultFormValidation = {
        street_address: "",
        apt_number: "",
        city: "",
        state: "",
        zip_code: "",
        country: ""
    };

    const [formData, setFormData] = useState(defaultFormData);
    const [formValidation, setFormValidation] = useState(defaultFormValidation);

    const [forPriceDetails, setForPriceDetails] = useState(false); // For Mobile Filter drawer
    const [countryDropdown, setCountryDropdown] = useState([]);

    useEffect(() => {
        if (booking_sid) {
            dispatch(maskingActions.showMasking());
            bookingService
                .RE_PAYMENT(booking_sid)
                .then((res) => {
                    setBookingData(res.data);
                    setApartmentPreviewData(res.data?.apartment_preview);
                    setPriceData(res.data?.price_details);

                    setRemainingLP(res.data?.loyalty_points)
                    setDefaultLP(res.data?.loyalty_points)

                    setRemainingCL(res?.data?.credit_limit)
                    setDefaultCL(res?.data?.credit_limit)

                    setFinalPrice(res.data?.price_details?.final_price);
                    setPayFullPrice(res.data?.price_details?.final_price)
                    setPayHalfPrice(res.data?.price_details?.final_price / 2)
                    //calculatePrice(res.data?.total_apartment_price, res.data?.percentage_discount, res.data?.flat_discount, res?.data?.percentage_tax, res?.data?.flat_tax, res?.data?.special_apartment_tax_flat, res?.data?.special_apartment_tax_percentage, res?.data?.security_deposite);
                    // setFormData({
                    //     street_address: res.data?.billing_address ? res.data?.billing_address : "",
                    //     city: res.data?.billing_city ? res.data?.billing_city : "",
                    //     state: res.data?.billing_state ? res.data?.billing_state : "",
                    //     zip_code: res.data?.billing_zip ? res.data?.billing_zip : "",
                    //     country: res.data?.billing_country ? Number(res.data?.billing_country) : ""
                    // })
                })
                .finally(() => {
                    dispatch(maskingActions.hideMasking());
                });
        }
    }, [language, currency_code]);

    useEffect(() => {
        dispatch(maskingActions.showMasking());
        dropdownService.get_country_dropdown().then((res) => {
            const newArray = res.data?.map((obj) => ({
                ...obj,
                value: obj.country_id,
                label: obj.country_name
            }));
            setCountryDropdown(newArray);
        }).finally(() => {
            dispatch(maskingActions.hideMasking());
        });
    }, [language])


    const handleDropdownChange = (value, name) => {
        const errors = {
            ...formValidation,
        };
        switch (name) {
            case "country":
                errors[name] = validationHelper.validateDropdown(value, "Country");
                break;
            default:
                break;
        }
        setFormValidation(errors);
    }

    const runValidations = () => {
        const updatedValidations = {

            street_address: validationHelper.validateAddress(formData.street_address, "street_address"),
            apt_number: validationHelper.validTermRule(formData.apt_number, "apt_number"),
            city: validationHelper.validTermRule(formData.city, "city"),
            state: validationHelper.validTermRule(formData.state, "state"),
            zip_code: validationHelper.validateNaturalNumberForZIPCODE(formData.zip_code, "zip_code"),
            country: validationHelper.validateDropdown(formData.country, "country"),
        };
        return updatedValidations;
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
            case "street_address":
                errors[name] = validationHelper.validateAddress(value, "street_address");
                break;

            case "apt_number":
                errors[name] = validationHelper.validTermRule(value, "apt_number");
                break;

            case "city":
                errors[name] = validationHelper.validTermRule(
                    value,
                    "city"
                );
                break;

            case "state":
                errors[name] = validationHelper.validTermRule(
                    value, "state"
                );
                break;

            case "zip_code":
                errors[name] = validationHelper.validateNaturalNumberForZIPCODE(
                    value,
                    "zip_code"
                );
                break;

            // case "country":
            //   errors[name] = validationHelper.validTermRule(
            //     value, "country"
            //   );
            //   break;


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

    const redirectPayment = async (e) => {
        //debugger
        e.preventDefault();
        const errors = runValidations();
        const isRequiredFieldsAreValid =
            Object.keys(errors).filter((key) => errors[key]).length === 0;

        if (isRequiredFieldsAreValid) {

            const htmlString = '';

            var req_body = {
                payment: paymentOption,
                billing_name: userDetails?.first_name + " " + userDetails?.last_name,
                billing_address: formData?.apt_number + " " + formData?.street_address,
                billing_city: formData?.city,
                billing_state: formData?.state,
                billing_zip: formData?.zip_code,
                billing_country: formData?.country,
                billing_tel: userDetails?.phone_number,
                billing_email: userDetails?.email_address,
                is_loyalty_used: isLsChecked,
                is_credit_used: isCreditChecked,
                is_corporate: bookingData?.is_corporate
            };
            dispatch(maskingActions.showMasking());

            try {
                const res = await bookingService.RE_PAYMENT_UPDATE(booking_sid, req_body);
                const htmlString = res.data;


                if (htmlString) {
                    document.open();
                    document.write(htmlString);
                    document.close();
                }
                else {
                    toast.success(t("toaster_message.add_success"));
                    setBookingSuccess(true);
                }
                if (isChecked) {
                    let request = {
                      billing_street: formData.street_address,
                      billing_apt_number: formData.apt_number,
                      billing_city: formData.city,
                      billing_state: formData.state,
                      billing_zipcode: formData.zip_code,
                      billing_country_id: formData.country,
                    };
                    bookingService
                      .update_billing_address(request)
                      .then((res) => {})
                      .catch((err) => {
                        
                      });
                  }
            } catch (error) {
                console.error(error);
                toast.error(error?.response?.data?.message);
            } finally {
                dispatch(maskingActions.hideMasking());
            }
        }
        else {
            setFormValidation(errors);
        }
    }

    const handleLsCheckboxChange = (e) => {
        setIsLsChecked(e.target.checked);
    };

    useEffect(() => {
        // Run countCalculation after the state updates
        if (userDetails.type == 1) {
            setPriceCalculationValues();
        }

    }, [isLsChecked, bookingData, paymentOption]);

    const handleCreditCheckboxChange = (e) => {
        setIsCreditChecked(e.target.checked);
    };

    useEffect(() => {
        // Run countCalculation after the state updates
        if (userDetails.type == 2) {
            countCalculation();
        }
    }, [isCreditChecked, bookingData]);

    const setPriceCalculationValues = () => {

        if (isLsChecked) {
            //if (paymentOption == 1) {
            if (Number(defaultLP) > Number(finalPrice)) {
                setRemainingLP(Math.round(Number(defaultLP) - Number(finalPrice)))
                setUsedLP(Math.round(Number(finalPrice)))
                setPayFullPrice(Number(0.00))
                setPayHalfPrice(Number(0.00))
                setPaymentOption(1)
            }
            else {
                setRemainingLP(Number(0));
                setUsedLP(Number(defaultLP));
                setPayFullPrice(Number(finalPrice) - Number(defaultLP))
                setPayHalfPrice(((Number(finalPrice) - Number(defaultLP)) / 2) > 0 ? ((Number(finalPrice) - Number(defaultLP)) / 2) : Number(0.00))
            }
            //}
            // else if (paymentOption == 2) {
            //   if (Number(defaultLP) > (Number(finalPrice) / 2)) {
            //     setRemainingLP(Math.round(Number(defaultLP) - (Number(finalPrice) / 2)))
            //     setUsedLP(Math.round((Number(finalPrice) / 2)))
            //     setPayFullPrice(Number(finalPrice) - Number(defaultLP))
            //     //setPayHalfPrice(Number(0.00))
            //     setPayHalfPrice(((Number(finalPrice) - Number(defaultLP)) / 2) > 0 ? ((Number(finalPrice) - Number(defaultLP)) / 2) : Number(0.00))
            //   }
            //   else {
            //     setRemainingLP(Number(0));
            //     setUsedLP(Number(defaultLP));
            //     setPayFullPrice(Number(finalPrice) - Number(defaultLP))
            //     //setPayHalfPrice((Number(finalPrice / 2) - Number(defaultLP)) > 0 ? (Number(finalPrice / 2) - Number(defaultLP)) : Number(0.00))
            //     setPayHalfPrice(((Number(finalPrice) - Number(defaultLP)) / 2) > 0 ? ((Number(finalPrice) - Number(defaultLP)) / 2) : Number(0.00))
            //   }
            // }
        }
        else {
            setRemainingLP(Number(defaultLP));
            setUsedLP(Number(0));
            setPayFullPrice(Number(finalPrice));
            setPayHalfPrice(Number(finalPrice / 2))
        }
    }

    const countCalculation = () => {
        //debugger
        if (isLsChecked) {
            if (Number(defaultLP) > Number(finalPrice)) {
                setRemainingLP(Math.round(Number(defaultLP) - Number(finalPrice)))
                setUsedLP(Math.round(Number(finalPrice)))
                setUsedCL(Number(0.00))
                setRemainingCL(Number(defaultCL));
                setPayFullPrice(Number(0.00))
                setPayHalfPrice(Number(0.00))
                setPaymentOption(1)
            }
            else {
                setRemainingLP(Number(0));
                setUsedLP(Number(defaultLP));
                if (isCreditChecked && Number(defaultCL) > (Number(finalPrice) - Number(defaultLP))) {
                    setRemainingCL(Number(defaultCL) - (Number(finalPrice) - Number(defaultLP)))
                    setUsedCL(Number(finalPrice) - Number(defaultLP))
                    setPayFullPrice(Number(finalPrice) - Number(defaultLP))
                    setPayHalfPrice((Number(finalPrice) - Number(defaultLP)) / 2)
                }
                else if (isCreditChecked) {
                    setUsedCL(Number(defaultCL));
                    setRemainingCL(Number(0.00));
                    setPayFullPrice(Number(finalPrice) - Number(defaultLP) - Number(defaultCL))
                    setPayHalfPrice((Number(finalPrice) - Number(defaultLP) - Number(defaultCL)) / 2)
                }
                else {
                    setUsedCL(Number(0.00));
                    setRemainingCL(Number(defaultCL));
                    setPayFullPrice(Number(finalPrice) - Number(defaultLP))
                    setPayHalfPrice((Number(finalPrice) - Number(defaultLP)) / 2)
                }
            }
        }
        else if (isCreditChecked) {
            //debugger
            setRemainingLP(Number(defaultLP));
            setUsedLP(0);
            if (Number(defaultCL) > Number(finalPrice)) {
                setRemainingCL(Number(defaultCL) - Number(finalPrice));
                setUsedCL(Number(finalPrice));
                setPayFullPrice(Number(0.00))
                setPayHalfPrice(Number(0.00))
                setPaymentOption(1)
            }
            else {
                setUsedCL(Number(defaultCL));
                setRemainingCL(Number(0));
                setPayFullPrice(Number(finalPrice) - Number(defaultCL))
                setPayHalfPrice((Number(finalPrice) - Number(defaultCL)) / 2)
            }
        }
        else {
            setRemainingCL(Number(defaultCL));
            setRemainingLP(Number(defaultLP));
            setUsedCL(Number(0.00))
            setUsedLP(Number(0));
            setPayFullPrice(Number(finalPrice));
            setPayHalfPrice(Number(finalPrice / 2))
        }
    }

    const personalDataApi = () => {
        // if (userDetails !== null) {
          dispatch(maskingActions.showMasking());
    
          accountSettingService
            .get_user_by_sid(userDetails.customer_sid)
            .then((res) => {
              // setFormData((prevState) => {
              //   return {
              //     // ...prevState,
              //     // ...res.data.info,
              //     street_address: res.data?.info?.billing_street,
              //   apt_number: res.data?.info?.billing_apt_number,
              //   city: res.data?.info?.billing_city,
              //   state: res.data?.info?.billing_state,
              //   zip_code: res.data?.info?.billing_zipcode,
              //   country: res.data?.info?.billing_country_id
                  
              //   };
              // });
              setFormData({
                street_address: res.data?.info?.billing_street
                  ? res.data?.info?.billing_street
                  : "",
                  apt_number: res.data?.info?.billing_apt_number
                  ? res.data?.info?.billing_apt_number
                  : "",
                city: res.data?.info?.billing_city ? res.data?.info?.billing_city : "",
                state: res.data?.info?.billing_state ? res.data?.info?.billing_state : "",
                zip_code: res.data?.info?.billing_zipcode ? res.data?.info?.billing_zipcode : "",
                country: res.data?.info?.billing_country
                  ? Number(res.data?.info?.billing_country)
                  : countryDropdown.find(x=>x.label === DefaultCountry.UAE)?.value,
              });
            })
            .finally(() => {
              dispatch(maskingActions.hideMasking());
            });
        // }
      };
    
      useEffect(()=>{
    if (countryDropdown.length > 0) {
      personalDataApi();
    }
      },
      [countryDropdown])
    
      const handleCheckboxChange = (e) => {
        setIsChecked(e.target.checked);
        if (e.target.checked) {
          //Api call here
        } 
      };

    return (
        <>
            <div className="container checkoutContainer mt-4 mb-4">
                {/* <div className="row mb-5">
                    <div className="col-lg-12">
                        <div className="backBtn">
                            <button
                                onClick={backToBooking}
                                type="button"
                                className="bg-transparent border-0 d-flex align-items-center ps-0"
                            >
                                <BsChevronLeft />
                                {t("pages.booking.back")}
                            </button>
                        </div>
                    </div>
                </div> */}
                <div className="row mt-4">
                    <div className="col-lg-5 p-0">
                        <div className="bookingPreviewSm">
                            <div className="d-flex align-items-start gap-3">
                                <div className="bookingPropertyIcon">
                                    <img src={apartmentPreviewData?.image_url ? apartmentPreviewData?.image_url?.replace(/\/([^/]+)$/, '/thumb_$1') : AppartmentImg}
                                        onError={(event) => {
                                            event.target.src = apartmentPreviewData?.image_url || AppartmentImg;
                                        }}
                                        alt="Booking" />
                                </div>
                                <div className="bookingPropertyContent">
                                    <h5>{apartmentPreviewData?.title}</h5>
                                    <p>{apartmentPreviewData?.start_date} – {apartmentPreviewData?.end_date}</p>
                                </div>
                                <hr className="mt-3" />
                            </div>
                        </div>

                        <div className="previewPriceDetails" onClick={() => setForPriceDetails(true)}>
                            <span>{t("pages.booking.view_price_details")}</span>
                        </div>


                        <div className="yourTripDetail showBedIcons  pb-4">
                            <h5>{t("pages.booking.view_trip_details")}</h5>

                            <div className="dateBed d-flex align-items-center justify-content-between mb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div> <FilterCalendarIcon /></div>
                                    <p><span>{t("pages.properties.card.dates")}:</span>  {apartmentPreviewData?.start_date} – {apartmentPreviewData?.end_date}</p>
                                </div>
                                {/* <span className="dateEdit">{t("common_lables.edit")}</span> */}
                            </div>

                            <div className="dateBed d-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-2">
                                    <div><FBedIcon /></div>
                                    <p><span>{t("pages.properties.feature_properties.bedrooms")}: </span> {apartmentPreviewData?.bedrooms}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-7 p-0">
                        <div className="choosePay">
                            <div className="checkoutTitle mb-4">
                                <h5>{t("pages.booking.choose_pay")}</h5>
                            </div>
                            <div className="payOption">

                                {userDetails.type == 1 ?
                                    <>
                                        {bookingData?.loyalty_points != 0 && bookingData?.loyalty_points != null && bookingData?.loyalty_points > 0 &&
                                            <><div className="row">
                                                <div className="col-lg-8 p-0">
                                                    <div class="form-check d-flex align-items-start gap-2 moreFilterLayout">
                                                        <input
                                                            //disabled=
                                                            class="form-check-input"
                                                            type="checkbox"
                                                            name="flexRadioDefault"
                                                            id="flexRadioDefault"
                                                            checked={isLsChecked}
                                                            onChange={handleLsCheckboxChange}
                                                        />
                                                        <div className="d-flex flex-column">
                                                            <label
                                                                class="form-check-label mb-1"
                                                                for="flexRadioDefault"
                                                            >
                                                                {t("pages.booking.loyalty_points")}
                                                            </label>

                                                            <span className="payNote">
                                                                {t("pages.booking.remaining_loyalty_points")}
                                                                {bookingData?.currency_code_display} {Number(remainingLP)}
                                                            </span>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-4 p-0 d-flex justify-content-end">
                                                    <div className="priceOption">
                                                        <p>{bookingData?.currency_code_display} {Number(bookingData?.loyalty_points)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                                <hr /></>}

                                        {isLsChecked && priceData?.final_price <= Number(bookingData?.loyalty_points)
                                            ? <></> : <>
                                                <div className="row mb-4">
                                                    <div className="col-lg-8 p-0">
                                                        <div class="form-check d-flex align-items-start gap-2">
                                                            <div> <input
                                                                class="form-check-input"
                                                                type="radio"
                                                                name="flexRadioDefault1"
                                                                id="flexRadioDefault1"
                                                                defaultChecked={true}
                                                                checked={paymentOption === 1 ? true : false}
                                                                onClick={() => { setPaymentOption(1) }}
                                                            /></div>
                                                            <div className="d-flex flex-column">
                                                                <label
                                                                    class="form-check-label mb-1"
                                                                    for="flexRadioDefault1"
                                                                >
                                                                    {t("pages.booking.pay_full")}
                                                                </label>
                                                                <span className="payNote">
                                                                    {t("pages.booking.pay_total")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {priceData && <div className="col-lg-4 p-0 d-flex justify-content-end">
                                                        <div className="priceOption">

                                                            <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(payFullPrice)}</p>
                                                        </div>
                                                    </div>}
                                                </div>

                                                {Math.floor((new Date(apartmentPreviewData?.start_date) - new Date()) / (1000 * 60 * 60 * 24)) > 1 &&
                                                    <div className="row">
                                                        <div className="col-lg-8 p-0">
                                                            <div class="form-check d-flex align-items-start gap-2">
                                                                <div>  <input
                                                                    class="form-check-input"
                                                                    type="radio"
                                                                    name="flexRadioDefault1"
                                                                    id="flexRadioDefault2"
                                                                    checked={paymentOption === 2 ? true : false}
                                                                    onClick={() => { setPaymentOption(2) }}
                                                                /></div>
                                                                <div className="d-flex flex-column">
                                                                    <label
                                                                        class="form-check-label mb-1"
                                                                        for="flexRadioDefault2"
                                                                    >
                                                                        {t("pages.booking.pay_half_later")}
                                                                    </label>

                                                                    <span className="payNote">
                                                                        {t("pages.booking.pay")} {bookingData?.currency_code_display} {validationHelper.formatFloatValue(payHalfPrice)} {t("pages.booking.now&rest")} ({bookingData?.currency_code_display} {validationHelper.formatFloatValue(payHalfPrice)}) {t("pages.booking.will")}
                                                                        {t("pages.booking.automatically_charged")}
                                                                        {" " + apartmentPreviewData?.start_date}. {t("pages.booking.no_extrafee")}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {priceData && <div className="col-lg-4 p-0 d-flex justify-content-end">
                                                            <div className="priceOption">

                                                                <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(payHalfPrice)}</p>
                                                            </div>
                                                        </div>}
                                                    </div>}

                                                <hr className="mt-5 mb-5" />
                                            </>}
                                    </>
                                    :
                                    <>
                                        <div className="row">
                                            <div className="col-lg-8 p-0">
                                                <div class="form-check d-flex align-items-start gap-2 moreFilterLayout"
                                                    style={{
                                                        opacity: Number(bookingData?.credit_limit) && Number(bookingData?.credit_limit) > 0 ? 1 : 0.5,
                                                        cursor: Number(bookingData?.credit_limit) && Number(bookingData?.credit_limit) > 0 ? 'pointer' : 'not-allowed'
                                                    }}>
                                                    <input
                                                        disabled={!Number(bookingData?.credit_limit) || Number(bookingData?.credit_limit) <= 0}
                                                        class="form-check-input"
                                                        type="checkbox"
                                                        name="flexRadioDefault"
                                                        id="flexRadioDefault1"
                                                        checked={isCreditChecked}
                                                        onChange={handleCreditCheckboxChange}
                                                    />
                                                    <div className="d-flex flex-column">
                                                        <label
                                                            class="form-check-label mb-1"
                                                            for="flexRadioDefault1"
                                                        >
                                                            {t("pages.booking.credit_limit")}
                                                        </label>


                                                        <span className="payNote">
                                                            {t("pages.booking.remaining_credit_limit")}
                                                            {bookingData?.currency_code_display} {validationHelper.formatFloatValue(Number(remainingCL))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 p-0 d-flex justify-content-end">
                                                <div className="priceOption">
                                                    {/* <p>{bookingData?.currency_code_display} {finalPrice}</p> */}
                                                    <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(Number(bookingData?.credit_limit))}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* {(isCreditChecked && isLsChecked && finalPrice <= (Number(bookingData?.credit_limit)) + Number(bookingData?.loyalty_points)) || (isCreditChecked && finalPrice <= Number(bookingData?.credit_limit)) || (isLsChecked && finalPrice <= Number(bookingData?.loyalty_points)) */}
                                        {(isCreditChecked && finalPrice <= (Number(bookingData?.credit_limit)))
                                            ? <></> :
                                            <>
                                                <hr />

                                                <div className="row mb-4">
                                                    <div className="col-lg-8 p-0">
                                                        <div class="form-check d-flex align-items-start gap-2">
                                                            <div><input
                                                                class="form-check-input"
                                                                type="radio"
                                                                name="flexRadioDefault"
                                                                id="flexRadioDefault1"
                                                                defaultChecked={true}
                                                                checked={paymentOption === 1 ? true : false}
                                                                onClick={() => { setPaymentOption(1) }}
                                                            /></div>
                                                            <div className="d-flex flex-column">
                                                                <label
                                                                    class="form-check-label mb-1"
                                                                    for="flexRadioDefault1"
                                                                >
                                                                    {t("pages.booking.pay_full")}
                                                                </label>
                                                                <span className="payNote">
                                                                    {t("pages.booking.pay_total")}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-4 p-0 d-flex justify-content-end">
                                                        <div className="priceOption">

                                                            <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(payFullPrice)}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                            </>}
                                        <hr />
                                    </>
                                }

                                <div className="row checkoutForm mt-5">
                                    <div className="col-lg-12  mb-0 p-0">
                                        <div className="checkoutTitle">
                                            <h5>{t("pages.booking.your_details")}</h5>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 p-0">
                                        <label className="form-label">{t("pages.booking.multibooking_payment.street_address")}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={t("pages.booking.multibooking_payment.ph_street_address")}
                                            aria-label="First name"
                                            name="street_address"
                                            onChange={handleTextChange}
                                            value={formData.street_address}
                                        />
                                        {formValidation.street_address && (
                                            <div className="invalid">{t(formValidation.street_address)}</div>
                                        )}
                                    </div>
                                    <div className="col-lg-12 p-0">
                                        <label className="form-label">{t("pages.booking.multibooking_payment.apt/suite_number")}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={t("pages.booking.multibooking_payment.ph_apartment_details")}
                                            aria-label="First name"
                                            name="apt_number"
                                            onChange={handleTextChange}
                                            value={formData.apt_number}
                                        />
                                        {formValidation.apt_number && (
                                            <div className="invalid">{t(formValidation.apt_number)}</div>
                                        )}
                                    </div>
                                    <div className="col-lg-12 p-0">
                                        <label className="form-label">{t("pages.booking.multibooking_payment.city")}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={t("pages.booking.multibooking_payment.ph_city")}
                                            aria-label="First name"
                                            name="city"
                                            onChange={handleTextChange}
                                            value={formData.city}
                                        />
                                        {formValidation.city && (
                                            <div className="invalid">{t(formValidation.city)}</div>
                                        )}
                                    </div>
                                    <div className="col-lg-6 p-0">
                                        <label className="form-label">{t("pages.booking.multibooking_payment.state")}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={t("pages.booking.multibooking_payment.ph_state")}
                                            aria-label="State"
                                            name="state"
                                            onChange={handleTextChange}
                                            value={formData.state}
                                        />
                                        {formValidation.state && (
                                            <div className="invalid">{t(formValidation.state)}</div>
                                        )}
                                    </div>
                                    <div className="col-lg-6 p-0">
                                        <label className="form-label">{t("pages.booking.multibooking_payment.zip_code")}</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder={t("pages.booking.multibooking_payment.ph_zipcode")}
                                            aria-label="First name"
                                            name="zip_code"
                                            onChange={handleTextChange}
                                            value={formData.zip_code}
                                        />
                                        {formValidation.zip_code && (
                                            <div className="invalid">{t(formValidation.zip_code)}</div>
                                        )}
                                    </div>
                                    <div className="col-lg-12 p-0 paymentSlctCountry">
                                        <label className="form-label">{t("pages.booking.multibooking_payment.select_country")}</label>
                                        {/* <select
                      class="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>United Arab Emirates</option>
                      <option value="1">UAE</option>
                      <option value="2">UAE</option>
                    </select> */}

                                        {/* <input
                      type="text"
                      className="form-control"
                      placeholder={t("pages.booking.multibooking_payment.ph_country")}
                      aria-label="Country"
                      name="country"
                      onChange={handleTextChange}
                      value={formData.country}
                    /> */}

                                        <Select
                                            placeholder={t("pages.booking.multibooking_payment.ph_country")}
                                            options={countryDropdown}
                                            value={countryDropdown?.find(f => f.value === formData.country)}
                                            onChange={(e) => {
                                                setFormData((prevState) => {
                                                    return {
                                                        ...prevState,
                                                        country: e.value,
                                                    };
                                                }); handleDropdownChange(e.value, "country")
                                            }}

                                            filterOption={customFilterForSelect}
                                            getOptionLabel={option => option.label}
                                        />
                                        {formValidation.country && (
                                            <div className="invalid">{t(formValidation.country)}</div>
                                        )}

                                    </div>
                                </div>

                                <div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-12 p-0">
                    <div className="col-lg-12  moreFilterLayout">
                  <div class="form-check checkoutCheck ">
                    <input
                      class="form-check-input me-2"
                      type="checkbox"
                      value=""
                      id="flexCheckDefault"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label class="form-check-label mt-1">
                    {/* Do you want to make it your default billing address? */}
                      {t("pages.booking.save_address")}
                      {/* <span className="" onClick={() => {setTandCModal(true)} }> {t("pages.booking.t&c")}</span> */}
                    </label>
                  </div>
                </div>
                        <hr className="mt-4 mb-5" />
                        <div className="cancelaationPolicy">
                            <div className="row">
                                <div className="col-lg-12 p-0 ">
                                    <div className="checkoutTitle mb-4">
                                        <h5>{t("pages.booking.multibooking_payment.cancellation_policy")}</h5>
                                    </div>

                                    <div className="cnacelationNote">
                                        {/* <p>{t("pages.booking.multibooking_payment.free_cancellation")}.</p> */}
                                        <p>
                                            {t("pages.booking.multibooking_payment.fc_clause")}
                                            {" "}<span className="text-decoration-underline cursor-pointer" onClick={() => { setCancellationPolicy(true) }}>{t("pages.booking.multibooking_payment.fc_clause1")}</span>
                                            {" " + t("pages.booking.multibooking_payment.fc_clause2")}
                                        </p>
                                    </div>

                                    <div className="actionBtn mt-4">
                                        <button
                                            type="submit"
                                            className="AuthBtn"
                                            //onClick={(e) => bookingSuccess(e)}
                                            onClick={(e) => redirectPayment(e)}
                                        // disabled={button ? true : false}
                                        >
                                            {t("pages.booking.multibooking_payment.request_book")}
                                        </button>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>

                </div>



            </div>

            <MobileDrawer openDrawer={forPriceDetails} setopenDrawer={setForPriceDetails}>
                {priceData && bookingData && <PriceDetails priceData={priceData} bookingData={bookingData} currency={bookingData?.currency_code_display} date={apartmentPreviewData?.start_date} paymentOption={paymentOption} isLsChecked={isLsChecked} dueNow={payHalfPrice} totalPrice={payFullPrice} usedLP={usedLP} />}
            </MobileDrawer>


            <ModalPopup dialogClassName="applicationModal" show={isBookingSuccess}>
                <BookingSuccessModal />
            </ModalPopup>


            <MobileDrawer openDrawer={cancellationPolicy} setopenDrawer={setCancellationPolicy} title={t("pages.footer.links.refund_policy")}>
                <div className="termsAndConditionsModal"><RefundPolicy fromPopup={true} /></div>
            </MobileDrawer>

        </>
    );
};

export default ResponsiveRePayment;
