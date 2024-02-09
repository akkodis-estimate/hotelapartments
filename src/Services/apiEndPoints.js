var endpoints = {
  file_upload: {
    PROFILE_IMAGE: "v1/backOffice/files/uploadProfileImage",
    FILE: "v1/backOffice/files/uploadProfileImage",
  },
  authentication: {
    LOGIN: "v1/website/authcustomer/login",
    SIGN_UP: "v1/website/authcustomer",
    VERIFY_OTP: "v1/website/authcustomer/verifycode",
    GOOGLE_LOGIN: "v1/website/authcustomer/google",
    FACEBOOK_LOGIN: "v1/website/authcustomer/facebook",
    VERIFY_CUSTOMER_TOKEN: "v1/backOffice/individual-customers/check-token",
    RESET_CUSTOMER_CODE: "v1/backOffice/individual-customers/reset-password",
    RESEND_CODE: "v1/website/authcustomer/resendcode",
  },
  home: {
    LIST_FEATURED_APARTMENTS: "v1/website/property/apartments",
    LIST_SPECIAL_OFFERS: "v1/website/property/specialoffers",
    LIST_SERVICED_VILLAS: "v1/website/property/servicedvillas",
    LIST_LUXURY_VILLAS: "v1/website/property/luxuryvillas",
    LIST_CITIES: "v1/website/property/cities",
    HOME_SEARCH: "v1/website/dropdowns/home_search",
  },
  dropdowns: {
    GET_CITY_COUNTRY_DROPDOWN: "v1/website/dropdowns/countrycities",
    GET_APARTMENT_AMENITIES: "v1/website/dropdowns/apartment_amenities",
    GET_PROPERTY_AMENITIES: "v1/website/dropdowns/property_amenities",
    GET_COUNTRY_DROPDOWN: "v1/website/dropdowns/countries",
    GET_CITY_DROPDOWN: "v1/website/dropdowns/countries/{0}/cities",
    GET_AREA_DROPDOWN: "v1/website/dropdowns/cities/{0}/areas",
    GET_ENUMS_DROPDOWN: "v1/website/dropdowns/enums",
    GET_COUNTRIES_AND_CURRENCY: "/v1/backOffice/countries/currencies",
    GET_GET_LUXURY_CITIES_DROPDOWN: "v1/website/dropdowns/luxury_cities",
    GET_GET_VILA_CITIES_DROPDOWN: "v1/website/dropdowns/villa_cities",
    GET_ALL_CITY: "v1/website/dropdowns/cities",
    GET_PROPERTY_APT_BY_AREA: "v1/website/dropdowns/property_apartment/{0}",
    GET_CURRENCY_DROPDOWN: "v1/website/dropdowns/currencies",
    GET_MASTER_COUNTRY_DROPDOWN: "v1/website/dropdowns/mastercountries",
  },

  FeatureApartment: {
    LIST_FEATURE_APARTMNET: "v1/website/property/apartments",
  },

  PROPERTIES: {
    FEATURED_PPROPERTIES: "v1/website/apartments",
    PROPERTIES_DETAIL: "v1/website/apartments/{0}",
    UPDATE_GUEST_DETAILS:
      "v1/website/bookings/{0}/update_booking_cart_guest_name",
  },

  booking_review: {
    LIST: "v1/website/booking/list",
    CREATE_REVIEW: "v1/website/booking/addreview",
    CREATE_REFUND: "v1/website/refund",
    GET_REFUND: "v1/website/refund/booking",
    GET_CURRENCY_DROPDOWN: "v1/backOffice/countries/currencies",
    REFUND_LIST: "v1/website/refund/list",
    GET_REFUND_UPDATE: "v1/website/refund/{0}",
  },
  ACCOUNT: {
    GET_USER_BY_SID: "v1/website/accountsettings/info",
    UPDATE_USER_ACCOUNT_BY_SID: "v1/website/accountsettings/info",
    SEND_OTP_CODDE: "v1/website/accountsettings/info/generate",
    VERIFY_OTP: "v1/website/accountsettings/info/otp/verify",
  },
  PASSWORD: {
    CHANGE_CODE: "v1/website/accountsettings/password",
  },
  FORGET_PASSWORD: {
    PHONE_FORGET_CODE: "/v1/website/authcustomer/forgot-password",
    FORGET_CODE: "v1/website/accountsettings/password",
    CREATE_REFUND: "v1/website/refund",
    GET_REFUND: "v1/website/refund",
    GET_CURRENCY_DROPDOWN: "v1/backOffice/countries/currencies",
    FORGET_CODE_VERIFY: "v1/website/authcustomer/forgot-password/verify",
    FORGET_CHANGE_CODE:
      "v1/website/authcustomer/forgot-password/changepassword",
  },
  inquiry: {
    CREATE_INQUIRY: "v1/website/enquiry",
    APARTMENTS: "v1/website/enquiry",
  },

  BOOKING: {
    GET_BOOKING_PRICE: "v1/website/bookings/{0}/calculate_apartment_price",
    GET_BOOKING_DETAILS: "v1/website/bookings/{0}/booking_data",
    CREATE_BOOKING: "v1/website/bookings/create_booking",
    ADD_TO_BOOKING_CART: "v1/website/bookings/booking_cart",
    CONFIRM_BOOKING_CART_ITEM: "v1/website/bookings/multiple_booking_cart",
    BOOKING_CART_LIST: "v1/website/bookings/get_booking_cart",
    REMOVE_CART_ITEM: "v1/website/bookings/{0}/update_booking_cart_status",
    GET_BOOKING_DETAIL_BY_CUSTOMER_ID:
      "v1/website/bookings/get_booking_cart_customer_id",
    CREATE_BOOKING_MODIFICATON: "v1/website/bookings/{0}/modificationrequest",
    PAYMENT_BOOKING_LIST: "v1/website/bookings/{0}/payment",
    UPDATE_BILLING_ADDRESS: "v1/website/webpayment/updateCustomer",
  },

  REPAYMENT: {
    REPAYMENT_DATA: "v1/website/bookings/{0}/make_payment",
  },

  BLOG: {
    ALL_BLOG_LIST: "v1/website/blogs",
    GET_BLOG_BY_SID: "v1/website/blogs/blogdetail",
  },
  WEBSITE_INQUIRY: {
    CONTACT_US: "v1/website/contactus",
  },

  CREDIT_HISTORY: {
    LIST_CREDIT_HISTORY:
      "v1/website/corporate-customers/{0}/customertransactionhistory",
  },
  CREDIT_LIMIT: {
    ADD_CREDIT_LIMIT: "/v1/website/corporate-customers/{0}/credit_limit",
  },
  COMMON: {
    TRANSLATE: "v1/backoffice/translatescript",
  },
  PAYMENT: {
    REQUEST_PAYMENT: "v1/website/webpayment",
  },
  INBOX: {
    GET_INBOX_MESSAGE: "v1/website/messages/customertoadmin",
    POST_INBOX_MESSAGE: "v1/website/messages/customertoadmin",
    POST_INBOX_MESSAGE_READ: "v1/website/messages/customertoadmin/{0}/read",
    POST_INBOX_MESSAGE_READ_COUNT: "v1/website/messages/unreadcount",
    GET_MESSAGES_BY_ID: "v1/backOffice/messages/admintocustomer/{0}",
  },
  LOYALTY_POINTS_HISTORY: {
    LIST_LOYALTY_POINTS_HISTORY: "v1/website/loyalty-points/{0}",
  },
};

export default endpoints;
