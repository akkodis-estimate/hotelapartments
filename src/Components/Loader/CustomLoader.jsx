import { useLocation } from 'react-router-dom';
import './CustomLoader.css';

const CustomLoader = () => {
  const location = useLocation();

  return (
    <>
      {!location?.pathname?.includes("apartment-details") && !location?.pathname?.includes("furnished-serviced-rentals") &&
        <div className="overlay_wrapper">
          <div className="loader2"></div>
        </div>}
    </>
  );
};

export default CustomLoader;
