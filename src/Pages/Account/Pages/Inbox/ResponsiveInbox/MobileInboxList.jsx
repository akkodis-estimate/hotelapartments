import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BsChevronLeft } from "react-icons/bs";
import { ScrollArea, Skeleton } from "@mantine/core";
import { useDispatch } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import inboxService from "Services/InboxService";
import { getInboxCount } from "reducers/count/count.thunks";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import UnRead from "../Components/UnRead/UnRead";
import Read from "../Components/Read/Read";

const MobileInboxList = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const list_params = {
    page_size: 10,
    search_text: "",
  };

  const [chatData, setChatData] = useState([]);
  //const [unReadData, setUnReadData] = useState([]);
  //const [readData, setReadData] = useState([]);
  const [isChangeID, setIsChangeID] = useState(0);
  const [isChange, setIsChange] = useState(true);
  const [messages, setMessages] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [listParams, setlistParams] = useState(list_params); // Searching ,Sorting ,Filter ,Pagination Params
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [chatCount, setchatCount] = useState();
  const [showLoading, setshowLoading] = useState(false);
  const navigate = useNavigate();

  const getInboxList = useCallback(() => {
    //dispatch(maskingActions.showMasking());
    //setIsDisabled(true)
    setshowLoading(true);
    inboxService
      .get_inbox_customer(listParams)
      .then((res) => {
        if (res?.data?.result) {
          var chat_data = res?.data?.result;
          var chatMessage;

          chat_data.forEach((booking) => {
            const { booking_id } = booking;
            setIsChangeID((x) => {
              if (x !== 0 && booking_id === x) {
                chatMessage = booking;
              } else if (
                x === 0 &&
                state !== null &&
                state.bookingID !== null &&
                booking_id === Number(state?.bookingID)
              ) {
                chatMessage = booking;
              }
              return x;
            });
          });

          setChatData(chat_data);
          setMessages(chatMessage);
          setchatCount(res.data?.count);
        } else {
          setChatData([]);
          setMessages();
        }
      })
      .finally(() => {
        //dispatch(maskingActions.hideMasking());
        //setIsDisabled(false)
        setshowLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listParams]);

  useEffect(() => {
    const user_list = setTimeout(() => {
      getInboxList();
    }, 100);

    return () => {
      clearTimeout(user_list);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChange, listParams]);

  const ReadMessages = (data) => {
    setChatData((prevState) => {
      // debugger;
      var chat = [...prevState];
      var chatMessage = {};

      const chatIndex = chat.findIndex((x) => x.booking_id === data.booking_id);
      if (chatIndex !== -1) {
        chat[chatIndex] = data;
      }

      chat.forEach((booking) => {
        const { booking_id } = booking;

        if (data.booking_id !== 0 && booking_id === data.booking_id) {
          chatMessage = booking;
        }
      });

      setMessages(chatMessage);
      return chat;
    });
    dispatch(getInboxCount());
  };

  const handleSearchForm = (event) => {
    event.preventDefault();
    let searchText = event.target.value;
    setlistParams((previousState) => {
      return {
        ...previousState,
        search_text: searchText,
      };
    });
  };

  const handlePageSize = (event) => {
    event.preventDefault();
    let pageSize = listParams.page_size + 10;
    if (listParams.page_size < chatCount) {
      setlistParams((previousState) => {
        return {
          ...previousState,
          page_size: pageSize,
        };
      });
    } else {
      setlistParams((previousState) => {
        return {
          ...previousState,
          page_size: 10,
        };
      });
    }
  };

  // useEffect(() => {
  //   const handleWindowResize = () => {
  //     setWindowWidth(window.innerWidth);
  //     if (window.innerWidth <= ScreenResolutions.Width) {
  //       navigate(`${RoutePaths.ACCOUNT.MOBILE_INBOX_LIST}`);
  //     }
  //   };

  //   window.addEventListener("resize", handleWindowResize);

  //   return () => {
  //     window.removeEventListener("resize", handleWindowResize);
  //   };
  // }, []);

  const CheckUnreadChat = (chat_data) => {
    const unreadMessages = chat_data.filter((message) =>
      message.is_admin ? !message.is_read : false
    );
    return unreadMessages.length > 0 ? true : false;
  };

  const OpenMessage = (Item, isRead) => {
    // if (props?.setMessages && isRead) {
    //dispatch(maskingActions.showMasking());
    inboxService
      .post_inbox_customer_read(Item.booking_id)
      .then((res) => {
        // props?.setMessages(Item);
        // props?.ReadMessages(res.data.result[0]);
        
      })
      .finally(() => {
        //dispatch(maskingActions.hideMasking());
      });
    // } else {
    //   props?.setMessages(Item);
    // }
  };

  return (
    <>
      <div className="inboxListSm ha--InboxListSm">
        
          <div className="backBtn">
            <div>
              <button
                type="button"
                className="bg-transparent border-0 d-flex align-items-center p-0"
              >
                <BsChevronLeft
                  onClick={() => {
                    navigate("/");
                  }}
                />
                Inbox
              </button>
            </div>
          </div>
        

        <div className="ha--InboxDetailListSm">
          <ScrollArea h={400} offsetScrollbars scrollbarSize={8}>
            {!showLoading && (
              <div className="otherMsgsList">
                <div class="otherMsgsList">
                  {chatData.length > 0 &&
                    chatData.map((item, key) => {
                      return (
                        <>
                          {CheckUnreadChat(item?.chat_data) ? (
                            <>
                              <div onClick={() => OpenMessage(item, true)}>
                                <UnRead
                                  messageItem={item}
                                  key={key}
                                  isFromMobile={true}
                                />
                              </div>
                            </>
                          ) : (
                            <div onClick={() => OpenMessage(item)}>
                              <Read
                                messageItem={item}
                                key={key}
                                isFromMobile={true}
                              />
                            </div>
                            // <div
                            //   class="otherMsgsListItem cursor-pointer"
                            //   onClick={() =>
                            //     navigate(
                            //       `${SetDynamicEndpoint(
                            //         RoutePaths.ACCOUNT.MOBILE_INBOX_CHAT,
                            //         [item.booking_id]
                            //       )}`
                            //     )
                            //   }
                            // >
                            //   <div class="otherMsgsListItemContent">
                            //     <p>{`${item.apartment_name}(BKN-${item.booking_id})`}</p>
                            //     <p class="msgExceprt">{item.property_name}</p>
                            //   </div>
                            //   <span class="inboxMsgsTime">28 Sep</span>
                            // </div>
                          )}
                        </>
                      );
                    })}

                  {/* <div class="otherMsgsListItem cursor-pointer">
                  <div class="otherMsgsListItemContent">
                    <p>Aquaventure Waterpark (BKN-6)</p>
                    <p class="msgExceprt">Aquaventure Waterpark</p>
                  </div>
                  <span class="inboxMsgsTime">29 Sep</span>
                </div>

                <div class="otherMsgsListItem cursor-pointer">
                  <div class="otherMsgsListItemContent">
                    <p>Armani hotel (BKN-7)</p>
                    <p class="msgExceprt">Aquaventure Waterpark</p>
                  </div>
                  <span class="inboxMsgsTime">3 Oct</span>
                </div> */}
                </div>
              </div>
            )}

            {showLoading && (
              <>
                <Skeleton height={15} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
                <Skeleton height={15} mt={6} radius="xl" />
              </>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default MobileInboxList;
