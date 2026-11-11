const sendSMS = async (to, message) => {
    try {
        if (process.env.SMS_MODE !== "live") {
            console.log("===== DEMO SMS =====");
            console.log("To:", to);
            console.log("Message:", message);
            console.log("====================");

            return true;
        }

        // Real SMS integration will be enabled
        // after Exotel Sender ID and DLT approval.

        console.log("Exotel SMS integration is not activated yet.");

        return false;

    } catch (error) {
        console.error("SMS sending failed:", error.message);
        return false;
    }
};

module.exports = sendSMS;