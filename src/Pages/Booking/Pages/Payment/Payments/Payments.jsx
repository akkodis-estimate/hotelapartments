import "Pages/Booking/Pages/Booking/Bookings/Bookings.css";
import { BsChevronLeft } from "react-icons/bs";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import AppartImg from "Assets/Images/HomeIcons/AppartMentImages/Jumeriah.png";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import {
  SetDynamicEndpoint,
  customFilterForSelect,
  dateFormat,
} from "Helpers/commonMethodHelper";
import {
  DATE_FORMATS,
  DefaultCountry,
  RoutePaths,
  STATUS,
} from "Constants/Constants";
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
import dropdownService from "Services/dropdownService";
import Select from "react-select";
import "Pages/Booking/Pages/Payment/Payments/Payments.css";
import { ScrollArea } from "@mantine/core";
import RefundPolicy from "Pages/Policy/RefundPolicy/RefundPolicy";
const Payments = () => {
  const { id } = useParams();
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
  const [countryDropdown, setCountryDropdown] = useState([]);

  const [paymentOption, setPaymentOption] = useState(
    location?.state?.paymentOption ? location.state?.paymentOption : 1
  );

  const [isLsChecked, setIsLsChecked] = useState(location?.state?.isLsChecked);

  const [payFullPrice, setPayFullPrice] = useState(0);
  const [payHalfPrice, setPayHalfPrice] = useState(0);
  const [defaultLP, setDefaultLP] = useState(0);
  const [remainingLP, setRemainingLP] = useState(0);
  const [usedLP, setUsedLP] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const [cancellationPolicy, setCancellationPolicy] = useState(false);

  const defaultFormData = {
    street_address: "",
    apt_number: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  };
  const defaultFormValidation = {
    street_address: "",
    apt_number: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);

  useEffect(() => {
    if (
      location &&
      location.state &&
      location.state.start_date &&
      location.state.end_date
    ) {
      dispatch(maskingActions.showMasking());
      bookingService
        .getBookingDetails(id, {
          start_date: dateFormat(location.state.start_date, DATE_FORMATS.YMD),
          end_date: dateFormat(location.state.end_date, DATE_FORMATS.YMD),
          quotation_sid: location?.state?.quotationSID,
          customer_id: userDetails?.customer_id,
        })
        .then((res) => {
          setBookingData(res.data);
          setFormData({
            street_address: res.data?.billing_details?.billing_street,
            apt_number: res.data?.billing_details?.billing_apt_number,
            city: res.data?.billing_details?.billing_city,
            state: res.data?.billing_details?.billing_state,
            zip_code: res.data?.billing_details?.billing_zipcode,
            country: res.data?.billing_details?.billing_country_id,
          });
          setApartmentPreviewData(res.data?.apartment_preview);
          setPriceData(res.data?.price_details);

          setRemainingLP(res.data?.loyalty_points);
          setDefaultLP(res.data?.loyalty_points);

          setFinalPrice(res.data?.price_details?.final_price);
          setPayFullPrice(res.data?.price_details?.final_price);
          setPayHalfPrice(res.data?.price_details?.final_price / 2);
          //calculatePrice(res.data?.total_apartment_price, res.data?.percentage_discount, res.data?.flat_discount, res?.data?.percentage_tax, res?.data?.flat_tax, res?.data?.special_apartment_tax_flat, res?.data?.special_apartment_tax_percentage, res?.data?.security_deposite);
        })
        .finally(() => {
          dispatch(maskingActions.hideMasking());
        });
    }
  }, [language, currency_code]);

  useEffect(() => {
    dispatch(maskingActions.showMasking());
    // dropdownService.get_country_dropdown().then((res) => {
    //   const newArray = res.data?.map((obj) => ({
    //     ...obj,
    //     value: obj.country_id,
    //     label: obj.country_name
    //   }));
    //   setCountryDropdown(newArray);
    // }).finally(() => {
    //   dispatch(maskingActions.hideMasking());
    // });
    dropdownService
      .get_master_country_dropdown()
      .then((res) => {
        
        const newArray = res.data?.map((obj) => ({
          ...obj,
          value: obj.country_master_id,
          label: obj.country_master_name,
        }));
        setCountryDropdown(newArray);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [language]);

  // const calculatePrice = async (bookingPrice, perDiscount, flatDiscount, perTax, flatTax, specialFlatTax, SpecialPerTax, securityDeposite) => {
  //   var perDiscountValue = perDiscount > 0 ? ((bookingPrice * perDiscount) / 100) : 0;
  //   var priceAfterDicount = bookingPrice - perDiscountValue - flatDiscount;

  //   await setTotalDiscount(perDiscountValue + flatDiscount);

  //   var perTaxValue = perTax > 0 ? ((priceAfterDicount * perTax) / 100) : 0;
  //   var perSpeciaTaxValue = SpecialPerTax > 0 ? ((priceAfterDicount * SpecialPerTax) / 100) : 0;

  //   //var finalPrice = priceAfterDicount + perTaxValue + flatTax;

  //   var finalPrice = priceAfterDicount + perTaxValue + flatTax + specialFlatTax + perSpeciaTaxValue + securityDeposite;

  //   //await setTotalTax(perTaxValue + flatTax)
  //   setTotalTax(perTaxValue + flatTax + specialFlatTax + perSpeciaTaxValue)

  //   await setFinalPrice(finalPrice);
  // }

  const backToBooking = () => {
    if (id)
      navigate(`${SetDynamicEndpoint(RoutePaths.BOOKING.BOOKING, [id])}`, {
        state: {
          start_date: bookingData?.start_date,
          end_date: bookingData?.end_date,
          paymentOption: paymentOption,
          quotationSID: location?.state?.quotationSID,
          isLsChecked: location?.state?.isLsChecked,
        },
      });
    //else navigate(`${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [id])}`);
  };

  const bookingSuccess = async (e) => {
    e.preventDefault();
    var req_body = {
      apartment_id: bookingData?.apartment_id,
      property_id: bookingData?.property_id,
      start_date: dateFormat(bookingData?.start_date, DATE_FORMATS.YMD),
      end_date: dateFormat(bookingData?.end_date, DATE_FORMATS.YMD),
      customer_id: userDetails?.customer_id,
      customer: null,
      status: STATUS.REQUESTED,
      guests: 1,
      payment: paymentOption,
      currency_id: bookingData?.currency_id,
      quotation_sid: location?.state?.quotationSID,
    };
    dispatch(maskingActions.showMasking());
    await bookingService
      .booking_request_create(req_body, currency_code === "GBP" ? "USD" : currency_code)
      .then((res) => {
        toast.success(t("toaster_message.add_success"));
        setBookingSuccess(true);
      })
      .catch((res) => {
        toast.error(res?.response?.data?.message);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

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
  };

  const runValidations = () => {
    const updatedValidations = {
      street_address: validationHelper.validateAddress(
        formData.street_address,
        "street_address"
      ),
      apt_number: validationHelper.validTermRule(
        formData.apt_number,
        "apt_number"
      ),
      city: validationHelper.validTermRule(formData.city, "city"),
      state: validationHelper.validTermRule(formData.state, "state"),
      zip_code: validationHelper.validateNaturalNumberForZIPCODE(
        formData.zip_code,
        "zip_code"
      ),
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
        errors[name] = validationHelper.validateAddress(
          value,
          "street_address"
        );
        break;

      case "apt_number":
        errors[name] = validationHelper.validTermRule(value, "apt_number");
        break;

      case "city":
        errors[name] = validationHelper.validTermRule(value, "city");
        break;

      case "state":
        errors[name] = validationHelper.validTermRule(value, "state");
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
      const htmlString = "";

      var req_body = {
        apartment_id: bookingData?.apartment_id,
        property_id: bookingData?.property_id,
        start_date: dateFormat(bookingData?.start_date, DATE_FORMATS.YMD),
        end_date: dateFormat(bookingData?.end_date, DATE_FORMATS.YMD),
        customer_id: userDetails?.customer_id,
        customer: null,
        status: STATUS.REQUESTED,
        guests: 1,
        payment: paymentOption,
        currency_id: bookingData?.currency_id,
        quotation_sid: location?.state?.quotationSID,
        billing_name: userDetails?.first_name + " " + userDetails?.last_name,
        billing_address: formData?.apt_number + " " + formData?.street_address,
        billing_city: formData?.city,
        billing_state: formData?.state,
        billing_zip: formData?.zip_code,
        billing_country: formData?.country,
        billing_tel: userDetails?.phone_number,
        billing_email: userDetails?.email_address,
        is_loyalty_used: isLsChecked,
      };
      dispatch(maskingActions.showMasking());

      try {
        const res = await bookingService.booking_request_create(req_body, currency_code === "GBP" ? "USD" : currency_code);
        const htmlString = res.data;

        if (htmlString) {
          document.open();
          document.write(htmlString);
          document.close();
        } else {
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
    } else {
      setFormValidation(errors);
    }
  };

  const handleLsCheckboxChange = (e) => {
    setIsLsChecked(e.target.checked);
  };

  useEffect(() => {
    // Run countCalculation after the state updates
    setPriceCalculationValues();
  }, [isLsChecked, bookingData, paymentOption]);

  const setPriceCalculationValues = () => {
    if (isLsChecked) {
      //if (paymentOption == 1) {
      if (Number(defaultLP) > Number(finalPrice)) {
        setRemainingLP(Math.round(Number(defaultLP) - Number(finalPrice)));
        setUsedLP(Math.round(Number(finalPrice)));
        setPayFullPrice(Number(0.0));
        setPayHalfPrice(Number(0.0));
        setPaymentOption(1);
      } else {
        setRemainingLP(Number(0));
        setUsedLP(Number(defaultLP));
        setPayFullPrice(Number(finalPrice) - Number(defaultLP));
        setPayHalfPrice(
          (Number(finalPrice) - Number(defaultLP)) / 2 > 0
            ? (Number(finalPrice) - Number(defaultLP)) / 2
            : Number(0.0)
        );
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
    } else {
      setRemainingLP(Number(defaultLP));
      setUsedLP(Number(0));
      setPayFullPrice(Number(finalPrice));
      setPayHalfPrice(Number(finalPrice / 2));
    }
  };
  useEffect(() => {
    let country = countryDropdown.find((x) => x.label === DefaultCountry.UAE);
    // debugger;
    setFormData((prevState) => {
      return {
        ...prevState,
        country: country?.value,
      };
    });
  }, [countryDropdown]);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
    // if (e.target.checked) {
    //   //Api call here
    // }
  };

  return (
    <div className="ha--BookingContaier">
      <div className="ha--MainContainerDesBooking">
        <div className="ha--BookingBackbtn">
          <div className="backBtn">
            {/* <NavLink to="/"> */}
            <button
              onClick={backToBooking}
              type="button"
              className="bg-transparent border-0 d-flex align-items-center"
            >
              <BsChevronLeft />
              {t("pages.booking.back")}
            </button>
            {/* </NavLink> */}
          </div>
        </div>

        <div className="bookingsMainSec">
          <div className="ha--bookingsMainSecColOne">
            <div className="choosePay">
              <div className="checkoutTitle">
                <h5>{t("pages.booking.choose_pay")}</h5>
              </div>
              <div className="payOption">
                {bookingData?.loyalty_points != 0 &&
                  bookingData?.loyalty_points != null &&
                  bookingData?.loyalty_points > 0 && (
                    <>
                      {" "}
                      <div className="ha--PayoptionRadio">
                        <div className="ha--payOptionColumnRadio">
                          <div
                            class="form-check d-flex align-items-start gap-2 moreFilterLayout"
                            style={{
                              opacity: 0.5,
                              cursor: "not-allowed",
                            }}
                          >
                            <input
                              disabled={true}
                              class="form-check-input"
                              type="checkbox"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                              checked={isLsChecked}
                              onChange={handleLsCheckboxChange}
                            />
                            <div className="d-flex flex-column">
                              <label
                                class="form-check-label mb-1"
                                for="flexRadioDefault1"
                              >
                                {t("pages.booking.loyalty_points")}
                              </label>
                              {/* {isLsChecked ? <span className="payNote">
                          {t("pages.booking.remaining_loyalty_points")}
                          {bookingData?.currency_code_display} {priceData?.final_price && Number(bookingData?.loyalty_points) && priceData?.final_price < Number(bookingData?.loyalty_points) ? (validationHelper.formatFloatValue(Number(bookingData?.loyalty_points) - priceData?.final_price)) : Number(0)}
                        </span> :
                          <span className="payNote">
                            {t("pages.booking.remaining_loyalty_points")}
                            {bookingData?.currency_code_display} {Number(bookingData?.loyalty_points)}
                          </span>
                        } */}

                              <span className="payNote">
                                {t("pages.booking.remaining_loyalty_points")}
                                {bookingData?.currency_code_display}{" "}
                                {Number(remainingLP)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ha--payOptionColumnPrice">
                          <div className="priceOption">
                            <p>
                              {bookingData?.currency_code_display}{" "}
                              {Number(bookingData?.loyalty_points)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <hr className="ha--payOptionHr" />
                    </>
                  )}

                {isLsChecked &&
                priceData?.final_price <=
                  Number(bookingData?.loyalty_points) ? (
                  <></>
                ) : (
                  <>
                    <div className="ha--PayoptionRadio">
                      <div className="ha--payOptionColumnRadio">
                        <div class="form-check d-flex align-items-start gap-2">
                          <div>
                            <input
                              disabled={true}
                              class="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                              defaultChecked={true}
                              checked={paymentOption === 1 ? true : false}
                              onClick={() => {
                                setPaymentOption(1);
                              }}
                            />
                          </div>
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
                      {priceData && (
                        <div className="ha--payOptionColumnPrice">
                          <div className="priceOption">
                            {/* <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price)}</p> */}
                            {/* {isLsChecked ? <p>{bookingData?.currency_code_display} {priceData?.final_price && Number(bookingData?.loyalty_points) && priceData?.final_price < Number(bookingData?.loyalty_points) ? (validationHelper.formatFloatValue(Number(bookingData?.loyalty_points) - priceData?.final_price)) : (validationHelper.formatFloatValue(priceData?.final_price - validationHelper.formatFloatValue(Number(bookingData?.loyalty_points))))}</p>
                          : <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price)}</p>} */}

                            <p>
                              {bookingData?.currency_code_display}{" "}
                              {validationHelper.formatFloatValue(payFullPrice)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {Math.floor(
                      (new Date(apartmentPreviewData?.start_date) -
                        new Date()) /
                        (1000 * 60 * 60 * 24)
                    ) > 1 && (
                      <div className="ha--PayoptionRadio">
                        <div className="ha--payOptionColumnRadio">
                          <div class="form-check d-flex align-items-start gap-2">
                            <div>
                              <input
                                disabled={true}
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                                checked={paymentOption === 2 ? true : false}
                                onClick={() => {
                                  setPaymentOption(2);
                                }}
                              />
                            </div>
                            <div className="d-flex flex-column">
                              <label
                                class="form-check-label mb-1"
                                for="flexRadioDefault1"
                              >
                                {t("pages.booking.pay_half_later")}
                              </label>
                              {/* <span className="payNote">
                              {t("pages.booking.pay")} {bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price / 2)} {t("pages.booking.now&rest")} ({bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price / 2)}) {t("pages.booking.will")}
                              {t("pages.booking.automatically_charged")}
                              {" " + apartmentPreviewData?.start_date}. {t("pages.booking.no_extrafee")}
                            </span> */}
                              {/* {isLsChecked ?

                              <span className="payNote">
                                {t("pages.booking.pay")} {bookingData?.currency_code_display} {priceData?.final_price && Number(bookingData?.loyalty_points) && priceData?.final_price < Number(bookingData?.loyalty_points) ? (validationHelper.formatFloatValue((Number(bookingData?.loyalty_points) - priceData?.final_price)) / 2) : (validationHelper.formatFloatValue((priceData?.final_price - validationHelper.formatFloatValue(Number(bookingData?.loyalty_points))) / 2))} {t("pages.booking.now&rest")} ({bookingData?.currency_code_display} {priceData?.final_price && Number(bookingData?.loyalty_points) && priceData?.final_price < Number(bookingData?.loyalty_points) ? (validationHelper.formatFloatValue((Number(bookingData?.loyalty_points) - priceData?.final_price)) / 2) : (validationHelper.formatFloatValue((priceData?.final_price - validationHelper.formatFloatValue(Number(bookingData?.loyalty_points))) / 2))}) {t("pages.booking.will")}
                                {t("pages.booking.automatically_charged")}
                                {" " + apartmentPreviewData?.start_date}. {t("pages.booking.no_extrafee")}
                              </span>

                              : <span className="payNote">
                                {t("pages.booking.pay")} {bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price / 2)} {t("pages.booking.now&rest")} ({bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price / 2)}) {t("pages.booking.will")}
                                {t("pages.booking.automatically_charged")}
                                {" " + apartmentPreviewData?.start_date}. {t("pages.booking.no_extrafee")}
                              </span>} */}

                              <span className="payNote">
                                {t("pages.booking.pay")}{" "}
                                {bookingData?.currency_code_display}{" "}
                                {validationHelper.formatFloatValue(
                                  payHalfPrice
                                )}{" "}
                                {t("pages.booking.now&rest")} (
                                {bookingData?.currency_code_display}{" "}
                                {validationHelper.formatFloatValue(
                                  payHalfPrice
                                )}
                                ) {t("pages.booking.will")}
                                {t("pages.booking.automatically_charged")}
                                {" " + apartmentPreviewData?.start_date}.{" "}
                                {t("pages.booking.no_extrafee")}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ha--payOptionColumnPrice">
                          <div className="priceOption">
                            {/* <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price / 2)}</p> */}
                            {/* {isLsChecked ? <p>{bookingData?.currency_code_display} {priceData?.final_price && Number(bookingData?.loyalty_points) && priceData?.final_price < Number(bookingData?.loyalty_points) ? (validationHelper.formatFloatValue((Number(bookingData?.loyalty_points) - priceData?.final_price)) / 2) : (validationHelper.formatFloatValue((priceData?.final_price - validationHelper.formatFloatValue(Number(bookingData?.loyalty_points))) / 2))} </p> :
                            <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price / 2)}</p>} */}

                            <p>
                              {bookingData?.currency_code_display}{" "}
                              {validationHelper.formatFloatValue(payHalfPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <hr className="ha--payOptionHr" />
                  </>
                )}

                <div className="d-block">
                  {/* <div className="row paymentCardDetails mb-5">
                  <div className="col-lg-12 mb-4 p-0">
                    <div className="checkoutTitle ">
                      <h5>{t("pages.booking.multibooking_payment.pay_with")}</h5>
                    </div>
                  </div>
                  <div className="col-lg-12 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.choose_method")}</label>
                    <select
                      class="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>{t("pages.booking.multibooking_payment.cc/dc")}</option>
                      <option value="1">{t("pages.booking.multibooking_payment.cc")}</option>
                      <option value="2">{t("pages.booking.multibooking_payment.dc")}</option>
                    </select>
                  </div>
                  <div className="col-lg-12 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.card_number")}</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter 16 digit card number"
                      aria-label="First name"
                      name="first_name"
                    />
                  </div>
                  <div className="col-lg-6 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.expiration_Date")}</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="DD/MM/YY"
                      aria-label="First name"
                      name="first_name"
                    />
                  </div>
                  <div className="col-lg-6 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.cvv")}</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter 3 digit cvv code"
                      aria-label="First name"
                      name="first_name"
                    />
                  </div>
                </div> */}

                  <div className="ha--CheckOutFormBooking checkoutForm ">
                    <div className="checkoutTitleDetail ">
                      <h5>
                        {t(
                          "pages.booking.multibooking_payment.billing_address"
                        )}
                      </h5>
                    </div>
                    <div className="ha--CheckOutFormBookingRow">
                      <div className="ha--bookingFormColumn">
                        <label className="form-label">
                          {t(
                            "pages.booking.multibooking_payment.street_address"
                          )}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t(
                            "pages.booking.multibooking_payment.ph_street_address"
                          )}
                          aria-label="First name"
                          name="street_address"
                          onChange={handleTextChange}
                          value={formData.street_address}
                        />
                        {formValidation.street_address && (
                          <div className="invalid">
                            {t(formValidation.street_address)}
                          </div>
                        )}
                      </div>
                      <div className="ha--bookingFormColumn">
                        <label className="form-label">
                          {t(
                            "pages.booking.multibooking_payment.apt/suite_number"
                          )}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder={t(
                            "pages.booking.multibooking_payment.ph_apartment_details"
                          )}
                          aria-label="First name"
                          name="apt_number"
                          onChange={handleTextChange}
                          value={formData.apt_number}
                        />
                        {formValidation.apt_number && (
                          <div className="invalid">
                            {t(formValidation.apt_number)}
                          </div>
                        )}
                      </div>
                      <div className="ha--bookingFormColumn">
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
                          name="city"
                          onChange={handleTextChange}
                          value={formData.city}
                        />
                        {formValidation.city && (
                          <div className="invalid">
                            {t(formValidation.city)}
                          </div>
                        )}
                      </div>
                      <div className="ha--bookingFormColumn">
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
                          name="state"
                          onChange={handleTextChange}
                          value={formData.state}
                        />
                        {formValidation.state && (
                          <div className="invalid">
                            {t(formValidation.state)}
                          </div>
                        )}
                      </div>
                      <div className="ha--bookingFormColumn">
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
                          name="zip_code"
                          onChange={handleTextChange}
                          value={formData.zip_code}
                        />
                        {formValidation.zip_code && (
                          <div className="invalid">
                            {t(formValidation.zip_code)}
                          </div>
                        )}
                      </div>
                      <div className="ha--bookingFormColumn paymentSlctCountry">
                        <label className="form-label">
                          {t(
                            "pages.booking.multibooking_payment.select_country"
                          )}
                        </label>
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
                          placeholder={t(
                            "pages.booking.multibooking_payment.ph_country"
                          )}
                          options={countryDropdown}
                          value={
                            formData.country
                              ? countryDropdown?.find(
                                  (f) => f.value === formData.country
                                )
                              : countryDropdown?.find(
                                  (f) => f.label === DefaultCountry.UAE
                                )
                          }
                          onChange={(e) => {
                            setFormData((prevState) => {
                              return {
                                ...prevState,
                                country: e.value,
                              };
                            });
                            handleDropdownChange(e.value, "country");
                          }}
                          filterOption={customFilterForSelect}
                          getOptionLabel={(option) => option.label}
                        />
                        {formValidation.country && (
                          <div className="invalid">
                            {t(formValidation.country)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
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
                  <hr className="paymentHrMainCust" />
                  <div className="cancelaationPolicy">
                    <div className="checkoutTitle">
                      <h5>
                        {t(
                          "pages.booking.multibooking_payment.cancellation_policy"
                        )}
                      </h5>
                    </div>

                    <div className="cnacelationNote">
                      {/* <p>
                        {t(
                          "pages.booking.multibooking_payment.free_cancellation"
                        )}
                        .
                      </p> */}
                      <p>
                          {t("pages.booking.multibooking_payment.fc_clause")} 
                          {" "}<span className="text-decoration-underline cursor-pointer" onClick={() => {setCancellationPolicy(true)}}>{t("pages.booking.multibooking_payment.fc_clause1")}</span>
                          {" " + t("pages.booking.multibooking_payment.fc_clause2")}
                        </p>
                    </div>

                    <div className="actionBtn ha--PaymentBtmBtn">
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
                </div>
              </div>
            </div>
          </div>
          <div className="ha--bookingsMainSecColTwo">
            <ApartmentPreview apartmentPreviewData={apartmentPreviewData} />

            {priceData && bookingData && (
              <PriceDetails
                priceData={priceData}
                bookingData={bookingData}
                currency={bookingData?.currency_code_display}
                date={apartmentPreviewData?.start_date}
                paymentOption={paymentOption}
                isLsChecked={isLsChecked}
                dueNow={payHalfPrice}
                totalPrice={payFullPrice}
                usedLP={usedLP}
              />
            )}
          </div>
        </div>
      </div>
      <ModalPopup dialogClassName="applicationModal" show={isBookingSuccess}>
        <BookingSuccessModal />
      </ModalPopup>


      <ModalPopup
        show={cancellationPolicy}
        dialogClassName="applicationModal termsAndConditionsModal"
      >
        <div className="modal-header border-0 p-0 mb-4">
          <div className="pageTitle">
            <h2>{t("pages.footer.links.refund_policy")}</h2>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setCancellationPolicy(false);
            }}
          ></button>
        </div>
        <ScrollArea h={700}>
          <RefundPolicy fromPopup={true} />
        </ScrollArea>
      </ModalPopup>

    </div>
  );
};

export default Payments;
