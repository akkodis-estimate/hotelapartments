export const RoutePaths = {
  AUTHORISATION: {
    SIGN_IN: "/sign-in",
    SIGN_UP: "/sign-up",
    OTP_VERIFY: "/otp-verify",
    FORGOT_PASSWORD: "/forgot-password",
    SET_NEW_PASSWORD: "/reset-customer-password",
    THANK_YOU: "/thank-you",
    SUCCESS: "/success",
  },

  ACCOUNT: {
    ACCOUNT: "/account",
    ACCOUNT_SETTINGS: "/account/account-settings",
    ACCOUNT_BOOKINGS: "/account/bookings",
    ACCOUNT_REFUND: "/account/refund-request",
    OTP_VERIFY: "/account/verifyotp",
    CREDIT_HISTORY: "/account/credit-history",
    LOYALTY_POINTS_HISTORY: "/account/loyalty-points",
    INBOX: "/account/inbox",
    MOBILE_INBOX_LIST: "/account/inbox-list",
    MOBILE_INBOX_CHAT: "/account/inbox-chat/{0}",
    MOBILE_RESERVATION_DETAILS : "/account/inbox/reservation-details/{0}"
  },

  CORPORATE_CUSTOMERS: {
    CORPORATE_CUSTOMERS: "/corporate-customers",
    ADD_INQUIRY: "/add-inquiry",
  },

  OTP_VERIFY: {
    OTP_VERIFY: "/verifyotp",
    SEND_OTP: "",
  },

  ALL_AREAS: {
    ALL_AREAS: "/all-cities",
  },

  PROPERTIES: {
    FEATURED_PPROPERTIES: "/furnished-serviced-rentals",      //VIEW ALL
    FEATURED_PPROPERTIES_DYNAMIC: "/furnished-serviced-rentals/*",    //VIEW ALL
    FEATURED_PPROPERTIES_ENTITY: "/{0}",              //Dynamanic apartments-dubai-uae
    FEATURED_PPROPERTIES_ENTITY_DYNAMIC: "/{0}/*",    //Dynamanic apartments-dubai-uae/....**
    PROPERTIES_DETAIL: "/apartment-details/{0}",
    PREVIEW_PROPERTIES_DETAIL: "/apartment/{0}/preview"
  },

  BOOKING: {
    BOOKING: "/apartment/{0}/booking",
    PAYMENT: "/apartment/{0}/payment",
    MULTIBOOKING: "/apartment/{0}/multibooking",
    MULTIBOOKING_PAYMENT: "/apartment/{0}/multibookingpayment",
    BOOKING_LIST : "/bookings-cart-list"
  },

  REPAYMENT: {
    REPAYMENT: "/booking/{0}/repayment"
  },

  BLOG: {
    BLOG: "/blog",
    BLOG_Detail: "/blog/blog-detail/{0}",
  },

  LUXURY_APARTMENTS: {
    LUXURY_APARTMENTS: "/luxury-apartments",
    LUXURY_APARTMENTS_TWO: "/service-villa"
  },

  // FEATURED_PPROPERTIES: {
  //   FEATURED_PPROPERTIES: "/apartments"
  // },

  CONTACT_US: {
    CONTACT_US: "/contact-us"
  },

  SIDE_MENU: {
    LUXURY_APARTMENTS: "/luxury-apartments",
    LUXURY_APARTMENTS_TWO: "/service-villa"
  },

  PAYMENT_SUCCESS: {
    PAYMENT_SUCCESS: "/payment-success"
  },

  PAYMENT_FAILURE: {
    PAYMENT_FAILURE: "/payment-failure"
  },

  FOR_HOTELS: {
    FOR_HOTELS: "/for-hotels"
  },

  EXPERIENCE: {
    EXPERIENCE: "/experience"
  },

  POLICY: {
    REFUND_POLICY: "/refund-policy",
    PRIVACY_POLICY: "/privacy-policy",
    TERMS_AND_CONDITIONS: "/terms-and-conditions",
    RESERVATION_TERMS: "/reservation-terms"
  },

  ABOUT_US: {
    ABOUT_US: "/about-us"
  },

};

export const STATUS = {
  REQUESTED: 46,
  DELETE: 3,
  ACCEPTED: 47,
  COMMISSION_PENDING: 42,
  COMMISSION_COMPLETED: 43,
  ACTIVE: 1,
  INCONTACT: 48,
  FOLLOWUP: 49,
  VIEWING_COMPLETED: 50,
  RESERVATION_DONE: 116,
  CLOSED_LIST: 51,
  REFUND_REQUESTED: 38,
  REFUND_ACCEPTED: 39,
  REFUND_REJECTED: 40,
  REFUND_COMPLETED: 41,
  REJECTED: 54,
  PAYMENT_PENDING: 44,
  PAYMENT_COMPLETED: 45,
  WAITING_FOR_APPROVAL: 72,
  DELISTED: 73,
  EXPIRED: 74,
  DECLINE: 78,
  CHECKED_OUT: 79,
  INHOUSE: 80,
  BOOKING_PAYMENT_PENDING: 114
};

export const DATE_FORMATS = {
  DMY: "DD/MM/yyyy",
  YMD: "YYYY-MM-DD",
  MDY: "MMM DD, YYYY",
  DDMMMYYYY: "DD MMM YYYY",
  CUSTOMDMY: "DD.MM.YYYY"
};

export const CustomerPlatformType = {
  NORMAL: "Normal",
  FACEBOOK: "Facebook",
  GOOGLE: "Google",
};

// export const PriceFilter = [
//   {key: 1, value: 'Under 500', from_value: 0, to_value: 500},
//   {key: 2, value: '500 - 1000', from_value: 500, to_value: 1000},
//   {key: 3, value: '1000 - 5000', from_value: 1000, to_value: 5000},
//   {key: 4, value: 'Above 5000', from_value: 5000, to_value: ''}
// ]


export const USER_TYPE = {
  USER: 1,
  CORPORATE_USER: 2
}

export const PAYMENT = {
  DEBIT: 95,
  CREDIT: 94
}

export const APARTMENT_SORT_BY = [
  {key: 1, value: "price_low", sort_column: "monthly_price_aed", sort_direction: "asc"},
  {key: 2, value: "price_high", sort_column: "monthly_price_aed", sort_direction: "desc"},
  {key: 3, value: "featured_first", sort_column: "is_featured", sort_direction: "desc"},
  {key: 4, value: "date_old", sort_column: "created_datetime_utc", sort_direction: "asc"},
  {key: 5, value: "date_new", sort_column: "created_datetime_utc", sort_direction: "desc"}
]

export const OTHER_FILTERS = [
  {key: "room_type", value: "", condition: "=", urlKey: "studio"},
  {key: "no_of_bathrooms", value: "", condition: "=", urlKey: "bathrooms"},
  {key: "no_of_rooms", value: "", condition: "=", urlKey: "bedrooms"},
  {key: "monthly_price", value: "", condition: "between", urlKey: "prices"},
  {key: "apartment_amenities", value: "", condition: "in", urlKey: "apartmentAmenities"},
  {key: "property_amenities", value: "", condition: "in", urlKey: "buildingAmenities"},
  {key: "property_ratings", value: "", condition: "=", urlKey: "ratings"}
]

export const LANGUAGE={
  English:'en',
  Russian:'ru'
}

export const ScreenResolutions={
  Width:600
}

export const DefaultCountry = {
  UAE : "United Arab Emirates"
}

export const CityLangColumns={
  en:"city_name",
  ru:"russian_city_name",
}

export const DEFAULT_CURRENCY = "AED";