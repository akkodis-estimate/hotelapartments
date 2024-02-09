import { ScrollArea, Skeleton } from "@mantine/core";
import SearchIcon from "Assets/Images/InboxIcons/SearchIcon";
import inboxService from "Services/InboxService";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Read from "../Read/Read";
import UnRead from "../UnRead/UnRead";
import { useEffect } from "react";

const Messages = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const OpenMessage = (Item, isRead) => {
    if (props?.setMessages && isRead) {
      //dispatch(maskingActions.showMasking());
      inboxService
        .post_inbox_customer_read(Item.booking_id)
        .then((res) => {
          props?.setMessages(Item);
          props?.ReadMessages(res.data.result[0]);
        })
        .finally(() => {
          //dispatch(maskingActions.hideMasking());
        });
    } else {
      props?.setMessages(Item);
    }
  };

  const CheckUnreadChat = (chat_data) => {
    const unreadMessages = chat_data.filter((message) =>
      message.is_admin ? !message.is_read : false
    );
    return unreadMessages.length > 0 ? true : false;
  };

  useEffect(() => {
    
  });

  return (
    <>
      <div className="ha--InboxSidebar">
        <div className="inboxSidebar">
          <div className="inboxSearchArea position-relative">
            <span className="inboxSearchIcon">
              <SearchIcon />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search"
              onChange={props?.handleSearchForm}
            />
          </div>
          {/* <div className="inboxTitle">
            <h4>Inbox</h4>
          </div> */}
          <ScrollArea h={600} offsetScrollbars scrollbarSize={8}>
            <div className="otherMsgsList">
              {props?.chatData &&
                !props?.showLoading &&
                props?.chatData?.map((item, index) => {
                  return (
                    <>
                      {CheckUnreadChat(item.chat_data) ? (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            OpenMessage(item, true);
                          }}
                        >
                          <UnRead messageItem={item} key={index} />
                        </div>
                      ) : (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            OpenMessage(item);
                          }}
                        >
                          <Read messageItem={item} key={index} />
                        </div>
                      )}
                    </>
                  );
                })}
            </div>
            {props?.chatData &&
              props?.chatData.length > 0 && props?.chatCount > 10 &&
              !props?.showLoading && (
                <>
                  {props?.chatCount > props?.chatData?.length ? (
                    <div className="d-flex justify-content-center">
                      <div className="animateBtn">
                        <button
                          type="button"
                          className="appBtn"
                          onClick={props?.handlePageSize}
                        >
                          {t("pages.all_areas.load_more")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="d-flex justify-content-center">
                        <div className="animateBtn">
                          <button
                            type="button"
                            className="appBtn"
                            onClick={props?.handlePageSize}
                          >
                            {t("pages.all_areas.load_less")}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

            {props?.showLoading && (
              <>
                <Skeleton height={8} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
                <Skeleton height={8} mt={6} radius="xl" />
              </>
            )}
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default Messages;
