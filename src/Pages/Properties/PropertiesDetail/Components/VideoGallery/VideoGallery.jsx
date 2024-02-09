import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from "react-i18next";


const VideoGallery = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="videoGalleryModal">
        <button
          type="button"
          className="btn-close galleryBtn"
          onClick={() => {
            props.setShowVideoGallery(false);
          }}
        ></button>


        {props?.videoData && props?.videoData?.length > 0 && (
          <Carousel fade>
            {props.videoData.map((item, index) => (
              <Carousel.Item key={index}>
                <div className="videoGallery">
                  <video
                    width="100%"
                    height="100%"
                    controls={true}
                  >
                    <source src={item.video_url} type="video/mp4" />
                    {/* <source src="movie.ogg" type="video/ogg" /> */}
                    {t("pages.luxury_apartments.no_support_video")}
                  </video>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        )}
      </div>
    </>
  );
};
export default VideoGallery