import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth"

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Blog System");
});


app.use("/auth", authRoutes)

// app.use((req: Request, res: Response, next: NextFunction): any => {
//   const response = {
//     success: false,
//     message: `Route ${req.path} not found`,
//   };

//   return res.status(404).json(response);
// })


// app.use((err: Error, req: Request, res: Response, next: NextFunction): any => {
//   const response = {
//     success: false,
//     message: err.message
//   };

//   return res.status(500).json(response);
// })

// start the Express server
app.listen(port, () => {
  console.log(`Server listening to port: ${port}`);
});
