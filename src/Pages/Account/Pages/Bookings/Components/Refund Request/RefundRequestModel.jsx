import { NumberInput, Radio, TextInput } from "@mantine/core";
import validationHelper from "Helpers/validationHelper";
import reviewService from "Services/reviewService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import maskingActions from "reducers/masking/masking.actions";

const RefundRequestModel = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { userDetails } = useSelector((state) => state.customerAuth);

  const default_form_data = {
    booking_id: 0,
    property_name: "",
    customer_id: 0,
    customer_name: "",
    property_id: 0,
    beneficiary_name: "",
    beneficiary_address: "",
    phone_number: "",
    email: "",
    bank_name: "",
    bank_country: "",
    bank_address: "",
    bank_branch_name: "",
    account_number: "",
    iban: "",
    swift_sort_code: "",
    banks_route: "",
    currency_id: 0,
    refund_for: "request for security deposit",
    createdby_user_id: userDetails ? userDetails.customer_id : null,
  };

  const default_form_validation = {
    beneficiary_name: "",
    beneficiary_address: "",
    phone_number: "",
    email: "",
    bank_name: "",
    bank_country: "",
    bank_address: "",
    bank_branch_name: "",
    account_number: "",
    iban: "",
    swift_sort_code: "",
    banks_route: "",
    currency_id: "",
  };

  const [formData, setFormData] = useState(default_form_data);
  const [formValidation, setFormValidation] = useState(default_form_validation);
  const [terms, setTerms] = useState(false);

  const [currencyDropdown, setCurrencyDropdown] = useState([]);

  useEffect(() => {
    const user_list = setTimeout(() => {
      if (props?.data) {
        dispatch(maskingActions.showMasking());
        setDropdown()
          .then(() => {
            getRefundBySID(props.data.booking_sid);
          })
          .finally(() => { });
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
      beneficiary_name: validationHelper.validateSameNames(
        formData.beneficiary_name,
        formData.customer_name
      ),
      beneficiary_address: validationHelper.validateAddress(
        formData.beneficiary_address,
        "Beneficiary Address"
      ),
      phone_number: validationHelper.validateMobileNo(
        formData.phone_number,
        "Phone Number"
      ),
      email: validationHelper.validateMailId(formData.email, "Email"),
      bank_name: validationHelper.validateName(
        formData.bank_name,
        "Branch Name"
      ),
      bank_country: validationHelper.validateName(
        formData.bank_country,
        "Branch Country"
      ),
      bank_address: validationHelper.validateAddress(
        formData.bank_address,
        "Branch Address"
      ),
      bank_branch_name: validationHelper.validateName(
        formData.bank_branch_name,
        "Branch Name"
      ),
      account_number: validationHelper.validateBankAccountNumber(
        formData.account_number,
        "Account Number"
      ),
      iban: validationHelper.validateIBAN(formData.iban, "IBAN"),
      swift_sort_code: validationHelper.validateBankCode(
        formData.swift_sort_code,
        "Swift/Sort Code"
      ),
      banks_route: validationHelper.validateBankRoute(
        formData.banks_route,
        "Bank's Route"
      ),
      // currency_id: validationHelper.validateDropdown(
      //   formData.currency_id,
      //   "Currency"
      // ),
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
      case "beneficiary_name":
        errors[name] = validationHelper.validateSameNames(
          value,
          formData.customer_name
        );
        break;
      case "beneficiary_address":
        errors[name] = validationHelper.validateAddress(value, name);
        break;
      case "email":
        errors[name] = validationHelper.validateMailId(value, name);
        break;
      case "bank_name":
        errors[name] = validationHelper.validateName(value, name);
        break;
      case "bank_country":
        errors[name] = validationHelper.validateName(value, name);
        break;
      case "bank_address":
        errors[name] = validationHelper.validateAddress(value, name);
        break;
      case "bank_branch_name":
        errors[name] = validationHelper.validateName(value, name);
        break;
      case "iban":
        errors[name] = validationHelper.validateIBAN(value, name);
        break;
      case "swift_sort_code":
        errors[name] = validationHelper.validateBankCode(value, name);
        break;
      case "banks_route":
        errors[name] = validationHelper.validateBankRoute(value, name);
        break;
      // case "currency_id":
      //   errors[name] = validationHelper.validateDropdown(value, name);
      //   break;
      case "account_number":
        errors[name] = validationHelper.validateBankAccountNumber(value, name);
        break;
      default:
        
    }
    setFormValidation(errors);
    setFormData((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const onChangeNumberInput = (name, value) => {
    const errors = {
      ...formValidation,
    };

    switch (name) {
      case "phone_number":
        errors[name] = value
          ? isValidPhoneNumber(value)
            ? undefined
            : "validation.invalid_input"
          : "validation.required";
        break;
      case "account_number":
        errors[name] = validationHelper.validateBankAccountNumber(value, name);
        break;
      default:
        
    }
    setFormValidation(errors);
    setFormData((previousState) => {
      return {
        ...previousState,
        [name]: value,
      };
    });
  };

  const onChangeDropdownInput = (name, value) => {
    const errors = {
      ...formValidation,
    };

    switch (name) {
      case "currency_id":
        errors[name] = validationHelper.validateDropdown(
          value !== 0 ? value : "",
          name
        );
        break;
      default:
        
    }
    setFormValidation(errors);
    setFormData((previousState) => {
      return {
        ...previousState,
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
      console.clear();
      
      if (formData.booking_id !== null && formData.booking_id !== undefined) {
        dispatch(maskingActions.showMasking());
        reviewService
          .refund_create(formData)
          .then((res) => {
            toast.success("Refund Added");
            props.setRefundRequestModel();
          })
          .catch((err) => {
            
            toast.error(t("toaster_message.error"));
          })
          .finally(() => {
            dispatch(maskingActions.hideMasking());
          });
      }
    } else {
      setFormValidation(errors);
    }
  };

  const setDropdown = async () => {
  };

  

  return (
    <>
      <div className="modal-header border-0 p-0">
        <h2>{t("pages.AccountSettings.booking.refund_form.title")}</h2>
        <button
          type="button"
          className="btn-close"
          onClick={() => {
            props.setRefundRequestModel();
          }}
        ></button>
      </div>
      <div className="modal-body p-0 mt-3">
        <div className="row successModal d-flex flex-column w-100">
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.extension.book_number")}</label>
            <NumberInput
              type="number"
              name="booking_id"
              disabled
              value={formData.booking_id}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.extension.property_name")}</label>
            <TextInput
              type="text"
              name="property_name"
              disabled={true}
              value={formData.property_name}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.extension.guest_name")}</label>
            <TextInput
              type="text"
              name="customer_name"
              disabled={true}
              value={formData.customer_name}
            />
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.extension.security_amount")}</label>
            <TextInput
              type="text"
              name="security_amount"
              disabled={true}
              value={formData.base_booking_currency + " " + formData.show_booking_security_amount}
            />
          </div>
          <hr />
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              {t("pages.AccountSettings.booking.refund_form.accname")}:*
            </label>
            <TextInput
              type="text"
              name="beneficiary_name"
              value={formData.beneficiary_name}
              onChange={onChangeFormData}
            />
            {formValidation.beneficiary_name && (
              <div className="invalid">
                {t(formValidation.beneficiary_name)}
              </div>
            )}
            <span className="small">{t("pages.AccountSettings.booking.refund_form.validate_accname")}</span>
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.refund_form.beneficiary")}:*</label>
            <TextInput
              type="text"
              name="beneficiary_address"
              value={formData.beneficiary_address}
              onChange={onChangeFormData}
            />
            {formValidation.beneficiary_address && (
              <div className="invalid">
                {t(formValidation.beneficiary_address)}
              </div>
            )}
            <span className="small">
              {t("pages.AccountSettings.booking.refund_form.acc_address")}
            </span>
          </div>
          <div className="col-lg-12 mb-3 p-0">
            <div className="row">
              <div className="col-lg-6 mb-3">
                <label className="form-label">{t("pages.AccountSettings.personal_info.phone_number")}</label>
                {/* <TextInput
                  type="number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={onChangeFormData}
                /> */}
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  className="form-control frgtInput d-flex refundPhoneInput"
                  placeholder={t("pages.add.ph_phone")}
                  value={formData.phone_number}
                  name="phone_number"
                  defaultCountry="AE"
                  onChange={(value) => {
                    onChangeNumberInput("phone_number", value);
                  }}
                />
                {formValidation.phone_number && (
                  <div className="invalid">
                    {t(formValidation.phone_number)}
                  </div>
                )}
              </div>
              <div className="col-lg-6 mb-3">
                <label className="form-label">{t("pages.AccountSettings.personal_info.email")}</label>
                <TextInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChangeFormData}
                />
                {formValidation.email && (
                  <div className="invalid">{t(formValidation.email)}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.refund_form.full_bankname")}:*</label>
            <TextInput
              type="text"
              name="bank_name"
              value={formData.bank_name}
              onChange={onChangeFormData}
            />
            {formValidation.bank_name && (
              <div className="invalid">{t(formValidation.bank_name)}</div>
            )}
          </div>

          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.refund_form.bank_country")}:*</label>
            <TextInput
              type="text"
              name="bank_country"
              value={formData.bank_country}
              onChange={onChangeFormData}
            />
            {formValidation.bank_country && (
              <div className="invalid">{t(formValidation.bank_country)}</div>
            )}
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.refund_form.bank_address")}:*</label>
            <TextInput
              type="text"
              name="bank_address"
              value={formData.bank_address}
              onChange={onChangeFormData}
            />
            {formValidation.bank_address && (
              <div className="invalid">{t(formValidation.bank_address)}</div>
            )}
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.refund_form.bank_branch")}:*</label>
            <TextInput
              type="text"
              name="bank_branch_name"
              value={formData.bank_branch_name}
              onChange={onChangeFormData}
            />
            {formValidation.bank_branch_name && (
              <div className="invalid">
                {t(formValidation.bank_branch_name)}
              </div>
            )}
          </div>
          <div className="col-lg-12 mb-3 p-0">
            <div className="row">
              <div className="col-lg-6 mb-3">
                <label className="form-label">{t("pages.AccountSettings.booking.refund_form.acc_Number")}:*</label>
                <TextInput
                  type="number"
                  name="account_number"
                  value={formData.account_number}
                  onChange={onChangeFormData}
                />
                {formValidation.account_number && (
                  <div className="invalid">
                    {t(formValidation.account_number)}
                  </div>
                )}
              </div>
              <div className="col-lg-6 mb-3">
                <label className="form-label">IBAN*</label>
                <TextInput
                  type="text"
                  name="iban"
                  value={formData.iban}
                  onChange={onChangeFormData}
                />
                {formValidation.iban && (
                  <div className="invalid">{t(formValidation.iban)}</div>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">{t("pages.AccountSettings.booking.refund_form.sscode")}:*</label>
            <TextInput
              type="text"
              name="swift_sort_code"
              value={formData.swift_sort_code}
              onChange={onChangeFormData}
            />
            {formValidation.swift_sort_code && (
              <div className="invalid">{t(formValidation.swift_sort_code)}</div>
            )}
          </div>
          <div className="col-lg-12 mb-3">
            <label className="form-label">
              Bank's Route/ABA/FedWire/IFSC/BSB Code:
            </label>
            <TextInput
              type="text"
              name="banks_route"
              value={formData.banks_route}
              onChange={onChangeFormData}
            />
            {formValidation.banks_route && (
              <div className="invalid">{t(formValidation.banks_route)}</div>
            )}
            <span className="small">
              (Required for USA (ABA/FedWire); India (IFSC Code); Australia &
              New Zealand (BSB Code))
            </span>
          </div>
         
          <p
            className="mt-5 small"
            onClick={() => {
              console.clear();
              
            }}
          >
            {t("pages.AccountSettings.booking.refund_form.refund_text")}
          </p>
          <p className="mt-5 small">
            {t("pages.AccountSettings.booking.refund_form.refund_time")}
          </p>
          <h4 className="mt-5"> {t("pages.AccountSettings.booking.refund_form.t&c")}*</h4>
          <div className="d-flex">
            <Radio
              className="mt-2"
              size="xs"
              checked={terms}
              onChange={(event) => setTerms(event.currentTarget.checked)}
            />
            <label
              className="m-2 small"
              onClick={(e) => {
                setTerms(e.target.value === "false" ? false : true);
              }}
            >
              <b>{t("pages.AccountSettings.booking.refund_form.t&ctext")}</b>
            </label>
          </div>
          <button
            className="mt-4 btn btn-success"
            disabled={!terms}
            onClick={onSubmitFormData}
          >
            {t("pages.AccountSettings.booking.refund_form.submit")}
          </button>
        </div>
      </div>
    </>
  );
};

export default RefundRequestModel;
