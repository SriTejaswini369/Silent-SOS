const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createAlert,
    getAlerts
} = require("../controllers/alertController");

// Create SOS alert
router.post("/", protect, createAlert);

// Get previous SOS alerts
router.get("/", protect, getAlerts);

module.exports = router;