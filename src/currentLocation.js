import React from "react";
import apiKeys from "./apiKeys";
import Clock from "react-live-clock";
import Forcast from "./forcast2";
import loader from "./images/WeatherIcons.gif";
import ReactAnimatedWeather from "react-animated-weather";
import "./chatbot.css";


const dateBuilder = (d) => {
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const defaults = {
  color: "white",
  size: 112,
  animate: true,
};

class Weather extends React.Component {
  state = {
    lat: undefined,
    lon: undefined,
    errorMessage: undefined,
    temperatureC: undefined,
    temperatureF: undefined,
    city: undefined,
    country: undefined,
    humidity: undefined,
    description: undefined,
    icon: "CLEAR_DAY",
    sunrise: undefined,
    sunset: undefined,
    errorMsg: undefined,
    isLoading: true,
    main: undefined,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      this.getPosition()
        .then((position) => {
          this.getWeather(position.coords.latitude, position.coords.longitude);
        })
        .catch((err) => {
          this.getWeather(28.67, 77.22);
          alert("Location access denied. Using default location for weather data.");
        });
    } else {
      alert("Geolocation not available");
    }

    this.intervalInitialized = false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.intervalInitialized && this.state.lat !== undefined && this.state.lon !== undefined) {
      this.timerID = setInterval(
        () => this.getWeather(this.state.lat, this.state.lon),
        600000
      );
      this.intervalInitialized = true;
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getPosition = (options) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  getWeather = async (lat, lon) => {
    this.setState({ isLoading: true, errorMsg: undefined });
    try {
      const api_call = await fetch(
        `${apiKeys.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${apiKeys.key}`
      );
      const data = await api_call.json();

      if (data.cod !== 200) throw new Error(data.message || "Failed to fetch weather data");

      if (!data.main || !data.weather?.[0] || !data.sys)
        throw new Error("Invalid weather data structure");

      this.setState({
        lat,
        lon,
        city: data.name,
        temperatureC: Math.round(data.main.temp),
        temperatureF: Math.round(data.main.temp * 1.8 + 32),
        humidity: data.main.humidity,
        main: data.weather[0].main,
        country: data.sys.country,
        isLoading: false,
        errorMsg: undefined,
      });

      this.updateIcon(data.weather[0].main);

    } catch (error) {
      this.setState({
        errorMsg: error.message,
        isLoading: false
      });
      console.error("Weather fetch error:", error);
    }
  };

  updateIcon = (weatherMain) => {
    const iconMap = {
      "Haze": "CLEAR_DAY",
      "Clouds": "CLOUDY",
      "Rain": "RAIN",
      "Snow": "SNOW",
      "Dust": "WIND",
      "Drizzle": "SLEET",
      "Fog": "FOG",
      "Smoke": "FOG",
      "Tornado": "WIND",
    };

    this.setState({ icon: iconMap[weatherMain] || "CLEAR_DAY" });
  };

  renderContent() {
    const { errorMsg, isLoading, temperatureC, city, country, main, icon } = this.state;

    if (errorMsg) {
      return (
        <div style={{ textAlign: "center", color: "white" }}>
          <h3 style={{ fontSize: "22px", fontWeight: "600" }}>Error: {errorMsg}</h3>
          <p>Please try refreshing the page or check your network connection.</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div style={{ textAlign: "center" }}>
          <img src={loader} alt="loading..." style={{ width: "50%", WebkitUserDrag: "none" }} />
          <h3 style={{ color: "white", fontSize: "22px", fontWeight: "600" }}>
            Detecting your location
          </h3>
        </div>
      );
    }

    return (
      <div className="city" style={{ textAlign: "center", color: "white" }}>
        <div className="title">
          <h2>{city}</h2>
          <h3>{country}</h3>
        </div>

        <div className="mb-icon" style={{ margin: "20px 0" }}>
          <ReactAnimatedWeather
            icon={icon}
            color={defaults.color}
            size={defaults.size}
            animate={defaults.animate}
          />
          <p style={{ fontSize: "20px" }}>{main}</p>
        </div>

        <div
          className="date-time"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            borderRadius: "10px",
            margin: "0 auto",
            maxWidth: "400px"
          }}
        >
          <div className="dmy" style={{ textAlign: "left" }}>
            <div className="current-time" style={{ fontSize: "24px", fontWeight: "bold" }}>
              <Clock format="HH:mm:ss" interval={1000} ticking={true} />
            </div>
            <div className="current-date" style={{ fontSize: "14px", marginTop: "5px" }}>
              {dateBuilder(new Date())}
            </div>
          </div>
          <div className="temperature" style={{ fontSize: "48px", fontWeight: "bold" }}>
            {temperatureC}°<span style={{ fontSize: "24px" }}>C</span>
          </div>
        </div>

        <Forcast icon={icon} weather={main} />
      </div>
    );
  }

  render() {
    return <React.Fragment>{this.renderContent()}</React.Fragment>;
  }
}

export default Weather;
