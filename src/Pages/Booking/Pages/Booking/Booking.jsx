import "Pages/Booking/Pages/Booking/Booking.css";
import { BsChevronLeft } from "react-icons/bs";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import AppartImg from "Assets/Images/HomeIcons/AppartMentImages/Jumeriah.png";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import { SetDynamicEndpoint, dateFormat, truncateText } from "Helpers/commonMethodHelper";
import { DATE_FORMATS, RoutePaths, ScreenResolutions } from "Constants/Constants";
import ApartmentPreview from "Pages/Booking/Components/ApartmentPreview/apartmentPreview";
import PriceDetails from "Pages/Booking/Components/PriceDetails/priceDetails";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import maskingActions from "reducers/masking/masking.actions";
import bookingService from "Services/bookingService";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import { useTranslation } from "react-i18next";
import validationHelper from "Helpers/validationHelper";
import ResponsiveBooking from "./ResponsiveBooking/ResponsiveBooking";
import Bookings from "./Bookings/Bookings";

const Booking = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { userDetails } = useSelector((state) => state.customerAuth);
  const dispatch = useDispatch(); // For calling Reducers

  //To get Start Date and End Date
  const location = useLocation();

  const navigate = useNavigate();

  const [isChecked, setIsChecked] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [apartmentPreviewData, setApartmentPreviewData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [similarApartments, setSimilarApartments] = useState([]);
  const [finalPrice, setFinalPrice] = useState();
  const [totalTax, setTotalTax] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const { language } = useSelector((state) => state.language);

  const [paymentOption, setPaymentOption] = useState(location?.state?.paymentOption ? location.state?.paymentOption : 1);


  const [screenWidth, setScreenWidth] = useState(window.innerWidth);


  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    // Add event listener to update the screenWidth state on window resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <>{screenWidth > ScreenResolutions.Width ? <Bookings /> : <ResponsiveBooking /> }</>
  );
};

export default Booking;
