import "Pages/Booking/Pages/Booking/Booking.css";
import { ScreenResolutions } from "Constants/Constants";
import { useEffect, useState } from "react";
import RePayments from "./RePayments/RePayments";
import ResponsiveRePayment from "./ResponsiveRePayment/ResponsiveRePayment";

const RePayment = () => {

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
    <>{screenWidth > ScreenResolutions.Width ? <RePayments /> : <ResponsiveRePayment /> }</>
  );

};

export default RePayment;
