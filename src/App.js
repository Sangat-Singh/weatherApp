import React, { useState } from "react";
import EarthLoader from "./EarthLoader";
import CurrentLocation from "./currentLocation";
import Forecast from "./forcast";
import ChatBotComponent from "./ChatBotComponent"; // ✅ Chatbot import
import { Link } from "react-scroll";
import "./App.css";
import forecastBackground from "./assets/forecast-bg.jpg";

function MainApp() {
  return (
    <>
      {/* Page 1 - Current Weather */}
      <div className="container row-layout" id="current-weather">
  <div className="left-content">
    <CurrentLocation />
    <div className="button-container">
      <Link to="forecast-section" smooth={true} duration={500}>
        <button className="scroll-btn">View 7-Day Forecast ↓</button>
      </Link>
    </div>
  </div>

  <div className="right-content">
    <ChatBotComponent />
  </div>
</div>


      {/* Animated Divider */}
      <div className="wave-divider">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0096FF" />
              <stop offset="100%" stopColor="#2c3e50" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGradient)"
            d="M0,160 C360,240 1080,80 1440,160L1440,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="5s"
              repeatCount="indefinite"
              values="
                M0,160 C360,240 1080,80 1440,160L1440,320L0,320Z;
                M0,180 C400,100 1040,260 1440,160L1440,320L0,320Z;
                M0,160 C360,240 1080,80 1440,160L1440,320L0,320Z
              "
            />
          </path>
        </svg>
      </div>

      {/* Page 2 - Forecast */}
      <div
        id="forecast-section"
        className="forecast-container"
        style={{
          height: "100vh",
          padding: "2rem",
          backgroundImage: `url(${forecastBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <Forecast />
        <p style={{ marginTop: "2rem", color: "white" }}>
          | Developed by <strong>Sangat Singh</strong>
        </p>
      </div>
    </>
  );
}

// App loader wrapper
function App() {
  const [loading, setLoading] = useState(true);

  return loading ? (
    <EarthLoader onComplete={() => setLoading(false)} />
  ) : (
    <MainApp />
  );
}

export default App;
