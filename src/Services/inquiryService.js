const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");
const { SetDynamicEndpoint } = require("Helpers/commonMethodHelper");

class InquiryService {
  get_apartment_dropdown = (filters) => {
    
    var listParams = {
      filter: JSON.stringify(filters) 
    };
    return apiClient().get(
      `${endpoints.inquiry.APARTMENTS}`,{
        params: { ...listParams },
      }
    );
  };
  inquiry_create = (inquiry_request_body) => {
    return apiClient().post(
      `${endpoints.inquiry.CREATE_INQUIRY}`,
      inquiry_request_body
    );
  };
}

var inquiryService = new InquiryService();

export default inquiryService;
