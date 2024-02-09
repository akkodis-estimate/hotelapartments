import HomeIcon from "Assets/Images/CorporateCustomersIcons/HomeIcon";
import "Pages/CorporateCustomers/corporatecustomers.css";
import { NavLink, useNavigate } from "react-router-dom";
import ModalPopup from "Components/Shared/Modal Popup/ModalPopup";
import CorporateBanner from "Assets/Images/CorporateCustomersIcons/CorporateBanner.png";
import CocaColaImg from "Assets/Images/CorporateCustomersIcons/CustomersLogo/CocaCola.png";
import GoogleImg from "Assets/Images/CorporateCustomersIcons/CustomersLogo/Google.png";
import VisaImg from "Assets/Images/CorporateCustomersIcons/CustomersLogo/Visa.png";
import JordanImg from "Assets/Images/CorporateCustomersIcons/CustomersLogo/Jordan.png";
import SmartImg from "Assets/Images/CorporateCustomersIcons/CustomersLogo/Smart.png";
import InquiryImg from "Assets/Images/CorporateCustomersIcons/FormImg.png";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useState } from "react";
import InquiryModal from "./Components/InquiryModal/InquiryModal";
import { useTranslation } from "react-i18next";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import { useEffect } from "react";
import { useRef } from "react";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import IncludeImage from "Assets/Images/ForHotelsIcons/ServiceIncludeImgOne.jpg";

const CorporateCustomers = () => {
  const { t } = useTranslation();
  const [addInquiry, setAddInquiry] = useState(false);
  const [addDrawerInquiry, setaddDrawerInquiry] = useState(false);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const navigate = useNavigate();

  const handleAddInquiryClick = () => {
    const width = window.innerWidth;
    if (width > ScreenResolutions.Width) {
      setAddInquiry(true);
    } else {
      // setaddDrawerInquiry(true);
      navigate(RoutePaths.CORPORATE_CUSTOMERS.ADD_INQUIRY);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // setIsDisplayUnder600px(window.innerWidth < 600);
      if (window.innerWidth > 600) {
        setaddDrawerInquiry(false);
      }
    };

    // Debounce the resize event to avoid excessive updates
    let timeoutId;
    const handleResizeDebounced = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", handleResizeDebounced);

    // Clean up the event listener on component unmount
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResizeDebounced);
    };
  }, []);

  const handleTestimonialSlideChange = (newIndex) => {
    setActiveTestimonialIndex(newIndex);
  };

  const autoplay = useRef(Autoplay({ delay: 2000 }));

  return (
    <div className="ha--corporateCustomer">
      <div className="ha--banner-container">
        <div
          className="bannerSection ha--contactBnrSec"
          style={{ backgroundImage: `url(${CorporateBanner})` }}
        >
          <div className="ha--bannerSection-breadcrumb">
            <div className="ha--appBreadCrumb contactBreadCrumb">
              <ul className="ha--breadcrumbList breadcrumbList">
                <li
                  className="breadcrumbItem cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  {/* <NavLink to=""> */}
                  <HomeIcon />
                  {/* </NavLink> */}
                </li>
                <li className="breadcrumbItem">
                  {/* <NavLink to=""> */}
                  {t("pages.corporate_customers.title")}
                  {/* </NavLink> */}
                </li>
              </ul>
            </div>
            <div className="sectionTitleDesc">
              <h2>{t("pages.corporate_customers.header_title")}</h2>
              <p>
              {t("pages.corporate_customers.header_subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="ha--AboutmainContainer">
        <div className="aboutCustomers ha--AboutCustomer">
          <div className="ha--AboutContainer">
            <div className="sectionTitleDesc text-center">
              <h2>{t("pages.corporate_customers.about_customers")}</h2>
              <p>{t("pages.corporate_customers.about_us_text")}</p>
            </div>

            <div className="ha--CustomerLogo">
              <div className="customersLogo">
                <div className="slider">
                  <div className="slideTrack">
                    <div className="slide">
                      <img src={CocaColaImg} alt="LogoOne" />
                    </div>
                    <div className="slide">
                      <img src={GoogleImg} alt="LogoTwo" />
                    </div>
                    <div className="slide">
                      <img src={VisaImg} alt="LogoThree" />
                    </div>
                    <div className="slide">
                      <img src={JordanImg} alt="LogoFour" />
                    </div>
                    <div className="slide">
                      <img src={SmartImg} alt="LogoFive" />
                    </div>
                  </div>
                </div>
                <div className="row sliderLg">
                  <div className="col">
                    <img src={CocaColaImg} alt="logo" className="w-100" />
                  </div>
                  <div className="col">
                    <img src={GoogleImg} alt="logo" className="w-100" />
                  </div>
                  <div className="col">
                    <img src={VisaImg} alt="logo" className="w-100" />
                  </div>
                  <div className="col">
                    <img src={JordanImg} alt="logo" className="w-100" />
                  </div>
                  <div className="col">
                    <img src={SmartImg} alt="logo" className="w-100" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose HotelApartments Section */}

        <div className="ha--WhyHotelApart ha--CstrmInquiryContainer">
          <div className="ha--WhyHotelApartContainer">
            <div className="sectionTitleDesc text-center">
              <h2>
                {t("pages.corporate_customers.why_choose")} <br />
                {t("pages.corporate_customers.for_business")}
              </h2>
            </div>
            <div className="ha--WhyHotelApartContent">
              <div className="ha--WhyHotelApartDesc">
                <p>
                {t("pages.corporate_customers.for_business_1")}
                </p>
                <p>
                {t("pages.corporate_customers.for_business_2")}
                </p>
                <p>
                {t("pages.corporate_customers.for_business_3")}
                </p>
              </div>
              <div className="ha--WhyHotelApartImg">
                <img src={IncludeImage} alt="Why Hotel Apartment" />
              </div>
            </div>
          </div>
        </div>

        {/* End */}

        <div className="ha--CstrmInquiryContainer inquiryContainer">
          <div className="ha--StepsInquiryContainer">
            <div className="inquirySteps">
              <div className="ha--InquirySteps">
                <img src={InquiryImg} alt="InquiryForm" className="w-100" />
              </div>

              <div className="stepsContent">
                <div className="sectionTitleDesc">
                  <h2>{t("pages.corporate_customers.how_to")}</h2>
                </div>
                <div className="numberSteps">
                  <div className="stepsLayout">
                    <div className="ha--StepsLayout">
                      <div className="stepsIcon stepOneIcon">
                        <span className="bg-black text-white">1</span>
                      </div>
                      <div className="stepsDetail">
                        <h5>{t("pages.corporate_customers.sign_up")}</h5>
                        <p>{t("pages.corporate_customers.signup_text")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="stepsLayout">
                    <div className="d-flex gap-3">
                      <div className="stepsIcon stepLineCust">
                        <span>2</span>
                      </div>
                      <div className="stepsDetail">
                        <h5>{t("pages.corporate_customers.get_verified")}</h5>
                        <p>
                        {t("pages.corporate_customers.step2")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="stepsLayout ">
                    <div className="ha--StepsLayout">
                      <div className="stepsIcon stepLineCust">
                        <span>3</span>
                      </div>
                      <div className="stepsDetail">
                        <h5>{t("pages.corporate_customers.step3")}</h5>
                        <p>
                        {t("pages.corporate_customers.step3_text")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="stepsLayout">
                    <div className="ha--StepsLayout">
                      <div className="stepsIcon">
                        <span>4</span>
                      </div>
                      <div className="stepsDetail">
                        <h5>{t("pages.corporate_customers.step4")}</h5>
                        <p>
                        {t("pages.corporate_customers.step4_text")}
                        </p>
                        <p>
                        {t("pages.corporate_customers.step4_text1")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="animateBtn appMainBtn">
                  <button
                    type="button"
                    className="appBtn bg-black"
                    onClick={handleAddInquiryClick}
                  >
                    <span> {t("pages.corporate_customers.enquire_now")}</span>
                  </button>
                  {/* <button
                    type="button"
                    className="appBtn bg-black"
                    onClick={handleAddInquiryClick}
                  >
                    {t("pages.corporate_customers.enquire_now")}
                    <span className="btnIcon">
                      <BsArrowRight />
                    </span>
                  </button> */}
                  <ModalPopup
                    show={addInquiry}
                    dialogClassName="applicationModal"
                  >
                    <InquiryModal
                      isfromMobile={false}
                      setAddInquiry={setAddInquiry}
                    />
                  </ModalPopup>
                  {/* <MobileDrawer
                    openDrawer={addDrawerInquiry}
                    setopenDrawer={setaddDrawerInquiry}
                  >
                    <InquiryModal isfromMobile={true} />
                  </MobileDrawer> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="ha--TestimonialSec inquiryContainer  testimonialSec">
          <div className="ha--TestimonialSecContainer">
            <div className="sectionTitleDesc text-center">
              <h2>{t("pages.corporate_customers.happy_clients")}</h2>
              <p>{t("pages.corporate_customers.corporate_clients")}</p>
            </div>

            <div className="ha--TestiMonialSlider testimonialSm cprtSlider">
              <Carousel
                slideSize="33.33333333%"
                style={{ flex: 1 }}
                slideGap="md"
                controlSize={27}
                loop
                onSlideChange={handleTestimonialSlideChange}
                slidesToScroll={1}
                nextControlIcon={<BsArrowRight size={25} color="#767760" />}
                previousControlIcon={<BsArrowLeft size={25} color="#767760" />} 
              >
                {/* <Carousel.Slide
                  className={`fade-carousel-slide${
                    activeTestimonialIndex === 0 ? " active" : ""
                  }`}
                >
                  <div
                    className={`testimonialLayout${
                      activeTestimonialIndex === 0 ? " active" : ""
                    }`}
                  >
                    <div className="testimonialPara">
                      <p>{t("pages.experience.testimonal1_text")}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <img src={JordanImg} alt="Testimonial Logo" />
                      <span className="testimonialName">
                        John R.
                      </span>
                    </div>
                  </div>
                </Carousel.Slide> */}

                {/* <Carousel.Slide
                  className={`fade-carousel-slide${
                    activeTestimonialIndex === 1 ? " active" : ""
                  }`}
                >
                  <div
                    className={`testimonialLayout${
                      activeTestimonialIndex === 1 ? " active" : ""
                    }`}
                  >
                    <div className="testimonialPara">
                      
                      <p>{t("pages.experience.testimonal2_text")}</p>
                      
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <img src={JordanImg} alt="Testimonial Logo" />
                      <span className="testimonialName">
                        Linda H.
                      </span>
                    </div>
                  </div>
                </Carousel.Slide> */}

                <Carousel.Slide
                  className={`fade-carousel-slide${
                    activeTestimonialIndex === 0 ? " active" : ""
                  }`}
                >
                  <div
                    className={`testimonialLayout${
                      activeTestimonialIndex === 0 ? " active" : ""
                    }`}
                  >
                    <div className="testimonialPara">
                      
                      <p>{t("pages.experience.testimonal3_text")}</p>
                      
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      {/* <img src={JordanImg} alt="Testimonial Logo" /> */}
                      <span className="testimonialName">
                      David and Sarah P.
                      </span>
                    </div>
                  </div>
                </Carousel.Slide>

                <Carousel.Slide
                  className={`fade-carousel-slide${
                    activeTestimonialIndex === 1 ? " active" : ""
                  }`}
                >
                  <div
                    className={`testimonialLayout${
                      activeTestimonialIndex === 1 ? " active" : ""
                    }`}
                  >
                    <div className="testimonialPara">
                        <p>{t("pages.experience.testimonal4_text")}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      {/* <img src={JordanImg} alt="Testimonial Logo" /> */}
                      <span className="testimonialName">
                      J. Holder
                      </span>
                    </div>
                  </div>
                </Carousel.Slide>

                <Carousel.Slide
                  className={`fade-carousel-slide${
                    activeTestimonialIndex === 2 ? " active" : ""
                  }`}
                >
                  <div
                    className={`testimonialLayout${
                      activeTestimonialIndex === 2 ? " active" : ""
                    }`}
                  >
                    <div className="testimonialPara">
                      <p>{t("pages.experience.testimonal5_text")}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      {/* <img src={JordanImg} alt="Testimonial Logo" /> */}
                      <span className="testimonialName">
                        Anonymous
                      </span>
                    </div>
                  </div>
                </Carousel.Slide>

                <Carousel.Slide
                  className={`fade-carousel-slide${
                    activeTestimonialIndex === 3 ? " active" : ""
                  }`}
                >
                  <div
                    className={`testimonialLayout${
                      activeTestimonialIndex === 3 ? " active" : ""
                    }`}
                  >
                    <div className="testimonialPara">
                      <p>{t("pages.experience.testimonal6_text")}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      {/* <img src={JordanImg} alt="Testimonial Logo" /> */}
                      <span className="testimonialName">
                        Anonymous
                      </span>
                    </div>
                  </div>
                </Carousel.Slide>

                <Carousel.Slide
                  className={`fade-carousel-slide${
                    activeTestimonialIndex === 4 ? " active" : ""
                  }`}
                >
                  <div
                    className={`testimonialLayout${
                      activeTestimonialIndex === 4 ? " active" : ""
                    }`}
                  >
                    <div className="testimonialPara">
                      <p>{t("pages.experience.testimonal7_text")}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      {/* <img src={JordanImg} alt="Testimonial Logo" /> */}
                      <span className="testimonialName">
                        Rozeena Khilya, Senior Executive Assistant, Brunswick Group
                      </span>
                    </div>
                  </div>
                </Carousel.Slide>

                <Carousel.Slide
                  className={`fade-carousel-slide${
                    activeTestimonialIndex === 5 ? " active" : ""
                  }`}
                >
                  <div
                    className={`testimonialLayout${
                      activeTestimonialIndex === 5 ? " active" : ""
                    }`}
                  >
                    <div className="testimonialPara">
                      <p>{t("pages.experience.testimonal8_text")}</p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      {/* <img src={JordanImg} alt="Testimonial Logo" /> */}
                      <span className="testimonialName">
                        Ahmet Kurum , CEO, Kurum Group
                      </span>
                    </div>
                  </div>
                </Carousel.Slide>

                {/* ...other slides */}
              </Carousel>

              {/* <div className="ha--TestimonialPagination">
                <div className="ha--TestimonialPaginationItesm">
                  <div className="ha--TestimonialBtn">
                    <BsArrowLeft size={32} color="#767760" onClick={onPrevClick} />
                  </div>
                  <div className="ha--TestimonialActiveSlide">
                    {activeTestimonialIndex + 1}/6
                  </div>
                  <div className="ha--TestimonialBtn" onClick={onNextClick}>
                    <BsArrowRight size={32} color="#767760" />
                  </div>
                </div>
              </div> */}
              <div className="sliderPagination">
                <span>{activeTestimonialIndex + 1} / 6</span>
              </div>
            </div>
          </div>
          {/* <div className="row">
            <div className="col-lg-12 mb-5">
              <div className="sectionTitleDesc text-center">
                <h2>{t("pages.corporate_customers.happy_clients")}</h2>
                <p>{t("pages.corporate_customers.corporate_clients")}</p>
              </div>
            </div>
            <div className="col-lg-12 pt-5 p-smSA-0">
              <div className="row testimonialSm corporateTestimonial">
                <div className="col-lg-4">
                  <div className="testimonialLayout">
                    <div className="testimonialPara">
                      <p>
                        Lorem ipsum dolor sit amet consectetur. A diam nunc
                        morbi eget consectetur congue odio curabitur. Donec nam
                        leo id nunc
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <img src={JordanImg} alt="Testimonial Logo" />
                      <span className="testimonialName">Leslie Alexander</span>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="testimonialLayout active">
                    <div className="testimonialPara">
                      <p>
                        Lorem ipsum dolor sit amet consectetur. A diam nunc
                        morbi eget consectetur congue odio curabitur. Donec nam
                        leo id nunc
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <img src={JordanImg} alt="Testimonial Logo" />
                      <span className="testimonialName">Leslie Alexander</span>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="testimonialLayout">
                    <div className="testimonialPara">
                      <p>
                        Lorem ipsum dolor sit amet consectetur. A diam nunc
                        morbi eget consectetur congue odio curabitur. Donec nam
                        leo id nunc
                      </p>
                    </div>
                    <div className="d-flex align-items-center gap-3 mt-3">
                      <img src={JordanImg} alt="Testimonial Logo" />
                      <span className="testimonialName">Leslie Alexander</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CorporateCustomers;
