"use client";

import { motion } from "framer-motion";

const CompletionStep = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-3xl text-white"
        >
          ✓
        </motion.div>
      </motion.div>

      {/* Success Message */}
      <div className="mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold text-gray-900 mb-2"
        >
          All set, {data.name}! 🎉
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 text-sm"
        >
          Your AI wellness companion is ready to support your journey
        </motion.p>
      </div>

      {/* Quick Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-50 rounded-xl p-6 mb-8"
      >
        <h3 className="font-medium text-gray-900 mb-3">Your Profile Summary</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div>✓ Personal information secured</div>
          <div>✓ Communication preferences set</div>
          <div>✓ Emergency contact added</div>
          <div>✓ Privacy settings configured</div>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <motion.button
          onClick={() => window.location.href = "/dashboard/individual?welcome=true"}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-medium hover:bg-blue-700 transition-colors text-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Enter Your Dashboard
        </motion.button>
        
        <p className="text-xs text-gray-500 mt-4">
          You can always update your preferences later ⚙️
        </p>
      </motion.div>
    </motion.div>
  );
};

export default CompletionStep;