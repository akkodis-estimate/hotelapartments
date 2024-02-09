import Layout from "Components/Layout/layout";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "Pages/Home/home";
import Signup from "Pages/Authentication/Signup/signup";
import SignIn from "Pages/Authentication/Signin/signin";
import OTPVerify from "Pages/Authentication/OtpVerify";
import ThankYou from "Pages/Authentication/ThankYou";
import ForgotPassword from "Pages/Authentication/ForgotPassword";
import SetNewPassword from "Pages/Authentication/SetNewPassword";
import SuccessPage from "Pages/Authentication/SuccessPage/success";
import Account from "Pages/Account";
import AccountSettings from "Pages/Account/Pages/AccountSettings";
import Bookings from "Pages/Account/Pages/Bookings";
import { RoutePaths, ScreenResolutions, USER_TYPE } from "Constants/Constants";
import CorporateCustomers from "Pages/CorporateCustomers/CorporateCustomers";
import AllAreas from "Pages/AllAreas/AllAreas";
import FeaturedProperties from "Pages/Properties/FeaturedProperties/FeaturedProperties";
import PropertiesDetail from "Pages/Properties/PropertiesDetail/PropertiesDetail";
import Booking from "Pages/Booking/Pages/Booking/Booking";
import BlogListing from "Pages/Blog/BlogListing/BlogListing";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import BlogDetail from "Pages/Blog/BlogDetail/BlogDetail";
import OtpPage from "Pages/Account/Pages/AccountSettings/Components/PersonalInformation/OtpPage";
import LuxuryApartments from "Pages/LuxuryApartments/LuxuryApartmentOne/LuxuryApartments";
import LuxuryApartmentTwo from "Pages/LuxuryApartments/LuxuryApartmentTwo/LuxuryApartmentTwo";
import Payment from "Pages/Booking/Pages/Payment/Payment";
import ContactUs from "Pages/ContactUs/ContactUs";
import PreviewProperty from "Pages/Properties/PreviewProperties/PreviewProperty";
import BookingList from "Pages/Booking/Pages/BookingList/BookingList";
import MultiBooking from "Pages/Booking/Pages/MultiBooking/MultiBooking";
import MultiBookingPayment from "Pages/Booking/Pages/MultiBookingPayment/MultiBookingPayment";
import CreditHistory from "Pages/Account/Pages/CreditTransactionHistory/creditTransactionHistory";
import { useDispatch, useSelector } from "react-redux";
import maskingActions from "reducers/masking/masking.actions";
import dropdownService from "Services/dropdownService";
import { useState } from "react";
import { useEffect } from "react";
import RefundRequest from "Pages/Account/Pages/Refund Request";
import PaymentSuccess from "Components/Payment/PaymentSuccess";
import PaymentFailure from "Components/Payment/PaymentFailure";
import InquiryModal from "Pages/CorporateCustomers/Components/InquiryModal/InquiryModal";
import MobileInquiryForm from "Pages/CorporateCustomers/Components/MobileInquiryForm";
import ForHotels from "Pages/ForHotels/Hotels";
import Experience from "Pages/Experience/Experience";
import LoyaltyPointsHistory from "Pages/Account/Pages/LoyaltyPointsHistory/loyaltyPointsHistory";
import RePayment from "Pages/Booking/Pages/RePayment/RePayment";
import Inbox from "Pages/Account/Pages/Inbox";
import RefundPolicy from "Pages/Policy/RefundPolicy/RefundPolicy";
import PrivacyPolicy from "Pages/Policy/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "Pages/Policy/TermsAndConditions/TermsAndConditions";
import ReservationTerms from "Pages/Policy/ReservationTerms/ReservationTerms";
import MobileInboxList from "Pages/Account/Pages/Inbox/ResponsiveInbox/MobileInboxList";
import MobileInboxChat from "Pages/Account/Pages/Inbox/ResponsiveInbox/Components/ResponsiveInboxChat/ResponsiveInboxChat";
import ResponsiveReservationDetails from "Pages/Account/Pages/Inbox/ResponsiveInbox/Components/ResponsiveReservationDetails/ResponsiveReservationDetails";
import AuthorisedRoute from "Components/AuthorisedRoutes/AuthorisedRoutes";
import AboutUs from "Pages/AboutUs/aboutus";
//import BookingSuccessModal from "Pages/Booking/Components/BookingSuccess/BookingSuccessModal";

const AppRoutes = () => {
  const { userDetails } = useSelector((state) => state.customerAuth);
  const dispatch = useDispatch(); // For calling Reducers

  const [searchValues, SetSearchValues] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isPathLoaded, setIsPathLoaded] = useState(false);

  useEffect(() => {
    //dispatch(maskingActions.showMasking());
    dropdownService
      .get_home_search()
      .then((res) => {
        if (res.data) {
          const newArray = res.data?.filter((f) => f.type === 2);
          SetSearchValues(newArray);
          setIsPathLoaded(true);
        } else {
          SetSearchValues([]);
        }
      })
      .finally(() => {
        //dispatch(maskingActions.hideMasking());
      });
  }, []);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      // debugger;
      // if (windowWidth <= ScreenResolutions.Width) {
      //   setdrawerOpen(true);
      // }
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path={RoutePaths.AUTHORISATION.SIGN_IN} element={<SignIn />} />
        <Route path={RoutePaths.AUTHORISATION.SIGN_UP} element={<Signup />} />
        <Route
          path={RoutePaths.AUTHORISATION.OTP_VERIFY}
          element={<OTPVerify />}
        />
        <Route
          path={RoutePaths.AUTHORISATION.FORGOT_PASSWORD}
          element={<ForgotPassword />}
        />
        <Route
          path={RoutePaths.AUTHORISATION.SET_NEW_PASSWORD}
          element={<SetNewPassword />}
        />
        <Route
          path={RoutePaths.AUTHORISATION.THANK_YOU}
          element={<ThankYou />}
        />

        <Route
          path={RoutePaths.AUTHORISATION.SUCCESS}
          element={<SuccessPage />}
        />
        <Route path={RoutePaths.ACCOUNT.ACCOUNT} element={<Account />}>
          <Route
            path={RoutePaths.ACCOUNT.ACCOUNT_SETTINGS}
            //element={<AccountSettings />}
            element={<AuthorisedRoute returnURL={RoutePaths.ACCOUNT.ACCOUNT_SETTINGS}>
              <AccountSettings />
            </AuthorisedRoute>}
          />
          <Route path={RoutePaths.ACCOUNT.OTP_VERIFY} element={<OtpPage />} />
          <Route
            path={RoutePaths.ACCOUNT.ACCOUNT_BOOKINGS}
            //element={<Bookings />}
            element={<AuthorisedRoute returnURL={RoutePaths.ACCOUNT.ACCOUNT_BOOKINGS}>
              <Bookings />
            </AuthorisedRoute>}
          />

          <Route
            path={RoutePaths.ACCOUNT.ACCOUNT_REFUND}
            //element={<RefundRequest />}
            element={<AuthorisedRoute returnURL={RoutePaths.ACCOUNT.ACCOUNT_REFUND}>
              <RefundRequest />
            </AuthorisedRoute>}
          />

          {userDetails && userDetails.type == USER_TYPE.CORPORATE_USER && (
            <Route
              path={RoutePaths.ACCOUNT.CREDIT_HISTORY}
              //element={<CreditHistory />}
              element={<AuthorisedRoute returnURL={RoutePaths.ACCOUNT.CREDIT_HISTORY}>
                <CreditHistory />
              </AuthorisedRoute>}
            />
          )}

          <Route
            path={RoutePaths.ACCOUNT.LOYALTY_POINTS_HISTORY}
            //element={<LoyaltyPointsHistory />}
            element={<AuthorisedRoute returnURL={RoutePaths.ACCOUNT.LOYALTY_POINTS_HISTORY}>
              <LoyaltyPointsHistory />
            </AuthorisedRoute>}
          />

          <Route path={RoutePaths.ACCOUNT.INBOX}
            //element={<Inbox />} 
            element={<AuthorisedRoute returnURL={RoutePaths.ACCOUNT.INBOX}>
              <Inbox />
            </AuthorisedRoute>} />
        </Route>

        <Route
          path={RoutePaths.CORPORATE_CUSTOMERS.CORPORATE_CUSTOMERS}
          element={<CorporateCustomers />}
        />
        <Route path={RoutePaths.ALL_AREAS.ALL_AREAS} element={<AllAreas />} />
        <Route
          path={RoutePaths.PROPERTIES.FEATURED_PPROPERTIES}
          element={<FeaturedProperties />}
        />
        <Route
          path={RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_DYNAMIC}
          element={<FeaturedProperties />}
        />
        {searchValues &&
          searchValues?.map((item) => (
            <>
              <Route
                path={`${SetDynamicEndpoint(
                  RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_ENTITY,
                  [item.link]
                )}`}
                element={<FeaturedProperties />}
              />
              <Route
                path={`${SetDynamicEndpoint(
                  RoutePaths.PROPERTIES.FEATURED_PPROPERTIES_ENTITY_DYNAMIC,
                  [item.link]
                )}`}
                element={<FeaturedProperties />}
              />
            </>
          ))}

        <Route
          //path={RoutePaths.PROPERTIES.PROPERTIES_DETAIL}
          path={`${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [
            ":id",
          ])}`}
          element={<PropertiesDetail />}
        />

        <Route
          path={`${SetDynamicEndpoint(RoutePaths.BOOKING.BOOKING, [":id"])}`}
          //element={<Booking />}
          element={<AuthorisedRoute>
            <Booking />
          </AuthorisedRoute>}
        />

        <Route
          path={`${SetDynamicEndpoint(RoutePaths.BOOKING.PAYMENT, [":id"])}`}
          // element={<Payment />}
          element={<AuthorisedRoute>
            <Payment />
          </AuthorisedRoute>}
        />

        <Route
          path={`${SetDynamicEndpoint(RoutePaths.REPAYMENT.REPAYMENT, [
            ":booking_sid",
          ])}`}
          // element={<RePayment />}
          element={<AuthorisedRoute>
            <RePayment />
          </AuthorisedRoute>}
        />

        <Route
          path={`${SetDynamicEndpoint(RoutePaths.BOOKING.MULTIBOOKING, [
            ":id",
          ])}`}
          // element={<MultiBooking />}
          element={<AuthorisedRoute>
            <MultiBooking />
          </AuthorisedRoute>}
        />
        <Route
          path={`${SetDynamicEndpoint(RoutePaths.BOOKING.MULTIBOOKING_PAYMENT, [
            ":id",
          ])}`}
          // element={<MultiBookingPayment />}
          element={<AuthorisedRoute>
            <MultiBookingPayment />
          </AuthorisedRoute>}
        />
        <Route
          path={RoutePaths.BOOKING.BOOKING_LIST}
          //element={<BookingList />}
          element={<AuthorisedRoute returnURL={RoutePaths.BOOKING.BOOKING_LIST}>
            <BookingList />
          </AuthorisedRoute>}
        />
        <Route path={RoutePaths.BLOG.BLOG} element={<BlogListing />} />
        <Route
          //path={RoutePaths.BLOG.BLOG_Detail}
          path={`${SetDynamicEndpoint(RoutePaths.BLOG.BLOG_Detail, [":id"])}`}
          element={<BlogDetail />}
        />
        <Route
          path={RoutePaths.SIDE_MENU.LUXURY_APARTMENTS}
          element={<LuxuryApartments />}
        />
        {
          <Route
            path={RoutePaths.SIDE_MENU.LUXURY_APARTMENTS_TWO}
            element={<LuxuryApartmentTwo />}
          />
        }
        <Route
          path={RoutePaths.CONTACT_US.CONTACT_US}
          element={<ContactUs />}
        />
        <Route
          path={RoutePaths.CORPORATE_CUSTOMERS.ADD_INQUIRY}
          element={
            windowWidth <= ScreenResolutions.Width ? (
              <MobileInquiryForm isfromMobile={false} />
            ) : (
              <Navigate
                to={RoutePaths.CORPORATE_CUSTOMERS.CORPORATE_CUSTOMERS}
                replace
              />
            )
          }
        />

        {isPathLoaded && (
          <Route path="*" element={<Navigate to="/" replace />} />
        )}

        <Route
          path={RoutePaths.FOR_HOTELS.FOR_HOTELS}
          element={<ForHotels />}
        />

        <Route
          path={RoutePaths.EXPERIENCE.EXPERIENCE}
          element={<Experience />}
        />

        <Route
          path={RoutePaths.POLICY.REFUND_POLICY}
          element={<RefundPolicy />}
        />

        <Route
          path={RoutePaths.POLICY.PRIVACY_POLICY}
          element={<PrivacyPolicy />}
        />

        <Route
          path={RoutePaths.POLICY.TERMS_AND_CONDITIONS}
          element={<TermsAndConditions />}
        />

        <Route
          path={RoutePaths.POLICY.RESERVATION_TERMS}
          element={<ReservationTerms />}
        />

        <Route
          path={RoutePaths.ABOUT_US.ABOUT_US}
          element={<AboutUs />}
        />

        {/* {userDetails && <Route path={RoutePaths.PAYMENT_SUCCESS.PAYMENT_SUCCESS} element={<BookingSuccessModal />} />} */}
        <Route
          path={RoutePaths.ACCOUNT.MOBILE_INBOX_LIST}
          element={
            <AuthorisedRoute returnURL={windowWidth <= ScreenResolutions.Width ? RoutePaths.ACCOUNT.MOBILE_INBOX_LIST : RoutePaths.ACCOUNT.INBOX}>
              {windowWidth <= ScreenResolutions.Width ? (
                <MobileInboxList isfromMobile={false} />
              ) : (
                <Navigate to={RoutePaths.ACCOUNT.INBOX} replace />
              )}
            </AuthorisedRoute>
          }
        />
        <Route
          path={`${SetDynamicEndpoint(RoutePaths.ACCOUNT.MOBILE_INBOX_CHAT, [
            ":id",
          ])}`}
          element={
            <AuthorisedRoute>
              {windowWidth <= ScreenResolutions.Width ? (
                <MobileInboxChat isfromMobile={false} />
              ) : (
                <Navigate to={RoutePaths.ACCOUNT.INBOX} replace />
              )}
            </AuthorisedRoute>
          }
        />
        <Route
          path={`${SetDynamicEndpoint(
            RoutePaths.ACCOUNT.MOBILE_RESERVATION_DETAILS,
            [":id"]
          )}`}
          element={
            <AuthorisedRoute>
              {windowWidth <= ScreenResolutions.Width ? (
                <ResponsiveReservationDetails isfromMobile={false} />
              ) : (
                <Navigate to={RoutePaths.ACCOUNT.INBOX} replace />
              )}
            </AuthorisedRoute>
          }
        />
      </Route>
      <Route
        path={`${SetDynamicEndpoint(
          RoutePaths.PROPERTIES.PREVIEW_PROPERTIES_DETAIL,
          [":id"]
        )}`}
        element={<PreviewProperty />}
      />

      {/* {userDetails && <Route path={RoutePaths.PAYMENT_SUCCESS.PAYMENT_SUCCESS} element={<PaymentSuccess />} />}
    {userDetails && <Route path={RoutePaths.PAYMENT_FAILURE.PAYMENT_FAILURE} element={<PaymentFailure />} />} */}
    </Routes>
  );
};

export default AppRoutes;
