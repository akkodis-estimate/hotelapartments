const { default: apiClient } = require("Helpers/apiClient");
const { default: endpoints } = require("./apiEndPoints");

class BlogService {
  all_blogs_list = (listParams) => {
    return apiClient().get(`${endpoints.BLOG.ALL_BLOG_LIST}`, {
      params: { ...listParams },
    });
  };

  get_blogs_list_by_sid = (sid) => {
    return apiClient().get(`${endpoints.BLOG.GET_BLOG_BY_SID}/${sid}`) };


}

var blogService = new BlogService();

export default blogService;
