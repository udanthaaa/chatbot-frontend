import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface QuickActionsProps {
  isOpen: boolean;
  onClose: () => void;
  onActionSelect: (action: string) => void;
}

const actions = [
  {
    category: 'Products',
    items: [
      { icon: '🌿', label: 'Activated Carbon' },
      { icon: '🏭', label: 'Environmental Solutions' },
      { icon: '📦', label: 'Product Catalog' }
    ]
  },
  {
    category: 'Support',
    items: [
      { icon: '📞', label: 'Contact Sales' },
      { icon: '💬', label: 'Technical Support' },
      { icon: '📝', label: 'Request Quote' }
    ]
  },
  {
    category: 'Company',
    items: [
      { icon: '🏢', label: 'About Haycarb' },
      { icon: '🌍', label: 'Global Presence' },
      { icon: '🤝', label: 'Partnerships' }
    ]
  }
];

const QuickActions: React.FC<QuickActionsProps> = ({ isOpen, onClose, onActionSelect }) => {
  if (!isOpen) return null;

  return (
    <>
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20"
        onClick={onClose}
      />
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute left-0 right-0 bottom-full mb-4 mx-4 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
    >
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-medium text-gray-900">Quick Actions</h2>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="p-3 max-h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {actions.map((category, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-xs font-medium text-gray-500 px-1">{category.category}</h3>
              <div className="grid gap-1">
                {category.items.map((item, itemIdx) => (
                  <motion.button
                    key={itemIdx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      onActionSelect(item.label);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-all duration-200 text-left w-full group"
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
    </>
  );
};

export default QuickActions;