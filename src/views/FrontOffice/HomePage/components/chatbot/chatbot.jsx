import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './chatbot.css'

const Chatbot = () => {
    const [userMessage, setUserMessage] = useState('');
    const [botResponses, setBotResponses] = useState([]);
    const [currentOptions, setCurrentOptions] = useState([]);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const allQuestions = [
        "Qu'est-ce que LinkUpTournament ?",
        "Comment je peux faire une réservation pour un match ?",
        "Comment je peux saisir un avis sur un match ?",
        "Comment je peux voir tous les tournois disponibles ?"
    ];

    useEffect(() => {
        fetchInitialMessage();
    }, []);

    const fetchInitialMessage = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:3000/api/chatbot/initial');
            setBotResponses([{ type: 'bot', content: response.data.response }]);
            setCurrentOptions(response.data.options ?? []);
        } catch (error) {
            console.error('Error fetching initial message:', error);
        }
    };

    const sendMessage = async () => {
        if (userMessage.trim() !== '') {
            try {
                const response = await axios.post('http://localhost:3000/api/chatbot', { message: userMessage });
                setBotResponses(prevResponses => [
                    ...prevResponses,
                    { type: 'user', content: userMessage }
                ]);
                setBotResponses(prevResponses => [
                    ...prevResponses,
                    { type: 'bot', content: response.data.response }
                ]);
                setUserMessage('');
                setSuggestedQuestions([]);
                if (response.data.options) {
                    setCurrentOptions(response.data.options);
                } else {
                    setCurrentOptions([]);
                }

           
              
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    const handleOptionSelect = (option) => {
        sendMessage(option);
    };

    const toggleChatbot = () => {
        setIsChatbotOpen(true);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const searchQuestions = (text) => {
        if (text.trim() === '') {
            setSuggestedQuestions([]);
        } else {
            const keywords = text.trim().toLowerCase().split(" ");
            const matchedQuestions = allQuestions.filter(question =>
                keywords.some(keyword =>
                    question.toLowerCase().includes(keyword)
                )
            );
            setSuggestedQuestions(matchedQuestions);
        }
    };

    return (
        <div className="chatbot-container">
            {!isChatbotOpen && (
                <button className="chatbot-button" onClick={toggleChatbot}>
                    <img src="/images/chatbot.png" alt="Bot Icon" />
                </button>
            )}
            {isChatbotOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="avatar">
                            <img src="/images/chatbot.png" alt="Bot Avatar" />
                        </div>
                        <div className="bot-info">
                            <div className="bot-name">LinkUpTournament </div>
                            <div className="bot-status">Online</div>
                        </div>
                        <button className="close-button" onClick={() => setIsChatbotOpen(false)}>X</button>
                    </div>
                    <div className="chat-messages">
                        {botResponses.slice().reverse().map((message, index) => (
                            <div key={index} className={message.type === 'user' ? 'user-message' : 'bot-message'}>
                                {message.type === 'bot' && (
                                    <div className="avatar">
                                        <img src="/images/chatbot.png" alt="Bot Avatar" />
                                    </div>
                                )}
                                <div className="message-content">
                                    {message.type === 'user' ? 'You: ' : ''}
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => {
                                setUserMessage(e.target.value);
                                searchQuestions(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Type your message.."
                        />
                      <button className="btn-color" onClick={sendMessage}>Send</button>

                    </div>
                    <div className="suggested-questions">
                        {suggestedQuestions.map((question, index) => (
                            <div key={index} className="suggested-question" onClick={() => setUserMessage(question)}>
                                <span className="suggested-question-text">{question}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
