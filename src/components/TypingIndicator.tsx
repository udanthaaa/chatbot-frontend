import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-white p-4 rounded-2xl shadow-sm max-w-[80%]">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              className="w-2 h-2 bg-gray-400 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;