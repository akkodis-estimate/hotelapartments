import "Pages/Booking/Pages/Booking/Booking.css";
import { BsChevronLeft } from "react-icons/bs";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { SetDynamicEndpoint, customFilterForSelect, dateFormat } from "Helpers/commonMethodHelper";
import { DATE_FORMATS, DefaultCountry, RoutePaths, STATUS } from "Constants/Constants";
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
import "Pages/Booking/Pages/MultiBookingPayment/MultiBookingPayment.css"
import dropdownService from "Services/dropdownService";
import Select from "react-select";
import accountSettingService from "Services/AccountSettingService";
import { ScrollArea } from "@mantine/core";
import RefundPolicy from "Pages/Policy/RefundPolicy/RefundPolicy";

const MultiBookingPayment = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { userDetails } = useSelector((state) => state.customerAuth);
  const navigate = useNavigate();

  const dispatch = useDispatch(); // For calling Reducers

  //To get Start Date and End Date
  const location = useLocation();


  const [isBookingSuccess, setBookingSuccess] = useState(false);
  const [isCreditChecked, setIsCreditChecked] = useState(location?.state?.isCreditChecked);
  const [bookingData, setBookingData] = useState([]);
  const [apartmentPreviewData, setApartmentPreviewData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [finalPrice, setFinalPrice] = useState();
  const [totalTax, setTotalTax] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const { language, currency_code } = useSelector((state) => state.language);

  const [paymentOption, setPaymentOption] = useState(location?.state?.paymentOption ? location.state?.paymentOption : 1);

  const [showPayPartOption, setShowPayPartOption] = useState(true);

  const [isLsChecked, setIsLsChecked] = useState(location?.state?.isLsChecked ? location.state?.isLsChecked : false);

  const [defaultCL, setDefaultCL] = useState(0.00);
  const [defaultLP, setDefaultLP] = useState(0);

  const [remainingCL, setRemainingCL] = useState(0.00);
  const [remainingLP, setRemainingLP] = useState(0);

  const [usedCL, setUsedCL] = useState(0.00);
  const [usedLP, setUsedLP] = useState(0);

  const [payFullPrice, setPayFullPrice] = useState(0);
  const [payHalfPrice, setPayHalfPrice] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const [cancellationPolicy, setCancellationPolicy] = useState(false);

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
  const [countryDropdown, setCountryDropdown] = useState([]);

  const personalDataApi = () => {
    // if (userDetails !== null) {
      dispatch(maskingActions.showMasking());

      accountSettingService
        .get_user_by_sid(userDetails.customer_sid)
        .then((res) => {
          setFormData((prevState) => {
            return {
              // ...prevState,
              // ...res.data.info,
              street_address: res.data?.info?.billing_street,
            apt_number: res.data?.info?.billing_apt_number,
            city: res.data?.info?.billing_city,
            state: res.data?.info?.billing_state,
            zip_code: res.data?.info?.billing_zipcode,
            country: res.data?.info?.billing_country_id
              
            };
          });
          // setCorporateCustomer(res.data.info?.address);
          // setOldphoneNumber(res.data.info.phone_number);
          
          // if (res.data.info.platform !== "Normal")
          //   props.setIsEditPassword(false);
          //setFormData(res.data.info);
        })
        .finally(() => {
          dispatch(maskingActions.hideMasking());
        });
    // }
  };

  useEffect(() => {
    dispatch(maskingActions.showMasking());
    personalDataApi();
    bookingService
      .get_booking_detail_by_customer_id({ customer_id: userDetails?.customer_id })
      .then((res) => {
        var data = res.data?.map((item) => {
          //var calculatedPrice = calculatePrice(item.booking_price, item.percentage_discount, item.flat_discount, item.percentage_tax, item.flat_tax, item.corporate_percentage_discount, item.corporate_flat_discount);
          //var calculatedPrice = calculatePrice(item.total_apartment_price, item.percentage_discount, item.flat_discount, item.percentage_tax, item.flat_tax, item.corporate_percentage_discount, item.corporate_flat_discount, item.special_apartment_tax_flat, item.special_apartment_tax_percentage, item.security_deposite);
          //var calculatedPrice = calculatePrice(item.total_apartment_price, item.percentage_discount, item.flat_discount, item.percentage_tax, item.flat_tax, item.corporate_percentage_discount, item.corporate_flat_discount, item.special_apartment_tax_flat, item.special_apartment_tax_percentage, item.security_deposite, item.total_nights);
          return {
            ...item,
            // totalDiscount: parseFloat(calculatedPrice.totalDiscount)?.toFixed(2),
            // totalTax: parseFloat(calculatedPrice.totalTax)?.toFixed(2),
            // finalPrice: calculatedPrice.finalPrice,
            // per_night_price : calculatedPrice.per_night_price,
            // total_apartment_price : calculatedPrice.total_apartment_price
          }
        })
        const SubTotal = data?.reduce((accumulator, object) => {
          return accumulator + object?.price_details?.final_price;
        }, 0);

        setRemainingCL(data[0]?.credit_limit)
        setRemainingLP(data[0]?.loyalty_points)

        setDefaultCL(data[0]?.credit_limit)
        setDefaultLP(data[0]?.loyalty_points)

        const payPartOption = res.data?.every((item) => Math.floor((new Date(item.start_date) - new Date()) / (1000 * 60 * 60 * 24)) > 1);
        setShowPayPartOption(payPartOption);
        
        setBookingData(data);
        //setFinalPrice(validationHelper.formatFloatValue(SubTotal));
        setFinalPrice(SubTotal);

        setPayFullPrice(SubTotal)
        setPayHalfPrice(SubTotal / 2)
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
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
  }, [language])

  // const calculatePrice = (bookingPrice, perDiscount, flatDiscount, perTax, flatTax, corporatePerDiscount, corporateFlatDiscount) => {
  //   var perDiscountValue = perDiscount > 0 ? ((bookingPrice * (perDiscount+corporatePerDiscount)) / 100) : 0;
  //   var priceAfterDicount = bookingPrice - perDiscountValue - flatDiscount - corporateFlatDiscount;

  //   //setTotalDiscount(perDiscountValue + flatDiscount);

  //   var perTaxValue = perTax > 0 ? ((priceAfterDicount * perTax) / 100) : 0;
  //   var finalPrice = priceAfterDicount + perTaxValue + flatTax;

  //   // setTotalTax(perTaxValue + flatTax)

  //   // setFinalPrice(finalPrice);
  //   return { 
  //       totalDiscount : perDiscountValue + flatDiscount,
  //       totalTax : perTaxValue + flatTax,
  //       finalPrice : finalPrice
  //   }
  // }

  // const calculatePrice = (bookingPrice, perDiscount, flatDiscount, perTax, flatTax, corporatePerDiscount, corporateFlatDiscount, specialFlatTax, SpecialPerTax, securityDeposite) => {
  //   var perDiscountValue = (perDiscount + corporatePerDiscount) ? ((bookingPrice * (perDiscount + corporatePerDiscount)) / 100) : 0;
  //   var priceAfterDicount = bookingPrice - perDiscountValue - flatDiscount - corporateFlatDiscount;

  //   //setTotalDiscount(perDiscountValue + flatDiscount);

  //   var perTaxValue = perTax > 0 ? ((priceAfterDicount * perTax) / 100) : 0;
  //   var perSpeciaTaxValue = SpecialPerTax > 0 ? ((priceAfterDicount * SpecialPerTax) / 100) : 0;

  //   var finalPrice = priceAfterDicount + perTaxValue + flatTax + specialFlatTax + perSpeciaTaxValue + securityDeposite;

  //   // setTotalTax(perTaxValue + flatTax)

  //   // setFinalPrice(finalPrice);
  //   return {
  //     totalDiscount: perDiscountValue + flatDiscount + corporateFlatDiscount,
  //     totalTax: perTaxValue + flatTax + specialFlatTax + perSpeciaTaxValue,
  //     finalPrice: finalPrice
  //   }
  // }

  // const calculatePrice = (bookingPrice, perDiscount, flatDiscount, perTax, flatTax, corporatePerDiscount, corporateFlatDiscount, specialFlatTax, SpecialPerTax, securityDeposite, total_nights) => {
  //   var corporateDiscountedPrice = bookingPrice - (corporatePerDiscount ? ((bookingPrice * corporatePerDiscount) / 100) : 0) - (corporateFlatDiscount ? corporateFlatDiscount : 0);
  //   var perDiscountValue = (perDiscount) > 0 ? ((corporateDiscountedPrice * (perDiscount)) / 100) : 0;
  //   var priceAfterDicount = corporateDiscountedPrice - perDiscountValue - flatDiscount;

  //   //setTotalDiscount(perDiscountValue + flatDiscount);

  //   var perTaxValue = perTax > 0 ? ((priceAfterDicount * perTax) / 100) : 0;
  //   var perSpeciaTaxValue = SpecialPerTax > 0 ? ((priceAfterDicount * SpecialPerTax) / 100) : 0;

  //   var finalPrice = priceAfterDicount + perTaxValue + flatTax + specialFlatTax + perSpeciaTaxValue + securityDeposite;

  //   // setTotalTax(perTaxValue + flatTax)

  //   // setFinalPrice(finalPrice);
  //   return {
  //     totalDiscount: perDiscountValue + flatDiscount,
  //     totalTax: perTaxValue + flatTax + specialFlatTax + perSpeciaTaxValue,
  //     finalPrice: finalPrice,
  //     per_night_price : corporateDiscountedPrice / total_nights,
  //     total_apartment_price : corporateDiscountedPrice
  //   }
  // }

  const backToBooking = () => {
    navigate(`${SetDynamicEndpoint(RoutePaths.BOOKING.MULTIBOOKING, [id])}`, { state: { paymentOption: paymentOption, isCreditChecked: isCreditChecked, isLsChecked: isLsChecked } });
    //else navigate(`${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [id])}`);
  }

  const handleCreditCheckboxChange = (e) => {
    setIsCreditChecked(e.target.checked);
  };

  const handleLsCheckboxChange = (e) => {
    setIsLsChecked(e.target.checked);
    //If Is credit checked then always set to payment full
    // if (e.target.checked) {
    //   setPaymentOption(1)
    // }
  };

  useEffect(() => {
    // Run countCalculation after the state updates
    countCalculation();
  }, [isCreditChecked, isLsChecked, bookingData]);

  const bookingSuccess = async (e) => {
    e.preventDefault();
    // var req_body = {
    //   apartment_id: bookingData?.apartment_id,
    //   property_id: bookingData?.property_id,
    //   start_date: dateFormat(bookingData?.start_date, DATE_FORMATS.YMD),
    //   end_date: dateFormat(bookingData?.end_date, DATE_FORMATS.YMD),
    //   customer_id: userDetails?.customer_id,
    //   customer: null,
    //   status: STATUS.REQUESTED,
    //   guests: 1,
    //   payment: paymentOption,
    //   currency_id: bookingData?.currency_id
    // };
    var req_body = {
      booking_cart_id: bookingData?.map((item) => { return item.booking_cart_id }),
      payment: paymentOption
    };
    dispatch(maskingActions.showMasking());
    await bookingService.confirm_booking_cart_items(req_body, currency_code).then((res) => {
      toast.success(t("toaster_message.add_success"));
      setBookingSuccess(true);
    })
      .catch((res) => {
        toast.error(res.message);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }


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
        apartment_id: bookingData?.apartment_id,
        property_id: bookingData?.property_id,
        // start_date: dateFormat(bookingData?.start_date, DATE_FORMATS.YMD),
        // end_date: dateFormat(bookingData?.end_date, DATE_FORMATS.YMD),
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
        booking_cart_id: bookingData?.map((item) => { return item.booking_cart_id }),
        is_credit_used: isCreditChecked ? true : false,
        is_loyalty_used: isLsChecked ? true : false
      };

      // var booking_req_body = {
      //   booking_cart_id: bookingData?.map((item) => { return item.booking_cart_id }),
      //   payment: paymentOption
      // };
      dispatch(maskingActions.showMasking());
      // await bookingService.confirm_booking_cart_items(req_body).then((res) => {
      //   toast.success(t("toaster_message.add_success"));
      //   setBookingSuccess(true);
      // })
      //   .catch((res) => {
      //     toast.error(res.message);
      //   })
      //   .finally(() => {
      //     dispatch(maskingActions.hideMasking());
      //   });

      try {
        const res = await bookingService.confirm_booking_cart_items(req_body, currency_code === "GBP" ? "USD" : currency_code);
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
    if (e.target.checked) {
      //Api call here
    } 
  };
  return (
    <div className="ha--BookingContaier">
       <div className="ha--MainContainerDesBooking">
       <div className="ha--BookingBackbtn">
          <div className="backBtn">
            {/* <NavLink to="/"> */}
            <button onClick={backToBooking}
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
              {/* <h5>{t("pages.booking.credit")}</h5> */}
            </div>
            <div className="payOption">

              {/* {bookingData[0]?.loyalty_points != 0 && bookingData[0]?.loyalty_points != null && bookingData[0]?.loyalty_points > 0 &&
                <div className="row mb-4">
                  <div className="col-lg-8 p-0">
                    <div class="form-check d-flex align-items-start gap-2 moreFilterLayout"
                      style={{
                        opacity: 0.5,
                        cursor: 'not-allowed'
                      }}>
                      <input
                        disabled={true}
                        class="form-check-input"
                        type="checkbox"
                        name="flexRadioDefaultLP"
                        id="flexRadioDefault1LP"
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
                        
                        <span className="payNote">
                          {t("pages.booking.remaining_loyalty_points")}
                          {bookingData[0]?.currency_code_display} {Number(remainingLP)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 p-0 d-flex justify-content-end">
                    <div className="priceOption">
                      <p>{bookingData[0]?.currency_code_display} {Number(bookingData[0]?.loyalty_points)}</p>
                    </div>
                  </div>
                </div>} */}

<div className="ha--PayoptionRadio">
<div className="ha--payOptionColumnRadio">
                  <div class="form-check d-flex align-items-start gap-2 moreFilterLayout"
                    // style={{
                    //   opacity: Number(bookingData[0]?.credit_limit) && Number(bookingData[0]?.credit_limit) > 0 ? 1 : 0.5,
                    //   cursor: Number(bookingData[0]?.credit_limit) && Number(bookingData[0]?.credit_limit) > 0 ? 'pointer' : 'not-allowed'
                    // }}
                    style={{
                      opacity: 0.5,
                      cursor: 'not-allowed'
                    }}
                  >
                    <input
                      disabled={true}
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
                      {/* {isCreditChecked ? <span className="payNote">
                        {t("pages.booking.remaining_credit_limit")}
                        {bookingData[0]?.currency_code_display} {finalPrice && validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) && finalPrice < Number(bookingData[0]?.credit_limit) ? (validationHelper.formatFloatValue(validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) - finalPrice)) : validationHelper.formatFloatValue(Number(0))}
                      </span> :
                        <span className="payNote">
                          {t("pages.booking.remaining_credit_limit")}
                          {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit))}
                        </span>
                      } */}

                      <span className="payNote">
                        {t("pages.booking.remaining_credit_limit")}
                        {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(Number(remainingCL))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ha--payOptionColumnPrice">
                  <div className="priceOption">
                    <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit))}</p>
                  </div>
                </div>
              </div>

              {/* {(isCreditChecked && isLsChecked && finalPrice <= (Number(bookingData[0]?.credit_limit)) + Number(bookingData[0]?.loyalty_points)) || (isCreditChecked && finalPrice <= Number(bookingData[0]?.credit_limit)) || (isLsChecked && finalPrice <= Number(bookingData[0]?.loyalty_points)) */}
              {(isCreditChecked && finalPrice <= (Number(bookingData[0]?.credit_limit)))
              
                ? <></> :
                <>

<hr className="ha--payOptionHr" />

                  <div className="ha--PayoptionRadio">
                  <div className="ha--payOptionColumnRadio">
                      <div class="form-check d-flex align-items-start gap-2">
                        <div>  <input
                          disabled={true}
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
                    <div className="ha--payOptionColumnPrice">
                      <div className="priceOption">
                        {/* {isCreditChecked ? <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - Number(bookingData[0]?.credit_limit))}</p> : <p>{bookingData[0]?.currency_code_display} {finalPrice}</p>} */}
                        {/* {(isCreditChecked && isLsChecked) ?
                          finalPrice <= (Number(bookingData[0]?.credit_limit)) + Number(bookingData[0]?.loyalty_points) ? <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(Number(0))}</p> : <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - (Number(bookingData[0]?.credit_limit) + Number(bookingData[0]?.loyalty_points)))}</p>
                          :
                          isCreditChecked ?
                            <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - Number(bookingData[0]?.credit_limit))}</p>
                            :
                            isLsChecked ? <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - Number(bookingData[0]?.loyalty_points))}</p>
                              : <p>{bookingData[0]?.currency_code_display} {finalPrice}</p>} */}

                        <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(payFullPrice)}</p>
                      </div>
                    </div>
                  </div>

                  {/* {!isCreditChecked && !isLsChecked && showPayPartOption && <div className="row"> */}
                  {/* {showPayPartOption && <div className="row">
                    <div className="col-lg-8 p-0">
                      <div class="form-check d-flex align-items-start gap-2">
                        <div><input
                          disabled={true}
                          class="form-check-input"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault1"
                          checked={paymentOption === 2 ? true : false}
                          onClick={() => { setPaymentOption(2) }}
                        /></div>
                        <div className="d-flex flex-column">
                          <label
                            class="form-check-label mb-1"
                            for="flexRadioDefault1"
                          >
                            {t("pages.booking.pay_half_later")}
                          </label>
                         
                           <span className="payNote">
                              {t("pages.booking.pay")} {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(payHalfPrice)} {t("pages.booking.now&rest")} ({bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(payHalfPrice)}) {t("pages.booking.will")}
                              {t("pages.booking.automatically_charged")} {t("pages.AccountSettings.booking.property_info.check_in")}. {t("pages.booking.no_extrafee")}
                            </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 p-0 d-flex justify-content-end">
                      <div className="priceOption">
                        <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(payHalfPrice)}</p>
                      </div>
                    </div>
                  </div>} */}

                </>}

              {/* {finalPrice && finalPrice > Number(bookingData[0]?.credit_limit) && <p style={{ color: 'red' }}>{t("pages.booking.booking_amt_limit")}</p>} */}

              <hr className="ha--payOptionHr" />

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

                {/* <div className="row paymentCardDetails">
                  <div className="col-lg-12 mb-4 p-0">
                    <div className="checkoutTitle ">
                      <h5>{t("pages.booking.multibooking_payment.billing_address")}</h5>
                    </div>
                  </div>
                  <div className="col-lg-12 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.street_address")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("pages.booking.multibooking_payment.ph_street_address")}
                      aria-label="First name"
                      name="first_name"
                    />
                  </div>
                  <div className="col-lg-12 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.apt/suite_number")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("pages.booking.multibooking_payment.ph_apartment_details")}
                      aria-label="First name"
                      name="first_name"
                    />
                  </div>
                  <div className="col-lg-12 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.city")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("pages.booking.multibooking_payment.ph_city")}
                      aria-label="First name"
                      name="first_name"
                    />
                  </div>
                  <div className="col-lg-6 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.state")}</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("pages.booking.multibooking_payment.ph_state")}
                      aria-label="First name"
                      name="first_name"
                    />
                  </div>
                  <div className="col-lg-6 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.zip_code")}</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder={t("pages.booking.multibooking_payment.ph_zipcode")}
                      aria-label="First name"
                      name="first_name"
                    />
                  </div>
                  <div className="col-lg-12 p-0">
                    <label className="form-label">{t("pages.booking.multibooking_payment.select_country")}</label>
                   
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t("pages.booking.multibooking_payment.ph_country")}
                      aria-label="Country"
                      name="country"
                    />
                  </div>
                </div> */}

<div className="ha--CheckOutFormBooking checkoutForm ">
                  
                    <div className="checkoutTitle ">
                      <h5>{t("pages.booking.multibooking_payment.billing_address")}</h5>
                    </div>
                    <div className="ha--CheckOutFormBookingRow">
                  <div className="ha--bookingFormColumn">
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
                  <div className="ha--bookingFormColumn">
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
                  <div className="ha--bookingFormColumn">
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
                  <div className="ha--bookingFormColumn">
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
                  <div className="ha--bookingFormColumn">
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
                  <div className="ha--bookingFormColumn paymentSlctCountry">
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
                      value={formData.country ? countryDropdown?.find(f => f.value === formData.country):
                        countryDropdown?.find(f => f.label === DefaultCountry.UAE)}
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
                <hr className="mt-5 mb-5" />
                <div className="cancelaationPolicy">
                 
                   
                      <div className="checkoutTitle ">
                        <h5>{t("pages.booking.multibooking_payment.cancellation_policy")}</h5>
                      </div>

                      <div className="cnacelationNote">
                        {/* <p>{t("pages.booking.multibooking_payment.free_cancellation")}.</p> */}
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

          {/* <ApartmentPreview apartmentPreviewData={apartmentPreviewData} /> */}

          {bookingData?.map((item, index) => {
            //return <PriceDetails key={index} isCustomer={true} apartment_name={item?.apartment_name} priceData={item.price_details} finalPrice={parseFloat(item.finalPrice)?.toFixed(2)} totalTax={item.totalTax} totalDiscount={item.totalDiscount} currency={item?.currency_code_display} date={item?.end_date} />
            //return <PriceDetails key={index} isCustomer={true} apartment_name={item?.apartment_name} priceData={item.price_details} bookingData={item} finalPrice={parseFloat(item.finalPrice)?.toFixed(2)} totalTax={item.totalTax} totalDiscount={item.totalDiscount} currency={item?.currency_code_display} date={item?.start_date} />
            return <PriceDetails key={index} isCustomer={true} apartment_name={item?.apartment_name} priceData={item.price_details} bookingData={item} currency={item?.currency_code_display} date={dateFormat(item?.start_date, DATE_FORMATS.MDY)} paymentOption={paymentOption} 
            showGuestsDetails={true}                   
            bookingDataList={bookingData}
                  booking_index={index}
                  setBookingData={setBookingData}
            />
          })}
          {bookingData && bookingData.length > 0 ? <div className="checkoutCard mb-4">
            <div className="pricingDetails">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6>{t("pages.booking.sub_total")}</h6>
                <p>
                  {paymentOption == 2 ? <strong> {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue((finalPrice / 2))}</strong> : <strong> {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice)}</strong>}
                </p>
              </div>

              {isLsChecked && <div className="d-flex align-items-center justify-content-between mb-3">
                <h6>{t("pages.booking.used_loyalty_points")}</h6>
                <p>
                  {/* {bookingData[0]?.currency_code_display} {finalPrice && Number(bookingData[0]?.loyalty_points) && finalPrice < Number(bookingData[0]?.loyalty_points) ? (validationHelper.formatFloatValue(Number(bookingData[0]?.loyalty_points) - finalPrice)) : (Number(bookingData[0]?.loyalty_points))} */}
                  {bookingData[0]?.currency_code_display} {usedLP}
                </p>
              </div>}

              {isCreditChecked && <div className="d-flex align-items-center justify-content-between mb-3">
                <h6>{t("pages.booking.used_credit")}</h6>
                {/* {isCreditChecked && isLsChecked ?
                  <p>
                    {bookingData[0]?.currency_code_display} {finalPrice && validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) && (Number(bookingData[0]?.loyalty_points) + Number(bookingData[0]?.credit_limit) > finalPrice) ? (validationHelper.formatFloatValue(validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit) - ((Number(bookingData[0]?.loyalty_points) + Number(bookingData[0]?.credit_limit)) - finalPrice)))) : validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit))}
                  </p> :

                  isCreditChecked ?
                    <p>
                      {bookingData[0]?.currency_code_display} {finalPrice && validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) && finalPrice < Number(bookingData[0]?.credit_limit) ? (validationHelper.formatFloatValue(validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) - finalPrice)) : validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit))}
                    </p> :

                    <p>
                      {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit))}
                    </p>
                } */}

                <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(usedCL)}</p>
              </div>}

              {(isLsChecked || isCreditChecked) && <div className="d-flex align-items-center justify-content-between mb-3">
                <h6>{t("pages.booking.total")}</h6>
                {/* <p>
                  {paymentOption == 2 ? <strong> {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue((finalPrice / 2))}</strong>

                    : (isCreditChecked && isLsChecked && finalPrice <= (Number(bookingData[0]?.credit_limit)) + Number(bookingData[0]?.loyalty_points)) || (isCreditChecked && finalPrice <= Number(bookingData[0]?.credit_limit)) || (isLsChecked && finalPrice <= Number(bookingData[0]?.loyalty_points)) ? <strong> {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(Number(0))}</strong>

                      :
                      (isCreditChecked && isLsChecked) ?
                        finalPrice <= (Number(bookingData[0]?.credit_limit)) + Number(bookingData[0]?.loyalty_points) ? <strong>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(Number(0))}</strong> : <strong>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - (Number(bookingData[0]?.credit_limit) + Number(bookingData[0]?.loyalty_points)))}</strong>
                        :
                        isCreditChecked ?
                          <strong>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - Number(bookingData[0]?.credit_limit))}</strong>
                          :
                          isLsChecked ? <strong>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - Number(bookingData[0]?.loyalty_points))}</strong>
                            : <strong>{bookingData[0]?.currency_code_display} {finalPrice}</strong>}
                </p> */}
                <p>{bookingData[0]?.currency_code_display} {paymentOption == 1 ? validationHelper.formatFloatValue(payFullPrice) : validationHelper.formatFloatValue(payHalfPrice) }</p>
              </div>}


              {/* {isCreditChecked && <div className="d-flex align-items-center justify-content-between mb-3">
                <h6>{t("pages.booking.remaining_credit")}</h6>
                <p>
                  {bookingData[0]?.currency_code_display} {finalPrice && validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) && finalPrice < Number(bookingData[0]?.credit_limit) ? (validationHelper.formatFloatValue(validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) - finalPrice)) : validationHelper.formatFloatValue(Number(0))}
                </p>
              </div>} */}

              <span className="hiddenfeesNote">
                {t("pages.booking.price_details.charged")}
              </span>
            </div>
          </div> : null}
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

    </div >
  );
};

export default MultiBookingPayment;
