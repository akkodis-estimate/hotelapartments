import { generatePassword } from "Helpers/commonMethodHelper";
import validationHelper from "Helpers/validationHelper";
import commonService from "Services/commonService";
import inquiryService from "Services/inquiryService";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { isPossiblePhoneNumber } from "react-phone-number-input";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import maskingActions from "reducers/masking/masking.actions";

const InquiryModal = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const defaultFormData = {
    company_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
    type: 1,
    status: 1,
    // password: "",
    is_password_updated: false,
    document_url: "",
    comments: "",
  };

  const defaultFormValidation = {
    company_name: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    address: "",
    // password: "",
    comments: "",
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);
  const [files, setFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  //  const [showPassword, setshowPassword] = useState(false);

  const runValidations = () => {
    const updatedValidations = {
      company_name: validationHelper.validateName(
        formData.company_name,
        "Company Name"
      ),
      first_name: validationHelper.validateName(
        formData.first_name,
        "First Name"
      ),
      last_name: validationHelper.validateName(formData.last_name, "Last Name"),
      phone_number: formData.phone_number
        ? isValidPhoneNumber(formData.phone_number)
          ? ""
          : "validation.invalid_input"
        : "validation.required",
      email: validationHelper.validateMailId(formData.email, "Email Address"),
      address: validationHelper.validateAddress(formData.address, "Address"),
      comments: validationHelper.validateOptionalDescriptionFor500Chars(
        formData.comments,
        "comments"
      ),
      // password: props.editCustomerId
      //   ? validationHelper.validateResetPassword(
      //     formData.password,
      //     formData.first_name,
      //     formData.last_name
      //   )
      //   : validationHelper.validatePasswordPolicy(
      //     formData.password,
      //     formData.first_name,
      //     formData.last_name
      //   ),
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
      case "company_name":
        errors[name] = validationHelper.validateName(value, "Company Name");
        break;
      case "first_name":
        errors[name] = validationHelper.validateName(value, "First Name");
        break;

      case "last_name":
        errors[name] = validationHelper.validateName(value, "Last Name");
        break;

      case "phone_number":
        errors[name] = validationHelper.validateMobileNo(value, "Phone Number");
        break;

      case "email":
        errors[name] = validationHelper.validateMailId(value, "Email Address");
        break;

      case "address":
        errors[name] = validationHelper.validateAddress(value, "Address");
        break;

      case "comments":
        errors[name] = validationHelper.validateOptionalDescriptionFor500Chars(
          value,
          "comments"
        );
        break;

      // case "password":
      //   errors[name] = props.editCustomerId
      //     ? validationHelper.validateResetPassword(
      //       value,
      //       formData.first_name,
      //       formData.last_name
      //     )
      //     : validationHelper.validatePasswordPolicy(
      //       value,
      //       formData.first_name,
      //       formData.last_name
      //     );
      //   break;

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

  const handleFileChange = (event) => {
    if (event.target.files[0].size / 1024 <= 10240) {
      var request = new FormData();
      for (let index = 0; index < event.target.files.length; index++) {
        request.append("files", event.target.files[index]);
      }
      commonService
        .file_upload(request)
        .then((res) => {
          
          setFormData((prevState) => {
            return {
              ...prevState,
              document_url: res.data[0],
            };
          });
          toast.success(t("toaster_message.file_uploaded_success"));
        })
        .catch(() => {
          toast.error(t("toaster_message.error"));
        });
    } else {
      toast.error("Please upload file less than 10 MB.");
      event.target.value = null;
    }
  };

  const handleFileDelete = () => {
    setFormData((prevState) => {
      return {
        ...prevState,
        document_url: "",
      };
    });
  };

  const onSubmitFormData = async (event) => {
    event.preventDefault();
    const errors = runValidations();
    const isRequiredFieldsAreValid =
      Object.keys(errors).filter((key) => errors[key]).length === 0;
    if (isRequiredFieldsAreValid) {
      dispatch(maskingActions.showMasking());
      var request = new FormData();

      request.append("company_name", formData.company_name);
      request.append("first_name", formData.first_name);
      request.append("last_name", formData.last_name);
      request.append("phone_number", formData.phone_number);
      request.append("email", formData.email);
      request.append("address", formData.address);
      request.append("type", formData.type);
      request.append("status", formData.status);
      // request.append("password", formData.password);
      request.append("is_password_updated", formData.is_password_updated);
      request.append("document_url", formData.document_url);
      request.append("comments", formData.comments);
      for (let index = 0; index < files.length; index++) {
        request.append("files", files[index]);
      }

      inquiryService
        .inquiry_create(request)
        .then((res) => {
          toast.success("Your Request Has Been Submitted.");
          if (!props.isfromMobile) {
            props?.setAddInquiry(false);
          }
          dispatch(maskingActions.hideMasking());
        })
        .catch((err) => {
          
          toast.error(err.response.data.message);
          //toast.error(t("toaster_message.error"));
          dispatch(maskingActions.hideMasking());
        });
    } else {
      setFormValidation(errors);
    }
  };

  const generateRandomPassword = () => {
    var password = generatePassword(12); // 12 = length of password
    setFormData((prevState) => {
      return {
        ...prevState,
        password: password,
      };
    });
    const customEvent = new Event("submit", { bubbles: true });
    Object.defineProperty(customEvent, "target", {
      value: { name: "password", value: password },
      writable: false,
    });
    onChangeFormData(customEvent);
  };

  const handleRemove = (removedfile) => {
    if (removedfile[0].hasUrl) {
      setRemovedFiles([...removedFiles, removedfile[0]]);
    }
  };

  return (
    <>
      <div className="modal-header border-0 p-0">
        <div className="pageTitle">
          <h2>{t("pages.corporate_customers.enquiry.title")}</h2>
        </div>
        {!props.isfromMobile && (
          <button
            type="button"
            className="btn-close"
            onClick={() => {
              props?.setAddInquiry(false);
            }}
          ></button>
        )}
      </div>
      <div className="modal-body p-0 pt-3 ha--InquiryModal">
        <form>
          <div className="row">
            <div className="col-lg-6 mb-3">
              <label className="form-label">
                {t("pages.corporate_customers.enquiry.company_name")}*
              </label>
              <input
                type="text"
                className="form-control"
                placeholder={t(
                  "pages.corporate_customers.enquiry.company_name"
                )}
                name="company_name"
                onChange={onChangeFormData}
                value={formData.company_name}
              />
              {formValidation.company_name && (
                <div className="invalid">{t(formValidation.company_name)}</div>
              )}
            </div>
            <div className="col-lg-6 mb-3">
              <label className="form-label">
                {t("pages.corporate_customers.enquiry.first_name")}*
              </label>
              <input
                type="text"
                name="first_name"
                className="form-control"
                placeholder={t("pages.add.lbl_firstname")}
                onChange={onChangeFormData}
                value={formData.first_name}
              />
              {formValidation.company_name && (
                <div className="invalid">{t(formValidation.company_name)}</div>
              )}
            </div>
            <div className="col-lg-6 mb-3">
              <label className="form-label">
                {t("pages.corporate_customers.enquiry.last_name")}*
              </label>
              <input
                type="text"
                name="last_name"
                className="form-control"
                placeholder={t("pages.add.lbl_lastname")}
                onChange={onChangeFormData}
                value={formData.last_name}
              />
              {formValidation.last_name && (
                <div className="invalid">{t(formValidation.last_name)}</div>
              )}
            </div>
            <div className="col-lg-6 mb-3">
              <label className="form-label">
                {t("pages.corporate_customers.enquiry.email")}*
              </label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder={t("pages.add.lbl_email")}
                onChange={onChangeFormData}
                value={formData.email}
              />
              {formValidation.email && (
                <div className="invalid">{t(formValidation.email)}</div>
              )}
            </div>
            <div className="col-lg-6 mb-3">
              <label className="form-label">
                {t("pages.corporate_customers.enquiry.phone_number")}*
              </label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                className="form-control frgtInput d-flex"
                placeholder={t("pages.add.lbl_phone_no")}
                value={formData.phone_number}
                name="phone_number"
                defaultCountry="AE"
                onChange={(e) => {
                  console.clear();
                  
                  const errors = {
                    ...formValidation,
                  };
                  
                  errors["phone_number"] = e
                    ? isPossiblePhoneNumber(e)
                      ? undefined
                      : "validation.invalid_input"
                    : "validation.required";
                  setFormValidation(errors);
                  setFormData((prevState) => {
                    return {
                      ...prevState,
                      phone_number: e,
                    };
                  });
                }}
              />
              {formValidation.phone_number && (
                <div className="invalid">{t(formValidation.phone_number)}</div>
              )}
            </div>
            <div className="col-lg-6 mb-3">
              <label className="form-label">
                {t("pages.corporate_customers.enquiry.address")} *
              </label>
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder={t("pages.add.lbl_address")}
                onChange={onChangeFormData}
                value={formData.address}
              />
              {formValidation.address && (
                <div className="invalid">{t(formValidation.address)}</div>
              )}
            </div>
            {/* <div className="col-lg-6 mt-3">
              <label className="label">
                {t("pages.login.password")}{" "}
                <span className="required">*</span>
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control border-end-0 rounded-end-0 passwordInput"
                  placeholder={t("pages.add.ph_password")}
                  onChange={onChangeFormData}
                  value={formData.password}
                />
                <PasswordEye
                  showPassword={showPassword}
                  setshowPassword={setshowPassword}
                />
              </div>

              {formValidation.password && (
                <div className="invalid">{t(formValidation.password)}</div>
              )}
            </div> 
            <div className="col-lg-6 mt-3 d-flex justify-content-end align-items-center">
              <label className="label "></label>
              <button
                className="gnrtPassword mt-3"
                type="button"
                onClick={generateRandomPassword}
              >
                <FiRotateCcw />
                <span className="ms-2">
                  {t("pages.add.lbl_generate_password")}
                </span>
              </button>
            </div>*/}
            {/* <div className="col-lg-12">
              <DocumentUpload
                isMultiple={true}
                isDocument={true}
                isShowSelectButton={false}
                isPreview={true}
                maxFilesCount={20}
                maxFileSize={100}
                files={files}
                setFiles={setFiles}
                filesPreview={filesPreview}
                setFilesPreview={setFilesPreview}
                handleRemove={(file) => handleRemove(file)}
                acceptType={{
                  "application/pdf": [],
                  "application/msword": [],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    [],
                }}
              />
            </div> */}

            <div className="col-lg-12">
              <label className="form-label">
                {t("pages.corporate_customers.enquiry.comments")}
              </label>
              <textarea
                type="text"
                rows={3}
                name="comments"
                className="form-control"
                placeholder={t("pages.corporate_customers.enquiry.comments")}
                onChange={onChangeFormData}
                value={formData.comments}
              />
              {formValidation.comments && (
                <div className="invalid">{t(formValidation.comments)}</div>
              )}
            </div>

            <div className="col-lg-12 mt-3">
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

export default InquiryModal;
