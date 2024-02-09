import {
  BsArrowLeft,
  BsArrowRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import Headphonesicon from "Assets/Images/HeaderIcons/Headphonesicon";
import ScrollIcon from "Assets/Images/HomeIcons/ScrollIcon";
import DubaiImg from "Assets/Images/HomeIcons/AreasImages/Dubai.png";
import JumeirahResidenceimg from "Assets/Images/HomeIcons/AreasImages/JumeirahResidence.png";
import DowntownImg from "Assets/Images/HomeIcons/AreasImages/Downtown.png";
import BusinessBayImg from "Assets/Images/HomeIcons/AreasImages/BusinessBay.png";
import bestHotelImg from "Assets/Images/HomeIcons/best_hotels.jpg";
import ThePalmImg from "Assets/Images/HomeIcons/AreasImages/AtlantisThePalm.png";
import TheBestHotelImg from "Assets/Images/HomeIcons/BestHotel1.png";
import LogoOne from "Assets/Images/HomeIcons/Logos/Marriott.png";
import LogoTwo from "Assets/Images/HomeIcons/Logos/Mandarin.png";
import LogoThree from "Assets/Images/HomeIcons/Logos/Raffles.png";
import LogoFour from "Assets/Images/HomeIcons/Logos/Hilton.png";
import LogoFive from "Assets/Images/HomeIcons/Logos/Park.png";
import LogoSix from "Assets/Images/HomeIcons/Logos/Atlantis.png";
import LogoSeven from "Assets/Images/HomeIcons/Logos/Burj.png";
import LogoEight from "Assets/Images/HomeIcons/Logos/HolidayInn.png";
import LogoNine from "Assets/Images/HomeIcons/Logos/FourSeasons.png";
import LogoTen from "Assets/Images/HomeIcons/Logos/OneOnly.png";
import FA3 from "Assets/Images/HomeIcons/AppartMentImages/FA3.png";
import HomeImg from "Assets/Images/HomeIcons/home.png";
import HomeImgBanner from "Assets/Images/HomeIcons/home_banner.jpg";
import "Pages/Home/home.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UsersIcon from "Assets/Images/HomeIcons/UsersIcon";
import BedIcon from "Assets/Images/HomeIcons/BedIcon";
import BathTubIcon from "Assets/Images/HomeIcons/BathTubIcon";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback, useRef } from "react";
import homeScreenService from "Services/homeScreenService";
import maskingActions from "reducers/masking/masking.actions";
import CrossIcon from "Assets/Images/HomeIcons/CrossIcon";
import SearchIcon from "Assets/Images/HomeIcons/SearchIcon";
import MapIcon from "Assets/Images/HomeIcons/MapIcon";
import LocationMap from "Assets/Images/HomeIcons/LocationMap";
import BuildingIcon from "Assets/Images/HomeIcons/BuildingIcon";
import AppartmentIcon from "Assets/Images/HomeIcons/AppartmentIcon";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import { RoutePaths } from "Constants/Constants";
import { useTranslation } from "react-i18next";
import { Group, Input, ScrollArea, Select, Text } from "@mantine/core";
import LocationPinIcon from "Assets/Images/FeaturedPropertiesIcons/LocationPinIcon";
import { forwardRef } from "react";
import dropdownService from "Services/dropdownService";
import MobileBanner from "Assets/Images/HomeIcons/homeBannerMobile.png";
import BarChartIcon from "Assets/Images/HomeIcons/BookingIcons/BarChartIcon";
import BoardIcon from "Assets/Images/HomeIcons/BookingIcons/BoardIcon";
import ArchiveContentIcon from "Assets/Images/HomeIcons/BookingIcons/ArchiveContentIcon";
import FolderFavorite from "Assets/Images/HomeIcons/BookingIcons/FolderFavorite";
import ChartIcon from "Assets/Images/HomeIcons/BookingIcons/ChartIcon";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { GrMap } from "react-icons/gr";
import PropertiesIcon from "Assets/Images/FeaturedPropertiesIcons/PropertiesIcon";

const Home = () => {
  const { t } = useTranslation();

  var list_params = {
    page_number: 1,
    page_size: 10,
    sort_column: "",
    sort_direction: "",
    // Filters: "",
    //search_text: "",
  };

  var city_list_params = {
    page_number: 1,
    page_size: 10,
    sort_column: "sort_sequence",
    sort_direction: "asc",
    filters: "",
    //search_text: "",
  };

  const carousel_Images = [
    TheBestHotelImg,
    JumeirahResidenceimg,
    BusinessBayImg,
  ];

  const navigate = useNavigate();

  const autoplay = useRef(
    Autoplay({ delay: 1000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const { userDetails } = useSelector((state) => state.customerAuth);
  const { language, currency_code } = useSelector((state) => state.language);
  const [activeTab, setActiveTab] = useState(1);
  const [featuredApartmentList, setFeaturedApartmentList] = useState([]);
  const [servicedVillaList, setServicedVillaList] = useState([]);
  const [specialOffersList, setSpecialOffersList] = useState([]);
  const [luxuryVillasList, setLuxuryVillasList] = useState([]);
  const [listParams, setlistParams] = useState(list_params);
  const [carouselActiveImage, setcarouselActiveImage] = useState(
    carousel_Images[0]
  );

  //FOR CITIES
  const [citylistParams, setCitylistParams] = useState(city_list_params);
  const [cityList, setCityList] = useState();
  const [allCityList, setAllCityList] = useState();
  const [totalCityCount, setTotalCityCount] = useState();

  const [locationValue, setLocationValue] = useState(null);
  const [searchValues, SetSearchValues] = useState([]);

  const [meta, setMetaData] = useState();
  const dispatch = useDispatch(); // For calling Reducers

  const [dynamicSearchValue, setDynamicSearchValue] = useState([]);
  const [isSearchHasValue, setIsSearchHasValue] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const inputRef = useRef(null);

  const selectedLang =
    localStorage.getItem("i18nextLng") === "en-US"
      ? "en"
      : localStorage.getItem("i18nextLng") || "en";

  const getFeaturedApartmentList = useCallback(() => {
    var params = { ...listParams, is_featured: "featured", status: 5 };

    dispatch(maskingActions.showMasking());
    homeScreenService
      .get_featured_apartments(params)
      .then((res) => {

        if (res.data.results && res.data.results.list) {
          setFeaturedApartmentList(res.data.results.list);
        } else {
          setFeaturedApartmentList([]);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [listParams]);

  const getSpecialOffersList = useCallback(() => {
    // debugger;
    var params = {
      ...listParams,
      page_size: 5,
      status: 5,
      is_special_offer: "special",
    };

    dispatch(maskingActions.showMasking());
    homeScreenService
      .get_special_offers(params)
      .then((res) => {

        if (res.data.results && res.data.results.list) {
          setSpecialOffersList(res.data.results.list);
        } else {
          setSpecialOffersList([]);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [listParams]);

  const getServicedVillasList = useCallback(() => {
    var params = { ...listParams };

    dispatch(maskingActions.showMasking());
    homeScreenService
      .get_serviced_villas(params)
      .then((res) => {

        if (res.data.results && res.data.results.list) {
          setServicedVillaList(res.data.results.list);
        } else {
          setServicedVillaList([]);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [listParams]);

  const getLuxuryVillasList = useCallback(() => {
    var params = { ...listParams };

    dispatch(maskingActions.showMasking());
    homeScreenService
      .get_luxury_villas(params)
      .then((res) => {

        if (res.data.results && res.data.results.list) {

          setLuxuryVillasList(res.data.results.list);
        } else {
          setLuxuryVillasList([]);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [listParams]);

  //For Display CITIES -- display flag is true
  const getCityList = useCallback(() => {
    var params = {
      ...citylistParams,
      filters: JSON.stringify([
        { key: "display_flag", value: "true", condition: "=" },
      ]),
    };

    dispatch(maskingActions.showMasking());
    homeScreenService
      .get_cities(params)
      .then((res) => {

        if (res.data.results && res.data.results.list) {

          // let display_city_list = {
          //   left_block: res.data.results.list?.slice(0, 2),
          //   middle_block: res.data.results.list?.slice(2, 3),
          //   right_block: res.data.results.list?.slice(3, 5),
          // };

          let dashboard_city_list = res.data?.results?.list
            ? [...res.data?.results?.list?.slice(0, 5)]
            : [];


          // setCityList(res.data.results.list);
          setCityList(dashboard_city_list);
          setAllCityList(res.data.results.list);
          setTotalCityCount(res.data?.meta?.all_cities_count);
        } else {
          setCityList([]);
          setAllCityList([]);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [citylistParams]);

  useEffect(() => {
    setDynamicSearchValue([]);
    setIsSearchHasValue(false);
    inputRef.current && (inputRef.current.value = "");
    const contracts_list = setTimeout(() => {
      getFeaturedApartmentList();
    }, 500);

    return () => {

      clearTimeout(contracts_list);
    };
  }, [listParams, language, currency_code]);

  useEffect(() => {
    const city_list = setTimeout(() => {
      getCityList();
    }, 500);

    return () => {

      clearTimeout(city_list);
    };
  }, [citylistParams, language, currency_code]);

  const cityClick = (city_sid) => {
    if (city_sid)
      var navigateLink = searchValues?.find(
        (x) => x.primary_sid === city_sid
      )?.link;
    if (navigateLink) {
      navigate(
        `${SetDynamicEndpoint(
          RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_ENTITY,
          [navigateLink]
        )}`,
        { state: { location_sid: city_sid } }
      );
    } else {
      navigate(
        `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`,
        { state: { location_sid: city_sid } }
      );
    }
    // navigate(
    //   `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`,
    //   { state: { location_sid: city_sid } }
    // );
    //else navigate(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
  };

  const searchMenuDropdown = () => {
    dispatch(maskingActions.showMasking());
    dropdownService
      .get_home_search()
      .then((res) => {
        if (res.data) {
          const newArray = res.data?.map((obj) => ({
            ...obj,
            value: obj.primary_sid,
            label:
              selectedLang === "ru"
                ? obj?.russian_name
                  ? obj?.russian_name
                  : ""
                : obj.name,
            group: obj.entity_name,
            type: obj.type,
            link: obj.link,
          }));

          SetSearchValues(newArray);
        } else {
          SetSearchValues([]);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  useEffect(() => {
    searchMenuDropdown();
    handleCurrentTabOnLanguageChange();
  }, [language, currency_code]);

  const handleCurrentTabOnLanguageChange = () => {
    switch (activeTab) {
      case 1:
        getFeaturedApartmentList();
        break;
      case 2:
        getSpecialOffersList();
        break;
      case 3:
        getServicedVillasList();
        break;
      case 4:
        getLuxuryVillasList();
        break;

      default:
        break;
    }
  };

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

  const searchLocation = (data, e) => {
    if (data.value == "showmore") {

      var tempResult = { ...dynamicSearchValue };
      tempResult[data.group] = searchValues.filter(
        (f) => f.group == data.group && f.label?.toLowerCase()?.includes(inputRef.current.value?.toLowerCase())
      );

      setDynamicSearchValue(tempResult);
    } else {
      if (e) {
        var navigateLink = searchValues?.find((x) => x.primary_sid === e)?.link;
        if (navigateLink) {
          navigate(
            `${SetDynamicEndpoint(
              RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_ENTITY,
              [navigateLink]
            )}`,
            { state: { location_sid: e } }
          );
        } else {
          navigate(
            `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`,
            { state: { location_sid: e } }
          );
        }
      }
    }
  };

  // const searchLocation = (e) => {
  //   if (e) {
  //     var navigateLink = searchValues?.find((x) => x.primary_sid === e)?.link;
  //     if (navigateLink) {
  //       navigate(
  //         `${SetDynamicEndpoint(
  //           RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_ENTITY,
  //           [navigateLink]
  //         )}`,
  //         { state: { location_sid: e } }
  //       );
  //     } else {
  //       navigate(
  //         `${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`,
  //         { state: { location_sid: e } }
  //       );
  //     }
  //   }
  // };

  const onSearch = (e) => {
    const applyCSS = document.querySelector(
      ".mantine-Select-dropdown.mantine-ufuzch"
    );

    if (e != "" && e?.length > 0) {
      if (applyCSS !== null) {
        applyCSS.style.display = "block";
      }
    } else {
      if (applyCSS !== null) {
        applyCSS.style.display = "none";
      }
    }
  };

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
      .mantine-Select-dropdown.mantine-ufuzch {
        display: none;
      }
    `;
    document.head.appendChild(styleTag);

    //For Carousel Event Listner
    const carousel = document.getElementById("websiteHomeCarousel"); // Replace with your carousel's ID
    if (carousel) {
      // Add the event listener
      carousel.addEventListener("slid.bs.carousel", handleCarouselSlid);
    }
    //For Carousel Event Listner End

    return () => {
      document.head.removeChild(styleTag);
      if (carousel) {
        carousel?.removeEventListener("slid.bs.carousel", handleCarouselSlid);
      }
    };
  }, []);

  //Carousel Event Handler
  const handleCarouselSlid = (e) => {

    if (e && e?.to > -1) {
      setcarouselActiveImage(carousel_Images[e?.to]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        // Click occurred outside the input element
        inputRef.current.value = ""; // Clear the input value
        setDynamicSearchValue({}); // Clear dynamicSearchValue
        setIsSearchHasValue(false); // Reset isSearchHasValue
      }
    };

    // Attach the click event listener to the document
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Below two useEffects for home search div
  //#region Below two useEffects for home search div
  useEffect(() => {
    if (showDropdown) {
      if (dropdownRef.current && inputRef.current) {
        const inputBoxPosition = inputRef.current.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        if (inputBoxPosition > screenHeight / 2) {
          dropdownRef.current.style.bottom = "100%";
          dropdownRef.current.style.top = "auto";
        } else {
          dropdownRef.current.style.top = "100%";
          dropdownRef.current.style.bottom = "auto";
        }
      }
    }
  }, [showDropdown]);

  useEffect(() => {
    const checkPositionAndShowDropdown = () => {
      if (dropdownRef.current && inputRef.current) {
        var inputBoxPosition = inputRef.current.getBoundingClientRect().top;
        var screenHeight = window.innerHeight;

        if (inputBoxPosition > screenHeight / 2) {
          dropdownRef.current.style.bottom = "100%";
          dropdownRef.current.style.top = "auto";
        } else {
          dropdownRef.current.style.top = "100%";
          dropdownRef.current.style.bottom = "auto";
        }
      }
    };
    window.addEventListener("scroll", checkPositionAndShowDropdown);

    return () => {
      window.removeEventListener("scroll", checkPositionAndShowDropdown);
    };
  }, []);
  //#endregion Below two useEffects for home search div End
  // End Below two useEffects for home search div

  const showMoreFeaturedApartment = () => {
    window.location.href = RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + "?featuredApartment=1";
  }

  const showMoreSpecialOffer = () => {
    window.location.href = RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + "?specialOffer=1";
  }

  const highlightMatchedText = (label, inputValue) => {
    //   if (typeof label === 'string') {
    //     const lowerLabel = label.toLowerCase();
    //     const startIndex = lowerLabel.indexOf(inputValue);
    //     if (startIndex !== -1) {
    //       const beforeMatch = label.substring(0, startIndex);
    //       const match = label.substring(startIndex, startIndex + inputValue.length);
    //       const afterMatch = label.substring(startIndex + inputValue.length);
    //       return (
    //         <span>
    //           {beforeMatch}
    //           <label className="searchedTextCust">{match}</label>
    //           {afterMatch}
    //         </span>
    //       );
    //     }
    //   }
    //   return label; // Return the original label if it's not a string or no match.


    if (typeof label === 'string') {
      const lowerLabel = label.toLowerCase();
      const lowerInputValue = inputValue.toLowerCase();
      const startIndex = lowerLabel.indexOf(lowerInputValue);
      if (startIndex !== -1) {
        const beforeMatch = label.substring(0, startIndex);
        const match = label.substring(startIndex, startIndex + inputValue.length);
        const afterMatch = label.substring(startIndex + inputValue.length);
        return (
          <span>
            {beforeMatch}
            <span className="searchedTextCust">{match}</span>
            {afterMatch}
          </span>
        );
      }
    }
    return label; // Return the original label if it's not a string or no match.
  }

  const handleNavigateToServicedLuxary = (apartment_sid, path) => {
    // console.log(apartment_sid);
    navigate(`${path}`, { state: { apartment_sid: apartment_sid } });
  }

  useEffect(() => {
    // Create or update meta tags
    let canonicalLink = document.querySelector('link[rel="canonical"]');

    if (!canonicalLink) {
      // If link doesn't exist, create and add it to the head
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = window.location.href;
      document.head.appendChild(canonicalLink);
    }

    // Clean up the effect on component unmount
    return () => {
      // Remove the added/updated meta tags on component unmount
      if (canonicalLink) {
        canonicalLink.parentNode.removeChild(canonicalLink);
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once


  return (
    <>
      <div className="main_search_banner">
        <div className="ha-main-banner">
          <div className="ha-home-content">
            <h1 className="banner_heading">
              {t("pages.home.title")} <br /> {t("pages.home.subtitle")}
            </h1>
            <p>{t("pages.home.home_subheader")}</p>
            <span className="scrollMore d-flex align-items-center">
              <ScrollIcon />
              {t("pages.home.scroll_more")}
            </span>
          </div>
          <div className="banner_img">
            <img src={HomeImgBanner} alt="" className="w-100" />
          </div>
        </div>
        <div className="ha-homeSearch">
          <div className="homeSearchLayout">
            <h3>{t("pages.home.home_search_where")}</h3>
            {/* <div className="searchInput"> */}
            {/* <Select
                        placeholder={t("pages.home.home_search_location")}
                        itemComponent={SelectItem}
                        //data={(dynamicSearchValue && dynamicSearchValue?.length > 0) ? dynamicSearchValue : []}
                        data={searchValues}
                        withinPortal 
                        searchable
                        maxDropdownHeight={300}
                        nothingFound= {t("common_lables.no_records")}
                        // filter={(value, item) =>
                        //   (item.label &&
                        //     item.label
                        //       .toLowerCase()
                        //       .includes(value.toLowerCase().trim()))
                        //   //     ||
                        //   // (item.description &&
                        //   //   item.description
                        //   //     .toLowerCase()
                        //   //     .includes(value.toLowerCase().trim()))
                        // }

                        //clearable={true}
                        
                        onChange={(e) => {
                          setLocationValue(e);
                          searchLocation(e);
                        }}
                        //comment filter as not required to filter from starting character
                        // filter={(value, item) =>
                        //   item.label &&
                        //   item.label
                        //     .toLowerCase()
                        //     .startsWith(value.toLowerCase().trim())
                        // }
                        //onChange={handleSelectChange}

                        getItemLabel={(item) => item.label}
                        getItemValue={(item) => item.value}
                        renderGroup={(group) => (
                          <div key={group.primary_sid}>
                            
                            <h4>{group}</h4>
                          </div>
                        )}
                        renderOption={(option) => (
                          <div key={option.primary_sid}>
                            
                            <p>{option.label}</p>
                          </div>
                        )}
                        value={locationValue}
                        icon={<LocationPinIcon />}
                        onSearchChange={(e) => {
                          //debugger
                          onSearch(e);
                          // var arr = searchValues.filter(s => s.label?.toLowerCase().includes(e.toLowerCase()));
                          // const groupByType = Object.groupBy(arr, product => {
                          //   return product.type;
                          // });
                          // var tempArr = []
                          // var keys = Object.keys(groupByType);
                          // keys.forEach((key)=>{
                          //   var values = groupByType[key];
                          //   if(groupByType[key] && groupByType[key]?.length > 5){
                          //     tempArr = [...tempArr,...values];
                          //     tempArr.push({label : 'Show more', value : 'showmore', group : groupByType[key][0].group, type :groupByType[key][0].type});
                          //   }else{
                          //     tempArr = [...tempArr,...values];
                          //   }
                          // })
                         
                          // setDynamicSearchValue(tempArr);
                          
                        }}

                       
                        // opened
                        // initiallyOpened={true}
                      /> */}

            {/* <Select
                placeholder={t("pages.home.home_search_location")}
                itemComponent={SelectItem}
                data={searchValues}
                withinPortal
                searchable
                maxDropdownHeight={300}
                nothingFound={t("common_lables.no_records")}
                onChange={(e) => {
                  setLocationValue(e);
                  searchLocation(e);
                }}
                value={locationValue}
                icon={<LocationPinIcon />}
                onSearchChange={(e) => {
                  onSearch(e);
                }}
              />

              <div className="searchBarAction">
                {locationValue && (
                  <div
                    className="clearSearch "
                    onClick={() => {
                      setLocationValue(null);
                    }}
                  >
                    <button type="button">
                      <CrossIcon />
                    </button>
                  </div>
                )}
                <div
                  className={`searchIcon ${locationValue ? "active" : ""
                    }`}
                  onClick={() => {
                    locationValue && searchLocation(locationValue);
                  }}
                >
                  <button type="button">
                    <SearchIcon />
                  </button>
                </div>
              </div>
            </div> */}

            <div className="ha--HomeMainSearchDes holder">
              <Input
                size="xl"
                radius="xl"
                className="ha--HomeSearch"
                icon={<LocationPinIcon />}
                //onFocus={() => setShowDropdown(true)} onBlur={() => setShowDropdown(false)}
                placeholder={t("pages.home.home_search_placeholder")}
                rightSection={
                  <div className="ha--searchBarAction">
                    <SearchIcon />
                  </div>
                }
                ref={inputRef}
                onChange={(e) => {
                  setDynamicSearchValue([]);
                  setIsSearchHasValue(false);
                  setShowDropdown(false);
                  if (e.target.value) {
                    setShowDropdown(true);
                    setIsSearchHasValue(true);
                    var arr = searchValues.filter((s) =>
                      s.label
                        ?.toLowerCase()
                        ?.includes(e.target.value?.toLowerCase())
                    );
                    // const groupByType = Object?.groupBy(arr, (product) => {
                    //   return product.group;
                    // });

                    const groupByType = arr.reduce((result, product) => {
                      const key = product.group;
                      if (!result[key]) {
                        result[key] = [];
                      }
                      result[key].push(product);
                      return result;
                    }, {});

                    var keys = Object.keys(groupByType);
                    var finalSearchResult = {};
                    keys.forEach((key) => {
                      var values = groupByType[key];
                      var tempArr = [];
                      if (groupByType[key] && groupByType[key]?.length > 5) {
                        for (var i = 0; i < 5; i++) {
                          tempArr.push(values[i]);
                        }
                        tempArr.push({
                          label: (
                            <span className="ha--SeemoreText">
                              {t("pages.home.show_more")}
                            </span>
                          ),
                          value: "showmore",
                          group: groupByType[key][0].group,
                          type: groupByType[key][0].type,
                        });
                      } else {
                        tempArr = [...values];
                      }
                      finalSearchResult[key] = [...tempArr];
                    });

                    setDynamicSearchValue(finalSearchResult);
                  }
                }}
              />

              {isSearchHasValue &&
                Object.keys(dynamicSearchValue).length === 0 ? (
                <div
                  className="ha--homeSearchDD dropdownCustForHomeSearchBar"
                  ref={dropdownRef}
                  style={{ display: showDropdown ? "block" : "none" }}
                >
                  {t("common_lables.no_records")}
                </div>
              ) : (
                dynamicSearchValue &&
                Object.keys(dynamicSearchValue).length > 0 && (
                  <div
                    className="ha--homeSearchDD dropdownCustForHomeSearchBar"
                    ref={dropdownRef}
                    style={{ display: showDropdown ? "block" : "none" }}
                  >
                    <ScrollArea.Autosize
                      mah={300}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      {Object.keys(dynamicSearchValue).map((item) => {
                        return (
                          <div className="ha--homeSearchDDList" key={item}>
                            <span className="ha--listTitle">
                              {item}
                              <span class="ha--horizontalLine"></span>
                            </span>
                            <ul>
                              {dynamicSearchValue[item].map((result, index) => (
                                <li
                                  className="cursor-pointer"
                                  key={index}
                                  onClick={() => {
                                    result?.primary_sid &&
                                      setLocationValue(result?.primary_sid);
                                    searchLocation(result, result?.primary_sid);
                                  }}
                                >
                                  {result.type && result.value != "showmore" ? (
                                    result.type == 2 ? (
                                      <div className="haIconColorHomeSearch">
                                        <LocationPinIcon />
                                      </div>
                                    ) : result.type == 3 ? (
                                      <div className="haIconColorHomeSearch">
                                        <GrMap size={22} />
                                      </div>
                                    ) : result.type == 4 ? (
                                      <div className="haIconColorHomeSearch">
                                        <PropertiesIcon />
                                      </div>
                                    ) : result.type == 5 ? (
                                      <div className="haIconColorHomeSearch">
                                        <PropertiesIcon />
                                      </div>
                                    ) : (
                                      ""
                                    )
                                  ) : (
                                    ""
                                  )}
                                  {/* {result.label} */}
                                  {highlightMatchedText(result.label, inputRef.current?.value)}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </ScrollArea.Autosize>
                  </div>
                )
              )}
            </div>

            {/* <div className="onSearchClick d-none">
                  <div className="popularSearchResult d-none">
                    <div className="popularSearchResultTitle d-flex align-items-center gap-2 mb-3">
                      <LocationMap />
                      <p>Popular locations</p>
                    </div>
                    <div className="row searchResult">
                      <div className="col-lg-2">
                        <ul className="searchList">
                          <li>Dubai Marina</li>
                          <li>Business Bay</li>
                          <li>Jumeirah</li>
                          <li>JBR</li>
                        </ul>
                      </div>
                      <div className="col-lg-5">
                        <ul className="searchList">
                          <li>Khor Al Maqta</li>
                          <li>Sharjah</li>
                          <li>Sheikh Rashid Bin Saeed Street</li>
                          <li>Dubai Investment Park</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="resultKeyPress">
                    <div className="row searchResult">
                      <div className="col-lg-3">
                        <div className="popularSearchResultTitle d-flex align-items-center gap-2 mb-3">
                          <LocationMap />
                          <p>Popular locations</p>
                        </div>
                        <ul className="searchList">
                          <li>Dubai Marina</li>
                          <li>Business Bay</li>
                          <li>Jumeirah</li>
                          <li>JBR</li>
                        </ul>
                      </div>
                      <div className="col-lg-3">
                        <div className="popularSearchResultTitle d-flex align-items-center gap-2 mb-3">
                          <MapIcon />
                          <p>Nearby</p>
                        </div>
                        <ul className="searchList">
                          <li>Dubai Marina</li>
                          <li>Dubai Investment park</li>

                        </ul>
                      </div>
                      <div className="col-lg-3">
                        <div className="popularSearchResultTitle d-flex align-items-center gap-2 mb-3">
                          <BuildingIcon />
                          <p>Hotels</p>
                        </div>
                        <ul className="searchList">
                          <li>Dubai Marina</li>
                          <li>Dubai Investment park</li>

                        </ul>
                      </div>
                      <div className="col-lg-3">
                        <div className="popularSearchResultTitle d-flex align-items-center gap-2 mb-3">
                          <AppartmentIcon />
                          <p>Apartments</p>
                        </div>
                        <ul className="searchList">
                          <li>Dubai Wings</li>
                          <li>Studio in Dubai</li>

                        </ul>
                      </div>
                    </div>
                  </div>
                </div> */}
          </div>
        </div>
      </div>
      <div className="bookingContainer">
        <div className="container">
          <div className="ha-booking-box">
            <div className="sectionTitleDesc">
              <h2>{t("pages.home.bookus_title")}</h2>
              {/* <p>{t("pages.home.bookus_subtitle")}</p> */}
            </div>
            <div className="bookingColumns homeBookingXL">
              <div className="col_item">
                <div className="bookingImageBox">
                  <div className="boxImage">
                    <Headphonesicon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.bespoke_designs")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.bespoke_designs_subtitle")}</p>
                  </div>
                </div>
              </div>
              <div className="col_item">
                <div className="bookingImageBox">
                  <div className="boxImage">
                    <BarChartIcon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.cost_effective")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.cost_effective_subtitle")}</p>
                  </div>
                </div>
              </div>
              <div className="col_item">
                <div className="bookingImageBox">
                  <div className="boxImage">
                    <BoardIcon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.corporate_experiences")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.corporate_experiences_subtitle")}</p>
                  </div>
                </div>
              </div>
              <div className="col_item">
                <div className="bookingImageBox">
                  <div className="boxImage">
                    <ArchiveContentIcon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.inclusive_stays")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.inclusive_stays_subtitle")}</p>
                  </div>
                </div>
              </div>
              <div className="col_item">
                <div className="bookingImageBox">
                  <div className="boxImage">
                    <FolderFavorite />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.customer_support")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.customer_support_subtitle")}</p>
                  </div>
                </div>
              </div>
              <div className="col_item">
                <div className="bookingImageBox">
                  <div className="boxImage">
                    <ChartIcon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.flexible_contracts")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.flexible_contracts_subtitle")}</p>
                  </div>
                </div>
              </div>
            </div>

            <Carousel
              loop
              mx="auto"
              nextControlIcon={<BsChevronRight size={20} color="#1f1f1f" />}
              previousControlIcon={<BsChevronLeft size={20} color="#1f1f1f" />}
              slideSize="70%"
              align="center"
              slideGap="md"
              controlsOffset="xl"
              dragFree
              className="homeBookingCarousel"
            >
              <Carousel.Slide>
                <div className="bookingImageBox d-flex flex-column align-items-center">
                  <div className="boxImage">
                    <Headphonesicon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.bespoke_designs")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.bespoke_designs_subtitle")}</p>
                  </div>
                </div>
              </Carousel.Slide>

              <Carousel.Slide>
                <div className="bookingImageBox d-flex flex-column align-items-center">
                  <div className="boxImage">
                    <BarChartIcon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.cost_effective")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.cost_effective_subtitle")}</p>
                  </div>
                </div>
              </Carousel.Slide>

              <Carousel.Slide>
                <div className="bookingImageBox d-flex flex-column align-items-center">
                  <div className="boxImage">
                    <BoardIcon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.corporate_experiences")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.corporate_experiences_subtitle")}</p>
                  </div>
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="bookingImageBox d-flex flex-column align-items-center">
                  <div className="boxImage">
                    <ArchiveContentIcon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.inclusive_stays")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.inclusive_stays_subtitle")}</p>
                  </div>
                </div>
              </Carousel.Slide>

              <Carousel.Slide>
                <div className="bookingImageBox d-flex flex-column align-items-center">
                  <div className="boxImage">
                    <FolderFavorite />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.customer_support")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.customer_support_subtitle")}</p>
                  </div>
                </div>
              </Carousel.Slide>

              <Carousel.Slide>
                <div className="bookingImageBox d-flex flex-column align-items-center">
                  <div className="boxImage">
                    <ChartIcon />
                  </div>
                  <div className="boxtitle">
                    <h5>{t("pages.home.flexible_contracts")} </h5>
                  </div>
                  <div className="boxPara">
                    <p>{t("pages.home.flexible_contracts_subtitle")}</p>
                  </div>
                </div>
              </Carousel.Slide>
            </Carousel>
          </div>
        </div>
      </div>
      {cityList && (
        <div className="areaSection sectionSpacing">
          <div className="container">
            <div className="sectionTitleDesc text-center">
              <h2>{t("pages.home.citylist_text")}</h2>
              <p>{t("pages.home.citylist_text_subtitle")}</p>
            </div>
            {/* <div className="col-lg-12">
                <div className="row flex-wrap appartmentBlurb">
                  {cityList &&
                    cityList.length > 0 &&
                    cityList.map((item, index) => {
                      if (index < 6) {
                        return (
                          <div
                            className="col-lg-4 cursor-pointer"
                            onClick={() => cityClick(item?.city_sid)}
                          >
                            <div className="areaImageBox">
                              <img
                                src={
                                  item?.city_image
                                    ? item?.city_image
                                    : AppartmentImg
                                }
                                alt="ImageText"
                              />
                              <h4>{item?.city_name_launguage}</h4>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              </div> */}
            {/* {allCityList && allCityList?.length >= 5 ? (
                  <div className="col-lg-12 d-none">
                    <div className="row flex-wrap appartmentBlurb">
                      <div className="col appartmentBlurbColumnSA">
                        <div className="row flex-column twoBlockBlurb">
                          {cityList?.left_block?.map((element) => {
                            return (
                              <>
                                <div
                                  className="col-lg-12 cursor-pointer"
                                  onClick={() => cityClick(element?.city_sid)}
                                >
                                  <div className="areaImageBox">
                                    <img
                                      src={
                                        element?.city_image
                                          ? element?.city_image
                                          : AppartmentImg
                                      }
                                      alt="ImageText"
                                    />
                                    <h4>{element.city_name_launguage}</h4>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col appartmentBlurbColumnSA">
                        <div className="row h-100 oneMailCityBlurb">
                          {cityList?.middle_block?.map((element) => {
                            return (
                              <>
                                <div
                                  className="col-lg-12 cursor-pointer "
                                  onClick={() => cityClick(element?.city_sid)}
                                >
                                  <div className="areaImageBox h-100 tallest">
                                    <img
                                      src={
                                        element?.city_image
                                          ? element?.city_image
                                          : AppartmentImg
                                      }
                                      alt="ImageText"
                                    />
                                    <h4>{element.city_name_launguage}</h4>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                      <div className="col appartmentBlurbColumnSA">
                        <div className="row flex-column twoBlockBlurb">
                          {cityList?.right_block?.map((element) => {
                            return (
                              <>
                                <div
                                  className="col-lg-12 cursor-pointer"
                                  onClick={() => cityClick(element?.city_sid)}
                                >
                                  <div className="areaImageBox">
                                    <img
                                      src={
                                        element?.city_image
                                          ? element?.city_image
                                          : AppartmentImg
                                      }
                                      alt="ImageText"
                                    />
                                    <h4>{element.city_name_launguage}</h4>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="col-lg-12">
                    <div className="row flex-wrap appartmentBlurb">
                      {allCityList &&
                        allCityList.length > 0 &&
                        allCityList.map((item, index) => {
                          if (index < 6) {
                            return (
                              <div
                                className="col-lg-4 cursor-pointer"
                                onClick={() => cityClick(item?.city_sid)}
                              >
                                <div className="areaImageBox">
                                  <img
                                    src={
                                      item?.city_image
                                        ? item?.city_image
                                        : AppartmentImg
                                    }
                                    alt="ImageText"
                                  />
                                  <h4>{item?.city_name_launguage}</h4>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                    </div>
                  </div>
                )} */}

            {cityList && (
              <div className="areaSectionBlurbs">
                {cityList?.map((item, index) => {

                  return (
                    <>
                      
                        <Link
                          className={`areaBlurbs cursor-pointer ${
                            index === 2 ? "thirdAreablurb" : ""
                          }`}
                          to={`${
                            item?.link
                              ? SetDynamicEndpoint(
                                  RoutePaths.PROPERTIES
                                    .FEATURED_PPROPERTIES_ENTITY,
                                  [item?.link]
                                )
                              : SetDynamicEndpoint(
                                  RoutePaths.PROPERTIES.FEATURED_PPROPERTIES
                                )
                          }`}
                          state={{ location_id: item?.city_sid }}
                          // onClick={() => cityClick(item?.city_sid)}
                        >
                          <div
                            className={`${
                              index === 1 ? "areaMainImgCust" : ""
                            }`}
                          >
                            <span
                              className={`areaImg ${
                                index === 1 ? "areaMainimg" : ""
                              }`}
                            >
                              <img
                                src={
                                  item?.city_image
                                    ? item?.city_image
                                    : AppartmentImg
                                }
                                alt="ImageText"
                              />
                            </span>
                            <span className="areaBoxTitle">
                              {item?.city_name_launguage}
                            </span>
                          </div>
                        </Link>
                     
                    </>
                  );
                })}

                {/* <div className="areaBlurbs cursor-pointer">
                  <div>
                    <span className="areaImg">
                      <img src={BusinessBayImg} alt="ImageText" />
                    </span>
                    <span className="areaBoxTitle">Test One</span>
                  </div>
                </div>
                <div className="areaBlurbs cursor-pointer">
                  <div className="areaMainImgCust">
                    <span className="areaImg areaMainimg">
                      <img src={BusinessBayImg} alt="ImageText" />
                    </span>
                    <span className="areaBoxTitle">Test One</span>
                  </div>
                </div>
                <div className="areaBlurbs cursor-pointer thirdAreablurb">
                  <div>
                    <span className="areaImg">
                      <img src={BusinessBayImg} alt="ImageText" />
                    </span>
                    <span className="areaBoxTitle">Test One</span>
                  </div>
                </div>
                <div className="areaBlurbs cursor-pointer">
                  <div>
                    <span className="areaImg">
                      <img src={BusinessBayImg} alt="ImageText" />
                    </span>
                    <span className="areaBoxTitle">Test One</span>
                  </div>
                </div>
                <div className="areaBlurbs cursor-pointer">
                  <div>
                    <span className="areaImg">
                      <img src={BusinessBayImg} alt="ImageText" />
                    </span>
                    <span className="areaBoxTitle">Test One</span>
                  </div>
                </div> */}
              </div>
            )}
            <div className="read_more">
              <div className="appMainBtn">
                <NavLink className="appBtn" to={RoutePaths.ALL_AREAS.ALL_AREAS}>
                  <span>
                    {t("pages.home.view_all")} {totalCityCount}+
                    {t("pages.home.cities")}
                  </span>
                  {/* <button type="button" className="appBtn">
                        
                        <span className="btnIcon">
                          <BsArrowRight />
                        </span>
                      </button> */}
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="homeCarousel position-relative">

        {/* <div className="container">
          <div className="sectionTitleDesc text-center">
            <h2>{t("pages.home.wide_range_choice")}</h2>
            <p>{t("pages.home.wide_range_choice_subtitle")}</p>
          </div>
        </div> */}


        {/* <div
                className="homeCarousel position-relative"
                style={{ backgroundImage: `url(${JumeirahResidenceimg})` }}
              >

               <div
                className="homeCarousel position-relative"
                style={{ backgroundImage: `url(${BusinessBayImg})` }}
              > */}
        <div>
          {/* <img
            src="/static/media/BusinessBay.60d642e75662178fbed6.png"
            alt=""
            className="w-100"
          /> */}
          <img className="hotel_banner" src={bestHotelImg} alt="ImageText" />
          <div
            id="websiteHomeCarousel"
            className="carousel carousel-dark"
            data-bs-interval="false"
          >
            <div className="carousel-inner d-flex flex-column">
              <div className="carousel-item active" data-bs-interval="10000">
                <div className="carousel-caption d-none d-md-block">
                  <h5>{t("pages.home.partnership_text")} </h5>
                  <p>{t("pages.home.partnership_text_subtitle")}</p>
                </div>
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <div className="carousel-caption d-none d-md-block">
                  <h5>{t("pages.home.seasonal_offers")} </h5>
                  <p>{t("pages.home.seasonal_offers_text")}</p>
                </div>
              </div>
              <div className="carousel-item" data-bs-interval="2000">
                <div className="carousel-caption d-none d-md-block">
                  <h5>{t("pages.home.business_on_go")} </h5>
                  <p>{t("pages.home.business_on_go_text")}</p>
                </div>
              </div>

              <div className="d-flex align-items-center justify-content-between homeSliderAction">
                <div className="animateBtn appMainBtn">
                  <button type="button" className="appBtn">
                  {/* onClick={() => { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); navigate(RoutePaths.FOR_HOTELS.FOR_HOTELS) }} */}
                  <a href={`${RoutePaths.FOR_HOTELS.FOR_HOTELS}`} >
                    <span> {t("pages.home.be_partner")}</span>
                    </a>
                  </button>
                  {/* <button type="button" className="appBtn">
                          {t("pages.home.be_partner")}
                          <span className="btnIcon">
                            <BsArrowRight />
                          </span>
                        </button> */}
                </div>

                <div className="carouselSlide">
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#websiteHomeCarousel"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    >
                      <BsArrowLeft />
                    </span>
                    <span className="visually-hidden"></span>
                  </button>
                  <div className="carousel-indicators">
                    <button
                      type="button"
                      data-bs-target="#websiteHomeCarousel"
                      data-bs-slide-to="0"
                      className="active"
                      aria-current="true"
                      aria-label="Slide 1"
                    >
                      1/3
                    </button>
                    <button
                      type="button"
                      data-bs-target="#websiteHomeCarousel"
                      data-bs-slide-to="1"
                      aria-label="Slide 2"
                    >
                      2/3
                    </button>
                    <button
                      type="button"
                      data-bs-target="#websiteHomeCarousel"
                      data-bs-slide-to="2"
                      aria-label="Slide 3"
                    >
                      3/3
                    </button>
                  </div>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#websiteHomeCarousel"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    >
                      <BsArrowRight />
                    </span>
                    <span className="visually-hidden"> </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="LogoSliderContainer">
        <div className="container">
          <div className="logoSliderSection ">
            <div className="sectionTitleDesc">
              <h2>{t("pages.home.trusted_by")}</h2>
              <p>
                {t("pages.home.trusted_by_subtitle")}
              </p>
            </div>
            {/* <div className="slider">
              <div className="slideTrack">
                <div className="slide">
                  <img src={LogoOne} alt="LogoOne" />
                </div>
                <div className="slide">
                  <img src={LogoTwo} alt="LogoTwo" />
                </div>
                <div className="slide">
                  <img src={LogoThree} alt="LogoThree" />
                </div>
                <div className="slide">
                  <img src={LogoFour} alt="LogoFour" />
                </div>
                <div className="slide">
                  <img src={LogoFive} alt="LogoFive" />
                </div>
                <div className="slide">
                  <img src={LogoSix} alt="LogoSix" />
                </div>
                <div className="slide">
                  <img src={LogoSeven} alt="LogoSeven" />
                </div>
                <div className="slide">
                  <img src={LogoEight} alt="LogoEight" />
                </div>
                <div className="slide">
                  <img src={LogoNine} alt="LogoNine" />
                </div>
                <div className="slide">
                  <img src={LogoTen} alt="LogoTen" />
                </div>
              </div>
            </div> */}

            <Carousel
              withControls={false}
              slideSize="10%"
              slideGap="md"
              loop
              draggable={false}
              plugins={[autoplay.current]}

            // breakpoints={[
            //   { maxWidth: 'md', slideSize: '50%' },
            //   { maxWidth: 'sm', slideSize: '100%', slideGap: 0 },
            // ]}
            >
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoOne} alt="LogoOne" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoTwo} alt="LogoTwo" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoThree} alt="LogoThree" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoFour} alt="LogoFour" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoFive} alt="LogoFive" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoSix} alt="LogoSix" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoSeven} alt="LogoSeven" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoEight} alt="LogoEight" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoNine} alt="LogoNine" />
                </div>
              </Carousel.Slide>
              <Carousel.Slide>
                <div className="slideHomeMain">
                  <img src={LogoTen} alt="LogoTen" />
                </div>
              </Carousel.Slide>
            </Carousel>
          </div>
        </div>
      </div>
      <div className="areaSection">
        <div className="container">
          <div className="sectionTitleDesc text-center">
            <h2>{t("pages.home.fully_accomodation")}</h2>
            <p>
              {t("pages.home.fully_accomodation_subtitle")}
            </p>
          </div>
          <div className="d-flex align-items-center featuredAppartNav mb-5">
            <div
              className={`featuredAppartNavLink ${activeTab == 1 ? "active" : ""
                }`}
              onClick={() => {
                if (activeTab != 1) {
                  setActiveTab(1);
                  getFeaturedApartmentList();
                }
              }}
            >
              <span>{t("pages.home.feature_apartments")}</span>
            </div>
            <div
              className={`featuredAppartNavLink ${activeTab == 2 ? "active" : ""
                }`}
              onClick={() => {
                if (activeTab != 2) {
                  setActiveTab(2);
                  getSpecialOffersList();
                }
              }}
            >
              <span>{t("pages.home.special_offers")}</span>
            </div>
            <div
              className={`featuredAppartNavLink ${activeTab == 3 ? "active" : ""
                }`}
              onClick={() => {
                if (activeTab != 3) {
                  setActiveTab(3);
                  getServicedVillasList();
                }
              }}
            >
              <span>{t("pages.home.serviced_villas")}</span>
            </div>
            <div
              className={`featuredAppartNavLink ${activeTab == 4 ? "active" : ""
                }`}
              onClick={() => {
                if (activeTab != 4) {
                  getLuxuryVillasList();
                  setActiveTab(4);
                }
              }}
            >
              <span>{t("pages.home.luxury_villas")}</span>
            </div>
          </div>

          {activeTab === 1 && (
            <>
              <div className=" propertyCardSlideSm">
                {featuredApartmentList.map((item, index) => {
                  return (
                    index < 5 && (
                      <div
                        className="propertyCardSlideUp"
                        key={index}
                        // onClick={() => {
                        //   navigate(
                        //     `${SetDynamicEndpoint(
                        //       RoutePaths.PROPERTIES.PROPERTIES_DETAIL,
                        //       [item.apartment_sid]
                        //     )}`
                        //   );
                        // }}
                      >
                        <div className="propertyCardsLayout">
                          <div className="item">
                            <Link
                              aria-labelledby="person1"
                              // onClick={(e) => {
                              //   e.preventDefault();
                              // }}
                              to={`${SetDynamicEndpoint(
                                RoutePaths.PROPERTIES.PROPERTIES_DETAIL,
                                [item.apartment_sid]
                              )}`}
                            ></Link>
                            <img
                              src={
                                item.image_urls
                                  ? item.image_urls
                                    ?.find((f) => f.is_primary == true)
                                    ?.src?.replace(/\/([^/]+)$/, "/thumb_$1")
                                  : AppartmentImg
                              }
                              alt="Apartment"
                              className="w-100"
                              onError={(event) => {
                                event.target.src =
                                  item.image_urls?.find(
                                    (f) => f.is_primary === true
                                  )?.src || AppartmentImg;
                              }}
                            />
                            <div className="item__overlay">
                              <div className="titleAndPrice">
                                <h3 id="person1" aria-hidden="true">
                                  {item.apartment_title}
                                </h3>
                                <span>
                                  {item.currency_code_display
                                    ? item.currency_code_display
                                    : "AED"}{" "}
                                  {item.monthly_price}/
                                  {t("common_lables.month")}
                                </span>
                              </div>

                              <div className="item__body">
                                <div className="d-flex align-items-center gap-5">
                                  <span className="ammenitiesDisplay">
                                    <UsersIcon /> {item.accomodation}
                                  </span>
                                  <span className="ammenitiesDisplay">
                                    <BedIcon /> {item.no_of_rooms}
                                  </span>
                                  <span className="ammenitiesDisplay">
                                    <BathTubIcon /> {item.no_of_bathrooms}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
              <div className="animateBtn appMainBtn mt-3">
                {/* <NavLink to="/service-villa"> */}
                <button type="button" className="appBtn" 
                // onClick={() => { showMoreFeaturedApartment() }}
                >
                  <a href={`${RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + "?featuredApartment=1"}`}>
                  <span> {t("pages.home.show_more")}</span>
                  </a>
                </button>
                {/* </NavLink> */}
              </div>
            </>
          )}

          {activeTab === 2 && (
            <>
              <div className="propertyCardSlideSm">
                {specialOffersList.map((item, index) => {
                  return (
                    index < 5 && (
                      <div
                        className="propertyCardSlideUp"
                        key={index}
                        // onClick={() => {
                        //   navigate(
                        //     `${SetDynamicEndpoint(
                        //       RoutePaths.PROPERTIES.PROPERTIES_DETAIL,
                        //       [item.apartment_sid]
                        //     )}?specialOffer=true`
                        //   );
                        // }}
                      >
                        <div className="propertyCardsLayout">
                          <div className="item">
                            <Link
                              aria-labelledby="person1"
                              // onClick={(e) => {
                              //   e.preventDefault();
                              // }}
                              to={`${SetDynamicEndpoint(
                                RoutePaths.PROPERTIES.PROPERTIES_DETAIL,
                                [item.apartment_sid]
                              )}?specialOffer=true`}
                            ></Link>
                            <img
                              src={
                                item.image_url
                                  ? item.image_url?.replace(
                                    /\/([^/]+)$/,
                                    "/thumb_$1"
                                  )
                                  : AppartmentImg
                              }
                              alt="Apartment"
                              className="w-100"
                              onError={(event) => {
                                event.target.src =
                                  item.image_url || AppartmentImg;
                              }}
                            />
                            <div className="item__overlay spoffer-des">
                              <div className="titleAndPrice">
                                <h3 id="person1" aria-hidden="true">
                                  {item.offer_title}
                                </h3>
                                {/* <span>
                                  {item.currency_code_display
                                    ? item.currency_code_display
                                    : "AED"}{" "}
                                  {item.price ? item.price : item.striked_price}/
                                  {t("common_lables.month")}
                                </span> */}
                                <div class="strikePriceDes">
                                  <span>
                                    From{" "}
                                    {item.currency_code_display
                                      ? item.currency_code_display
                                      : "AED"}{" "}
                                    {item.price
                                      ? item.price
                                      : item.striked_price}
                                    /month
                                  </span>
                                  {item.price && (
                                    <span class="strikeOldPriceDes">
                                      {item.currency_code_display
                                        ? item.currency_code_display
                                        : "AED"}{" "}
                                      {item.striked_price}
                                    </span>
                                  )}
                                </div>
                                {/* <div className="offervalid-date"><span>{t("common_lables.valid")} {t("common_lables.from")} {item.start_date} {t("common_lables.to")} {item.end_date}</span></div> */}
                              </div>

                              <div className="item__body">
                                <div className="d-flex align-items-center gap-5">
                                  <span className="ammenitiesDisplay">
                                    <UsersIcon /> {item.accomodation}
                                  </span>
                                  <span className="ammenitiesDisplay">
                                    <BedIcon /> {item.no_of_rooms}
                                  </span>
                                  <span className="ammenitiesDisplay">
                                    <BathTubIcon /> {item.no_of_bathrooms}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
              <div className="animateBtn appMainBtn mt-3">
                {/* <NavLink to="/service-villa"> */}
                <button type="button" className="appBtn">
                  <a href={`${RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + "?specialOffer=1"}`}>
                  <span> {t("pages.home.show_more")}</span>
                  </a>
                </button>
                {/* </NavLink> */}
              </div>
            </>
          )}

          {activeTab === 3 && (
            <>
              <div className="propertyCardSlideSm">
                {servicedVillaList.map((item, index) => {
                  return (
                    index < 5 && (
                      <div
                        className="propertyCardSlideUp"
                        key={index}
                        // onClick={() => handleNavigateToServicedLuxary(item.apartment_sid, RoutePaths.SIDE_MENU.LUXURY_APARTMENTS_TWO)}
                      >
                        <div className="propertyCardsLayout svDefault">
                          <div className="item">
                            <Link to={RoutePaths.SIDE_MENU.LUXURY_APARTMENTS_TWO} className="tagSlider"
                              aria-labelledby="person1"
                              state={{ apartment_sid: item.apartment_sid }}
                            // onClick={(e) => {
                            //   e.preventDefault();
                            // }}
                            ></Link>
                            <img
                              src={
                                item.apartment_images
                                  ? item.apartment_images?.replace(
                                    /\/([^/]+)$/,
                                    "/thumb_$1"
                                  )
                                  : AppartmentImg
                              }
                              alt=""
                              className="w-100"
                              onError={(event) => {
                                event.target.src =
                                  item.apartment_images || AppartmentImg;
                              }}
                            />
                            <div className="item__overlay svultraDs">
                              <div className="titleAndPrice">
                                <h3 id="person1" aria-hidden="true">
                                  {item.apartment_title}
                                </h3>
                                {/* <span>
                                    {item.currency_code_display
                                      ? item.currency_code_display
                                      : "AED"}
                                    {item.monthly_price} month
                                  </span> */}
                              </div>

                              <div className="item__body">
                                <div className="d-flex align-items-center gap-5">
                                  <span className="ammenitiesDisplay">
                                    <UsersIcon /> {item.accomodation}
                                  </span>
                                  <span className="ammenitiesDisplay">
                                    <BedIcon /> {item.no_of_rooms}
                                  </span>
                                  <span className="ammenitiesDisplay">
                                    <BathTubIcon /> {item.no_of_bathrooms}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
              <div className="animateBtn appMainBtn mt-3">
                <NavLink to="/service-villa">
                  <button type="button" className="appBtn">
                    <span> {t("pages.home.show_more")}</span>
                  </button>
                </NavLink>
              </div>
            </>
          )}

          {activeTab === 4 && (
            <>
              <div className="propertyCardSlideSm">
                {luxuryVillasList.map((item, index) => {
                  return (
                    index < 5 && (
                      <div
                        className="propertyCardSlideUp"
                        key={index}
                      // onClick={() => {
                      //   navigate(
                      //     `${SetDynamicEndpoint(
                      //       RoutePaths.PROPERTIES.PROPERTIES_DETAIL,
                      //       [item.apartment_sid]
                      //     )}`
                      //   );
                      // }}
                      >
                        <div className="propertyCardsLayout svDefault">
                          <div className="item" 
                          // onClick={() => handleNavigateToServicedLuxary(item.apartment_sid, RoutePaths.SIDE_MENU.LUXURY_APARTMENTS)}
                          >
                            <span
                              // aria-labelledby="person1"
                              // onClick={(e) => {
                              //   e.preventDefault();
                              // }}
                              className="tagSlider"
                            ></span>
                             <Link to={RoutePaths.SIDE_MENU.LUXURY_APARTMENTS} className="tagSlider"
                              aria-labelledby="person1"
                              state={{ apartment_sid: item.apartment_sid }}
                            // onClick={(e) => {
                            //   e.preventDefault();
                            // }}
                            ></Link>
                            <img
                              src={
                                item.apartment_images
                                  ? item.apartment_images?.replace(
                                    /\/([^/]+)$/,
                                    "/thumb_$1"
                                  )
                                  : AppartmentImg
                              }
                              alt=""
                              className="w-100"
                              onError={(event) => {
                                event.target.src =
                                  item.apartment_images || AppartmentImg;
                              }}
                            />
                            <div className="item__overlay svultraDs">
                              <div className="titleAndPrice">
                                <h3 id="person1" aria-hidden="true">
                                  {item.apartment_title}
                                </h3>
                                {/* <span>
                                    {item.currency_code_display
                                      ? item.currency_code_display
                                      : "AED"}
                                    {item.monthly_price} month
                                  </span> */}
                              </div>

                              <div className="item__body">
                                <div className="d-flex align-items-center gap-5">
                                  <span className="ammenitiesDisplay">
                                    <UsersIcon /> {item.accomodation}
                                  </span>
                                  <span className="ammenitiesDisplay">
                                    <BedIcon /> {item.no_of_rooms}
                                  </span>
                                  <span className="ammenitiesDisplay">
                                    <BathTubIcon /> {item.no_of_bathrooms}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              </div>
              <div className="animateBtn appMainBtn mt-3">
                <NavLink to="/luxury-apartments">
                  <button type="button" className="appBtn">
                    <span> {t("pages.home.show_more")}</span>
                  </button>
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};
export default Home;
