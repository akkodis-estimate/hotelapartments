import { Carousel } from "@mantine/carousel";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RoutePaths } from "Constants/Constants";
import { SetDynamicEndpoint } from "Helpers/commonMethodHelper";

import HomeIcon from "Assets/Images/BlogIcons/HomeIcon";
import BlogImg3 from "Assets/Images/BlogIcons/Blog3.png";
import DubaiImg from "Assets/Images/HomeIcons/AreasImages/Dubai.png";
import PostCard from "./Components/PostCard/PostCard";
import FUserIcon from "Assets/Images/FeaturedPropertiesIcons/FUserIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import FShower from "Assets/Images/FeaturedPropertiesIcons/FShower";
import maskingActions from "reducers/masking/masking.actions";
import blogService from "Services/BlogService";
import "Pages/Blog/BlogListing/bloglisting.css";
import { toast } from "react-toastify";

const BlogListing = () => {
  var list_params = {
    // Para for the pagination
    page_number: 1,
    page_size: 10,
    sort_column: "",
    sort_direction: "",
    filters: "",
    search_text: "",
    status: 1,
  };

  var metaData = {
    // para for pagination
    page: 1,
    page_size: 10,
    total_results: 0,
    total_page_num: 0,
    total_blogs: 0,
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  var state_obj = { ...state };

  const { t } = useTranslation();

  const [myState, setMyState] = useState(state_obj);
  const [listParams, setlistParams] = useState(list_params);
  const [meta, setMetaData] = useState(metaData);
  const [categories, setCategories] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [blogListing, setBlogListing] = useState([]);
  const [isUpdate, setisUpdate] = useState(false);
  const [firstThreeRecords, setFirstThreeRecords] = useState([]);
  const [lastRecords, setLastRecords] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const { language, currency_code } = useSelector((state) => state.language);

  const handleResize = debounce(() => {
    // Code to handle the resize event
  }, 200); // Set the debounce delay to 200 milliseconds

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    const carouselElement = document.querySelector(".blogPostSlider");
    resizeObserver.observe(carouselElement);

    return () => {
      resizeObserver.unobserve(carouselElement);
      resizeObserver.disconnect();
    };
  }, []);

  // call this function for get the api data
  const getBlogListApi = () => {
    var params = { ...listParams };
    dispatch(maskingActions.showMasking());
    blogService
      .all_blogs_list(params)
      .then((res) => {
        setMetaData(res.data.blogs.meta);
        setCategories(res.data.blogs.category_list);
        setBlogListing(res.data.blogs.property_listing);

        setBlogList(
          res.data.blogs.list !== null || res.data.blogs.list
            ? res.data.blogs.list
            : []
        );

        const firstThreeElements = res.data.blogs.list.slice(0, 3);
        const lastElements = res.data.blogs.list;

        setFirstThreeRecords(firstThreeElements);
        setLastRecords(lastElements);
      })
      .finally(() => {
        dispatch(maskingActions.hideMasking());
      });
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    const carouselElement = document.querySelector(".blogPostSlider");
    resizeObserver.observe(carouselElement);

    return () => {
      resizeObserver.unobserve(carouselElement);
      resizeObserver.disconnect();
    };
  }, []);

  const navigatePropertyDetail = (sid) => {
    if (sid)
      // navigate(
        return `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`
      // );
    else return (RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
  };

  // this function redirect to the Blog Page and Get all Blog List
  const navigateBlogHomePage = () => {
    navigate("/blog");
  };

  // it will call when any filter or listParams has Change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const blog_list = setTimeout(() => {
      getBlogListApi();
    }, 500);

    return () => {
      clearTimeout(blog_list);
    };
  }, [listParams, language, currency_code]);

  useEffect(() => {
    var blog_list;

    if (myState) {
      onFilter(myState.listParams);

      blog_list = setTimeout(() => {
        getBlogListApi();
      }, 500);
    }
    return () => {
      clearTimeout(blog_list);
    };
  }, []);

  // for add the filter  for Category
  const ClickCategoryFilter = (item) => {
    var filters = [];
    if (item) {
      var obj = { key: "blog_category_title", value: item, condition: "=" };
      filters?.push(obj);
    } else {
      filters = filters.filter((x) => x.value !== item);
    }
    // setFilterData(filters);

    onFilter(filters);
  };

  const onFilter = (filters_data) => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    setlistParams((prevState) => {
      return {
        ...prevState,
        filters: filters_data?.length > 0 ? JSON.stringify(filters_data) : "",
      };
    });
  };
  const navigateBlogPost = (blog_sid) => {
    if (blog_sid !== null && blog_sid !== "" && blog_sid !== undefined) {
      // navigate("/blog/blog-detail/", { blog_sid }, { state: { sid: blog_sid ? blog_sid : "" } });

      navigate(
        `${SetDynamicEndpoint(RoutePaths.BLOG.BLOG_Detail, [blog_sid])}`,
        { state: { blog_sid: blog_sid ? blog_sid : "" } }
      );
      // window.location.reload();
    }
  };

  return (
    <div className="blogContainer">
      <div className="container ha--blogHeaderTitle">
        <div className="row">
          <div className="blogBreadCrumbUI ha--blogBreadCrumb">
            <div className=" appBreadCrumb blogBreadcrumb">
              <ul className="breadcrumbList d-flex align-items-center">
                <li
                  className="breadcrumbItem cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  {/* <NavLink onClick={() => navigateBlogHomePage()} to="/blog"> */}
                  <HomeIcon />
                  {/* </NavLink> */}
                </li>
                <li className="breadcrumbItem">
                  {/* <NavLink onClick={navigateBlogHomePage} to="/blog"> */}
                  {t("pages.blogs.title")}
                  {/* </NavLink> */}
                </li>
              </ul>
            </div>
          </div>
          <div className="ha--BlogPageTitle">
            <div className="blogTitle text-center">
              <h1>{t("pages.blogs.title")}</h1>
              <p>{t("pages.blogs.subtitle")}</p>
              <span className="latestArticle">
                {t("pages.blogs.latest_articles")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="ha--BlogSliderDes">
        <div className="blogPostSlider">
          <Carousel
            slideSize="70%"
            slideGap="md"
            controlsOffset="md"
            loop
            dragFree
            withControls={false}
            withIndicators
            height={485}
            breakpoints={[
              { maxWidth: "md", slideSize: "50%" },
              { maxWidth: "sm", slideSize: "100%", slideGap: 0 },
            ]}
          >
            {firstThreeRecords &&
              firstThreeRecords.map((item, index) => {
                return (
                  <Carousel.Slide>
                    <div className="position-relative h-100">
                      <img
                        src={item.blog_image ? item.blog_image : BlogImg3}
                        alt="postImg"
                        className="w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                      <div
                        className="sliderPostContent"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {/* <NavLink to=""> */}
                        <p>{item.blog_title}</p>
                        {/* </NavLink> */}
                        <div className="animateBtn appMainBtn blogLoadBtn mt-4">
                          {/* <NavLink className="d-inline-flex "

                          //  to={{ pathname: '/blog/blog-detail' }}
                          //  state={{ sid: item.blog_sid && item.blog_sid ? item.blog_sid : "" }}
                          > */}

                          <button
                            type="button"
                            className="appBtn"
                            // onClick={() => {
                            //   navigateBlogPost(item.blog_sid);
                            // }}
                          >
                            <a
                              href={`${SetDynamicEndpoint(
                                RoutePaths.BLOG.BLOG_Detail,
                                [item?.blog_sid]
                              )}`}
                            >
                              <span>{t("pages.all_areas.load_more")}</span>
                            </a>
                          </button>

                          {/* <button type="button" className="appBtn"
                              onClick={() => { navigateBlogPost(item.blog_sid) }}
                            >
                              {t("pages.all_areas.load_more")}
                              <span className="btnIcon">
                                <BsArrowRight />
                              </span>
                            </button> */}
                          {/* </NavLink> */}
                        </div>
                      </div>
                    </div>
                  </Carousel.Slide>
                );
              })}
          </Carousel>
        </div>
      </div>
      <div className="haa-mainBlogContainer">
        <div className="haa-PostListingBlog postListing">
          <div className="blogArticleMain">
            <div className="blogArticleCol">
              <div className="row flex-wrap postListingSm">
                {blogList &&
                  blogList.map((item, index) => {
                    return (
                      <div className="col-lg-6 position-relative">
                        <PostCard
                          blogSid={item.blog_sid}
                          img={item.blog_image}
                          blogTitle={item.blog_title}
                          createdDate={item.created_date}
                          item={item}
                        />
                      </div>
                    );
                  })}

                {meta && meta.total_blogs > 10 && (
                  <>
                    {meta && meta.page !== meta.total_page_num && (
                      <div className="ha--BlogLoadMoreBtn">
                        <div className="animateBtn ">
                          <button
                            type="button"
                            className="appBtn appMainBtn"
                            onClick={() => {
                              setlistParams((prevState) => {
                                var newListParams = {
                                  ...prevState,
                                  page_size: prevState.page_size + 10,
                                };
                                //getBlogList(newListParams);
                                return newListParams;
                              });
                            }}
                          >
                            <span> {t("pages.all_areas.load_more")}</span>
                            {!(meta
                              ? meta.page === meta.total_page_num
                              : true) && <span></span>}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="blogArticleCol">
              <div className="ha--BlogAside blogAsideSm">
                <div className="ha--BlogAsideMain  p-0">
                  {blogListing && (
                    <div className="blogSidebar bg-white">
                      <h5>{t("pages.blogs.listings")}</h5>

                      {blogListing &&
                        blogListing.map((item, index) => {
                          return (
                            <>
                              <div className="poropertyListing">
                                <div className="poropertyListingItem ha--BlogAsideListing">
                                  <a
                                    className="ha--blogListingProperty"
                                    href={navigatePropertyDetail(
                                      item.apartment_sid
                                    )}
                                  >
                                    <div className="ha--listingThumbnail">
                                      {" "}
                                      <img
                                        src={
                                          item.property_image_url
                                            ? item.property_image_url
                                            : DubaiImg
                                        }
                                        alt="listingImg"
                                        // onClick={() =>
                                        //   navigatePropertyDetail(
                                        //     item.apartment_sid
                                        //   )
                                        // }
                                      />
                                    </div>
                                    <div className="listingItemContent">
                                      <h5 className="">
                                        {item.apartment_title
                                          ? item.apartment_title
                                          : ""}
                                      </h5>
                                      <p className="">
                                        {t("pages.blogs.from_aed")}{" "}
                                        {item?.currency_code_display}{" "}
                                        <span>
                                          {item.monthly_price
                                            ? item.monthly_price
                                            : "-- "}
                                          /{t("common_lables.month")}{" "}
                                          {/* {t("pages.blogs.night")} */}{" "}
                                        </span>{" "}
                                      </p>
                                      <div className="d-flex align-items-center gap-4 allAmmenities">
                                        <div className="ammenitiesItem d-flex align-items-center gap-2">
                                          <FUserIcon />{" "}
                                          {item.accomodation
                                            ? item.accomodation
                                            : ""}
                                        </div>
                                        <div className="ammenitiesItem d-flex align-items-center gap-2">
                                          <FBedIcon />{" "}
                                          {item.bedroom ? item.bedroom : ""}
                                        </div>
                                        <div className="ammenitiesItem d-flex align-items-center gap-2">
                                          <FShower />{" "}
                                          {item.bathroom ? item.bathroom : ""}
                                        </div>
                                      </div>
                                    </div>
                                  </a>
                                  <hr className="ha--ListingHR" />
                                </div>
                              </div>
                            </>
                          );
                        })}
                    </div>
                  )}
                </div>
                <div className="ha--BlogAsideMain  p-0">
                  <div className="blogSidebar bg-white categoryListSm">
                    <h5>{t("pages.blogs.categories")}</h5>
                    <div className="categoryListing">
                      <ul className="categoryList">
                        {categories &&
                          categories.map((item, index) => {
                            return (
                              <>
                                <li
                                  className="categoryItem"
                                  onClick={() => ClickCategoryFilter(item)}
                                >
                                  {item}
                                  <hr />
                                </li>
                              </>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogListing;
