import express from "express";
import multer from "multer";
import {adminAuthorize,authenticateUser} from "../middlewares/authMiddleware.js"
import {createProject,deleteProject,getAllProjects,getProjectById,updateProject} from "../controllers/projectController.js"

const router = express.Router();
const upload = multer({dest: "uploads/"});

router.post("/", authenticateUser, adminAuthorize, upload.single("file"), createProject);
router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.put("/:id", authenticateUser, adminAuthorize, upload.single("file"), updateProject);
router.delete("/:id", authenticateUser, adminAuthorize, deleteProject);

export default router;