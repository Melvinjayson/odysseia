import React from 'react';
import logo from './logo.svg';
import './App.css';

jsx
import React from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import VoiceCaptureScreen from './components/VoiceCaptureScreen';
import ResultsScreen from './components/ResultsScreen';
// import './App.css'; // Keep if you have custom styles

function App() {
  // For demo, render WelcomeScreen. Add routing or state to switch screens as needed.
  return (
    <div>
      <WelcomeScreen />
      {/* <VoiceCaptureScreen /> */}
      {/* <ResultsScreen /> */}
    </div>
  );
}

export default App;


