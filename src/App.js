import AppRoutes from "./Routes/Routes";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import CustomLoader from "Components/Loader/CustomLoader";
import { ToastContainer } from "react-toastify";
import 'react-phone-number-input/style.css'


function App() {
  const { isLoading } = useSelector((state) => state.customerAuth);

  const { isMasked } = useSelector((state) => state.masking);
  return (
    <>
      {isLoading && <CustomLoader />}
      {isMasked && <CustomLoader />}
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;
