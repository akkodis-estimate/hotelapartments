import { useState } from "react";
import {
  SetDynamicEndpoint,
  dateFormat,
  truncateText,
} from "Helpers/commonMethodHelper";
import { DATE_FORMATS, RoutePaths } from "Constants/Constants";
import { BsStarFill, BsTrash } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { MdLocalOffer } from "react-icons/md";
import { RiMapPinFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import FUserIcon from "Assets/Images/FeaturedPropertiesIcons/FUserIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import FShower from "Assets/Images/FeaturedPropertiesIcons/FShower";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import validationHelper from "Helpers/validationHelper";
import "Pages/Properties/FeaturedProperties/Components/PropertiesCard/propertiescard.css";

const PropertiesCard = (props) => {
  // const navigate = useNavigate();
  const { t } = useTranslation();

  // const [hovered, setHovered] = useState(false);
  // const toggleHover = () => setHovered(!hovered);

  // const [hoveredOne, setHoveredOne] = useState(false);
  // const toggleHoverOne = () => setHoveredOne(!hoveredOne);

  // const [hoveredTwo, setHoveredTwo] = useState(false);
  // const toggleHoverTwo = () => setHoveredTwo(!hoveredTwo);

  // const [hoveredThree, setHoveredThree] = useState(false);
  // const toggleHoverThree = () => setHoveredThree(!hoveredThree);

  // const [hoveredFour, setHoveredFour] = useState(false);
  // const toggleHoverFour = () => setHoveredFour(!hoveredFour);

  const [hoveredImages, setHoveredImages] = useState([]);

  const navigatePropertyDetail = (sid) => {
    //navigate('/properties/properties-detail');
    //if (sid)  navigate(`${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`, { state: { SID: sid, quotationSID: props?.quotationSID } });

    if (sid) {
      //if (props?.isFromMainList) {
      // const url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`;
      // const state = { SID: sid, quotationSID: props?.quotationSID, quote_start_date: props?.startDateFromQuoteParam, quote_end_date: props?.endDateFromQuoteParam };
      // const newTab = window.open(url, '_blank');
      // if (newTab) {
      //   newTab.location && newTab.location.href && newTab.location.replace(url);
      //   newTab.postMessage({ state }, window.location.origin);
      // }

      if (props?.quotationSID && props?.selectedStartDate && props?.selectedEndDate) {
        let url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}?quotesid=${props?.quotationSID}&checkIn=${dateFormat(props?.selectedStartDate,DATE_FORMATS.YMD)}&checkOut=${dateFormat(props?.selectedEndDate, DATE_FORMATS.YMD)}`;

        if (props?.specialOffer === true) {
          url += `&specialOffer=true`;
        }

        return url;
        // const newTab = window.open(url, "_blank");
        
        // if (newTab) {
        //   newTab.location &&
        //     newTab.location.href &&
        //     newTab.location.replace(url);
        // }
        
      } else {
        var url = "";
        if (props?.selectedStartDate && props?.selectedEndDate) {
          url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}?checkIn=${dateFormat(props?.selectedStartDate,DATE_FORMATS.YMD)}&checkOut=${dateFormat(props?.selectedEndDate, DATE_FORMATS.YMD)}`;
          if (props?.specialOffer === true) {
            url += `&specialOffer=true`;
          }
        } else {
          url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`;
          if (props?.specialOffer === true) {
            url += `?specialOffer=true`;
          }
        }
        return url;

        // const newTab = window.open(url, "_blank");
        // if (newTab) {
        //   newTab.location &&
        //     newTab.location.href &&
        //     newTab.location.replace(url);
        // }
      }
    }
    // else {
    //   navigate(`${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`, { state: { SID: sid, quotationSID: props?.quotationSID, quote_start_date: props?.startDateFromQuoteParam, quote_end_date: props?.endDateFromQuoteParam } });
    // }
    //}
    // else navigate(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
  };

  // const imageList = [
  //   { src: featuredOne, alt: 'First' },
  //   { src: AppartImg, alt: 'Second' },
  //   { src: FA2, alt: 'Third' },
  //   { src: FA3, alt: 'Fourth' },
  //   { src: FA4, alt: 'Fifth' },
  //   // ...additional images
  // ];

  const handleImageMouseEnter = (index) => {
    setHoveredImages((prevHoveredImages) => {
      const updatedHoveredImages = [...prevHoveredImages];
      updatedHoveredImages[index] = true;
      return updatedHoveredImages;
    });
  };

  const handleImageMouseLeave = (index) => {
    setHoveredImages((prevHoveredImages) => {
      const updatedHoveredImages = [...prevHoveredImages];
      updatedHoveredImages[index] = false;
      return updatedHoveredImages;
    });
  };

  const RemoveCartItem = (e) => {
    e.stopPropagation();
    props?.RemoveItem(props?.data?.bookingcart_sid);
  };

  const CalculateDiscountPriceForCorporateCustomer = (dailyPrice) => {
    var perDiscount = props?.customer_percentage_discount
      ? (dailyPrice * props?.customer_percentage_discount) / 100
      : 0;
    //var perDiscountForAll  = props?.data?.percentage_daily_discount ? ((dailyPrice * props?.data?.percentage_daily_discount) / 100) : 0;
    return (
      dailyPrice -
      perDiscount -
      (props?.customer_flat_discount ? props?.customer_flat_discount : 0)
    );
  };

  // const CalculateDiscountPrice = (dailyPrice) => {
  //   var perDiscount = props?.customer_percentage_discount ? ((dailyPrice * props?.customer_percentage_discount) / 100) : 0;
  //   var perDiscountForAll  = props?.data?.percentage_daily_discount ? ((dailyPrice * props?.data?.percentage_daily_discount) / 100) : 0;
  //   return dailyPrice - perDiscount - (props?.customer_flat_discount ? props?.customer_flat_discount : 0) - perDiscountForAll - (props?.data?.flat_daily_discount ? props?.data?.flat_daily_discount : 0);
  // }

  //Calculate Discount Price for customer after corporate discount
  const CalculateDiscountPrice = (dailyPrice) => {
    var perDiscount = props?.customer_percentage_discount
      ? (dailyPrice * props?.customer_percentage_discount) / 100
      : 0;

    var dailyPriceForCorporateCustomer =
      dailyPrice -
      perDiscount -
      (props?.customer_flat_discount ? props?.customer_flat_discount : 0);

    var perDiscountForAll = props?.data?.percentage_daily_discount
      ? (dailyPriceForCorporateCustomer *
          props?.data?.percentage_daily_discount) /
        100
      : 0;

    return (
      dailyPriceForCorporateCustomer -
      perDiscountForAll -
      (props?.data?.flat_daily_discount ? props?.data?.flat_daily_discount : 0)
    );
  };

  return (
    <a
      className="propertyCard"
      // onClick={() => {
      //   navigatePropertyDetail(props?.data?.apartment_sid);
      // }}
      target="_blank"
      href={navigatePropertyDetail(props?.data?.apartment_sid)}
    >
      <div className="propertyImageSlider">
        <div className="imageslist">
          <div className="propertyImages position-relative">
            {/* {props?.data?.image_urls?.length > 0 ? (
              props?.data?.image_urls.map((image, index) => (
                <img
                  key={index}
                  className={`w-100 imageItem ${hoveredImages[index] ? 'active' : ''}`}
                  src={image.src}
                  alt={image.alt}
                  onMouseEnter={() => handleImageMouseEnter(index)}
                  onMouseLeave={() => handleImageMouseLeave(index)}
                />
              ))
            ) : (
              <img
                src={AppartmentImg}
                alt="No Preview"
                width={'100%'}
              />
            )} */}

            {props?.data?.image_urls?.length > 0 ? (
              props?.data?.image_urls.map((image, index) => {
                const parts = image.src.split("/");
                const fileName = parts[parts.length - 1];
                const thumbnailSrc = image.src.replace(
                  fileName,
                  `thumb_${fileName}`
                );
                const placeholderSrc = image.src;

                return (
                  <img
                    key={index}
                    className={`w-100 imageItem ${
                      hoveredImages[index] ? "active" : ""
                    }`}
                    src={thumbnailSrc}
                    alt={image.alt}
                    onError={(event) => {
                      event.target.src = placeholderSrc;
                    }}
                    onMouseEnter={() => handleImageMouseEnter(index)}
                    onMouseLeave={() => handleImageMouseLeave(index)}
                  />
                );
              })
            ) : (
              <img src={AppartmentImg} alt="No Preview" width={"100%"} />
            )}

            {props?.data?.image_count - 5 > 0 &&
              hoveredImages[props?.data?.image_urls?.length - 1] && (
                <div className="active totalImages">
                  +{props?.data?.image_count - 5} photos
                </div>
              )}

            <div className="imageControls">
              <div className="d-flex justify-content-center align-items-center h-100">
                {[...Array(props?.data?.image_urls?.length)].map((_, index) => (
                  <span
                    key={index}
                    className={`imageControls${index + 1}`}
                    onMouseEnter={() => handleImageMouseEnter(index)}
                    onMouseLeave={() => handleImageMouseLeave(index)}
                  ></span>
                ))}
              </div>
            </div>

            <div className="imageControlsIndicators">
              <div className="d-flex justify-content-center align-items-center gap-2">
                {[...Array(props?.data?.image_urls?.length)].map((_, index) => (
                  <span
                    key={index}
                    className={`indicatorsImage ${
                      hoveredImages[index] ? "active" : ""
                    }`}
                  ></span>
                ))}
              </div>
            </div>

            {/* {props?.data?.property_ratings > 0 && <div className="rating d-flex align-items-center gap-1">
              {[...Array(props?.data?.property_ratings)].map((_, index) => (
                <BsStarFill key={index} />
              ))}
            </div>} */}
            <div className="propertyCardInfoText">
              {props?.data && props?.data?.is_instant_booking === true && (
                <div className="minBookDays">
                  {t("common_lables.instant_booking")}
                </div>
              )}
              {props?.data &&
                props?.data?.no_of_nights &&
                props?.data?.no_of_nights != null &&
                props?.data?.no_of_nights != 30 && (
                  <div className="minBookDays">
                    {props?.data?.no_of_nights < 365 ? (
                      <>
                        {t("common_lables.min")} {props?.data?.no_of_nights}{" "}
                        {t("common_lables.days_rental")}{" "}
                      </>
                    ) : (
                      <>
                        {/* {props?.data?.no_of_nights}{" "} */}
                        {t("common_lables.yearly_rental")}
                      </>
                    )}
                  </div>
                )}
            </div>
            {/* <img className={`w-100 imageItem active ${hovered ? " active" : ""}`} src={featuredOne} alt="First" />
            <img className={`w-100 imageItem ${hoveredOne ? "active" : ""}`} src={AppartImg} alt="Second" />
            <img className={`w-100 imageItem ${hoveredTwo ? "active" : ""}`} src={FA2} alt="Third" />
            <img className={`w-100 imageItem ${hoveredThree ? "active" : ""}`} src={FA3} alt="Fourth" />

            <img className={`w-100 imageItem ${hoveredFour ? "active" : ""}`} src={FA4} alt="Fifth" /> */}

            {/* <div className={`${hoveredFour ? "active totalImages" : ""}`}>
              +18 photos
            </div>

            <div className="imageControls">
              <div className="d-flex justify-content-center align-items-center h-100">
                <span className="imageControlsOne"
                  onMouseEnter={toggleHover}
                  onMouseLeave={toggleHover}
                ></span>
                <span className="imageControlsTwo"
                  onMouseEnter={toggleHoverOne}
                  onMouseLeave={toggleHoverOne}
                ></span>
                <span className="imageControlsThree"
                  onMouseEnter={toggleHoverTwo}
                  onMouseLeave={toggleHoverTwo}
                ></span>
                <span className="imageControlsFour"
                  onMouseEnter={toggleHoverThree}
                  onMouseLeave={toggleHoverThree}
                ></span>
                <span className="imageControlsFive"
                  onMouseEnter={toggleHoverFour}
                  onMouseLeave={toggleHoverFour}
                ></span>
              </div>
            </div> */}

            {/* <div className="imageControlsIndicators">
              <div className="d-flex justify-content-center align-items-center gap-2">
                <span className={`indicatorsImage ${hovered ? " active" : ""}`}></span>
                <span className={`indicatorsImage ${hoveredOne ? " active" : ""}`}></span>
                <span className={`indicatorsImage ${hoveredTwo ? " active" : ""}`}></span>
                <span className={`indicatorsImage ${hoveredThree ? " active" : ""}`}></span>
                <span className={`indicatorsImage ${hoveredFour ? " active" : ""}`}></span>
              </div>
            </div> */}
          </div>
        </div>

        <div className="propertyCardBody w-100">
          {props?.isCustomer && (
            <span
              className="deleteBooking"
              type="button"
              onClick={(e) => {
                RemoveCartItem(e);
              }}
            >
              <BsTrash />
            </span>
          )}
          <div className="propertyDetails">
            <div className="propertNameLocation mb-2">
              <h5>
                {props?.data?.apartment_title}{" "}
                {props?.data?.area_name && t("pages.properties.card.at")}{" "}
                {props?.data?.area_name}
              </h5>
              {/* {props?.data?.property_ratings > 0 && <div className="rating d-flex align-items-center gap-1">
                {[...Array(props?.data?.property_ratings)].map((_, index) => (
                  <BsStarFill key={index} />
                ))}
              </div>} */}
              <div className="d-flex align-items-center gap-3 flex-nowrap justify-content-between">
                <div className="d-flex align-items-center gap-1 locationItem pb-2">
                  <div>
                    <RiMapPinFill />
                  </div>
                  <div>
                    <p>{props?.data?.property_name}</p>
                    {props?.showNearBy && (
                      <span> {props?.data?.near_by_distance} </span>
                    )}
                  </div>
                </div>
                <div>
                  {props?.data?.property_ratings > 0 && (
                    <div className="rating d-flex align-items-center gap-1">
                      {[...Array(props?.data?.property_ratings)].map(
                        (_, index) => (
                          <BsStarFill key={index} />
                        )
                      )}
                    </div>
                  )}{" "}
                </div>
              </div>
            </div>

            {props?.data?.description && (
              <div className="propertySummary">
                {/* <p title={props?.data?.description}  dangerouslySetInnerHTML= {{ __html: props?.data?.description?.length <= 250 ? (props?.data?.description)?.replace(/\n/g, "<br>") : truncateText((props?.data?.description)?.replace(/\n/g, "<br>"), 250)}}></p> */}
                {/* <p title={props?.data?.description}>{props?.data?.description?.length <= 250 ? props?.data?.description : truncateText(props?.data?.description, 250)}</p> */}

                <p
                  title={props?.data?.description}
                  dangerouslySetInnerHTML={{
                    __html:
                      props?.data?.description?.length <= 250
                        ? (props?.data?.description || "")
                            .split("\n")
                            .slice(0, 3)
                            .join("<br>")
                            .replace(/\n/g, "<br>") +
                          (props?.data?.description?.split("\n").length > 3
                            ? "..."
                            : "")
                        : truncateText(
                            props?.data?.description?.replace(/\n/g, "<br>"),
                            250
                          )
                            .split("<br>")
                            .slice(0, 3)
                            .join("<br>")
                            .replace(/\n/g, "<br>") +
                          (props?.data?.description?.split("\n").length > 3
                            ? "..."
                            : ""),
                  }}
                ></p>
              </div>
            )}

            {props?.isCustomer && (
              <div className="dateBed d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FilterCalendarIcon />
                  <strong>{t("pages.properties.card.dates")}:</strong>{" "}
                  {dateFormat(props?.data?.start_date, DATE_FORMATS.MDY)} –{" "}
                  {dateFormat(props?.data?.end_date, DATE_FORMATS.MDY)}
                </div>
                {/* <span className="dateEdit">Edit</span> */}
              </div>
            )}
            <div className="d-flex align-items-center gap-4 allAmmenities">
              <div className="ammenitiesItem d-flex align-items-center gap-2">
                <FUserIcon /> {props?.data?.accomodation}
              </div>
              <div className="ammenitiesItem d-flex align-items-center gap-2">
                <FBedIcon /> {props?.data?.no_of_rooms}
              </div>
              <div className="ammenitiesItem d-flex align-items-center gap-2">
                <FShower /> {props?.data?.no_of_bathrooms}
              </div>
            </div>
          </div>
          <div className="propertyCardPrice">
            <div className="d-flex align-items-center justify-content-between gap-1">
              {!props?.isCustomer && (
                <div>
                  <div className="propertyPrice d-flex align-items-center gap-1">
                    {!props?.selectedStartDate &&
                      !props?.selectedEndDate &&
                      t("pages.properties.card.from")}{" "}
                    {props?.data?.currency_code_display
                      ? props?.data?.currency_code_display
                      : props?.data?.base_currency}
                    {props?.specialOffer === true ? 
                      <div className="ppPrice position-relative">
                      
                      {props?.data?.price != null ? (
                        <span className="text-success">
                          {validationHelper.formatFloatValue(
                            props?.data?.price
                          )}
                        </span>
                      ) : (
                        <span className="text-success">
                          {validationHelper.formatFloatValue(
                            props?.data?.striked_price
                          )}
                        </span>
                      )}
                      {/* /{t("pages.properties.card.night")} */}/
                      {t("common_lables.month")}
                      {props?.data?.price != null && (
                        <span className="oldPrice">
                          {props?.data?.currency_code_display
                            ? props?.data?.currency_code_display
                            : props?.data?.base_currency}{" "}
                          {validationHelper.formatFloatValue(
                            props?.data?.striked_price
                          )}{" "}
                        </span>
                      )}
                      </div> 
                      : 
                      <div className="ppPrice position-relative">
                      
                      {props?.data?.striked_price != null && (
                        <span className="text-success">
                          {validationHelper.formatFloatValue(
                            props?.data?.striked_price
                          )}
                        </span>
                      )}/{t("common_lables.month")}
                      </div> 
                      }
                  </div>
                  {props?.selectedStartDate && props?.selectedEndDate && (
                    <span className="reqPrice">
                      {t("common_lables.total_stay_price")}:{" "}
                      {props?.data?.currency_code_display}{" "}
                      {validationHelper.formatFloatValue(
                        props?.data?.requested_price
                      )}
                    </span>
                  )}


                  {props?.specialOffer && props?.data?.no_of_nights == 365 && <div class="propertySpclTextCust">{t("common_lables.offer_valid")} <strong> {t("common_lables.yearly")} </strong> {t("common_lables.booking")}</div>}
                  {props?.specialOffer && props?.data?.no_of_nights == 30 && <div class="propertySpclTextCust">{t("common_lables.offer_valid")} <strong> {t("common_lables.monthly")} </strong> {t("common_lables.booking")}</div>}
                </div>
              )}

              {props?.isCustomer && (
                <div className="propertyPrice d-flex align-items-center gap-1">
                  {props?.data?.currency_code_display
                    ? props?.data?.currency_code_display
                    : props?.data?.base_currency}
                  <div className="ppPrice position-relative">
                    <span className="text-success">
                      {validationHelper.formatFloatValue(
                        props?.data?.final_price
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* {props?.data?.is_featured && <div className="propertyCardBtn">
                <button type="button" className="bg-white border-1">  {t("pages.properties.card.featured")}</button>
              </div>}

              {props?.data?.is_special_offer && <div className="propertyCardBtn">
                <button type="button" className="bg-white border-1">  {t("pages.properties.card.special_offer")}</button>
              </div>} */}

              {props?.data?.is_featured && (props?.data?.is_special_offer && props?.specialOffer) ? (
                <div className="propertyCardBtn">
                  <button type="button" className="bg-white border-1">
                    {t("pages.properties.card.special_offer")}
                  </button>
                </div>
              ) : (
                <>
                  {props?.data?.is_featured && (
                    <div className="propertyCardBtn">
                      <button type="button" className="bg-white border-1">
                        {t("pages.properties.card.featured")}
                      </button>
                    </div>
                  )}

                  {props?.data?.is_special_offer && props?.specialOffer && (
                    <div className="propertyCardBtn">
                      <button type="button" className="bg-white border-1">
                        {t("pages.properties.card.special_offer")}
                      </button>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
          
          {/* {props?.data?.apartment_discounts_text && props?.data?.apartment_discounts_text?.length > 0 &&
            <div className="d-flex flex-column mt-2">
              {props?.data?.apartment_discounts_text?.map((item, index) => (
                <div className="d-flex align-items-center gap-2 mb-1">
                  <MdLocalOffer style={{ color: 'green' }} />
                  <p>{item?.discount}</p>
                </div>
              ))}
            </div>
          } */}
        </div>
      </div>
    </a>
  );
};

export default PropertiesCard;
