const Alert = require("../models/Alert");
const Contact = require("../models/Contact");

const sendEmail = require("../utils/sendEmail");
const sendSMS = require("../utils/sendSMS");

// ==========================================
// CREATE SOS ALERT
// ==========================================

const createAlert = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        // Validate GPS coordinates
        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude) ||
            latitude < -90 ||
            latitude > 90 ||
            longitude < -180 ||
            longitude > 180
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid GPS coordinates are required."
            });
        }

        // Save alert in MongoDB
        const alert = await Alert.create({
            user: req.user.id,
            latitude: latitude,
            longitude: longitude,
            status: "sent"
        });

        // Get user's emergency contacts
        const contacts = await Contact.find({
            user: req.user.id
        });

        // Google Maps location
        const mapLink =
            `https://www.google.com/maps?q=${latitude},${longitude}`;

        // Email details
        const emailSubject = "Emergency SOS Alert";

        const emailMessage = `
EMERGENCY SOS ALERT!

An emergency alert has been triggered.

Location:
Latitude: ${latitude}
Longitude: ${longitude}

Google Maps:
${mapLink}

Please try to contact the person immediately.

This is an automated message from Silent SOS.
        `;

        // SMS message
        const smsMessage =
            `EMERGENCY SOS ALERT! Someone needs help. Location: ${mapLink}`;

        // ==========================================
        // SEND EMAIL NOTIFICATIONS
        // ==========================================

        const emailContacts = contacts.filter(
            (contact) =>
                typeof contact.email === "string" &&
                contact.email.trim() !== ""
        );

        const emailResults = await Promise.all(
            emailContacts.map((contact) =>
                sendEmail(
                    contact.email,
                    emailSubject,
                    emailMessage
                )
            )
        );

        const emailsSent = emailResults.filter(
            (result) => result === true
        ).length;

        // ==========================================
        // SEND SMS NOTIFICATIONS
        // ==========================================

        const smsContacts = contacts.filter(
            (contact) =>
                typeof contact.phone === "string" &&
                contact.phone.trim() !== ""
        );

        const smsResults = await Promise.all(
            smsContacts.map((contact) =>
                sendSMS(
                    contact.phone,
                    smsMessage
                )
            )
        );

        const smsProcessed = smsResults.filter(
            (result) => result === true
        ).length;

        // ==========================================
        // SEND RESPONSE
        // ==========================================

        return res.status(201).json({
            success: true,
            message: "SOS alert saved successfully.",

            emailsSent: emailsSent,
            totalEmailContacts: emailContacts.length,

            smsProcessed: smsProcessed,
            totalSMSContacts: smsContacts.length,

            smsMode: process.env.SMS_MODE || "demo",

            alert: alert
        });

    } catch (error) {
        console.error("SOS Alert Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create SOS alert.",
            error: error.message
        });
    }
};


// ==========================================
// GET SOS ALERT HISTORY
// ==========================================

const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        return res.status(200).json({
            success: true,
            alerts: alerts
        });

    } catch (error) {
        console.error("Get Alerts Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to load alert history."
        });
    }
};


// ==========================================
// EXPORT FUNCTIONS
// ==========================================

module.exports = {
    createAlert,
    getAlerts
};