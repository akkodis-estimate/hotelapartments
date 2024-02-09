import { ScreenResolutions } from "Constants/Constants";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ResponsivePropertiesDetails from "./ResponsivePropertyDetails/ResponsivePropertyDetails";
import PropertiesDetails from "./PropertyDetail/PropertiesDetails";


const PropertiesDetail = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [state, setState] = useState(location.state);
  const [firstLoad, setFirstLoad] = useState(false);
  const { userDetails } = useSelector((state) => state.customerAuth);
  const { language,currency_code } = useSelector((state) => state.language);

  const navigate = useNavigate();
  //const screenWidth = window.innerWidth;
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
    <>{screenWidth > ScreenResolutions.Width ? <PropertiesDetails /> : <ResponsivePropertiesDetails /> }</>
  );
};

export default PropertiesDetail;
