const fs = require("fs")
const path = require("path")
const Resume = require("../models/Resume")
const upload = require("../middleware/upload")

exports.uploadResumeImages = async (req, res) => {
    try {
        upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "profileImage", maxCount: 1 }])
            (req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ Msg: "File upload failed", error: err.message })
                }
                const resumeId = req.params.id;
                const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })

                if (!resume) {
                    return res.status(404).json({ Msg: "Resume not found or unauthorized" })
                }
                const uploadsFolder = path.join(process.cwd(), "uploads")
                const baseUrl = `${req.protocol}://${req.get("host")}`

                const newThumbnail = req.files.thumbnail?.[0];
                const newProfileImage = req.files.profileImage?.[0]
                if (newThumbnail) {
                    if (resume.thumbnailLink) {
                        const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink))
                        if (fs.existsSync(oldThumbnail))
                            fs.unlinkSync(oldThumbnail)
                    }
                    resume.thumbnailLink = `${baseUrl}/uploads/${newThumbnail.filename}`
                }

                if (newProfileImage) {
                    if (resume.profileInfo?.profilePreviewUrl) {
                        const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl))
                        if (fs.existsSync(oldProfile))
                            fs.unlinkSync(oldProfile)
                    }
                    resume.profileInfo.profilePreviewUrl = `${baseUrl}/uploads/${newProfileImage.filename}`;
                }
                await resume.save()
                res.status(200).json({
                    Msg: "Image Uploaded Successfully",
                    profilePreviewUrl: resume.profileInfo.profilePreviewUrl
                })
            })
    } catch (error) {
        console.error("error uploading images:", error)
        res.status(500).json({ Msg: "Failed to Upload to images", error: error.message })
    }
}