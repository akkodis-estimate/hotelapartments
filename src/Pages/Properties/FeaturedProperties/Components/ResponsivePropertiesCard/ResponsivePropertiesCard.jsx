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
import { useNavigate } from "react-router-dom";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import FUserIcon from "Assets/Images/FeaturedPropertiesIcons/FUserIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import FShower from "Assets/Images/FeaturedPropertiesIcons/FShower";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import validationHelper from "Helpers/validationHelper";
import "Pages/Properties/FeaturedProperties/Components/PropertiesCard/propertiescard.css";
import JumeirahResidenceimg from "Assets/Images/HomeIcons/AreasImages/JumeirahResidence.png";

const ResonsivePropertiesCard = (props) => {
  //debugger
  const navigate = useNavigate();
  const { t } = useTranslation();

  //const [hoveredImages, setHoveredImages] = useState([]);

  // const navigatePropertyDetail = (sid) => {
  //     //navigate('/properties/properties-detail');
  //     if (sid) navigate(`${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`, { state: { SID: sid, quotationSID: props?.quotationSID } });
  //     else navigate(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
  // };

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

      // if (
      //   props?.quotationSID &&
      //   props?.selectedStartDate &&
      //   props?.selectedEndDate
      // ) {
      //   const url = `${SetDynamicEndpoint(
      //     RoutePaths.PROPERTIES.PROPERTIES_DETAIL,
      //     [sid]
      //   )}?quotesid=${props?.quotationSID}&checkIn=${dateFormat(
      //     props?.selectedStartDate,
      //     DATE_FORMATS.YMD
      //   )}&checkOut=${dateFormat(props?.selectedEndDate, DATE_FORMATS.YMD)}`;
      //   const newTab = window.open(url, "_blank");
      //   if (newTab) {
      //     newTab.location &&
      //       newTab.location.href &&
      //       newTab.location.replace(url);
      //   }
      // }

      // else {
      //   var url = "";
      //   if (props?.selectedStartDate && props?.selectedEndDate) {
      //     url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [
      //       sid,
      //     ])}?checkIn=${dateFormat(
      //       props?.selectedStartDate,
      //       DATE_FORMATS.YMD
      //     )}&checkOut=${dateFormat(props?.selectedEndDate, DATE_FORMATS.YMD)}`;
      //   } else {
      //     url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [
      //       sid,
      //     ])}`;
      //   }
      //   const newTab = window.open(url, "_blank");
      //   if (newTab) {
      //     newTab.location &&
      //       newTab.location.href &&
      //       newTab.location.replace(url);
      //   }
      // }


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
          let url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}?quotesid=${props?.quotationSID}&checkIn=${dateFormat(props?.selectedStartDate, DATE_FORMATS.YMD)}&checkOut=${dateFormat(props?.selectedEndDate, DATE_FORMATS.YMD)}`;

          if (props?.specialOffer === true) {
            url += `&specialOffer=true`;
          }

          // const newTab = window.open(url, "_blank");

          // if (newTab) {
          //   newTab.location &&
          //     newTab.location.href &&
          //     newTab.location.replace(url);
          // }
          return url;

        } else {
          var url = "";
          if (props?.selectedStartDate && props?.selectedEndDate) {
            url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}?checkIn=${dateFormat(props?.selectedStartDate, DATE_FORMATS.YMD)}&checkOut=${dateFormat(props?.selectedEndDate, DATE_FORMATS.YMD)}`;
            if (props?.specialOffer === true) {
              url += `&specialOffer=true`;
            }
          } else {
            url = `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`;
            if (props?.specialOffer === true) {
              url += `?specialOffer=true`;
            }
          }
          // const newTab = window.open(url, "_blank");
          // if (newTab) {
          //   newTab.location &&
          //     newTab.location.href &&
          //     newTab.location.replace(url);
          // }
          return url;

        }
      }
    }

  };

  //   const handleImageMouseEnter = (index) => {
  //     setHoveredImages((prevHoveredImages) => {
  //       const updatedHoveredImages = [...prevHoveredImages];
  //       updatedHoveredImages[index] = true;
  //       return updatedHoveredImages;
  //     });
  //   };

  //   const handleImageMouseLeave = (index) => {
  //     setHoveredImages((prevHoveredImages) => {
  //       const updatedHoveredImages = [...prevHoveredImages];
  //       updatedHoveredImages[index] = false;
  //       return updatedHoveredImages;
  //     });
  //   };

  const RemoveCartItem = (e) => {
    e.stopPropagation();
    props?.RemoveItem(props?.data?.bookingcart_sid);
  };

  return (
    <a
      className="mobile_proprty_card"
      // onClick={() => {
      //   navigatePropertyDetail(props?.data?.apartment_sid);
      // }}
      target="_blank"
      href={navigatePropertyDetail(props?.data?.apartment_sid)}
    >
      <div className="appartmentCardSm">
        <div className="appartmentItemImg position-relative">
          {props?.data?.image_urls?.length > 0 ? (
            // <img src={props?.data?.image_urls[0]?.src} alt="Apartment Image" />
            <img
              src={
                props?.data?.image_urls[0]?.src
                  ? `${props?.data?.image_urls[0]?.src.replace(
                    /\/([^/]+)$/,
                    "/thumb_$1"
                  )}`
                  : AppartmentImg
              }
              alt="Apartment Image"
              onError={(event) => {
                // If the thumbnail fails to load, fallback to the original image URL
                event.target.src =
                  props?.data?.image_urls[0]?.src || AppartmentImg;
              }}
            />
          ) : (
            <img src={AppartmentImg} alt="No Preview" width={"100%"} />
          )}
          <div className="propertyCardInfoText">
            {props?.data && props?.data?.is_instant_booking === true && <div className="minBookDays">{t("common_lables.instant_booking")}</div>}
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
        </div>
        <div className="appartmentItemContent">
          <div className="appartmentTitle">
            <h4>
              {props?.data?.apartment_title} {t("pages.properties.card.at")}{" "}
              {props?.data?.area_name}
            </h4>
          </div>
          <div className="appartmentLocation d-flex align-items-center justify-content-between flex-wrap gap-3 w-100">
            <p title={props?.data?.property_name}>
              {props?.data?.property_name}
            </p>
            <div className="rating d-flex align-items-center gap-1 m-0">
              {[...Array(props?.data?.property_ratings)].map((_, index) => (
                <BsStarFill key={index} />
              ))}
            </div>
          </div>
          <div className="appartmentAmmenitiesSm">
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
          {/* <div className="d-flex align-items-center justify-content-between w-100">
                            <div className="propertyPrice d-flex align-items-center gap-1 propertyPriceSm">
                                from AED 5000/night
                            </div>
                            <span className="featuredApartmentSm">Features</span>
                        </div> */}

          <div className="d-flex flex-wrap align-items-center justify-content-between w-100 gap-2">
            {!props?.isCustomer && (
              <div>
                <div className="propertyPrice d-flex align-items-center gap-1">
                  {!props?.selectedStartDate &&
                    !props?.selectedEndDate &&
                    t("pages.properties.card.from")}{" "}
                  {props?.data?.currency_code_display}

                  {props?.specialOffer === true ? <div className="ppPrice position-relative">
                    {props?.data?.price ? (
                      <span className="text-success">
                        {validationHelper.formatFloatValue(props?.data?.price)}
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
                    {props?.data?.price && (
                      <span className="oldPrice">
                        {props?.data?.currency_code_display}{" "}
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

            {/* {props?.data?.is_featured && <span className="featuredApartmentSm">  {t("pages.properties.card.featured")}</span>}

                            {props?.data?.is_special_offer && <span className="featuredApartmentSm">  {t("pages.properties.card.special_offer")}</span>} */}

            {props?.data?.is_featured && (props?.data?.is_special_offer && props?.specialOffer) ? (
              <span className="featuredApartmentSm">
                {t("pages.properties.card.special_offer")}
              </span>
            ) : (
              <>
                {props?.data?.is_featured && (
                  <span className="featuredApartmentSm">
                    {t("pages.properties.card.featured")}
                  </span>
                )}

                {props?.data?.is_special_offer && props?.specialOffer && (
                  <span className="featuredApartmentSm">
                    {t("pages.properties.card.special_offer")}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ResonsivePropertiesCard;
