import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import FShower from "Assets/Images/FeaturedPropertiesIcons/FShower";
import FUserIcon from "Assets/Images/FeaturedPropertiesIcons/FUserIcon";
import moment from "moment";
import BusinessBayImg from "Assets/Images/HomeIcons/AreasImages/BusinessBay.png";
import { BsChevronLeft, BsXLg } from "react-icons/bs";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import { RoutePaths } from "Constants/Constants";
import inboxService from "Services/InboxService";
import { useState } from "react";
import { useEffect } from "react";
import { Skeleton } from "@mantine/core";
const ResponsiveReservationDetails = (props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState();
  const [showLoading, setshowLoading] = useState(false);

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

  useEffect(() => {
    get_messages_by_id();
  }, []);

  return (
    <>
      {/* <h1>Reservation Details</h1> */}
      {chatMessages && (
        <div className="inboxListSm ha--InboxListSm">
        
            <div className="backBtn">
              <div>
                <button
                  type="button"
                  className="bg-transparent border-0 d-flex align-items-center p-0"
                >
                  <BsChevronLeft
                    onClick={() =>
                      navigate(
                        `${SetDynamicEndpoint(
                          RoutePaths.ACCOUNT.MOBILE_INBOX_CHAT,
                          [id]
                        )}`
                      )
                    }
                  />
                  Reservation Details
                </button>
              </div>
            </div>
         
          
            <div className="resrvBlurbArea">
              <div className="resrvBlurbItem">
                <div className="rsrvImg">
                  {chatMessages?.apartment_image ? (
                    <img
                      src={chatMessages?.apartment_image}
                      alt="Reservation Detail Img"
                    />
                  ) : (
                    "Image not available"
                  )}
                </div>
                <div className="resrvBlurbContent">
                  <div className="rsrvTitle">
                    <p>{chatMessages?.apartment_name}</p>
                  </div>
                  <div className="rsrvDate">
                    {/* <span>{moment(props?.messages?.start_date).format('MMMM D, YYYY')} - {moment(props?.messages?.end_date).format('MMMM D, YYYY')}</span> */}
                    <span>
                      {`${moment(chatMessages?.start_date).format(
                        "MMMM d, yyyy"
                      )} - ${moment(chatMessages?.end_date).format(
                        "MMMM d, yyyy"
                      )}`}
                    </span>
                  </div>
                  <div className="rsrvAmmenities">
                    <div className="d-flex align-items-center gap-4 allAmmenities">
                      <div className="ammenitiesItem d-flex align-items-center gap-2">
                        <FUserIcon /> {chatMessages?.accomodation}
                      </div>
                      <div className="ammenitiesItem d-flex align-items-center gap-2">
                        <FBedIcon /> {chatMessages?.no_of_rooms}
                      </div>
                      <div className="ammenitiesItem d-flex align-items-center gap-2">
                        <FShower /> {chatMessages?.bathroom_type}
                      </div>
                    </div>
                  </div>
                  <div className="rsrvPricing">
                    <p>
                      from {chatMessages?.currency_code}{" "}
                      <span className="rsrvBoldPrice">
                        {chatMessages?.monthly_price}/night
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="resertvationProprtySummarySm">
                {chatMessages?.description} Description
              </div>
            </div>
          
        </div>
      )}

      {showLoading && (
        <>
          <Skeleton height={700}>
            {/* Lorem ipsum dolor sit amet... */}
            {/* other content */}
          </Skeleton>
        </>
      )}
    </>
  );
};

export default ResponsiveReservationDetails;
