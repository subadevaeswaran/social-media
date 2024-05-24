// social/api/controllers/upload.js

import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file handling
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Destination folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

// Upload file handler
export const uploadFile = (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res.status(500).json({ message: "File upload failed", error: err.message });
    }
    res.status(200).json({ filePath: req.file.filename });
  });
};

// Update user details handler
export const updateUserDetails = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const { email, password, name, city, website, coverPic, profilePic } = req.body;

    const q = "UPDATE users SET `email`=?, `password`=?, `name`=?, `city`=?, `website`=?, `coverPic`=?, `profilePic`=? WHERE id=?";

    db.query(
      q,
      [email, password, name, city, website, coverPic, profilePic, userInfo.id],
      (err, data) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json(err);
        }
        if (data.affectedRows > 0) return res.json("User details updated successfully!");
        return res.status(403).json("You can update only your profile!");
      }
    );
  });
};
