const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addContact,
    getContacts,
    deleteContact
} = require("../controllers/contactController");

// Add emergency contact
router.post("/", protect, addContact);

// Get all emergency contacts
router.get("/", protect, getContacts);

// Delete emergency contact
router.delete("/:id", protect, deleteContact);

module.exports = router;