const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class ChangePasswordService {
  change_password_by_sid = (UserData) => {
    return apiClient().put(
      `${endpoints.PASSWORD.CHANGE_CODE}/${UserData.sid}`,
      UserData
    );
  };

  update_user_by_sid = (user_sid, formData) => {
    return apiClient().put(
      `${endpoints.ACCOUNT.UPDATE_USER_ACCOUNT_BY_SID}/${user_sid}`,
      formData
    );
  };

 
}

var changePasswordService = new ChangePasswordService();

export default changePasswordService;
