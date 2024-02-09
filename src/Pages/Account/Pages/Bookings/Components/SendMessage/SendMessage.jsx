import inboxService from "Services/InboxService";
import { useState, useEffect } from "react";
import validationHelper from "Helpers/validationHelper";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import maskingActions from "reducers/masking/masking.actions";
import { useNavigate } from "react-router-dom";

const SendMessage = ({ sendMessage, setSendMessage, hideSendMessagePopup }) => {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messageValidation, setmessageValidation] = useState({ message: "" });
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const send_message = (e) => {
    const req_body = {
      booking_id: sendMessage.booking_id,
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
        .then((res) => {})
        .catch((err) => {
          //Do Something
        })
        .finally(() => {
          //Do Something
          hideSendMessagePopup();
          dispatch(maskingActions.hideMasking());
          navigate("/account/inbox", {
            state: { bookingID: sendMessage.booking_id },
          });
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
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            setSendMessage((prevState) => {
              return {
                ...prevState,
                send_message: false,
              };
            });
          }}
        ></button>
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
                setSendMessage((prevState) => {
                  return {
                    ...prevState,
                    send_message: false,
                  };
                });
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

export default SendMessage;
