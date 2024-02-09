import "Pages/Booking/Pages/Booking/Booking.css";
import {  useLocation, useNavigate, useParams } from "react-router-dom";
import {  ScreenResolutions } from "Constants/Constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Payments from "./Payments/Payments";
import ResponsivePayment from "./ResponsivePayment/ResponsivePayment";

const Payment = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { userDetails } = useSelector((state) => state.customerAuth);
  const navigate = useNavigate();

  const dispatch = useDispatch(); // For calling Reducers

  //To get Start Date and End Date
  const location = useLocation();


  const [isBookingSuccess, setBookingSuccess] = useState(false);

  const [bookingData, setBookingData] = useState(null);
  const [apartmentPreviewData, setApartmentPreviewData] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [finalPrice, setFinalPrice] = useState();
  const [totalTax, setTotalTax] = useState();
  const [totalDiscount, setTotalDiscount] = useState();
  const { language } = useSelector((state) => state.language);

  const [paymentOption, setPaymentOption] = useState(location?.state?.paymentOption ? location.state?.paymentOption : 1);

  const defaultFormData = {
    street_address: "",
    apt_number: "",
    city: "",
    state: "",
    zip_code: "",
    country: ""
  };
  const defaultFormValidation = {
    street_address: "",
    apt_number: "",
    city: "",
    state: "",
    zip_code: "",
    country: ""
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);

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
    <>{screenWidth > ScreenResolutions.Width ? <Payments /> : <ResponsivePayment /> }</>
  );

};

export default Payment;
