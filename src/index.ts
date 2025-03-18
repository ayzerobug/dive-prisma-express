import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.APP_PORT || 3000;

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

// start the Express server
app.listen(port, () => {
  console.log(`Server listening to port: ${port}`);
});
