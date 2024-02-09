import validationHelper from "Helpers/validationHelper";
import reviewService from "Services/reviewService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import maskingActions from "reducers/masking/masking.actions";
import "./leavereview.css";
import { toast } from "react-toastify";

const LeaveReview = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const default_form_data = {
    description: "",
    customer_id: 0,
    apartment_id: 0,
    property_id: 0,
    booking_id: 0,
  };
  const default_form_validation = {
    description: "",
  };

  const [formData, setFormData] = useState(default_form_data);
  const [formValidation, setFormValidation] = useState(default_form_validation);

  useEffect(() => {
    const user_list = setTimeout(() => {
      if (props?.data)
        setFormData((prevState) => {
          return {
            ...prevState,
            ...props.data,
          };
        });
    }, 100);

    return () => {
      clearTimeout(user_list);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runValidations = async () => {
    const updatedValidations = {
      description: validationHelper.validateDescription(
        formData.description,
        "description"
      ),
    };
    return updatedValidations;
  };

  const onChangeFormData = async (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    const errors = {
      ...formValidation,
    };
    switch (name) {
      case "description":
        errors[name] = validationHelper.validateDescription(value, name);
        break;
      default:
        
    }
    setFormValidation(errors);
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const onSubmitFormData = async (event) => {
    event.preventDefault();
    const errors = await runValidations();
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;
    if (isRequiredFieldsAreValid) {
      dispatch(maskingActions.showMasking());
      reviewService
        .review_create(formData)
        .then(() => {
          props.closeAddReview(true);
          props.setSuccessModal(true);
        })
        .catch((err) => {
          toast.error("Something went wrong");
          
        })
        .finally(() => {
          dispatch(maskingActions.hideMasking());
        });
    } else {
      setFormValidation(errors);
    }
  };

  return (
    <>
      <div className="modal-header border-0 p-0">
        {props.false ? (
          <>{/* Render props.false content here */}</>
        ) : (
          <>
            <button
              type="button"
              className="btn-close"
              onClick={() => {
                props.closeAddReview();
              }}
            ></button>
          </>
        )}
      </div>
      <div className="modal-body p-0 d-flex flex-column align-items-center justify-content-center text-center">
        <div className="modalPageTitle">
          <h2> {t("pages.AccountSettings.booking.leave_review.opinion")}</h2>
          <p>{t("pages.AccountSettings.booking.leave_review.experience")}</p>
        </div>
        <form className="w-100 mt-5">
          <div className="row">
            <div className="col-lg-12">
              <div class="mb-5 d-flex flex-column align-items-start">
                <textarea
                  class="form-control"
                  name="description"
                  rows="10"
                  placeholder={t(
                    "pages.AccountSettings.booking.leave_review.message"
                  )}
                  value={formData.description}
                  onChange={onChangeFormData}
                  onBlur={(e) => {
                    setFormData((prevState) => {
                      return {
                        ...prevState,
                        description: e.target.value.trimStart().trimEnd(),
                      };
                    });
                  }}
                ></textarea>
                <label class="form-label">
                  {formData.description.trimStart().trimEnd().length}/500 words
                </label>
                {formValidation.description && (
                  <div className="invalid">{t(formValidation.description)}</div>
                )}
              </div>
              <div className="actionBtn mb-0">
                <button
                  type="button"
                  className="AuthBtn"
                  onClick={onSubmitFormData}
                >
                  {t("pages.AccountSettings.booking.extension.send")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default LeaveReview;
