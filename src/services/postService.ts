import { prismaClient } from "../lib/db.js";

export interface CreatePostPayload {
    content: string;
    imageUrl?: string;
    authorId: string;
}

class PostService {
    public static async createPost(payload: CreatePostPayload) {
        const { content, imageUrl, authorId } = payload;
        return prismaClient.post.create({
            data: {
                content,
                imageUrl: imageUrl ?? null,
                authorId,
            }
        });
    }

    public static getAllPosts() {
        return prismaClient.post.findMany({
            orderBy: { createdAt: "desc" }
        });
    }
}

export default PostService;
