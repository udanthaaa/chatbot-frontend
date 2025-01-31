import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, Menu, Send, X } from 'lucide-react';
import Select from 'react-select';
import QuickActions from './QuickActions';
import TypingIndicator from './TypingIndicator';
import {formatExplanationContent} from '../format';

interface Message {
  text: string;
  isBot: boolean;
  isForm?: boolean;
}

interface ChatBoxProps {
  onClose: () => void;
}

const countries = [
  { value: 'sl', label: 'Sri Lanka' },
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'in', label: 'India' }
];

const ChatBox: React.FC<ChatBoxProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showBotIntro] = useState(true);
  const [showInitialOverlay, setShowInitialOverlay] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showInitialOverlay) {
      setTimeout(() => {
        setShowInitialOverlay(false);
      }, 1000);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;
  
    // Update local message state with the user message
    const newMessages = [...messages, { text, isBot: false }];
    setMessages(newMessages);
    setInputText('');  // Clear the input field
    setIsTyping(true);  // Set typing state to true
  
    // Send the message to the Flask backend (via a POST request)
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionID: '123' ,message: text, Language: 'English' }),
      });
  
      // Check if the response was successful
      if (!response.ok) {
        throw new Error('Failed to get response from the server');
      }
  
      // Get the response from the backend
      const data = await response.json();
  
      // Get the bot's reply from the response
      const botMessage = data.response;
  
      setTimeout(() => {
          setIsTyping(false);
          setMessages([
            ...newMessages,
            {
              text: botMessage || "Thank you for your message. Our team will get back to you shortly.",
              isBot: true,
            },
          ]);
        
      }, 1500);
    } catch (error) {
      setIsTyping(false);
      setMessages([
        ...newMessages,
        {
          text: "Sorry, something went wrong. Please try again later.",
          isBot: true,
        },
      ]);
      console.error("Error while sending message:", error);
    }
  };
  

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsTyping(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsTyping(false);
    setMessages([...messages, {
      text: "Thank you for providing your information. How else can I help you?",
      isBot: true
    }]);
    setShowForm(false);
  };

  return (
    <>
      <AnimatePresence>
        {showInitialOverlay && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-green-600 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1.2 }}
              transition={{ duration: 0.7 }}
            >
              <Bot className="w-24 h-24 text-white" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col h-full relative bg-white">
        <motion.div 
          className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {showBotIntro && (
                <motion.div
                  initial={{ scale: 1, x: '50vw', y: '40vh' }}
                  animate={{ scale: 1, x: 0, y: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <Bot className="w-8 h-8 text-green-600" />
                </motion.div>
              )}
            </AnimatePresence>
            <div>
              <h3 className="font-semibold tracking-wide text-gray-900">Haycarb Assistant</h3>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="hover:bg-gray-100 p-2 rounded-full"
          >
            <X className="w-5 h-5 text-gray-500" />
          </motion.button>
        </motion.div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    message.isBot
                      ? 'bg-white text-gray-800'
                      : 'bg-green-600 text-white'
                  }`}
                >
                  {message.isForm ? (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <Select
                        options={countries}
                        placeholder="Select Country"
                        className="text-gray-800"
                        isDisabled={isSubmitting}
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: '1rem',
                            border: '1px solid #e2e8f0',
                            padding: '0.25rem',
                            boxShadow: 'none',
                            '&:hover': {
                              border: '1px solid #10b981'
                            }
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#f0fdf4' : 'white',
                            ':active': {
                              backgroundColor: '#10b981'
                            }
                          })
                        }}
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-[15px]"
                        required
                        disabled={isSubmitting}
                      />
                      <input
                        type="text"
                        placeholder="Company"
                        className="w-full p-4 rounded-2xl border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-[15px]"
                        required
                        disabled={isSubmitting}
                      />
                      <motion.button
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-green-600 text-white py-4 rounded-2xl font-medium transition-all shadow-lg shadow-green-600/20 ${
                          isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                        }`}
                      >
                        {isSubmitting ? 'Submitted' : 'Submit'}
                      </motion.button>
                    </form>
                  ) : (
                    <p className="text-[15px] leading-relaxed"><div dangerouslySetInnerHTML={{
                      __html: formatExplanationContent(message.text),
                    }}></div></p>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 relative">
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={showForm || isTyping}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2.5 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md ${
                (showForm || isTyping) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </motion.button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !showForm && !isTyping && handleSend()}
              placeholder={showForm ? "Please fill the form above to continue..." : "Type your message..."}
              className="flex-1 bg-transparent py-1.5 outline-none text-[15px] placeholder:text-gray-400"
              disabled={showForm || isTyping}
            />
            <div className="flex gap-1.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={showForm || isTyping}
                className={`p-2.5 hover:bg-white rounded-lg transition-all duration-200 hover:shadow-md ${
                  (showForm || isTyping) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Mic className="w-5 h-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => !showForm && !isTyping && handleSend()}
                disabled={showForm || isTyping}
                className={`p-2.5 bg-green-600 text-white rounded-lg transition-all duration-200 shadow-md ${
                  (showForm || isTyping) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
          <AnimatePresence>
            {isMenuOpen && (
              <QuickActions
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onActionSelect={handleSend}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ChatBox;