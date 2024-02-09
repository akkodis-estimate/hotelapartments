import { useCallback, useEffect, useState } from "react";
import { forwardRef } from "react";
// import Select, { components } from 'react-select';
import {
  BsArrowRight,
  BsChevronDown,
  BsDashLg,
  BsEnvelope,
  BsFacebook,
  BsPlusLg,
  BsWhatsapp,
  BsXCircle,
} from "react-icons/bs";
import { MdContentCopy } from "react-icons/md";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoMdPricetags } from "react-icons/io";
import GridIcon from "Assets/Images/FeaturedPropertiesIcons/GridIcon";
import ListIcon from "Assets/Images/FeaturedPropertiesIcons/ListIcon";
import PropertiesCard from "Pages/Properties/FeaturedProperties/Components/PropertiesCard/PropertiesCard";
import PropertiesMap from "Pages/Properties/FeaturedProperties/Components/PropertiesMap/PropertiesMap";
import "Pages/Properties/FeaturedProperties/featuredproperties.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import maskingActions from "reducers/masking/masking.actions";
import featureApartmentService from "Services/featureApartmentService";
import dropdownService from "Services/dropdownService";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import LocationPinIcon from "Assets/Images/FeaturedPropertiesIcons/LocationPinIcon";
import FilterSettingsIcon from "Assets/Images/FeaturedPropertiesIcons/FilterSettingsIcon";
import NoFilterImg from "Assets/Images/PropertiesDetailsIcons/NoFilterImg.png";
import BedroomIcon from "Assets/Images/FeaturedPropertiesIcons/BedroomIcon";
import ShareIcon from "Assets/Images/PropertiesDetailsIcons/ShareIcon";
import { SetDynamicEndpoint, customFilterForSelect, dateFormat } from "Helpers/commonMethodHelper";
import {
  dropdown_filters_handler,
  range_filters_handler,
} from "Helpers/listHelper";
import { APARTMENT_SORT_BY, DATE_FORMATS, OTHER_FILTERS, RoutePaths, ScreenResolutions, USER_TYPE } from "Constants/Constants";
import { DatePickerInput } from "@mantine/dates";
import { RangeSlider, Select, Group, Avatar, Text } from "@mantine/core";
import SearchIcon from "Assets/Images/BookingIcons/SearchIcon";
import FeaturedMap from "Components/Shared/GoogleMap/FeaturedMap";
import MaximizeIcon from "Assets/Images/FeaturedPropertiesIcons/MaximizeIcon";
import MinimizeIcon from "Assets/Images/FeaturedPropertiesIcons/MinimizeIcon";
import { toast } from "react-toastify";
import { Rating } from '@mantine/core';
import ResponsiveMoreFilter from "./Components/ResponsiveApartmentList/ResponsiveApartmentList";
import ApartmentList from "./Components/ApartmentList/ApartmentList";
import ResponsiveApartmentList from "./Components/ResponsiveApartmentList/ResponsiveApartmentList";

const FeaturedProperties = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [state, setState] = useState(location.state);
  const [firstLoad, setFirstLoad] = useState(false);
  const { userDetails } = useSelector((state) => state.customerAuth);
  const { language } = useSelector((state) => state.language);

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
    <>{screenWidth > ScreenResolutions.Width ? <ApartmentList /> : <ResponsiveApartmentList /> }</>
  );
};

export default FeaturedProperties;
