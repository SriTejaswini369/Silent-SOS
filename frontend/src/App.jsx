import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

const API_URL = "http://10.111.18.46:5000/api";

function App() {
  const [page, setPage] = useState("home");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [contacts, setContacts] = useState([]);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    email: "",
    relationship: ""
  });

  const [message, setMessage] = useState("");

  // REGISTER USER
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData)
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        setRegisterData({
          name: "",
          email: "",
          password: "",
          phone: ""
        });

        setPage("login");
      }
   } catch (error) {
  console.error("Login error:", error);
  setMessage("Backend Error: " + error.message);
}
  };

  // LOGIN USER
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setMessage("Login successful!");

        setLoginData({
          email: "",
          password: ""
        });

        setPage("dashboard");
        loadContacts(data.token);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
  console.error("Login error:", error);
  setMessage("Backend Error: " + error.message);
}
  };

  // GET EMERGENCY CONTACTS
  const loadContacts = async (currentToken = token) => {
    try {
      const response = await fetch(`${API_URL}/contacts`, {
        headers: {
          Authorization: `Bearer ${currentToken}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setContacts(data.contacts);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Unable to load contacts.");
    }
  };

  // ADD EMERGENCY CONTACT
  const handleAddContact = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(contactData)
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        setContactData({
          name: "",
          phone: "",
          email: "",
          relationship: ""
        });

        loadContacts();
      }
    } catch (error) {
      setMessage("Unable to add contact.");
    }
  };

  // DELETE EMERGENCY CONTACT
  const handleDeleteContact = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this contact?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        loadContacts();
      }
    } catch (error) {
      setMessage("Unable to delete contact.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setContacts([]);
    setPage("home");
    setMessage("Logged out successfully.");
  };

  return (
    <div className="app">

      {/* NAVIGATION */}
      <nav className="navbar">
        <h2>🛡️ Silent SOS</h2>

        <div className="nav-links">
          <a href="#home" onClick={() => setPage("home")}>Home</a>
          <a href="#about" onClick={() => setPage("home")}>About</a>
          <a href="#features" onClick={() => setPage("home")}>Features</a>
          <a href="#contact" onClick={() => setPage("home")}>Contact</a>
        </div>

        <div>
          {token ? (
            <>
              <button
                className="login-btn"
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>

              <button
                className="login-btn"
                onClick={() => {
                  setPage("contacts");
                  loadContacts();
                }}
              >
                My Contacts
              </button>

              <button
                className="login-btn"
                onClick={() => setPage("history")}
              >
                Alert History
              </button>

              <button className="register-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="login-btn"
                onClick={() => {
                  setMessage("");
                  setPage("login");
                }}
              >
                Login
              </button>

              <button
                className="register-btn"
                onClick={() => {
                  setMessage("");
                  setPage("register");
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </nav>

      {message && (
        <div className="message-box">
          {message}
        </div>
      )}

      {/* HOME PAGE */}
      {page === "home" && (
        <>
          <section className="hero" id="home">
            <div className="hero-content">
              <h1>
                Your Safety.<br />
                Your Voice.<br />
                <span>Our Priority.</span>
              </h1>

              <p>
                Silent SOS is a personal safety platform
                designed to help you during emergency
                situations when speaking or calling is
                not possible.
              </p>

              <button
                className="get-started"
                onClick={() => setPage(token ? "dashboard" : "register")}
              >
                Get Started
              </button>
            </div>

            <div className="sos-card">
              <h2>Need Emergency Help?</h2>
              <div className="sos-circle">SOS</div>
              <p>Emergency assistance at your fingertips.</p>
              <small>Demo preview - Not activated</small>
            </div>
          </section>

          <section className="about" id="about">
            <h2>About Silent SOS</h2>
            <p>
              Our mission is to provide a simple and
              reliable way for people to request emergency
              assistance through silent alerts and
              location sharing.
            </p>
          </section>

          <section className="features" id="features">
            <h2>Our Safety Features</h2>

            <div className="feature-container">
              <div className="feature-card">
                <h3>🚨 Silent SOS</h3>
                <p>Send emergency alerts with a single action.</p>
              </div>

              <div className="feature-card">
                <h3>📍 Live Location</h3>
                <p>Share your location with trusted contacts.</p>
              </div>

              <div className="feature-card">
                <h3>👥 Emergency Contacts</h3>
                <p>Connect with your trusted people.</p>
              </div>
            </div>
          </section>

          <footer id="contact">
            <h2>Silent SOS</h2>
            <p>Your Safety, Our Priority.</p>
            <p>© 2026 Silent SOS. All rights reserved.</p>
          </footer>
        </>
      )}

      {/* REGISTER PAGE */}
      {page === "register" && (
        <section className="form-section">
          <form className="form-card" onSubmit={handleRegister}>
            <h2>Create Account</h2>
            <p>Register to use Silent SOS.</p>

            <input
              type="text"
              placeholder="Full Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
              required
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={registerData.phone}
              onChange={(e) =>
                setRegisterData({ ...registerData, phone: e.target.value })
              }
              required
            />

            <button type="submit" className="form-button">
              Register
            </button>

            <p>
              Already registered?{" "}
              <span onClick={() => setPage("login")}>Login</span>
            </p>
          </form>
        </section>
      )}

      {/* LOGIN PAGE */}
      {page === "login" && (
        <section className="form-section">
          <form className="form-card" onSubmit={handleLogin}>
            <h2>Welcome Back</h2>
            <p>Login to your Silent SOS account.</p>

            <input
              type="email"
              placeholder="Email Address"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              required
            />

            <button type="submit" className="form-button">
              Login
            </button>

            <p>
              New user?{" "}
              <span onClick={() => setPage("register")}>Create Account</span>
            </p>
          </form>
        </section>
      )}

      {/* EMERGENCY CONTACTS PAGE */}
      {page === "contacts" && token && (
        <section className="form-section">
          <div className="form-card contacts-card">
            <h2>Emergency Contacts</h2>
            <p>Add people you trust.</p>

            <form onSubmit={handleAddContact}>
              <input
                type="text"
                placeholder="Contact Name"
                value={contactData.name}
                onChange={(e) =>
                  setContactData({ ...contactData, name: e.target.value })
                }
                required
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={contactData.phone}
                onChange={(e) =>
                  setContactData({ ...contactData, phone: e.target.value })
                }
                required
              />

              <input
                type="email"
                placeholder="Email (Optional)"
                value={contactData.email}
                onChange={(e) =>
                  setContactData({ ...contactData, email: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Relationship (Friend, Family...)"
                value={contactData.relationship}
                onChange={(e) =>
                  setContactData({
                    ...contactData,
                    relationship: e.target.value
                  })
                }
                required
              />

              <button type="submit" className="form-button">
                Add Contact
              </button>
            </form>

            <h3 className="saved-heading">Saved Contacts</h3>

            {contacts.length === 0 ? (
              <p>No emergency contacts added yet.</p>
            ) : (
              contacts.map((contact) => (
                <div className="contact-item" key={contact._id}>
                  <div>
                    <h3>{contact.name}</h3>
                    <p>{contact.phone}</p>
                    <small>{contact.relationship}</small>
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteContact(contact._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      {/* EMERGENCY DASHBOARD */}
      {page === "dashboard" && token && (
        <Dashboard />
      )}

      {/* SOS ALERT HISTORY */}
      {page === "history" && token && (
        <History />
      )}

    </div>
  );
}

export default App;
