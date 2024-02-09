import { useEffect } from "react";
import BlogImg1 from "Assets/Images/BlogIcons/Blog2.png";
import ArrowUpRightIcon from "Assets/Images/BlogIcons/ArrowUpRightIcon";
import ShareIcon from "Assets/Images/PropertiesDetailsIcons/ShareIcon";
import { FaFacebookF, FaLink, FaTwitter } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { removeHtmlTags } from "Helpers/commonMethodHelper";

const ResponsiveRelatedArticles = ({
  related_articles_list,
  navigateBlogPost,
}) => {
  const { t } = useTranslation();
  const { language } = useSelector((state) => state.language); // add this line for the language

  useEffect(() => {
    
  }, []);
  return (
    <>
      {/* <h1>Related Articles List</h1> */}
      {related_articles_list &&
        related_articles_list.map((i, index) => {
          return (
            <>
              {/* <Carousel.Slide> */}
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
                <div className="postContent position-relative">
                  <span className="postDate ">
                    {i.createdDate ? i.createdDate : ""}
                  </span>
                  <div className="postTitle d-flex align-items-start justify-content-between mt-2 mb-2">
                    <h5>{i.blog_title ? i.blog_title : ""}</h5>
                    <ArrowUpRightIcon />
                  </div>
                  <div className="postExcerpt mb-3">
                    <p>
                    { removeHtmlTags(i?.description)}

                    </p>
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
                  <div className="shareSymbolSm">
                    <span>
                      <ShareIcon />
                    </span>
                  </div>
                </div>
              </a>
              {/* </Carousel.Slide> */}
            </>
          );
        })}
    </>
  );
};

export default ResponsiveRelatedArticles;
