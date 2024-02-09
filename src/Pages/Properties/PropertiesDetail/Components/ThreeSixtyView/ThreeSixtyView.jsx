import Carousel from "react-bootstrap/Carousel";
import { useTranslation } from "react-i18next";
// import DefaultImage from 'Assets/Images/3d (1).jpg'
import DefaultImage from 'Assets/Images/3d (1).jpg'
import { Pannellum } from "pannellum-react";
//import { ReactPhotoSphereViewer } from "react-photo-sphere-viewer";
import { useEffect, useState } from "react";
import maskingActions from "reducers/masking/masking.actions";
import { useDispatch } from "react-redux";


const ThreeSixtyView = (props) => {

  const dispatch = useDispatch();
  const [imge360, setImge360] = useState([]);
  const [StoreImage, setStoreImage] = useState();
  // useEffect(() => {

  //   if (props.images360Data !== null) {
  //     setImge360(props.images360Data)


  //     fetch(imge360[0])
  //       .then(response => response.blob())
  //       .then(blob => {
  //         setStoreImage(blob);
  //       })
  //       .catch(error => {
  
  //       });
  
  //   }
  // }, []);
  // console.clear();
  


  const { t } = useTranslation();

  const handleFrameLoad = () => {
    dispatch(maskingActions.hideMasking());
  };

  return (
    <>
      {/* <div className="videoGalleryModal">
        <button
          type="button"
          className="btn-close galleryBtn"
          onClick={() => {
            props.setShowVideoGallery(false);
          }}
        ></button>

        <Carousel fade>
          {imge360.map((item, index) => (

            <Carousel.Item key={index}>

              <ReactPhotoSphereViewer
                littlePlanet={true}
                src={item.image_url}
                height={'70vh'}
                width={"100%"}>

              </ReactPhotoSphereViewer>


            </Carousel.Item>
          ))}
        </Carousel>




      </div > */}
      <iframe
        style={{ height: '90vh' }}
        src={props.images360Data[0]?.image_url}
        title="Preview Apartments"
        width="100%"
        height="100%"
        onLoad={handleFrameLoad}
      ></iframe>

    </>
  );
};
export default ThreeSixtyView