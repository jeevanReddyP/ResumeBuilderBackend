const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  start: String,
  end: String,
  description: String
}, { _id: false });

const EducationSchema = new mongoose.Schema({
  institute: String,
  degree: String,
  start: String,
  end: String
}, { _id: false });

const ResumeSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  email: String,
  phone: String,
  summary: String,
  skills: [String],
  experience: [ExperienceSchema],
  education: [EducationSchema],
  template: { type: String, default: 'template1' },
  photoUrl: String, // uploaded profile photo URL/path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', ResumeSchema);
