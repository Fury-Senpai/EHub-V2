
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleChat, sendMessage, addUserMessage } from '../redux/slices/chatbotSlice';
import { FaCommentDots, FaPaperPlane, FaSpinner, FaTimes } from 'react-icons/fa';

const Chatbot = () => {
    const dispatch = useDispatch();
    const { isOpen, messages, isLoading } = useSelector((state) => state.chatbot);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            dispatch(addUserMessage(input));
            dispatch(sendMessage({ message: input }));
            setInput('');
        }
    };

    return (
        <>
            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-5 w-80 h-[28rem] bg-dark-gray border border-light-gray rounded-lg shadow-xl flex flex-col z-40">
                    {/* Header */}
                    <div className="flex justify-between items-center p-3 bg-light-gray border-b border-gray-600">
                        <h3 className="text-white font-bold">AI Assistant</h3>
                        <button onClick={() => dispatch(toggleChat())} className="text-gray-300 hover:text-white">
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex mb-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.from === 'user' ? 'bg-primary-orange text-dark-gray' : 'bg-light-gray text-white'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-3 py-2 rounded-lg bg-light-gray text-white">
                                    <FaSpinner className="animate-spin" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Form */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-light-gray border-t border-gray-600 flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask for a suggestion..."
                            className="flex-1 bg-dark-gray border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-orange"
                        />
                        <button type="submit" className="ml-3 text-primary-orange hover:text-white disabled:text-gray-500" disabled={isLoading}>
                            <FaPaperPlane size={20}/>
                        </button>
                    </form>
                </div>
            )}

            {/* Floating Toggle Button */}
            <button
                onClick={() => dispatch(toggleChat())}
                className="fixed bottom-5 right-5 bg-primary-orange text-dark-gray p-4 rounded-full shadow-lg hover:bg-opacity-90 transition-all z-50"
            >
                <FaCommentDots size={24} />
            </button>
        </>
    );
};

export default Chatbot;
