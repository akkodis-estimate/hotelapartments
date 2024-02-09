import { useEffect, useState } from "react";
import "./otpverify.css";
import authenticationService from "Services/authenticationService";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import maskingActions from "reducers/masking/masking.actions";
import { toast } from "react-toastify";
import { actions } from "reducers/customer/auth/auth.actions";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";
import { useRef } from "react";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import MobileSuccessMessage from "./MobileSuccessMessage";
import { userLoginAsync } from "reducers/customer/auth/auth.thunks";

const OTPVerify = ({ userData, redirectState }) => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [seconds, setSeconds] = useState(60);
  const requestRef = useRef();
  const startTimeRef = useRef();
  const [drawerOpen, setdrawerOpen] = useState(false);

  const { userDetails } = useSelector((state) => state.customerAuth);

  const animate = (timestamp) => {
    // debugger
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsedTime = timestamp - startTimeRef.current;
    const remainingSeconds = Math.max(60 - Math.floor(elapsedTime / 1000), 0);

    setSeconds(remainingSeconds);

    if (remainingSeconds > 0) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    
    if (otp.length === 4) {
      handleOtpVerification();
    }
  }, [otp]);


  useEffect(() => {
    if (userDetails) {
      
      // navigate("/");
      // Get the return path from the location state
      

      // Navigate the user back to the specific page
      const { innerWidth: width, innerHeight: height } = window;
      if (width <= ScreenResolutions.Width) {
        const returnPath = redirectState?.returnPath || "/";
        if (redirectState?.start_date && redirectState?.end_date) {
          navigate(returnPath, {
            state: {
              start_date: redirectState?.start_date,
              end_date: redirectState?.end_date,
            },
          });
        } else {
          navigate(returnPath);
        }
      }
      else{
        const returnPath = location.state?.returnPath || "/";
        if (location.state?.start_date && location?.state?.end_date) {
          navigate(returnPath, {
            state: {
              start_date: location.state?.start_date,
              end_date: location?.state?.end_date,
            },
          });
        } else {
          navigate(returnPath);
        }
      }
      
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const handleInputChange = (e, position) => {
    const { value } = e.target;

    setOtp(otp + value);

    // Move focus to the next input field
    if (value.length === 1 && e.target.nextElementSibling) {
      e.target.nextElementSibling.focus();
    }

    // Move focus to the previous input field on backspace/delete key press
    if (value.length === 0 && e.target.previousElementSibling) {
      e.target.previousElementSibling.focus();
    }

    if (value.length === 0) {
      // setOtp(otp.slice(0, -1));
      let newStr = otp.slice(0, position) + otp.slice(position + 1);
      setOtp(newStr);
    }
  };

  const handleOtpVerification = async () => {
    var payload = {
      code: otp,
      email: location.state?.email ? location.state?.email : userData?.email,
    };
    //Service Call
    dispatch(maskingActions.showMasking());
    await authenticationService
      .account_verify_otp(payload)
      .then((res) => {
        
        const { innerWidth: width } = window;
        dispatch(actions.verifyUserSuccess());
        dispatch(userLoginAsync({ email: location.state?.email ? location.state?.email : userData?.email, password: location.state?.password ? location.state?.password : userData?.password}));
        if (width <= ScreenResolutions.Width) {
          //open drawer
          setdrawerOpen(true);
        } else {
          //toast.success("User verified.Please Login to continue");
          //navigate(RoutePaths.AUTHORISATION.SIGN_IN);
        }
      })
      .catch((error) => {
        
        if (error && error.response) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  const handleResendOtp = () => {
    const payload = {
      email: location.state?.email ? location.state.email : userData?.email,
    };

    dispatch(maskingActions.showMasking());
    authenticationService
      .account_resend_otp(payload)
      .then((res) => {
        setTimeout(() => {
          toast.success("Otp sent successfully.!");
        }, 200);
      })
      .catch((error) => {
        if (error && error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again!");
        }
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
        resetTimer();
      });
  };

  const resetTimer = () => {
    setSeconds(60);
    startTimeRef.current = performance.now(); // Update the start time
    requestRef.current = requestAnimationFrame(animate);
  };

  return (
    <>
      <div className="row otpMainDes d-flex flex-column align-items-center justify-content-center w-100">
        <div className="col-lg-3">
          <div className="otpDesign d-flex flex-column align-items-center justify-content-center">
            <div className="otpHeader mb-5">
              <h2 className="text-center">Verification</h2>
              <p className="text-center">
                Please type the verification code sent to <br />
                {location.state?.number
                  ? location.state?.number
                  : userData?.phone_number}
              </p>
            </div>
            <div className="otpInput d-flex gap-3 mb-5">
              {/* <input type="number" class="form-control" />
            <input type="number" class="form-control" />
            <input type="number" class="form-control" />
            <input type="number" class="form-control" /> */}
              <input
                type="text"
                maxLength={1}
                class="form-control"
                value={otp[0] || ""}
                onChange={(e) => handleInputChange(e, 0)}
              />
              <input
                type="text"
                maxLength={1}
                class="form-control"
                value={otp[1] || ""}
                onChange={(e) => handleInputChange(e, 1)}
              />
              <input
                type="text"
                maxLength={1}
                class="form-control"
                value={otp[2] || ""}
                onChange={(e) => handleInputChange(e, 2)}
              />
              <input
                type="text"
                maxLength={1}
                class="form-control"
                value={otp[3] || ""}
                onChange={(e) => handleInputChange(e, 3)}
              />
            </div>
            <span className="counterSec">{seconds} sec.</span>
            <p className="sendAgainCode">
              Don't get a code? &nbsp;
              <span
                className={`text-decoration-underline cursor-pointer ${
                  seconds === 0 ? "" : "otpDisabled"
                }`}
                onClick={handleResendOtp}
              >
                Send again
              </span>
            </p>
          </div>
        </div>
      </div>
      <MobileDrawer openDrawer={drawerOpen} setopenDrawer={setdrawerOpen}>
        <MobileSuccessMessage />
      </MobileDrawer>
    </>
  );
};

export default OTPVerify;
