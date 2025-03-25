import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import AppError from "../errors/AppError";

const prisma = new PrismaClient()

type RegisterRequestInput = {
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    middleName?: string
}


type LoginRequestInput = {
    email: string,
    password: string
}


const register = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password, firstName, lastName, middleName }: RegisterRequestInput = req.body;

        if (!email || !password || !firstName || !lastName) {
            throw new AppError("Please input required fields", 400);
        }

        //Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            throw new AppError("Email address already exists", 409);
        }

        //Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, 1)

        //Save User
        await prisma.user.create({
            data: {
                firstName, lastName, middleName,
                email: email.toLowerCase(),
                password: hashedPassword
            }
        })

        const response = {
            success: true,
            message: "Registration completed",
        };

        return res.status(201).json(response);
    } catch (error: any) {
        const response = {
            success: false,
            message: error.message
        };
        return res.status(error.statusCode || 500).json(response);
    }
}

const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password }: LoginRequestInput = req.body;

        if (!email || !password) {
            throw new AppError("Please input required fields", 400);
        }

        //Check if user exists
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            throw new AppError("Email address not registered", 401);
        }

        //Check if password is correct
        const passwordIsValid = await bcrypt.compare(password, user.password)
        if (!passwordIsValid) {
            throw new AppError("Password is incorrect", 401);
        }

        const response = {
            success: true,
            message: "Login successful",
        };

        return res.status(200).json(response);
    } catch (error: any) {
        const response = {
            success: false,
            message: error.message
        };
        return res.status(error.statusCode || 500).json(response);
    }
}

export default {
    register, login
}