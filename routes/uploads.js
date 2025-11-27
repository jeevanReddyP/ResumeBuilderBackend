const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/photo", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Create URL (Render compatible)
  const fileName = req.file.filename;
  const url = `${req.protocol}://${req.get("host")}/uploads/${fileName}`;

  res.json({ url });
});

