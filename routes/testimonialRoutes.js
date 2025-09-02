import express from "express";
import multer from "multer";
import {adminAuthorize,authenticateUser} from "../middlewares/authMiddleware.js"
import {createTestimonial,deleteTestimonial,editTestimonial,getAllTestimonials,getTestimonialById} from "../controllers/testimonialController.js"

const router = express.Router();
const upload = multer({dest: "uploads/"});

router.post("/", upload.single("file"), createTestimonial);
router.get("/", getAllTestimonials);
router.get("/:id", getTestimonialById);
router.delete("/:id", deleteTestimonial);
router.put("/:id",  upload.single("file"), editTestimonial);

export default router;
