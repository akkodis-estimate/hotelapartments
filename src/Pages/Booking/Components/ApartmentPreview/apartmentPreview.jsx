import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import FilterCalendarIcon from "Assets/Images/FeaturedPropertiesIcons/FilterCalendarIcon";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import { truncateText } from "Helpers/commonMethodHelper";
import { useTranslation } from "react-i18next";

const ApartmentPreview = (props) => {
    const { t } = useTranslation();
    return (
        <div className="checkoutCard mb-4">
            <div className="COTitle mb-4">
                <h6>{t("pages.booking.apartment_preview.title")}</h6>
            </div>
            <div className="properiesDetailSum d-flex align-items-center gap-3 mb-4">
                <div className="previewImgContainer">
                <img src={props?.apartmentPreviewData?.image_url ? props?.apartmentPreviewData?.image_url?.replace(/\/([^/]+)$/, '/thumb_$1') : AppartmentImg} alt="ApartmentImage" onError={(event) => {
                                      event.target.src = props?.apartmentPreviewData?.image_url || AppartmentImg;
                                    }} />
                </div>
                <div className="properiesDetailSumContent">
                    <p>{props?.apartmentPreviewData?.title}</p>
                    <p className="previewSummryDtl" title={props?.apartmentPreviewData?.descriprion}>
                        {/* {props?.apartmentPreviewData?.descriprion} */}
                        {props?.apartmentPreviewData?.descriprion?.length <= 65 ? props?.apartmentPreviewData?.descriprion : truncateText(props?.apartmentPreviewData?.descriprion, 65)}
                    </p>
                </div>
            </div>
            <div className="dateBed d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                    <FilterCalendarIcon />
                    <strong>{t("pages.properties.card.dates")}:</strong> {props?.apartmentPreviewData?.start_date} – {props?.apartmentPreviewData?.end_date}
                </div>
                {/* <span className="dateEdit">{t("common_lables.edit")}</span> */}
            </div>

            <div className="dateBed d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                    <FBedIcon />
                    <strong>{t("pages.properties.feature_properties.bedrooms")} :</strong> {props?.apartmentPreviewData?.bedrooms}
                </div>
            </div>
        </div>
    );

}

export default ApartmentPreview;