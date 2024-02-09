import { NavLink, useNavigate } from "react-router-dom";
import { BsChevronLeft, BsX } from "react-icons/bs";
import "Pages/AllAreas/allareas.css";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import { CityLangColumns, RoutePaths } from "Constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useCallback } from "react";
import homeScreenService from "Services/homeScreenService";
import maskingActions from "reducers/masking/masking.actions";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import { useTranslation } from "react-i18next";
import SortingIconSm from "Assets/Images/FeaturedPropertiesIcons/SortingIconSm";

const AllAreas = () => {
  const { t } = useTranslation();
  var city_list_params = {
    page_number: 1,
    page_size: 8,
    sort_column: "sort_sequence",
    sort_direction: "asc",
    filters: "",
    //search_text: "",
  };

  //FOR CITIES
  const [citylistParams, setCitylistParams] = useState(city_list_params);
  const [cityList, setCityList] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [meta,setMeta] = useState();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // For calling Reducers
  const { language,currency_code } = useSelector((state) => state.language);

  const getCityList = useCallback(() => {
    var params = { ...citylistParams };

    dispatch(maskingActions.showMasking());
    homeScreenService
      .get_cities(params)
      .then((res) => {
        
        if (res.data.results && res.data.results.list) {
          setCityList(res.data.results.list);
          setMeta(res.data?.meta);
        } else {
          setCityList([]);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  }, [citylistParams]);

  useEffect(() => {
    if(citylistParams.page_size !== -1){
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
    const city_list = setTimeout(() => {
      getCityList();
    }, 500);

    return () => {
      
      clearTimeout(city_list);
    };
  }, [citylistParams, language,currency_code]);

  useEffect(() => {
    if (cityList?.length > 0) {
      setDisplayedData(cityList.slice(0, itemsPerPage));
    } else {
      setDisplayedData([]);
    }
  }, [cityList, itemsPerPage]);

  const loadMoreData = () => {
    // const nextPageEndIndex = displayedData?.length + itemsPerPage;
    // setDisplayedData(cityList.slice(0, nextPageEndIndex));
    setCitylistParams((previousState) => {
      return {
        ...previousState,
        page_size : -1
        // sort_column: sort_column,
        // sort_direction: sort_direction
      };
    });
  };

  const cityClick = (city_sid) => {
    if (city_sid)
      var navigateLink = cityList?.find((x) => x.city_sid === city_sid)?.link;
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

    //if (city_sid) navigate(`${SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES)}`, { state: { location_sid: city_sid } });
    //else navigate(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
  };

  const sortBy = (
    sort_column = "", sort_direction = "") => {
      // if(sort_direction !== citylistParams.sort_direction){
        setCitylistParams((previousState) => {
          return {
            ...previousState,
            sort_column: sort_column,
            sort_direction: sort_direction
          };
        });
      // }
      setIsSortByDropdownOpen(false);
  };

  useEffect(()=>{
    if (citylistParams.sort_column) {
      // debugger;
      setCitylistParams((previousState) => {
        return {
          ...previousState,
          sort_column: previousState.sort_column !== "sort_sequence" ? CityLangColumns[language] : "sort_sequence",
          // sort_direction: sort_direction
        };
      });
    }
  },[language])

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
    <div className="container allAreasContainer mt-4">
      <div className="row">
        <div className="col-lg-12 d-flex align-items-center justify-content-between">
          <div className="backBtn">
            <NavLink to="/">
              <button
                type="button"
                className="bg-transparent border-0 d-flex align-items-center"
              >
                <BsChevronLeft />
                {t("pages.all_areas.back")}
              </button>
            </NavLink>
          </div>

          <div class="dropdown allAreasSorting">
            <button
              class="btn btn-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              onClick={() => setIsSortByDropdownOpen(true)}
            >
             <span className="openSortIcon"> <SortingIconSm /></span>
             <span className="closeSortIcon"> <BsX /></span>
            </button>

            {/* ... content */}

            <ul className="dropdown-menu filterLocationList">
              <div className="w-100">

                <ul className={`align-items-start dropdown-menu-lg-start ${sortByDropdownOpen ? "d-flex flex-column show" : ""}`} data-popper-placement="bottom-end">
                
                  <li className="sortByItem" onClick={() => sortBy("created_datetime_utc", "desc")}>
                    <div class="form-check d-flex align-items-center gap-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault0"
                        // defaultChecked={true}
                      />
                      <label class="form-check-label mt-1" for="flexRadioDefault0">
                        {t("common_lables.recently_added")}
                      </label>
                    </div>
                  </li>

                  <li className="sortByItem" onClick={() => sortBy(language ? CityLangColumns[language] : "", "asc")}>
                    <div class="form-check d-flex align-items-center gap-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault1"
                      //defaultChecked={true}
                        
                      />
                      <label class="form-check-label mt-1" for="flexRadioDefault1">
                        {t("common_lables.ascending")}
                      </label>
                    </div>
                  </li>
                  <li className="sortByItem"  onClick={() => sortBy(language ? CityLangColumns[language] : "", "desc")}>
                    <div class="form-check d-flex align-items-center gap-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault2"
                      //defaultChecked={true}
                       
                      />
                      <label class="form-check-label mt-1" for="flexRadioDefault2">
                        {t("common_lables.descending")}
                      </label>
                    </div>
                  </li>
                  <li className="sortByItem" onClick={() => sortBy("sort_sequence", "asc")}>
                    <div class="form-check d-flex align-items-center gap-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefault"
                        id="flexRadioDefault3"
                      defaultChecked={true}
                        
                      />
                      <label class="form-check-label mt-1" for="flexRadioDefault3">
                        {t("common_lables.sort_sequence")}
                      </label>
                    </div>
                  </li>
                </ul>
              </div>

            </ul>

          </div>


        </div>
      </div>
      <div className="row mt-5 allAreasBlurb">
        {displayedData &&
          displayedData.length > 0 &&
          cityList.map((item, index) => {
            
            return (
              <div className={`${(index+1)%3===0?'col-lg-12':'col-lg-6'}`}>
                <div
                  className="areaImageBox cursor-pointer"
                  onClick={() => cityClick(item?.city_sid)}
                >
                  <img
                    src={item?.city_image ? item?.city_image : AppartmentImg}
                    alt="ImageText"
                  />
                  <h4>{item?.city_name_launguage}</h4>
                </div>
              </div>
            );
          })}
      </div>
      <div className="row mt-3 mb-5">
        <div className="col-lg-12 d-flex justify-content-center pb-5">
          <div className="animateBtn appMainBtn">
            {/* {displayedData?.length < cityList?.length && ( */}
            {cityList?.length < meta?.all_cities_count && (
              <button type="button" className="appBtn" onClick={loadMoreData}>
                <span> {t("pages.all_areas.load_more")}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllAreas;
