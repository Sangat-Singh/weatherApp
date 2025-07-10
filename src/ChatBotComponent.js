import React, { useState } from "react";
import Lottie from "lottie-react";
import "./chatbot.css";

// Lottie animations
import idleAnim from "./lottie/idle.json";
import happyAnim from "./lottie/happy.json";
import confusedAnim from "./lottie/confused.json";
import errorAnim from "./lottie/error.json";
import sunnyAnim from "./lottie/sunny.json";
import cloudyAnim from "./lottie/cloudy.json";
import rainyAnim from "./lottie/rain.json";
import stormyAnim from "./lottie/storm.json";
// import snowyAnim from "./lottie/snowy.json";
// import foggyAnim from "./lottie/foggy.json";

function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "\uD83C\uDF24\uFE0F Hi! Ask me about the weather in any city." }
  ]);
  const [input, setInput] = useState("");
  const [showFAQs, setShowFAQs] = useState(false);
  const [botMood, setBotMood] = useState("idle");

  const faqs = [
    "What can you do?",
    "Who made you?",
    "Tell me a joke",
    "Are you a real person?",
    "What’s the weather like?",
    "Do I need an umbrella today?",
    "What’s the forecast for tomorrow?",
    "What is humidity?",
    "What's the weather in Delhi?",
    "Will it rain in Tokyo?"
  ];

  const getBotReply = async (input) => {
    const message = input.toLowerCase();
    const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

    const cityMatch = message.match(/(?:weather|temperature|rain)[^a-zA-Z]*in\s+([a-zA-Z\s]+)$/);
    if (cityMatch) {
      const city = cityMatch[1]?.trim();

      if (!city || city.length < 2) {
        setBotMood("confused");
        return "\u26A0\uFE0F Please specify a valid city name. Example: 'weather in Delhi'";
      }

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await res.json();

        if (data.cod !== 200 || !data.main || !data.weather) {
          setBotMood("confused");
          return `\u274C I couldn't find weather info for "${city}".`;
        }

        const description = data.weather[0].description;
        const main = data.weather[0].main.toLowerCase();
        const temp = data.main.temp;
        const humidity = data.main.humidity;

        // Set bot mood based on weather condition
        if (main.includes("clear")) setBotMood("sunny");
        else if (main.includes("cloud")) setBotMood("cloudy");
        else if (main.includes("rain") || main.includes("drizzle")) setBotMood("rainy");
        else if (main.includes("thunderstorm")) setBotMood("stormy");
        else if (main.includes("snow")) setBotMood("snowy");
        else if (main.includes("mist") || main.includes("fog") || main.includes("haze")) setBotMood("foggy");
        else setBotMood("confused");

        const rain = description.toLowerCase().includes("rain") ? "Yes \uD83C\uDF27\uFE0F" : "No \uD83C\uDF24\uFE0F";

        return `Here's the latest weather update for ${city.charAt(0).toUpperCase() + city.slice(1)}:
\uD83C\uDF21\uFE0F It's currently ${temp}\u00B0C with ${description}.
\uD83D\uDCA7 Humidity is around ${humidity}%.
\uD83C\uDF26\uFE0F Will it rain? ${rain === "Yes \uD83C\uDF27\uFE0F" ? "Yes, so you might want an umbrella! \u2614" : "Nope, skies look mostly clear! \uD83D\uDE0A"}`;
      } catch (err) {
        setBotMood("error");
        return "\u26A0\uFE0F Failed to fetch weather. Try again later.";
      }
    }

    if (message.includes("hello") || message.includes("hi")) {
      setBotMood("happy");
      return "\uD83D\uDC4B Hey! You can ask me like: 'weather in Delhi' or 'temperature in Mumbai'";
    }

    if (message.includes("help")) {
      setBotMood("idle");
      setShowFAQs(true);
      return (
        "\uD83D\uDEA9 You can ask me these questions:\n" +
        faqs.map((q) => `❓ ${q}`).join("\n") +
        "\n\n\uD83D\uDCCC Click a question below to ask it instantly!"
      );
    }

    // FAQ replies
    setBotMood("happy");
    switch (message) {
      case "what can you do?":
        return "\uD83E\uDD16 I can tell you the current weather in any city. Just ask something like 'weather in London'.";
      case "who made you?":
        return "\uD83D\uDEE0\uFE0F I was built by a developer who loves combining weather data with smart chat responses!";
      case "tell me a joke":
        return "\uD83E\uDD23 Why did the sun go to school? To get a little brighter!";
      case "are you a real person?":
        return "\uD83D\uDE04 Nope, I'm just a smart little chatbot here to help with weather info!";
      case "what’s the weather like?":
        return "\uD83C\uDF0D I can check the weather for any city! Try saying: 'What's the weather in Tokyo?'";
      case "do i need an umbrella today?":
        return "\u2614\uFE0F I can help with that — just tell me your city like 'Will it rain in Delhi?'";
      case "what’s the forecast for tomorrow?":
        return "\uD83D\uDCC5 I'm currently showing live weather updates only. But I might get smarter soon!";
      case "what is humidity?":
        return "\uD83D\uDCA7 Humidity is the amount of water vapor in the air. I show it in my weather updates too!";
      default:
        setBotMood("confused");
        return "\uD83E\uDD14 I didn't understand that. Try asking about the weather in a specific city.";
    }
  };

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    const userMessage = { from: "user", text };
    setMessages((prev) => [...prev, userMessage]);
    setShowFAQs(false);

    const botReply = await getBotReply(text);
    setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    setInput("");
  };

  const getAnimation = () => {
    switch (botMood) {
      case "sunny": return sunnyAnim;
      case "cloudy": return cloudyAnim;
      case "rainy": return rainyAnim;
      case "stormy": return stormyAnim;
      case "snowy": return snowyAnim;
      case "foggy": return foggyAnim;
      case "happy": return happyAnim;
      case "confused": return confusedAnim;
      case "error": return errorAnim;
      default: return idleAnim;
    }
  };

  return (
    <div className="chatbot-wrapper">
      <div className="robot-animation">
        <Lottie animationData={getAnimation()} loop autoplay />
      </div>

      <div className="chatbot-container">
        <div className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-message ${msg.from}`}>
              {msg.text.split("\n").map((line, j) => (
                <div key={j}>{line}</div>
              ))}
            </div>
          ))}

          {showFAQs && (
            <div className="faq-buttons">
              {faqs.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} className="faq-button">
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="input-box">
          <input
            type="text"
            value={input}
            placeholder="Ask about any city's weather..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
