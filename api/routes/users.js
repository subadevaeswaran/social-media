import express from "express";
import { db } from "../connect.js"; // Assuming you have a database connection setup

const router = express.Router();

router.get("/find/:userid", (req, res) => {
  const userId = req.params.userid;
  
  const q = "SELECT * FROM users WHERE id = ?";
  
  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "An error occurred while fetching user details." });
    }

    if (data.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const userDetails = data[0];
    res.json(userDetails);
  });
});

export default router;
