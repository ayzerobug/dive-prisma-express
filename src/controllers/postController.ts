import { Response } from "express"
import { asyncHandler } from "../utils/asyncHandler"
import { ProtectedRequest } from "../utils/types"
import AppError from "../errors/AppError";
import { PrismaClient } from "@prisma/client";

//Singleton
const prisma = new PrismaClient();

export const getPosts = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const posts = await prisma.blogPost.findMany({
        where: { authorId: req.user!.id },
        include: {
            author: true
        }
    })

    const response = {
        success: true,
        message: "Posts fetched successfully",
        data: { posts }
    }

    res.status(200).json(response);
})

export const createPost = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { title, content } = req.body;

    if (!title || !content) throw new AppError("Ensure title and content are provided", 400);

    const post = await prisma.blogPost.create({
        data: { title, content, authorId: req.user!.id }
    })

    const response = {
        success: true,
        message: "Post created successfully",
        data: { post }
    }

    return res.status(201).json(response);
})