import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import ChatBox from './components/ChatBox';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed bottom-8 right-8 h-[90vh] w-[80vw] max-w-[400px] max-h-[670px] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 bg-white chat-container"
          >
            <ChatBox onClose={() => setIsOpen(false)} />
          </motion.div>
        ) : (
          <motion.button
            key="chat-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:bg-green-700 transition-all"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;