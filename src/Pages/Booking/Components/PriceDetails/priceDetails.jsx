import { useTranslation } from "react-i18next";
import validationHelper from "Helpers/validationHelper";
import { useDisclosure } from "@mantine/hooks";
import { Popover, Text, Button } from "@mantine/core";
import { ImInfo } from "react-icons/im";
import { FiEdit } from "react-icons/fi";
import { BsCheckLg, BsXLg } from "react-icons/bs";
import { useState } from "react";
import apartmentService from "Services/apartmentService";
import { toast } from "react-toastify";
import { useEffect } from "react";

const PriceDetails = (props) => {
  const [opened, { close, open }] = useDisclosure(false);
  const { t } = useTranslation();

  const [guestName, setGuestName] = useState(props?.bookingData?.guest_name ? props.bookingData?.guest_name : "");
  const [editguestName, setEditGuestName] = useState(false);

  const handleTextChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setGuestName(value);
  };

  const handleFormSubmit = () =>{
    let payload = {
      name:guestName
    }
// debugger;
    apartmentService.updateGuestDetails(props?.bookingData?.bookingcart_sid, payload).then(res=>{
      // toast.success("Guest name changed successfully");
      let booking_list = [...props?.bookingDataList];
      // console.log(booking_list);
      // console.log(props?.booking_index);
      booking_list[props?.booking_index].guest_name = guestName;
      props?.setBookingData(booking_list);
      setEditGuestName(false);
    });

  }

  return (
    <div className="checkoutCard mb-4">
      {props?.isCustomer ? (
        <div className="COTitle mb-4">
          <h6>{props?.apartment_name}</h6>
        </div>
      ) : (
        <div className="COTitle mb-4">
          <h6>{t("pages.booking.price_details.title")}</h6>
        </div>
      )}
      <div className="pricingDetails">
        {props?.showGuestsDetails && props?.showGuestsDetails === true && (
          <>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6>{t("common_lables.guests")}</h6>
              <div>
                {/* <p>
                  {" "}
                  {props?.currency}{" "}
                  {validationHelper.formatFloatValue(
                    props?.priceData?.raw_price
                  )}
                </p>{" "} */}
                {editguestName ? (
                  <div className="d-flex align-items-center gap-3 guestNameInput">
                    <input
                      type="text"
                      name="guests_name"
                      id="guests_name"
                      className="form-control"
                      onChange={handleTextChange}
                      value={guestName}
                    />
                    <div className="d-flex align-items-center gap-3 guestNameUpdateDes">
                      <button type="button">
                        <BsCheckLg color="green" size={30} onClick={handleFormSubmit} />
                      </button>
                      <button type="button" onClick={() => setEditGuestName(!editguestName)}
                      >
                        <BsXLg color="red" size={25} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="guestNameEditCust d-flex align-items-center gap-2">
                    <p className="guestNameTitle" title={props?.bookingData?.guest_name}>{props?.bookingData?.guest_name?.length > 12 ? props?.bookingData?.guest_name?.substring(0, 12) + "..." : props?.bookingData?.guest_name}</p>
                    <span
                      className="cursor-pointer"
                      onClick={() => setEditGuestName(!editguestName)}
                    >
                      <FiEdit size={22} />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6>
            {props?.priceData?.total_nights} {t("common_lables.nights")}
          </h6>
          <div>
            <p>
              {" "}
              {props?.currency}{" "}
              {validationHelper.formatFloatValue(props?.priceData?.raw_price)}
            </p>{" "}
            {/* {props?.bookingData?.is_inclusive && (
              <span
                className="d-flex justify-content-end"
                style={{ fontSize: "14px" }}
              >
                ({t("common_lables.include_tax")})
              </span>
            )} */}
          </div>
        </div>
        {props?.priceData?.total_discount != null &&
          props?.priceData?.total_discount > 0 && (
            <div className="d-flex align-items-center justify-content-between mb-3 dicountColorSuccess">
              <h6>
                {t("pages.booking.price_details.discount")}{" "}
                {/* <div>
                  <span style={{ fontSize: "16px", color: "black" }}>
                    Offer Discount:{" "}
                    <b>
                      {props?.priceData?.offer_discount
                        ? validationHelper.formatFloatValue(
                          props?.priceData?.offer_discount
                        )
                        : 0.0}
                    </b>{" "}
                    <br /> Customer Discount:{" "}
                    <b>
                      {props?.priceData?.customer_discount
                        ? validationHelper.formatFloatValue(
                          props?.priceData?.customer_discount
                        )
                        : 0.0}
                    </b>{" "}
                    <br /> Quotation Discount:{" "}
                    <b>
                      {props?.priceData?.quotation_discount
                        ? validationHelper.formatFloatValue(
                          props?.priceData?.quotation_discount
                        )
                        : 0.0}
                    </b>
                  </span>
                </div> */}
              </h6>
              <p className="text-nowrap gap-2">
                {" "}
                {props?.currency}{" "}
                {validationHelper.formatFloatValue(
                  props?.priceData?.total_discount
                )}{" "}
              </p>
            </div>
          )}

        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <h6>
              {t("pages.booking.price_details.fee")}{" "}
              {/* <div>
              <span style={{ fontSize: "16px" }}>
                Special Tax:{" "}
                <b>
                  {props?.priceData?.special_tax
                    ? validationHelper.formatFloatValue(
                        props?.priceData?.special_tax
                      )
                    : 0.0}
                </b>
                {props?.priceData?.city_tax?.map((item, index) => (
                  <>
                    <br />
                    {item.tax_name + ":"}{" "}
                    <b>
                      {item.tax_value
                        ? validationHelper.formatFloatValue(item.tax_value)
                        : 0.0}
                    </b>
                  </>
                ))}
              </span>
            </div> */}
            </h6>

            <span className="pricingInfoCust">
              <Popover opened={opened} position="top" offset={2} withArrow>
                <Popover.Target>
                  <span onMouseEnter={open} onMouseLeave={close}>
                    <ImInfo />
                  </span>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="xs">
                    <div className="priceDtlPop">
                      <table className="w-100">
                        {props.priceData?.city_tax &&
                          props.priceData?.city_tax?.map((item, key) => {
                            return (
                              <>
                                <tr>
                                  <td>{item.tax_name}</td>
                                  <td className="text-right">
                                    <b>
                                      <span className="pDtlCurrency">
                                        {props?.currency + " "}
                                      </span>
                                      {validationHelper.formatFloatValue(
                                        item?.tax_value
                                      )}
                                    </b>
                                  </td>
                                </tr>
                              </>
                            );
                          })}

                        {props.priceData?.special_tax_details &&
                          props.priceData?.special_tax_details?.tax_name && (
                            <tr>
                              <td>
                                {props.priceData?.special_tax_details?.tax_name}
                              </td>
                              <td className="text-right">
                                <b>
                                  <span className="pDtlCurrency">
                                    {props?.currency + " "}
                                  </span>
                                  {validationHelper.formatFloatValue(
                                    props.priceData?.special_tax_details
                                      ?.tax_value
                                  )}
                                </b>
                              </td>
                            </tr>
                          )}

                        <tr>
                          <td className="border-top">Total</td>
                          <td className="text-right border-top">
                            <b>
                              <span className="pDtlCurrency">
                                {props?.currency + " "}
                              </span>
                              {/* {validationHelper.formatFloatValue(
                              (validationHelper.formatFloatValue(
                                props?.priceData?.total_tax
                              )
                                ? Number(
                                  validationHelper.formatFloatValue(
                                    props?.priceData?.total_tax
                                  )
                                )
                                : 0.0) +
                              (validationHelper.formatFloatValue(
                                props?.priceData?.total_fees
                              )
                                ? Number(
                                  validationHelper.formatFloatValue(
                                    props?.priceData?.total_fees
                                  )
                                )
                                : 0.0)
                            )} */}

                              {validationHelper.formatFloatValue(
                                (props?.priceData?.total_tax
                                  ? Number(props?.priceData?.total_tax)
                                  : 0.0) +
                                  (props?.priceData?.total_fees
                                    ? Number(props?.priceData?.total_fees)
                                    : 0.0)
                              )}
                            </b>
                          </td>
                        </tr>
                      </table>
                    </div>
                    {/* <div className="inInfoDesc d-none">
                      {props.priceData?.city_tax &&
                        props.priceData?.city_tax?.map((item, key) => {
                          return (
                            <>
                              {item.tax_name && item.tax_value ? (
                                <>
                                  {" "}
                                  <span style={{ fontSize: "16px" }} key={key}>
                                    {item.tax_name}:{" "}
                                    <b>
                                      {props?.currency +
                                        " " +
                                        validationHelper.formatFloatValue(
                                          item?.tax_value
                                        )}
                                    </b>
                                  </span>
                                  <br />
                                </>
                              ) : (
                                ""
                              )}
                            </>
                          );
                        })}

                      {props.priceData?.special_tax_details && (
                        <>
                          {props.priceData?.special_tax_details.tax_name &&
                            props.priceData?.special_tax_details.tax_value ? (
                            <>
                              {" "}
                              <span style={{ fontSize: "16px" }}>
                                {props.priceData?.special_tax_details?.tax_name}
                                :{" "}
                                <b>
                                  {props?.currency +
                                    " " +
                                    validationHelper.formatFloatValue(
                                      props.priceData?.special_tax_details
                                        ?.tax_value
                                    )}
                                </b>
                              </span>
                              <br />
                            </>
                          ) : (
                            ""
                          )}
                        </>
                      )}
                    </div> */}
                  </Text>
                </Popover.Dropdown>
              </Popover>
            </span>
          </div>

          <p className="text-nowrap d-flex align-items-center">
            {" "}
            {props?.currency}{" "}
            {/* {validationHelper.formatFloatValue(
              (validationHelper.formatFloatValue(props?.priceData?.total_tax)
                ? Number(
                  validationHelper.formatFloatValue(
                    props?.priceData?.total_tax
                  )
                )
                : 0.0) +
              (validationHelper.formatFloatValue(props?.priceData?.total_fees)
                ? Number(
                  validationHelper.formatFloatValue(
                    props?.priceData?.total_fees
                  )
                )
                : 0.0)
            )} */}
            {validationHelper.formatFloatValue(
              (props?.priceData?.total_tax
                ? Number(props?.priceData?.total_tax)
                : 0.0) +
                (props?.priceData?.total_fees
                  ? Number(props?.priceData?.total_fees)
                  : 0.0)
            )}
          </p>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <h6>{t("pages.booking.price_details.security_deposite")}</h6>
          <p>
            {" "}
            {props?.currency}{" "}
            {validationHelper.formatFloatValue(
              props?.priceData?.security_deposit
            )}
          </p>
        </div>

        {props?.isLsChecked == true && (
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6>{t("pages.booking.price_details.loyalty_points")}</h6>
            <p>
              {" "}
              {props?.currency}{" "}
              {validationHelper.formatFloatValue(props?.usedLP)}
            </p>
          </div>
        )}

        {props?.isCreditChecked == true && (
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6>{t("pages.booking.credit_limit")}</h6>
            <p>
              {" "}
              {props?.currency}{" "}
              {validationHelper.formatFloatValue(props?.usedCL)}
            </p>
          </div>
        )}

        <hr className="mt-3 mb-3" />
        <div className="d-flex align-items-start justify-content-between mb-3">
          <h6>{t("pages.booking.price_details.total")}</h6>
          <p className="d-flex flex-column align-items-end">
            {props?.isLsChecked == true || props?.isCreditChecked == true ? (
              <>
                <strong>
                  {" "}
                  {props?.currency}{" "}
                  {validationHelper.formatFloatValue(props?.totalPrice)}
                </strong>

                {props?.bookingData?.is_inclusive && (
                  <div className="inclTaxText">
                    (incl. taxes{" "}
                    {props?.currency +
                      " " +
                      validationHelper.formatFloatValue(
                        props?.priceData?.total_tax
                      )}
                    )
                  </div>
                )}
              </>
            ) : (
              <>
                <strong>
                  {" "}
                  {props?.currency}{" "}
                  {validationHelper.formatFloatValue(
                    props?.priceData?.final_price
                  )}
                </strong>

                {props?.bookingData?.is_inclusive && (
                  <div className="inclTaxText">
                    (incl. taxes{" "}
                    {props?.currency +
                      " " +
                      validationHelper.formatFloatValue(
                        props?.priceData?.total_tax
                      )}
                    )
                  </div>
                )}
              </>
            )}
          </p>
        </div>
        {/* {props?.isCustomer ? null : <> */}
        {props?.paymentOption == 2 && (
          <>
            <hr className="mt-3 mb-3" />
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6>{t("pages.booking.price_details.due_now")}</h6>
              {/* {props?.isLsChecked == true ? <p>{props?.currency} {validationHelper.formatFloatValue(props?.priceData?.final_price_with_loyalty_points / 2)} </p> : <p>{props?.currency} {validationHelper.formatFloatValue(props?.priceData?.final_price / 2)} </p>} */}
              {props?.isLsChecked == true ? (
                <p>
                  {props?.currency}{" "}
                  {validationHelper.formatFloatValue(props?.dueNow)}{" "}
                </p>
              ) : (
                <p>
                  {props?.currency}{" "}
                  {validationHelper.formatFloatValue(
                    props?.priceData?.final_price / 2
                  )}{" "}
                </p>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6>
                {t("pages.booking.price_details.due_on")} {props?.date}
              </h6>
              {props?.isLsChecked == true ? (
                <p>
                  {" "}
                  {props?.currency}{" "}
                  {validationHelper.formatFloatValue(props?.dueNow)}{" "}
                </p>
              ) : (
                <p>
                  {props?.currency}{" "}
                  {validationHelper.formatFloatValue(
                    props?.priceData?.final_price / 2
                  )}{" "}
                </p>
              )}
            </div>
          </>
        )}
        {!props?.isCustomer && (
          <span className="hiddenfeesNote">
            {t("pages.booking.price_details.charged")}
          </span>
        )}
        {/* </>} */}
      </div>
    </div>
  );
};

export default PriceDetails;
