const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        latitude: {
            type: Number,
            required: true
        },

        longitude: {
            type: Number,
            required: true
        },

        address: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["sent", "acknowledged", "resolved"],
            default: "sent"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Alert", alertSchema);