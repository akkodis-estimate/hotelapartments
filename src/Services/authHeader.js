export default function authHeader(booking_currency = '') {
  const token = localStorage.getItem("token");
  const language = localStorage.getItem("lang");
  const currency = booking_currency ? booking_currency : localStorage.getItem("currency");

  
  if (token) {
    return {
      "auth-token": token,
      lang: language ? language : "en",
      currency: currency ? currency : null,
    };
  }
  return {
    lang: language ? language : "en",
    currency: currency ? currency : null,
  };
}

