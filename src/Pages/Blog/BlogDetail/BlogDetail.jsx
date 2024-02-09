import { useDispatch, useSelector } from "react-redux";
import { FaFacebookF, FaLink, FaTwitter } from "react-icons/fa";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Carousel } from "@mantine/carousel";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";

import React from "react";
import HomeIcon from "Assets/Images/BlogIcons/HomeIcon";
import BlogImg3 from "Assets/Images/BlogIcons/Blog3.png";
import FUserIcon from "Assets/Images/FeaturedPropertiesIcons/FUserIcon";
import FBedIcon from "Assets/Images/FeaturedPropertiesIcons/FBedIcon";
import FShower from "Assets/Images/FeaturedPropertiesIcons/FShower";
import DubaiImg from "Assets/Images/HomeIcons/AreasImages/Dubai.png";
import blogService from "Services/BlogService";
import maskingActions from "reducers/masking/masking.actions";
import BlogImg1 from "Assets/Images/BlogIcons/Blog2.png";
import ArrowUpRightIcon from "Assets/Images/BlogIcons/ArrowUpRightIcon";
import ShareIcon from "Assets/Images/PropertiesDetailsIcons/ShareIcon";

import "Pages/Blog/BlogDetail/blogdetail.css";
import {
  SetDynamicEndpoint,
  removeHtmlTags,
} from "Helpers/commonMethodHelper";
import { toast } from "react-toastify";
import ResponsiveRelatedArticles from "./Components/ResponsiveRelatedArticles";
import moment from "moment";

const BlogDetail = (props) => {
  var list_params = {
    page_number: 1,
    page_size: 10,
    sort_column: "",
    sort_direction: "",
    filters: "",
    search_text: "",
    status: 1,
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { t } = useTranslation();
  const { state } = useLocation();
  const [blog, setBlog] = useState();
  const [categories, setCategories] = useState([]);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [blogListing, setBlogListing] = useState([]);
  const [blogTags, setBlogTags] = useState([]);
  const [listParams, setlistParams] = useState(list_params);
  const [filterData, setFilterData] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { language } = useSelector((state) => state.language); // add this line for the language

  useEffect(() => {
    if (id) {
      if (id !== null && id !== "" && id !== undefined) {
        dispatch(maskingActions.showMasking());

        if (id !== null && id !== "" && id !== undefined) {
          blogService
            .get_blogs_list_by_sid(id)
            .then((res) => {
              
              setBlog(res.data.blog);
              setBlogTags(res.data.blog.tags);
              setCategories(res.data.categories ? res.data.categories : []);
              setBlogListing(res.data.listing ? res.data.listing : []);
              setRelatedArticles(
                res.data.relatedArticles ? res.data.relatedArticles : []
              );
            })
            .finally(() => {
              dispatch(maskingActions.hideMasking());
            });
        }
      }
    }
  }, [state, language]);

  // useEffect(()=>{

  //   if (blog) {
  //     const htmlString = blog?.blog_description;
  // const cleanedString = removeHtmlTags(htmlString);
 
  //   }

  // },[blog])

  const handleResize = debounce(() => {}, 100);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    const resizeObserver = new ResizeObserver(handleResize);
    const carouselElement = document.querySelector(".blogPostDetailSlider");
    resizeObserver.observe(carouselElement);

    return () => {
      resizeObserver.unobserve(carouselElement);
      resizeObserver.disconnect();
    };
  }, []);

  const onFilter = (filters_data) => {
    setlistParams((prevState) => {
      return {
        ...prevState,
        filters: filters_data?.length > 0 ? JSON.stringify(filters_data) : "",
      };
    });
    // navigate(RoutePaths.BLOG.BLOG, { state: { listParams: filters_data } });
    
  };

  const NavigateToListBlog = (item) => {
    var filters = [];
    if (item) {
      var obj = { key: "blog_category_title", value: item, condition: "=" };
      filters?.push(obj);
    } else {
      filters = filters.filter((x) => x.value !== item);
    }
    // setFilterData(filters);

    // onFilter(filters);
   return filters;
    // return (RoutePaths.BLOG.BLOG);
  };

  const onAparmentDetails = (apartment_sid) => {
    navigate(
      `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [
        apartment_sid,
      ])}`,
      { state: { apartment_sid: apartment_sid } }
    );
    window.location.reload();
  };

  // copy the url
  const copyURL = (blogSid) => {
    debugger;
    const currentURL = window.location.href;
    navigator.clipboard
      .writeText(currentURL)
      .then(() => {
        toast.success(t("toaster_message.link_copied"));
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard:", error);
      });
  };

  const handleFacebookClick = () => {
    const fixedContent = "Hello, I would like to share apartment with you: ";
    const shareUrl = window.location.href; // Replace with your website URL

    // Generate the Facebook share URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(fixedContent)}`;

    // Open the Facebook share dialog in a new window
    window.open(facebookShareUrl, "_blank");
  };

  const handleTwitterClick = () => {
    const fixedContent = "Hello, I would like to share an apartment with you: ";
    const shareUrl = window.location.href; // Replace with your website URL

    // Generate the Twitter share URL
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      fixedContent + shareUrl
    )}`;

    // Open the Twitter share dialog in a new window
    window.open(twitterShareUrl, "_blank");
  };

  const navigateBlogPost = (blog_sid) => {
    
    if (blog_sid !== null && blog_sid !== "" && blog_sid !== undefined) {
      // navigate("/blog/blog-detail/", { blog_sid }, { state: { sid: blog_sid ? blog_sid : "" } });

      // navigate(
      //   `${SetDynamicEndpoint(RoutePaths.BLOG.BLOG_Detail, [blog_sid])}`,
      //   { state: { blog_sid: blog_sid ? blog_sid : "" } }
      // );
      // window.location.reload();
      // window.scrollTo({
      //   top: 0,
      //   left: 0,
      //   behavior: "smooth",
      // });
      return `${SetDynamicEndpoint(RoutePaths.BLOG.BLOG_Detail, [blog_sid])}`;
    }
  };

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
      // debugger;
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const navigatePropertyDetail = (sid) => {
    if (sid)
      // navigate(
        return `${SetDynamicEndpoint(RoutePaths.PROPERTIES.PROPERTIES_DETAIL, [sid])}`
      // );
    else return (RoutePaths.PROPERTIES.FEATURED_PPROPERTIES);
  };

  return (
    <div className="ha--DtlPostDes">
      <div className="ha--SingleBlogPost singlePostContainer">
        <div className="ha--PostContentDtl">
          <div className="singlepostImgSm">
            <div className="singlePostSideBar">
              <div className="postFeaturedImg ">
                <img
                  src={blog && blog.blog_image ? blog.blog_image : BlogImg3}
                  alt="FeaturedImg"
                />
              </div>
            </div>
          </div>

          <div className="ha--postLeftContent">
            <div className="appBreadCrumb blogBreadcrumb">
              <ul className="breadcrumbList d-flex ">
                <li
                  className="breadcrumbItem cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  {/* <NavLink to="/blog"> */}
                  <HomeIcon />
                  {/* </NavLink> */}
                </li>
                <li
                  className="breadcrumbItem cursor-pointer"
                  onClick={() => navigate(RoutePaths.BLOG.BLOG)}
                >
                  {/* <NavLink to="/blog"> */}
                  {t("pages.blogs.title")}
                  {/* </NavLink> */}
                </li>
                <li className="breadcrumbItem">
                  {/* <NavLink> */}
                  {blog && blog.blog_title ? blog.blog_title : ""}
                  {/* </NavLink> */}
                </li>
              </ul>
            </div>
            <div className="singlePostDate">
              <p>
                {blog && blog.published_date
                  ? moment(blog.published_date).format("MMM DD, yyyy")
                  : ""}
              </p>
            </div>
            <div className="singlePostTitle">
              <h2>{blog && blog.blog_title ? blog.blog_title : ""}</h2>
            </div>
            <div className="postSharing">
              <div className="socialIcons d-flex align-items-center gap-5">
                <span>
                  <FaFacebookF
                    onClick={() => {
                      handleFacebookClick();
                    }}
                  />
                </span>
                <span>
                  <FaTwitter
                    onClick={() => {
                      handleTwitterClick();
                    }}
                  />
                </span>
                <span>
                  <FaLink
                    onClick={() => {
                      copyURL();
                    }}
                  />
                </span>
              </div>
            </div>
            <div className="postContent mb-4">
              <div className="ha--fullDtlContent"
                dangerouslySetInnerHTML={{
                  __html:
                    blog && blog.blog_description && blog.blog_description
                      ? blog.blog_description
                      : "",
                }}
              />
            </div>
            <div className="mb-4 d-flex align-items-end justify-content-end">
              By: {blog?.author_name}
            </div>
            <div className="postTags">
              <div className="d-flex align-items-center gap-3 flex-wrap">
                {blogTags &&
                  blogTags.map((item, index) => {
                    return (
                      <>
                        <span className="tags active">{item}</span>
                      </>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="ha--postRightContent">
            <div className="singlePostSideBar singlepostSideBarLg">
              <div className="postFeaturedImg ">
                <img
                  src={blog && blog.blog_image ? blog.blog_image : BlogImg3}
                  alt="FeaturedImg"
                />
              </div>
            </div>

            <div className="ha--dtlRightSidebar">
            <div className="ha--BlogAside blogAsideSm">
                <div className="ha--BlogAsideMain  p-0">
            {blogListing && blogListing?.length > 0 && (
                  <div className="blogSidebar">
                    <h5>{t("pages.blogs.listings")}</h5>

                    {blogListing &&
                      blogListing.map((item, index) => {
                        return (
                          <>
                            <div className="poropertyListing">
                              <div className="poropertyListingItem ha--BlogAsideListing">
                              <a className="ha--blogListingProperty" href={navigatePropertyDetail(item.apartment_sid)}>
                                <div className="ha--listingThumbnail">
                                  <img
                                    src={
                                      item.property_image_url
                                        ? item.property_image_url
                                        : DubaiImg
                                    }
                                    alt="listingImg"
                                    // onClick={() =>
                                    //   navigatePropertyDetail(item.apartment_sid)
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

              <div className="blogSidebar">
                <h5>{t("pages.common.categories")}</h5>
                <div className="categoryListing">
                  <ul className="categoryList">
                    {categories &&
                      categories.map((item, index) => {
                        return (
                          <>
                            <li
                              className="categoryItem"
                              // onClick={(e) => NavigateToListBlog(item)}
                            >
                              <Link to={RoutePaths.BLOG.BLOG} state={{ listParams: NavigateToListBlog(item) }} >
                              {item} <hr />

                              </Link>

                              
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
      <div className="relatedArticles">
          <div className="ha--relatedBlogTitle">
            <h2>{t("pages.blogs.related_articles")}</h2>
          </div>
          <div className="blogPostDetailSlider">
            {windowWidth > ScreenResolutions.Width ? (
              <Carousel
                withIndicators
                slideSize="33.333333%"
                slideGap="xl"
                loop
                align="start"
                withControls={false}
                slidesToScroll={3}
                dragFree
              >
                {relatedArticles &&
                  relatedArticles.map((i, index) => {
                    return (
                      <>
                        <Carousel.Slide>
                          <a
                            className="postCardLayout cursor-pointer"
                            // onClick={(e) => {
                            //   e.stopPropagation();
                            //   navigateBlogPost(i.blog_sid);
                            // }}
                            href={navigateBlogPost(i.blog_sid)}
                          >
                            <div className="postImg">
                              <img
                                src={i.blogimage ? i.blogimage : BlogImg1}
                                alt="PostImg"
                              />
                            </div>
                            <div className="postContent">
                              <span className="postDate ">
                                {i.createdDate ? i.createdDate : ""}
                              </span>
                              <div className="postTitle d-flex align-items-start justify-content-between mt-2 mb-2">
                                <h5>{i.blog_title ? i.blog_title : ""}</h5>
                                <ArrowUpRightIcon />
                              </div>
                              <div className="postExcerpt mb-3">
                                <p>{removeHtmlTags(i?.description)}</p>
                              </div>
                              <div className="shareSymbol d-inline-block">
                                <span className="onlyShare d-flex align-items-center gap-2">
                                  <ShareIcon />
                                  {t("pages.blogs.share")}
                                </span>
                                <div className="onShareHover d-flex align-items-center gap-2">
                                  <span>{t("pages.blogs.share")}</span>
                                  <div className="socialIcons d-flex align-items-center gap-4">
                                    <FaFacebookF />
                                    <FaTwitter />
                                    <FaLink />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </Carousel.Slide>
                      </>
                    );
                  })}
              </Carousel>
            ) : (
              <>
                <ResponsiveRelatedArticles
                  related_articles_list={relatedArticles}
                  navigateBlogPost={navigateBlogPost}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
