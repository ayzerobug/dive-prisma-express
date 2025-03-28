import { Request, Response, Router } from "express"

import postController from "../controllers/postController";
import { upload } from "../middlewares/multerConfig";


const router = Router();

//Post Routes
router.get("/posts", postController.getPosts)
router.post("/posts", upload.single('file'), postController.createPost)
router.get("/posts/:postId", postController.getPost)
router.get("/posts/:postId/comments", postController.getPostComments)
router.post("/posts/:postId/comments", postController.createPostComment)

export default router;