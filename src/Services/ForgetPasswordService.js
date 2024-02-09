const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class ForgetPasswordService {
  forget_password_by_email = (UserData) => {
    return apiClient().put(
      `${endpoints.FORGET_PASSWORD.FORGET_CODE}/${UserData.email}`,
      UserData
    );
  };

  update_user_by_sid = (user_sid, formData) => {
    return apiClient().put(
      `${endpoints.ACCOUNT.UPDATE_USER_ACCOUNT_BY_SID}/${user_sid}`,
      formData
    );
  };

  forget_password_by_mobile = (number) => {
    return apiClient().post(
      `${endpoints.FORGET_PASSWORD.PHONE_FORGET_CODE}`,
      number
    );
  };
}

var forgetPasswordService = new ForgetPasswordService();

export default forgetPasswordService;
