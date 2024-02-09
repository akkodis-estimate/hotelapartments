import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import FShower from "Assets/Images/FeaturedPropertiesIcons/FShower";
import FUserIcon from "Assets/Images/FeaturedPropertiesIcons/FUserIcon";
import BusinessBayImg from "Assets/Images/HomeIcons/AreasImages/BusinessBay.png";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ReservationDetails = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { language, currency_code } = useSelector((state) => state.language);
  const { userDetails } = useSelector((state) => state.customerAuth);

  const { isMasked } = useSelector((state) => state.masking);

  const { isLoading } = useSelector((state) => state.customerAuth);

  const [reviewList, setReviewList] = useState([]);

  return (
    <>
      <div className="ha--InboxRD">
        {props?.messages?.chat_data?.length > 0 && (
          <>
            <div className="reservationDetail">
              <div className="rsrvDtlHeader">
                <h2>Reservation Details</h2>
              </div>

              <div className="resrvBlurbArea">
                <div className="resrvBlurbItem">
                  <div className="rsrvImg">
                    <img src={props?.messages?.apartment_image} alt="Reservation Detail Img" />
                  </div>
                  <div className="resrvBlurbContent">
                    <div className="rsrvTitle">
                      <p>{props?.messages?.apartment_name}</p>
                    </div>
                    <div className="rsrvDate">
                      <span>{moment(props?.messages?.start_date).format('MMMM D, YYYY')} - {moment(props?.messages?.end_date).format('MMMM D, YYYY')}</span>
                    </div>
                    <div className="rsrvAmmenities">
                      <div className="d-flex align-items-center gap-4 allAmmenities">
                        <div className="ammenitiesItem d-flex align-items-center gap-2">
                          <FUserIcon /> {props?.messages?.accomodation}
                        </div>
                        <div className="ammenitiesItem d-flex align-items-center gap-2">
                          <FBedIcon /> {props?.messages?.no_of_rooms}
                        </div>
                        <div className="ammenitiesItem d-flex align-items-center gap-2">
                          <FShower /> {props?.messages?.bathroom_type}
                        </div>
                      </div>
                    </div>
                    <div className="rsrvPricing">
                      <p>
                        from {props?.messages?.currency_code}
                        <span className="rsrvBoldPrice"> {props?.messages?.monthly_price}/night </span>{" "}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="resertvationProprtySummary">
                  {props?.messages?.description}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReservationDetails;
