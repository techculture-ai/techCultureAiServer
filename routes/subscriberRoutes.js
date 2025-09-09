import express from "express";
import {adminAuthorize,authenticateUser} from "../middlewares/authMiddleware.js"

import {createSubscriber,deleteSubscriber,getAllSubscribers} from "../controllers/subscriberController.js"

const router = express.Router();

router.post("/", createSubscriber);
router.get("/", authenticateUser, getAllSubscribers);
router.delete("/:id", authenticateUser, adminAuthorize, deleteSubscriber);

export default router;
