import "Pages/Booking/Pages/Booking/Bookings/Bookings.css";
import { BsChevronLeft } from "react-icons/bs";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import AppartImg from "Assets/Images/HomeIcons/AppartMentImages/Jumeriah.png";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import {
  SetDynamicEndpoint,
  dateFormat,
  truncateText,
} from "Helpers/commonMethodHelper";
import { DATE_FORMATS, RoutePaths } from "Constants/Constants";
import ApartmentPreview from "Pages/Booking/Components/ApartmentPreview/apartmentPreview";
import PriceDetails from "Pages/Booking/Components/PriceDetails/priceDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import maskingActions from "reducers/masking/masking.actions";
import bookingService from "Services/bookingService";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import { useTranslation } from "react-i18next";
import validationHelper from "Helpers/validationHelper";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import { ScrollArea } from "@mantine/core";
import TermsAndConditions from "Pages/Policy/TermsAndConditions/TermsAndConditions";

const Bookings = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { userDetails } = useSelector((state) => state.customerAuth);
  const dispatch = useDispatch(); // For calling Reducers

  //To get Start Date and End Date
  const location = useLocation();

  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [bookingData, setBookingData] = useState(null);
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

  const [payFullPrice, setPayFullPrice] = useState(0);
  const [payHalfPrice, setPayHalfPrice] = useState(0);
  const [defaultLP, setDefaultLP] = useState(0);
  const [remainingLP, setRemainingLP] = useState(0);
  const [usedLP, setUsedLP] = useState(0);

  const [TandCModal, setTandCModal] = useState(false);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

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
          setSimilarApartments(res.data?.similar_apartments);
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

  // const calculatePrice = (bookingPrice, perDiscount, flatDiscount, perTax, flatTax, specialFlatTax, SpecialPerTax, securityDeposite) => {
  //   var perDiscountValue = perDiscount > 0 ? ((bookingPrice * perDiscount) / 100) : 0;
  //   var priceAfterDicount = bookingPrice - perDiscountValue - flatDiscount;

  //   setTotalDiscount(perDiscountValue + flatDiscount);

  //   var perTaxValue = perTax > 0 ? ((priceAfterDicount * perTax) / 100) : 0;
  //   var perSpeciaTaxValue = SpecialPerTax > 0 ? ((priceAfterDicount * SpecialPerTax) / 100) : 0;

  //   var finalPrice = priceAfterDicount + perTaxValue + flatTax + specialFlatTax + perSpeciaTaxValue + securityDeposite;

  //   setTotalTax(perTaxValue + flatTax + specialFlatTax + perSpeciaTaxValue)

  //   setFinalPrice(finalPrice);
  // }

  const backToApartment = () => {
    if (id)
      navigate(
        `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [id])}${location.search}`,
        { state: { id: id } }
      );
      //navigate(-1);
    else
      navigate(
        `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [id])}`
      );
  };

  const onSave = (e) => {
    e.preventDefault();
    if (id)
      navigate(`${SetDynamicEndpoint(RoutePaths.BOOKING.PAYMENT, [id])}`, {
        state: {
          start_date: bookingData?.start_date,
          end_date: bookingData?.end_date,
          paymentOption: paymentOption,
          quotationSID: location?.state?.quotationSID,
          isLsChecked: isLsChecked,
        },
      });
  };

  const onAparmentDetails = (apartment_sid) => {
    navigate(
      `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [
        apartment_sid,
      ])}`,
      { state: { apartment_sid: apartment_sid } }
    );
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

  return (
    <>
      <div className="ha--BookingContaier">
        <div className="ha--MainContainerDesBooking">
          <div className="ha--BookingBackbtn">
            <div className="backBtn">
              {/* <NavLink to="/"> */}
              <button
                onClick={backToApartment}
                type="button"
                className="bg-transparent border-0 d-flex align-items-center p-0"
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
                        <div className="ha--PayoptionRadio">
                          <div className="ha--payOptionColumnRadio">
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
                              {" "}
                              <input
                                class="form-check-input"
                                type="radio"
                                name="flexRadioDefault1"
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
                              {/* {isLsChecked ? <p>{bookingData?.currency_code_display} {priceData?.final_price && Number(bookingData?.loyalty_points) && priceData?.final_price < Number(bookingData?.loyalty_points) ? (validationHelper.formatFloatValue(Number(bookingData?.loyalty_points) - priceData?.final_price)) : (validationHelper.formatFloatValue(priceData?.final_price - validationHelper.formatFloatValue(Number(bookingData?.loyalty_points))))}</p>
                          : <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price)}</p>} */}
                              <p>
                                {bookingData?.currency_code_display}{" "}
                                {validationHelper.formatFloatValue(
                                  payFullPrice
                                )}
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
                                {" "}
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault1"
                                  id="flexRadioDefault2"
                                  checked={paymentOption === 2 ? true : false}
                                  onClick={() => {
                                    setPaymentOption(2);
                                  }}
                                />
                              </div>
                              <div className="d-flex flex-column">
                                <label
                                  class="form-check-label mb-1"
                                  for="flexRadioDefault2"
                                >
                                  {t("pages.booking.pay_half_later")}
                                </label>
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
                          {priceData && (
                            <div className="ha--payOptionColumnPrice">
                              <div className="priceOption">
                                {/* {isLsChecked ? <p>{bookingData?.currency_code_display} {priceData?.final_price && Number(bookingData?.loyalty_points) && (Number(Number(priceData?.final_price) / 2) < Number(bookingData?.loyalty_points)) ? (validationHelper.formatFloatValue((Number(bookingData?.loyalty_points) - priceData?.final_price)) / 2) : (validationHelper.formatFloatValue(((Number(priceData?.final_price) / 2) - validationHelper.formatFloatValue(Number(bookingData?.loyalty_points))) / 2))} </p> :
                            <p>{bookingData?.currency_code_display} {validationHelper.formatFloatValue(priceData?.final_price / 2)}</p>} */}
                                <p>
                                  {bookingData?.currency_code_display}{" "}
                                  {validationHelper.formatFloatValue(
                                    payHalfPrice
                                  )}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <hr className="ha--payOptionHr" />
                    </>
                  )}

                  <div className="ha--CheckOutFormBooking checkoutForm ">
                   
                      <div className="checkoutTitleDetail">
                        <h5>{t("pages.booking.your_details")}</h5>
                      </div>
                   <div className="ha--CheckOutFormBookingRow">
                    <div className="ha--bookingFormColumn">
                      <label className="form-label">
                        {t("pages.AccountSettings.personal_info.phone_number")}
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
                        {t("pages.AccountSettings.personal_info.email")}
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

              <div className="checkoutCard">
                <div className="COTitle mb-4">
                  <h6
                    className="similarAPT"
                    title={
                      t("pages.booking.more_apartments") +
                      " " +
                      apartmentPreviewData?.title
                    }
                  >
                    {t("pages.booking.more_apartments")}{" "}
                    {apartmentPreviewData?.title}
                  </h6>
                </div>

                {/* <div className="properiesDetailSum d-flex align-items-center gap-3 mb-4">
              <img src={AppartImg} alt="SummaryImage" />
              <div className="properiesDetailSumContent">
                <p>Apartment VII Full Marina View</p>
                <span>
                  Discover the best of Dubai DXB, with this one bedroom JVC
                  apartment
                </span>
              </div>
            </div>

            <div className="properiesDetailSum d-flex align-items-center gap-3 mb-4">
              <img src={AppartImg} alt="SummaryImage" />
              <div className="properiesDetailSumContent">
                <p>Apartment VII Full Marina View</p>
                <span>
                  Discover the best of Dubai DXB, with this one bedroom JVC
                  apartment
                </span>
              </div>
            </div>

            <div className="properiesDetailSum d-flex align-items-center gap-3 mb-4">
              <img src={AppartImg} alt="SummaryImage" />
              <div className="properiesDetailSumContent">
                <p>Apartment VII Full Marina View</p>
                <span>
                  Discover the best of Dubai DXB, with this one bedroom JVC
                  apartment
                </span>
              </div>
            </div> */}

                {similarApartments &&
                  similarApartments.length > 0 &&
                  similarApartments.map((item, index) => {
                    return (
                      <div
                        className="properiesDetailSum d-flex align-items-center gap-3 mb-4 cursor-pointer"
                        onClick={() => {
                          onAparmentDetails(item?.apartment_sid);
                        }}
                      >
                        <div className="previewImgContainer">
                          <img
                            src={
                              item?.image_url
                                ? item?.image_url?.replace(
                                    /\/([^/]+)$/,
                                    "/thumb_$1"
                                  )
                                : AppartmentImg
                            }
                            onError={(event) => {
                              event.target.src =
                                item?.image_url || AppartmentImg;
                            }}
                            alt="ApartmentImage"
                          />
                        </div>
                        <div className="properiesDetailSumContent">
                          <p>{item?.apartment_title}</p>
                          <span title={item?.description}>
                            {/* {item?.description} */}
                            {item?.description?.length <= 40
                              ? item?.description
                              : truncateText(item?.description, 40)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
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
            <h2>{t("pages.footer.links.terms_&_conditions")}</h2>
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

export default Bookings;
