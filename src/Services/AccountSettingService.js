const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class AccountSettingService {
  get_user_by_sid = (user_sid) => {
    return apiClient().get(`${endpoints.ACCOUNT.GET_USER_BY_SID}/${user_sid}`);
  };

  update_user_by_sid = (user_sid, formData) => {
    return apiClient().put(
      `${endpoints.ACCOUNT.UPDATE_USER_ACCOUNT_BY_SID}/${user_sid}`,
      formData
    );
  };

  send_otp_code = (Data) => {
    return apiClient().get(`${endpoints.ACCOUNT.SEND_OTP_CODDE}/${Data}`);
  };
}

var accountSettingService = new AccountSettingService();

export default accountSettingService;
