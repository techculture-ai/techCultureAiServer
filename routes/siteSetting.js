import express from "express";
import {
  getSiteSetting,
  updateSiteSetting,
} from "../controllers/siteSettingController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getSiteSetting);
router.put("/", upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "clients", maxCount: 15 } // adjust maxCount as needed
  ]), updateSiteSetting);

export default router;