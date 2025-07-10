// EarthLoader.js
import React, { useEffect, useState } from "react";
import "./App.css";
import earthImage from "./images/earth.jpg"; // Or .png

const EarthLoader = ({ onComplete }) => {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setZoomed(true);
      setTimeout(() => onComplete(), 3000); // After zoom animation
    }, 1000); // Delay before zoom starts
  }, [onComplete]);

  return (
    <div className={`earth-loader ${zoomed ? "zoomed" : ""}`}>
      <img src={earthImage} alt="Earth Zoom" />
    </div>
  );
};

export default EarthLoader;
