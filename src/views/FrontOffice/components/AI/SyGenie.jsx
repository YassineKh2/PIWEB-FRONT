import React, { useState, useEffect, useRef } from "react";
import TextToSpeech from "./TextToSpeech";
import SpeechToText from "./SpeechToText";
import { useNavigate } from 'react-router-dom';
import { gemini, sendEmailToAdmin } from "../../../../Services/FrontOffice/ApiSyGenie";
import AddReservation from "../Reservation/AddReservation";
import {  NumberProvider, useNumber } from "../Reservation/NumberContext";
import { getAllTeams } from "../../../../Services/FrontOffice/apiTeam";
import axios from "axios";

export default function SyGenie() {
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();
  const [speech, setSpeech] = useState(null);
  const [listening, setListening] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const speakingUtterance = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { setNumber } = useNumber();
  const [newsPromptSpoken, setNewsPromptSpoken] = useState(false);
  const [titleService, setTitles] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [sendEmail, setEmail] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: scroll,
      behavior: "smooth"
    });
  }, [scroll]);

  useEffect(() => {
    if (titleService) {
      let delay = 0;
      getAllTeams().then((response) => {
        const teams = response.teams;
        teams.forEach((team, index) => {
          setTimeout(() => {
            if (index % 3 === 0 && index !== 0) {
              setScroll((prevScroll) => prevScroll + 550);
            }
            setSpeech((prevSpeech) => {
              return { ...prevSpeech, text: team.name };
            });
          }, delay);
          delay += 2000;
        });
      });
      setTitles(false);
    }
  }, [titleService]);

  useEffect(() => {
    if (speech && transcript.includes("STOP")) {
      setSpeech(null);
      setScroll(0);
    } else if (!speech) {
      if (newsPromptSpoken && transcript.includes("YES")) {
        setTitles(true);
        setNewsPromptSpoken(false);
        setScroll(300);
      } else if (newsPromptSpoken && transcript.includes("NO")) {
        setSpeech({
          text: "As you like, do you need something else?"
        });
        setNewsPromptSpoken(false);
      }
    }
  }, [speech, transcript, newsPromptSpoken]);

  useEffect(() => {
    const fetchData = async () => {
      const dialog = transcript.toUpperCase();

      if (dialog.includes('HI')) {
        setSpeech({
          text: "Hello, I'm SyGenie. How can I help you today?",
        });
      } else if (dialog.includes('GO TO TEAM')) {
        setSpeech({
          text: "OK, going right now."
        });

        setTimeout(() => {
          navigate('/team/all');
          setTimeout(() => {
            setSpeech({
              text: "Do you want me to read the titles for you?",
            });
            setNewsPromptSpoken(true);
          }, 3000);
        }, 3500);
      } else if (dialog.includes('HELLO')) {
        try {
          setListening(true);
          const rep = await gemini(transcript);
          setListening(false);
          if (rep) {
            setSpeech({
              text: rep
            });
            console.log("dialog", rep);
          }
        } catch (error) {
          console.error("Error fetching data from the Gemini API:", error);
          setSpeech({
            text: "Sorry, I encountered an error while processing your request. Please try again later."
          });
        }
      } else if (dialog.includes('GO TO ABOUT')) {
        setSpeech({
          text: "OK, going right now."
        });

        setTimeout(() => {
          navigate("/about");
        }, 4000);
      } else if (dialog.includes('GO TO TOURNAMENT')) {
        setSpeech({
          text: "OK, going right now."
        });

        setTimeout(() => {
          navigate("/tournament/showAll");
        }, 4000);
      } else if (dialog.includes('WHO ARE YOU')) {
        setSpeech({
          text: "I am SyGenie, an artificial intelligence language model.  My purpose is to assist users like yourself by providing information, answering questions,  and engaging in conversation on football. If you have any questions or need assistance, feel free to ask"
        });
      } else if (dialog.includes('GO TO MY PROFILE')) {
        setSpeech({
          text: "OK, going right now."
        });

        setTimeout(() => {
          navigate("/profile");
        }, 4000);
      } else if (dialog.includes('SET NUMBER TO')) {
        const numberIndex = dialog.indexOf('SET NUMBER TO') + 'SET NUMBER TO'.length;
        const number = parseInt(dialog.slice(numberIndex).trim(), 10);
        setNumber(number);
      } else if (dialog.includes('HELP')) {
        setSpeech({
          text: "OK, going right now."
        });

        setTimeout(() => {
          navigate("/help");
        }, 4000);
      } else if (dialog.includes("E-MAIL")) {
        if (authData.user) {
          setSpeech({
            text: "Enter your message to send a quick email to the supervisor",
          });
          sendEmailToAdmin(authData.user.email, transcript, authData.user.name); // Envoie l'e-mail directement
        } else {
          setSpeech({
            text: "Please log in to our service so you can send email"
          });
        }
      }

    };

    fetchData();
  }, [transcript]);

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript.toUpperCase());
    setSpeech(null);
    if (isSpeaking) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSpeechStart = (utterance) => {
    speakingUtterance.current = utterance;
    setIsSpeaking(true);
  };

  const handleTextToSpeechClick = () => {
    if (isSpeaking) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <section className="pt-24 w-full">
      <div>
        <SpeechToText onTranscriptChange={handleTranscriptChange} language={"en-US"} />
        {listening && <p>Listening...</p>}
        {speech && <TextToSpeech text={speech.text} onSpeechStart={handleSpeechStart} onClick={handleTextToSpeechClick} />}
      </div>
    </section>
  );
}
