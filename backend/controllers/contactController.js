const Contact = require("../models/Contact");

// ADD EMERGENCY CONTACT
const addContact = async (req, res) => {
    try {
        const { name, phone, email, relationship } = req.body;

        if (!name || !phone || !relationship) {
            return res.status(400).json({
                success: false,
                message: "Name, phone and relationship are required"
            });
        }

        const contact = await Contact.create({
            user: req.user.id,
            name,
            phone,
            email,
            relationship
        });

        res.status(201).json({
            success: true,
            message: "Emergency contact added successfully",
            contact
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET USER'S EMERGENCY CONTACTS
const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({
            user: req.user.id
        });

        res.status(200).json({
            success: true,
            contacts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE EMERGENCY CONTACT
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Emergency contact deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    addContact,
    getContacts,
    deleteContact
};