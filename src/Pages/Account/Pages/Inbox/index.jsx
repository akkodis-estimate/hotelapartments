import "Pages/Account/Pages/Inbox/inbox.css";
import inboxService from "Services/InboxService";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getInboxCount } from "reducers/count/count.thunks";
import Chat from "./Components/Chat/Chat";
import Messages from "./Components/Messages/Messages";
import ReservationDetails from "./Components/Reservation Details/ReservationDetails";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";
const Inbox = () => {
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

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      
      if (window.innerWidth <= ScreenResolutions.Width) {
       
        navigate(`${RoutePaths.ACCOUNT.MOBILE_INBOX_LIST}`);
      }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth <= ScreenResolutions.Width) {
      
      navigate(`${RoutePaths.ACCOUNT.MOBILE_INBOX_LIST}`);
    }
  }, []);

  return (
    <>
      <div className="inboxContainer ha--inboxContaierUI">
        <Messages
          chatData={chatData}
          setMessages={setMessages}
          ReadMessages={ReadMessages}
          handleSearchForm={handleSearchForm}
          handlePageSize={handlePageSize}
          showLoading={showLoading}
          chatCount={chatCount}
        />
        <Chat
          messages={messages}
          isChangeID={isChangeID}
          setIsChangeID={setIsChangeID}
          isChange={isChange}
          setIsChange={setIsChange}
          isDisabled={isDisabled}
          showLoading={showLoading}
        />

        <ReservationDetails messages={messages} />
      </div>
    </>
  );
};

export default Inbox;
