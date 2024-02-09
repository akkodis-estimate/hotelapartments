import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import maskingActions from "reducers/masking/masking.actions";
import apartmentService from "Services/apartmentService";
import PropertiesCard from "Pages/Properties/FeaturedProperties/Components/PropertiesCard/PropertiesCard";
import bookingService from "Services/bookingService";
import homeScreenService from "Services/homeScreenService";
import "Pages/Booking/Pages/BookingList/BookingList.css";

const BookingList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.customerAuth);
  const { language, currency_code } = useSelector((state) => state.language);

  var list_params = {
    page_number: 1,
    page_size: 10,
    sort_column: "",
    sort_direction: "",
    Filters: "",
    search_text: "",
  };
  const [listParams, setlistParams] = useState(list_params);
  const [bookingList, setBookingList] = useState([]);
  const [apartmentDetails, setapartmentDetails] = useState([]);

  const getapartmentDetails = useCallback(() => {
    dispatch(maskingActions.showMasking());
    apartmentService
      .apartmentDetails("APT-F0E46597-BE8A-4A49-B3A4-76826B34C3B0")
      .then((res) => {
        
        setapartmentDetails(res.data ? res.data : []);

        //apartment_amenities and apartment_facilities and store in allAmenities
        //const combinedArray = ([...res?.data?.apartment_amenities, ...res?.data?.property_facilities])
        // const combinedArray = [...(res?.data?.apartment_amenities ?? []), ...(res?.data?.property_facilities ?? [])];
        // setAllAmenities(combinedArray);
        // if (res?.data?.close_to_apartment && res?.data?.close_to_apartment.length > 0) {
        //   const filteredPlace = res?.data?.near_by_places?.filter((item) => item.category_sid === res?.data?.close_to_apartment[0].category_sid);
        //   setFilteredPlace(filteredPlace);
        // }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBookingList = useCallback(() => {
    var params = {
      ...listParams,
      filters: JSON.stringify([
        { key: "customer_id", value: userDetails?.customer_id, condition: "=" },
      ]),
    };

    dispatch(maskingActions.showMasking());
    bookingService
      .booking_cart_list(params)
      .then((res) => {
        
        if (res.data.results && res.data.results.list) {
          
          setBookingList(res.data.results.list);
        } else {
          setBookingList([]);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [listParams]);

  useEffect(() => {
    const contracts_list = setTimeout(() => {
      getBookingList();
      //getapartmentDetails();
    }, 500);

    return () => {
      
      clearTimeout(contracts_list);
    };
  }, [listParams, language, currency_code]);

  const onConfirm = () => {
    if (userDetails) {
      navigate(
        `${SetDynamicEndpoint(RoutePaths.BOOKING.MULTIBOOKING, [
          userDetails?.customer_sid,
        ])}`,
        {
          state: {
            start_date: bookingList[0].start_date,
            end_date: bookingList[0].end_date,
          },
        }
      );
    } else {
      //history.push(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}?redirect=${encodeURIComponent(window.location.pathname)}`);
      navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`, {
        state: {
          returnPath: `${SetDynamicEndpoint(RoutePaths.BOOKING.MULTIBOOKING, [
            userDetails?.customer_sid,
          ])}`,
          start_date: bookingList[0].start_date,
          end_date: bookingList[0].end_date,
        },
      });
      //navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`);
    }
  };

  const onContinueBooking = () => {
    if (userDetails) {
      navigate(
        `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`
      );
    } else {
      //history.push(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}?redirect=${encodeURIComponent(window.location.pathname)}`);
      navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`, {
        state: {
          returnPath: `${SetDynamicEndpoint(
            RoutePaths.PROPERTIES.FEATURED_PPROPERTIES
          )}`,
        },
      });
      //navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`);
    }
  };

  // const onConfirm = () => {
  //   var reqBody = [];
  //   bookingList?.forEach((element) => {
  //       reqBody.push({booking_cart_id : element.booking_cart_id})
  //   })
  //   dispatch(maskingActions.showMasking());
  //   bookingService.add_to_booking_cart(reqBody).then((res) => {
  //   }).finally(() => {
  //     dispatch(maskingActions.hideMasking());
  //   });
  // }

  const onRemove = (sid) => {
    var reqBody = {
      status: 3,
    };
    dispatch(maskingActions.showMasking());
    bookingService
      .remove_from_booking_cart(reqBody, sid)
      .then((res) => {
        getBookingList();
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  return (
    <>
      <div className="ha--BookingMainContainer">
        <div className="ha--BookingListDesContainer">
          <div className="ha--BookingListHeader">
            <div className="sectionTitleDesc text-center">
              <h2>{t("pages.booking.booking_cart")}</h2>
            </div>
            <div className="ha--BookingListHeaderBtn">
              <div className="animateBtn appMainBtn">
                <button
                  type="button"
                  style={{ "justify-content": "center" }}
                  className={`appBtn bg-black w-100 disableButton `}
                  onClick={() => {
                    onContinueBooking();
                  }}
                >
                  <span>{t("pages.booking.continue_booking")}</span>
                </button>
              </div>

              <div className="animateBtn appMainBtn">
                <button
                  type="button"
                  style={{ "justify-content": "center" }}
                  className={`appBtn bg-green w-100 disableButton ${
                    bookingList?.length <= 0 ? " disabled" : ""
                  } `}
                  onClick={() => {
                    if (bookingList?.length > 0) {
                      onConfirm();
                    }
                  }}
                >
                  <span> {t("pages.booking.checkout")}</span>
                </button>
              </div>
            </div>
            </div>
            <div className="ha--BookingCards">
              <div className="ha--BookingCardList">
              <div className="ha--BookingCardListItem position-relative">
                {bookingList?.map((item, index) => {
                  if (index >= 0) {
                    return (
                     
                        <PropertiesCard
                          data={item}
                          RemoveItem={onRemove}
                          isCustomer={true}
                        />
                     
                    );
                  }
                })}
                 </div>
              </div>
              <div className="ha--BookingListHeaderBtn ha--BookingSmBtns">
             
              <div className="animateBtn appMainBtn">
                <button
                  type="button"
                  style={{ "justify-content": "center" }}
                  className={`appBtn bg-black w-100 disableButton `}
                  onClick={() => {
                    onContinueBooking();
                  }}
                >
                  <span>{t("pages.booking.continue_booking")}</span>
                </button>
              </div>

              <div className="animateBtn appMainBtn">
                <button
                  type="button"
                  style={{ "justify-content": "center" }}
                  className={`appBtn bg-green w-100 disableButton ${
                    bookingList?.length <= 0 ? " disabled" : ""
                  } `}
                  onClick={() => {
                    if (bookingList?.length > 0) {
                      onConfirm();
                    }
                  }}
                >
                  <span> {t("pages.booking.checkout")}</span>
                </button>
              </div>
           
              </div>
              {/* <div className="bookingCartSmAction bookingCartBtnSm">
                <div className="col-lg-6 d-flex align-items-center justify-content-between">
                  <div className="col-lg-6 animateBtn">
                    <button
                      type="button"
                      style={{ "justify-content": "center" }}
                      className={`appBtn bg-black w-100 disableButton `}
                      onClick={() => {
                        onContinueBooking();
                      }}
                    >
                      {t("pages.booking.continue_booking")}
                    </button>
                  </div>
                  <div className="col-lg-4 animateBtn">
                    <button
                      type="button"
                      style={{ "justify-content": "center" }}
                      className={`appBtn bg-green w-100 disableButton ${
                        bookingList?.length <= 0 ? " disabled" : ""
                      } `}
                      onClick={() => {
                        if (bookingList?.length > 0) {
                          onConfirm();
                        }
                      }}
                    >
                      {t("pages.booking.checkout")}
                    </button>
                  </div>
                </div>
              </div> */}
            </div>
            {/* <div className="col-lg-10">
                </div>
                <div className="col-lg-2">
                <button type="button" style={{"margin-top" : "20px"}} className={`appBtn bg-black w-100 disableButton`}
                  onClick={() => {  }}>
                  Confirm Booking
                </button>
                </div> */}
         
        </div>
      </div>
    </>
  );
};

export default BookingList;
