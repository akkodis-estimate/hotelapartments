import HomeIcon from "Assets/Images/ForHotelsIcons/HomeIcon";
import ForHotelBanner from "Assets/Images/ForHotelsIcons/HotelBanner.png";
import SeriveImg01 from "Assets/Images/ExprienceIcons/service-img-01.png";
import SeriveImg02 from "Assets/Images/ExprienceIcons/service-img-02.png";
import SeriveImg03 from "Assets/Images/ExprienceIcons/service-img-03.png";
import SeriveImg04 from "Assets/Images/ExprienceIcons/service-img-04.png";
import SeriveImg05 from "Assets/Images/ExprienceIcons/service-img-05.png";
import SeriveImg07 from "Assets/Images/ExprienceIcons/service-img-07.png";
import SeriveImg08 from "Assets/Images/ExprienceIcons/service-img-08.png";
import SeriveImg09 from "Assets/Images/ExprienceIcons/service-img-09.png";
import "Pages/Experience/Experience.css";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useState, useRef } from "react";
import HomeFindingicon from "Assets/Images/ExprienceIcons/HomeFindingicon";
import SchoolSearchIcon from "Assets/Images/ExprienceIcons/SchoolSearchIcon";
import SettingIcon from "Assets/Images/ExprienceIcons/SettingIcon";
import MovingPets from "Assets/Images/ExprienceIcons/MovingPets";
import Consiergeicon from "Assets/Images/ExprienceIcons/Consiergeicon";
import InterCulturalicon from "Assets/Images/ExprienceIcons/InterCulturalicon";
import VisualImigrationIcon from "Assets/Images/ExprienceIcons/VisualImigrationIcon";
import JordanImg from "Assets/Images/CorporateCustomersIcons/CustomersLogo/Jordan.png";
import { useTranslation } from "react-i18next";

const Experience = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);
  const navigate = useNavigate();

  const handleSlideChange = (newIndex) => {
    setActiveIndex(newIndex);
  };

  const handleTestimonialSlideChange = (newIndex) => {
    setActiveTestimonialIndex(newIndex);
  };

  const autoplay = useRef(Autoplay({ delay: 2000 }));

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
                    onClick={() => navigate("/")}
                  >
                    {/* <NavLink to="/"> */}
                    <HomeIcon />
                    {/* </NavLink> */}
                  </li>
                  <li className="breadcrumbItem">
                    {/* <NavLink to=""> */}
                    {t("pages.experience.title")}
                    {/* </NavLink> */}
                  </li>
                </ul>
              </div>
              <div className="sectionTitleDesc">
                <h2>{t("pages.experience.header_title")}</h2>
                <p>{t("pages.experience.header_subtitle")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="ha--contact-main-container">
          <div className="ha--experienceContainer includedService">
            <div className="hs--ExperienceServiceSlider">
              <div className="sectionTitleDesc text-center">
                <h2>{t("pages.experience.our_service")}</h2>
                <p>{t("pages.experience.our_service_subtitle")}</p>
              </div>
              <div className="servicesSlider">
                <Carousel
                  loop
                  mx="auto"
                  
                  nextControlIcon={<BsArrowRight size={25} color="red" />}
                  previousControlIcon={<BsArrowLeft size={25} color="red" />}
                  slideSize="87%"
                  align="start"
                  slideGap="md"
                  controlsOffset="xl"
                  dragFree
                  onSlideChange={handleSlideChange}
                >
                  <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 0 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg01}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <HomeFindingicon />
                        </div>
                        <div className="serviceInfo">
                          <h4>{t("pages.experience.area_orientation")}</h4>
                          <p>{t("pages.experience.area_orientation_text1")}</p>

                          {/* <p> {t("pages.experience.area_orientation_text2")}</p> */}
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>

                  <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 1 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg02}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <HomeFindingicon />
                        </div>
                        <div className="serviceInfo">
                          <h4>{t("pages.experience.home_search")}</h4>
                          <p>{t("pages.experience.home_search_text1")}</p>

                          {/* <p> {t("pages.experience.home_search_text2")}</p> */}
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>

                  <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 2 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg03}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <SchoolSearchIcon />
                        </div>
                        <div className="serviceInfo">
                          <h4>{t("pages.experience.school_search")}</h4>
                          <p>{t("pages.experience.school_search_text1")}</p>

                          {/* <p>{t("pages.experience.school_search_text2")}</p> */}
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>

                  <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 3 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg04}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <SettingIcon />
                        </div>
                        <div className="serviceInfo">
                          <h4>{t("pages.experience.settling_in")}</h4>
                          <p>{t("pages.experience.settling_in_text1")}</p>

                          {/* <p>{t("pages.experience.settling_in_text2")}</p> */}
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>

                  <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 4 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg05}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <MovingPets />
                        </div>
                        <div className="serviceInfo">
                          <h4>{t("pages.experience.moving_with_pets")}</h4>
                          <p>{t("pages.experience.moving_with_pets_text1")}</p>

                          {/* <p>{t("pages.experience.moving_with_pets_text2")}</p> */}
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>

                  {/* <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 5 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg06}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <DepartureIcon />
                        </div>
                        <div className="serviceInfo">
                          <h4>{t("pages.experience.departure_services")}</h4>
                          <p>
                            {t("pages.experience.departure_services_text1")}
                          </p>

                          <p>
                            
                          </p>
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide> */}

                  <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 5 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg07}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <Consiergeicon />
                        </div>
                        <div className="serviceInfo">
                          <h4>{t("pages.experience.concierge_services")}</h4>
                          <p>
                            {t("pages.experience.concierge_services_text1")}
                          </p>

                          <p>
                            {/* {t("pages.experience.concierge_services_text2")} */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>

                  <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 6 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg08}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <InterCulturalicon />
                        </div>
                        <div className="serviceInfo">
                          <h4>
                            {t(
                              "pages.experience.intercultural_solutions_training"
                            )}
                          </h4>
                          <p>{t("pages.experience.icst_text1")}</p>

                          {/* <p>{t("pages.experience.icst_text2")}</p> */}
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>

                  <Carousel.Slide
                    className={`fade-carousel-slide${
                      activeIndex === 7 ? " active" : ""
                    }`}
                  >
                    <div className="experienceServiceItem d-flex gap-4">
                      <div className="serviceImageitem">
                        <img
                          src={SeriveImg09}
                          className="w-100"
                          alt="First slide"
                        />
                      </div>
                      <div className="serviceContent">
                        <div className="serviceIcon">
                          <VisualImigrationIcon />
                        </div>
                        <div className="serviceInfo">
                          <h4>{t("pages.experience.visual_immigration")}</h4>
                          <p>
                            {t("pages.experience.visual_immigration_text1")}
                          </p>

                          <p>
                            {/* {t("pages.experience.visual_immigration_text2")} */}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>

                  {/* ...other slides */}
                </Carousel>

                <div className="sliderPagination">
                  <span>{activeIndex + 1} / 8</span>
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
                    // withControls={false}
                    onSlideChange={handleTestimonialSlideChange}
                    slidesToScroll={1}
                    nextControlIcon={<BsArrowRight size={25} color="#767760" />}
                    previousControlIcon={
                      <BsArrowLeft size={25} color="#767760" />
                    }

                    // plugins={[autoplay.current]}
                    // onMouseEnter={autoplay.current.stop}
                    // onMouseLeave={autoplay.current.reset}
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
            </div>

            {/* <div className="ha">
              <div className="col-lg-12 mb-5">
                <div className="sectionTitleDesc text-center">
                  <h2>{t("pages.corporate_customers.happy_clients")}</h2>
                  <p>{t("pages.corporate_customers.corporate_clients")}</p>
                </div>
              </div>
              <div className="col-lg-12 p-smSA-0">
                <div className="row testimonialSm">
                  <div className="col-lg-12">
                    <Carousel
                      slideSize="33.33333333%"
                      height="100%"
                      style={{ flex: 1 }}
                      slideGap="md"
                      controlSize={27}
                      loop
                      withControls={false}
                      onSlideChange={handleTestimonialSlideChange}
                      slidesToScroll={3}
                      plugins={[autoplay.current]}
                      onMouseEnter={autoplay.current.stop}
                      onMouseLeave={autoplay.current.reset}
                    >
                      <Carousel.Slide
                        className={`fade-carousel-slide${
                          activeTestimonialIndex === 0 ? " active" : ""
                        }`}
                      >
                        <div className="testimonialLayout">
                          <div className="testimonialPara">
                            <p>{t("pages.experience.testimonal1_text")}</p>
                          </div>
                          <div className="d-flex align-items-center gap-3 mt-3">
                            <img src={JordanImg} alt="Testimonial Logo" />
                            <span className="testimonialName">
                              {t("pages.experience.testimonal_name1")}
                            </span>
                          </div>
                        </div>
                      </Carousel.Slide>

                      <Carousel.Slide
                        className={`fade-carousel-slide${
                          activeTestimonialIndex === 1 ? " active" : ""
                        }`}
                      >
                        <div className="testimonialLayout active">
                          <div className="testimonialPara">
                            <p>{t("pages.experience.testimonal1_text")}</p>
                          </div>
                          <div className="d-flex align-items-center gap-3 mt-3">
                            <img src={JordanImg} alt="Testimonial Logo" />
                            <span className="testimonialName">
                              {t("pages.experience.testimonal_name1")}
                            </span>
                          </div>
                        </div>
                      </Carousel.Slide>

                      <Carousel.Slide
                        className={`fade-carousel-slide${
                          activeTestimonialIndex === 2 ? " active" : ""
                        }`}
                      >
                        <div className="testimonialLayout">
                          <div className="testimonialPara">
                            <p>{t("pages.experience.testimonal1_text")}</p>
                          </div>
                          <div className="d-flex align-items-center gap-3 mt-3">
                            <img src={JordanImg} alt="Testimonial Logo" />
                            <span className="testimonialName">
                              {t("pages.experience.testimonal_name1")}
                            </span>
                          </div>
                        </div>
                      </Carousel.Slide>

                      <Carousel.Slide
                        className={`fade-carousel-slide${
                          activeTestimonialIndex === 3 ? " active" : ""
                        }`}
                      >
                        <div className="testimonialLayout">
                          <div className="testimonialPara">
                            <p>{t("pages.experience.testimonal1_text")}</p>
                          </div>
                          <div className="d-flex align-items-center gap-3 mt-3">
                            <img src={JordanImg} alt="Testimonial Logo" />
                            <span className="testimonialName">
                              {t("pages.experience.testimonal_name1")}
                            </span>
                          </div>
                        </div>
                      </Carousel.Slide>

                      <Carousel.Slide
                        className={`fade-carousel-slide${
                          activeTestimonialIndex === 4 ? " active" : ""
                        }`}
                      >
                        <div className="testimonialLayout active">
                          <div className="testimonialPara">
                            <p>{t("pages.experience.testimonal1_text")}</p>
                          </div>
                          <div className="d-flex align-items-center gap-3 mt-3">
                            <img src={JordanImg} alt="Testimonial Logo" />
                            <span className="testimonialName">
                              {t("pages.experience.testimonal_name1")}
                            </span>
                          </div>
                        </div>
                      </Carousel.Slide>
                      <Carousel.Slide
                        className={`fade-carousel-slide${
                          activeTestimonialIndex === 5 ? " active" : ""
                        }`}
                      >
                        <div className="testimonialLayout">
                          <div className="testimonialPara">
                            <p>{t("pages.experience.testimonal1_text")}</p>
                          </div>
                          <div className="d-flex align-items-center gap-3 mt-3">
                            <img src={JordanImg} alt="Testimonial Logo" />
                            <span className="testimonialName">
                              {t("pages.experience.testimonal_name1")}
                            </span>
                          </div>
                        </div>
                      </Carousel.Slide>

                      
                    </Carousel>
                  </div>
                 
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Experience;
