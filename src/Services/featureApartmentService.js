const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");
const { SetDynamicEndpoint } = require("Helpers/commonMethodHelper");

class FeatureApartmentService {
    feature_apartment_list = (listParams) => {
      return apiClient().get(`${SetDynamicEndpoint(endpoints.FeatureApartment.LIST_FEATURE_APARTMNET)}`, { params: { ...listParams } });
    };
  }
  
  var featureApartmentService = new FeatureApartmentService();
  
  export default featureApartmentService;