import { useCallback, useEffect, useState } from "react";
import { forwardRef } from "react";
// import Select, { components } from 'react-select';
import {
  BsArrowLeft,
  BsArrowRight,
  BsEnvelope,
  BsExclamationCircle,
  BsWhatsapp,
  BsXCircle,
} from "react-icons/bs";
import "Pages/Properties/FeaturedProperties/featuredproperties.css";
import "Pages/Properties/FeaturedProperties/Components/ResponsiveApartmentList/ResponsiveApartmentList.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import maskingActions from "reducers/masking/masking.actions";
import featureApartmentService from "Services/featureApartmentService";
import dropdownService from "Services/dropdownService";
import LocationPinIcon from "Assets/Images/FeaturedPropertiesIcons/LocationPinIcon";
import FilterSettingsIcon from "Assets/Images/FeaturedPropertiesIcons/FilterSettingsIcon";
import NoFilterImg from "Assets/Images/PropertiesDetailsIcons/NoFilterImg.png";
import {
  SetDynamicEndpoint,
  customFilterForSelect,
  dateFormat,
  emailInquiry,
  navigateToWhatsApp,
} from "Helpers/commonMethodHelper";
import {
  dropdown_filters_handler,
  range_filters_handler,
} from "Helpers/listHelper";
import {
  APARTMENT_SORT_BY,
  DATE_FORMATS,
  OTHER_FILTERS,
  RoutePaths,
  USER_TYPE,
} from "Constants/Constants";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import {
  RangeSlider,
  Select,
  Group,
  Avatar,
  Text,
  Skeleton,
  Accordion,
} from "@mantine/core";
import SearchIcon from "Assets/Images/BookingIcons/SearchIcon";
import FeaturedMap from "Components/Shared/GoogleMap/FeaturedMap";
import MaximizeIcon from "Assets/Images/FeaturedPropertiesIcons/MaximizeIcon";
import MinimizeIcon from "Assets/Images/FeaturedPropertiesIcons/MinimizeIcon";
import { toast } from "react-toastify";
import { Rating } from "@mantine/core";

// For Mobile UI

import { useDisclosure } from "@mantine/hooks";
import { Drawer } from "@mantine/core";
import SortingIconSm from "Assets/Images/FeaturedPropertiesIcons/SortingIconSm";
import FUserIcon from "Assets/Images/FeaturedPropertiesIcons/FUserIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import FShower from "Assets/Images/FeaturedPropertiesIcons/FShower";
import ResonsivePropertiesCard from "../ResponsivePropertiesCard/ResponsivePropertiesCard";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import MapIcon from "Assets/Images/HomeIcons/MapIcon";
import BuildingIcon from "Assets/Images/HomeIcons/BuildingIcon";
import AreasListModal from "../AreasList/AreasList";
import HotelsModal from "../HotelsList/HotelsList";
import CrossIcon from "Assets/Images/HomeIcons/CrossIcon";
import { GrMap } from "react-icons/gr";
import PropertiesIcon from "Assets/Images/FeaturedPropertiesIcons/PropertiesIcon";

const ResponsiveApartmentList = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [state, setState] = useState(location.state);
  const [firstLoad, setFirstLoad] = useState(false);
  const { userDetails } = useSelector((state) => state.customerAuth);
  const { language, currency_code } = useSelector((state) => state.language);
  // const [opened, { open, close }] = useDisclosure(false); // For Mobile Filter drawer
  // const [openedSortDD, { openSortDD, closeSortDD }] = useDisclosure(false); // For Mobile Filter drawer
  const [forFilter, setForFilter] = useState(false); // For Mobile Filter drawer
  const [forSort, setForSort] = useState(false); // For Mobile Filter drawer

  const navigate = useNavigate();

  const PriceFilter = [
    {
      key: 1,
      value: t("common_lables.under") + " 6,000",
      from_value: 0,
      to_value: 6000,
    },
    { key: 2, value: "6,000 - 10,000", from_value: 6000, to_value: 10000 },
    { key: 3, value: "10,000 - 20,000", from_value: 10000, to_value: 20000 },
    {
      key: 4,
      value: t("common_lables.above") + " 20,000",
      from_value: 20000,
      to_value: "",
    },
  ];

  const bedroomsArr = [
    {
      key: 0,
      value: "studio",
      label: "pages.properties.feature_properties.studio",
      is_checked: false,
    },
    { key: 3, value: 3, label: "3", is_checked: false },
    { key: 6, value: 6, label: "6", is_checked: false },
    { key: 1, value: 1, label: "1", is_checked: false },
    { key: 4, value: 4, label: "4", is_checked: false },
    { key: 7, value: 7, label: "7", is_checked: false },
    { key: 2, value: 2, label: "2", is_checked: false },
    { key: 5, value: 5, label: "5", is_checked: false },
    { key: 8, value: 8, label: "8+", is_checked: false },
  ];

  const bathroomsArr = [
    { key: 1, value: 1, label: "1", is_checked: false },
    { key: 2, value: 2, label: "2", is_checked: false },
    { key: 3, value: 3, label: "3", is_checked: false },
    { key: 1.5, value: 1.5, label: "1.5", is_checked: false },
    { key: 2.5, value: 2.5, label: "2.5", is_checked: false },
    { key: 3.5, value: 3.5, label: "3.5+", is_checked: false },
  ];

  var list_params = {
    page_number: 1,
    page_size: 6,
    sort_column: "",
    sort_direction: "",
    filters: "",
    search_text: "",
    status: 5,
  };

  var metaData = {
    page: 1,
    page_size: 6,
    total_results: 0,
    total_in_progress: 0,
    total_page_num: 0,
  };

  const [bedroomsData, setBedroomsData] = useState(bedroomsArr);
  const [bathroomsData, setBathroomsData] = useState(bathroomsArr);

  //For Maps zoom in-out close
  const [MaximumMap, setMaximumMap] = useState(false);

  //For Maps Aside Design
  const [MapAside, setMapAside] = useState(false);

  const [displayTab, setDisplayTab] = useState(true); //This state is for list and grid view  &  Make true if want Grid By default
  const [specialOffer, setSpecialOffer] = useState(false);
  const [corporatespecialOffer, setCorporateSpecialOffer] = useState(false);
  const [featuredApartmentFilter, setFeaturedApartmentFilter] = useState(false);

  //const [filterSorting, setfilterSorting] = useState(false);
  const [apartmnetList, setApartmentList] = useState([]);

  // const [displayedData, setDisplayedData] = useState([]);
  // const [itemsPerPage, setItemsPerPage] = useState(6);

  const [listParams, setlistParams] = useState(list_params);
  const [listParamsBackup, setlistParamsBackup] = useState(list_params);

  const [meta, setMetaData] = useState(metaData);
  const dispatch = useDispatch(); // For calling Reducers
  //const navigate = useNavigate();

  //FOR SORT BY
  const [sortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [shareDropdownOpen, setIsShareDropdownOpen] = useState(false);

  const [sortSelect, setSortSelect] = useState(0);

  //FOR FILTERS
  const [filterData, setFilterData] = useState([]);
  const [locationValue, setLocationValue] = useState(null); //City Value
  const [searchValues, SetSearchValues] = useState([]);

  const [areaValues, setAreaValues] = useState([]);
  const [areaSID, setAreaSID] = useState(null); //Area SID

  const [propAptValues, setPropAptValues] = useState([]);
  const [propAptSID, setPropAptSID] = useState(null); //Property/Apt SID

  //const [cityCountryDropdown, setCityCountryDropdown] = useState([]);
  const [apartmentAmenities, setApartmentAmenities] = useState([]);
  const [propertyAmenities, setPropertyAmenities] = useState([]);

  const [dateValue, setDateValue] = useState([null, null]);

  //Bedroom Bathroom Filters States
  const [isStudio, setIsStudio] = useState(false);
  const [bathroomsCount, setBathroomsCount] = useState(1);
  const [bedroomsCount, setBedroomsCount] = useState(1);
  const [isBedroomDropdownOpen, setIsBedroomDropdownOpen] = useState(false);
  const [isBedroomBathroomFilterApplied, setIsBedroomBathroomFilterApplied] =
    useState(false);
  const [filteredBedroomsCount, setFilteredBedroomsCount] = useState(1);
  const [filteredBedroomsString, setFilteredBedroomsString] = useState("");

  //Price Filter States
  const [priceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isPriceFilterApplied, setIsPriceFilterApplied] = useState(false);
  const [priceFilterString, setPriceFilterString] = useState("");

  //More Filters States
  const [isMoreFilterDropdownOpen, setIsMoreFilterDropdownOpen] =
    useState(false);
  const [isMoreFilterApplied, setIsMoreFilterApplied] = useState(false);
  //const [priceFilter, setPriceFilter] = useState();

  const [minpriceFilter, setMinPriceFilter] = useState();
  const [maxpriceFilter, setMaxPriceFilter] = useState();

  const [ratingValue, setRatingValue] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const [moreFiterCount, setMoreFiterCount] = useState(0);

  const [mapDetails, setMapDetails] = useState([]);

  const [allMasterValues, setAllMasterValues] = useState([]);
  const [propertyAmenitiesLoaded, setPropertyAmenitiesLoaded] = useState(false);
  const [apartmentAmenitiesLoaded, setApartmentAmenitiesLoaded] =
    useState(false);

  const [homeSearchLoaded, setHomeSearchLoaded] = useState(false);
  const [quotationSID, setQuotationSID] = useState(null);

  const [showAllAreas, setShowAllAreas] = useState(false);
  const [showAllHotels, setShowAllHotels] = useState(false);

  const [startDateFromQuoteParam, setStartDateFromQuoteParam] = useState(null);
  const [endDateFromQuoteParam, setEndDateFromQuoteParam] = useState(null);

  const { isMasked } = useSelector((state) => state.masking);

  const { isLoading } = useSelector((state) => state.customerAuth);

  const [loadingData, setLoadingData] = useState(true);

  const [shouldAddClass, setShouldAddClass] = useState(false); // For Sticky Filter

  const selectedLang =
    localStorage.getItem("i18nextLng") === "en-US"
      ? "en"
      : localStorage.getItem("i18nextLng") || "en";
  //const filterKeys = ["city_sid", "area_sid", "location_sid", "is_special_offer", "is_corporate_special_offer", "cap_filter", "room_type", "no_of_rooms", "no_of_bathrooms", "apartment_amenities", "property_amenities", "property_ratings"]

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    //This useEffect is to check if url has quotation_sid and if yes then check user is logged in or not
    //if not logged in then redirect to login page else
    //check that quotation is matched with logged in use if yes then same with filtered data else redirect to all apartments list.
    dispatch(maskingActions.showMasking());
    const searchParams = new URLSearchParams(location.search);
    const quotationSid = searchParams.get("quotation_sid");
    //const customerSID = searchParams.get("ref");
    const startDateFromQuoteParam = searchParams.get("checkIn");
    const endDateFromQuoteParam = searchParams.get("checkOut");

    //Below two "if" condition is for Quotation link and also check for logged in flow and for given customer.
    //#region
    // if (quotationSid && !userDetails) {
    //   setQuotationSID(quotationSid);
    //   navigate(`${SetDynamicEndpoint(RoutePaths.AUTHORISATION.SIGN_IN)}`, {
    //     state: {
    //       // returnPath: `${SetDynamicEndpoint(
    //       //   RoutePaths.PROPERTIES.FEATURED_PPROPERTIES +
    //       //   "?quotation_sid=" +
    //       //   quotationSid +
    //       //   "&ref=" +
    //       //   customerSID
    //       // )}`,
    //       returnPath: `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + '?quotation_sid=' + quotationSid + '&ref=' + customerSID + '&checkIn=' + startDateFromQuoteParam + '&checkOut=' + endDateFromQuoteParam)}`
    //     },
    //   });
    // }

    // if (quotationSid && userDetails) {
    //   if (userDetails?.customer_sid === customerSID) {
    //     setQuotationSID(quotationSid);
    //     // navigate(
    //     //   `${SetDynamicEndpoint(
    //     //     RoutePaths.PROPERTIES.FEATURED_PPROPERTIES +
    //     //     "?quotation_sid=" +
    //     //     quotationSid +
    //     //     "&ref=" +
    //     //     customerSID
    //     //   )}`
    //     // );
    //     navigate(`${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + '?quotation_sid=' + quotationSid + '&ref=' + customerSID + '&checkIn=' + startDateFromQuoteParam + '&checkOut=' + endDateFromQuoteParam)}`)
    //   } else {
    //     location.search = "";
    //     navigate(
    //       `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`
    //     );
    //   }
    // }
    //#endregion

    if (quotationSid) {
      setQuotationSID(quotationSid);
      setStartDateFromQuoteParam(searchParams.get("checkIn"));
      setEndDateFromQuoteParam(searchParams.get("checkOut"));
    }
  }, []);

  const onGridClick = () => {
    setDisplayTab(true);
    //setDisplayedData(apartmnetList.slice(0, itemsPerPage));
  };
  const onListClick = () => {
    setDisplayTab(false);
    //setDisplayedData(apartmnetList.slice(0, itemsPerPage));
  };

  const home_search_dropdown = async () => {
    await dropdownService
      .get_apartment_amenities_dropdown()
      .then((res) => {
        //dispatch(maskingActions.showMasking());
        const newArray = res.data?.map((obj) => ({
          ...obj,
          value: obj.amenity_id,
          label: obj.title,
          is_checked: false,
          url_label: obj.title,
        }));
        //setApartmentAmenities(newArray);
        newArray.forEach((item) => {
          if (!apartmentAmenities.find((f) => f.value === item.value)) {
            apartmentAmenities.push(item);
          }
        });
        setApartmentAmenitiesLoaded(true);
      })
      .finally(() => {
        setApartmentAmenitiesLoaded(true);
        //dispatch(maskingActions.hideMasking());
      });

    await dropdownService
      .get_property_amenities_dropdown()
      .then((res) => {
        //dispatch(maskingActions.showMasking());
        const newArray = res.data?.map((obj) => ({
          ...obj,
          value: obj.facility_id,
          label: obj.title, //selectedLang === "ru" ? obj?.russian_title : obj.title,
          is_checked: false,
          url_label: obj.title,
        }));
        newArray.forEach((item) => {
          if (!propertyAmenities.find((f) => f.value === item.value)) {
            propertyAmenities.push(item);
          }
        });
        //setPropertyAmenities(newArray);
        setPropertyAmenitiesLoaded(true);
      })
      .finally(() => {
        setPropertyAmenitiesLoaded(true);
        //dispatch(maskingActions.hideMasking());
      });

    await dropdownService
      .get_home_search()
      .then((res) => {
        //dispatch(maskingActions.showMasking());
        if (res.data) {
          const newArray = res.data?.map((obj) => ({
            ...obj,
            value: obj.primary_sid,
            label: obj.name,
            group: obj.entity_name,
            type: obj.type,
            link: obj.link,
          }));
          newArray.forEach((item) => {
            allMasterValues.push(item);
          });
          //getPropertyApartmentList();
          //SetSearchValues(newArray);
          setHomeSearchLoaded(true);
        } else {
          setAllMasterValues([]);
          //getPropertyApartmentList();
          setHomeSearchLoaded(true);
        }
      })
      .catch(() => {
        //getPropertyApartmentList();
        setHomeSearchLoaded(true);
      })
      .finally(() => {
        setHomeSearchLoaded(true);
        //dispatch(maskingActions.hideMasking());
      });
  };

  useEffect(() => {
    const PriceFilter = [
      {
        key: 1,
        value: t("common_lables.under") + " 6,000",
        from_value: 0,
        to_value: 6000,
      },
      { key: 2, value: "6,000 - 10,000", from_value: 6000, to_value: 10000 },
      { key: 3, value: "10,000 - 20,000", from_value: 10000, to_value: 20000 },
      {
        key: 4,
        value: t("common_lables.above") + " 20,000",
        from_value: 20000,
        to_value: "",
      },
    ];

    const apartment_list = setTimeout(() => {
      home_search_dropdown().then(() => {
        //getPropertyApartmentList(true);
      });
    }, 500);

    return () => {
      clearTimeout(apartment_list);
    };
  }, []);

  const dropdown = () => {
    // dropdownService.get_country_city_dropdown().then((res) => {
    //   const newArray = res.data?.map((obj) => ({
    //     ...obj,
    //     value: obj.city_sid,
    //     //label: obj.city_country,
    //     label: obj.city_name,
    //     description: obj.country_name,
    //   }));
    //   setCityCountryDropdown(newArray);
    // });
    // dropdownService.get_home_search().then((res) => {
    //   if (res.data) {
    //     const newArray = res.data?.map((obj) => ({
    //       ...obj,
    //       value: obj.primary_sid,
    //       label: obj.name,
    //       group: obj.entity_name,
    //       type: obj.type,
    //       link: obj.link
    //     }));
    //     newArray.forEach((item) => {
    //       searchValues.push(item);
    //     })
    //     getPropertyApartmentList();
    //     //SetSearchValues(newArray);
    //   } else {
    //     SetSearchValues([]);
    //     getPropertyApartmentList();
    //   }
    // }).catch(() => {
    //   getPropertyApartmentList();
    // });
    // dropdownService.get_apartment_amenities_dropdown().then((res) => {
    //   const newArray = res.data?.map((obj) => ({
    //     ...obj,
    //     value: obj.amenity_id,
    //     label: obj.title,
    //     is_checked: false,
    //   }));
    //   setApartmentAmenities(newArray);
    // });
    // dropdownService.get_property_amenities_dropdown().then((res) => {
    //   const newArray = res.data?.map((obj) => ({
    //     ...obj,
    //     value: obj.facility_id,
    //     label: obj.title,
    //     is_checked: false,
    //   }));
    //   setPropertyAmenities(newArray);
    // });
  };

  // useEffect(() => {
  //   dropdown();
  // }, []);

  const SelectItem = forwardRef(
    ({ image, label, description, ...others }, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <LocationPinIcon />

          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" opacity={0.65}>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  const AreaSelectItem = forwardRef(
    ({ image, label, description, ...others }, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <GrMap size={22} className="areaIconColor" />

          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" opacity={0.65}>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  const PASelectItem = forwardRef(
    ({ image, label, description, ...others }, ref) => (
      <div ref={ref} {...others}>
        <Group noWrap>
          <PropertiesIcon className="propertyIconColor" />

          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" opacity={0.65}>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    )
  );

  const extractValue = (url, regex) => {
    const matches = url.match(regex);
    return matches && matches.length > 1 ? matches[1] : null;
  };

  const getPropertyApartmentList = useCallback(async () => {
    const apartment_list = setTimeout(() => {
      //debugger
      var filter;
      const searchParams = new URLSearchParams(location.search);
      var urlListParmas = { ...listParamsBackup };
      const url = window.location.href;
      // Extract "city_name"
      // const cityName = extractValue(url, /^http:\/\/[^/]+\/([^/]+)/) || extractValue(url, /^https:\/\/[^/]+\/([^/]+)/);
      const cityName =
        extractValue(url, /^http?:\/\/[^/]+\/([^/?]+)/) ||
        extractValue(url, /^https?:\/\/[^/]+\/([^/?]+)/);
      // Extract "area_name"
      const areaName = extractValue(url, /\/a\/([^/]+)/);
      // Extract "property/Apartment_name"
      const locationName = extractValue(url, /\/p\/([^/]+)/);

      //Extract Filters
      const urlWithoutQueryParams = url?.split("?")[0]; // Remove query parameter portion from the URL
      const filtersInURL = extractValue(urlWithoutQueryParams, /\/f\/([^/]+)/);

      const quotationSid = searchParams.get("quotation_sid");

      //For Location Value Read
      if (
        !firstLoad &&
        allMasterValues &&
        allMasterValues?.length > 0 &&
        cityName != "furnished-serviced-rentals"
      ) {
        filter = filter ? [...filter] : [];
        if (cityName) {
          var searchSID = allMasterValues?.find(
            (x) => x.link === cityName
          )?.primary_sid;
          if (searchSID) {
            var cityObj = {
              key: "city_sid",
              value: searchSID,
              condition: "=",
            };
            filter.push(cityObj);
            //setFilterData([...filter]);
            var updatedLocationValue = { value: searchSID };
            setLocationValue(updatedLocationValue.value);
          }
        }

        if (areaName && cityName) {
          var areaSID = allMasterValues?.find(
            (x) => x.link === cityName + "/a/" + areaName
          )?.primary_sid;
          if (areaSID) {
            var areaObj = {
              key: "area_sid",
              value: areaSID,
              condition: "=",
            };
            filter.push(areaObj);
            //setFilterData([...filter]);
            var updatedLocationValue1 = { value: areaSID };
            setAreaSID(updatedLocationValue1.value);
          }
        }

        if (locationName && areaName && cityName) {
          var locationSID = allMasterValues?.find(
            (x) => x.link === cityName + "/a/" + areaName + "/p/" + locationName
          )?.primary_sid;
          if (locationSID) {
            var locationObj = {
              key: "location_sid",
              value: locationSID,
              condition: "=",
            };
            filter.push(locationObj);
            //setFilterData([...filter]);
            var updatedLocationValue2 = { value: locationSID };
            setPropAptSID(updatedLocationValue2.value);
          }
        }
        setFilterData([...filter]);
      }

      //For Query Params
      if (!firstLoad) {
        filter = filter ? [...filter] : [];
        const searchParams = new URLSearchParams(location.search);
        setSortSelect(0);
        setSpecialOffer(false);
        setCorporateSpecialOffer(false);
        for (const name of searchParams.keys()) {
          if (name === "checkIn") {
            urlListParmas = {
              ...urlListParmas,
              cap_filter: `[{"start_date":"${searchParams.get(
                "checkIn"
              )}","end_date":"${searchParams.get("checkOut")}"}]`,
            };
            setDateValue([
              new Date(searchParams.get("checkIn")),
              new Date(searchParams.get("checkOut")),
            ]);
          }
          if (name === "sort") {
            const val = searchParams.get(name);
            var sortData = APARTMENT_SORT_BY.find((f) => f.value === val);
            setSortSelect(sortData.key);
            urlListParmas = {
              ...urlListParmas,
              sort_column: sortData?.sort_column,
              sort_direction: sortData?.sort_direction,
            };

            if (val === "featured_first") {
              urlListParmas = {
                ...urlListParmas,
                //is_featured: "featured",
              };
            } else {
              urlListParmas = {
                ...urlListParmas,
                //is_featured: null,
              };
            }
          }

          if (name === "specialOffer") {
            urlListParmas = {
              ...urlListParmas,
              is_special_offer: "special",
            };
            setSpecialOffer(true);
          }

          if (
            userDetails?.type == USER_TYPE.CORPORATE_USER &&
            name === "corporateOffer"
          ) {
            urlListParmas = {
              ...urlListParmas,
              is_corporate_special_offer: "special",
            };
            setCorporateSpecialOffer(true);
          }

          if (name === "featuredApartment") {
            urlListParmas = {
              ...urlListParmas,
              is_featured: "featured",
            };
            setFeaturedApartmentFilter(true);
          }

          if (name == "quotation_sid")
            if (quotationSid) {
              var qouteObj = {
                key: "quotation_sid",
                value: quotationSid,
                condition: "=",
              };
              filter.push(qouteObj);
            }
        }
        //setFilterData([...filter]);
      }

      //For Other Filters
      if (!firstLoad && filtersInURL) {
        filter = filter ? [...filter] : [];
        var keyValuePair = filtersInURL.split(",");
        for (const item of keyValuePair) {
          //debugger
          const keyValue = item.split("_");
          const kvpObj = OTHER_FILTERS.find((f) => f.urlKey === keyValue[0]);
          // if (kvpObj.urlKey === "studio") {
          //   var obj = {
          //     key: kvpObj.key,
          //     value: 6,
          //     condition: "=",
          //   };
          //   filter.push(obj);
          //   //setFilterData([...filter]);
          //   setIsBedroomBathroomFilterApplied(true);
          //   setFilteredBedroomsCount(null);
          //   setIsStudio(true);
          // }
          // if (kvpObj.urlKey === "bathrooms") {
          //   var obj = {
          //     key: kvpObj.key,
          //     value: Number(keyValue[1]),
          //     condition: "=",
          //   };
          //   filter.push(obj);
          //   //setFilterData([...filter]);
          //   setIsBedroomBathroomFilterApplied(true);
          //   setBathroomsCount(Number(keyValue[1]));
          // }
          // if (kvpObj.urlKey === "bedrooms") {
          //   var obj1 = {
          //     key: kvpObj.key,
          //     value: Number(keyValue[1]),
          //     condition: "=",
          //   };
          //   var obj2 = {
          //     key: "room_type",
          //     value: "",
          //     condition: "=",
          //   };
          //   filter.push(obj1);
          //   filter.push(obj2);

          //   //setFilterData([...filter]);
          //   setIsBedroomBathroomFilterApplied(true);
          //   setBedroomsCount(Number(keyValue[1]));
          //   setFilteredBedroomsCount(Number(keyValue[1]));
          //   setIsStudio(false);
          // }

          if (kvpObj.urlKey == "bedrooms") {
            const nameValues = keyValue[1]?.split("-");
            // const IdValues = apartmentAmenities
            //   ?.map((item) => {
            //     if (nameValues.includes(item.url_label)) return item.value;
            //   })
            //   .filter((f) => f !== undefined);
            bedroomsData
              ?.forEach((item) => {
                if (nameValues.includes(item.value.toString())) {
                  item.is_checked = true;
                }
              })
              ?.filter((f) => f !== undefined);

            var BedObj = {
              key: kvpObj.key,
              value: nameValues?.join(","),
              condition: kvpObj.condition,
              is_json: "true",
            };
            filter.push(BedObj);

            setIsBedroomBathroomFilterApplied(true);
            //setBedroomsCount(Number(keyValue[1]));
            setFilteredBedroomsString((prevString) =>
              nameValues ? `${nameValues.join("; ")} beds` : prevString
            );
            //setIsStudio(false);
          }
          if (kvpObj.urlKey == "bathrooms") {
            const nameValues = keyValue[1]?.split("-");
            // const IdValues = propertyAmenities
            //   ?.map((item) => {
            //     if (nameValues.includes(item.url_label)) return item.value;
            //   })
            //   .filter((f) => f !== undefined);
            bathroomsData
              ?.forEach((item) => {
                if (nameValues.includes(item.value.toString())) {
                  item.is_checked = true;
                }
              })
              ?.filter((f) => f !== undefined);
            var Bathobj = {
              key: kvpObj.key,
              value: nameValues?.join(","),
              condition: kvpObj.condition,
              is_json: "true",
            };
            filter.push(Bathobj);

            setIsBedroomBathroomFilterApplied(true);
            setFilteredBedroomsString((prevString) =>
              nameValues
                ? `${prevString}${prevString ? ", " : ""}${nameValues.join(
                  "; "
                )} baths`
                : prevString
            );
          }

          if (kvpObj.urlKey === "prices") {
            var values = keyValue[1]?.split("-");
            var obj1 = {
              key: kvpObj.key,
              value: "",
              start_value: Number(values[0]),
              end_value: Number(values[1]),
              condition: kvpObj.condition,
            };
            var obj2 = {
              key: kvpObj.key,
              value: Number(values[0]),
              condition: ">",
            };
            filter.push(values[1] !== "" ? obj1 : obj2);
            //setFilterData([...filter]);
            setIsPriceFilterApplied(true);
            // setPriceFilterString(
            //   Number(values[0]) +
            //   " - " +
            //   (values[1] !== "" ? Number(values[1]) : " & more")
            // );
            setPriceFilterString(
              Number(values[0]) +
              (values[1] !== "" ? " - " + Number(values[1]) : " & more")
            );
            // setMinPriceFilter(Number(values[0]));
            // setMaxPriceFilter(Number(values[1]));
            setMinPriceFilter((values[0] && values[0] != "") ? Number(values[0]) : "");
            setMaxPriceFilter((values[1] && values[1] != "") ? Number(values[1]) : "");
          }

          if (kvpObj.urlKey == "apartmentAmenities") {
            //const nameValues = keyValue[1]?.split("-");
            const nameValues = keyValue[1]
              ?.split("-")
              ?.map((value) => value?.replace(/%20/g, " "));
            const IdValues = apartmentAmenities
              ?.map((item) => {
                if (nameValues.includes(item.url_label)) return item.value;
              })
              .filter((f) => f !== undefined);
            apartmentAmenities.forEach((item) => {
              if (IdValues.includes(item.value) === true) {
                item.is_checked = true;
              }
            });
            var obj = {
              key: kvpObj.key,
              value: IdValues?.join(","),
              condition: kvpObj.condition,
              is_json: "true",
            };
            filter.push(obj);

            //setFilterData([...filter]);
            setIsMoreFilterApplied(true);
          }
          if (kvpObj.urlKey == "buildingAmenities") {
            //const nameValues = keyValue[1]?.split("-");
            const nameValues = keyValue[1]
              ?.split("-")
              ?.map((value) => value?.replace(/%20/g, " "));
            const IdValues = propertyAmenities
              ?.map((item) => {
                if (nameValues.includes(item.url_label)) return item.value;
              })
              .filter((f) => f !== undefined);
            propertyAmenities.forEach((item) => {
              if (IdValues.includes(item.value) === true) {
                item.is_checked = true;
              }
            });
            var obj = {
              key: kvpObj.key,
              value: IdValues?.join(","),
              condition: kvpObj.condition,
              is_json: "true",
            };
            filter.push(obj);

            //setFilterData([...filter]);
            setIsMoreFilterApplied(true);
          }

          if (kvpObj.urlKey == "ratings") {
            var obj = {
              key: kvpObj.key,
              value: keyValue[1],
              condition: kvpObj.condition,
            };
            filter.push(obj);

            //setFilterData([...filter]);
            setIsMoreFilterApplied(true);
            setRatingValue(keyValue[1]);
          }
        }
        setFilterData([...filter]);

        var cnt = 0;
        filter?.map((item) => {
          if (item?.key === "apartment_amenities") {
            cnt += item.value?.split(",")?.length;
          }
          if (item?.key === "property_amenities") {
            cnt += item.value?.split(",")?.length;
          }
        });
        setMoreFiterCount(cnt);
      }

      //#region URL for Quotation

      // const quotationSid = searchParams.get("quotation_sid");
      // const startDateFromQuoteParam = searchParams.get("checkIn");
      // const endDateFromQuoteParam = searchParams.get("checkOut");

      // if (quotationSid) {
      //   // var jsonObj =
      //   //   listParams.filters && listParams.filters !== ""
      //   //     ? JSON.parse(listParams.filters)
      //   //     : [];
      //   filter = filter ? [...filter] : [];
      //   if (!filter.find((f) => f.key === "quotation_sid")) {
      //     filter = [
      //       ...filter,
      //       {
      //         key: "quotation_sid",
      //         value: quotationSid,
      //         condition: "=",
      //       },
      //     ];
      //     setFilterData([...filter]);
      //   }

      // if (!firstLoad && startDateFromQuoteParam && endDateFromQuoteParam) {
      //   urlListParmas = {
      //     ...urlListParmas,
      //     cap_filter: `[{"start_date":"${searchParams.get("checkIn")}","end_date":"${searchParams.get("checkOut")}"}]`
      //   }
      //   setDateValue([new Date(searchParams.get("checkIn")), new Date(searchParams.get("checkOut"))])
      // }
      //}
      //#endregion

      var params = {
        ...listParams,
        filters:
          filter && filter.length > 0
            ? JSON.stringify(filter)
            : listParams.filters,
        customer_id: userDetails?.customer_id,
        cap_filter: urlListParmas.cap_filter ? urlListParmas.cap_filter : null,
        sort_column: urlListParmas.sort_column
          ? urlListParmas.sort_column
          : null,
        sort_direction: urlListParmas.sort_direction
          ? urlListParmas.sort_direction
          : null,
        is_featured: urlListParmas.is_featured ? urlListParmas.is_featured : null,
        is_special_offer: urlListParmas.is_special_offer ? "special" : null,
        is_corporate_special_offer: urlListParmas.is_corporate_special_offer
          ? "special"
          : null,
      };
      setlistParamsBackup({ ...params });
      // listParams = {
      //   ...listParams,
      //   filters: filter && filter.length > 0 ? JSON.stringify(filter) : listParams.filters,
      //   customer_id: userDetails?.customer_id,
      //   cap_filter: urlListParmas.cap_filter ? urlListParmas.cap_filter : null,
      //   sort_column: urlListParmas.sort_column ? urlListParmas.sort_column : null,
      //   sort_direction: urlListParmas.sort_direction ? urlListParmas.sort_direction : null,
      //   is_featured: urlListParmas.is_featured ? urlListParmas.is_featured : null,
      //   is_special_offer: urlListParmas.is_special_offer ? "special" : null,
      //   is_corporate_special_offer: urlListParmas.is_corporate_special_offer ? "special" : null,
      // }
      dispatch(maskingActions.showMasking());
      featureApartmentService
        .feature_apartment_list(params)
        .then((res) => {
          setApartmentList(res.data.results.list);
          var mapDetails = [];

          // res.data?.results?.list?.forEach((element) => {
          //   if (element && element?.property_details != null) {
          //     if (
          //       !mapDetails?.find(
          //         (x) => x.property_id == element?.property_details?.property_id
          //       )
          //     ) {
          //       mapDetails.push(element?.property_details);
          //     }
          //   }
          // });

          res.data?.results?.list?.forEach((element) => {
            if (element && element?.property_details != null) {
              if (
                !mapDetails?.find(
                  (x) => x.property_id == element?.property_details?.property_id
                )
              ) {
                var obj = {
                  ...element?.property_details,
                  apartment_details: [element],
                };
                mapDetails.push(obj);
              } else {
                var obj = mapDetails?.find(
                  (x) => x.property_id == element?.property_details?.property_id
                );
                obj.apartment_details.push(element);
              }
            }
          });
          setMapDetails(mapDetails);
          setMetaData(res.data.meta);

          // const newText = filterData?.length > 0 ? 's/' + JSON.stringify(filterData) : '';
          // const newUrl = `${RoutePaths.PROPERTIES.FEATURED_PPROPERTIES}/${newText}`;
          // window.history.pushState({}, '', newUrl);
        })
        .finally(() => {
          setState(null);
          setFirstLoad(true);
          setLoadingData(false);
          dispatch(maskingActions.hideMasking());
        });
      // }
    }, 500);

    return () => {
      clearTimeout(apartment_list);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listParams]);

  useEffect(() => {
    //dispatch(maskingActions.showMasking());
    const apartment_list = setTimeout(() => {
      if (
        apartmentAmenitiesLoaded &&
        propertyAmenitiesLoaded &&
        homeSearchLoaded
      ) {
        getPropertyApartmentList();
        //dispatch(maskingActions.showMasking());
      }
    }, 100);

    return () => {
      clearTimeout(apartment_list);
    };
  }, [
    apartmentAmenitiesLoaded,
    language,
    currency_code,
    propertyAmenitiesLoaded,
    homeSearchLoaded,
    listParams,
    getPropertyApartmentList,
  ]);

  // useEffect(() => {
  //   if (apartmnetList?.length > 0) {
  //     setDisplayedData(apartmnetList.slice(0, itemsPerPage));
  //   } //if(apartmnetList === undefined || apartmnetList == null || apartmnetList?.length <= 0)
  //   else {
  //     setDisplayedData([]);
  //   }
  // }, [apartmnetList, itemsPerPage]);

  //CITY - AREA - PROPERT/APT FILTER
  const getFilterDropdown = async () => {
    await cityDropdownFn();
  };

  const cityDropdownFn = async () => {
    dropdownService
      .get_all_city_dropdown()
      .then((res) => {
        SetSearchValues(
          res.data.map((obj) => ({
            ...obj,
            value: obj.primary_sid,
            label: obj.name,
            group: obj.entity_name,
            type: obj.type,
            link: obj.link,
          }))
        );
      })
      .catch((err) => {

      })
      .finally(() => { });
  };

  const areaDropdownFn = async (city_sid) => {
    dropdownService
      .get_area_dropdown(city_sid)
      .then((res) => {
        setAreaValues(
          res.data.map((obj) => ({
            ...obj,
            value: obj.primary_sid,
            label: obj.name,
            group: obj.entity_name,
            type: obj.type,
            link: obj.link,
          }))
        );
      })
      .catch((err) => {

      })
      .finally(() => { });
  };

  const propAptDropdownFn = async (area_sid) => {
    dropdownService
      .get_prop_apt_dropdown(area_sid)
      .then((res) => {
        setPropAptValues(
          res.data.map((obj) => ({
            ...obj,
            value: obj.primary_sid,
            label: obj.name,
            group: obj.entity_name,
            type: obj.type,
            link: obj.link,
          }))
        );
      })
      .catch((err) => {

      })
      .finally(() => { });
  };

  const handleRatingClick = (selectedRating) => {
    if (selectedRating === ratingValue) {
      setRatingValue(0); // Reset rating if the same rating is clicked again
    } else {
      setRatingValue(selectedRating);
    }
  };

  const handleRatingHover = (index) => {
    setHoveredRating(index);
  };

  useEffect(() => {
    const city_list = setTimeout(() => {
      //dispatch(maskingActions.showMasking());
      getFilterDropdown().finally(() => {
        //dispatch(maskingActions.hideMasking());
      });
    }, 100);

    return () => {
      clearTimeout(city_list);
    };
  }, [language, currency_code]);

  useEffect(() => {
    const area_dropdown = setTimeout(() => {
      if (locationValue) {
        //area_dropdown
        // const cityData = searchValues?.find(
        //   (x) => x.primary_sid === Number(searchValues)
        // );
        //if (cityData && cityData.primary_sid) {
        //dispatch(maskingActions.showMasking());
        areaDropdownFn(locationValue).finally(() => {
          //dispatch(maskingActions.hideMasking());
        });
        //}
      }
    }, 100);

    return () => {
      clearTimeout(area_dropdown);
    };
  }, [locationValue, language, currency_code]); //filterObject.country_id,

  useEffect(() => {
    const prop_apt_dropdown = setTimeout(() => {
      if (areaSID) {
        //filterObject.city_id !== 0 &&
        // const areaData = areaValues?.find(
        //   (x) => x.primary_sid === Number(areaValues)
        // );
        //if (areaData && areaData?.primary_sid) {
        dispatch(maskingActions.showMasking());
        propAptDropdownFn(areaSID).finally(() => {
          dispatch(maskingActions.hideMasking());
        });
        //}
      }
    }, 100);

    return () => {
      clearTimeout(prop_apt_dropdown);
    };
  }, [areaSID, language, currency_code]);

  useEffect(() => { }, [state]);

  // const loadMoreData = () => {
  //   const nextPageEndIndex = displayedData?.length + itemsPerPage;
  //   setDisplayedData(apartmnetList.slice(0, nextPageEndIndex));
  // };

  const setSortByIndex = (index) => {
    setSortSelect(index);
  };

  const sortBy = (
    sort_column = "",
    sort_direction = "",
    isFeatured = false
  ) => {
    if (isFeatured) {
      setlistParams((previousState) => {
        return {
          ...previousState,
          sort_column: sort_column,
          sort_direction: sort_direction,
          //is_featured: "featured",
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          sort_column: sort_column,
          sort_direction: sort_direction,
          //is_featured: "featured",
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
    } else {
      setlistParams((previousState) => {
        return {
          ...previousState,
          sort_column: sort_column,
          sort_direction: sort_direction,
          //is_featured: null,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          sort_column: sort_column,
          sort_direction: sort_direction,
          //is_featured: null,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
    }
    setIsSortByDropdownOpen(false);
  };

  const onSpecialOfferFilter = (flag) => {
    setlistParams((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        is_special_offer: flag === true ? "special" : null,
      };
    });
    setlistParamsBackup((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        is_special_offer: flag === true ? "special" : null,
      };
    });
    setQueryParams("specialOffer", 1);
  };

  const onCorporateSpecialOfferFilter = (flag) => {
    setlistParams((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        is_corporate_special_offer: flag === true ? "special" : null,
      };
    });
    setlistParamsBackup((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        is_corporate_special_offer: flag === true ? "special" : null,
      };
    });
    setQueryParams("corporateOffer", 1);
  };

  const onFeaturedApartmentFilter = (flag) => {
    setlistParams((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        is_featured: flag === true ? "featured" : null,
      };
    });
    setlistParamsBackup((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        is_featured: flag === true ? "featured" : null,
      };
    });
    setQueryParams("featuredApartment", 1);
  };

  // FOR FILTER

  // const DropdownIndicator = (props) => {
  //   return (
  //     components.DropdownIndicator && (
  //       <components.DropdownIndicator {...props}>
  //         <LocationPinIcon />
  //       </components.DropdownIndicator>
  //     )
  //   );
  // };

  const handleDropdownFilter = (key, value, condition = "=") => {
    //debugger
    var filters = [...filterData];

    if (key == "city_sid") {
      // && (!value || value == null || value == "")
      filters = filters.filter((x) => x.key !== "area_sid");
      setAreaValues([]);
      setAreaSID(null);
      filters = filters.filter((x) => x.key !== "location_sid");
      setPropAptValues([]);
      setPropAptSID(null);
      if (value) {
        setLocationFiltersURL(
          "city",
          searchValues?.find((x) => x.value === value)?.link
        );
      } else {
        setLocationFiltersURL("city", "furnished-serviced-rentals");
      }
    }

    if (key == "area_sid") {
      //&& (!value || value == null || value == "")
      filters = filters.filter((x) => x.key !== "location_sid");
      setPropAptValues([]);
      setPropAptSID(null);
      // if (value) {
      //   setLocationFiltersURL(
      //     "area",
      //     areaValues?.find((x) => x.value === value)?.link
      //   );
      // } else {
      //   setLocationFiltersURL("area", null);
      // }
    }

    if (key == "location_sid") {
      // if (value) {
      //   setLocationFiltersURL(
      //     "location",
      //     propAptValues?.find((x) => x.value === value)?.link
      //   );
      // } else {
      //   setLocationFiltersURL("location", null);
      // }
    }
    if (value) {
      filters = dropdown_filters_handler(key, value, filters, condition);
    } else {
      filters = filters.filter((x) => x.key !== key);
    }
    setFilterData(filters);
    if (key == "city_sid") {
      onFilter(filters);
    }
  };

  // const handleRangeFilter = (
  //   key,
  //   value,
  //   start_value,
  //   end_value,
  //   condition = "between"
  // ) => {
  //   var filters = [...filterData];
  //   if (end_value !== false && end_value != null) {
  //     filters = range_filters_handler(
  //       key,
  //       value,
  //       start_value,
  //       end_value,
  //       filters,
  //       condition
  //     );
  //     setFilterData(filters);
  //     onFilter(filters);
  //   } else if (start_value === false && end_value === false) {
  //     filters = filters.filter((x) => x.key !== key);
  //     setFilterData(filters);
  //     onFilter(filters);
  //   }
  // };

  const handleRangeFilter = (key, value, start_value, end_value) => {
    if (end_value !== false && end_value != null) {
      setlistParams((previousState) => {
        return {
          ...previousState,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
          cap_filter:
            start_value && end_value
              ? `[{"start_date":"${start_value}","end_date":"${end_value}"}]`
              : null,
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
          cap_filter:
            start_value && end_value
              ? `[{"start_date":"${start_value}","end_date":"${end_value}"}]`
              : null,
        };
      });
      setQueryParams("date", start_value + "," + end_value);
    } else if (start_value === false && end_value === false) {
      setlistParams((previousState) => {
        return {
          ...previousState,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
          cap_filter: null,
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
          cap_filter: null,
        };
      });
      setQueryParams("date", null);
    }
  };

  const onFilter = (filters_data) => {
    setlistParams((prevState) => {
      return {
        ...prevState,
        page_number: 1,
        filters: filters_data?.length > 0 ? JSON.stringify(filters_data) : "",
      };
    });
    setlistParamsBackup((prevState) => {
      return {
        ...prevState,
        page_number: 1,
        filters: filters_data?.length > 0 ? JSON.stringify(filters_data) : "",
      };
    });
  };

  const setLocationFiltersURL = (key, value) => {
    var url = window.location.pathname;
    var newUrl = "";

    switch (key) {
      case "city":
        var tempArr = url.split("/");
        var city = url.substring(
          1,
          tempArr.length > 2 ? url.indexOf("/", 2) : url.length
        );
        var area = url.split("/a/")[1];
        newUrl = url.replace(city, value);
        newUrl =
          area && area?.length > 0
            ? newUrl.replace(
              "/a/" +
              area?.substring(
                0,
                area.includes("/f/") ? area.indexOf("/f/", 1) : area.length
              ),
              ""
            )
            : newUrl;
        if (window.location.search) {
          newUrl = newUrl + window.location.search;
        }
        window.history.pushState({}, "", newUrl);
        break;

      case "area":
        var tempArr = url?.split("/a/");
        var area =
          tempArr?.length >= 2
            ? tempArr[1].substring(0, tempArr[1]?.indexOf("/", 1))
            : value
              ? value?.split("/a/")[1]
              : "";
        if (tempArr?.length >= 2) {
          newUrl = url.replace(
            url?.substring(
              url.indexOf("/a/", 1),
              url.includes("/f/") ? url.indexOf("/f/") : url.length
            ),
            value ? "/a/" + value?.split("/a/")[1] : ""
          );
        } else {
          newUrl =
            value + (url.split("/f/")[1] ? "/f/" + url.split("/f/")[1] : "");
        }
        if (window.location.search) {
          newUrl = newUrl + window.location.search;
        }
        break;

      case "location":
        var tempArr = url?.split("/p/");
        var location =
          tempArr?.length >= 2
            ? tempArr[1].substring(0, tempArr[1]?.indexOf("/", 1))
            : value
              ? value?.split("/p/")[1]
              : "";
        if (tempArr?.length >= 2) {
          newUrl = url.replace(
            url?.substring(
              url.indexOf("/p/", 1),
              url.includes("/f/") ? url.indexOf("/f/") : url.length
            ),
            value ? "/p/" + value?.split("/p/")[1] : ""
          );
        } else {
          newUrl =
            value + (url.split("/f/")[1] ? "/f/" + url.split("/f/")[1] : "");
        }
        if (window.location.search) {
          newUrl = newUrl + window.location.search;
        }
        break;
      default:
        break;
    }
    window.history.pushState({}, "", "/");
    window.history.pushState({}, "", newUrl);
  };

  const setOtherFiltersURL = (key, value) => {
    var newURL = "";
    var urlFilters = [];
    if (window.location.pathname?.includes("/f/")) {
      urlFilters = window.location.pathname
        ?.split("/f/")[1]
        ?.split(",")
        ?.map((item) => {
          var kvp = item.split("_");
          return { key: kvp[0], value: kvp[1] };
        });
    }
    //debugger
    if (value) {
      var obj = urlFilters.find((f) => f.key === key);
      if (obj) {
        obj.value = value;
      } else {
        urlFilters.push({ key: key, value: value });
      }
    } else {
      urlFilters = urlFilters.filter((f) => f.key !== key);
    }

    var newFilterUrl = urlFilters
      .map((item) => {
        return item.key + "_" + item.value;
      })
      ?.join(",");
    newURL =
      window.location.pathname.split("/f/")[0] +
      (newFilterUrl.length > 0 ? "/f/" + newFilterUrl : "");
    if (window.location.search) {
      newURL = newURL + window.location.search;
    }
    window.history.pushState({}, "", "/");
    window.history.pushState({}, "", newURL);
  };

  const setQueryParams = (key, value) => {
    var newURL = "";
    var searchQuery = window.location.search;
    var searchParams = window.location.search
      ?.replace("?", "")
      ?.split("&")
      ?.map((item) => {
        var kvp = item.split("=");
        return { key: kvp[0], value: kvp[1] };
      });
    searchParams = searchParams.filter((f) => f.key !== "");
    var newSearchQuery = "";
    switch (key) {
      case "sort":
        if (value) {
          var Obj = searchParams.find((x) => x.key == "sort");
          if (Obj) {
            Obj.value = value;
          } else {
            searchParams.push({ key: "sort", value: value });
          }
        } else {
          searchParams = searchParams.filter((f) => f.key !== "sort");
        }
        break;
      case "date":
        if (value) {
          var checkInObj = searchParams.find((x) => x.key == "checkIn");
          if (checkInObj) {
            checkInObj.value = value.split(",")[0];
          } else {
            searchParams.push({ key: "checkIn", value: value.split(",")[0] });
          }

          var checkOutObj = searchParams.find((x) => x.key == "checkOut");
          if (checkOutObj) {
            checkOutObj.value = value.split(",")[1];
          } else {
            searchParams.push({ key: "checkOut", value: value.split(",")[1] });
          }
        } else {
          searchParams = searchParams.filter((f) => f.key !== "checkIn");
          searchParams = searchParams.filter((f) => f.key !== "checkOut");
        }

        break;

      case "specialOffer":
        if (value) {
          var specialOfferObj = searchParams.find(
            (x) => x.key == "specialOffer"
          );
          if (specialOfferObj) {
            specialOfferObj.value = value;
          } else {
            searchParams.push({ key: "specialOffer", value: value });
          }
        } else {
          searchParams = searchParams.filter((f) => f.key !== "specialOffer");
        }
        break;

      case "corporateOffer":
        if (value) {
          var corporateOfferObj = searchParams.find(
            (x) => x.key == "corporateOffer"
          );
          if (corporateOfferObj) {
            corporateOfferObj.value = value;
          } else {
            searchParams.push({ key: "corporateOffer", value: value });
          }
        } else {
          searchParams = searchParams.filter((f) => f.key !== "corporateOffer");
        }
        break;

      case "featuredApartment":
        if (value) {
          var featuredApartmentObj = searchParams.find(
            (x) => x.key == "featuredApartment"
          );
          if (featuredApartmentObj) {
            featuredApartmentObj.value = value;
          } else {
            searchParams.push({ key: "featuredApartment", value: value });
          }
        } else {
          searchParams = searchParams.filter((f) => f.key !== "featuredApartment");
        }
        break;

      default:
        break;
    }

    newSearchQuery = searchParams
      .map((item) => {
        return item.key + "=" + item.value;
      })
      ?.join("&");
    newURL =
      window.location.pathname +
      (newSearchQuery.length > 0 ? "?" + newSearchQuery : "");
    window.history.pushState({}, "", "/");
    window.history.pushState({}, "", newURL);
  };

  const handleIncrement = (isFromBedrooms, isFromBathrooms) => {
    if (isFromBedrooms && bedroomsCount < 10) {
      setBedroomsCount(bedroomsCount + 1);
    }
    if (isFromBathrooms && bathroomsCount < 10) {
      setBathroomsCount(bathroomsCount + 0.5);
    }
  };

  const handleDecrement = (isFromBedrooms, isFromBathrooms) => {
    if (isFromBedrooms && bedroomsCount > 1) {
      setBedroomsCount(bedroomsCount - 1);
    }
    if (isFromBathrooms && bathroomsCount > 1) {
      setBathroomsCount(bathroomsCount - 0.5);
    }
  };

  const bedbathFilterApply = () => {
    var filters = [...filterData];

    const keys = ["room_type", "no_of_rooms", "no_of_bathrooms"];
    filters = filters.filter((x) => !keys.includes(x.key));

    if (isStudio) {
      var obj = [
        { key: "room_type", value: 6, condition: "=" },
        { key: "no_of_bathrooms", value: bathroomsCount, condition: "=" },
      ];
      setFilteredBedroomsCount(null);
      filters?.push(...obj);

      setOtherFiltersURL("studio", "1");
      setOtherFiltersURL("bedrooms", null);
      setOtherFiltersURL("bathrooms", bathroomsCount);
    } else {
      var obj1 = [
        { key: "room_type", value: "", condition: "=" },
        { key: "no_of_rooms", value: bedroomsCount, condition: "=" },
        { key: "no_of_bathrooms", value: bathroomsCount, condition: "=" },
      ];
      setFilteredBedroomsCount(bedroomsCount);
      filters?.push(...obj1);

      setOtherFiltersURL("studio", null);
      setOtherFiltersURL("bedrooms", bedroomsCount);
      setOtherFiltersURL("bathrooms", bathroomsCount);
    }
    setFilterData(filters);
    onFilter(filters);
    setIsBedroomBathroomFilterApplied(true);
    closeDropdown();
  };

  const bedbathFilterReset = () => {
    //If filter applied then reset the filter and its value
    if (isBedroomBathroomFilterApplied) {
      //const keys = ["room_type", "no_of_rooms", "no_of_bathrooms"];

      const keys = ["no_of_rooms", "no_of_bathrooms"];

      var filters = [...filterData];
      filters = filters.filter((x) => !keys.includes(x.key));

      setFilterData(filters);
      onFilter(filters);
      setIsBedroomBathroomFilterApplied(false);

      const updatedBedrooms = bedroomsData?.map((item) => ({
        ...item,
        is_checked: false,
      }));
      setBedroomsData(updatedBedrooms);

      const updatedBathrooms = bathroomsData?.map((item1) => ({
        ...item1,
        is_checked: false,
      }));
      setBathroomsData(updatedBathrooms);

      // setIsStudio(false);
      // setBathroomsCount(1);
      // setBedroomsCount(1);

      //setOtherFiltersURL("studio", null);
      setOtherFiltersURL("bedrooms", null);
      setOtherFiltersURL("bathrooms", null);
    } else {
      //Only reset the value
      //setIsStudio(false);
      //setBathroomsCount(1);
      //setBedroomsCount(1);

      setIsBedroomBathroomFilterApplied(false);

      const updatedBedrooms = bedroomsData?.map((item) => ({
        ...item,
        is_checked: false,
      }));
      setBedroomsData(updatedBedrooms);

      const updatedBathrooms = bathroomsData?.map((item1) => ({
        ...item1,
        is_checked: false,
      }));
      setBathroomsData(updatedBathrooms);
    }
    closeDropdown();
  };

  const closeDropdown = () => {
    setIsBedroomDropdownOpen(false);
  };

  //Price Filter Methods
  const priceFilterApply = () => {
    var filters = [...filterData];

    const keys = ["monthly_price"];
    //debugger
    filters = filters.filter((x) => !keys.includes(x.key));

    var obj = [];
    if (minpriceFilter || maxpriceFilter) {
      if (maxpriceFilter) {
        obj.push({
          key: "monthly_price",
          value: "",
          start_value: minpriceFilter ? minpriceFilter : 0,
          end_value: maxpriceFilter,
          condition: "between",
        });
        setPriceFilterString(obj[0].start_value + " - " + obj[0].end_value);
      } else {
        obj.push({
          key: "monthly_price",
          value: minpriceFilter ? minpriceFilter : 0,
          condition: ">",
        });
        setPriceFilterString(obj[0].value + " & more");
      }
    }
    filters?.push(...obj);
    setFilterData(filters);
    onFilter(filters);
    setIsPriceFilterApplied(true);
    closePriceDropdown();

    setOtherFiltersURL("prices", minpriceFilter + "-" + maxpriceFilter);
  };

  const priceFilterReset = () => {
    //If filter applied then reset the filter and its value
    if (isPriceFilterApplied) {
      const keys = ["monthly_price"];

      var filters = [...filterData];
      filters = filters.filter((x) => !keys.includes(x.key));

      setFilterData(filters);
      onFilter(filters);
      setIsPriceFilterApplied(false);
      setMinPriceFilter("");
      setMaxPriceFilter("");

      setOtherFiltersURL("prices", null);
    } else {
      //Only reset the value
      setMinPriceFilter("");
      setMaxPriceFilter("");
      setIsPriceFilterApplied(false);
    }
    closePriceDropdown();
  };

  const closePriceDropdown = () => {
    setIsPriceDropdownOpen(false);
  };

  const handleCheckboxChange = (event, index, value, checkbox_type) => {
    if (checkbox_type === 1) {
      var ameneties_list = [...apartmentAmenities];
      ameneties_list[index].is_checked = event.target.checked;
      setApartmentAmenities(ameneties_list);
    } else if (checkbox_type === 2) {
      var property_ameneties_list = [...propertyAmenities];
      property_ameneties_list[index].is_checked = event.target.checked;
      setPropertyAmenities(property_ameneties_list);
    }
  };

  const handleCheckboxChangeForBedBath = (
    event,
    index,
    value,
    checkbox_type
  ) => {
    if (checkbox_type === 1) {
      var bedrooms_list = [...bedroomsData];
      bedrooms_list[index].is_checked = event.target.checked;
      setBedroomsData(bedrooms_list);
    } else if (checkbox_type === 2) {
      var bathrooms_list = [...bathroomsData];
      bathrooms_list[index].is_checked = event.target.checked;
      setBathroomsData(bathrooms_list);
    }
  };

  const moreFiltersApply = () => {
    var filters = [...filterData];

    //const keys = ["apartment_amenities", "property_amenities", "daily_price"];
    const keys = [
      "apartment_amenities",
      "property_amenities",
      "property_ratings",
    ];

    filters = filters.filter((x) => !keys.includes(x.key));

    var apartmentSelectedIds = apartmentAmenities
      .map((item) => {
        if (item.is_checked) return item.value;
      })
      .filter((value) => value !== undefined);

    var propertySelectedIds = propertyAmenities
      .map((item) => {
        if (item.is_checked) return item.value;
      })
      .filter((value) => value !== undefined);

    var apartmentSelectedNames = apartmentAmenities
      .map((item) => {
        if (item.is_checked) return item.url_label;
      })
      .filter((value) => value !== undefined);

    var propertySelectedNames = propertyAmenities
      .map((item) => {
        if (item.is_checked) return item.url_label;
      })
      .filter((value) => value !== undefined);

    var obj = [];
    // if (minpriceFilter || maxpriceFilter) {
    //   obj = [
    //     {key: "apartment_amenities", value: apartmentSelectedIds.length > 0 ? apartmentSelectedIds.join(",") : null, condition: "in", is_json: "true"},
    //     {key: "property_amenities", value: propertySelectedIds.length > 0 ? propertySelectedIds.join(",") : null, condition: "in", is_json: "true"},
    //     {key: "daily_price", value: "", start_value: minpriceFilter, end_value: maxpriceFilter, condition: "between"}
    //   ];
    // } else {
    //   obj = [
    //     {key: "apartment_amenities", value: apartmentSelectedIds.length > 0 ? apartmentSelectedIds.join(",") : null, condition: "in", is_json: "true"},
    //     {key: "property_amenities", value: propertySelectedIds.length > 0 ? propertySelectedIds.join(",") : null, condition: "in", is_json: "true"}
    //   ];
    // }

    obj = [
      {
        key: "apartment_amenities",
        value: apartmentSelectedIds.join(",") || null,
        condition: "in",
        is_json: "true",
      },
      {
        key: "property_amenities",
        value: propertySelectedIds.join(",") || null,
        condition: "in",
        is_json: "true",
      },
    ];

    // if (minpriceFilter || maxpriceFilter) {
    //   if (maxpriceFilter) {
    //     obj.push({ key: 'daily_price', value: '', start_value: minpriceFilter ? minpriceFilter : 0, end_value: maxpriceFilter, condition: 'between' });
    //   }
    //   else {
    //     obj.push({ key: 'daily_price', value: minpriceFilter ? minpriceFilter : 0, condition: '>' });
    //   }
    // }

    if (ratingValue) {
      obj.push({ key: "property_ratings", value: ratingValue, condition: "=" });
      setOtherFiltersURL("ratings", ratingValue);
    } else {
      setOtherFiltersURL("ratings", null);
    }

    filters?.push(...obj);

    setFilterData(filters);
    onFilter(filters);
    setIsMoreFilterApplied(true);
    setMoreFiterCount(apartmentSelectedIds.length + propertySelectedIds.length); // + (priceFilter ? 1 : 0)

    closeMoreFilterDropdown();

    setOtherFiltersURL("apartmentAmenities", apartmentSelectedNames.join("-"));
    setOtherFiltersURL("buildingAmenities", propertySelectedNames.join("-"));
  };

  const moreFilterReset = () => {
    //If filter applied then reset the filter and its value
    if (isMoreFilterApplied) {
      //const keys = ["apartment_amenities", "property_amenities", "daily_price"];
      const keys = [
        "apartment_amenities",
        "property_amenities",
        "property_ratings",
      ];

      var filters = [...filterData];
      filters = filters.filter((x) => !keys.includes(x.key));

      setFilterData(filters);
      onFilter(filters);
      setIsMoreFilterApplied(false);
      setRatingValue(0);
      // setMinPriceFilter('');
      // setMaxPriceFilter('');
      //setPriceFilter([0, 25000]);
      const updatedAmenities = apartmentAmenities.map((amenity) => ({
        ...amenity,
        is_checked: false,
      }));
      setApartmentAmenities(updatedAmenities);
      const updatedPropertyAmenities = propertyAmenities.map(
        (propertyAmenity) => ({
          ...propertyAmenity,
          is_checked: false,
        })
      );
      setPropertyAmenities(updatedPropertyAmenities);

      setOtherFiltersURL("ratings", null);
      setOtherFiltersURL("apartmentAmenities", null);
      setOtherFiltersURL("buildingAmenities", null);
    } else {
      //Only reset the value
      //setPriceFilter([0, 25000]);
      // setMinPriceFilter('');
      // setMaxPriceFilter('');
      setRatingValue(0);
      const updatedAmenities = apartmentAmenities.map((amenity) => ({
        ...amenity,
        is_checked: false,
      }));
      setApartmentAmenities(updatedAmenities);
      const updatedPropertyAmenities = propertyAmenities.map(
        (propertyAmenity) => ({
          ...propertyAmenity,
          is_checked: false,
        })
      );
      setPropertyAmenities(updatedPropertyAmenities);
    }
    setIsMoreFilterApplied(false);
    closeMoreFilterDropdown();
    setMoreFiterCount(0);
  };

  const closeMoreFilterDropdown = () => {
    setIsMoreFilterDropdownOpen(false);
  };

  const clearAllFilters = () => {
    setFilterData([]);
    setSpecialOffer(false);
    setCorporateSpecialOffer(false);
    setFeaturedApartmentFilter(false);
    setLocationValue(null);
    setAreaSID(null);
    setPropAptSID(null);

    bedbathFilterReset();
    moreFilterReset();
    priceFilterReset();

    setlistParams((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        page_size: 6,
        filters: "",
        search_text: "",
        is_featured: null,
        is_special_offer: null,
        cap_filter: null,
        is_corporate_special_offer: null,
      };
    });
    setlistParamsBackup((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        page_size: 6,
        filters: "",
        search_text: "",
        is_featured: null,
        is_special_offer: null,
        cap_filter: null,
        is_corporate_special_offer: null,
      };
    });

    setDateValue([null, null]);
    // bedbathFilterReset();
    // moreFilterReset();
    // priceFilterReset();
    setFilterData([]);
    navigate(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
    //window.location.reload();
  };

  const onSearch = (e) => {
    const applyCSS = document.querySelector(".mantine-Select-dropdown");

    if (e != "" && e?.length > 0) {
      if (applyCSS !== null) {
        applyCSS.style.display = "block";
      }
    } else {
      if (applyCSS !== null) {
        applyCSS.style.display = "block";
      }
    }
  };

  const setPriceRange = (data) => {
    if (data) {
      setMinPriceFilter(data?.from_value);
      setMaxPriceFilter(data?.to_value);
    }
  };

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        toast.success(t("toaster_message.link_copied"));
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard:", error);
      });
  };

  const handleEmailClick = () => {
    //const recipientEmail = 'example@example.com'; // Replace with the recipient's email address
    const subject = "Shared Property By Service Apartment"; // Replace with the subject of the email
    const body =
      "Hello, I would like to share apartment with you: " +
      window.location.href; // Replace with the body of the email

    const emailContent = `mailto:info@hotelapartments.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = emailContent;
  };

  const handleFacebookClick = () => {
    const fixedContent = "Hello, I would like to share apartment with you: ";
    const shareUrl = window.location.href; // Replace with your website URL

    // Generate the Facebook share URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(fixedContent)}`;

    // Open the Facebook share dialog in a new window
    window.open(facebookShareUrl, "_blank");
  };

  const applyFiltersForResponsive = () => {
    var filters = [...filterData];

    //#region AREA, Prop/APT filter
    if (areaSID) {
      setLocationFiltersURL(
        "area",
        areaValues?.find((x) => x.value === areaSID)?.link
      );
    } else {
      setLocationFiltersURL("area", null);
      if (locationValue) {
        setLocationFiltersURL(
          "city",
          searchValues?.find((x) => x.value === locationValue)?.link
        );
      } else {
        setLocationFiltersURL("city", "furnished-serviced-rentals");
      }
    }

    if (areaSID) {
      if (propAptSID) {
        setLocationFiltersURL(
          "location",
          propAptValues?.find((x) => x.value === propAptSID)?.link
        );
      } else {
        setLocationFiltersURL("location", null);
        if (areaSID) {
          setLocationFiltersURL(
            "area",
            areaValues?.find((x) => x.value === areaSID)?.link
          );
        } else {
          setLocationFiltersURL("area", null);
          if (locationValue) {
            setLocationFiltersURL(
              "city",
              searchValues?.find((x) => x.value === locationValue)?.link
            );
          } else {
            setLocationFiltersURL("city", "furnished-serviced-rentals");
          }
        }
      }
    }

    //#endregion AREA, Prop/APT filter

    //#region Date Filter
    if (dateValue[1]) {
      if (
        dateFormat(dateValue[1], DATE_FORMATS.YMD) !== false &&
        dateFormat(dateValue[1], DATE_FORMATS.YMD) != null
      ) {
        setlistParams((previousState) => {
          return {
            ...previousState,
            filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
            cap_filter:
              dateFormat(dateValue[0], DATE_FORMATS.YMD) &&
                dateFormat(dateValue[1], DATE_FORMATS.YMD)
                ? `[{"start_date":"${dateFormat(
                  dateValue[0],
                  DATE_FORMATS.YMD
                )}","end_date":"${dateFormat(
                  dateValue[1],
                  DATE_FORMATS.YMD
                )}"}]`
                : null,
          };
        });
        setlistParamsBackup((previousState) => {
          return {
            ...previousState,
            filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
            cap_filter:
              dateFormat(dateValue[0], DATE_FORMATS.YMD) &&
                dateFormat(dateValue[1], DATE_FORMATS.YMD)
                ? `[{"start_date":"${dateFormat(
                  dateValue[0],
                  DATE_FORMATS.YMD
                )}","end_date":"${dateFormat(
                  dateValue[1],
                  DATE_FORMATS.YMD
                )}"}]`
                : null,
          };
        });
        setQueryParams(
          "date",
          dateFormat(dateValue[0], DATE_FORMATS.YMD) +
          "," +
          dateFormat(dateValue[1], DATE_FORMATS.YMD)
        );
      }
    } else if (
      dateFormat(dateValue[0], DATE_FORMATS.YMD) === false &&
      dateFormat(dateValue[1], DATE_FORMATS.YMD) === false
    ) {
      setlistParams((previousState) => {
        return {
          ...previousState,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
          cap_filter: null,
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
          cap_filter: null,
        };
      });
      setQueryParams("date", null);
    } else if (!dateValue[1]) {
      setDateValue([null, null]);
    }
    //#endregion Date Filter

    //#region BedBath Filter
    //const BedBathkeys = ["room_type", "no_of_rooms", "no_of_bathrooms"];
    const BedBathkeys = ["no_of_rooms", "no_of_bathrooms"];
    filters = filters.filter((x) => !BedBathkeys.includes(x.key));

    // if (isStudio) {
    //   var obj = [
    //     { key: "room_type", value: 6, condition: "=" },
    //     { key: "no_of_bathrooms", value: bathroomsCount, condition: "=" },
    //   ];
    //   setFilteredBedroomsCount(null);
    //   filters?.push(...obj);

    //   setOtherFiltersURL("studio", "1");
    //   setOtherFiltersURL("bedrooms", null);
    //   setOtherFiltersURL("bathrooms", bathroomsCount);
    // } else {
    //   var obj1 = [
    //     { key: "room_type", value: "", condition: "=" },
    //     { key: "no_of_rooms", value: bedroomsCount, condition: "=" },
    //     { key: "no_of_bathrooms", value: bathroomsCount, condition: "=" },
    //   ];
    //   setFilteredBedroomsCount(bedroomsCount);
    //   filters?.push(...obj1);

    //   setOtherFiltersURL("studio", null);
    //   setOtherFiltersURL("bedrooms", bedroomsCount);
    //   setOtherFiltersURL("bathrooms", bathroomsCount);
    // }

    var bedroomsSelected = bedroomsData
      .map((item) => {
        if (item.is_checked) return item.value;
      })
      .filter((value) => value !== undefined);

    var bathroomsSelected = bathroomsData
      .map((item) => {
        if (item.is_checked) return item.value;
      })
      .filter((value) => value !== undefined);

    var obj = [];
    // var obj = [
    //   {
    //     key: "no_of_rooms",
    //     value: bedroomsSelected.join(",") || null,
    //     condition: "in"
    //   },
    //   {
    //     key: "no_of_bathrooms",
    //     value: bathroomsSelected.join(",") || null,
    //     condition: "in"
    //   },
    // ];

    if (bedroomsSelected?.length > 0) {
      obj.push({
        key: "no_of_rooms",
        value: bedroomsSelected.join(",") || null,
        condition: "in",
      });

      setOtherFiltersURL("bedrooms", bedroomsSelected.join("-"));
    }
    if (bathroomsSelected?.length > 0) {
      obj.push({
        key: "no_of_bathrooms",
        value: bathroomsSelected.join(",") || null,
        condition: "in",
      });

      setOtherFiltersURL("bathrooms", bathroomsSelected.join("-"));
    }

    filters?.push(...obj);

    if (bedroomsSelected?.length <= 0) {
      setOtherFiltersURL("bedrooms", null);
    }
    if (bathroomsSelected?.length <= 0) {
      setOtherFiltersURL("bathrooms", null);
    }

    // setFilteredBedroomsString(
    //   (bedroomsSelected?.length > 0 ? bedroomsSelected.join(", ") + " beds" : "") +
    //   (bathroomsSelected?.length > 0 ? (bedroomsSelected?.length > 0 ? ", " : "") + bathroomsSelected.join("; ") + " baths" : "")
    // );

    setFilteredBedroomsString((prevString) => {
      if (bedroomsSelected) {
        const bedroomsContainStudio = bedroomsSelected.includes("studio");
        const studioLabel = selectedLang === "ru" ? "Студия" : "Studio";

        if (bedroomsContainStudio) {
          const valuesWithoutStudio = bedroomsSelected.filter(
            (value) => value !== "studio"
          );
          const bedroomsString =
            valuesWithoutStudio.length > 0
              ? `${studioLabel}; ${valuesWithoutStudio.join("; ")} ` +
              t("common_lables.beds")
              : `${studioLabel}`;
          return (
            bedroomsString +
            (bathroomsSelected?.length > 0
              ? `, ${bathroomsSelected.join("; ")} ` + t("common_lables.baths")
              : "")
          );
        } else {
          return (
            (bedroomsSelected?.length > 0
              ? bedroomsSelected.join(", ") + " " + t("common_lables.beds")
              : "") +
            (bathroomsSelected?.length > 0
              ? (bedroomsSelected?.length > 0 ? ", " : "") +
              bathroomsSelected.join("; ") +
              " " +
              t("common_lables.baths")
              : "")
          );
        }
      } else {
        return prevString;
      }
    });

    setFilterData(filters);
    onFilter(filters);
    setIsBedroomBathroomFilterApplied(true);
    closeDropdown();
    //#endregion BedBath Filter

    //#region Price Filter
    const keys = ["monthly_price"];
    filters = filters.filter((x) => !keys.includes(x.key));

    var obj = [];
    if (minpriceFilter == "" && maxpriceFilter == "") {
      setFilterData(filters);
      onFilter(filters);
      setIsPriceFilterApplied(false);
      setMinPriceFilter("");
      setMaxPriceFilter("");

      setOtherFiltersURL("prices", null);
      closePriceDropdown();
    }
    if (minpriceFilter || maxpriceFilter) {
      if (maxpriceFilter) {
        obj.push({
          key: "monthly_price",
          value: "",
          start_value: minpriceFilter ? minpriceFilter : 0,
          end_value: maxpriceFilter,
          condition: "between",
        });
        setPriceFilterString(obj[0].start_value + " - " + obj[0].end_value);
      } else {
        obj.push({
          key: "monthly_price",
          value: minpriceFilter ? minpriceFilter : 0,
          condition: ">",
        });
        setPriceFilterString(obj[0].value + " & more");
      }
      filters?.push(...obj);
      setFilterData(filters);
      onFilter(filters);
      setIsPriceFilterApplied(true);
      closePriceDropdown();

      setOtherFiltersURL("prices", minpriceFilter + "-" + maxpriceFilter);
    }

    //#endregion Price Filter

    //#region More Filter
    const MoreFilterkeys = [
      "apartment_amenities",
      "property_amenities",
      "property_ratings",
    ];

    filters = filters.filter((x) => !MoreFilterkeys.includes(x.key));

    var apartmentSelectedIds = apartmentAmenities
      .map((item) => {
        if (item.is_checked) return item.value;
      })
      .filter((value) => value !== undefined);

    var propertySelectedIds = propertyAmenities
      .map((item) => {
        if (item.is_checked) return item.value;
      })
      .filter((value) => value !== undefined);

    var apartmentSelectedNames = apartmentAmenities
      .map((item) => {
        if (item.is_checked) return item.url_label;
      })
      .filter((value) => value !== undefined);

    var propertySelectedNames = propertyAmenities
      .map((item) => {
        if (item.is_checked) return item.url_label;
      })
      .filter((value) => value !== undefined);

    var obj = [];
    // if (minpriceFilter || maxpriceFilter) {
    //   obj = [
    //     {key: "apartment_amenities", value: apartmentSelectedIds.length > 0 ? apartmentSelectedIds.join(",") : null, condition: "in", is_json: "true"},
    //     {key: "property_amenities", value: propertySelectedIds.length > 0 ? propertySelectedIds.join(",") : null, condition: "in", is_json: "true"},
    //     {key: "daily_price", value: "", start_value: minpriceFilter, end_value: maxpriceFilter, condition: "between"}
    //   ];
    // } else {
    //   obj = [
    //     {key: "apartment_amenities", value: apartmentSelectedIds.length > 0 ? apartmentSelectedIds.join(",") : null, condition: "in", is_json: "true"},
    //     {key: "property_amenities", value: propertySelectedIds.length > 0 ? propertySelectedIds.join(",") : null, condition: "in", is_json: "true"}
    //   ];
    // }

    obj = [
      {
        key: "apartment_amenities",
        value: apartmentSelectedIds.join(",") || null,
        condition: "in",
        is_json: "true",
      },
      {
        key: "property_amenities",
        value: propertySelectedIds.join(",") || null,
        condition: "in",
        is_json: "true",
      },
    ];

    // if (minpriceFilter || maxpriceFilter) {
    //   if (maxpriceFilter) {
    //     obj.push({ key: 'daily_price', value: '', start_value: minpriceFilter ? minpriceFilter : 0, end_value: maxpriceFilter, condition: 'between' });
    //   }
    //   else {
    //     obj.push({ key: 'daily_price', value: minpriceFilter ? minpriceFilter : 0, condition: '>' });
    //   }
    // }

    if (ratingValue) {
      obj.push({ key: "property_ratings", value: ratingValue, condition: "=" });
      setOtherFiltersURL("ratings", ratingValue);
    } else {
      setOtherFiltersURL("ratings", null);
    }

    filters?.push(...obj);

    setFilterData(filters);
    onFilter(filters);
    setIsMoreFilterApplied(true);
    setMoreFiterCount(apartmentSelectedIds.length + propertySelectedIds.length); // + (priceFilter ? 1 : 0)

    closeMoreFilterDropdown();

    setOtherFiltersURL("apartmentAmenities", apartmentSelectedNames.join("-"));
    setOtherFiltersURL("buildingAmenities", propertySelectedNames.join("-"));
    //#endregion More Filter
  };

  const resetFilterForResponsive = async () => {
    //debugger
    //clearAllFilters();
    // setSpecialOffer(false);
    // setCorporateSpecialOffer(false);
    //setLocationValue(null);
    bedbathFilterReset();
    moreFilterReset();
    priceFilterReset();
    setAreaSID(null);
    setPropAptSID(null);
    var filters = filterData?.filter((x) => x.key == "city_sid");
    setFilterData(filters);

    setlistParams((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        page_size: 6,
        filters: JSON.stringify(filters),
        search_text: "",
        // is_featured: null,
        // is_special_offer: null,
        cap_filter: null,
        // is_corporate_special_offer: null,
      };
    });
    setlistParamsBackup((previousState) => {
      return {
        ...previousState,
        page_number: 1,
        page_size: 6,
        filters: JSON.stringify(filters),
        search_text: "",
        // is_featured: null,
        // is_special_offer: null,
        cap_filter: null,
        // is_corporate_special_offer: null,
      };
    });

    setDateValue([null, null]);

    setQueryParams("date", null);

    if (locationValue) {
      setLocationFiltersURL(
        "city",
        searchValues?.find((x) => x.value === locationValue)?.link
      );
    } else {
      setLocationFiltersURL("city", "furnished-serviced-rentals");
    }

    //navigate(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
  };

  const onPrevPage = () => {
    if (meta?.page > 1) {
      setlistParams((previousState) => {
        return {
          ...previousState,
          page_number: meta?.page - 1,
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          page_number: meta?.page - 1,
        };
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  };

  const onNextPage = () => {
    if (meta?.page < meta?.total_page_num) {
      setlistParams((previousState) => {
        return {
          ...previousState,
          page_number: meta?.page + 1,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          page_number: meta?.page + 1,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const disableDates = (date) => {
    if (!dateValue) return false; // No date selected, all dates enabled
    if (dateValue[0]) {
      const startDate = new Date(dateValue[0]);
      const endDate = new Date(dateValue[0]);
      endDate.setDate(endDate.getDate() + 30);
      const openDate = new Date(dateValue[0]);
      openDate.setDate(startDate.getDate() - 30); // Previous 30 days from the selected date

      return (
        (date < startDate ||
          (date < endDate && !isSameDay(date, dateValue[0]))) &&
        date > openDate
      );
    }
  };

  useEffect(() => {
    if (meta?.meta_array && meta?.meta_array?.length > 0) {
      // Create or update meta tags
      let metaDescription = document.querySelector('meta[name="description"]');
      let metaTitle = document.querySelector('meta[name="title"]');
      let titleTag = document.querySelector("title");
      let h1Tag = document.querySelector("h1");
      let canonicalLink = document.querySelector('link[rel="canonical"]');

      if (!metaDescription) {
        // If meta tag doesn't exist, create and add it to the head
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }

      if (!metaTitle) {
        // If meta tag doesn't exist, create and add it to the head
        metaTitle = document.createElement("meta");
        metaTitle.name = "title";
        document.head.appendChild(metaTitle);
        // debugger;
      }

      if (!h1Tag) {
        // If link doesn't exist, create and add it to the head
        h1Tag = document.createElement("h1");
        document.head.appendChild(h1Tag);
      }

      if (!titleTag) {
        //If link doesn't exist, create and add it to the head
        titleTag = document.createElement("title");
        document.head.appendChild(titleTag);
      }

      if (!canonicalLink) {
        // If link doesn't exist, create and add it to the head
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = window.location.href;
        document.head.appendChild(canonicalLink);
      }

      // Update the content of the meta tag
      metaDescription.content = meta?.meta_array[0]?.meta_description
        ? meta?.meta_array[0]?.meta_description
        : "";
      metaTitle.content = meta?.meta_array[0]?.meta_title
        ? meta?.meta_array[0]?.meta_title
        : "";
      h1Tag.textContent = meta?.meta_array[0]?.meta_h1;

      titleTag.textContent = meta?.meta_array[0]?.meta_title ? meta?.meta_array[0]?.meta_title : "Hotel Apartments";

      // You can repeat the above process for other meta tags as well

      // Clean up the effect on component unmount
      return () => {
        // Remove the added/updated meta tags on component unmount
        if (metaDescription) {
          metaDescription.parentNode.removeChild(metaDescription);
        }
        if (metaTitle) {
          metaTitle.parentNode.removeChild(metaTitle);
        }
        if (h1Tag) {
          h1Tag.parentNode.removeChild(h1Tag);
        }
        if (titleTag) {
          titleTag.parentNode.removeChild(titleTag);
        }
        if (canonicalLink) {
          canonicalLink.parentNode.removeChild(canonicalLink);
        }
      };
    }
  }, [meta]); // Empty dependency array ensures the effect runs only once

  const onMapClick = (mapOpen) => {
    dispatch(maskingActions.showMasking());
    if (mapOpen) {
      setlistParams((previousState) => {
        return {
          ...previousState,
          page_number: -1,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          page_number: -1,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
    } else {
      setlistParams((previousState) => {
        return {
          ...previousState,
          page_number: 1,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
      setlistParamsBackup((previousState) => {
        return {
          ...previousState,
          page_number: 1,
          filters: filterData?.length > 0 ? JSON.stringify(filterData) : "",
        };
      });
    }
  };

  const seoInfoClick = (link) => {
    if (link) {
      const url = SetDynamicEndpoint(
        RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_ENTITY,
        [link]
      );
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    // Add scroll event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    // You can adjust this threshold as needed
    const scrollThreshold = 50; // For example, add the class when scrolled 100 pixels down
    if (window.scrollY >= scrollThreshold) {
      setShouldAddClass(true);
    } else {
      setShouldAddClass(false);
    }
  };

  return (
    <>

      <div
        className={`top_filter_mobile ${shouldAddClass ? "stickyFilters" : ""
          }`}
      >
        <div className="d-flex align-items-center justify-content-between gap-3">
          <div className="filterDD autoCompleteSearch h-100 w-100 filterSearchSm">
            <Select
              placeholder={t("pages.properties.feature_properties.city")}
              itemComponent={SelectItem}
              data={searchValues}
              searchable={locationValue ? false : true}
              maxDropdownHeight={400}
              nothingFound="No records found"
              // filter={(value, item) =>
              //   item.label &&
              //   item.label
              //     .toLowerCase()
              //     .startsWith(value.toLowerCase().trim())
              // }
              clearable={true}
              onChange={(e) => {
                handleDropdownFilter("city_sid", e === null ? "" : e);
                setLocationValue(e);
              }}
              getItemLabel={(item) => item.label}
              getItemValue={(item) => item.value}
              renderGroup={(group) => (
                <div key={group.primary_sid}>
                  {" "}
                  <h4>{group}</h4>
                </div>
              )}
              renderOption={(option) => (
                <div key={option.primary_sid}>
                  {" "}
                  <p>{option.label}</p>
                </div>
              )}
              value={locationValue}
              icon={<LocationPinIcon />}
            //  opened
            //     initiallyOpened={true}
            />
          </div>

          <div className="filterBtnSm">
            <div
              onClick={() => setForSort(true)}
              className="fltrBtn d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-3">
                <div>
                  <SortingIconSm />
                </div>
              </div>
            </div>
            <div></div>
          </div>
          {/* <Drawer
                opened={openedSortDD}
                onClose={closeSortDD}
                title="Sort"
                position="bottom"
              ></Drawer> */}
          <div className="filterBtnSm">
            <div
              onClick={() => setForFilter(true)}
              className="fltrBtn d-flex align-items-center justify-content-between"
            >
              <div className="d-flex align-items-center gap-3">
                <div>
                  <FilterSettingsIcon />
                </div>
              </div>
            </div>
            <div></div>
          </div>
          {/* <Drawer
                opened={opened}
                onClose={close}
                title="Authentication"
                position="bottom"
              ></Drawer> */}
        </div>
      </div>
      <div className="mobile_property_view">

        {MaximumMap && mapDetails && mapDetails.length > 0 && !isMasked && !isLoading && !loadingData ? (
          <>

            <div className="position-relative mobileMapSm">
              {/* This is right when we have single dropdown */}
              {/* <FeaturedMap
                propertyDetails={mapDetails}
                locationValue={searchValues?.find(
                  (x) => x.primary_sid === locationValue
                )}
              /> */}

              <FeaturedMap
                propertyDetails={mapDetails}
                //locationValue={propAptSID ? '' : areaSID ? searchValues?.find((x) => x.primary_sid === areaSID) : locationValue ? searchValues?.find((x) => x.primary_sid === locationValue) : ''}
                locationValue={
                  propAptSID
                    ? { name: "", entity_name: "property" }
                    : areaSID
                      ? {
                        name: areaValues?.find((x) => x.primary_sid === areaSID)
                          ?.area_name,
                        entity_name: "area",
                      }
                      : locationValue
                        ? {
                          name: searchValues?.find(
                            (x) => x.primary_sid === locationValue
                          )?.city_name,
                          entity_name: "city",
                        }
                        : ""
                }
                quotationSID={quotationSID}
                selectedStartDate={dateValue[0]}
                selectedEndDate={dateValue[1]}
                specialOffer={specialOffer}
              />

              <div
                className="closeMapSm forCloseBtnSm"
                onClick={() => {
                  setMaximumMap(false);
                  onMapClick(false);
                }}
              >
                <span className="forCloseBtnSm">
                  <CrossIcon />
                </span>
              </div>
            </div>

          </>
        ) : (
          <>
            {/* <div className="row mb-4">
            <div className="col-lg-12">
              <div className="spclOffer d-inline-flex align-items-center gap-3">
                Special offers
                <span className="closeOffer">
                  <BsXCircle />
                </span>
              </div>
            </div>
          </div> */}

            <div className="specialOfferUISm d-flex align-items-center justify-content-between gap-2 mb-2">
              <p>
                {t("pages.properties.feature_properties.available")}{" "}
                <strong>
                  {" "}
                  <strong>
                    {searchValues?.find(
                      (f) =>
                        f.primary_sid ===
                        filterData?.find((x) => x.key === "city_sid")?.value
                    )?.name
                      ? searchValues?.find(
                        (f) =>
                          f.primary_sid ===
                          filterData?.find((x) => x.key === "city_sid")
                            ?.value
                      )?.name
                      : t("pages.properties.feature_properties.all")}
                  </strong>{" "}
                </strong>
              </p>

            </div>

            <div className="specialOfferUISm d-flex align-items-center gap-3">
              <span
                // style={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  setSpecialOffer(true);
                  onSpecialOfferFilter(true);
                }}
              >
                {t("pages.properties.feature_properties.special_offers")}
              </span>

              {userDetails?.customer_id && userDetails?.type == USER_TYPE.CORPORATE_USER && (
                <span
                  // style={{ whiteSpace: "nowrap" }}
                  onClick={() => {
                    setCorporateSpecialOffer(true);
                    onCorporateSpecialOfferFilter(true);
                  }}
                >
                  {t("pages.properties.feature_properties.corporate_offers")}
                </span>
              )}

              <span
                // style={{ whiteSpace: "nowrap" }}
                onClick={() => {
                  setFeaturedApartmentFilter(true);
                  onFeaturedApartmentFilter(true);
                }}
              >
                {t("pages.properties.feature_properties.feature_apartments")}
              </span>

            </div>

            <div className="d-flex align-items-center gap-2">
              {(specialOffer || corporatespecialOffer) && (
                // <div className="mb-4">
                //   <div className="p-0">
                <>
                  {specialOffer && (
                    <div className="spclOffer d-inline-flex align-items-center gap-3 mb-3">
                      {t("pages.properties.feature_properties.special_offers")}
                      <span
                        className="closeOffer"
                        onClick={() => {
                          setSpecialOffer(false);
                          onSpecialOfferFilter(false);
                          setQueryParams("specialOffer", null);
                        }}
                      >
                        <BsXCircle />
                      </span>
                    </div>
                  )}

                  {corporatespecialOffer && (
                    <div className="spclOffer d-inline-flex align-items-center gap-3 mb-3">
                      {t(
                        "pages.properties.feature_properties.corporate_offers"
                      )}
                      <span
                        className="closeOffer"
                        onClick={() => {
                          setCorporateSpecialOffer(false);
                          onCorporateSpecialOfferFilter(false);
                          setQueryParams("corporateOffer", null);
                        }}
                      >
                        <BsXCircle />
                      </span>
                    </div>
                  )}

                </>
                //   </div>
                // </div>
              )}

              {featuredApartmentFilter && (
                <div className="spclOffer d-inline-flex align-items-center gap-3 mb-3">
                  {t(
                    "pages.properties.feature_properties.feature_apartments"
                  )}
                  <span
                    className="closeOffer"
                    onClick={() => {
                      setFeaturedApartmentFilter(false);
                      onFeaturedApartmentFilter(false);
                      setQueryParams("featuredApartment", null);
                    }}
                  >
                    <BsXCircle />
                  </span>
                </div>
              )}
            </div>


            {/* {meta?.description_string && meta?.description_string !== "NULL" && <div className="appartmentListPara specialOfferUISm">
              <p className="align-items-start p-1 gap-2 m-3"> */}
            {/* {meta?.description_string} */}

            {/* {meta?.description_string &&
                  meta?.description_string
                    ?.split(/([.?])/)
                    ?.filter(part => part?.trim() !== '') // Remove any empty parts
                    ?.reduce((sentences, part, index, array) => {
                      if (index % 2 === 0) {
                        // Combine even-indexed parts (sentence content) with the next odd-indexed part (period or question mark)
                        sentences?.push(part + (array[index + 1] || ''));
                      }
                      return sentences;
                    }, [])
                    ?.slice(0, 3)
                    ?.map((sentence, index) => (
                      // <span key={index}>
                      //   {sentence}
                      //   {index < 2 ? ' ' : ''}
                      // </span>
                      <>
                        {sentence}
                        {index < 2 ? ' ' : ''}
                      </>
                    ))} */}
            {/* </p>
            </div>} */}

            {meta?.area_not_found_string &&
              meta?.area_not_found_string !== "NULL" && (
                <div className="d-inline-flex specialOfferUISm">
                  <p
                    className="d-flex align-items-start p-2 gap-2 m-3"
                    style={{ background: "whitesmoke" }}
                  >
                    {" "}
                    <span className="mt-3">
                      <BsExclamationCircle />
                    </span>{" "}
                    {meta?.area_not_found_string}
                  </p>
                </div>
              )}

            {meta?.greet_string && meta?.greet_string !== "NULL" && (
              <div className="specialOfferUISm">
                <p
                  className="align-items-start p-1 gap-2 m-3 mt-0 flex-wrap"
                  dangerouslySetInnerHTML={{
                    __html: meta?.greet_string,
                  }}
                ></p>
              </div>
            )}

            {!isMasked && !isLoading && !loadingData ? (
              <>
                {apartmnetList && apartmnetList?.length > 0 ? (
                  <>
                    {apartmnetList?.map((item, index) => (
                      <div>
                        <ResonsivePropertiesCard
                          key={index}
                          data={item}
                          customer_flat_discount={meta.customer_flat_discount}
                          customer_percentage_discount={
                            meta.customer_percentage_discount
                          }
                          quotationSID={quotationSID}
                          // startDateFromQuoteParam={startDateFromQuoteParam}
                          // endDateFromQuoteParam={endDateFromQuoteParam}
                          selectedStartDate={dateValue[0]}
                          selectedEndDate={dateValue[1]}
                          specialOffer={specialOffer}
                        />
                      </div>
                    ))}
                  </>
                ) : (
                  !loadingData && (
                    <div className="col-lg-12">
                      <div className="noFilterData warningBookingContent d-flex flex-column align-items-center justify-content-center">
                        <div className="noBookingIcon mb-4">
                          <SearchIcon />
                        </div>
                        <div className="noBkkingContent text-center ">
                          {specialOffer ? <h4 className="mb-3"
                            dangerouslySetInnerHTML={{ __html: t("pages.properties.feature_properties.no_result_sp_offer") }}>
                          </h4>
                            :
                            <h4 className="mb-3">
                              {t("pages.properties.feature_properties.no_result")}
                            </h4>
                          }
                          <span
                            className="cursor-pointer"
                            onClick={clearAllFilters}
                          >
                            <span>
                              {t(
                                "pages.properties.feature_properties.clear_filters"
                              )}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="troubleDes mb-5">
                        <div className="find_img">
                          <img src={NoFilterImg} alt="" />
                        </div>
                        <div className="troubleContent">
                          <h5 className="mb-3">
                            {t(
                              "pages.properties.feature_properties.having_trouble"
                            )}
                          </h5>
                          <p className="mb-3">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: t(
                                  "pages.properties.feature_properties.requirement"
                                ),
                              }}
                            />
                          </p>
                          <div className="contactDtl d-flex align-items-center gap-4">
                            <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => navigateToWhatsApp('9710585080101')}>
                              <div>
                                <BsWhatsapp />
                              </div>
                              <span>+971 (0) 58 508 01 01</span>
                            </div>
                            <div className="d-flex align-items-center gap-2 cursor-pointer" onClick={() => emailInquiry()}>
                              <div>
                                <BsEnvelope />
                              </div>
                              <span>info@hotelapartments.com</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {apartmnetList && apartmnetList?.length > 0 && (
                  <div className="paginationAppartmentList justify-content-center gap-3">
                    <div
                      className={`prevList ${meta?.page === 1 ? "disable" : ""
                        }`}
                      onClick={() => onPrevPage()}
                    >
                      <div>
                        <BsArrowLeft />
                      </div>
                    </div>
                    <div className="totalPaginationCount">
                      <span>
                        {meta?.page} / {meta?.total_page_num}
                      </span>
                    </div>
                    <div
                      className={`nextList ${meta?.page === meta?.total_page_num ? "disable" : ""
                        }`}
                      onClick={() => onNextPage()}
                    >
                      <div>
                        <BsArrowRight />
                      </div>
                    </div>
                  </div>
                )}
                <div className="featuredPropertySummary">
                  {meta?.description_string &&
                    meta?.description_string !== "NULL" && (
                      <p className="mb-5">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: meta.description_string?.replace(
                              /\n/g,
                              "<br>"
                            ),
                          }}
                        />
                      </p>
                    )}
                </div>

                {meta?.faq_array && meta?.faq_array?.length > 0 && (
                  <>
                    <div className="moreExplore">
                      <h5 className="mb-5">{t("common_lables.faqs")}</h5>
                    </div>

                    <div className="faqSection">
                      <Accordion
                        variant="filled"
                        chevronPosition="left"
                        disableChevronRotation
                        defaultValue="faq-0"
                      >
                        {meta.faq_array.map((faqItem, index) => (
                          <Accordion.Item key={index} value={`faq-${index}`}>
                            <Accordion.Control>
                              <h3>{faqItem.question}</h3>
                            </Accordion.Control>
                            <Accordion.Panel>{faqItem.answer}</Accordion.Panel>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                      <span className="cantFindContact">
                        {t("common_lables.faq_not_found")}{" "}
                        <NavLink to={RoutePaths.CONTACT_US.CONTACT_US}>
                          {t("common_lables.find_out_more")}
                        </NavLink>{" "}
                      </span>
                    </div>
                  </>
                )}

                <div className="moreExplore mt-5 mb-5 pb-2">
                  <h5 className="mb-5">{t("common_lables.more_to_explore")}</h5>

                  {/* Areas */}
                  {meta?.area_array && meta?.area_array?.length > 0 && <div className="exploreBlurb mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <span>
                        <MapIcon />
                      </span>
                      <p>{t("modules.areas")}</p>
                    </div>

                    <ul className="d-flex align-items-center exploreListItem">
                      {meta?.area_array
                        .filter((item) => item.is_popular)
                        .slice(0, 3)
                        .map((area, index) => (
                          <li
                            className="cursor-pointer"
                            onClick={() => {
                              seoInfoClick(area.link);
                            }}
                            key={index}
                          >
                            {area.area_name}
                          </li>
                        ))}
                      {meta?.area_array
                        .filter((item) => !item.is_popular)
                        .slice(
                          0,
                          3 -
                          meta?.area_array?.filter(
                            (item) => item.is_popular
                          ).length
                        )
                        .map((area, index) => (
                          <li
                            className="cursor-pointer"
                            onClick={() => {
                              seoInfoClick(area.link);
                            }}
                            key={index}
                          >
                            {area.area_name}
                          </li>
                        ))}
                      {meta?.area_array?.length > 3 && (
                        <li
                          className="activeLastExplore"
                          onClick={() => setShowAllAreas(true)}
                        >
                          + {meta?.area_array?.length - 3}{" "}
                          {t("common_lables.more")}
                        </li>
                      )}
                    </ul>
                  </div>
                  }

                  {/* Hotels */}
                  {meta?.property_array && meta?.property_array?.length > 0 && (
                    <div className="exploreBlurb">
                      <div className="d-flex align-items-center gap-2 mb-3">
                        <span>
                          <BuildingIcon />
                        </span>
                        <p>{t("modules.hotels")}</p>
                      </div>

                      <ul className="d-flex align-items-center exploreListItem">
                        {meta?.property_array
                          .filter((item) => item.is_popular)
                          .slice(0, 3)
                          .map((hotel, index) => (
                            <li
                              className="cursor-pointer"
                              onClick={() => {
                                seoInfoClick(hotel.link);
                              }}
                              key={index}
                            >
                              {hotel.name}
                            </li>
                          ))}
                        {meta?.property_array
                          .filter((item) => !item.is_popular)
                          .slice(
                            0,
                            3 -
                            meta?.property_array?.filter(
                              (item) => item.is_popular
                            ).length
                          )
                          .map((hotel, index) => (
                            <li
                              className="cursor-pointer"
                              onClick={() => {
                                seoInfoClick(hotel.link);
                              }}
                              key={index}
                            >
                              {hotel.name}
                            </li>
                          ))}
                        {meta?.property_array?.length > 3 && (
                          <li
                            className="activeLastExplore"
                            onClick={() => setShowAllHotels(true)}
                          >
                            + {meta?.property_array?.length - 3}{" "}
                            {t("common_lables.more")}
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* <div className="">
                <div className="featuredPropertySummary pb-5 mt-5"> */}
                {/* <p className="mb-5">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t(
                          "pages.properties.feature_properties.about_us.info1"
                        ),
                      }}
                    />
                  </p> */}
                {/* <h5 className="mb-5">
                {t("pages.properties.feature_properties.about_us.info2")}
              </h5>
              <p className="mb-3">
                {t("pages.properties.feature_properties.about_us.info3")}
              </p>
              <p>{t("pages.properties.feature_properties.about_us.info4")}</p> */}
                {/* </div>
              </div>  */}
              </>
            ) : (
              <>
                {!MaximumMap && <div className="mobile_blank_card">
                  <div className="text-center mb-3 noBkkingContent">
                    <h4>{t("common_lables.loading")}</h4>
                  </div>
                  <div className="mobile_card_list">
                    <div className="propertySkeleton">
                      <Skeleton height={250} mb="xl"></Skeleton>
                      <Skeleton height={8} radius="xl" />
                      <Skeleton height={8} mt={6} radius="xl" />
                      <Skeleton height={8} mt={6} width="70%" radius="xl" />
                    </div>
                    <div className="propertySkeleton">
                      <Skeleton height={250} mb="xl"></Skeleton>
                      <Skeleton height={8} radius="xl" />
                      <Skeleton height={8} mt={6} radius="xl" />
                      <Skeleton height={8} mt={6} width="70%" radius="xl" />
                    </div>
                    <div className="propertySkeleton">
                      <Skeleton height={250} mb="xl"></Skeleton>
                      <Skeleton height={8} radius="xl" />
                      <Skeleton height={8} mt={6} radius="xl" />
                      <Skeleton height={8} mt={6} width="70%" radius="xl" />
                    </div>
                  </div>
                </div>}
                {MaximumMap && <div className="row">
                  <div className="col-lg-12 text-center mb-3 noBkkingContent">
                    <h4>{t("common_lables.loading")}</h4>
                  </div>
                  <div className="col-lg-8">
                    <div className="row flex-wrap">
                      <div className="col-lg-6 mb-5">
                        <div className="propertySkeleton">
                          <Skeleton height={600} mb="xl"></Skeleton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
              </>
            )}
          </>
        )}


      </div>


      {!MaximumMap &&
        apartmnetList &&
        apartmnetList?.length > 0 &&
        !isMasked &&
        !isLoading && (
          <div className="mapOpenBtn mapOpenBtnSm">
            <div className="animateBtn me-3">
              <button
                type="button"
                className="appBtn bg-black"
                onClick={() => {
                  setMaximumMap(true);
                  onMapClick(true);
                  window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                  })
                }}
              >
                {t("pages.properties.feature_properties.map")}
              </button>
            </div>
          </div>
        )}

      <MobileDrawer openDrawer={forSort} setopenDrawer={setForSort}>
        <ul
        // className={`dropdown-menu filterLocationList p-2 ${sortByDropdownOpen ? "show" : ""
        //   }`}
        >
          <li className="sortByItem">
            <div class="form-check d-flex align-items-center gap-2">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault0"
                defaultChecked={true}
                checked={sortSelect === 0 ? true : false}
                onClick={() => {
                  sortBy("", "");
                  setQueryParams("sort", null);
                  setSortByIndex(0);
                  setForSort(false);
                }}
              />
              <label class="form-check-label mt-1" for="flexRadioDefault0">
                {t("pages.properties.feature_properties.all")}
              </label>
            </div>
          </li>
          <li className="sortByItem">
            <div class="form-check d-flex align-items-center gap-2">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                checked={sortSelect === 1 ? true : false}
                onClick={() => {
                  sortBy("monthly_price_aed", "asc");
                  setQueryParams("sort", "price_low");
                  setSortByIndex(1);
                  setForSort(false);
                }}
              />
              <label class="form-check-label mt-1" for="flexRadioDefault1">
                {t("pages.properties.feature_properties.price_lth")}
              </label>
            </div>
          </li>
          <li className="sortByItem">
            <div class="form-check d-flex align-items-center gap-2">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                checked={sortSelect === 2 ? true : false}
                onClick={() => {
                  sortBy("monthly_price_aed", "desc");
                  setQueryParams("sort", "price_high");
                  setSortByIndex(2);
                  setForSort(false);
                }}
              />
              <label class="form-check-label mt-1" for="flexRadioDefault2">
                {t("pages.properties.feature_properties.price_htl")}
              </label>
            </div>
          </li>
          {/* <li className="sortByItem">
                    <div class="form-check d-flex align-items-center gap-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault3"
                        onClick={() => sortBy("rating", "desc")}
                      />
                      <label
                        class="form-check-label mt-1"
                        for="flexRadioDefault3"
                      >
                        Rating
                      </label>
                    </div>
                  </li> */}
          <li className="sortByItem">
            <div class="form-check d-flex align-items-center gap-2">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault4"
                checked={sortSelect === 3 ? true : false}
                onClick={() => {
                  sortBy("is_featured", "desc", true);
                  setQueryParams("sort", "featured_first");
                  setSortByIndex(3);
                  setForSort(false);
                }}
              />
              <label class="form-check-label mt-1" for="flexRadioDefault4">
                {t("pages.properties.feature_properties.featured_first")}
              </label>
            </div>
          </li>
          <li className="sortByItem">
            <div class="form-check d-flex align-items-center gap-2">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault5"
                checked={sortSelect === 4 ? true : false}
                onClick={() => {
                  sortBy("created_datetime_utc", "asc");
                  setQueryParams("sort", "date_old");
                  setSortByIndex(4);
                  setForSort(false);
                }}
              />
              <label class="form-check-label mt-1" for="flexRadioDefault5">
                {t("pages.properties.feature_properties.date_otn")}
              </label>
            </div>
          </li>
          <li className="sortByItem">
            <div class="form-check d-flex align-items-center gap-2">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault6"
                checked={sortSelect === 5 ? true : false}
                onClick={() => {
                  sortBy("created_datetime_utc", "desc");
                  setQueryParams("sort", "date_new");
                  setSortByIndex(5);
                  setForSort(false);
                }}
              />
              <label class="form-check-label mt-1" for="flexRadioDefault6">
                {t("pages.properties.feature_properties.date_nto")}
              </label>
            </div>
          </li>
        </ul>
      </MobileDrawer>

      <MobileDrawer openDrawer={forFilter} setopenDrawer={setForFilter}>
        <div className="filterMobileDrawer position-relative">
          {/* Area */}
          {locationValue && (
            <div className="col-lg-12 mb-3">
              <div className="filterDD autoCompleteSearch h-100">
                <Select
                  placeholder={t("pages.properties.feature_properties.area")}
                  itemComponent={AreaSelectItem}
                  data={areaValues}
                  searchable={areaSID ? false : true}
                  maxDropdownHeight={400}
                  nothingFound="No records found"
                  // filter={(value, item) =>
                  //   item.label &&
                  //   item.label.toLowerCase().startsWith(value.toLowerCase().trim())
                  // }
                  clearable={true}
                  onChange={(e) => {
                    handleDropdownFilter(
                      "area_sid",
                      e === null ? "" : e,
                      "",
                      // false
                    );
                    setAreaSID(e);
                  }}
                  getItemLabel={(item) => item.label}
                  getItemValue={(item) => item.value}
                  renderGroup={(group) => (
                    <div key={group.area_sid}>
                      {" "}
                      <h4>{group}</h4>
                    </div>
                  )}
                  renderOption={(option) => (
                    <div key={option.area_sid}>
                      {" "}
                      <p>{option.label}</p>
                    </div>
                  )}
                  value={areaSID}
                  //icon={<LocationPinIcon />}
                  icon={<GrMap size={22} className="areaIconColor" />}
                />
              </div>
            </div>
          )}

          {/* Property/Apartment */}
          {locationValue && areaSID && (
            <div className="col-lg-12 mb-3">
              <div className="filterDD autoCompleteSearch h-100">
                <Select
                  placeholder={t(
                    "pages.properties.feature_properties.prop_apt"
                  )}
                  itemComponent={PASelectItem}
                  data={propAptValues}
                  searchable={propAptSID ? false : true}
                  maxDropdownHeight={400}
                  nothingFound="No records found"
                  // filter={(value, item) =>
                  //   item.label &&
                  //   item.label.toLowerCase().startsWith(value.toLowerCase().trim())
                  // }
                  clearable={true}
                  onChange={(e) => {
                    handleDropdownFilter(
                      "location_sid",
                      e === null ? "" : e,
                      "",
                      // false
                    );
                    setPropAptSID(e);
                  }}
                  getItemLabel={(item) => item.label}
                  getItemValue={(item) => item.value}
                  renderGroup={(group) => (
                    <div key={group.primary_sid}>
                      {" "}
                      <h4>{group}</h4>
                    </div>
                  )}
                  renderOption={(option) => (
                    <div key={option.primary_sid}>
                      {" "}
                      <p>{option.label}</p>
                    </div>
                  )}
                  value={propAptSID}
                  //icon={<LocationPinIcon />}
                  icon={<PropertiesIcon className="propertyIconColor" />}
                />
              </div>
            </div>
          )}

          {/* Check In - Check Out */}

          {/* <div className="col-lg-12 mb-3">
            <DatePickerInput
              valueFormat="MMM DD, YYYY"
              className="mobileDateInputCustom"
              icon={<FilterCalendarIcon />}
              //allowSingleDateInRange={true}
              clearable={true}
              type="range"
              placeholder={t(
                "pages.properties.feature_properties.checkin_checkout"
              )}
              value={dateValue}
              onChange={(e) => {
                setDateValue(e);
                // handleRangeFilter(
                //     "created_datetime_utc",
                //     "",
                //     e[0] ? dateFormat(e[0], DATE_FORMATS.YMD) : false,
                //     e[1] ? dateFormat(e[1], DATE_FORMATS.YMD) : false
                // );
              }}
              mx="auto"
              maw={400}
            />
            <div className="mainCalBooking responisveCalDateCust">
              <Group position="center">
                <DatePicker
                  type="range"
                  numberOfColumns={2}
                  //   value={dateValue}
                  //   onChange={setDateValue}
                  value={dateValue}
                  onChange={(e) => {
                    setDateValue(e);
                  }}
                  className="bookingCustomDR"
                  minDate={new Date()}
                //excludeDate={disableDates}
                />
              </Group>

            </div>
          </div> */}

          <div className="col-lg-12 mb-3">
            <div className="filterDD">
              <div className="card bg-transparent border-0 p-0">
                <div className="card-body">
                  <label className="moreFltrLbl mb-2">
                    {t("pages.properties.feature_properties.checkin_checkout")}
                  </label>

                  <div className="mainCalBooking responisveCalDateCust">
                    <Group position="center">
                      <DatePicker
                        type="range"
                        numberOfColumns={2}
                        value={dateValue}
                        onChange={(e) => {
                          setDateValue(e);
                        }}
                        className="responisveAptCalDateCust"
                        minDate={new Date()}
                        excludeDate={disableDates}
                      />
                    </Group>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bedroom Bathroom */}
          <div className="col-lg-12">
            <div className="filterDD">
              {/* <button
                            class="btn btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            aria-expanded="false"
                            onClick={() => setIsBedroomDropdownOpen(true)}
                        >
                            <div className="d-flex align-items-center">
                                <BedroomIcon />
                                <div className="d-flex flex-column align-items-start">
                                    <span>
                                        {t("pages.properties.feature_properties.bedrooms")}
                                    </span>
                                    {isBedroomBathroomFilterApplied &&
                                        filteredBedroomsCount &&
                                        filteredBedroomsCount > 0 && (
                                            <span className="filteredSelected">
                                                {filteredBedroomsCount}{" "}
                                                {t(
                                                    "pages.properties.feature_properties.bedrooms"
                                                )}
                                            </span>
                                        )}
                                </div>
                            </div>
                        </button> */}
              {/* <ul
                            className={`dropdown-menu pb-0 ${isBedroomDropdownOpen ? "show" : ""
                                }`}
                        > */}
              <div className="card bg-transparent border-0 p-0">
                <div className="card-body">
                  {/* <div className="studioSwitch">
                    <div className="d-flex align-items-center justify-content-between">
                      <label className="bedroomDDLabel">
                        {t("pages.properties.feature_properties.studio")}
                      </label>
                      <div className="toggleBtn">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            checked={isStudio}
                            onChange={(e) => {
                              setIsStudio(e.target.checked);
                              if (e.target.checked) setBedroomsCount(1);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`counterPart d-flex align-items-center justify-content-between mt-4 ${isStudio ? "disabled" : ""
                      }`}
                  >
                    <label className="bedroomDDLabel">
                      {t("pages.properties.feature_properties.bedrooms")}
                    </label>
                    <div className="DDCounter">
                      <div className="DDCounterBtn d-flex align-items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            handleDecrement(true, false);
                          }}
                        >
                          <BsDashLg />
                        </button>
                        <span>{bedroomsCount}</span>
                        <button
                          type="button"
                          onClick={() => {
                            handleIncrement(true, false);
                          }}
                        >
                          <BsPlusLg />
                        </button>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-4 mb-4" />
                  <div className="counterPart d-flex align-items-center justify-content-between">
                    <label className="bedroomDDLabel">
                      {t("pages.properties.feature_properties.bathrooms")}
                    </label>
                    <div className="DDCounter">
                      <div className="DDCounterBtn d-flex align-items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            handleDecrement(false, true);
                          }}
                        >
                          <BsDashLg />
                        </button>
                        <span>{bathroomsCount}</span>
                        <button
                          type="button"
                          onClick={() => {
                            handleIncrement(false, true);
                          }}
                        >
                          <BsPlusLg />
                        </button>
                      </div>
                    </div>
                  </div> */}

                  <div className="row mb-3">
                    <div className="col-lg-12 p-0">
                      <label className="moreFltrLbl">
                        {t("pages.properties.feature_properties.bedrooms")}
                      </label>
                    </div>
                  </div>

                  <div className="row flex-wrap moreFilterLayout bedsBaths mb-2">
                    {bedroomsData &&
                      bedroomsData?.map((item, key) => {
                        return (
                          <div className="col-lg-4 p-0">
                            <div class="form-check d-flex flex-wrap align-items-center gap-2">
                              <input
                                className="form-check-input tableChkBox"
                                type="checkbox"
                                checked={item.is_checked}
                                onChange={(event) =>
                                  handleCheckboxChangeForBedBath(
                                    event,
                                    key,
                                    item.value,
                                    1
                                  )
                                }
                              />
                              <label
                                class="form-check-label"
                                for="flexCheckDefault"
                              >
                                {selectedLang === "ru"
                                  ? t(item.label)
                                  : t(item.label)}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="row mb-3 mt-5">
                    <div className="col-lg-12 p-0">
                      <label className="moreFltrLbl">
                        {t("pages.properties.feature_properties.bathrooms")}
                      </label>
                    </div>
                  </div>

                  <div className="row flex-wrap moreFilterLayout bedsBaths mb-4">
                    {bathroomsData &&
                      bathroomsData?.map((item, key) => {
                        return (
                          <div className="col-lg-4 p-0">
                            <div class="form-check d-flex align-items-center gap-2">
                              <input
                                className="form-check-input tableChkBox"
                                type="checkbox"
                                checked={item.is_checked}
                                onChange={(event) =>
                                  handleCheckboxChangeForBedBath(
                                    event,
                                    key,
                                    item.value,
                                    2
                                  )
                                }
                              />
                              <label
                                class="form-check-label"
                                for="flexCheckDefault"
                              >
                                {item.label}
                              </label>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
                {/* <div className="filterFtrBtn pt-3 pb-3 card-footer d-flex bg-transparent justify-content-between align-items-center">
                                    <button
                                        type="button"
                                        className="bg-transparent border-0 p-0"
                                        onClick={() => {
                                            bedbathFilterReset();
                                        }}
                                    >
                                        {t("pages.properties.feature_properties.reset")}
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-transparent border-0 p-0"
                                        onClick={() => {
                                            bedbathFilterApply();
                                        }}
                                    >
                                        {t("pages.properties.feature_properties.apply")}
                                    </button>
                                </div> */}
              </div>
              {/* </ul> */}
            </div>
          </div>

          {/* Price Filter */}
          <div className="col-lg-12 mb-3">
            <div className="filterDD">
              {/* <button
                            class="btn btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            aria-expanded="false"
                            onClick={() => setIsPriceDropdownOpen(true)}
                        >
                            <div className="d-flex align-items-center">
                                <IoMdPricetags size={22} />
                                <div className="d-flex flex-column align-items-start">
                                    <span>
                                        {t("pages.properties.feature_properties.price_range")}
                                    </span>
                                    {isPriceFilterApplied &&
                                        (
                                            <span className="filteredSelected">
                                                {priceFilterString}
                                            </span>
                                        )}
                                </div>
                            </div>
                        </button> */}
              {/* <ul
                            className={`dropdown-menu pb-0 ${priceDropdownOpen ? "show" : ""
                                }`}
                        > */}
              <div className="card bg-transparent border-0 p-0">
                {/* <span><b>{t("pages.properties.feature_properties.price_range")}</b></span> */}
                <div className="card-body">
                  <label className="moreFltrLbl mb-2">
                    {t("pages.properties.feature_properties.price_range")}
                  </label>
                  <div className="priceFlterChange d-flex flex-column gap-1 flex-start">
                    {PriceFilter?.map((item, index) => (
                      <p
                        className="cursor-pointer filtrChangeHover"
                        onClick={() => {
                          setPriceRange(item);
                        }}
                      >
                        {item.value}
                      </p>
                    ))}
                  </div>

                  <div className="minMaxInput mt-3">
                    <div className="row gap-3">
                      <div className="col p-0">
                        <input
                          type="number"
                          className="form-control"
                          placeholder={t(
                            "pages.properties.feature_properties.min"
                          )}
                          aria-label="Min"
                          name="min"
                          value={minpriceFilter}
                          onChange={(e) => {
                            setMinPriceFilter(e.target?.value);
                          }}
                        />
                      </div>
                      <div className="col p-0">
                        <input
                          type="number"
                          className="form-control"
                          placeholder={t(
                            "pages.properties.feature_properties.max"
                          )}
                          aria-label="Max"
                          name="max"
                          value={maxpriceFilter}
                          onChange={(e) => {
                            setMaxPriceFilter(e.target?.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="filterFtrBtn pt-3 pb-3 card-footer d-flex bg-transparent justify-content-between align-items-center">
                                    <button
                                        type="button"
                                        className="bg-transparent border-0 p-0"
                                        onClick={() => {
                                            priceFilterReset();
                                        }}
                                    >
                                        {t("pages.properties.feature_properties.reset")}
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-transparent border-0 p-0"
                                        onClick={() => {
                                            priceFilterApply();
                                        }}
                                    >
                                        {t("pages.properties.feature_properties.apply")}
                                    </button>
                                </div> */}
              </div>
              {/* </ul> */}
            </div>
          </div>

          {/* More Filters */}
          <div className="col-lg-12 mb-3">
            <div className="filterDD">
              {/* <button
                            class="btn btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="outside"
                            aria-expanded="false"
                            onClick={() => setIsMoreFilterDropdownOpen(true)}
                        >
                            <div className="d-flex align-items-center">
                                <FilterSettingsIcon />
                                <div className="d-flex flex-column align-items-start">
                                    <span>
                                        {t(
                                            "pages.properties.feature_properties.more_filters"
                                        )}
                                    </span>
                                    {isMoreFilterApplied && moreFiterCount > 0 && (
                                        <span className="filteredSelected">
                                            {moreFiterCount}{" "}
                                            {t(
                                                "pages.properties.feature_properties.mf_added"
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button> */}
              {/* <ul
                            className={`dropdown-menu moreFltrDD ${isMoreFilterDropdownOpen ? "show" : ""
                                }`}
                        > */}
              <div className="card bg-transparent border-0 p-0">
                <div className="">
                  <div className="moreFilterLayout">

                    <div className="row mb-3">
                      <div className="col-lg-12 ">
                        <label className="moreFltrLbl">
                          {t("pages.properties.feature_properties.rating")}
                        </label>

                        <div>
                          {[1, 2, 3, 4, 5].map((index) => (
                            <span
                              key={index}
                              value={ratingValue}
                              style={{
                                display: "inline-block",
                                fontSize: "40px",
                                paddingRight: "7px",
                                color:
                                  index <= ratingValue || index <= hoveredRating
                                    ? "gold"
                                    : "#ccc",
                                cursor: "pointer",
                                transition: "color 0.2s ease-in-out",
                              }}
                              onClick={() => handleRatingClick(index)}
                              onMouseEnter={() => handleRatingHover(index)}
                              onMouseLeave={() => handleRatingHover(0)}
                              aria-label={`Rate ${index} star`}
                              role="button"
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-lg-12">
                        <label className="moreFltrLbl">
                          {t(
                            "pages.properties.feature_properties.apartment_amenities"
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="row flex-wrap moreFltrRow">
                      {apartmentAmenities &&
                        apartmentAmenities.map((item, key) => {
                          return (
                            <div className="col-lg-6">
                              <div class="form-check d-flex align-items-center gap-2">
                                <input
                                  className="form-check-input tableChkBox"
                                  type="checkbox"
                                  checked={item.is_checked}
                                  onChange={(event) =>
                                    handleCheckboxChange(
                                      event,
                                      key,
                                      item.value,
                                      1
                                    )
                                  }
                                />
                                <label
                                  class="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  {selectedLang === "ru"
                                    ? item?.russian_title
                                    : item.label}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    <div className="row mb-3 mt-5">
                      <div className="col-lg-12">
                        <label className="moreFltrLbl">
                          {t(
                            "pages.properties.feature_properties.building_amenities"
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="row flex-wrap moreFltrRow ">
                      {propertyAmenities &&
                        propertyAmenities.map((item, key) => {
                          return (
                            <div className="col-lg-6">
                              <div class="form-check d-flex align-items-center gap-2">
                                <div>
                                  {" "}
                                  <input
                                    className="form-check-input tableChkBox"
                                    type="checkbox"
                                    checked={item.is_checked}
                                    onChange={(event) =>
                                      handleCheckboxChange(
                                        event,
                                        key,
                                        item.value,
                                        2
                                      )
                                    }
                                  />
                                </div>
                                <label
                                  class="form-check-label"
                                  for="flexCheckDefault"
                                >
                                  {selectedLang === "ru"
                                    ? item?.russian_title
                                    : item.label}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                {/* <div className="filterFtrBtn pt-3 pb-3 card-footer d-flex bg-transparent justify-content-between align-items-center">
                                    <button
                                        type="button"
                                        className="bg-transparent border-0 p-0"
                                        onClick={() => {
                                            moreFilterReset();
                                        }}
                                    >
                                        {t("pages.properties.feature_properties.reset")}
                                    </button>

                                    <button
                                        type="button"
                                        className="bg-transparent border-0 p-0"
                                        onClick={() => {
                                            moreFiltersApply();
                                        }}
                                    >
                                        {t("pages.properties.feature_properties.apply")}
                                    </button>
                                </div> */}
              </div>
              {/* </ul> */}
            </div>
          </div>

          {/* Apply and Reset button */}

          <div className="filterActionSm">
            <div
              className="animateBtn mt-5"
              onClick={() => {
                applyFiltersForResponsive();
                setForFilter(false);
              }}
            >
              <button type="button" className="appBtn bg-black">
                {t("common_lables.apply_filter")}
                <span className="btnIcon">
                  <BsArrowRight />
                </span>
              </button>
            </div>
            <div
              className="resetBtnSm"
              onClick={() => {
                resetFilterForResponsive();
                setForFilter(false);
              }}
            >
              <span>{t("common_lables.reset")}</span>
            </div>
          </div>
        </div>
      </MobileDrawer>

      {/* Mobile Drawer for Areas */}

      <MobileDrawer openDrawer={showAllAreas} setopenDrawer={setShowAllAreas}>
        <AreasListModal
          setShowAllAreas={setShowAllAreas}
          areas={meta?.area_array}
        />
      </MobileDrawer>

      {/* Mobile Drawer for Hotels */}
      <MobileDrawer openDrawer={showAllHotels} setopenDrawer={setShowAllHotels}>
        <HotelsModal
          setShowAllHotels={setShowAllHotels}
          hotels={meta?.property_array}
        />
      </MobileDrawer>
    </>
  );
};

export default ResponsiveApartmentList;
