import React, { useState } from "react";
import "./index.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const addMessage = (type, text) => {
    setMessages((prev) => [...prev, { type, text, id: Date.now() + Math.random() }]);
  };

  const startConversation = () => {
    const aiText =
      "Hi there! I see a colorful ice cream shop! Which ice cream flavor would you choose?";
    setMessages([{ type: "ai", text: aiText, id: Date.now() }]);
    speak(aiText);
  };

  const startListening = () => {
    if (isListening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    setIsListening(true);
    recognition.start();

    recognition.onresult = async (event) => {
      recognition.stop();
      const transcript = event.results[0][0].transcript;
      addMessage("child", transcript);

      try {
        const response = await fetch("http://127.0.0.1:5000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: transcript }),
        });

        const data = await response.json();

        if (data.reply) {
          addMessage("ai", data.reply);
          speak(data.reply);
        }
      } catch (error) {
        addMessage("error", "Could not reach the server. Is it running?");
      }

      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };
  };

  const META = {
    ai:    { avatar: "🤖", label: "Ice Cream AI" },
    child: { avatar: "🧒", label: "You" },
    error: { avatar: "⚠️", label: "Error" },
  };

  return (
    <div className="app">

      <header className="app-header">
        <span className="scoop-emoji">🍦</span>
        <div className="neon-frame">
          <h1>Ice Cream AI Friend</h1>
        </div>
        <p className="tagline">Your Sweet-Talking AI Pal</p>
      </header>

      <div className="card">
        <div className="card-top" />
        <div className="card-body">

          <div className="section-label">🍧 Controls</div>

          <div className="btn-row">
            <button className="btn btn-start" onClick={startConversation}>
              ✨ Start Chat
            </button>
            <button
              className={`btn btn-mic${isListening ? " is-listening" : ""}`}
              onClick={startListening}
              disabled={isListening}
            >
              {isListening ? "🔴 Listening…" : "🎤 Answer"}
            </button>
          </div>

          <div className={`listen-status${isListening ? " visible" : ""}`}>
            <div className="wave-bars">
              <span /><span /><span /><span /><span />
            </div>
            <span className="listen-text">Listening for your answer…</span>
          </div>

          <div className="section-label">💬 Conversation</div>

          <div className="convo-box">
            {messages.length === 0 ? (
              <span className="convo-placeholder">
                Press "Start Chat" to begin!
              </span>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`msg msg-${msg.type}`}>
                  <div className="msg-avatar">{META[msg.type].avatar}</div>
                  <div className="msg-content">
                    <div className="msg-label">{META[msg.type].label}</div>
                    <div className="msg-bubble">{msg.text}</div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      <div className="flavor-strip">
        {[
          ["🍓 Strawberry", "ft-strawberry"],
          ["🍃 Mint Chip",  "ft-mint"],
          ["🍮 Vanilla",    "ft-vanilla"],
          ["🫐 Blueberry",  "ft-blueberry"],
          ["🍯 Caramel",    "ft-caramel"],
          ["Butterscotch",   "ft-butterscotch"],
        ].map(([label, cls]) => (
          <span key={label} className={`flavor-tag ${cls}`}>{label}</span>
        ))}
      </div>

      <footer className="app-footer">MADE WITH 🍦 + AI MAGIC</footer>
    </div>
  );
}

export default App;