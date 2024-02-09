import MapArea from "Assets/Images/FeaturedPropertiesIcons/MapUI.png";
import MaximizeIcon from "Assets/Images/FeaturedPropertiesIcons/MaximizeIcon";
import MinimizeIcon from "Assets/Images/FeaturedPropertiesIcons/MinimizeIcon";
import { BsArrowRight } from "react-icons/bs";
import "Pages/Properties/FeaturedProperties/Components/PropertiesMap/propertiesmap.css";
import FeaturedMap from "Components/Shared/GoogleMap/FeaturedMap";
import { useTranslation } from "react-i18next";

const PropertiesMap = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="propertiesMapUI">
        {/* <img src={MapArea} alt="MapUI" className="w-100" /> */}
        <FeaturedMap propertyDetails={props?.propertyDetails} />
        <div className="mapActionBtn d-flex align-items-center gap-4">
          <div className="maximiseMinize">
            <span>
              <MaximizeIcon />
              <MinimizeIcon />
            </span>
          </div>
          <div className="animateBtn me-3">
            <button type="button" className="appBtn bg-white">
              {t("pages.properties.close_map")}
              <span className="btnIcon">
                <BsArrowRight />
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertiesMap;
