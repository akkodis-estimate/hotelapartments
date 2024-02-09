import SortingIcon from "Assets/Images/FeaturedPropertiesIcons/SortingIcon";
import BuildingIcon from "Assets/Images/HomeIcons/BuildingIcon";
import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import "Pages/Properties/FeaturedProperties/Components/HotelsList/HotelsList.css";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const HotelsModal = (props) => {
  const { t } = useTranslation();

  const [dropdownOpen, setIsDropdownOpen] = useState(false);

  const [newArr, setNewArr] = useState(props?.hotels);
    const [selectedValue, setSelectedValue] = useState(1);

    // Sorting logic based on the selected sorting order
    const sortedData = (value) => {
        if(value === 1){
            setNewArr(props?.hotels);
            setSelectedValue(1);
        }
        else if(value === 2){
            setNewArr([...props?.hotels].sort((a, b) => a.name.localeCompare(b.name)))
            setSelectedValue(2);
        }
        else if(value === 3){
            setNewArr([...props?.hotels].sort((a, b) => b.name.localeCompare(a.name)))
            setSelectedValue(3);
        }
        
        setIsDropdownOpen(false);
    };

    useEffect(() => {
      
    }, [newArr, dropdownOpen])

    const seoInfoClick = (link) => {
      if(link){
        const url = SetDynamicEndpoint(RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_ENTITY, [link]);
        // window.open(url, '_blank');
        return url;
      }
    };

  return (
    <>
      <div className="modal-header areasListHeaderSm">
        <h2>{t("modules.hotels")}</h2>

        <div className="d-flex align-items-center gap-3">
          <div class="dropdown allAreasSorting">
            <button
              class="btn btn-secondary dropdown-toggle p-0 border-0"
              type="button"
              data-bs-toggle="dropdown"
              data-bs-auto-close="true"
              aria-expanded="false"
              onClick={() => setIsDropdownOpen(true)}
            >
              <SortingIcon />
            </button>

            {/* ... content */}

            <ul className={`dropdown-menu filterLocationList ${dropdownOpen ? "show" : ""}`} data-popper-placement="bottom-end">
              <div className="w-100">

                <ul className={`align-items-start dropdown-menu-lg-start ${dropdownOpen ? "d-flex flex-column show" : ""}`} data-popper-placement="bottom-end">

                  <li className="sortByItem">
                    <div class="form-check d-flex align-items-center gap-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefaultforHotels"
                        id="flexRadioDefault0HAs"
                        value={1}
                        onClick={(e) =>  {sortedData(1); setIsDropdownOpen(false)}}
                        checked={selectedValue === 1}

                      />
                      <label class="form-check-label mt-1" for="flexRadioDefault0HAs">
                        {t("common_lables.recently_added")}
                      </label>
                    </div>
                  </li>

                  <li className="sortByItem">
                    <div class="form-check d-flex align-items-center gap-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefaultforHotels"
                        id="flexRadioDefault1HAsc"
                        onClick={(e) => {sortedData(2); setIsDropdownOpen(false)}}
                        value={2}
                        checked={selectedValue === 2}
                      />
                      <label class="form-check-label mt-1" for="flexRadioDefault1HAsc">
                        {t("common_lables.ascending")}
                      </label>
                    </div>
                  </li>
                  <li className="sortByItem">
                    <div class="form-check d-flex align-items-center gap-2">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="flexRadioDefaultforHotels"
                        id="flexRadioDefault2HDesc"
                        onClick={(e) =>  {sortedData(3); setIsDropdownOpen(false)}}
                        value={3}
                        checked={selectedValue === 3}
                      />
                      <label class="form-check-label mt-1" for="flexRadioDefault2HDesc">
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
              props.setShowAllHotels(false);
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
              {/* <div><BuildingIcon /></div>
              <p>{item.name}</p> */}
              <a href={seoInfoClick(item.link)} target="_blank">
                                {item.name}
                              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HotelsModal;
