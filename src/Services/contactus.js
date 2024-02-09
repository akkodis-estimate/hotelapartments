const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class ContactusService {
  add_inquiry = (request_model) => {
    return apiClient().post(
      `${endpoints.WEBSITE_INQUIRY.CONTACT_US}`,
      request_model
    );
  };
}

var contactusService = new ContactusService();

export default contactusService;
