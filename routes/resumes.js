const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const router = express.Router();

// Create resume
router.post('/', auth, async (req, res) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all resumes for user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const r = await Resume.findById(req.params.id);

    if (!r) return res.status(404).json({ message: "Not found" });
    if (r.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update
router.put('/:id', auth, async (req, res) => {
  try {
    const r = await Resume.findById(req.params.id);

    if (!r) return res.status(404).json({ message: "Not found" });
    if (r.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    Object.assign(r, req.body);
    await r.save();

    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const r = await Resume.findById(req.params.id);

    if (!r) return res.status(404).json({ message: "Not found" });
    if (r.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Forbidden" });

    await r.remove();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
