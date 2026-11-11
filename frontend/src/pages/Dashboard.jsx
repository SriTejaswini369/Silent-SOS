
import { useState } from "react";
import "./Dashboard.css";

const API_URL = "http://10.111.18.46:5000/api";

function Dashboard() {
    const [location, setLocation] = useState(null);
    const [message, setMessage] = useState("");
    const [emailSummary, setEmailSummary] = useState("");
    const [smsSummary, setSmsSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSOS = () => {
        if (!navigator.geolocation) {
            setMessage("Geolocation is not supported by this browser.");
            return;
        }

        setLoading(true);
        setMessage("Getting your current location...");
        setEmailSummary("");
        setSmsSummary("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                setLocation({ latitude, longitude });

                try {
                    const response = await fetch(`${API_URL}/alerts`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({
                            latitude,
                            longitude
                        })
                    });

                    const data = await response.json();

                    if (data.success) {
                        setMessage("SOS alert saved successfully!");

                        // Email notification status
                        if (data.totalEmailContacts === 0) {
                            setEmailSummary(
                                "No emergency contacts with email addresses were found."
                            );
                        } else {
                            setEmailSummary(
                                `Emails sent successfully: ${data.emailsSent} out of ${data.totalEmailContacts}.`
                            );
                        }

                        // SMS notification status
                        if (data.totalSMSContacts === 0) {
                            setSmsSummary(
                                "No emergency contacts with phone numbers were found."
                            );
                        } else if (data.smsMode === "demo") {
                            setSmsSummary(
                                `Demo SMS processed: ${data.smsProcessed} out of ${data.totalSMSContacts} contacts. No real SMS was sent.`
                            );
                        } else {
                            setSmsSummary(
                                `SMS processed: ${data.smsProcessed} out of ${data.totalSMSContacts} contacts.`
                            );
                        }
                    } else {
                        setMessage(
                            data.message || "Unable to send SOS alert."
                        );
                    }
                } catch (error) {
                    setMessage("Unable to connect to the server.");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setLoading(false);
                setMessage(
                    "Location permission denied or unavailable."
                );
            },
            {
                enableHighAccuracy: true,
                timeout: 15000
            }
        );
    };

    return (
        <div className="dashboard">
            <h1>Emergency Dashboard</h1>

            <p className="dashboard-subtitle">
                Your safety starts with one action.
            </p>

            <div className="sos-container">
                <h2>Emergency Assistance</h2>

                <button
                    className="main-sos-button"
                    onClick={handleSOS}
                    disabled={loading}
                >
                    {loading ? "PLEASE WAIT..." : "SOS"}
                </button>

                <p>Press the button to create an emergency alert.</p>

                {message && (
                    <div className="dashboard-message">
                        {message}
                    </div>
                )}

                {emailSummary && (
                    <div className="dashboard-message">
                        📧 {emailSummary}
                    </div>
                )}

                {smsSummary && (
                    <div className="dashboard-message">
                        📱 {smsSummary}
                    </div>
                )}
            </div>

            <div className="location-card">
                <h2>📍 Your Location</h2>

                {location ? (
                    <>
                        <p>Latitude: {location.latitude}</p>
                        <p>Longitude: {location.longitude}</p>

                        <a
                            href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            View My Location on Google Maps
                        </a>
                    </>
                ) : (
                    <p>Location not fetched yet.</p>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
