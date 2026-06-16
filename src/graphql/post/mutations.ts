import PostService from "../../services/postService.js";

export const mutations = {
    createPost: async (
        _: unknown,
        payload: { content: string; imageUrl?: string },
        context: { user: { id: string; email: string } | null }
    ) => {
        // 🔒 Authorization check — login nahi kiya toh post nahi banega
        if (!context.user) throw new Error("Pehle login karo!");

        await PostService.createPost({
            content: payload.content,
            ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
            authorId: context.user.id,
        });
        return true;
    }
};
