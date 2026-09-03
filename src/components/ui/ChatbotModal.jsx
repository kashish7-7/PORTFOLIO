import { useState, useEffect } from 'react';
import '../../styles/ChatbotModal.scss';

// You can update this chatbot link directly here or pass via props
export const CHATBOT_URL = "https://chat.example.com";

const ChatbotModal = ({ customLink = CHATBOT_URL }) => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Automatically show the popup modal when the site loads
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    if (!isOpen) return null;

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
        <div className="chatbot-modal-overlay" onClick={handleClose}>
            <div 
                className="chatbot-modal-card" 
                onClick={(e) => e.stopPropagation()}
            >
                <button className="chatbot-modal-close" onClick={handleClose} aria-label="Close modal">
                    ✕
                </button>
                
                <div className="chatbot-modal-badge">
                    <span className="chatbot-badge-icon">🤖</span>
                    <span>AI Assistant</span>
                </div>

                <h2 className="chatbot-modal-title">
                    Don't want to scroll through?
                </h2>
                <h3 className="chatbot-modal-subtitle">
                    Chat with my personal chatbot!
                </h3>

                <p className="chatbot-modal-description">
                    Skip the manual 3D exploration and talk directly with my AI assistant to get instant answers about my backend engineering experience, skills, and projects.
                </p>

                <div className="chatbot-modal-actions">
                    <button 
                        className="chatbot-btn-primary" 
                        onClick={handleChatClick}
                    >
                        <span>💬 Chat With My Personal Chatbot</span>
                        <span className="btn-arrow">↗</span>
                    </button>
                    <button 
                        className="chatbot-btn-secondary" 
                        onClick={handleClose}
                    >
                        <span>Explore 3D Portfolio</span>
                        <span className="btn-arrow">➔</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatbotModal;
