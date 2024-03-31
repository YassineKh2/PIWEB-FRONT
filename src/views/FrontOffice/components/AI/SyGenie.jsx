import React, { useState, useEffect, useRef } from "react";
import TextToSpeech from "./TextToSpeech";
import SpeechToText from "./SpeechToText";
import { useNavigate } from 'react-router-dom';
import { gemini } from "../../../../Services/FrontOffice/ApiSyGenie";

export default function SyGenie() {
  const [transcript, setTranscript] = useState("");
  const navigate = useNavigate();
  const [speech, setSpeech] = useState(null);
  const [listening, setListening] = useState(false);
  const synth = useRef(window.speechSynthesis);
  const speakingUtterance = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
              navigate("/team/all");
          }, 4000);
      } else if (dialog.includes('HELLO')) {
        try {
          setListening(true); // Provide feedback that the system is processing the input
          const rep = await gemini(transcript);
          setListening(false); // Stop providing feedback after processing
          if (rep) {
            setSpeech({
              text: rep
            });
            console.log("dialog",rep);
          }
         
        } catch (error) {
          console.error("Error fetching data from the Gemini API:", error);
          // Handle error: Show an error message to the user
          setSpeech({
            text: "Sorry, I encountered an error while processing your request. Please try again later."
          });
        }
      }else if(dialog.includes('GO TO ABOUT')){
        setSpeech({
            text: "OK, going right now."
        });

        setTimeout(() => {
            navigate("/about");
        }, 4000);
      }else if(dialog.includes('GO TO TOURNAMENT')){
        setSpeech({
            text: "OK, going right now."
        });

        setTimeout(() => {
            navigate("/tournament/showAll");
        }, 4000);
      }else if(dialog.includes('WHO ARE YOU')){
        setSpeech({
            text: "I am SyGenie, an artificial intelligence language model developed by Ghribi Syrine.  My purpose is to assist users like yourself by providing information, answering questions,  and engaging in conversation on football. If you have any questions or need assistance, feel free to ask"
        });

       
      }
      else if(dialog.includes('GO TO MY PROFILE')){
        setSpeech({
            text: "OK, going right now."
        });

        setTimeout(() => {
            navigate("/profile");
        }, 4000);
      }
    };

    fetchData();
  }, [transcript]);

  const handleTranscriptChange = (newTranscript) => {
    setTranscript(newTranscript.toUpperCase());
    setSpeech(null);
    // Cancel speech synthesis when transcript changes
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
