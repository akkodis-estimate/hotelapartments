import { RoutePaths, STATUS } from "Constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  BsChatRightText,
  BsChevronLeft,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import { MdPayment } from "react-icons/md";

import BookingImg from "Assets/Images/BookingIcons/BookingImg.png";
import BookAgainicon from "Assets/Images/BookingIcons/BookAgainIcon";
import RequestModification from "Assets/Images/BookingIcons/RequestModification";
import CalendarIcon from "Assets/Images/SidebarIcons/CalendarIcon";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import LeaveReview from "./Components/LeaveReview/LeaveReview";
import ViewReview from "./Components/ViewReview/ViewReview";
import SearchIcon from "Assets/Images/BookingIcons/SearchIcon";
import maskingActions from "reducers/masking/masking.actions";
import ThankyouModal from "./Components/ThankyouModal/ThankyouModal";
import reviewService from "Services/reviewService";
import moment from "moment";
import RefundRequestModel from "./Components/Refund Request/RefundRequestModel";
import ModificatoinRequest from "./Components/Modification Request/Modification";
import ExtensionRequest from "./Components/Extension Request/Extension";
import validationHelper from "Helpers/validationHelper";
import bookingService from "Services/bookingService";
import "Pages/Account/Pages/Bookings/bookings.css";
import ThePalmImg from "Assets/Images/HomeIcons/AreasImages/AtlantisThePalm.png";
import { ActionIcon, Menu, ScrollArea, Table, Group } from "@mantine/core";
import InboxIcon from "Assets/Images/HeaderIcons/InboxIcon";
import MobileDrawerPopup from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import RepaymentIcon from "Assets/Images/BookingIcons/RepaymentIcon";
import SendMessage from "./Components/SendMessage/SendMessage";
import ResponsiveSendMessage from "./Components/ResponsiveSendMessage/ResponsiveSendMessage";
import { getInboxCount } from "reducers/count/count.thunks";

const Bookings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language, currency_code } = useSelector((state) => state.language);
  const { userDetails } = useSelector((state) => state.customerAuth);

  const { isMasked } = useSelector((state) => state.masking);

  const { isLoading } = useSelector((state) => state.customerAuth);
  const { inbox_count } = useSelector((state) => state.count);

  const statusData = [
    {
      value: STATUS.REQUESTED,
      label: t("status.requested"),
      style: { backgroundColor: "#FFFFFF", color: "#F3A053" },
    },
    {
      value: STATUS.ACCEPTED,
      label: t("status.accepted"),
      style: { backgroundColor: "#FFFFFF", color: "#0000FF" },
    },
    {
      value: STATUS.INCONTACT,
      label: t("status.in_contact"),
      style: { backgroundColor: "#FFFFFF", color: "#F3A053" },
    },
    {
      value: STATUS.FOLLOWUP,
      label: t("status.follow_up"),
      style: { backgroundColor: "#FFFFFF", color: "#F3A053" },
    },
    {
      value: STATUS.VIEWING_COMPLETED,
      label: t("status.viewing_completed"),
      style: { backgroundColor: "#FFFFFF", color: "#49BF71" },
    },
    {
      value: STATUS.RESERVATION_DONE,
      label: t("status.reservation_done"),
      style: { backgroundColor: "#FFFFFF", color: "#49BF71" },
    },
    {
      value: STATUS.CLOSED_LIST,
      label: t("status.closed_lost"),
      style: { backgroundColor: "#FFFFFF", color: "#49BF71" },
    },
    {
      value: STATUS.DECLINE,
      label: t("status.decline"),
      style: { backgroundColor: "#FFFFFF", color: "#FF0000" },
    },
    {
      value: STATUS.CHECKED_OUT,
      label: t("status.checked_out"),
      style: { backgroundColor: "#FFFFFF", color: "#FF0100" },
    },
    {
      value: STATUS.INHOUSE,
      label: t("status.in_house"),
      style: { backgroundColor: "#FFFFFF", color: "#FF0250" },
    },
    {
      value: STATUS.INHOUSE,
      label: t("status.in_house"),
      style: { backgroundColor: "#FFFFFF", color: "#FF0250" },
    },
    {
      value: STATUS.BOOKING_PAYMENT_PENDING,
      label: t("status.booking_payment_pending"),
      style: { backgroundColor: "#FFFFFF", color: "#FF0250" },
    },
  ];

  const list_params = {
    customer_id: userDetails ? userDetails.customer_id : null,
    page_number: 1,
    page_size: 10,
  };

  const default_view_review = {
    show: false,
    data: {},
  };

  // open the mobile view
  const default_moble_view_review = {
    show: false,
    data: {},
  };

  const send_message_payload = {
    booking_id: 0,
    send_message: false,
  };

  const [reviewList, setReviewList] = useState([]);
  const [metaData, setMetaData] = useState();
  const [customerBookingData, setCustomerBookingData] = useState([]);

  const [bookingAmount, setBookingAmount] = useState([]);
  const [paymentBookingFormData, setPaymentBookingFormData] = useState();

  const [listParams, setlistParams] = useState(list_params);
  const [addReview, setAddReview] = useState(default_view_review);
  const [successModal, setSuccessModal] = useState(false);
  const [viewReview, setViewReview] = useState(default_view_review);
  const [viewReviewMobieView, setViewReviewMobieView] = useState(
    default_moble_view_review
  ); // open the mobile view
  const [openmobileDrawer, setOpenmobileDrawer] = useState(false); // for mobile ui use
  const [openInboxDrawer, setOpenInboxDrawer] = useState(false); // for mobile ui use
  useEffect(() => {
    
  }, [openInboxDrawer]);
  const [refundRequestModel, setRefundRequestModel] =
    useState(default_view_review);
  const [modificationRequestModel, setModificationRequestModel] =
    useState(default_view_review);
  const [extensionRequestModel, setExtensionRequestModel] =
    useState(default_view_review);

  const [schedulePopup, setSchedulePopup] = useState(false);

  const [manageBookingPaymentError, setManageBookingPaymentError] =
    useState("");

  const [paymentList, setPaymentList] = useState([]);

  const [sendMessage, setSendMessage] = useState(send_message_payload); // For Send Message Modal

  const getReviewList = useCallback((list_param) => {
    let params = { ...list_param };
    dispatch(maskingActions.showMasking());
    reviewService
      .booking_list(params)
      .then((res) => {
        setReviewList(res.data.results.list ? res.data.results.list : []);
        setMetaData(res.data.meta);

        setCustomerBookingData(
          res.data.meta.total_customer_bookings_data[0]
            ? res.data.meta.total_customer_bookings_data[0]
            : []
        );
        
       
        let booking_list_data = res.data?.meta
          ? [...res.data?.meta?.total_customer_bookings_data]
          : [];
        booking_list_data = booking_list_data.map((item) => {
          return {
            ...item,
            booking_price: validationHelper.formatFloatValue(
              item.booking_price
            ),
            received_amount: validationHelper.formatFloatValue(
              item.received_amount
            ),
            outstanding_amount: validationHelper.formatFloatValue(
              item.outstanding_amount
            ),
          };
        });
        
        setPaymentList(booking_list_data);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [changeScreenStatus, setChangeScreenStatus] = useState(false); // change when 600px (mobile view Status change).
  const [saveOneRecord, setSaveOneRecord] = useState([]); // this for save one item Data and show it to mobile view only.
  const [openDrawer, setOpenDrawer] = useState(false); // for mobile Bottom Drawer for readMore .
  const [openDrawerThreeButton, setOpenDrawerThreeButton] = useState(false); // for mobile Bottom Drawer for Three Dot.
  const [openDrawerAddLeave, setOpenDrawerAddLeave] = useState(false); // for open the leave Drawer.

  useEffect(() => {
    const user_list = setTimeout(() => {
      getReviewList(listParams);
    }, 100);

    return () => {
      clearTimeout(user_list);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, currency_code]);

  const closeAddReview = (isChange) => {
    if (isChange) getReviewList(listParams);
    setAddReview(default_view_review);
  };

  const closeRefundRequestModel = (isChange) => {
    if (isChange) getReviewList(listParams);
    setRefundRequestModel(default_view_review);
  };

  const closeModificationRequestModel = (isChange) => {
    setModificationRequestModel(default_view_review);
  };

  const closeExtensionRequestModel = (isChange) => {
    setExtensionRequestModel(default_view_review);
  };

  // for show the popup
  const showSchedulePopup = (booking_sid) => {
    setOpenDrawerThreeButton(false);
    setPaymentBookingFormData();
    setSchedulePopup(true);
    bookingPaymentAPI(booking_sid);
  };

  const bookingPaymentAPI = (booking_sid) => {
    dispatch(maskingActions.showMasking());

    bookingService
      .PAYMENT_BOOKING_LIST(booking_sid)
      .then((res) => {
        debugger
        setPaymentBookingFormData(res.data.payments);
      })
      .catch((error) => {
        setManageBookingPaymentError(error.response.data.message);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  // for mobile view show and Hide.
  const ChangeScreenShowCard = (para) => {
    if (para === false) {
      setSaveOneRecord([]);
    }
    setChangeScreenStatus(para);
  };

  // for mobile view
  const SaveOneRecordForPage = (para) => {
    dispatch(getInboxCount(para.booking_id));
    

    setSaveOneRecord((prevState) => {
    
      return [...prevState, para];
    });
  };

  const navigateToRePay = (sid) => {
    if (sid) {
      const url = `${SetDynamicEndpoint(RoutePaths.REPAYMENT.REPAYMENT, [
        sid,
      ])}`;
      const newTab = window.open(url, "_blank");
      if (newTab?.location?.href) {
         newTab.location.replace(url);
      }
    }
  };

  const showSendMessagePopup = (booking_id) => {
    setSendMessage((prevState) => {
      return {
        ...prevState,
        send_message: true,
        booking_id: booking_id,
      };
    });
  };

  const hideSendMessagePopup = () => {
    setSendMessage(send_message_payload);
  };
  useEffect(() => {
    
  }, [inbox_count]);
  return (
    <>
      {changeScreenStatus === true &&
        saveOneRecord &&
        saveOneRecord.map((item) => {
          return (
            <div className="mobileViewBooking" key={item.booking_id}>
              <div className="row">
                <div className="col-lg-12 p-0">
                  <div className="backBtn">
                    <button
                      type="button"
                      className="bg-transparent border-0 d-flex align-items-center mt-3"
                      onClick={(e) => {
                        ChangeScreenShowCard(false);
                      }}
                    >
                      <BsChevronLeft />
                      {t("pages.all_areas.back")}
                    </button>
                  </div>
                </div>
                <div className="col-lg-12 p-0">
                  <div className="viewBookingBlurb">
                    <div className="mobileBookingImg">
                      <img
                        src={
                          item?.apartment_image[0]
                            ? item?.apartment_image[0].image_url?.replace(
                                /\/([^/]+)$/,
                                "/thumb_$1"
                              )
                            : ThePalmImg
                        }
                        alt="booking img"
                        className="w-100"
                        onError={(event) => {
                          event.target.src =
                            item.apartment_image[0]?.image_url || ThePalmImg;
                        }}
                      />
                    </div>
                    <div className="bookingTitleSm">
                      <div className="bookingName">
                        <p>{item?.name} </p>
                        <span>{item?.location}</span>
                      </div>
                      <div className="bookingAction d-flex justify-content-end gap-4 align-items-center">
                        <div
                          className="position-relative p-0"
                          onClick={() =>
                            navigate(RoutePaths.ACCOUNT.MOBILE_INBOX_LIST)
                          }
                        >
                          <InboxIcon />
                          {inbox_count > 0 && (
                            <span className="smUnreadIconDot"></span>
                          )}
                        </div>
                        <div>
                          <MobileDrawerPopup
                            position="bottom"
                            setIsDrawerOpen={setOpenmobileDrawer}
                            overlayProps={{ opacity: 0.5, blur: 4 }}
                            className="mobileDrawer"
                            openDrawer={openDrawerThreeButton}
                            setopenDrawer={setOpenDrawerThreeButton}
                          >
                            <ul className="dropdown-menu d-block w-100 border-0 bookingMobileDD">
                              <li
                                className="d-flex align-items-center"
                                // onClick={() => {
                                //   navigate(SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [item.apartment_sid]))
                                // }}
                                onClick={() =>
                                  showSchedulePopup(item.booking_sid)
                                }
                              >
                                <span className="paymenticon">
                                  <MdPayment />
                                </span>

                                {t(
                                  "pages.AccountSettings.booking.property_info.payment"
                                )}
                              </li>
                              <li
                                className="d-flex align-items-center"
                                onClick={() => {
                                  navigate(
                                    SetDynamicEndpoint(
                                      RoutePaths.PROPERTIES.PROPERTIES_DETAIL,
                                      [item.apartment_sid]
                                    )
                                  );
                                }}
                              >
                                <BookAgainicon />
                                {t(
                                  "pages.AccountSettings.booking.property_info.book_again"
                                )}
                              </li>
                              {item.status !== STATUS.CHECKED_OUT && (
                                <>
                                  <li
                                    className="d-flex align-items-center"
                                    onClick={() => {
                                      setOpenDrawerThreeButton(false);
                                      setModificationRequestModel(
                                        (prevState) => {
                                          return {
                                            ...prevState,
                                            show: true,
                                            data: { ...item },
                                          };
                                        }
                                      );
                                    }}
                                  >
                                    <RequestModification />
                                    {t(
                                      "pages.AccountSettings.booking.property_info.request_modification"
                                    )}
                                  </li>

                                  <li
                                    className="d-flex align-items-center"
                                    onClick={() => {
                                      setOpenDrawerThreeButton(false);
                                      setExtensionRequestModel((prevState) => {
                                        return {
                                          ...prevState,
                                          show: true,
                                          data: { ...item },
                                        };
                                      });
                                    }}
                                  >
                                    <CalendarIcon />
                                    {t(
                                      "pages.AccountSettings.booking.property_info.request_extension"
                                    )}
                                  </li>
                                </>
                              )}

                              {item.status === STATUS.CHECKED_OUT && (
                                <li
                                  className="d-flex align-items-center"
                                  onClick={() => {
                                    setOpenDrawerThreeButton(false);
                                    setRefundRequestModel((prevState) => {
                                      return {
                                        ...prevState,
                                        show: true,
                                        data: { ...item },
                                      };
                                    });
                                  }}
                                >
                                  <RequestModification />
                                  {t(
                                    "pages.AccountSettings.booking.property_info.refund_request"
                                  )}
                                </li>
                              )}

                              {item.status ===
                                STATUS.BOOKING_PAYMENT_PENDING && (
                                <li
                                  className="d-flex align-items-center"
                                  onClick={() => {
                                    navigateToRePay(item?.booking_sid);
                                  }}
                                >
                                  {/* <RequestModification /> */}
                                  <RepaymentIcon />
                                  {t(
                                    "pages.AccountSettings.booking.property_info.pay_again"
                                  )}
                                </li>
                              )}

                              <li
                                className="d-flex align-items-center"
                                onClick={() => {
                                  setOpenInboxDrawer(true);
                                }}
                              >
                                <InboxIcon />
                                {"Send Message"}
                              </li>
                            </ul>
                          </MobileDrawerPopup>

                          <MobileDrawerPopup
                            openDrawer={openInboxDrawer}
                            setopenDrawer={setOpenInboxDrawer}
                          >
                            <ResponsiveSendMessage
                              setOpenInboxDrawer={setOpenInboxDrawer}
                              saveOneRecord={saveOneRecord}
                            />
                          </MobileDrawerPopup>

                          <BsThreeDotsVertical
                            onClick={() => {
                              setOpenDrawerThreeButton(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bookingDetailSm p-0">
                  <table>
                    <tr>
                      <th>Paid Amount</th>
                      {/* AED */}
                      <td> {item.received_amount} </td>
                    </tr>

                    <tr>
                      <th>Check-In/out </th>
                      <td>
                        {moment(item.startdate_utc).format("MMM DD yyyy")} -{" "}
                        {moment(item.check_out).format("MMM DD yyyy")}
                      </td>
                    </tr>

                    <tr>
                      <th>Status</th>
                      <td>
                        <span
                          className="bookingStatus"
                          style={
                            statusData.find((x) => x.value === item.status)
                              .style
                          }
                        >
                          {
                            statusData.find((x) => x.value === item.status)
                              .label
                          }
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <th>Review</th>
                      <td>
                        {item.review !== null && (
                          <div
                            className="viewReview"
                            style={{
                              width: "10rem",
                              wordBreak: "break-word",
                            }}
                            onClick={() => {
                              setViewReviewMobieView((prevState) => {
                                return {
                                  ...prevState,
                                  show: true,
                                  data: {
                                    review: item.review,
                                    customerName: item.customer_name,
                                    reviewDate: item.review_date,
                                  },
                                };
                              });
                            }}
                          >
                            {item.review.substring(0, 50)}
                            <br />
                            {item.review.length > 50 && (
                              <span
                                onClick={() => {
                                  setViewReviewMobieView((prevState) => {
                                    return {
                                      ...prevState,
                                      show: true,
                                      data: {
                                        review: item.review,
                                        customerName: item.customer_name,
                                        reviewDate: item.review_date,
                                      },
                                    };
                                  });
                                  setOpenDrawer(true);
                                }}
                              >
                                {t(
                                  "pages.AccountSettings.booking.property_info.read_more"
                                )}
                              </span>
                            )}
                          </div>
                        )}

                        <MobileDrawerPopup
                          position="bottom"
                          setIsDrawerOpen={setOpenmobileDrawer}
                          overlayProps={{ opacity: 0.5, blur: 4 }}
                          className="mobileDrawer"
                          openDrawer={openDrawer}
                          setopenDrawer={setOpenDrawer}
                        >
                          <div className="row   d-flex flex-column align-items-center justify-content-center w-100">
                            <div className="col-lg-12">
                              <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
                                <div className="viewReviewTitle">
                                  <h2 className="text-center">
                                    {viewReviewMobieView.data
                                      ? viewReviewMobieView.data.customerName
                                      : ""}
                                  </h2>
                                  <p className="text-center">
                                    {viewReviewMobieView.data
                                      ? moment(
                                          viewReviewMobieView.data.reviewDate
                                        ).format("MMMM Do YYYY, h:mm:ss a")
                                      : ""}
                                  </p>
                                </div>
                                <div className="reviewPara text-center">
                                  <p>
                                    {viewReviewMobieView.data
                                      ? viewReviewMobieView.data.review
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </MobileDrawerPopup>

                        {item.review === null &&
                          item.status === STATUS.CHECKED_OUT && (
                            <div className="animateBtn ">
                              <button
                                type="button"
                                className="appBtn"
                                //className="cursor-pointer"
                                style={{
                                  color: "red",
                                  height: "40px",
                                  padding: "2px 10px",
                                }}
                                onClick={() => {
                                  setAddReview((prevState) => {
                                    return {
                                      ...prevState,
                                      show: false,
                                      data: {
                                        customer_id: list_params.customer_id,
                                        apartment_id: item.apartment_id,
                                        property_id: item.property_id,
                                        booking_id: item.booking_id,
                                      },
                                    };
                                  });
                                  setOpenDrawerAddLeave(true);
                                }}
                              >
                                Leave review
                              </button>
                            </div>
                          )}
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              <MobileDrawerPopup
                position="bottom"
                setIsDrawerOpen={setOpenmobileDrawer}
                overlayProps={{ opacity: 0.5, blur: 4 }}
                className="mobileDrawer leaveReplyMobileUi"
                openDrawer={openDrawerAddLeave}
                setopenDrawer={setOpenDrawerAddLeave}
              >
                <LeaveReview
                  data={addReview.data}
                  closeAddReview={closeAddReview}
                  false={true}
                  setSuccessModal={setSuccessModal}
                />
              </MobileDrawerPopup>
            </div>
          );
        })}

      {!isMasked && !isLoading ? (
        <>
          {reviewList &&
            reviewList.length > 0 &&
            changeScreenStatus === false && (
              <div className="ha--acountBookingDes">
                <div className="bookingSMTable">
                  <div className="bookingTable">
                    <div className="ha--BookingTopRow">
                      {/* <label className="paymentLabel">
                  {t("pages.AccountSettings.booking.total_booking_price")}:{" "}
                  <span className="priceColor">
                    {bookingAmount ? bookingAmount : 0.0}{" "}
                  </span>
                </label> */}
                      <div className="paymentlabelList">
                        <div className="paymentLabelHeader">
                          <label className="paymentLabel w-100">
                            {t(
                              "pages.AccountSettings.booking.total_booking_price"
                            )}
                            :{" "}
                            {/* <span className="priceColor">
                        {bookingAmount ? bookingAmount : 0.0}{" "}
                      </span> */}
                          </label>
                        </div>

                        <div className="paymentLabelColumnList">
                          {paymentList.map((item) => {
                            return (
                              <>
                                <div className="paymentPricingList">
                                  {item.currency + " " + item.booking_price}
                                </div>
                              </>
                            );
                          })}
                          {/* <div className="paymentPricingList">500inr</div>
                    <div className="paymentPricingList">500inr</div>
                    <div className="paymentPricingList">500inr</div>
                    <div className="paymentPricingList">500inr</div> */}
                        </div>
                      </div>

                      {/* <label className="paymentLabel">
                  {t("pages.AccountSettings.booking.total_received_amount")}:{" "}
                  <span className="priceColor">
                    {receivedAmount ? receivedAmount : 0.0}{" "}
                  </span>
                </label> */}
                      <div className="paymentlabelList">
                        <div className="paymentLabelHeader">
                          <label className="paymentLabel w-100">
                            {t(
                              "pages.AccountSettings.booking.total_received_amount"
                            )}
                            :
                          </label>
                        </div>

                        <div className="paymentLabelColumnList">
                          {paymentList.map((item) => {
                            return (
                              <>
                                <div className="paymentPricingList">
                                  {item.currency + " " + item.received_amount}
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>

                      {/* <label className="paymentLabel">
                  {t("pages.AccountSettings.booking.total_outstanding_amount")}:{" "}
                  <span className="priceColor">
                    {outstandingAmount ? outstandingAmount : 0.0}{" "}
                  </span>
                </label> */}
                      <div className="paymentlabelList">
                        <div className="paymentLabelHeader">
                          <label className="paymentLabel w-100">
                            {t(
                              "pages.AccountSettings.booking.total_outstanding_amount"
                            )}
                            :
                          </label>
                        </div>

                        <div className="paymentLabelColumnList">
                          {paymentList.map((item) => {
                            return (
                              <>
                                <div className="paymentPricingList">
                                  {item.currency +
                                    " " +
                                    item.outstanding_amount}
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <ScrollArea className="ha--mainBookingListUI">
                      <Table sx={{ minWidth: 800 }} verticalSpacing="md">
                        <thead>
                          <tr>
                            <th scope="col">
                              {t(
                                "pages.AccountSettings.booking.property_info.name_location"
                              )}
                            </th>

                            <th scope="col" className="bookingTableSm">
                              <span>
                                {t(
                                  "pages.AccountSettings.booking.property_info.booking_no"
                                )}
                              </span>
                            </th>

                            <th scope="col" className="bookingTableSm">
                              <span>
                                {t(
                                  "pages.AccountSettings.booking.property_info.booking_price"
                                )}
                              </span>
                            </th>

                            <th scope="col" className="bookingTableSm">
                              <span>
                                {t(
                                  "pages.AccountSettings.booking.property_info.received_amount"
                                )}
                              </span>
                            </th>

                            <th scope="col" className="bookingTableSm">
                              <span>
                                {t(
                                  "pages.AccountSettings.booking.property_info.outstanding_amount"
                                )}
                              </span>
                            </th>
                            <th scope="col" className="bookingTableSm">
                              <span>
                                {t(
                                  "pages.AccountSettings.booking.property_info.check_in"
                                )}{" "}
                              </span>
                            </th>
                            <th scope="col" className="bookingTableSm">
                              <span>
                                {t(
                                  "pages.AccountSettings.booking.property_info.check_out"
                                )}
                              </span>
                            </th>
                            <th scope="col">
                              <span>
                                {t(
                                  "pages.AccountSettings.booking.property_info.status"
                                )}
                              </span>
                            </th>
                            <th scope="col" className="bookingTableSm">
                              {t(
                                "pages.AccountSettings.booking.property_info.review"
                              )}
                            </th>
                            <th scope="col"></th>
                            {/* <th scope="col" style={{ width: "12rem" }}></th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {reviewList.map((item, index) => (
                            <tr key={item.booking_sid}>
                              <td style={{ minWidth: "400px" }}>
                                <div className="d-flex align-items-center gap-3">
                                  <div className="cursor-pointer">
                                    <img
                                      src={
                                        item.apartment_image
                                          ? item.apartment_image[0]?.image_url?.replace(
                                              /\/([^/]+)$/,
                                              "/thumb_$1"
                                            )
                                          : BookingImg
                                      }
                                      alt="BookingImg"
                                      className="bookingImg"
                                      onError={(event) => {
                                        event.target.src =
                                          item.apartment_image[0]?.image_url ||
                                          BookingImg;
                                      }}
                                      onClick={() => {
                                        navigate(
                                          SetDynamicEndpoint(
                                            RoutePaths.PROPERTIES
                                              .PROPERTIES_DETAIL,
                                            [item.apartment_sid]
                                          )
                                        );
                                      }}
                                    />
                                  </div>
                                  <div className="bookingname cursor-pointer">
                                    <p
                                      onClick={() => {
                                        navigate(
                                          SetDynamicEndpoint(
                                            RoutePaths.PROPERTIES
                                              .PROPERTIES_DETAIL,
                                            [item.apartment_sid]
                                          )
                                        );
                                      }}
                                    >
                                      {item.name}
                                    </p>
                                    <span>{item.location}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="tableCustText bookingTableSm">
                                <span>{item.booking_number}</span>
                              </td>
                              <td className="tableCustText bookingTableSm">
                                <span>
                                  {item.currency_code +
                                    " " +
                                    validationHelper.formatFloatValue(
                                      item.booking_price
                                    )}
                                </span>
                              </td>
                              <td className="tableCustText bookingTableSm">
                                <span>
                                  {validationHelper.formatFloatValue(
                                    item.received_amount
                                  )
                                    ? item.currency_code +
                                      " " +
                                      validationHelper.formatFloatValue(
                                        item.received_amount
                                      )
                                    : validationHelper.formatFloatValue(
                                        item.received_amount
                                      )}
                                </span>
                              </td>
                              <td className="tableCustText bookingTableSm">
                                {item.outstanding_amount < 0 ? (
                                  <span>
                                    {item.currency_code +
                                      " " +
                                      validationHelper.formatFloatValue(
                                        Number(0)
                                      )}{" "}
                                    <div>
                                      <p style={{ fontSize: "12px" }}>
                                        ({t("common_lables.refund")}{" "}
                                        {validationHelper.formatFloatValue(
                                          Math.abs(item.outstanding_amount)
                                        )}
                                        )
                                      </p>
                                    </div>
                                  </span>
                                ) : (
                                  <span>
                                    {item.currency_code +
                                      " " +
                                      validationHelper.formatFloatValue(
                                        item.outstanding_amount
                                      )}
                                  </span>
                                )}
                              </td>
                              <td className="tableCustText bookingTableSm">
                                <span>
                                  {moment(item.startdate_utc).format(
                                    "MMM DD yyyy"
                                  )}
                                </span>
                              </td>
                              <td className="tableCustText bookingTableSm">
                                <span>
                                  {moment(item.check_out).format("MMM DD yyyy")}
                                </span>
                              </td>
                              <td className="tableCustText ">
                                <span
                                  className="bookingStatus"
                                  style={
                                    statusData.find(
                                      (x) => x.value === item.status
                                    ).style
                                  }
                                >
                                  {
                                    statusData.find(
                                      (x) => x.value === item.status
                                    ).label
                                  }
                                </span>
                              </td>
                              <td
                                className="bookingTableSm"
                                style={{ width: "10rem" }}
                              >
                                {item.review === null &&
                                  item.status === STATUS.CHECKED_OUT && (
                                    <div className="animateBtn ">
                                      <button
                                        type="button"
                                        className="appBtn bookingTableBtn"
                                        //className="cursor-pointer"
                                        style={{
                                          color: "red",
                                          height: "40px",
                                          padding: "2px 10px",
                                          whiteSpace: "nowrap",
                                        }}
                                        onClick={() => {
                                          setAddReview((prevState) => {
                                            return {
                                              ...prevState,
                                              show: true,
                                              data: {
                                                customer_id:
                                                  list_params.customer_id,
                                                apartment_id: item.apartment_id,
                                                property_id: item.property_id,
                                                booking_id: item.booking_id,
                                              },
                                            };
                                          });
                                        }}
                                      >
                                        Leave review
                                      </button>
                                    </div>
                                  )}
                                {item.review !== null && (
                                  <div
                                    className="viewReview"
                                    style={{
                                      width: "10rem",
                                      wordBreak: "break-word",
                                    }}
                                    onClick={() => {
                                      setViewReview((prevState) => {
                                        return {
                                          ...prevState,
                                          show: true,
                                          data: {
                                            review: item.review,
                                            customerName: item.customer_name,
                                            reviewDate: item.review_date,
                                          },
                                        };
                                      });
                                    }}
                                  >
                                    {item.review.substring(0, 50)}
                                    <br />
                                    {item.review.length > 50 && (
                                      <span
                                        onClick={() => {
                                          setViewReview((prevState) => {
                                            return {
                                              ...prevState,
                                              show: true,
                                              data: {
                                                review: item.review,
                                                customerName:
                                                  item.customer_name,
                                                reviewDate: item.review_date,
                                              },
                                            };
                                          });
                                        }}
                                      >
                                        {t(
                                          "pages.AccountSettings.booking.property_info.read_more"
                                        )}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </td>
                              <td className="ViewTableSm ">
                                <div
                                  onClick={(e) => {
                                    ChangeScreenShowCard(true);
                                    SaveOneRecordForPage(item);
                                  }}
                                  className="d-flex justify-content-center"
                                >
                                  <BsThreeDotsVertical />
                                </div>
                              </td>
                              <td className="ViewTableLg">
                                <Group position="left">
                                  <Menu
                                    transitionProps={{ transition: "pop" }}
                                    withArrow
                                    position="bottom-end"
                                    withinPortal
                                  >
                                    <Menu.Target>
                                      <ActionIcon size={35}>
                                        <BsThreeDotsVertical size={35} />
                                      </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                      {/* <ul className="dropdown-menu"> */}
                                      <Menu.Item
                                        className="d-flex align-items-center"
                                        // onClick={() => {
                                        //   navigate(SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [item.apartment_sid]))
                                        // }}
                                        onClick={() =>
                                          showSchedulePopup(item.booking_sid)
                                        }
                                      >
                                        <span className="paymenticon">
                                          <MdPayment />
                                        </span>

                                        {t(
                                          "pages.AccountSettings.booking.property_info.payment"
                                        )}
                                      </Menu.Item>
                                      <Menu.Item
                                        className="d-flex align-items-center"
                                        onClick={() => {
                                          navigate(
                                            SetDynamicEndpoint(
                                              RoutePaths.PROPERTIES
                                                .PROPERTIES_DETAIL,
                                              [item.apartment_sid]
                                            )
                                          );
                                        }}
                                      >
                                        <BookAgainicon />
                                        {t(
                                          "pages.AccountSettings.booking.property_info.book_again"
                                        )}
                                      </Menu.Item>
                                      {item.status !== STATUS.CHECKED_OUT && (
                                        <>
                                          <Menu.Item
                                            className="d-flex align-items-center"
                                            onClick={() => {
                                              setModificationRequestModel(
                                                (prevState) => {
                                                  return {
                                                    ...prevState,
                                                    show: true,
                                                    data: { ...item },
                                                  };
                                                }
                                              );
                                            }}
                                          >
                                            <RequestModification />
                                            {t(
                                              "pages.AccountSettings.booking.property_info.request_modification"
                                            )}
                                          </Menu.Item>

                                          <Menu.Item
                                            className="d-flex align-items-center"
                                            onClick={() => {
                                              setExtensionRequestModel(
                                                (prevState) => {
                                                  return {
                                                    ...prevState,
                                                    show: true,
                                                    data: { ...item },
                                                  };
                                                }
                                              );
                                            }}
                                          >
                                            <CalendarIcon />
                                            {t(
                                              "pages.AccountSettings.booking.property_info.request_extension"
                                            )}
                                          </Menu.Item>
                                        </>
                                      )}

                                      {item.status === STATUS.CHECKED_OUT && (
                                        <Menu.Item
                                          className="d-flex align-items-center"
                                          onClick={() => {
                                            setRefundRequestModel(
                                              (prevState) => {
                                                return {
                                                  ...prevState,
                                                  show: true,
                                                  data: { ...item },
                                                };
                                              }
                                            );
                                          }}
                                        >
                                          <RequestModification />
                                          {t(
                                            "pages.AccountSettings.booking.property_info.refund_request"
                                          )}
                                        </Menu.Item>
                                      )}

                                      {item.status ===
                                        STATUS.BOOKING_PAYMENT_PENDING && (
                                        <Menu.Item
                                          className="d-flex align-items-center"
                                          onClick={() => {
                                            navigateToRePay(item?.booking_sid);
                                          }}
                                        >
                                          {/* <RequestModification /> */}
                                          <RepaymentIcon />
                                          {t(
                                            "pages.AccountSettings.booking.property_info.pay_again"
                                          )}
                                        </Menu.Item>
                                      )}

                                      <Menu.Item
                                        className="d-flex align-items-center sndMsg"
                                        onClick={() => {
                                          showSendMessagePopup(item.booking_id);
                                        }}
                                      >
                                        <BsChatRightText />
                                        Send Message
                                      </Menu.Item>
                                      {/* </ul> */}
                                    </Menu.Dropdown>
                                  </Menu>

                                  {/* <div
                              className="d-flex align-items-center justify-content-around"
                              style={{ width: "12rem" }}
                            > */}
                                  {/* <div className="chatBtn position-relative">
                            {item.status === 1 && (
                              <>
                                <InboxIcon />
                                <span className="notiBubble"></span>
                              </>
                            )}
                            {item.status !== 1 && (
                              <>
                                <InboxIcon />
                                <span className="notiBubble d-none"></span>
                              </>
                            )}
                          </div> */}
                                  {/* <div className="dropdown bookingDD">
                                <button
                                  className="btn btn-secondary dropdown-toggle p-0 bg-transparent border-0"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  data-bs-offset="10,20"
                                >
                                  <BsThreeDotsVertical />
                                </button>
                                <ul className="dropdown-menu">
                                  <li className="d-flex align-items-center"
                                    // onClick={() => {
                                    //   navigate(SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [item.apartment_sid]))
                                    // }}
                                    onClick={() => showSchedulePopup(item.booking_sid)}
                                  >
                                    <span className="paymenticon">
                                      <MdPayment />
                                    </span>

                                    {t("pages.AccountSettings.booking.property_info.payment")}
                                  </li>
                                  <li className="d-flex align-items-center"
                                    onClick={() => {
                                      navigate(SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [item.apartment_sid]))
                                    }}>
                                    <BookAgainicon />
                                    {t("pages.AccountSettings.booking.property_info.book_again")}
                                  </li>
                                  {item.status !== STATUS.CHECKED_OUT && (<>

                                    <li
                                      className="d-flex align-items-center"
                                      onClick={() => {
                                        setModificationRequestModel((prevState) => {
                                          return {
                                            ...prevState,
                                            show: true,
                                            data: { ...item },
                                          };
                                        });
                                      }}
                                    >
                                      <RequestModification />
                                      {t(
                                        "pages.AccountSettings.booking.property_info.request_modification"
                                      )}
                                    </li>

                                    <li
                                      className="d-flex align-items-center"
                                      onClick={() => {
                                        setExtensionRequestModel((prevState) => {
                                          return {
                                            ...prevState,
                                            show: true,
                                            data: { ...item },
                                          };
                                        });
                                      }}
                                    >
                                      <CalendarIcon />
                                      {t(
                                        "pages.AccountSettings.booking.property_info.request_extension"
                                      )}
                                    </li>
                                  </>)}


                                  {item.status === STATUS.CHECKED_OUT && (
                                    <li
                                      className="d-flex align-items-center"
                                      onClick={() => {
                                        setRefundRequestModel((prevState) => {
                                          return {
                                            ...prevState,
                                            show: true,
                                            data: { ...item },
                                          };
                                        });
                                      }}
                                    >
                                      <RequestModification />
                                      {t(
                                        "pages.AccountSettings.booking.property_info.refund_request"
                                      )}
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div> */}
                                </Group>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </ScrollArea>
                  </div>
                  {metaData && metaData.page !== metaData.total_page_num && (
                    <div className="col-lg-12  ">
                      <div className="d-flex justify-content-center mb-2">
                        <div className="animateBtn ">
                          <button
                            type="button"
                            className="appBtn"
                            onClick={() => {
                              setlistParams((prevState) => {
                                let newListParams = {
                                  ...prevState,
                                  page_size: prevState.page_size + 10,
                                };
                                getReviewList(newListParams);
                                return newListParams;
                              });
                            }}
                          >
                            <span>
                              {t("pages.AccountSettings.booking.load_more")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          {reviewList &&
            reviewList.length === 0 &&
            !isMasked &&
            !isLoading &&
            changeScreenStatus === false && (
              <div className="row noBookingWarning">
                <div className="col-lg-12">
                  <div className="warningBookingContent d-flex flex-column align-items-center justify-content-center">
                    <div className="noBookingIcon mb-4">
                      <SearchIcon />
                    </div>
                    <div className="noBkkingContent text-center">
                      <h4 className="mb-3">
                        {t("pages.AccountSettings.booking.no_bookings")}
                      </h4>
                      <NavLink to={RoutePaths.PROPERTIES.FEATURED_PPROPERTIES}>
                        <span>
                          {t("pages.AccountSettings.booking.find_properties")}
                        </span>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
      ) : (
        <>
          <div className="warningBookingContent d-flex flex-column align-items-center justify-content-center text-center noBkkingContent">
            <h4>{t("common_lables.loading")}</h4>
          </div>
        </>
      )}

      <ModalPopup show={addReview.show} dialogClassName="applicationModal">
        <LeaveReview
          data={addReview.data}
          closeAddReview={closeAddReview}
          setSuccessModal={setSuccessModal}
        />
      </ModalPopup>
      <ModalPopup show={viewReview.show} dialogClassName="applicationModal">
        <ViewReview data={viewReview.data} setViewReview={setViewReview} />
      </ModalPopup>

      <ModalPopup show={successModal} dialogClassName="applicationModal">
        <ThankyouModal setSuccessModal={setSuccessModal} />
      </ModalPopup>

      <ModalPopup
        show={refundRequestModel.show}
        dialogClassName="applicationModal"
      >
        <RefundRequestModel
          data={refundRequestModel.data}
          setRefundRequestModel={closeRefundRequestModel}
        />
      </ModalPopup>

      <ModalPopup
        show={modificationRequestModel.show}
        dialogClassName="applicationModal"
      >
        <ModificatoinRequest
          data={modificationRequestModel.data}
          setModificationRequestModel={closeModificationRequestModel}
        />
      </ModalPopup>

      <ModalPopup
        show={extensionRequestModel.show}
        dialogClassName="applicationModal"
      >
        <ExtensionRequest
          data={extensionRequestModel.data}
          setModificationRequestModel={closeExtensionRequestModel}
        />
      </ModalPopup>

      <ModalPopup
        show={schedulePopup}
        dialogClassName="applicationModal paymentModal paymentModalSm"
      >
        <div className="modal-header border-0 p-1 mb-4">
          {paymentBookingFormData && paymentBookingFormData?.length > 0 && (
            <h2>
              {t("pages.booking.payment.payment_for_booking")} :{" "}
              {paymentBookingFormData[0]?.booking_number}
            </h2>
          )}

          <button
            type="button"
            className="btn-close"
            onClick={() => {
              setSchedulePopup(false);
              setManageBookingPaymentError("");
            }}
          ></button>
        </div>
        <div className="modal-body">
          {manageBookingPaymentError == "" && (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">
                      {t("pages.booking.payment.scheduled_date")}
                    </th>
                    <th scope="col">
                      {t("pages.booking.payment.scheduled_amount")}
                    </th>

                    <th scope="col">
                      {t(
                        "pages.AccountSettings.booking.property_info.received_amount"
                      )}
                    </th>
                    <th scope="col">
                      {t("pages.AccountSettings.booking.property_info.status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paymentBookingFormData &&
                    paymentBookingFormData.map((item, index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>
                              {moment(item.scheduled_date).format(
                                "MMM DD yyyy"
                              )}
                            </td>

                            <td>{item.scheduled_amount}</td>
                            <td>{item.received_amount}</td>
                            <td>
                              {item.status === 44
                                ? t("status.pending")
                                : item.status === 115
                                ? t("status.payment_falied")
                                : t("status.completed")}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            </>
          )}
          {manageBookingPaymentError !== "" && (
            <>
              <p>{manageBookingPaymentError}</p>
            </>
          )}
        </div>
      </ModalPopup>

      <ModalPopup
        show={sendMessage.send_message}
        dialogClassName="applicationModal sendMessageModal"
      >
        <SendMessage
          sendMessage={sendMessage}
          setSendMessage={setSendMessage}
          hideSendMessagePopup={hideSendMessagePopup}
        />
      </ModalPopup>
    </>
  );
};

export default Bookings;
