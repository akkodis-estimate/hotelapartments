import inboxService from "Services/InboxService";
import { useEffect,useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import maskingActions from "reducers/masking/masking.actions";
import validationHelper from "Helpers/validationHelper";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";

const ResponsiveSendMessage = ({
  sendMessage,
  setOpenInboxDrawer,
  saveOneRecord,
}) => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageValidation, setmessageValidation] = useState({ message: "" });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    
  }, []);
  const send_message = (e) => {
    const req_body = {
      booking_id: saveOneRecord[0]?.booking_id,
      message: message,
    };

    e.preventDefault();
    // Run validations
    const errors = runValidations();
    // Check if all required fields are valid
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;
    if (isRequiredFieldsAreValid) {
      dispatch(maskingActions.showMasking());
      inboxService
        .post_inbox_customer(req_body)
        .then((res) => {
          
        })
        .catch((err) => {
          //Do Something
        })
        .finally(() => {
          //Do Something
          //   hideSendMessagePopup();
          setOpenInboxDrawer(false);
          dispatch(maskingActions.hideMasking());
          let width = window.innerWidth;
          if (width <= ScreenResolutions.Width) {
            navigate(RoutePaths.ACCOUNT.MOBILE_INBOX_LIST);
          } else {
            navigate("/account/inbox", {
              state: { bookingID: saveOneRecord[0]?.booking_id },
            });
          }
        });
    } else {
      setmessageValidation(errors);
    }
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const errors = {
      ...messageValidation,
    };
    // Validate the input based on the name of the field
    switch (name) {
      case "message":
        errors[name] = validationHelper.validateMessage(value);
        break;

      default:
        break;
    }
    // Set the form validation and form data
    setmessageValidation(errors);

    setMessage(value);
  };

  // Function to run validations on form data
  const runValidations = () => {
    // Initialize object to store validations
    const updatedValidations = {
      message: validationHelper.validateMessage(message),
    };
    // Return updated validations
    return updatedValidations;
  };
  return (
    <>
      <div className="modal-header border-0 p-0">
        <h2>Send message</h2>
      </div>

      <div className="modal-body p-0 pt-4">
        <form action=""></form>
        <div className="row">
          <div className="col-lg-12 p-0">
            <div className="mb-3">
              <label className="form-label">Message</label>
              <input
                type="text"
                className="form-control"
                name="message"
                placeholder="Send Message"
                onChange={handleTextChange}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && message) {
                    send_message(event);
                  }
                }}
              />
              {messageValidation.message && (
                <div className="invalid">{t(messageValidation.message)}</div>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3 mt-4">
          <div className="actionBtn mb-0">
            <button
              type="button"
              className="AuthBtn"
              style={{
                color: "black",
                backgroundColor: "#E9ECEF",
                borderColor: "#E9ECEF",
              }}
              onClick={() => {
                setOpenInboxDrawer(false);
              }}
            >
              Cancel
            </button>
          </div>

          <div className="actionBtn mb-0">
            <button type="button" className="AuthBtn" onClick={send_message}>
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveSendMessage;
