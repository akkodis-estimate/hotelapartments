
import { useTranslation } from "react-i18next";
import { useState } from "react";
import PasswordEye from "Components/Shared/PasswordEye/PasswordEye";
import validationHelper from "Helpers/validationHelper";
import changePasswordService from "Services/ChangePasswordService";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import SuccessModalPopup from "Components/Shared/Modal Popup/SuccessModalPopup";

const ChangePassword = () => {

  const defaultFormValidation = {
    confirm_password: "",
    new_password: ""
  };

  const defaultFormData = {
    confirm_password: "",
    new_password: ""
  };

  const [successModal, setSuccessModal] = useState(false);
  const [changePasswordPopup, setChangePasswordPopup] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);
  const [formValidation, setFormValidation] = useState(defaultFormValidation);
  const { t } = useTranslation();
  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [resetUserData, setResetUserData] = useState();
  const [disablePasswordButton, setdisablePasswordButton] = useState(true); // this for save one item Data and show it to mobile view only.


  const storedData = localStorage.getItem('userDetails');
  const parsedData = JSON.parse(storedData);

  //validations
  const runValidations = () => {

    const updatedValidations = {

      // new_password: validationHelper.validatePasswordPolicy(formData.new_password, parsedData.first_name, parsedData.last_name),
      // confirm_password: validationHelper.validateCPassword(formData.confirm_password, formData.new_password),

      new_password: validationHelper.validatePasswordPolicy(formData.new_password, parsedData.first_name, parsedData.last_name),
      confirm_password: validationHelper.validateCPassword(formData.confirm_password, formData.new_password),
    };

    return updatedValidations;
  };

  const handleTextChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    const errors = {
      ...formValidation,
    };
    setdisablePasswordButton(false);
    switch (name) {

      case "new_password":
        errors[name] = validationHelper.validatePasswordPolicy(value, parsedData.first_name, parsedData.last_name);
        if (formData.confirm_password) {
          // debugger
          errors["confirm_password"] = validationHelper.validateCPassword(formData.confirm_password, value); 
        }
        break;


      case "confirm_password": //new_password
        errors[name] = validationHelper.validateCPassword(value, formData.new_password);
        break;

      default:
        console.error(`Found unknown field - ${name}`);
    }

    setFormValidation(errors);
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {

    e.preventDefault();

    const errors = runValidations();
    const isRequiredFieldsAreValid = Object.keys(errors).filter((key) => errors[key]).length === 0;

    if (isRequiredFieldsAreValid) {

      let data = {
        sid: parsedData.customer_sid,
        new_password: formData.new_password,
      };
      setFormValidation(errors);

      changePasswordService
        .change_password_by_sid(data)
        .then((res) => {
          setdisablePasswordButton(true)
          setResetUserData(null);
          setChangePasswordPopup(true);
          setFormData(defaultFormData);

        })
        .finally(() => {

        });


    } else {
      setFormValidation(errors);
    }
  }
  return (
    <>
      
        <div className="ha--PIForm">
          <div className="signInContent PIContent w-100">
            <form>
              <div className="ha--PiTitle ha--ChangePassUITitle">
                <h3> {t("pages.AccountSettings.change_password.title")}</h3>
              </div>
              <div className="authForm ha--ChangePassUI">

                <div >
                  <label className="form-label"> {t("pages.AccountSettings.change_password.new_password")}</label>
                  <div className="w-100 position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="new_password"
                      value={formData.new_password}
                      className="form-control"
                      placeholder={t("pages.AccountSettings.change_password.new_password")}
                      onChange={handleTextChange}
                    />
                    {formValidation.new_password && (
                      <div className="invalid">{t(formValidation.new_password)}</div>
                    )}
                    <PasswordEye
                      paddingStyle={"9px 9px"}
                      showPassword={showPassword}
                      setshowPassword={setshowPassword}
                    />
                  </div>
                </div>

                <div >
                  <label className="form-label">{t("pages.AccountSettings.change_password.confirm_password")}</label>
                  <div className="w-100 position-relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirm_password"
                      value={formData.confirm_password}
                      className="form-control"
                      placeholder={t("pages.AccountSettings.change_password.confirm_password")}
                      onChange={handleTextChange}
                    />
                    {formValidation.confirm_password && (
                      <div className="invalid">{t(formValidation.confirm_password)}</div>
                    )}
                    <PasswordEye
                      paddingStyle={"9px 9px"}
                      showPassword={showConfirmPassword}
                      setshowPassword={setshowConfirmPassword}
                    />
                  </div>
                </div>
              </div>
              <div className="actionBtn">
                <button type="button"  
                className={`AuthBtn ${
                        disablePasswordButton
                          ? "disable"
                          : ""
                      }`} 
                      onClick={handleFormSubmit}   
                      disabled={
                         disablePasswordButton
                      }>
                  {t("pages.AccountSettings.personal_info.update_btn")}
                </button>
              </div>
            </form>
          </div>
        </div>
      
      <ModalPopup
        show={successModal}
        dialogClassName="applicationModal ha--successModal"
      >
        <SuccessModalPopup setSuccessModal={setSuccessModal} Title={'Success'} Message={'Account details has been updated'} ShowButton={false} />
      </ModalPopup>


      <ModalPopup
        show={changePasswordPopup}
        dialogClassName="applicationModal ha--successModal"
      >
        <SuccessModalPopup setSuccessModal={setChangePasswordPopup} ShowButton={true} Title={'Success'} Message={'Your new password has successfully been saved!'} />
      </ModalPopup>



    </>
  );
};

export default ChangePassword;
