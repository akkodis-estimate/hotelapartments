import SortingIcon from "Assets/Images/FeaturedPropertiesIcons/SortingIcon";
import MapIcon from "Assets/Images/HomeIcons/MapIcon";
import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import "Pages/Properties/FeaturedProperties/Components/AreasList/AreasList.css";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const AreasListModal = (props) => {
    const { t } = useTranslation();

    const [dropdownOpen, setIsDropdownOpen] = useState(false);
    const [newArr, setNewArr] = useState(props?.areas);
    const [selectedValue, setSelectedValue] = useState(1);

    // Sorting logic based on the selected sorting order
    const sortedData = (value) => {
        if(value === 1){
            setNewArr(props?.areas);
            setSelectedValue(1);
        }
        else if(value === 2){
            setNewArr([...props?.areas].sort((a, b) => a.area_name.localeCompare(b.area_name)))
            setSelectedValue(2);
        }
        else if(value === 3){
            setNewArr([...props?.areas].sort((a, b) => b.area_name.localeCompare(a.area_name)))
            setSelectedValue(3);
        }
        
        setIsDropdownOpen(false);
    };

    useEffect(() => {

    }, [newArr])

    const seoInfoClick = (link) => {
        if(link){
          const url = SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_ENTITY, [link]);
        //   window.open(url, '_blank');
        return url;
        }
      };

    return (
        <>
            <div className="modal-header areasListHeaderSm">
                <h2>{t("modules.areas")}</h2>

                <div className="d-flex align-items-center gap-3">
                    <div class="dropdown allAreasSorting">
                        <button
                            class="btn btn-secondary dropdown-toggle p-0 border-0"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            onClick={() => setIsDropdownOpen(true)}
                        >
                            <SortingIcon />
                        </button>

                        {/* ... content */}

                        <ul className={`dropdown-menu filterLocationList ${dropdownOpen ? "show" : ""}`} data-popper-placement="bottom-end">
                            <div className="w-100">

                                <ul className={`align-items-start dropdown-menu-lg-start ${dropdownOpen ? "d-flex flex-column show" : ""}`} data-popper-placement="bottom-end">

                                    <li className="sortByItem" onClick={() => sortedData(1)}>
                                        <div class="form-check d-flex align-items-center gap-2">
                                            <input
                                                class="form-check-input"
                                                type="radio"
                                                name="flexRadioDefaultforAreas"
                                                id="flexRadioDefault0As"
                                                //defaultChecked={true}
                                                checked={selectedValue === 1}
                                            />
                                            <label class="form-check-label mt-1" for="flexRadioDefault0As">
                                                {t("common_lables.recently_added")}
                                            </label>
                                        </div>
                                    </li>

                                    <li className="sortByItem" onClick={() => sortedData(2)}>
                                        <div class="form-check d-flex align-items-center gap-2">
                                            <input
                                                class="form-check-input"
                                                type="radio"
                                                name="flexRadioDefaultforAreas"
                                                id="flexRadioDefault1Asc"
                                            //defaultChecked={true}
                                            checked={selectedValue === 2}
                                            />
                                            <label class="form-check-label mt-1" for="flexRadioDefault1Asc">
                                                {t("common_lables.ascending")}
                                            </label>
                                        </div>
                                    </li>
                                    <li className="sortByItem" onClick={() => sortedData(3)}>
                                        <div class="form-check d-flex align-items-center gap-2">
                                            <input
                                                class="form-check-input"
                                                type="radio"
                                                name="flexRadioDefaultforAreas"
                                                id="flexRadioDefault2Desc"
                                            //defaultChecked={true}
                                            checked={selectedValue === 3}
                                            />
                                            <label class="form-check-label mt-1" for="flexRadioDefault2Desc">
                                                {t("common_lables.descending")}
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                        </ul>

                    </div>

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => {
                            props.setShowAllAreas(false);
                        }}
                    ></button>
                </div>
            </div>
            <div className="modal-body areasListSm">
                <ul className="ammenistiesList">
                    {newArr?.length > 0 && newArr?.map((item, index) => (
                        <li 
                        // onClick={() => {seoInfoClick(item.link)}}
                         className="d-flex align-items-center ammenitiesItem gap-3 cursor-pointer">
                           
                           <a href={seoInfoClick(item.link)} target="_blank" >
                                {item.area_name}
                              </a>
                            {/* <div><MapIcon /></div>
                            <p>{item.area_name}</p> */}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default AreasListModal;
