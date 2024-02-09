import { NumberInput, TextInput } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import validationHelper from "Helpers/validationHelper";
import bookingService from "Services/bookingService";
import reviewService from "Services/reviewService";
import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsCalendar3 } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import maskingActions from "reducers/masking/masking.actions";

const ModificatoinRequest = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const default_form_data = {
    booking_sid: 0,
    start_date: "",
    end_date: "",
    no_of_nights: ""
  };
  const default_form_validation = {
    start_date: "",
    end_date: "",
  };

  const [formData, setFormData] = useState(default_form_data);
  const [formValidation, setFormValidation] = useState(default_form_validation);

  useEffect(() => {
    const user_list = setTimeout(() => {
      if (props?.data) {
        dispatch(maskingActions.showMasking());
        getRefundBySID(props.data.booking_sid);

        console.clear();

      }
    }, 100);

    return () => {
      clearTimeout(user_list);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRefundBySID = (booking_sid) => {
    reviewService
      .get_refund(booking_sid)
      .then((res) => {
        if (res.data)
          setFormData((prevState) => {
            return {
              ...prevState,
              ...res.data,
              ...props.data,
              start_date: props.data.startdate_utc,
              end_date: props.data.check_out,
              no_of_nights: res.data?.no_of_nights
            };
          });
      })
      .catch((err) => {
        props.setRefundRequestModel();

        toast.error("Something Went Wrong");
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  const runValidations = async () => {
    const updatedValidations = {
      start_date: validationHelper.validateOnlyDate(
        formData.start_date,
        "start date"
      ),
      end_date: validationHelper.validateOnlyDate(
        formData.end_date,
        "end date"
      ),
    };
    if (updatedValidations.start_date === "") {
      const error = validationHelper.dateDifference(
        formData.start_date,
        formData.end_date
      );
      if (error.error !== "")
        updatedValidations.start_date = validationHelper.dyanmicTranslation(
          t(error.error),
          error.replaceArray
        );
    }
    return updatedValidations;
  };

  const onChangeFormData = async (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    const errors = {
      ...formValidation,
    };
    switch (name) {
      case "start_date":
        formData.end_date = "";
        errors[name] = validationHelper.validateOnlyDate(
          value,
          "start date",
          true
        );
        if (errors[name] === "") {
          const error = validationHelper.dateDifference(
            value,
            formData.end_date
          );
          errors["start_date"] = "";
          if (error.error !== "")
            errors[name] = validationHelper.dyanmicTranslation(
              t(error.error),
              error.replaceArray
            );
        }
        break;
      case "end_date":
        errors[name] = validationHelper.validateOnlyDate(
          value,
          "end date",
          true
        );
        if (errors[name] === "") {
          const error = validationHelper.dateDifference(
            formData.start_date,
            value
          );
          errors["start_date"] = "";
          if (error.error !== "")
            errors["start_date"] = validationHelper.dyanmicTranslation(
              t(error.error),
              error.replaceArray
            );
        }
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

  const onChangeDatePicker = async (name, value) => {

    const errors = {
      ...formValidation,
    };
    switch (name) {
      case "start_date":
        errors[name] = validationHelper.validateOnlyDate(
          value,
          "start date",
          true
        );
        if (errors[name] === "") {
          const error = validationHelper.dateDifference(
            value,
            formData.end_date
          );
          errors["start_date"] = "";
          if (error.error !== "")
            errors[name] = validationHelper.dyanmicTranslation(
              t(error.error),
              error.replaceArray
            );
        }
        break;
      case "end_date":
        errors[name] = validationHelper.validateOnlyDate(
          value,
          "end date",
          true
        );
        if (errors[name] === "") {
          const error = validationHelper.dateDifference(
            formData.start_date,
            value
          );
          errors["start_date"] = "";
          if (error.error !== "")
            errors["start_date"] = validationHelper.dyanmicTranslation(
              t(error.error),
              error.replaceArray
            );
        }
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
      let new_form_data = {
        start_date: formData.start_date,
        end_date: formData.end_date,
      };
      bookingService
        .booking_modification_create(formData.booking_sid, new_form_data)
        .then(() => {
          props.setModificationRequestModel(true);
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
        <h2>{t("pages.AccountSettings.booking.modification_request.title")}</h2>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            props.setModificationRequestModel();
          }}
        ></button>
      </div>
      <div className="modal-body p-0">
        <div className="ha--modificationRqstModal">
          <div className="">
            <label className="form-label">{t("pages.AccountSettings.booking.extension.book_number")}</label>
            <NumberInput
              type="number"
              name="booking_id"
              disabled
              value={formData.booking_id}
            />
          </div>
          <div className="">
            <label className="form-label">{t("pages.AccountSettings.booking.extension.property_name")}</label>
            <TextInput
              type="text"
              name="property_name"
              disabled={true}
              value={formData.property_name}
            />
          </div>
          <div className="">
            <label className="form-label">{t("pages.AccountSettings.booking.extension.guest_name")}</label>
            <TextInput
              type="text"
              name="customer_name"
              disabled={true}
              value={formData.customer_name}
            />
          </div>
          <div className="ha--Samerow">

            <div className="ha-sameRowCol">
              <label className="label form-label">
                {t("pages.AccountSettings.booking.extension.startdate")}
              </label>
              {/* <input
                  type="date"
                  name="start_date"
                  className="form-control"
                  min={moment().format("YYYY-MM-DD")}
                  placeholder={t("pages.AccountSettings.booking.extension.startdate")}
                  value={moment(formData.start_date).format("YYYY-MM-DD")}
                  onChange={onChangeFormData}
                  //max={formData.end_date ? moment(formData.end_date).subtract(30, 'days').format("YYYY-MM-DD") : null}
                /> */}

              <DatePickerInput
                icon={<BsCalendar3 size="1.1rem" stroke={1.5} />}
                placeholder={t("pages.AccountSettings.booking.extension.startdate")}
                onChange={(value) => onChangeDatePicker("start_date", value)}
                name="start_date"
                valueFormat="DD-MM-YYYY"
                value={formData.start_date != "" ? moment(formData.start_date).toDate() : null}
                minDate={moment().toDate()}
              />
              {formValidation.start_date && (
                <div className="invalid">{t(formValidation.start_date)}</div>
              )}
            </div>
            <div className="ha-sameRowCol">
              <label className="label form-label">
                {t("pages.AccountSettings.booking.extension.enddate")}
              </label>
              {/* <input
                type="date"
                name="end_date"
                className="form-control"
                //min={moment().format("YYYY-MM-DD")}
                placeholder={t("pages.AccountSettings.booking.extension.enddate")}
                value={moment(formData.end_date).format("YYYY-MM-DD")}
                onChange={onChangeFormData}
                disabled={!formData.start_date}
                min={formData.start_date ? moment(formData.start_date).add((formData?.no_of_nights && formData?.no_of_nights != null && formData?.no_of_nights != 30) ? formData?.no_of_nights : 30, 'days').format("YYYY-MM-DD") : null}
              /> */}

              <DatePickerInput
                disabled={!formData.start_date}
                icon={<BsCalendar3 size="1.1rem" stroke={1.5} />}
                placeholder={t("pages.AccountSettings.booking.extension.enddate")}
                onChange={(value) => onChangeDatePicker("end_date", value)}
                name="end_date"
                valueFormat="DD-MM-YYYY"
                value={formData.end_date != "" ? moment(formData.end_date).toDate() : null}
                minDate={formData.start_date ? moment(formData.start_date).add((formData?.no_of_nights && formData?.no_of_nights != null && formData?.no_of_nights != 30) ? formData?.no_of_nights : 30, 'days').toDate() : null}
              />
              {formValidation.end_date && (
                <div className="invalid">{t(formValidation.end_date)}</div>
              )}
            </div>

          </div>
          <div className="actionBtn">
            {(moment(formData.end_date).isSame(
              moment(props?.data?.check_out)
            ) && moment(formData.start_date).isSame(
              moment(props?.data?.startdate_utc)
            )) && (
                <button
                  type="button"
                  className="AuthBtn"
                  style={{
                    color: "black",
                    backgroundColor: "#E9ECEF",
                    borderColor: "#E9ECEF",
                  }}
                  onClick={onSubmitFormData}
                  disabled={moment(formData.end_date).isSame(
                    moment(props?.data?.check_out)
                  )}
                >
                  {t("pages.AccountSettings.booking.extension.send")}
                </button>
              )}
            {!(moment(formData.end_date).isSame(
              moment(props?.data?.check_out)
            ) && moment(formData.start_date).isSame(
              moment(props?.data?.startdate_utc)
            )) && (
                <button
                  type="button"
                  className="AuthBtn"
                  onClick={onSubmitFormData}
                  disabled={moment(formData.end_date).isSame(
                    moment(props?.data?.check_out)
                  )}
                >
                  {t("pages.AccountSettings.booking.extension.send")}
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModificatoinRequest;
