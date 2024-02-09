const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class HomeScreenService {
  get_featured_apartments = (listParams) => {
    return apiClient().get(`${endpoints.home.LIST_FEATURED_APARTMENTS}`, {
        params: { ...listParams },
      });
  };

  get_special_offers = (listParams) => {
    return apiClient().get(`${endpoints.home.LIST_SPECIAL_OFFERS}`, {
        params: { ...listParams },
      });
  };

  get_serviced_villas = (listParams) => {
    return apiClient().get(`${endpoints.home.LIST_SERVICED_VILLAS}`, {
        params: { ...listParams },
      });
  };

  get_luxury_villas = (listParams) => {
    return apiClient().get(`${endpoints.home.LIST_LUXURY_VILLAS}`, {
        params: { ...listParams },
      });
  };

  get_cities = (listParams) => {
    return apiClient().get(`${endpoints.home.LIST_CITIES}`, {
        params: { ...listParams },
      });
  };

  get_special_offers_v2 = (listParams) => {
    return apiClient().get(`${endpoints.home.LIST_FEATURED_APARTMENTS}`, {
        params: { ...listParams },
      });
  };

}

var homeScreenService = new HomeScreenService();

export default homeScreenService;
