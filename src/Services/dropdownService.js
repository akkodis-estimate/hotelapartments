const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");
const { SetDynamicEndpoint } = require("Helpers/commonMethodHelper");

class DropdownService {
  get_country_city_dropdown = () => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.dropdowns.GET_CITY_COUNTRY_DROPDOWN)}`
    );
  };

  get_apartment_amenities_dropdown = () => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.dropdowns.GET_APARTMENT_AMENITIES)}`
    );
  };

  get_property_amenities_dropdown = () => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.dropdowns.GET_PROPERTY_AMENITIES)}`
    );
  };

  get_country_dropdown = () => {
    return apiClient().get(`${endpoints.dropdowns.GET_COUNTRY_DROPDOWN}`);
  };

  get_city_dropdown = (sid) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.dropdowns.GET_CITY_DROPDOWN, [sid])}`
    );
  };

  get_area_dropdown = (sid) => {
    return apiClient().get(
      `${SetDynamicEndpoint(endpoints.dropdowns.GET_AREA_DROPDOWN, [sid])}`
    );
  };

  get_enum_dropdown = () => {
    return apiClient().get(`${endpoints.dropdowns.GET_ENUMS_DROPDOWN}`);
  };

  get_countries_and_currency_list = () => {
    return apiClient().get(`${endpoints.dropdowns.GET_COUNTRIES_AND_CURRENCY}`);
  };

  get_home_search = () => {
    return apiClient().get(`${endpoints.home.HOME_SEARCH}`);
  };
  get_luxury_cities_dropdown = () => {
    return apiClient().get(
      `${endpoints.dropdowns.GET_GET_LUXURY_CITIES_DROPDOWN}`
    );
  };

  get_vila_cities_dropdown = () => {
    return apiClient().get(
      `${endpoints.dropdowns.GET_GET_VILA_CITIES_DROPDOWN}`
    );
  };

  get_all_city_dropdown = () => {
    return apiClient().get(`${endpoints.dropdowns.GET_ALL_CITY}`);
  };

  get_prop_apt_dropdown = (sid) => {
    return apiClient().get(`${SetDynamicEndpoint(endpoints.dropdowns.GET_PROPERTY_APT_BY_AREA, [sid])}`);
  };

  get_currency_dropdown = (sid) => {
    return apiClient().get(`${SetDynamicEndpoint(endpoints.dropdowns.GET_CURRENCY_DROPDOWN)}`);
  };

  get_master_country_dropdown = () => {
    return apiClient().get(`${endpoints.dropdowns.GET_MASTER_COUNTRY_DROPDOWN}`);
  };

}

var dropdownService = new DropdownService();

export default dropdownService;
