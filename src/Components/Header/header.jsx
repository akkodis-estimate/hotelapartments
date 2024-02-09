import { BsCart, BsList, BsX } from "react-icons/bs";
import BrandLogo from "Assets/Images/HeaderIcons/BrandLogo";
import GlobeIcon from "Assets/Images/HeaderIcons/GlobeIcon";
import UserIcon from "Assets/Images/HeaderIcons/UserIcon";

import "./header.css";
import EnglishFlagIcon from "Assets/Images/HeaderIcons/EnglishFlagIcon";
import RussianFlagIcon from "Assets/Images/HeaderIcons/RussianFlagIcon";
import UserOneIcon from "Assets/Images/HeaderIcons/UserOneIcon";
import BookingIcon from "Assets/Images/HeaderIcons/BookingIcon";
import InboxIcon from "Assets/Images/HeaderIcons/InboxIcon";
import LogOutIcon from "Assets/Images/HeaderIcons/LogOutIcon";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "reducers/customer/auth/auth.actions";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import i18next from "i18next";
import accountSettingService from "Services/AccountSettingService";
import langHeaderActions from "reducers/LanguageHeader/langHeader.actions";
import maskingActions from "reducers/masking/masking.actions";
import { toast } from "react-toastify";
import {
  LANGUAGE,
  RoutePaths,
  ScreenResolutions,
  USER_TYPE,
} from "Constants/Constants";
import { MdCurrencyExchange, MdOutlineLoyalty } from "react-icons/md";
import dropdownService from "Services/dropdownService";
import { ScrollArea } from "@mantine/core";
import SALogoIcon from "Assets/Images/SALogoIcon.png";
import { GrTransaction } from "react-icons/gr";
import SAWhiteLogo from "Assets/Images/HeaderIcons/SAWhiteLogo.svg";

const Header = (props) => {
  const { userDetails } = useSelector((state) => state.customerAuth);
  const { language, currency_code } = useSelector((state) => state.language);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeLanguage, setActiveLanguage] = useState(null);
  const [activeCurrency, setActiveCurrency] = useState(null);
  const location = useLocation();

  const languageMap = {
    en: { label: "English", dir: "ltr", active: true },
    ru: { label: "Russian", dir: "ltr", active: false },
  };

  const selected =
    localStorage.getItem("i18nextLng") === "en-US"
      ? "en"
      : localStorage.getItem("i18nextLng") || "en";
  const { t } = useTranslation();

  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [currencyDropdown, setcurrencyDropdown] = useState([]);

  const handleLanguageChange = (language) => {
    i18next.changeLanguage(language);
    setActiveLanguage(language);
    localStorage.setItem("lang", language);
    setMenuAnchor(null);
    dispatch(langHeaderActions.setLanguage(language));
  };

  const getCurrencyDropdown = () => {
    dispatch(maskingActions.showMasking());
    dropdownService
      .get_currency_dropdown()
      .then((res) => {
        setcurrencyDropdown(res.data);
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  useEffect(() => {
    getCurrencyDropdown();
  }, []);

  React.useEffect(() => {
    document.body.dir = languageMap[selected]?.dir;
    setActiveLanguage(
      localStorage.getItem("lang") ? localStorage.getItem("lang") : "en"
    );
    setActiveCurrency(
      localStorage.getItem("currency") ? localStorage.getItem("currency") : null
    );
  }, [menuAnchor, selected]);

  const handleLogout = () => {
    dispatch(actions.logoutUser());
    navigate("/");
  };

  const navigateBookingsList = () => {
    navigate("/bookings-cart-list");
  };

  const handleSidebar = (aside) => {
    if (aside === true) {
      props.setIsOpen(true);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  };
  const setFormData = {};

  //api call for the get the user details from user sid
  useEffect(() => {
    if (userDetails !== null) {
      accountSettingService
        .get_user_by_sid(userDetails.customer_sid)
        .then((res) => {
          setFormData(res.data.info);
        })
        .finally(() => {});
    }
  }, [language]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleCurrencyChange = (e, currency) => {
    localStorage.setItem("currency", currency.currency_code);
    dispatch(langHeaderActions.setCurrency(currency.currency_code));
    setActiveCurrency(currency.currency_code);
  };

  useEffect(() => {}, [currency_code]);

  const handleRemoveCurrency = () => {
    localStorage.removeItem("currency");
    dispatch(langHeaderActions.setCurrency(""));
    setActiveCurrency(null);
  };

  const handleInboxNavigation = () => {
    let width = window.innerWidth;
    if (width <= ScreenResolutions.Width) {
      navigate(RoutePaths.ACCOUNT.MOBILE_INBOX_LIST);
    } else {
      navigate(RoutePaths.ACCOUNT.INBOX);
    }
  };

  return (
    <nav
      className={`navbar mainHeader ${
        location.pathname === "/luxury-apartments" ||
        location.pathname === "/service-villa"
          ? "ULAHeaderMain"
          : ""
      }
          ${
            location.pathname === "/sign-in" ||
            location.pathname === "/sign-up" ||
            location.pathname === "/forgot-password"
              ? "authBorderStyle"
              : ""
          }`}
      style={{
        background:
          location.pathname === "/luxury-apartments" ||
          location.pathname === "/service-villa"
            ? "#404040"
            : "",
        borderBottom:
          location.pathname === "/luxury-apartments" ||
          location.pathname === "/service-villa"
            ? "0px"
            : "",
      }}
    >
      <div className="header_in navContainer">
        <button
          className="navbar-toggler d-flex align-items-center p-0 asideBtn"
          type="button"
          onClick={() => {
            handleSidebar(!props.isOpen);
          }}
          id="openAsidemenu"
        >
          <span className="hamburgerIcon">
            <BsList />
          </span>
          <span className="navMenuText">{t("header.menu")}</span>
        </button>

        <div className="brandLogo">
          <NavLink to="/" className="logoXl">
            <BrandLogo />
            <div className="ULALogoWhite">
              <img src={SAWhiteLogo} alt="Logo White" width={180} />
            </div>
            {/* <SALogo /> */}
          </NavLink>
          <NavLink to="/" className="logosm">
            <img src={SALogoIcon} alt="SA Logo" width={32} height={28} />
          </NavLink>
        </div>
        <div className="accountInfo d-flex align-items-center">
          {userDetails?.customer_sid && userDetails?.type == 2 && (
            <div className="dropdown me-4 cursor-pointer">
              <BsCart
                size={25}
                onClick={() => {
                  navigateBookingsList();
                }}
              />
            </div>
          )}
          {windowWidth > ScreenResolutions.Width && (
            <div className="dropdown globeSm">
              <button
                className="dropdown-toggle border-0 bg-transparent"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-display="static"
                data-bs-auto-close="outside"
              >
                <GlobeIcon />
              </button>
              <ul className="dropdown-menu">
                <div className="languageCurrencyDD">
                  <ul
                    className="nav nav-pills mb-3 d-flex justify-content-center"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-home-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-home"
                        type="button"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                      >
                        {t("header.language")}
                      </button>
                    </li>
                    {!location?.pathname
                      ?.toLowerCase()
                      ?.includes("repayment") && (
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link"
                          id="pills-profile-tab"
                          data-bs-toggle="pill"
                          data-bs-target="#pills-profile"
                          type="button"
                          role="tab"
                          aria-controls="pills-profile"
                          aria-selected="false"
                        >
                          {t("header.currency")}
                        </button>
                      </li>
                    )}
                  </ul>
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-home"
                      role="tabpanel"
                      aria-labelledby="pills-home-tab"
                      tabIndex="0"
                    >
                      <ul className="langSelect">
                        <li
                          className={`langItem ${
                            activeLanguage === "en" ? "active" : ""
                          }`}
                          // onClick={() => handleLanguageChange('en')}
                        >
                          {/* <EnglishFlagIcon /> {languageMap["en"].label} */}
                          <div
                            className="d-flex align-items-center gap-2"
                            onClick={() =>
                              handleLanguageChange(LANGUAGE.English)
                            }
                          >
                            <EnglishFlagIcon /> {languageMap["en"].label}
                          </div>
                          <div>
                            {/* <button
                              type="button"
                              className="langConverter"
                              onClick={()=>handleMultilanguageChange(LANGUAGE.English)}
                            >
                              Convert
                            </button> */}
                          </div>
                        </li>

                        <li
                          className={`langItem ${
                            activeLanguage === "ru" ? "active" : ""
                          }`}
                          onClick={() => handleLanguageChange("ru")}
                        >
                          {/* <RussianFlagIcon /> {languageMap["ru"].label} */}
                          <div
                            className="d-flex align-items-center gap-2"
                            onClick={() =>
                              handleLanguageChange(LANGUAGE.Russian)
                            }
                          >
                            <RussianFlagIcon /> {languageMap["ru"].label}
                          </div>
                          <div>
                            {/* <button
                              type="button"
                              className="langConverter"
                              onClick={()=>handleMultilanguageChange(LANGUAGE.Russian)}
                            >
                              Convert
                            </button> */}
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-profile"
                      role="tabpanel"
                      aria-labelledby="pills-profile-tab"
                      tabIndex="0"
                    >
                      <ul className="langSelect">
                        <ScrollArea h={200} offsetScrollbars scrollbarSize={6}>
                          {currencyDropdown.map((item, key) => {
                            return (
                              <>
                                <li
                                  className={`langItem ${
                                    activeCurrency === item.currency_code
                                      ? "active"
                                      : ""
                                  } `}
                                >
                                  {/* <EnglishFlagIcon /> */}
                                  <div
                                    className="d-flex align-items-center gap-2 w-100"
                                    onClick={(e) =>
                                      handleCurrencyChange(e, item)
                                    }
                                  >
                                    <div>
                                      <img
                                        src={item.country_flag_url}
                                        alt="Flag"
                                        className="currencyDDImg"
                                      />
                                    </div>
                                    {item.currency_code}
                                  </div>
                                  {activeCurrency === item.currency_code && (
                                    <span
                                      className="removeLang"
                                      onClick={handleRemoveCurrency}
                                    >
                                      <BsX />
                                    </span>
                                  )}
                                </li>
                              </>
                            );
                          })}
                        </ScrollArea>

                        {/* <li className="langItem">
                          <EnglishFlagIcon /> USD
                        </li>
                        <li className="langItem">
                          <RussianFlagIcon /> RUB
                        </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </ul>
            </div>
          )}
          {userDetails === null ? (
            <div className="signInBtn">
              <NavLink to="/sign-in">
                <UserIcon />
              </NavLink>
            </div>
          ) : (
            <div className="dropdown userProfile ">
              <button
                className="dropdown-toggle border-0 bg-transparent"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                data-bs-display="static"
              >
                {
                  userDetails && userDetails?.profile_url ?
                  (<div className="profileImage">
                  <img
                    src={userDetails?.profile_url}
                    alt="profile"
                  />
                </div>) :
                <div className="profileImageInitial">
                  {userDetails.first_name[0] + userDetails.last_name[0]}
                </div>
                }

                {/* {userDetails.first_name[0] + userDetails.last_name[0]} */}
              </button>
              <ul className="dropdown-menu">
                <div className="languageCurrencyDD">
                  <ul className="profileDD">
                    <li>
                      <NavLink to="/account/account-settings">
                        <UserOneIcon /> {t("pages.home.Account")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/account/bookings">
                        <BookingIcon /> {t("pages.home.Bookings")}
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/account/refund-request"
                        className="iconColor"
                      >
                        <MdCurrencyExchange size={22} />{" "}
                        {t("pages.AccountSettings.refund_request")}
                      </NavLink>
                    </li>

                    {userDetails &&
                      userDetails.type == USER_TYPE.CORPORATE_USER && (
                        <li>
                          <NavLink
                            to="/account/credit-history"
                            className="iconColor"
                          >
                            <GrTransaction />
                            {t("pages.AccountSettings.credit_transaction")}
                          </NavLink>
                        </li>
                      )}

                    {userDetails && userDetails.type == USER_TYPE.USER && (
                      <li>
                        <NavLink
                          to={RoutePaths.ACCOUNT.LOYALTY_POINTS_HISTORY}
                          className="iconColor"
                        >
                          <MdOutlineLoyalty size={22} />
                          {t("pages.AccountSettings.loyalty_points")}
                        </NavLink>
                      </li>
                    )}

                    <li>
                      <span onClick={handleInboxNavigation}>
                        <InboxIcon /> {t("pages.home.Inbox")}
                      </span>
                    </li>
                    <li onClick={handleLogout}>
                      <span>
                        <LogOutIcon /> {t("pages.home.Sign out")}
                      </span>
                    </li>
                  </ul>
                </div>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
