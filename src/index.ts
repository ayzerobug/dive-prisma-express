import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth"
import protectedRoutes from "./routes/protectedRoutes"
import AppError from "./errors/AppError";
import { errorHandler } from "./middlewares/errorHandler";
import { authMiddleware } from "./middlewares/authMiddleware";
import { asyncHandler } from "./utils/asyncHandler";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blog System");
});


app.use("/auth", authRoutes)
app.use("/app", authMiddleware, protectedRoutes)

app.use((req: Request, res: Response, next: NextFunction): any => {
  throw new AppError(`Route ${req.path} not found`, 404)
})

app.use(errorHandler)

// start the Express server
app.listen(port, () => {
  console.log(`Server listening to port: ${port}`);
});
