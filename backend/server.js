const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const alertRoutes = require("./routes/alertRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Emergency contact routes
app.use("/api/contacts", contactRoutes);

// SOS alert routes
app.use("/api/alerts", alertRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Silent SOS Backend is Running!");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Silent SOS API Working Successfully"
    });
});

// Connect database
connectDB();

// Server configuration
const PORT = process.env.PORT || 5000;

// Allow connections from mobile devices
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Silent SOS Server running on port ${PORT}`);
    console.log("Server accessible on local network");
});