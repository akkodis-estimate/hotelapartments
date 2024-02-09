import "Pages/AboutUs/aboutus.css";
import { useTranslation } from "react-i18next";
import ForHotelBanner from "Assets/Images/ForHotelsIcons/HotelBanner.png";
import { Navigate } from "react-router-dom";
import { FaHotel, FaHome, FaSmileBeam } from "react-icons/fa";
import HomeIcon from "Assets/Images/ForHotelsIcons/HomeIcon";
import GrowthChartImg from "Assets/Images/growth-chart-sa.png";

const AboutUs = () => {
  const { t } = useTranslation();
  return (
    <>
      <div class="ha--corporateCustomer ha--experienceUI">
        <div className="ha--banner-container">
          <div
            className="bannerSection ha--contactBnrSec"
            style={{ backgroundImage: `url(${ForHotelBanner})` }}
          >
            <div className="ha--bannerSection-breadcrumb">
              <div className="ha--appBreadCrumb contactBreadCrumb">
                <ul className="ha--breadcrumbList breadcrumbList">
                  <li
                    className="breadcrumbItem cursor-pointer"
                    onClick={() => Navigate("/")}
                  >
                    {/* <NavLink to="/"> */}
                    <HomeIcon />
                    {/* </NavLink> */}
                  </li>
                  <li className="breadcrumbItem">
                    {/* <NavLink to=""> */}
                    {t("pages.aboutus.title")}
                    {/* </NavLink> */}
                  </li>
                </ul>
              </div>
              <div className="sectionTitleDesc">
                <h2>{t("pages.aboutus.banner_title")}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="aboutPageContainer">
          <div className="container">
            <div className="aboutPageTitle"></div>
          </div>
        </div>
      </div>

      <div className="aboutPageContent">
        <div className="container">
          <div className="allAboutDetails">
            <div className="aboutContentTitle ">
              <h2>{t("pages.aboutus.para1_title")}</h2>
              <p>{t("pages.aboutus.para1")}</p>
            </div>

            <div className="aboutContentTitle ">
              <h2>{t("pages.aboutus.para2_title")}</h2>
              <p>{t("pages.aboutus.para2")}</p>
            </div>

            <div className="aboutContentTitle ">
              <h2>{t("pages.aboutus.para3_title")}</h2>
              <p>{t("pages.aboutus.para3")}</p>
            </div>

            <div className="aboutContentTitle ">
              <h2>{t("pages.aboutus.para4_title")}</h2>
              <p>{t("pages.aboutus.para4")}</p>
              <p>{t("pages.aboutus.para4_1")}</p>
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <div className="aboutContentTitle growthSection w-75">
                <h2>{t("pages.aboutus.para5_title")}</h2>
                <p>{t("pages.aboutus.para5")}</p>
              </div>
              <div>
                <img src={GrowthChartImg} alt="GrowthChartImg" className="w-100" />
              </div>
            </div>
          </div>
          <div className="aboutCounterSec">
            <div className="aboutCounterSecBlurbs">
              <div className="aboutCounterBlurb">
                <div className="counterBlurbIcon">
                  <FaHome />
                </div>
                <div className="counterBlurbNumber">1,624+ </div>
                <div className="counterBlurbTitle">
                  {t("pages.aboutus.sa_title")}
                </div>
              </div>

              <div className="aboutCounterBlurb">
                <div className="counterBlurbIcon">
                  <FaHotel />
                </div>
                <div className="counterBlurbNumber">300+ </div>
                <div className="counterBlurbTitle">
                  {t("pages.aboutus.diff_hotels")}
                </div>
              </div>

              <div className="aboutCounterBlurb">
                <div className="counterBlurbIcon">
                  <FaSmileBeam />
                </div>
                <div className="counterBlurbNumber">5000+ </div>
                <div className="counterBlurbTitle">
                  {t("pages.aboutus.satisfied_customer")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUs;
