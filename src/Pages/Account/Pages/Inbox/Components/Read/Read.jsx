import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Read = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getLastMessageTime = (chat_data) => {
    if (chat_data?.length === 0) {
      return "";
    }

    const latestMessage = chat_data[chat_data.length - 1];

    const time = moment(latestMessage.created_datetime_utc);
    var time_local = new Date(time.format("M/D/YYYY h:mm:ss A") + " UTC");
    const currentDate = moment().utc();

    var format_time = time.isBefore(currentDate, "day")
      ? moment(time_local).format("D MMM")
      : moment(time_local).format("h:mm A");

    return format_time;
  };

  return (
    <>
      <div
        className="otherMsgsListItem"
        onClick={() => {
          if (props?.isFromMobile) {
            navigate(
              `${SetDynamicEndpoint(RoutePaths.ACCOUNT.MOBILE_INBOX_CHAT, [
                props?.messageItem?.booking_id,
              ])}`
            );
          }
        }}
      >
        <div className="otherMsgsListItemContent">
          <p>
            {props?.messageItem?.apartment_name} (BKN-
            {props?.messageItem?.booking_id})
          </p>
          <p className="msgExceprt">{props?.messageItem?.property_name}</p>
        </div>
        <span className="inboxMsgsTime">
          {getLastMessageTime(props?.messageItem?.chat_data)}
        </span>
      </div>
    </>
  );
};

export default Read;
