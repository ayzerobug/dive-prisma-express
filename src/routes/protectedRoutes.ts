import { Request, Response, Router } from "express"
import postRoutes from "./protected/postRoutes"

const router = Router();

router.use("/posts", postRoutes);

export default router;