import { Router } from "express";
import { getAllProfiles } from "../controllers/profileController.js";

const router = Router();

router.get("/", getAllProfiles);

export default router;