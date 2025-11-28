require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const uploadRoutes = require('./routes/uploads');

const app = express();

// -------------------------------
// ALLOWED ORIGINS
// -------------------------------
const allowedOrigins = [
  "http://localhost:5173",               // Local frontend
  process.env.CLIENT_URL                 // Netlify frontend
];

console.log("Allowed Origins:", allowedOrigins);

// -------------------------------
// CORS CONFIG
// -------------------------------
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, Server-to-server)
    if (!origin) return callback(null, true);

    if (!allowedOrigins.includes(origin)) {
      const msg = `CORS ERROR: Origin ${origin} not allowed`;
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// -------------------------------
// BODY PARSER
// -------------------------------
app.use(express.json());

// -------------------------------
// STATIC FILES
// -------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// -------------------------------
// ROUTES
// -------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/uploads', uploadRoutes);

// -------------------------------
// DEFAULT HOME ROUTE
// -------------------------------
app.get('/', (req, res) => {
  res.send("Resume Builder API Running");
});

// -------------------------------
// DATABASE + SERVER
// -------------------------------
connectDB(process.env.MONGO_URI);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
