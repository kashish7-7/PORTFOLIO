import { useState, useEffect } from 'react';
import '../../styles/ChatbotModal.scss';

// Live Netlify AI Chatbot Link
export const CHATBOT_URL = "https://agent-6a990da4bcd23f7242f--steady-sherbet-4b56bd.netlify.app";

const ChatbotModal = ({ customLink = CHATBOT_URL }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Pop up 3 seconds after the website launches
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleChatClick = () => {
        if (customLink && customLink !== '#') {
            window.open(customLink, '_blank', 'noopener,noreferrer');
        } else {
            alert("Chatbot link will be attached once provided!");
        }
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div 
            className={`chatbot-modal-overlay ${isOpen ? 'visible' : ''}`} 
            onClick={handleClose}
        >
            {/* SVG filter that gives borders a slightly hand-drawn wobble */}
            <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }}>
                <filter id="roughen">
                    <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="7" result="noise" />
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.2" />
                </filter>
            </svg>

            <div 
                className="paper-card" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="tape"></div>
                <button className="close-btn" onClick={handleClose} aria-label="Close">✕</button>

                <div className="badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                    </svg>
                    AI ASSISTANT
                </div>

                <h2>Don't want to scroll through?</h2>
                <span className="headline-accent">
                    Chat with my personal chatbot!
                    <svg viewBox="0 0 200 8" preserveAspectRatio="none">
                        <path d="M2 5 Q 50 1, 100 5 T 198 4" stroke="#6c5ce7" strokeWidth="3" fill="none" strokeLinecap="round" />
                    </svg>
                </span>

                <p className="desc">
                    Skip the manual 3D exploration and talk directly with my AI assistant to get instant answers about my backend engineering experience, skills, and projects.
                </p>

                <button className="btn btn-primary" onClick={handleChatClick}>
                    💬 Chat With My Personal Chatbot ↗
                </button>
                <button className="btn btn-secondary" onClick={handleClose}>
                    Explore 3D Portfolio →
                </button>
            </div>
        </div>
    );
};

export default ChatbotModal;
