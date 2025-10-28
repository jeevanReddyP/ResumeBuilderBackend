const { protect } = require("../controllers/authController"); // add this
const express=require("express")
const resumeRouter=express.Router()
const resumeController=require("../controllers/resumeController")
const uploadImage=require("../controllers/uploadImages")

resumeRouter.post("/", protect, resumeController.createResume);
resumeRouter.get("/:id", protect, resumeController.getResumeById);
resumeRouter.get("/", protect, resumeController.getUserResume);
resumeRouter.put("/:id", protect, resumeController.updateResume);
resumeRouter.put("/:id/upload-images", protect, uploadImage.uploadResumeImages);
resumeRouter.delete("/:id", protect, resumeController.deleteResume);

module.exports=resumeRouter
