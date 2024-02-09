const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class CommonService {
  file_upload = (files) => {
    return apiClient().post(`${endpoints.file_upload.FILE}`, files);
  };
  profile_upload = (files) => {
    return apiClient().post(`${endpoints.file_upload.PROFILE_IMAGE}`, files);
  };
  translate_language = () => {
    return apiClient().get(`${endpoints.COMMON.TRANSLATE}`);
  };
}

var commonService = new CommonService();

export default commonService;
