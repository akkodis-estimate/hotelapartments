import { FaFacebookF, FaLink, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import BlogImg1 from "Assets/Images/BlogIcons/Blog2.png";
import ArrowUpRightIcon from "Assets/Images/BlogIcons/ArrowUpRightIcon";
import ShareIcon from "Assets/Images/PropertiesDetailsIcons/ShareIcon";
import "./postcard.css";
import { RoutePaths, ScreenResolutions } from "Constants/Constants";
import {
  SetDynamicEndpoint,
  getFirstTwoSentences,
  removeHtmlTags,
} from "Helpers/commonMethodHelper";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MobileDrawer from "Components/Shared/MobileDrawer/MobileDrawerPopup";
import { useEffect, useState } from "react";
import moment from "moment";

const PostCard = ({ blogSid, createdDate, blogTitle, img, item }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [drawerOpen, setdrawerOpen] = useState(false);

  // copy the url
  const copyURL = (blogSid) => {
    // debugger;
    const currentURL = window.location.href;
    const FullUrl = currentURL + "/blog-detail/" + blogSid;
    navigator.clipboard
      .writeText(FullUrl)
      .then(() => {
        toast.success(t("toaster_message.link_copied"));
      })
      .catch((error) => {
        console.error("Failed to copy URL to clipboard:", error);
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

  const handleFacebookClick = (sid) => {
    const fixedContent = "Hello, I would like to share apartment with you: ";
    const shareUrl = window.location.href + `blog-detail/${sid}`; // Replace with your website URL

    // Generate the Facebook share URL
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl
    )}&quote=${encodeURIComponent(fixedContent)}`;

    //http://localhost:5000/blog/blog-detail/BLG-28385996-5840-466C-95A1-458F419BFA07

    // Open the Facebook share dialog in a new window
    window.open(facebookShareUrl, "_blank");
  };

  const handleTwitterClick = (sid) => {
    const fixedContent = "Hello, I would like to share an apartment with you: ";
    const shareUrl = window.location.href + `blog-detail/${sid}`; // Replace with your website URL

    // Generate the Twitter share URL
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      fixedContent + shareUrl
    )}`;
    

    // Open the Twitter share dialog in a new window
    window.open(twitterShareUrl, "_blank");
  };

  const handleShareClick = () => {
    setdrawerOpen(true);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      // setWindowWidth(window.innerWidth);
      if (window.innerWidth > ScreenResolutions.Width) {
        setdrawerOpen(false);
      }
      // debugger;
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleWhatsappShare = (sid) => {
    const currentURL = window.location.href;

    const FullUrl = currentURL + "/blog-detail/" + blogSid;
    const message = "Check out this cool website!"; // Your message to be shared
    const url = encodeURIComponent(FullUrl);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${message}%0A${url}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <a
        className="postCardLayout cursor-pointer"
        // onClick={() => navigateBlogPost(blogSid)}
        href={`${SetDynamicEndpoint(RoutePaths.BLOG.BLOG_Detail, [blogSid])}`}
      >
        <div className="postImg">
          <img src={img ? img : BlogImg1} alt="PostImg" />
        </div>
        <div className="postContent">
          <span className="postDate postDatelg">
            {createdDate ? createdDate : ""}
          </span>
          <span className="postDate postDateSm">
            {item?.published_date
              ? moment(item?.published_date).format("MMM DD yyyy")
              : ""}
          </span>
          <div className="postTitle d-flex align-items-start justify-content-between mt-2 mb-2">
            <h5>{blogTitle ? blogTitle : ""}</h5>
            <ArrowUpRightIcon />
          </div>

          <div className="postTitle d-flex align-items-start justify-content-between mt-2 mb-2 subHeading flex-wrap postDatelg">
            <span>{item?.author_name}</span>
            {item?.published_date
              ? moment(item?.published_date).format("MMM DD yyyy")
              : ""}
          </div>
          <div className="postExcerpt mb-3">
            <p>
              {/* Lorem ipsum dolor sit amet consectetur. Lobortis id egestas
              egestas elit. */}
              {removeHtmlTags(item?.blog_description)}
            </p>
          </div>
        </div>
      </a>
      <div className="shareSymbolSm">
        <span onClick={handleShareClick}>
          <ShareIcon />
        </span>
      </div>
      <div className="shareSymbol d-inline-block">
        <span className="onlyShare d-flex align-items-center gap-2">
          <ShareIcon />
          {t("pages.blogs.share")}
        </span>
        <div className="onShareHover d-flex align-items-center gap-2">
          <span>{t("pages.blogs.share")}</span>
          <div className="socialIcons d-flex align-items-center gap-4">
            <FaFacebookF
              onClick={() => {
                handleFacebookClick(item.blog_sid);
              }}
            />
            <FaTwitter
              onClick={() => {
                handleTwitterClick(item.blog_sid);
              }}
            />
            <FaLink
              onClick={() => {
                copyURL(blogSid);
              }}
            />
          </div>
        </div>
      </div>

      <MobileDrawer openDrawer={drawerOpen} setopenDrawer={setdrawerOpen}>
        <div className="d-inline-block">
          <div className="d-flex align-items-center gap-2">
            <div className="align-items-start gap-4 socialIcons d-flex flex-column ps-4">
              <div
                className="d-flex align-items-center gap-3 shareSm"
                onClick={() => {
                  handleFacebookClick(item.blog_sid);
                }}
              >
                <div>
                  <FaFacebookF />
                </div>{" "}
                Facebook
              </div>
              <div
                className="d-flex align-items-center gap-3 shareSm"
                onClick={() => {
                  handleTwitterClick(item.blog_sid);
                }}
              >
                <div>
                  <FaTwitter
                  // onClick={() => {
                  //   handleTwitterClick(item.blog_sid);
                  // }}
                  />
                </div>{" "}
                Twitter
              </div>
              <div
                className="d-flex align-items-center gap-3 shareSm"
                onClick={() => {
                  copyURL(blogSid);
                }}
              >
                <div>
                  <FaLink
                  // onClick={() => {
                  //   copyURL(blogSid);
                  // }}
                  />
                </div>
                Copy Link
              </div>

              <div
                className="d-flex align-items-center gap-3 shareSm"
                onClick={() => handleWhatsappShare(blogSid)}
              >
                <div>
                  <FaWhatsapp />
                </div>
                Whatsapp
              </div>
            </div>
          </div>
        </div>
      </MobileDrawer>
    </>
  );
};

export default PostCard;
