import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import ShpaLogo from "Assets/Images/FooterIcons/SHPA.png";
import "./footer.css";
import { useTranslation } from "react-i18next";
import { RoutePaths } from "Constants/Constants";
import { useEffect } from "react";
import BrandLogo from "Assets/Images/HeaderIcons/BrandLogo";
import SALogoIcon from "Assets/Images/SALogoIcon.png"
const Footer = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {}, [location.pathname]);

  const navigateToDubai = () => {
    // window.location.href =
      return RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + "-dubai-uae";
  };

  const navigateToAbuDhabi = () => {
    // window.location.href =
      return RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + "-abu-dhabi-uae";
  };

  const navigateToSpOffer = () => {
    // window.location.href =
      return RoutePaths.PROPERTIES.FEATURED_PPROPERTIES + "?specialOffer=1";
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  const policyLinks = (url) => {
    navigate(url);
    window.scrollTo(0, 0);
  };


  const navigateToSocial = (url) => {
    const newTab = window.open(url, "_blank");
      if (newTab?.location?.href) {
          newTab.location.replace(url);
      }
  }


  const navigateToWhatsApp = (number) => {
    const whatsappLink = `https://api.whatsapp.com/send?phone=${number}`;
  
    const newTab = window.open(whatsappLink, "_blank");
      if (newTab?.location?.href) {
         newTab.location.replace(whatsappLink);
      }
  }

  return (
    <>
      <footer
        className={`footer ${location.pathname === "/blog" ? "BlogBg" : ""}`}
        style={{
          background:
            location.pathname === "/luxury-apartments" ||
            location.pathname === "/service-villa"
              ? "#404040"
              : "",
        }}
      >
        <div className="ha_footer_box">
          <div className="ftrLogoContent">
                  <div className="ftrLogo">
                    <span className="logoXl">
                      {" "}
                      <BrandLogo />
                    </span>
                    <span className="logosm">
                    <img src={SALogoIcon} alt="SA Logo" width={32} height={28} />
                      {/* <SABrandLogo /> */}
                    </span>
                  </div>
                  <div className="ftrSummary">
                    <p>
                      {t("pages.footer.summary")}
                      {/* ServicedApartments.ae is a local marketplace that exists to
                      solve all your corporate travel needs by delivering premium
                      and bespoke serviced apartments across UAE. */}
                    </p>
                  </div>
                </div>
                <div className="footer_menu">
                <div className="ftrLinksContent">
                      <div className="ftrHeader">
                        <h5 className="aprtmentXl">
                          {t("pages.footer.hotel_apartments.hotel_apartments")}
                        </h5>
                        <h5 className="aprtmentSm">
                          {t("pages.footer.appartment")}
                        </h5>
                      </div>
                      <div className="ftrLinks">
                        <ul>
                          <li className="ftrNavItems">
                            <a href={navigateToDubai()}>{t("pages.footer.dubai")}</a>
                          </li>
                          <li
                            className="ftrNavItems"
                            // onClick={navigateToAbuDhabi}
                          >
                            <a href={navigateToAbuDhabi()}>{t("pages.footer.abu_dhabi")}</a>
                          </li>
                          <li
                            className="ftrNavItems"
                            // onClick={navigateToSpOffer}
                          >
                            <a href={navigateToSpOffer()}>
                              {t(
                                "pages.footer.hotel_apartments.special_offers"
                              )}
                            </a>
                          </li>
                          <li className="ftrNavItems" 
                          // onClick={() => {scrollToTop(); navigate(RoutePaths.ALL_AREAS.ALL_AREAS)}}
                          >
                            <a href={RoutePaths.ALL_AREAS.ALL_AREAS}>
                              {t("pages.footer.hotel_apartments.area_guide")}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="ftrLinksContent">
                      <div className="ftrHeader">
                        <h5>{t("pages.footer.company.company")}</h5>
                      </div>
                      <div className="ftrLinks">
                        <ul>
                          <li className="ftrNavItems" onClick={scrollToTop}>
                            <NavLink to={RoutePaths.ABOUT_US.ABOUT_US}>
                              {t("pages.footer.company.about_us")}
                            </NavLink>
                          </li>
                          <li className="ftrNavItems" onClick={scrollToTop}>
                            <NavLink to={RoutePaths.FOR_HOTELS.FOR_HOTELS}>
                              {t("pages.footer.company.partners")}
                            </NavLink>
                          </li>
                          <li className="ftrNavItems" onClick={scrollToTop}>
                            <NavLink to={RoutePaths.CONTACT_US.CONTACT_US}>
                              {t("pages.footer.company.contact_us")}
                            </NavLink>
                          </li>
                          <li className="ftrNavItems" onClick={scrollToTop}>
                            <NavLink to={RoutePaths.BLOG.BLOG}>
                              {t("pages.footer.company.blog")}
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="ftrLinksContent">
                      <div className="ftrHeader">
                        <h5>{t("pages.footer.links.links")}</h5>
                      </div>
                      <div className="ftrLinks">
                        <ul>
                          <li
                            className="ftrNavItems cursor-pointer policyLinks"
                            // onClick={() => {
                            //   policyLinks(RoutePaths.POLICY.PRIVACY_POLICY);
                            // }}
                          >
                            {/* <NavLink to=""> */}
                            <a href={RoutePaths.POLICY.PRIVACY_POLICY}>
                            {t("pages.footer.links.privacy_policy")}
                            </a>
                            {/* </NavLink> */}
                          </li>
                          <li
                            className="ftrNavItems cursor-pointer policyLinks"
                            // onClick={() => {
                            //   policyLinks(
                            //     RoutePaths.POLICY.TERMS_AND_CONDITIONS
                            //   );
                            // }}
                          >
                            {/* <NavLink to=""> */}
                            <a href={RoutePaths.POLICY.TERMS_AND_CONDITIONS}>
                            {t("pages.footer.links.terms_&_conditions")}
                            </a>
                            {/* </NavLink> */}
                          </li>
                          <li
                            className="ftrNavItems cursor-pointer policyLinks"
                            // onClick={() => {
                            //   policyLinks(RoutePaths.POLICY.REFUND_POLICY);
                            // }}
                          >
                            {/* <NavLink to=""> */}
                            <a href={RoutePaths.POLICY.REFUND_POLICY}>
                            {t("pages.footer.links.refund_policy")}
                            </a>
                            {/* </NavLink> */}
                          </li>
                          {/* <li className="ftrNavItems">
                            <NavLink to="">{t("pages.footer.links.lorem_ipsum")}</NavLink>
                          </li> */}
                        </ul>
                      </div>
                    </div>
                </div>
                <div className="socialConnects d-flex align-items-center flex-wrap">
                  <Link to={"https://www.instagram.com/servicedapartments.ae/"} target="_blank">
                    <span className="socialCircle">
                      <FaInstagram />{" "}
                    </span>
                  </Link>
                  <Link to={'https://api.whatsapp.com/send?phone=9710585080101'} target="_blank">
                    <span className="socialCircle">
                      <FaWhatsapp />{" "}
                    </span>
                  </Link>
                  <Link to={"https://www.facebook.com/ServicedApartments.ae/"} target="_blank">
                    <span className="socialCircle">
                      <FaFacebookF />
                    </span>
                  </Link>
                  <Link to={"https://www.youtube.com/channel/UCZL6QKAxWGbE6UELv33fUBw"} target="_blank">
                    <span className="socialCircle">
                      <FaYoutube />
                    </span>
                  </Link>
                  <Link to={"https://www.tiktok.com/@servicedapartments.ae"} target="_blank">
                    <span className="socialCircle">
                      <FaTiktok />
                    </span>
                  </Link>
                  <Link to={"https://twitter.com/UAEApartments"} target="_blank">
                    <span className="socialCircle">
                      <FaTwitter />
                    </span>
                  </Link>
                </div>
                <div className="chpaLogoSm">
                  <span className="chpaLogo">
                    {t("pages.footer.member_of")}:
                  </span>
                  <img src={ShpaLogo} alt="SHPALogo" className="member_img" />
                </div>
        </div>
        <div className="bottomFooter">
        <p className="copyrightText">
            {t("pages.footer.all_rights_reserved")} <span className="cursor-pointer text-white" onClick={() => {window.scrollTo({top: 0,left: 0,behavior: "smooth"}); navigate("/")}}>hotelapartments.com</span>
          </p>
          <p className="copyrightText authore_text">
                  {t("pages.footer.powered_by")}:{" "}
                  {/* <NavLink to=""> */}
                  <span style={{ color: "#EBEEEF" }}>
                    {t("pages.footer.smart_stay_technologies")}
                  </span>
                  {/* </NavLink> */}
                </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
