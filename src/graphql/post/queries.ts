import PostService from "../../services/postService.js";

export const queries = {
    getAllPosts: () => PostService.getAllPosts(),
};
