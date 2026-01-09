import { Router } from "express";
import { getAllProfiles, getProfileById, getProfileAvatar } from "../controllers/profileController.js";

const router = Router();

router.get("/", getAllProfiles);
router.get("/:id", getProfileById);
router.get("/:id/avatar", getProfileAvatar);

export default router;