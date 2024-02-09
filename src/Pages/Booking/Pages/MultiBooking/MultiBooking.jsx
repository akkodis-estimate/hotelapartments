import "Pages/Booking/Pages/MultiBooking/MultiBooking.css";
import { BsChevronLeft } from "react-icons/bs";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import { SetDynamicEndpoint, dateFormat } from "Helpers/commonMethodHelper";
import { DATE_FORMATS, RoutePaths } from "Constants/Constants";
import PriceDetails from "Pages/Booking/Components/PriceDetails/priceDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import maskingActions from "reducers/masking/masking.actions";
import bookingService from "Services/bookingService";
import { useTranslation } from "react-i18next";
import validationHelper from "Helpers/validationHelper";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import { ScrollArea } from "@mantine/core";
import TermsAndConditions from "Pages/Policy/TermsAndConditions/TermsAndConditions";

const MultiBooking = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { userDetails } = useSelector((state) => state.customerAuth);
  const dispatch = useDispatch(); // For calling Reducers

  //To get Start Date and End Date
  const location = useLocation();

  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [isCreditChecked, setIsCreditChecked] = useState(
    location?.state?.isCreditChecked ? location?.state?.isCreditChecked : false
  );
  const [bookingData, setBookingData] = useState([]);
  const [apartmentPreviewData, setApartmentPreviewData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [similarApartments, setSimilarApartments] = useState([]);
  const [finalPrice, setFinalPrice] = useState();
  const [totalTax, setTotalTax] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const { language, currency_code } = useSelector((state) => state.language);

  const [paymentOption, setPaymentOption] = useState(
    location?.state?.paymentOption ? location.state?.paymentOption : 1
  );

  const [isLsChecked, setIsLsChecked] = useState(
    location?.state?.isLsChecked ? location.state?.isLsChecked : false
  );

  const [showPayPartOption, setShowPayPartOption] = useState(true);

  const [defaultCL, setDefaultCL] = useState(0.0);
  const [defaultLP, setDefaultLP] = useState(0);

  const [remainingCL, setRemainingCL] = useState(0.0);
  const [remainingLP, setRemainingLP] = useState(0);

  const [usedCL, setUsedCL] = useState(0.0);
  const [usedLP, setUsedLP] = useState(0);

  const [payFullPrice, setPayFullPrice] = useState(0);
  const [payHalfPrice, setPayHalfPrice] = useState(0);

  const [TandCModal, setTandCModal] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleCreditCheckboxChange = (e) => {
    setIsCreditChecked(e.target.checked);
    //If Is credit checked then always set to payment full
    // if (e.target.checked) {
    //   setPaymentOption(1)
    // }
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

  useEffect(() => {
    //userDetails?.customer_id
    // if (location && location.state && location.state.start_date && location.state.end_date) {
    //   dispatch(maskingActions.showMasking());
    //   bookingService
    //     .getBookingDetails(id, { start_date: location.state.start_date, end_date: location.state.end_date })
    //     .then((res) => {
    //       setBookingData(res.data);
    //     //   setSimilarApartments(res.data?.similar_apartments);
    //     //   setApartmentPreviewData(res.data?.apartment_preview);
    //       setPriceData(res.data?.price_details);
    //       calculatePrice(res.data?.booking_price, res.data?.percentage_discount, res.data?.flat_discount, res?.data?.percentage_tax, res?.data?.flat_tax);
    //     })
    //     .finally(() => {
    //       dispatch(maskingActions.hideMasking());
    //     });
    // }
    dispatch(maskingActions.showMasking());
    bookingService
      .get_booking_detail_by_customer_id({
        customer_id: userDetails?.customer_id,
      })
      .then((res) => {
        var data = res.data?.map((item) => {
          //var calculatedPrice = calculatePrice(item.total_apartment_price, item.percentage_discount, item.flat_discount, item.percentage_tax, item.flat_tax, item.corporate_percentage_discount, item.corporate_flat_discount, item.special_apartment_tax_flat, item.special_apartment_tax_percentage, item.security_deposite, item.total_nights);
          return {
            ...item,
            // totalDiscount: parseFloat(calculatedPrice.totalDiscount)?.toFixed(2),
            // totalTax: parseFloat(calculatedPrice.totalTax)?.toFixed(2),
            // finalPrice: calculatedPrice.finalPrice,
            // per_night_price : calculatedPrice.per_night_price,
            // total_apartment_price : calculatedPrice.total_apartment_price
          };
        });
        const SubTotal = data?.reduce((accumulator, object) => {
          return accumulator + object?.price_details?.final_price;
        }, 0);
        setRemainingCL(data[0]?.credit_limit);
        setRemainingLP(data[0]?.loyalty_points);

        setDefaultCL(data[0]?.credit_limit);
        setDefaultLP(data[0]?.loyalty_points);
        const payPartOption = res.data?.every(
          (item) =>
            Math.floor(
              (new Date(item.start_date) - new Date()) / (1000 * 60 * 60 * 24)
            ) > 1
        );
        setShowPayPartOption(payPartOption);
        
        setBookingData(data);
        //setFinalPrice(validationHelper.formatFloatValue(SubTotal));
        setFinalPrice(SubTotal);

        setPayFullPrice(SubTotal);
        setPayHalfPrice(SubTotal / 2);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [language, currency_code]);

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

  const backToCart = () => {
    navigate(`${SetDynamicEndpoint(RoutePaths.BOOKING.BOOKING_LIST)}`);
  };

  const onSave = (e) => {
    e.preventDefault();
    navigate(
      `${SetDynamicEndpoint(RoutePaths.BOOKING.MULTIBOOKING_PAYMENT, [id])}`,
      {
        state: {
          paymentOption: paymentOption,
          isCreditChecked: isCreditChecked,
          isLsChecked: isLsChecked,
        },
      }
    );
  };

  const onAparmentDetails = (apartment_sid) => {
    navigate(
      `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [
        apartment_sid,
      ])}`,
      { state: { apartment_sid: apartment_sid } }
    );
  };

  const countCalculation = () => {
    //debugger
    if (isLsChecked) {
      if (Number(defaultLP) > Number(finalPrice)) {
        setRemainingLP(Math.round(Number(defaultLP) - Number(finalPrice)));
        setUsedLP(Math.round(Number(finalPrice)));
        setUsedCL(Number(0.0));
        setRemainingCL(Number(defaultCL));
        setPayFullPrice(Number(0.0));
        setPayHalfPrice(Number(0.0));
        setPaymentOption(1);
      } else {
        setRemainingLP(Number(0));
        setUsedLP(Number(defaultLP));
        if (
          isCreditChecked &&
          Number(defaultCL) > Number(finalPrice) - Number(defaultLP)
        ) {
          setRemainingCL(
            Number(defaultCL) - (Number(finalPrice) - Number(defaultLP))
          );
          setUsedCL(Number(finalPrice) - Number(defaultLP));
          setPayFullPrice(Number(finalPrice) - Number(defaultLP));
          setPayHalfPrice((Number(finalPrice) - Number(defaultLP)) / 2);
        } else if (isCreditChecked) {
          setUsedCL(Number(defaultCL));
          setRemainingCL(Number(0.0));
          setPayFullPrice(
            Number(finalPrice) - Number(defaultLP) - Number(defaultCL)
          );
          setPayHalfPrice(
            (Number(finalPrice) - Number(defaultLP) - Number(defaultCL)) / 2
          );
        } else {
          setUsedCL(Number(0.0));
          setRemainingCL(Number(defaultCL));
          setPayFullPrice(Number(finalPrice) - Number(defaultLP));
          setPayHalfPrice((Number(finalPrice) - Number(defaultLP)) / 2);
        }
      }
    } else if (isCreditChecked) {
      setRemainingLP(Number(defaultLP));
      setUsedLP(0);
      if (Number(defaultCL) > Number(finalPrice)) {
        setRemainingCL(Number(defaultCL) - Number(finalPrice));
        setUsedCL(Number(finalPrice));
        setPayFullPrice(Number(0.0));
        setPayHalfPrice(Number(0.0));
        setPaymentOption(1);
      } else {
        setUsedCL(Number(defaultCL));
        setRemainingCL(Number(0));
        setPayFullPrice(Number(finalPrice) - Number(defaultCL));
        setPayHalfPrice((Number(finalPrice) - Number(defaultCL)) / 2);
      }
    } else {
      setRemainingCL(Number(defaultCL));
      setRemainingLP(Number(defaultLP));
      setUsedCL(Number(0.0));
      setUsedLP(Number(0));
      setPayFullPrice(Number(finalPrice));
      setPayHalfPrice(Number(finalPrice / 2));
    }
  };

  return (
    <>
      <div className="ha--BookingContaier">
        <div className="ha--MainContainerDesBooking">
          <div className="ha--BookingBackbtn">
            <div className="backBtn">
              {/* <NavLink to="/"> */}
              <button
                onClick={backToCart}
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
                    <div class="form-check d-flex align-items-start gap-2 moreFilterLayout">
                      <input
                        //disabled=
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
                    <div
                      class="form-check d-flex align-items-start gap-2 moreFilterLayout"
                      style={{
                        opacity:
                          Number(bookingData[0]?.credit_limit) &&
                          Number(bookingData[0]?.credit_limit) > 0
                            ? 1
                            : 0.5,
                        cursor:
                          Number(bookingData[0]?.credit_limit) &&
                          Number(bookingData[0]?.credit_limit) > 0
                            ? "pointer"
                            : "not-allowed",
                      }}
                    >
                      <input
                        disabled={
                          !Number(bookingData[0]?.credit_limit) ||
                          Number(bookingData[0]?.credit_limit) <= 0
                        }
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

                        {/* {isCreditChecked && isLsChecked ?
                        <span className="payNote">
                          {t("pages.booking.remaining_credit_limit")}
                          {bookingData[0]?.currency_code_display} {finalPrice && validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) && (Number(bookingData[0]?.loyalty_points) + Number(bookingData[0]?.credit_limit) > finalPrice) ? validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) : finalPrice && validationHelper.formatFloatValue(Number(bookingData[0]?.credit_limit)) && (Number(bookingData[0]?.loyalty_points) + Number(bookingData[0]?.credit_limit) > finalPrice) ? (validationHelper.formatFloatValue(validationHelper.formatFloatValue((Number(bookingData[0]?.loyalty_points) + Number(bookingData[0]?.credit_limit)) - finalPrice))) : validationHelper.formatFloatValue(Number(0))}
                        </span> :

                        isCreditChecked ?
                          <span className="payNote">
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
                          {bookingData[0]?.currency_code_display}{" "}
                          {validationHelper.formatFloatValue(
                            Number(remainingCL)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="ha--payOptionColumnPrice">
                    <div className="priceOption">
                      {/* <p>{bookingData[0]?.currency_code_display} {finalPrice}</p> */}
                      <p>
                        {bookingData[0]?.currency_code_display}{" "}
                        {validationHelper.formatFloatValue(
                          Number(bookingData[0]?.credit_limit)
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* {(isCreditChecked && isLsChecked && finalPrice <= (Number(bookingData[0]?.credit_limit)) + Number(bookingData[0]?.loyalty_points)) || (isCreditChecked && finalPrice <= Number(bookingData[0]?.credit_limit)) || (isLsChecked && finalPrice <= Number(bookingData[0]?.loyalty_points)) */}
                {isCreditChecked &&
                finalPrice <= Number(bookingData[0]?.credit_limit) ? (
                  <></>
                ) : (
                  <>
                    <hr className="ha--payOptionHr" />

                    <div className="ha--PayoptionRadio">
                      <div className="ha--payOptionColumnRadio">
                        <div class="form-check d-flex align-items-start gap-2">
                          <div>
                            <input
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
                      <div className="ha--payOptionColumnPrice">
                        <div className="priceOption">
                          {/* {(isCreditChecked && isLsChecked) ?
                          finalPrice <= (Number(bookingData[0]?.credit_limit)) + Number(bookingData[0]?.loyalty_points) ? <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(Number(0))}</p> : <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - (Number(bookingData[0]?.credit_limit) + Number(bookingData[0]?.loyalty_points)))}</p>
                          :
                          isCreditChecked ?
                            <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - Number(bookingData[0]?.credit_limit))}</p>
                            :
                            isLsChecked ? <p>{bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice - Number(bookingData[0]?.loyalty_points))}</p>
                              : <p>{bookingData[0]?.currency_code_display} {finalPrice}</p>} */}

                          {/* <p>{bookingData[0]?.daily_price_currency_code} {finalPrice}</p> */}

                          <p>
                            {bookingData[0]?.currency_code_display}{" "}
                            {validationHelper.formatFloatValue(payFullPrice)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* {!isCreditChecked && !isLsChecked && showPayPartOption && <div className="row"> */}
                    {/* {showPayPartOption 
                  &&
                    <div className="row">
                      <div className="col-lg-8 p-0">
                        <div class="form-check d-flex align-items-start gap-2">
                          <div><input
                            class="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault"
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
                  </>
                )}

                {/* {finalPrice && finalPrice > Number(bookingData[0]?.credit_limit) && <p style={{ color: 'red' }}> {t("pages.booking.booking_amt_limit")}</p>} */}
                <hr className="ha--payOptionHr" />

                <div className="ha--CheckOutFormBooking checkoutForm ">
                  <div className="checkoutTitle">
                    <h5>{t("pages.booking.your_details")}</h5>
                  </div>
                  <div className="ha--CheckOutFormBookingRow">
                    <div className="ha--bookingFormColumn">
                      <label className="form-label">
                        {t("pages.add.lbl_phone_no")}
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        className="form-control"
                        placeholder="Phone Number"
                        aria-label="Phone Number"
                        name="phone_number"
                        value={userDetails?.phone_number}
                      />
                    </div>
                    <div className="ha--bookingFormColumn">
                      <label className="form-label">
                        {t("pages.add.lbl_email")}
                      </label>
                      <input
                        disabled={true}
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        aria-label="Email"
                        name="email"
                        value={userDetails?.email_address}
                      />
                    </div>
                    <div className="ha--bookingFormColumn">
                      <label className="form-label">
                        {t("pages.add.lbl_firstname")}
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        className="form-control"
                        placeholder="First Name"
                        aria-label="First name"
                        name="first_name"
                        value={userDetails?.first_name}
                      />
                    </div>
                    <div className="ha--bookingFormColumn">
                      <label className="form-label">
                        {t("pages.add.lbl_lastname")}
                      </label>
                      <input
                        disabled={true}
                        type="text"
                        className="form-control"
                        placeholder="Last Name"
                        aria-label="Last name"
                        name="last_name"
                        value={userDetails?.last_name}
                      />
                    </div>

                    <div className="moreFilterLayout">
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
                          {t("pages.booking.agree")}
                          <span
                            className=""
                            onClick={() => {
                              setTandCModal(true);
                            }}
                          >
                            {" "}
                            {t("pages.booking.t&c")}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="ha--bookingFormBtn">
                      <div className="actionBtn">
                        {/* <button
                      type="submit"
                      className={`AuthBtn disableButton${!isChecked || !isCreditChecked || (finalPrice > Number(bookingData[0]?.credit_limit)) ? " disabled" : ""}`}
                      disabled={!isChecked || !isCreditChecked || (finalPrice > Number(bookingData[0]?.credit_limit))}
                      onClick={(e) => { onSave(e) }}
                    >
                      {t("pages.booking.save_continue")}
                    </button> */}

                        <button
                          type="submit"
                          className={`AuthBtn disableButton${
                            !isChecked ? " disabled" : ""
                          }`}
                          disabled={!isChecked}
                          onClick={(e) => {
                            onSave(e);
                          }}
                        >
                          {t("pages.booking.save_continue")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ha--bookingsMainSecColTwo">
            {/* <ApartmentPreview apartmentPreviewData={apartmentPreviewData} /> */}

            {bookingData?.map((item, index) => {
              return (
                <PriceDetails
                  key={index}
                  booking_index={index}
                  isCustomer={true}
                  apartment_name={item?.apartment_name}
                  priceData={item.price_details}
                  bookingData={item}
                  currency={item?.currency_code_display}
                  date={dateFormat(item?.start_date, DATE_FORMATS.MDY)}
                  paymentOption={paymentOption}
                  showGuestsDetails={true}
                  bookingDataList={bookingData}
                  setBookingData={setBookingData}
                />
              );
            })}
            {bookingData && bookingData.length > 0 ? (
              <div className="checkoutCard mb-4">
                <div className="pricingDetails tt">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6>{t("pages.booking.sub_total")}</h6>
                    <p>
                      {paymentOption == 2 ? (
                        <strong>
                          {" "}
                          {bookingData[0]?.currency_code_display}{" "}
                          {validationHelper.formatFloatValue(finalPrice / 2)}
                        </strong>
                      ) : (
                        <strong>
                          {" "}
                          {bookingData[0]?.currency_code_display} {validationHelper.formatFloatValue(finalPrice)}
                        </strong>
                      )}
                    </p>
                  </div>

                  {isLsChecked && (
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6>{t("pages.booking.used_loyalty_points")}</h6>
                      <p>
                        {/* {bookingData[0]?.currency_code_display} {finalPrice && Number(bookingData[0]?.loyalty_points) && finalPrice < Number(bookingData[0]?.loyalty_points) ? (validationHelper.formatFloatValue(Number(bookingData[0]?.loyalty_points) - finalPrice)) : (Number(bookingData[0]?.loyalty_points))} */}
                        {bookingData[0]?.currency_code_display} {usedLP}
                      </p>
                    </div>
                  )}

                  {isCreditChecked && (
                    <div className="d-flex align-items-center justify-content-between mb-3">
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

                      <p>
                        {bookingData[0]?.currency_code_display}{" "}
                        {validationHelper.formatFloatValue(usedCL)}
                      </p>
                    </div>
                  )}

                  {(isLsChecked || isCreditChecked) && (
                    <div className="d-flex align-items-center justify-content-between mb-3">
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

                      <p>
                      {bookingData[0]?.currency_code_display}{" "}
                        {paymentOption == 1
                          ? validationHelper.formatFloatValue(payFullPrice)
                          : validationHelper.formatFloatValue(payHalfPrice)}
                      </p>
                    </div>
                  )}

                  <span className="hiddenfeesNote">
                    {t("pages.booking.price_details.charged")}
                  </span>
                </div>
              </div>
            ) : null}
            {/* <div className="checkoutCard">
            <div className="COTitle mb-4">
              <h6>More like Apartment VII</h6>
            </div>

            {similarApartments && similarApartments.length > 0 && similarApartments.map((item, index) => {
              return (
              <div className="properiesDetailSum d-flex align-items-center gap-3 mb-4 cursor-pointer" onClick={() => {onAparmentDetails(item?.apartment_sid)}}>
                <img src={item?.image_url ? item?.image_url : AppartmentImg} alt="ApartmentImage" />
                <div className="properiesDetailSumContent">
                  <p>{item?.apartment_title}</p>
                  <span>
                    {item?.description}
                  </span>
                </div>
              </div>
              )
            })}

          </div> */}
          </div>
        </div>
        </div>
        
      </div>

      <ModalPopup
        show={TandCModal}
        dialogClassName="applicationModal termsAndConditionsModal"
      >
        <div className="modal-header border-0 p-0 mb-4">
          <div className="pageTitle">
            <h2>Terms & Conditions</h2>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setTandCModal(false);
            }}
          ></button>
        </div>
        <ScrollArea h={700}>
          <TermsAndConditions />
        </ScrollArea>
      </ModalPopup>
    </>
  );
};

export default MultiBooking;
