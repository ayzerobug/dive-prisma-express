import { Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { ProtectedRequest } from "../utils/types"
import AppError from "../errors/AppError";
import { PrismaClient } from "@prisma/client";

//Singleton
const prisma = new PrismaClient();

const getPosts = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const posts = await prisma.blogPost.findMany({
        where: { authorId: req.user!.id },
        include: {
            author: true,
            _count: {
                select: {
                    comments: true
                }
            }
        },
    })

    const response = {
        success: true,
        message: "Posts fetched successfully",
        data: { posts }
    }

    res.status(200).json(response);
})

const getPost = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { postId } = req.params;
    const post = await prisma.blogPost.findUnique({
        where: { id: parseInt(postId) },
        include: {
            author: true,
            _count: {
                select: {
                    comments: true
                }
            }
        },
    })

    if (!post) throw new AppError("Post not found", 404);

    await prisma.blogPost.update({
        where: { id: parseInt(postId) },
        data: { views: { increment: 1 } }
    })

    const response = {
        success: true,
        message: "Posts fetched successfully",
        data: { post }
    }

    res.status(200).json(response);
})

const createPost = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { title, content } = req.body;

    const fileUrl = req.protocol + "://" + req.get("host") + "/uploads/" + req.file?.filename;

    if (!title || !content) throw new AppError("Ensure title and content are provided", 400);

    const post = await prisma.blogPost.create({
        data: { title, content, 
            authorId: req.user!.id ,
            imageUrl: fileUrl
        }
    })
    
    const response = {
        success: true,
        message: "Post created successfully",
        data: { post }
    }

    return res.status(201).json(response);
})



const getPostComments = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { postId } = req.params;

    const comments = await prisma.comment.findMany({
        where: { postId: parseInt(postId) },
        include: {
            author: true,
            blogPost: true
        }
    });

    const response = {
        success: true,
        message: "Comments fetched successfully",
        data: { comments }
    }

    res.status(200).json(response);
});

const createPostComment = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) throw new AppError("Ensure content is provided", 400);

    const comment = await prisma.comment.create({
        data: {
            content: content,
            postId: parseInt(postId),
            authorId: req.user!.id
        }
    });

    const response = {
        success: true,
        message: "Comment created successfully",
        data: { comment }
    }

    res.status(201).json(response);
});

export default {
    getPosts,
    createPost,
    getPostComments,
    createPostComment,
    getPost
}