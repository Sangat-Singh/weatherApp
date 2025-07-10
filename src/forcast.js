import React, { useState, useEffect } from "react";
import axios from "axios";
import apiKeys from "./apiKeys";
import ReactAnimatedWeather from "react-animated-weather";

import sunnyVideo from './videos/sunny.mp4';
import rainVideo from './videos/rain.mp4';
import snowVideo from './videos/snow.mp4';
import cloudyVideo from './videos/cloudy.mp4';
import defaultVideo from './videos/default.mp4';

const getBackgroundVideo = (weather) => {
  switch (weather) {
    case "Clear":
    case "Sunny":
      return sunnyVideo;
    case "Rain":
    case "Drizzle":
      return rainVideo;
    case "Snow":
      return snowVideo;
    case "Clouds":
      return cloudyVideo;
    default:
      return defaultVideo;
  }
};

const getWeatherIcon = (weatherMain) => {
  switch (weatherMain) {
    case "Clear":
      return "CLEAR_DAY";
    case "Rain":
    case "Drizzle":
      return "RAIN";
    case "Snow":
      return "SNOW";
    case "Clouds":
      return "CLOUDY";
    case "Thunderstorm":
      return "WIND";
    default:
      return "PARTLY_CLOUDY_DAY";
  }
};

function Forecast() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null);
  const [daily, setDaily] = useState([]);

  const defaults = {
    color: "white",
    size: 80,
    animate: true,
  };

  useEffect(() => {
    fetchWeather("Delhi");
    fetchDailyForecast("Delhi");
  }, []);

  const fetchWeather = (city) => {
    axios
      .get(
        `${apiKeys.base}weather?q=${city}&units=metric&appid=${apiKeys.key}`
      )
      .then((res) => {
        setWeather(res.data);
        setError("");
      })
      .catch(() => {
        setWeather(null);
        setError({ message: "Not Found", query: city });
      });
  };

  const fetchDailyForecast = (city) => {
    axios
      .get(
        `${apiKeys.base}forecast?q=${city}&appid=${apiKeys.key}&units=metric`
      )
      .then((res) => {
        const data = res.data.list;
        const dailyMap = {};

        data.forEach((entry) => {
          const date = entry.dt_txt.split(" ")[0];
          if (!dailyMap[date]) {
            dailyMap[date] = [];
          }
          dailyMap[date].push(entry);
        });

        const dailyData = Object.values(dailyMap)
          .slice(0, 7)
          .map((day) =>
            day.find((d) => d.dt_txt.includes("12:00:00")) || day[0]
          );

        setDaily(dailyData);
      })
      .catch(console.error);
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      fetchWeather(query.trim());
      fetchDailyForecast(query.trim());
    }
  };

  const currentWeatherMain = weather?.weather?.[0]?.main || "";

  return (
    <>
      <video autoPlay loop muted playsInline className="video-background">
        <source src={getBackgroundVideo(currentWeatherMain)} type="video/mp4" />
      </video>

      <div className="forecast">
        <div className="forecast-icon">
          <ReactAnimatedWeather
            icon={getWeatherIcon(currentWeatherMain)}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
        </div>

        <div className="today-weather">
          <h3>{currentWeatherMain}</h3>
          <div className="search-box">
            <input
              type="text"
              className="search-bar"
              placeholder="Search any city"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <div className="img-box">
              <img
                src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
                onClick={handleSearchClick}
                alt="search"
              />
            </div>
          </div>

          {weather && (
            <ul>
              <li>{weather.name}, {weather.sys.country}</li>
              <li>Temperature: {Math.round(weather.main.temp)}°C</li>
              <li>Humidity: {weather.main.humidity}%</li>
              <li>Visibility: {weather.visibility} m</li>
              <li>Wind Speed: {weather.wind.speed} km/h</li>
            </ul>
          )}
        </div>

        {/* 7-Day Forecast */}
        {daily.length > 0 && (
          <div className="daily-forecast">
            <h3>7-Day Forecast</h3>
            <div className="forecast-grid">
              {daily.map((day, index) => (
                <div key={index} className="forecast-day">
                  <p>{new Date(day.dt_txt).toDateString()}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt="icon"
                  />
                  <p>{Math.round(day.main.temp)}°C</p>
                  <p>{day.weather[0].main}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Forecast;
