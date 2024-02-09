import "Pages/Properties/PropertiesDetail/Components/AmmenitiesModal/ammenitiesmodal.css";
import { useTranslation } from "react-i18next";

const AmmenitiesModal = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="modal-header ammenitiesModalSm">
        <h2>{t("pages.properties.amenities")}</h2>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            props.setShowAmmenities(false);
          }}
        ></button>
      </div>
      <div className="modal-body ammenitiesModalContentSm">
        <ul className="ammenistiesList">
          {props.apartmentAmmenities.map((item, index) => (
            <li className="d-flex align-items-center ammenitiesItem gap-3">
              <span></span>
              <p>{item.name}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AmmenitiesModal;
