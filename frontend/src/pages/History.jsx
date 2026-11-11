
import { useEffect, useState } from "react";
import "./History.css";

const API_URL = "http://10.111.18.46:5000/api";

function History() {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch(`${API_URL}/alerts`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });

                const data = await response.json();

                if (data.success) {
                    setAlerts(data.alerts);
                } else {
                    setMessage(data.message || "Unable to load alert history.");
                }
            } catch (error) {
                setMessage("Unable to connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    return (
        <div className="history-page">
            <h1>SOS Alert History</h1>

            <p className="history-subtitle">
                View your previous emergency alerts.
            </p>

            {loading && <p>Loading alerts...</p>}

            {message && <p className="history-message">{message}</p>}

            {!loading && alerts.length === 0 && !message && (
                <p>No SOS alerts found.</p>
            )}

            <div className="history-list">
                {alerts.map((alert) => (
                    <div className="history-card" key={alert._id}>
                        <h3>🚨 Emergency Alert</h3>

                        <p>
                            <strong>Date:</strong>{" "}
                            {new Date(alert.createdAt).toLocaleString()}
                        </p>

                        <p>
                            <strong>Latitude:</strong> {alert.latitude}
                        </p>

                        <p>
                            <strong>Longitude:</strong> {alert.longitude}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            <span className={`status ${alert.status}`}>
                                {alert.status}
                            </span>
                        </p>

                        <a
                            href={`https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="map-button"
                        >
                            📍 View Location on Map
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default History;
