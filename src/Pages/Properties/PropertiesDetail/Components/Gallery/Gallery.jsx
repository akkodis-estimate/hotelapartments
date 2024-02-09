import { useState, useEffect } from "react";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import AppartImg from "Assets/Images/HomeIcons/AppartMentImages/Jumeriah.png";
import FA2 from "Assets/Images/HomeIcons/AppartMentImages/FA2.png";
import FA3 from "Assets/Images/HomeIcons/AppartMentImages/FA3.png";
import GalleryModal from "../GalleryModal/GalleryModal";
import { useTranslation } from "react-i18next";
import AppartmentImg from "Assets/Images/FeaturedPropertiesIcons/No-Image-Found-1.jpg";
import "Pages/Properties/PropertiesDetail/Components/Gallery/Gallery.css";

const Gallery = ({ galleryImages }) => {
  const { t } = useTranslation();
  const [showGallery, setShowGallery] = useState(false);
  const [primaryImage, setPrimaryImage] = useState(null);

  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      setPrimaryImage(galleryImages[0].image_url);

      var primaryImageObject = galleryImages?.find(
        (x) => x.is_primary === true
      );

      if (primaryImageObject !== undefined)
        setPrimaryImage(primaryImageObject.image_url);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {galleryImages && galleryImages.length > 0 && (
        <div
          className="propertyDGallery cursor-pointer"
          onClick={() => setShowGallery(true)}
        >
          {/* <div className="row">
            {primaryImage && (
              <div className="col-lg-6">
                <div className="mainPDetailImage position-relative">
                  <img
                    src={primaryImage?.replace(/\/([^/]+)$/, "/thumb_$1")}
                    alt="PropertyDetailImg"
                    onError={(event) => {
                      event.target.src = primaryImage;
                    }}
                  />
                  <div className="animateBtn me-3">
                    <button type="button" className="appBtn bg-white">
                      {t("pages.home.view_all")} {galleryImages?.length}{" "}
                      {t("pages.properties.photos")}
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="col-lg-6 p-0 propertyDetailExtraGallerySm">
              <div className="row propertyDetailImgColumn">
                {galleryImages &&
                  galleryImages
                    ?.filter(
                      (x) =>
                        x.is_primary === false && x.image_url !== primaryImage
                    )
                    ?.map((item, index) => {
                      if (index < 4) {
                        return (
                          <div className="col-lg-6 mb-4" key={index}>
                            <img
                              src={
                                item.image_url
                                  ? `${item.image_url?.replace(
                                      /\/([^/]+)$/,
                                      "/thumb_$1"
                                    )}`
                                  : ""
                              }
                              alt="PropertyDetailImg"
                              onError={(event) => {
                                event.target.src = item.image_url;
                              }}
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
              </div>
            </div>
          </div> */}

    <div className="propertyDetailGallery cursor-pointer">
              {primaryImage && (
                <div className="prptyDtlImageCol prptyDtlImageMainCol">
                  <span className="prptyDtlImage position-relative">
                    {/* <img src={AppartImg} alt="" /> */}
                    <img
                      src={primaryImage?.replace(/\/([^/]+)$/, "/thumb_$1")}
                      alt="PropertyDetailImg"
                      onError={(event) => {
                        event.target.src = primaryImage;
                      }}
                    />
                    <div className="animateBtn me-3">
                      <button type="button" className="appBtn bg-white">
                        {t("pages.home.view_all")} {galleryImages?.length}{" "}
                        {t("pages.properties.photos")}
                      </button>
                    </div>
                  </span>
                </div>
              )}

              {galleryImages &&
                galleryImages
                  ?.filter(
                    (x) =>
                      x.is_primary === false && x.image_url !== primaryImage
                  )
                  ?.map((item, index) => {
                    if (index < 4) {
                      return (
                        <div className="prptyDtlImageCol" key={index}>
                          <span className="prptyDtlImage">
                            <img
                              src={
                                item.image_url
                                  ? `${item.image_url?.replace(
                                      /\/([^/]+)$/,
                                      "/thumb_$1"
                                    )}`
                                  : ""
                              }
                              alt="PropertyDetailImg"
                              onError={(event) => {
                                event.target.src = item.image_url;
                              }}
                            />
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
              {/* 
          <div className="prptyDtlImageCol">
            <span className="prptyDtlImage">
              <img src={AppartImg} alt="" />
            </span>
          </div>
          <div className="prptyDtlImageCol">
            <span className="prptyDtlImage">
              <img src={AppartImg} alt="" />
            </span>
          </div>
          <div className="prptyDtlImageCol">
            <span className="prptyDtlImage">
              <img src={AppartImg} alt="" />
            </span>
          </div>
          <div className="prptyDtlImageCol">
            <span className="prptyDtlImage">
              <img src={AppartImg} alt="" />
            </span>
          </div> */}
            </div>
        </div>
      )}

      <ModalPopup show={showGallery} dialogClassName="GalleryModal">
        <GalleryModal
          setShowGallery={setShowGallery}
          galleryImages={galleryImages}
        />
      </ModalPopup>
    </>
  );
};

export default Gallery;
