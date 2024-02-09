import { STATUS } from "Constants/Constants";
import "Pages/Account/Pages/Bookings/bookings.css";
import refundService from "Services/refundService";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsArrowRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import maskingActions from "reducers/masking/masking.actions";
import validationHelper from "Helpers/validationHelper";
import { ScrollArea, Table } from "@mantine/core";

const RefundRequest = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.customerAuth);

  const { isMasked } = useSelector((state) => state.masking);

  const { isLoading } = useSelector((state) => state.customerAuth);

  const statusData = [
    {
      value: STATUS.REFUND_REQUESTED,
      text: <span>{t("status.requested")}</span>,
      style: { backgroundColor: "#FFFFFF", color: "#F3A053" },
    },
    {
      value: STATUS.REFUND_ACCEPTED,
      text: <span>{t("status.accepted")}</span>,
      style: { backgroundColor: "#FFFFFF", color: "#0000FF" },
    },
    {
      value: STATUS.REFUND_REJECTED,
      text: <span>{t("status.rejected")}</span>,
      style: { backgroundColor: "#FFFFFF", color: "#FF0000" },
    },
    {
      value: STATUS.REFUND_COMPLETED,
      text: <span>{t("status.completed")}</span>,
      style: { backgroundColor: "#FFFFFF", color: "#49BF71" },
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

  const [refundList, setRefundList] = useState([]);
  const [metaData, setMetaData] = useState();
  const [listParams, setlistParams] = useState(list_params);

  const getRefundList = useCallback((list_param) => {
    var params = { ...list_param };
    dispatch(maskingActions.showMasking());
    refundService
      .refund_list(params)
      .then((res) => {
        setRefundList(res.data.results.list ? res.data.results.list : []);
        console.clear();
        
        setMetaData(res.data.meta);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const user_list = setTimeout(() => {
      getRefundList(listParams);
    }, 100);

    return () => {
      clearTimeout(user_list);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!isMasked && !isLoading ? (
        <>
          {refundList && refundList.length > 0 && (
            <div className="ha--RefundRequestUI ">
              <div className="bookingTable">
                <ScrollArea className="ha--mainBookingListUI">
                  <Table sx={{ minWidth: 800 }} verticalSpacing="md">
                    <thead>
                      <tr>
                        <th scope="col">
                          {t(
                            "pages.AccountSettings.refund.property_info.customer_name"
                          )}
                        </th>
                        <th scope="col">
                          {t(
                            "pages.AccountSettings.refund.property_info.location"
                          )}
                        </th>
                        <th scope="col">
                          {t(
                            "pages.AccountSettings.refund.property_info.apartment"
                          )}{" "}
                        </th>
                        <th scope="col">
                          {t(
                            "pages.AccountSettings.refund.property_info.budget"
                          )}
                        </th>
                        <th scope="col">
                          {t(
                            "pages.AccountSettings.refund.property_info.guests"
                          )}
                        </th>
                        <th scope="col" style={{ width: "10rem" }}>
                          {t(
                            "pages.AccountSettings.refund.property_info.requested_date"
                          )}
                        </th>
                        <th scope="col" style={{ width: "10rem" }}>
                          {t(
                            "pages.AccountSettings.refund.property_info.status"
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {refundList.map((item, index) => (
                        <tr key={index}>
                          <td>{item.customer_name}</td>
                          <td>{item.location}</td>
                          <td>{item.apartment}</td>
                          <td>
                            {item.currency_code} {validationHelper.formatFloatValue(item.requested_amount)}
                            {/* {item.base_booking_currency} {validationHelper.formatFloatValue(item.display_budget)} */}
                          </td>
                          <td>
                            {validationHelper.formatFloatValue(item.guests)}
                          </td>
                          <td style={{ width: "10rem" }}>
                            {moment(item.requested_date).format("MMM DD yyyy")}
                          </td>
                          <td>
                            <span
                              className="bookingStatus"
                              style={
                                statusData.find(
                                  (x) => x.value === item.refund_status
                                ).style
                              }
                            >
                              {
                                statusData.find(
                                  (x) => x.value === item.refund_status
                                ).text
                              }
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              </div>

              <div className="ha--refuntRqstBtn">
                <div className="animateBtn appMainBtn">
                  {metaData && metaData.page !== metaData.total_page_num && (
                    <button
                      type="button"
                      className="appBtn"
                      onClick={() => {
                        setlistParams((prevState) => {
                          var newListParams = {
                            ...prevState,
                            page_size: prevState.page_size + 10,
                          };
                          getRefundList(newListParams);
                          return newListParams;
                        });
                      }}
                    >
                      <span>
                        {t("pages.AccountSettings.booking.load_more")}
                      </span>
                      {!(metaData
                        ? metaData.page === metaData.total_page_num
                        : true) && (
                        <span className="btnIcon">
                          <BsArrowRight />
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
          {refundList && refundList.length === 0 && !isMasked && !isLoading && (
            <div className="row noBookingWarning">
              <div className="col-lg-12">
                <div className="warningBookingContent d-flex flex-column align-items-center justify-content-center">
                  <div className="noBkkingContent text-center">
                    <h4 className="mb-3">
                      {t("pages.AccountSettings.refund.no_refund")}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="warningBookingContent d-flex flex-column align-items-center justify-content-center text-center">
            <h4>{t("common_lables.loading")}</h4>
          </div>
        </>
      )}
    </>
  );
};

export default RefundRequest;
