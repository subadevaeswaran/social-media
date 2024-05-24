// social/api/routes/users.js

import express from "express";
import { uploadFile, updateUserDetails } from "../controllers/upload.js";

const router = express.Router();

// Route to handle file uploads
router.post("/", uploadFile);

// Route to handle updating user details
router.put("/", updateUserDetails);

export default router;
