import React, { useState, useEffect } from "react";

const TextToSpeech = ({ text }) => {
  const [utterance, setUtterance] = useState(null);
  const [voices, setVoices] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US"; 
    u.rate = .9;

    setUtterance(u);

    const updateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
      const englishVoices = availableVoices.filter(voice =>
        voice.lang.startsWith("en")
      );
      if (englishVoices.length > 0) {
        // You may choose a specific English voice from the available English voices list
        u.voice = englishVoices[0]; // Choose the first English voice available
        setIsReady(true);
      }
    };

    updateVoices();

    synth.addEventListener("voiceschanged", updateVoices);

    return () => {
      synth.removeEventListener("voiceschanged", updateVoices);
      synth.cancel();
    };
  }, [text]);

  useEffect(() => {
    if (utterance && isReady) {
      window.speechSynthesis.speak(utterance);
    }
  }, [utterance, isReady]);

  return null; // No need to render anything here
};

export default TextToSpeech;
