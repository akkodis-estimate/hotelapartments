import Carousel from "react-bootstrap/Carousel";
import "Pages/Properties/PropertiesDetail/Components/GalleryModal/gallerymodal.css";

const GalleryModal = (props) => {
  return (
    <>
      <button
        type="button"
        className="btn-close galleryBtn"
        onClick={() => {
          props.setShowGallery(false);
        }}
      ></button>

      <Carousel fade>
      {props.galleryImages.map((item, index) => (
        <Carousel.Item>
          <img className="d-block w-100" src={item.image_url} alt="First slide" />
        </Carousel.Item>
        ))}
      </Carousel>
    </>
  );
};

export default GalleryModal;
