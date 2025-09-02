import express from "express";
import multer from "multer";
import {adminAuthorize,authenticateUser} from "../middlewares/authMiddleware.js"
import {createService,deleteService,getAllServices,getServiceById,updateService} from "../controllers/serviceController.js"

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  authenticateUser, adminAuthorize,
  upload.single("file"),
  createService
);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put("/:id",authenticateUser, adminAuthorize, upload.single("file"), updateService);
router.delete("/:id",authenticateUser, adminAuthorize, deleteService);

export default router;