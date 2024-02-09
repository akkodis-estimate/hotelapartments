import { useEffect, useState } from "react";
import { BsX, BsXLg } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";
import { LANGUAGE, RoutePaths } from "Constants/Constants";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import PhoneIcon from "Assets/Images/SidebarIcons/PhoneIcon";
import WhatsappIcon from "Assets/Images/SidebarIcons/WhatsappIcon";
import MailIcon from "Assets/Images/SidebarIcons/MailIcon";
import EnglishFlagIcon from "Assets/Images/HeaderIcons/EnglishFlagIcon";
import RussianFlagIcon from "Assets/Images/HeaderIcons/RussianFlagIcon";
import GlobeIcon from "Assets/Images/HeaderIcons/GlobeIcon";
import SidebarImg from "Assets/Images/SidebarIcons/SidebarImg.png";
import CalendarIcon from "Assets/Images/SidebarIcons/CalendarIcon";
import i18next from "i18next";
import "./menu.css";
import langHeaderActions from "reducers/LanguageHeader/langHeader.actions";
import { Drawer, ScrollArea } from "@mantine/core";
import maskingActions from "reducers/masking/masking.actions";
import dropdownService from "Services/dropdownService";
import { toast } from "react-toastify";

const MenuSidebar = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userDetails } = useSelector((state) => state.customerAuth);
  const [activeLanguage, setActiveLanguage] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [showLanguageDrawerBtn, setShowLanguageDrawerBtn] = useState(false); // for the show the Drawer of Language
  const [openDrawer, setopenDrawer] = useState(false);
  const [currencyDropdown, setcurrencyDropdown] = useState([]);
  const [activeCurrency, setActiveCurrency] = useState(null);

  // For the Select the Language
  const languageMap = {
    en: { label: "English", dir: "ltr", active: true },
    ru: { label: "Russian", dir: "ltr", active: false },
  };

  const navigateCorporate = () => {
    document.body.classList.remove("overflow-hidden");
    // navigate("/corporate-customers");
    props.setIsOpen(false);
  };

  const navigateBookingsList = () => {
    document.body.classList.remove("overflow-hidden");
    // navigate("/bookings-cart-list");
    props.setIsOpen(false);
  };

  const navigateBlog = () => {
    document.body.classList.remove("overflow-hidden");
    // navigate("/blog");
    props.setIsOpen(false);
  };

  const navigateLuxuryApartment = () => {
    document.body.classList.remove("overflow-hidden");
    // navigate(`${SetDynamicEndpoint(RoutePaths.SIDE_MENU.LUXURY_APARTMENTS)}`);
    props.setIsOpen(false);
  };

  const navigateServiceVilla = () => {
    document.body.classList.remove("overflow-hidden");
    // navigate(
    //   `${SetDynamicEndpoint(
    //     RoutePaths.LUXURY_APARTMENTS.LUXURY_APARTMENTS_TWO
    //   )}`
    // );
    props.setIsOpen(false);
  };

  const navigateContactUs = () => {
    document.body.classList.remove("overflow-hidden");
    // navigate("/contact-us");
    props.setIsOpen(false);
  };

  const navigateForHotelsPage = () => {
    document.body.classList.remove("overflow-hidden");
    // navigate(RoutePaths.FOR_HOTELS.FOR_HOTELS);
    props.setIsOpen(false);
  };

  const navigateExpriencePage = () => {
    document.body.classList.remove("overflow-hidden");
    // navigate(RoutePaths.EXPERIENCE.EXPERIENCE);
    props.setIsOpen(false);
  };

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

  const handleCurrencyChange = (e, currency) => {
    localStorage.setItem("currency", currency.currency_code);
    dispatch(langHeaderActions.setCurrency(currency.currency_code));
    setActiveCurrency(currency.currency_code);
  };

  const handleRemoveCurrency = () => {
    localStorage.removeItem("currency");
    dispatch(langHeaderActions.setCurrency(""));
    setActiveCurrency(null);
  };

  useEffect(() => {
    getCurrencyDropdown();
  }, []);

  return (
    <div
      className={`sideBarMenu overflow-auto ${!props.isOpen ? "d-none" : ""}`}
    >
      <button
        type="button"
        className="closeSidebar"
        onClick={() => {
          props.setIsOpen(false);
          document.body.classList.remove("overflow-hidden");
        }}
        id="closeAsidemenu"
      >
        <BsXLg />
      </button>

      <div className="dropdown me-3 globeSm">
        <button
          className="dropdown-toggle border-0 bg-transparent"
          type="button"
          // data-bs-toggle="dropdown"
          // aria-expanded="false"
          // data-bs-display="static"
          // data-bs-auto-close="outside"
          onClick={() => {
            setShowLanguageDrawerBtn(true);
            setopenDrawer(true);
          }}
        >
          <GlobeIcon />
        </button>

        <Drawer
          size="85%"
          // overlayProps={overlayProps}
          position="bottom"
          opened={openDrawer}
          onClose={() => {
            setopenDrawer(!openDrawer);
          }}
        >
          {/* <MobileDrawer openDrawer={openDrawer} setopenDrawer={setopenDrawer}> */}
          <ul>
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
                        onClick={() => handleLanguageChange(LANGUAGE.English)}
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
                        onClick={() => handleLanguageChange(LANGUAGE.Russian)}
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
                    {/* <li className="langItem">
                      <EnglishFlagIcon /> USD
                    </li>
                    <li className="langItem">
                      <RussianFlagIcon /> RUB
                    </li> */}
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
                                onClick={(e) => handleCurrencyChange(e, item)}
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
                  </ul>
                </div>
              </div>
            </div>
          </ul>
          {/* </MobileDrawer> */}
        </Drawer>
      </div>

      <div className="menuList">
        <ul>
          <li>
            <a
              href={`${SetDynamicEndpoint(
                RoutePaths.SIDE_MENU.LUXURY_APARTMENTS
              )}`}
              // onClick={() => {
              //   navigateLuxuryApartment();
              // }}
            >
              {t("side_bar.ultra_luxuty")}
            </a>
          </li>
          <li>
            <a
              href={`${SetDynamicEndpoint(
                RoutePaths.LUXURY_APARTMENTS.LUXURY_APARTMENTS_TWO
              )}`}
              // onClick={(e) => {
              //   navigateServiceVilla();
              // }}
            >
              {t("side_bar.serviced_villas")}
            </a>
          </li>
          <li>
            <a href={`/corporate-customers`} 
            // onClick={navigateCorporate}
            >
              {t("side_bar.Corporate")}
            </a>
          </li>
          {userDetails?.customer_id && userDetails?.type == 2 && (
            <li>
              <a href={`/bookings-cart-list`} 
              // onClick={navigateBookingsList}
              >
                {t("side_bar.booking_cart")}
              </a>
            </li>
          )}
          <li>
            <a
              href={`${RoutePaths.FOR_HOTELS.FOR_HOTELS}`}
              // onClick={() => {
              //   navigateForHotelsPage();
              // }}
            >
              {t("side_bar.For Landlords")}
            </a>
          </li>
          <li>
            <a
              href={`${RoutePaths.EXPERIENCE.EXPERIENCE}`}
              // onClick={() => {
              //   navigateExpriencePage();
              // }}
            >
              {t("side_bar.Experience")}
            </a>
          </li>
          <li>
            <a href={`/blog`} 
            // onClick={navigateBlog}
            >
              {t("side_bar.Blog")}
            </a>
          </li>
          <li>
            <a href={`/contact-us`} 
            // onClick={navigateContactUs}
            >
              {t("side_bar.Contact us")}{" "}
            </a>
          </li>
        </ul>
      </div>
      <div className="sidebarImg mb-5 mt-5">
        <img src={SidebarImg} alt="Img" w={100} />
      </div>
      <div className="contactDetails">
        <div className="timingDtls d-flex align-items-center mb-5">
          <CalendarIcon />
          <span className="ms-3">{t("side_bar.Timing")}</span>
        </div>
        <div className="socialDtls d-flex align-items-center mb-5">
          <span>{t("side_bar.Contact by")}:</span>
          <div className="d-flex align-items-center w-50 justify-content-between ms-5">
            <span className="cursor-pointer">
              <PhoneIcon />
            </span>
            <span className="cursor-pointer">
              <WhatsappIcon />
            </span>
            <span className="cursor-pointer">
              <MailIcon />
            </span>
          </div>
        </div>
        <p className="smartStarTech">Smart Stay Technologies LLC</p>
      </div>
    </div>
  );
};

export default MenuSidebar;
