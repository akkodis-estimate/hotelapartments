import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import featureApartmentService from "Services/featureApartmentService";
import maskingActions from "reducers/masking/masking.actions";
import "Pages/LuxuryApartments/LuxuryApartmentTwo/luxuryapartmenttwo.css";
import dropdownService from "Services/dropdownService";
import LuxuryApartmentsCard from "../Components/LuxurtApartmentCard";
import { BsChevronDown } from "react-icons/bs";

const LuxuryApartmentTwo = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [state, setState] = useState(location.state);

  const { language, currency_code } = useSelector((state) => state.language);

  var list_params = {
    page_number: -1,
    page_size: -1,
    sort_column: "",
    sort_direction: "",
    filters: "",
    search_text: "",
    status: 4,
  };

  var metaData = {
    page: -1,
    page_size: -1,
    total_results: 0,
    total_in_progress: 0,
    total_page_num: 0,
  };

  const [isPlaying, setIsPlaying] = useState(true); // for video play pause button
  const [listParams, setlistParams] = useState(list_params);
  const [apartmnetList, setApartmentList] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [activeTab, setActiveTab] = useState(); // it will show the tab is active

  const [meta, setMetaData] = useState(metaData);
  const [loadItemCount, setloadItemCount] = useState(0);
  const dispatch = useDispatch(); // For calling Reducers

  //FOR FILTERS
  const [filterData, setFilterData] = useState([]);
  const [cityList, setcityList] = useState([]);
  const getPropertyApartmentList = useCallback(() => {
    let apartment_sid = location?.state;
    var filter;
    filter = [
      {
        key: "property_type_id",
        value: "70",
        condition: "=",
      },
    ];
    setFilterData([...filter]);
    var params = {
      ...listParams,
      filters: filter ? JSON.stringify(filter) : listParams.filters,
    };
    dispatch(maskingActions.showMasking());
    featureApartmentService
      .feature_apartment_list(params)
      .then((res) => {
        //If clicked on specific apartment from home page, show that apartment at top logic
        let apartment_list = res.data?.results?.list ? [...res.data?.results?.list] : [];
        if (apartment_sid?.apartment_sid && apartment_list.length > 0) {
          let apartment_index = apartment_list.findIndex(x=>x.apartment_sid === apartment_sid?.apartment_sid);
          if (apartment_index > 0) {
            const objectToMove = apartment_list.splice(apartment_index, 1)[0]; // Remove the object at index 1 (Bob)

          apartment_list.splice(0, 0, objectToMove); // Insert the object at a new position (e.g., index 2)
          }
        }
        setApartmentList([...apartment_list]);
        setMetaData(res.data.meta);
        if (res.data.meta?.total_results < 2) {
          setloadItemCount(res.data.meta?.total_results);
        } else {
          setloadItemCount(2);
        }
      })
      .finally(() => {
        setState(null);
        dispatch(maskingActions.hideMasking());
      });
    //dropdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listParams]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    dropdown();
    const apartment_list = setTimeout(() => {
      getPropertyApartmentList();
    }, 500);

    return () => {
      clearTimeout(apartment_list);
    };
  }, [listParams, getPropertyApartmentList, language, currency_code]);

  useEffect(() => {
    // dropdown();
    if (apartmnetList?.length > 0) {
      setDisplayedData(apartmnetList.slice(0, itemsPerPage));
    } //if(apartmnetList === undefined || apartmnetList == null || apartmnetList?.length <= 0)
    else {
      setDisplayedData([]);
    }
  }, [apartmnetList, itemsPerPage]);

  const dropdown = async () => {
    dropdownService
      .get_vila_cities_dropdown()
      .then((res) => {
        setcityList(res.data);
        
      })
      .catch((err) => {
        
      })
      .finally(() => {});
  };

  // this Function Will FIlter the City By click on.
  const filterCity = (item) => {
    var Newfilter;
    if (item !== null) {
      Newfilter = [
        {
          key: "city_id",
          value: item && item.city_id ? item.city_id : "",
          condition: "=",
        },
        {
          key: "property_type_id",
          value: "70",
          condition: "=",
        },
      ];

      setFilterData([...Newfilter]);
      var params = {
        ...listParams,
        filters: Newfilter ? JSON.stringify(Newfilter) : listParams.filters,
      };
      dispatch(maskingActions.showMasking());
      featureApartmentService
        .feature_apartment_list(params)
        .then((res) => {
          setApartmentList(res.data.results.list);
          setMetaData(res.data.meta);
          if (res.data.meta?.total_results < 2) {
            setloadItemCount(res.data.meta?.total_results);
          } else {
            setloadItemCount(2);
          }
        })
        .finally(() => {
          setState(null);
          dispatch(maskingActions.hideMasking());
        });
    }
  };

  const vidRef = useRef(null);

  const handlePlayVideo = () => {
    vidRef.current.play();
    setIsPlaying(true);
  };

  const handlePauseVideo = () => {
    vidRef.current.pause();
    setIsPlaying(false);
  };

  // return (

  //   <>
  //   <div className="row">
  //       <div className="col-lg-12 p-0 position-relative luxuryVideos">
  //         <video width="100%" height="100%" poster={VideoBanner} controls  ref={vidRef} autoPlay>
  //           <source src="https://player.vimeo.com/external/409203683.sd.mp4?s=ec1a92b4713d1b59ea984f9a8de88ad48e01d1ac&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
  //           <source src="movie.ogg" type="video/ogg" />
  //           {t("pages.luxury_apartments.no_support_video")}
  //         </video>
  //         {!isPlaying && <button className="playBtn p-0 bg-transparent border-0" onClick={handlePlayVideo}>
  //           <PlayButtonIcon />
  //         </button>}

  //         {isPlaying &&  <button className="playBtn p-0 bg-transparent border-0 pauseBtn" onClick={handlePauseVideo}>
  //           <BsPauseCircle/>
  //         </button>}
  //         <div className="luxuryHeader">
  //           <div className="luxuryHeaderTitle ">
  //             <h2> {t("pages.luxury_apartments.serviced_villa.title")}</h2>
  //             <p>
  //               <span dangerouslySetInnerHTML={{ __html: t('pages.luxury_apartments.serviced_villa.info') }} />
  //             </p>
  //           </div>
  //           <div className="luxuryFilter">
  //             <ul className="luxuryFilterList">
  //             {
  //                 cityList && cityList.map((item, index) => {
  //                   return (
  //                     <li
  //                     className={`luxuryFilterListItem ${index === activeTab? "active" : ""}`}
  //                     onClick={() => { filterCity(item); setActiveTab(index) }}
  //                     >{item.city_name}</li>
  //                   )
  //                 })
  //               }
  //             </ul>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   <div className="container pb-5 ">
  //     {/* <div className="row mb-5 p-3 pt-5">
  //       <div className="col-lg-7 position-relative luxuryVideo">
  //         <video width="100%" poster={VideoBanner} controls autoPlay={true}>
  //           <source src="https://player.vimeo.com/external/409203683.sd.mp4?s=ec1a92b4713d1b59ea984f9a8de88ad48e01d1ac&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
  //           <source src="movie.ogg" type="video/ogg" />
  //           {t("pages.luxury_apartments.no_support_video")}
  //         </video>
  //         <button className="playBtn p-0 bg-transparent border-0">
  //           <PlayButtonIcon />
  //         </button>
  //       </div>
  //       <div className="col-lg-5 LAHeaderTwo ps-5">
  //         <div className="luxuryHeaderTitle ">
  //           <h2>{t("pages.luxury_apartments.serviced_villa.title")}</h2>
  //           <p>
  //             <span dangerouslySetInnerHTML={{ __html: t('pages.luxury_apartments.serviced_villa.info') }} />
  //           </p>
  //         </div>
  //       </div>
  //     </div> */}
  //     <div className="container luxuryContainer mt-5 pt-5 pb-5">
  //       <div className="row">

  //         {/* <div className="col-lg-12 mb-5">
  //           <div className="luxuryFilter LATwoFilter">
  //             <ul className="luxuryFilterList">
  //               {
  //                 cityList && cityList.map((item, index) => {
  //                   return (
  //                     <li
  //                     className={`luxuryFilterListItem ${index === activeTab? "active" : ""}`}
  //                     onClick={() => { filterCity(item); setActiveTab(index) }}
  //                     >{item.city_name}</li>
  //                   )
  //                 })
  //               }

  //             </ul>
  //           </div>
  //         </div> */}
  //         <div className="col-lg-12 pt-2">
  //           <div className="luxuryListing">
  //             {displayedData && displayedData.length > 0 && (
  //               <div className="row flex-wrap">
  //                 {displayedData.map((item, index) => (
  //                   <div className="col-lg-6 mb-4">
  //                     <PropertiesCard key={index} data={item} />
  //                   </div>
  //                 ))}
  //               </div>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  //   </>
  // );

  return (
    <>
      <div className="ultraLuxuryUI">
        <div className="container">
          <div className="ha--UltraLuxuryUI">
            <div className="ha--ULAList ULASpacingSM">
              <div className="ULALayout">
                <div className="ha--ULAListRow">
                  <div className="ULAHeader">
                    <h1>{t("pages.luxury_apartments.serviced_villa.title")}</h1>
                    {/* <p>
                        Experience the epitome of luxury living in Dubai with
                        our handpicked selection of ultra-luxury apartmentss.
                      </p> */}
                    <p>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: t(
                            "pages.luxury_apartments.serviced_villa.info"
                          ),
                        }}
                      />
                    </p>
                  </div>

                  <div className="ha--ULAListCol">
                    <div className="ULACityList">
                      <ul className="ULAListing">
                        {cityList &&
                          cityList.map((item, index) => {
                            return (
                              <li
                                className={`cursor-pointer ULACityListItem ${
                                  index === activeTab ? "active" : ""
                                }`}
                                onClick={() => {
                                  filterCity(item);
                                  setActiveTab(index);
                                }}
                              >
                                {item.city_name}
                              </li>
                            );
                          })}
                        {/* <li className="ULACityListItem active">Dubai</li>
                        <li className="ULACityListItem">Abu Dhabi</li>
                        <li className="ULACityListItem">Tbilisi</li>
                        <li className="ULACityListItem">Muskat</li>
                        <li className="ULACityListItem">Sharjah</li> */}
                      </ul>
                    </div>
                  </div>
                  {displayedData.map((item, index) => {
                    if (index < loadItemCount) {
                      return (
                        <LuxuryApartmentsCard
                          key={index}
                          data={item}
                        ></LuxuryApartmentsCard>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            
              <div className="ULAPagination">
                <div className="ULAPaginationItem">
                  <span>
                    {loadItemCount} / {meta.total_results}
                  </span>
                  {loadItemCount != meta.total_results ? (
                    <div
                      className="paginationIconULA"
                      onClick={() => setloadItemCount(meta.total_results)}
                    >
                      <BsChevronDown size={40} />
                    </div>
                  ) : null}
                </div>
              </div>
           
          </div>
        </div>
      </div>
    </>
  );
};

export default LuxuryApartmentTwo;
