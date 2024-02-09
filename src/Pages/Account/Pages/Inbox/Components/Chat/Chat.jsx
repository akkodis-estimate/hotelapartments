import { ScrollArea, Skeleton } from "@mantine/core";
import SendIcon from "Assets/Images/InboxIcons/SendIcon";
import inboxService from "Services/InboxService";
import moment from "moment";
import validationHelper from "Helpers/validationHelper";
import { useEffect, useRef, useState } from "react";

const Chat = (props) => {
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [props.messages]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scroll({ top: scrollAreaRef.current.scrollHeight });
    }
  };

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
    event.preventDefault();
    const errors = await runValidations();
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;
    if (isRequiredFieldsAreValid) {
      setIsDisabled(true);
      let messageObj = {
        booking_id: props?.messages?.booking_id,
        message: message,
      };
      inboxService
        .post_inbox_customer(messageObj)
        .then((res) => {})
        .finally(() => {
          setIsDisabled(false);
          setMessage("");
          setMessageError("");
          props?.setIsChangeID(props?.messages?.booking_id);
          props?.setIsChange(!props?.isChange);
        });
    } else {
      setMessageError(errors.message);
    }
  };

  const ChatMessages = (chat_data) => {
    let currentDate = null; // Initialize a variable to keep track of the current date

    return (
      <div>
        {chat_data.map((item, index) => {
          const isAdmin = item.is_admin;
          const userInitial = isAdmin
            ? "HA"
            : convertToShortName(props?.messages?.customer_name);

          // Get the date from the message
          const messageDate = new Date(
            moment(item.created_datetime_utc).format("M/D/YYYY h:mm:ss A") +
              " UTC"
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

              <div className={isAdmin ? "recieverMsgs" : "sendermsgs"}>
                <div className="inboxChatBlurb">
                  <div>
                    {" "}
                    <div className="chatUserInitial">{userInitial}</div>
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
      </div>
    );
  };

  return (
    <>
      <div className="ha--InboxChatArea">
        <div className="inboxChatArea">
          {props?.messages?.chat_data?.length > 0 && !props?.showLoading ? (
            <>
              <div className="chatAreaHeader">
                <div className="chatAreaContent">
                  <p>
                    {props?.messages?.apartment_name} (BKN-
                    {props?.messages?.booking_id})
                  </p>
                  <span>
                    {moment(props?.messages?.start_date).format("MMMM D, YYYY")}{" "}
                    - {moment(props?.messages?.end_date).format("MMMM D, YYYY")}
                  </span>
                </div>
              </div>

              <div className="mainInboxChat">
                <ScrollArea
                  viewportRef={scrollAreaRef}
                  h={500}
                  offsetScrollbars
                  scrollbarSize={8}
                >
                  {props?.messages?.chat_data.length > 0 &&
                    ChatMessages(props?.messages?.chat_data)}
                </ScrollArea>
              </div>

              <div
                className="inboxChatMsgInput"
                style={{
                  backgroundColor:
                    isDisabled || props?.isDisabled 
                      ? "rgb(233, 236, 239)"
                      : "inherit",
                }}
              >
                <div className="typeYourMsgInput">
                  <input
                    type="text"
                    placeholder="Type your message"
                    value={message}
                    disabled={isDisabled || props?.isDisabled }
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
                    className="sendBtn"
                    disabled={isDisabled || props?.isDisabled }
                    onClick={onSubmitFormData}
                  >
                    <SendIcon />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {!props?.showLoading && (
                <div className="container"> No chats selected. </div>
              )}
            </>
          )}
          {props?.showLoading && (
            <>
              <Skeleton height={800} mb="xl"></Skeleton>
              {/* <Skeleton height={8} radius="xl" />
              <Skeleton height={8} mt={6} radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" /> */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Chat;
