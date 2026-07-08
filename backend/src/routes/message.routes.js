import express from "express";
import {protectRoute} from "../middleware/auth.middleware.js";
import {getUsersForSidebar, getConversationForSidebar, getConversationMessages, sendMessage, deleteMessage, downloadMedia} from "../controllers/message.controller.js";
import {upload} from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/users",getUsersForSidebar);
router.get("/conversations",getConversationForSidebar);
router.get("/:id",getConversationMessages);
router.post("/send/:id",upload.single("media"),sendMessage);
router.delete("/:id", deleteMessage);
router.get("/download/:id", downloadMedia);

export default router;