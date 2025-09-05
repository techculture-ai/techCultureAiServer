import express from "express";
import multer from "multer";
import {adminAuthorize,authenticateUser} from "../middlewares/authMiddleware.js"
import {createProject,deleteProject,getAllProjects,getProjectById,updateProject} from "../controllers/projectController.js"

const router = express.Router();
const upload = multer({dest: "uploads/"});

// Configure multer to handle multiple files
const uploadFields = upload.fields([
  { name: 'file', maxCount: 1 }, // Main project image
  { name: 'portfolioImages', maxCount: 10 } // Portfolio images (max 10)
]);

router.post("/", authenticateUser, adminAuthorize, uploadFields, createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", authenticateUser, adminAuthorize, uploadFields, updateProject);
router.delete("/:id", authenticateUser, adminAuthorize, deleteProject);

export default router;