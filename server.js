require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const uploadRoutes = require('./routes/uploads');

const app = express();

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json());

// STATIC FOR UPLOADS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/uploads', uploadRoutes);

// DEFAULT
app.get('/', (req, res) => {
  res.send("Resume Builder API Running");
});

// DB + SERVER
connectDB(process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
