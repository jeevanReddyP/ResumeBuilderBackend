const Resume = require("../models/resumeModel");
const path = require("path");
const fs = require("fs");

exports.createResume = async (req, res) => {
  try {
    const { title } = req.body;
    const defaultResumeData = {
      profileInfo: {
        profilePreviewUrl: '',
        fullName: '',
        designation: '',
        summary: '',
      },
      contactInfo: {
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        website: '',
      },
      workExperience: [{
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        description: '',
      }],
      education: [{
        degree: '',
        institution: '',
        startDate: '',
        endDate: '',
      }],
      skills: [{
        name: '',
        progress: 0,
      }],
      projects: [{
        title: '',
        description: '',
        github: '',
        liveDemo: '',
      }],
      certifications: [{
        title: '',
        issuer: '',
        year: '',
      }],
      languages: [{
        name: '',
        progress: 0,
      }],
      interests: [''],
    };

    const newResume = await Resume.create({
      userId: req.user._id,
      title,
      ...defaultResumeData,
      ...req.body
    });

    res.status(201).json(newResume);

  } catch (error) {
    console.error(error);
    res.status(500).json({ Msg: "Failed to create resume", error: error.message });
  }
};

exports.getUserResume = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ Msg: "Failed to get resume", error: error.message });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ Msg: "Resume Not Found" });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ Msg: "Failed to get resume", error: error.message });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ Msg: "Resume Not Found or not authorized" });

    Object.assign(resume, req.body);
    const savedResume = await resume.save();
    res.json(savedResume);
  } catch (error) {
    res.status(500).json({ Msg: "Failed to update resume", error: error.message });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) return res.status(404).json({ Msg: "Resume Not Found or not authorized" });

    const uploadsFolder = path.join(process.cwd(), "uploads");

    if (resume.thumbnailLink) {
      const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
      if (fs.existsSync(oldThumbnail)) fs.unlinkSync(oldThumbnail);
    }

    if (resume.profileInfo?.profilePreviewUrl) {
      const oldProfile = path.join(uploadsFolder, path.basename(resume.profileInfo.profilePreviewUrl));
      if (fs.existsSync(oldProfile)) fs.unlinkSync(oldProfile);
    }

    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!deleted) return res.status(404).json({ Msg: "Resume not found or not authorized" });

    res.json({ Msg: "Resume deleted successfully" });

  } catch (error) {
    res.status(500).json({ Msg: "Failed to delete resume", error: error.message });
  }
};
