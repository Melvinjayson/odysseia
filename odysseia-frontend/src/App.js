import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import VoiceCaptureScreen from "./components/VoiceCaptureScreen";
import ResultsScreen from "./components/ResultsScreen";

function App() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([]);

  // Navigation handlers
  const handleStartVoice = () => {
    window.location.href = "/voice";
  };
  const handleStopVoice = () => {
    window.location.href = "/results";
  };
  const handleCancelVoice = () => {
    window.location.href = "/";
  };
  const handleInput = (input) => {
    setPrompt(input);
    window.location.href = "/results";
  };
  // Response management stubs
  const handleCopy = (msg) => navigator.clipboard.writeText(msg.text);
  const handleEdit = (msg) => alert("Edit: " + msg.text);
  const handleShare = (msg) => alert("Share: " + msg.text);
  const handleReload = (msg) => alert("Reload: " + msg.text);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen onStartVoice={handleStartVoice} />} />
        <Route path="/voice" element={<VoiceCaptureScreen onStop={handleStopVoice} onCancel={handleCancelVoice} prompt={prompt} />} />
        <Route path="/results" element={<ResultsScreen onCopy={handleCopy} onEdit={handleEdit} onShare={handleShare} onReload={handleReload} onInput={handleInput} />} />
      </Routes>
    </Router>
  );
}

export default App;
