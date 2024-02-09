import { ScrollArea, Skeleton } from "@mantine/core";
import { BsXLg } from "react-icons/bs";
import "../../MobileInbox.css";
import SendIcon from "Assets/Images/InboxIcons/SendIcon";
import { useNavigate, useParams } from "react-router-dom";
import inboxService from "Services/InboxService";
import { useEffect, useRef } from "react";
import { useState } from "react";
import validationHelper from "Helpers/validationHelper";
import moment from "moment";
import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";

const MobileInboxChat = () => {
  const { id } = useParams();
  
  let currentDate = null; // Initialize a variable to keep track of the current date
  const [chatMessages, setChatMessages] = useState();
  const [message, setMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [messageError, setMessageError] = useState("");
  const scrollAreaRef = useRef(null);
  const navigate = useNavigate();
  const get_messages_by_id = () => {
    setshowLoading(true);
    inboxService
      .get_inbox_customer_by_id(id)
      .then((res) => {
        
        if (res.data) {
          setChatMessages(res.data[0]);
        } else {
          setChatMessages([]);
        }
      })
      .finally(() => {
        setshowLoading(false);
      });
  };
  const [showLoading, setshowLoading] = useState(false);

  useEffect(() => {
    get_messages_by_id();
  }, []);

  function convertToShortName(fullName) {
    const parts = fullName.split(" ");

    if (parts.length > 0) {
      const firstName = parts[0];

      const lastName = parts[parts.length - 1];

      const shortName = firstName.charAt(0) + lastName.charAt(0);

      return shortName.toUpperCase();
    } else {
      return "";
    }
  }

  const runValidations = async () => {
    const updatedValidations = {
      message: validationHelper.validateMessage(message),
    };

    return updatedValidations;
  };

  const onSubmitFormData = async (event) => {
    //debugger;
    event.preventDefault();
    const errors = await runValidations();
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;
    if (isRequiredFieldsAreValid) {
      setIsDisabled(true);
      var messageObj = {
        booking_id: id,
        message: message,
      };
      inboxService
        .post_inbox_customer(messageObj)
        .then((res) => {})
        .finally(() => {
          setIsDisabled(false);
          setMessage("");
          setMessageError("");
          get_messages_by_id();

          // props?.setIsChangeID(props?.messages?.booking_id);
          // props?.setIsChange(!props?.isChange);
        });
    } else {
      setMessageError(errors.message);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scroll({ top: scrollAreaRef.current.scrollHeight });
    }
  };

  return (
    <>
      {
        <div className="inboxListSm ha--InboxListSm">
          <div className="inboxChatSm">
            <div className="d-flex align-items-center justify-content-between gap-3">
              <div
                className="chatCloseBtn"
                onClick={() =>
                  navigate(`${RoutePaths.ACCOUNT.MOBILE_INBOX_LIST}`)
                }
              >
                <span>
                  <BsXLg size={20} />
                </span>
              </div>
              <div
                className="chatToDetailBtn"
                onClick={() => {
                  navigate(
                    `${SetDynamicEndpoint(
                      RoutePaths.ACCOUNT.MOBILE_RESERVATION_DETAILS,
                      [id]
                    )}`
                  );
                }}
              >
                <span>Details</span>
              </div>
            </div>
          </div>
          <div className="ha--InboxDetailListSm">
            <div className="smInboxChat">
              <div class="chatAreaHeader p-0 mb-4">
                <div class="chatAreaContent">
                  {chatMessages && (
                    <>
                      <p>{`${chatMessages?.apartment_name}(BKN-${chatMessages?.booking_id})`}</p>
                      <span>{`${moment(chatMessages?.start_date).format(
                        "MMMM d, yyyy"
                      )} - ${moment(chatMessages?.end_date).format(
                        "MMMM d, yyyy"
                      )}`}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="chatMsgArea">
                <ScrollArea
                  h={400}
                  offsetScrollbars
                  scrollbarSize={8}
                  viewportRef={scrollAreaRef}
                >
                  {chatMessages &&
                    chatMessages?.chat_data?.map((item, index) => {
                      const isAdmin = item.is_admin;
                      const userInitial = isAdmin
                        ? "HA"
                        : convertToShortName(chatMessages?.customer_name);

                      // Get the date from the message
                      const messageDate = new Date(
                        moment(item.created_datetime_utc).format(
                          "M/D/YYYY h:mm:ss A"
                        ) + " UTC"
                      );
                      const messageDateString = messageDate.toDateString();

                      // Check if the date has changed
                      const showDateDivider = messageDateString !== currentDate;
                      currentDate = messageDateString;

                      return (
                        <div key={item.message_id}>
                          {/* Show date divider if date has changed */}
                          {showDateDivider && (
                            <div className="inboxTime">
                              <p>{messageDateString} </p>
                            </div>
                          )}

                          <div
                            className={isAdmin ? "recieverMsgs" : "sendermsgs"}
                          >
                            <div className="inboxChatBlurb">
                              <div>
                                {" "}
                                <div className="chatUserInitial">
                                  {userInitial}
                                </div>
                              </div>
                              <div className="inboxChatContent d-flex flex-column">
                                <p>{item.message}</p>
                                <span className="chatDateCustom">
                                  {moment(
                                    new Date(
                                      moment(item.created_datetime_utc).format(
                                        "M/D/YYYY h:mm:ss A"
                                      ) + " UTC"
                                    )
                                  ).format("h:mm A")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {/* <div class="recieverMsgs ps-0">
                  <div class="inboxChatBlurb">
                    <div>
                      <div class="chatUserInitial">HA</div>
                    </div>
                    <div class="inboxChatContent d-flex flex-column">
                      <p>hiii</p>
                      <span class="chatDateCustom">12:03 PM</span>
                    </div>
                  </div>
                </div>

                <div class="inboxTime">
                  <p>Mon Oct 02 2023 </p>
                </div>

                <div class="sendermsgs pe-0">
                  <div class="inboxChatBlurb">
                    <div>
                      <div class="chatUserInitial">TO</div>
                    </div>
                    <div class="inboxChatContent d-flex flex-column">
                      <p>I am fine</p>
                      <span class="chatDateCustom">1:16 PM</span>
                    </div>
                  </div>
                </div> */}
                </ScrollArea>
              </div>
            </div>

            <div className="smInboxChatMsgInput">
              <div class="inboxChatMsgInput">
                <div
                  className={`typeYourMsgInput ${
                    showLoading ? "disableChatTyping" : ""
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Type your message"
                    value={message}
                    disabled={isDisabled || false}
                    onChange={(event) => {
                      const { value } = event.target;
                      setMessage(value);
                      setMessageError(
                        validationHelper.validateMessage(message)
                      );
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && message) {
                        onSubmitFormData(event);
                      }
                    }}
                  />
                  <button
                    type="button"
                    class="sendBtn"
                    onClick={onSubmitFormData}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      {/* {showLoading && (
        <>
          <Skeleton height={700}>
          
          </Skeleton>
        </>
      )} */}
    </>
  );
};

export default MobileInboxChat;
