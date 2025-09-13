
// "use client"
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Play, Pause, Star, Users, Award, Headphones } from 'lucide-react';

// const WellnessHomepage = () => {
//   const [isActive, setIsActive] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsActive(true);
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   const heartbeatVariants = {
//     pulse: {
//       scale: [1, 1.12, 0.94, 1.06, 1],
//       transition: {
//         duration: 1.6,
//         ease: [0.25, 0.46, 0.45, 0.94],
//         repeat: Infinity,
//         repeatDelay: 0.2
//       }
//     }
//   };

//   const rippleVariants = {
//     expand: (i) => ({
//       scale: [0.8, 2.2, 0.8],
//       opacity: [0.6, 0, 0.6],
//       transition: {
//         duration: 2.4,
//         ease: [0.25, 0.46, 0.45, 0.94],
//         repeat: Infinity,
//         delay: i * 0.4,
//       }
//     })
//   };

//   const WaveformVisualizer = ({ isActive }) => {
//     const bars = Array.from({ length: 60 }, (_, i) => i);
//     return (
//       <div className="flex items-center justify-center space-x-0.5 h-16 w-full max-w-2xl mx-auto">
//         {bars.map((bar) => (
//           <motion.div
//             key={bar}
//             className="bg-gradient-to-t from-amber-400 via-orange-400 to-yellow-400 rounded-full shadow-sm"
//             style={{ width: '2.5px', minHeight: '2px' }}
//             animate={{
//               height: isActive
//                 ? [
//                     Math.random() * 8 + 4,
//                     Math.random() * 24 + 12,
//                     Math.random() * 40 + 20,
//                     Math.random() * 56 + 28,
//                     Math.random() * 40 + 20,
//                     Math.random() * 24 + 12,
//                     Math.random() * 8 + 4,
//                   ]
//                 : [3, 3, 3, 3, 3, 3, 3],
//               opacity: isActive
//                 ? [0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4]
//                 : [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
//             }}
//             transition={{
//               duration: 0.8 + Math.random() * 0.6,
//               repeat: Infinity,
//               ease: [0.4, 0, 0.6, 1],
//               delay: bar * 0.02,
//             }}
//           />
//         ))}
//       </div>
//     );
//   };

//   const ConversationalText = ({ isActive }) => {
//     const [currentSentence, setCurrentSentence] = useState(0);
//     const [currentLetter, setCurrentLetter] = useState(0);
//     const [showText, setShowText] = useState(false);

//     const sentences = [
//       "Welcome to your mindful journey",
//       "Let's find your inner peace together",
//       "Breathe deeply and feel the calm",
//       "Your wellness transformation begins now",
//       "Discover the power of mindful living",
//       "Every breath brings you closer to balance"
//     ];

//     useEffect(() => {
//       if (isActive) {
//         setShowText(true);
//         const currentText = sentences[currentSentence];
        
//         if (currentLetter < currentText.length) {
//           const timer = setTimeout(() => {
//             setCurrentLetter(prev => prev + 1);
//           }, 60);
//           return () => clearTimeout(timer);
//         } else {
//           const sentenceTimer = setTimeout(() => {
//             setCurrentSentence(prev => (prev + 1) % sentences.length);
//             setCurrentLetter(0);
//           }, 2500);
//           return () => clearTimeout(sentenceTimer);
//         }
//       } else {
//         setShowText(false);
//         setCurrentLetter(0);
//         setCurrentSentence(0);
//       }
//     }, [isActive, currentLetter, currentSentence]);

//     const currentText = sentences[currentSentence];
//     const visibleText = currentText.slice(0, currentLetter);

//     return (
//       <div className="h-20 flex items-center justify-center px-4">
//         <AnimatePresence>
//           {showText && (
//             <motion.div
//               className="text-center max-w-lg"
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -10 }}
//               transition={{ duration: 0.3 }}
//             >
//               <p className="text-lg text-gray-700 font-normal leading-relaxed">
//                 {visibleText}
//                 <motion.span
//                   className="inline-block w-0.5 h-5 bg-orange-400 ml-0.5"
//                   animate={{ opacity: [1, 0, 1] }}
//                   transition={{ duration: 1, repeat: Infinity }}
//                 />
//               </p>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-gray-50 via-white to-amber-50/30 relative overflow-hidden font-['SF_Pro_Display','Poppins'] flex">
//       {/* Floating particles */}
//       <div className="absolute inset-0 pointer-events-none">
//         {[...Array(12)].map((_, i) => (
//           <motion.div
//             key={`particle-${i}`}
//             className="absolute w-1 h-1 bg-amber-200/40 rounded-full"
//             style={{ left: `${8 + (i * 8)}%`, top: `${12 + (i * 6)}%` }}
//             animate={{
//               y: [0, -40, 0],
//               x: [0, Math.sin(i) * 25, 0],
//               opacity: [0.2, 0.5, 0.2],
//             }}
//             transition={{
//               duration: 12 + i * 2,
//               repeat: Infinity,
//               ease: [0.25, 0.46, 0.45, 0.94],
//               delay: i * 1.5
//             }}
//           />
//         ))}
//         {[...Array(4)].map((_, i) => (
//           <motion.div
//             key={`bg-circle-${i}`}
//             className="absolute border border-amber-100/30 rounded-full"
//             style={{
//               width: `${120 + i * 80}px`,
//               height: `${120 + i * 80}px`,
//               right: `${3 + i * 3}%`,
//               bottom: `${8 + i * 5}%`,
//             }}
//             animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.25, 0.1] }}
//             transition={{
//               duration: 15 + i * 5,
//               repeat: Infinity,
//               ease: [0.25, 0.46, 0.45, 0.94],
//               delay: i * 3
//             }}
//           />
//         ))}
//       </div>

//       {/* Left Section */}
//       <div className="flex-1 flex flex-col items-center justify-center text-center px-8 md:px-16 lg:px-24">
//         <motion.div
//           initial={{ opacity: 0, x: -40 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
//         >
//           {/* Trust Badges */}
//           <motion.div 
//             className="flex items-center justify-center gap-6 mb-8"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.5 }}
//           >
//             <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-amber-100/50">
//               <Star className="w-4 h-4 text-amber-500 fill-current" />
//               <span className="text-sm font-medium text-gray-700">4.9 Rating</span>
//             </div>
//             <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-amber-100/50">
//               <Users className="w-4 h-4 text-amber-500" />
//               <span className="text-sm font-medium text-gray-700">10M+ Users</span>
//             </div>
//             <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-amber-100/50">
//               <Award className="w-4 h-4 text-amber-500" />
//               <span className="text-sm font-medium text-gray-700">Award Winning</span>
//             </div>
//           </motion.div>

//           <h1 className="mt-0 text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
//             Discover Your
//             <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-normal">
//               Inner Balance
//             </span>
//           </h1>

//           <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-2xl mb-10">
//             Experience the transformative power of mindful wellness through our scientifically-backed approach to mental and physical harmony.
//           </p>

//           {/* CTA Buttons */}
//           <motion.div 
//             className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.8 }}
//           >
//             <button className="group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center">
//               <Play className="w-5 h-5 mr-2 fill-current" />
//               Start Your Journey
//               <motion.div 
//                 className="ml-2 w-2 h-2 bg-white rounded-full"
//                 animate={{ scale: [1, 1.5, 1] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//               />
//             </button>
//             <button className="group border-2 border-amber-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:bg-amber-50 transition-all duration-300 flex items-center">
//               <Headphones className="w-5 h-5 mr-2" />
//               Try Free Session
//             </button>
//           </motion.div>

//           {/* Social Proof */}
//           <motion.div 
//             className="text-center"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.8, delay: 1.2 }}
//           >
//             <p className="text-sm text-gray-500 mb-4">Trusted by wellness enthusiasts worldwide</p>
//             <div className="flex items-center justify-center gap-4 opacity-60">
//               <div className="text-xs font-medium text-gray-400">Featured in:</div>
//               <div className="flex gap-6">
//                 <div className="text-xs font-bold text-gray-400">TECHCRUNCH</div>
//                 <div className="text-xs font-bold text-gray-400">FORBES</div>
//                 <div className="text-xs font-bold text-gray-400">WIRED</div>
//               </div>
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>

//       {/* Right Section */}
//       <div className="flex-1 flex flex-col items-center justify-center relative py-8 -mt-16">
//         {/* Quick Stats */}
//         <motion.div 
//           className="absolute top-8 right-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-100/50"
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 1.0 }}
//         >
//           <div className="text-center">
//             <div className="text-2xl font-bold text-amber-600 mb-1">
//               <motion.span
//                 animate={{ scale: [1, 1.1, 1] }}
//                 transition={{ duration: 2, repeat: Infinity }}
//               >
//                 98%
//               </motion.span>
//             </div>
//             <div className="text-xs text-gray-600">Feel Better</div>
//           </div>
//         </motion.div>

//         {/* Session Counter */}
//         <motion.div 
//           className="absolute top-24 left-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-100/50"
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8, delay: 1.2 }}
//         >
//           <div className="text-center">
//             <div className="text-xl font-bold text-amber-600 mb-1">50M+</div>
//             <div className="text-xs text-gray-600">Sessions</div>
//           </div>
//         </motion.div>

//         {/* Ripples */}
//         <motion.div
//           className="relative mb-8"
//           initial={{ opacity: 0, scale: 0.3 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1.2, delay: 0.3 }}
//         >
//           {[...Array(6)].map((_, i) => (
//             <motion.div
//               key={`ripple-${i}`}
//               className="absolute inset-0 rounded-full border border-amber-300/40"
//               style={{
//                 width: `${200 + i * 35}px`,
//                 height: `${200 + i * 35}px`,
//                 transform: 'translate(-50%, -50%)',
//                 left: '50%',
//                 top: '50%'
//               }}
//               custom={i}
//               variants={rippleVariants}
//               animate="expand"
//             />
//           ))}
//           <motion.div
//             className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full cursor-pointer group"
//             style={{
//               background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #fb923c 70%, #ea580c 100%)',
//               boxShadow: '0 20px 60px rgba(251, 191, 36, 0.3)'
//             }}
//             variants={heartbeatVariants}
//             animate="pulse"
//             onClick={() => setIsActive(!isActive)}
//           >
//             <div className="absolute inset-4 rounded-full opacity-40"
//               style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, transparent 70%)' }}
//             />
//             <motion.div
//               className="absolute inset-0 flex items-center justify-center"
//               animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
//               transition={{ duration: 1.6, repeat: isActive ? Infinity : 0 }}
//             >
//               {isActive ? (
//                 <Pause className="w-14 h-14 text-white opacity-90" />
//               ) : (
//                 <Play className="w-14 h-14 text-white opacity-90 ml-2" />
//               )}
//             </motion.div>
//             <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
//               <span className="text-xs text-gray-700 font-medium">
//                 {isActive ? 'Pause Session' : 'Start Session'}
//               </span>
//             </div>
//           </motion.div>
//         </motion.div>
        
//         <motion.div className="w-full max-w-lg px-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//           <WaveformVisualizer isActive={isActive} />
//         </motion.div>

//         <motion.div className="w-full max-w-lg px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <ConversationalText isActive={isActive} />
//         </motion.div>

//         <motion.div className="text-center mt-4 px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//           <AnimatePresence mode="wait">
//             <motion.p
//               key={isActive ? "active" : "inactive"}
//               className="text-sm text-gray-500 font-normal"
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//             >
//               {isActive ? "Your wellness journey is beginning..." : "Voice assistant ready to guide you"}
//             </motion.p>
//           </AnimatePresence>
//         </motion.div>

//         {/* Session Info */}
//         <motion.div 
//           className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-100/50 max-w-48"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8, delay: 1.4 }}
//         >
//           <div className="text-xs text-gray-600 mb-2">Next Session</div>
//           <div className="font-semibold text-gray-800 text-sm">Morning Meditation</div>
//           <div className="text-xs text-amber-600 font-medium">5 min • Beginner</div>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default WellnessHomepage;













"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Star, Users, Award, Headphones } from 'lucide-react';

// A component for the animated waveform visualizer
const WaveformVisualizer = ({ isActive }) => {
  const bars = Array.from({ length: 60 }, (_, i) => i);
  return (
    <div className="flex items-center justify-center space-x-0.5 h-16 w-full max-w-2xl mx-auto">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="bg-gradient-to-t from-amber-400 via-orange-400 to-yellow-400 rounded-full shadow-sm"
          style={{ width: '2.5px', minHeight: '2px' }}
          animate={{
            height: isActive
              ? [
                  Math.random() * 8 + 4,
                  Math.random() * 24 + 12,
                  Math.random() * 40 + 20,
                  Math.random() * 56 + 28,
                  Math.random() * 40 + 20,
                  Math.random() * 24 + 12,
                  Math.random() * 8 + 4,
                ]
              : [3, 3, 3, 3, 3, 3, 3],
            opacity: isActive
              ? [0.4, 0.6, 0.8, 1, 0.8, 0.6, 0.4]
              : [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.6,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: bar * 0.02,
          }}
        />
      ))}
    </div>
  );
};

// A component for the typing conversational text
const ConversationalText = ({ isActive }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [currentLetter, setCurrentLetter] = useState(0);
  const [showText, setShowText] = useState(false);

  const sentences = [
    "Welcome to your mindful journey",
    "Let's find your inner peace together",
    "Breathe deeply and feel the calm",
    "Your wellness transformation begins now",
    "Discover the power of mindful living",
    "Every breath brings you closer to balance"
  ];

  useEffect(() => {
    if (isActive) {
      setShowText(true);
      const currentText = sentences[currentSentence];
      
      if (currentLetter < currentText.length) {
        const timer = setTimeout(() => {
          setCurrentLetter(prev => prev + 1);
        }, 60);
        return () => clearTimeout(timer);
      } else {
        const sentenceTimer = setTimeout(() => {
          setCurrentSentence(prev => (prev + 1) % sentences.length);
          setCurrentLetter(0);
        }, 2500);
        return () => clearTimeout(sentenceTimer);
      }
    } else {
      // Reset when not active
      const resetTimer = setTimeout(() => {
        setShowText(false);
        setCurrentLetter(0);
        setCurrentSentence(0);
      }, 500);
      return () => clearTimeout(resetTimer);
    }
  }, [isActive, currentLetter, currentSentence]);

  const currentText = sentences[currentSentence];
  const visibleText = currentText.slice(0, currentLetter);

  return (
    <div className="h-20 flex items-center justify-center px-4">
      <AnimatePresence>
        {showText && (
          <motion.div
            className="text-center max-w-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-base sm:text-lg text-gray-700 font-normal leading-relaxed">
              {visibleText}
              <motion.span
                className="inline-block w-0.5 h-5 bg-orange-400 ml-0.5"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const App = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Auto-start the animation after a short delay
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/30 relative overflow-hidden font-['SF_Pro_Display','Poppins'] flex flex-col lg:flex-row max-w-7xl mx-auto">
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-amber-200/40 rounded-full"
            style={{ left: `${8 + (i * 8)}%`, top: `${12 + (i * 6)}%` }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(i) * 25, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 1.5
            }}
          />
        ))}
        {/* Background circles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`bg-circle-${i}`}
            className="absolute border border-amber-100/30 rounded-full"
            style={{
              width: `${120 + i * 80}px`,
              height: `${120 + i * 80}px`,
              right: `${3 + i * 3}%`,
              bottom: `${8 + i * 5}%`,
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{
              duration: 15 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 3
            }}
          />
        ))}
      </div>

      {/* Left Section: Content */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center p-6 sm:p-8 lg:p-12 z-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Trust Badges */}
          <motion.div 
            className="flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {[
              { icon: Star, text: "4.9 Rating" },
              { icon: Users, text: "10M+ Users" },
              { icon: Award, text: "Award Winning" },
            ].map((badge, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm border border-amber-100/50"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <badge.icon className={`w-4 h-4 text-amber-500 ${badge.icon === Star ? 'fill-current' : ''}`} />
                <span className="text-xs sm:text-sm font-medium text-gray-700">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Discover Your
            <motion.span 
              className="block bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent font-normal"
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: '200% 200%' }}
            >
              Inner Balance
            </motion.span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-lg mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Experience the transformative power of mindful wellness through our scientifically-backed approach to mental and physical harmony.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button 
              className="w-full sm:w-auto group bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-500 shadow-lg hover:shadow-xl flex items-center justify-center"
              whileHover={{ scale: 1.05, y: -3, boxShadow: "0 20px 40px rgba(251, 191, 36, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Play className="w-4 h-4 mr-2 fill-current" />
              Start Your Journey
            </motion.button>
            <motion.button 
              className="w-full sm:w-auto group border-2 border-amber-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition-all duration-500 flex items-center justify-center"
              whileHover={{ scale: 1.05, y: -3, backgroundColor: "rgba(251, 191, 36, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Headphones className="w-4 h-4 mr-2" />
              Try Free Session
            </motion.button>
          </motion.div>

          {/* Social Proof */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 2.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex items-center justify-center gap-4 opacity-50 flex-wrap">
              <div className="text-xs font-medium text-gray-400">Featured in:</div>
              <div className="flex gap-4">
                <div className="text-xs font-bold text-gray-400">TECHCRUNCH</div>
                <div className="text-xs font-bold text-gray-400">FORBES</div>
                <div className="text-xs font-bold text-gray-400">WIRED</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Section: Interactive Element */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center relative p-6 sm:p-8 lg:p-12 z-10 min-h-[50vh] lg:min-h-0">
        
        {/* Floating Stats Cards */}
        <motion.div 
          className="absolute top-4 right-4 sm:top-8 sm:right-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-amber-100/50"
          initial={{ opacity: 0, x: 20, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.8, delay: 2.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="text-center">
            <div className="text-xl font-bold text-amber-600 mb-1">98%</div>
            <div className="text-xs text-gray-600">Feel Better</div>
          </div>
        </motion.div>

        <motion.div 
          className="absolute top-16 left-4 sm:top-20 sm:left-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-amber-100/50"
          initial={{ opacity: 0, x: -20, y: -10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.8, delay: 2.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="text-center">
            <div className="text-lg font-bold text-amber-600 mb-1">50M+</div>
            <div className="text-xs text-gray-600">Sessions</div>
          </div>
        </motion.div>
        
        {/* Main Interactive Circle */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Pulsating Ripples */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute inset-0 rounded-full border border-amber-300/30"
              style={{
                width: `calc(100% + ${i * 30}px)`,
                height: `calc(100% + ${i * 30}px)`,
                transform: 'translate(-50%, -50%)',
                left: '50%',
                top: '50%'
              }}
              animate={{
                scale: [0.8, 1.6, 0.8],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
                delay: i * 0.6,
              }}
            />
          ))}
          {/* The Clickable Circle */}
          <motion.div
            className="relative w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full cursor-pointer group"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 30%, #fb923c 70%, #ea580c 100%)',
              boxShadow: '0 15px 40px rgba(251, 191, 36, 0.25)'
            }}
            animate={{
              scale: [1, 1.04, 1],
              boxShadow: [
                '0 15px 40px rgba(251, 191, 36, 0.25)',
                '0 20px 60px rgba(251, 191, 36, 0.4)',
                '0 15px 40px rgba(251, 191, 36, 0.25)'
              ]
            }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            onClick={() => setIsActive(!isActive)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Inner gloss effect */}
            <motion.div 
              className="absolute inset-3 rounded-full opacity-30"
              style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, transparent 70%)' }}
            />
            {/* Play/Pause Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isActive ? "pause" : "play"}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {isActive ? (
                    <Pause className="w-10 h-10 sm:w-12 sm:h-12 text-white opacity-90" />
                  ) : (
                    <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white opacity-90 ml-1" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            {/* Hover label */}
            <motion.div 
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
            >
              <span className="text-xs text-gray-700 font-medium">
                {isActive ? 'Pause Session' : 'Start Session'}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
        
        {/* Visualizer and Text Container */}
        <div className="w-full max-w-md px-4">
            <WaveformVisualizer isActive={isActive} />
            <ConversationalText isActive={isActive} />
        </div>

        {/* Status Text */}
        <div className="text-center mt-3 px-4 h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={isActive ? "active" : "inactive"}
              className="text-sm text-gray-500 font-normal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {isActive ? "Your wellness journey is beginning..." : "Voice assistant ready to guide you"}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Floating Session Info Card */}
        <motion.div 
          className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-amber-100/50 max-w-36"
          initial={{ opacity: 0, y: 20, x: 10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 1.8, delay: 2.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <div className="text-xs text-gray-600 mb-1">Next Session</div>
          <div className="font-semibold text-gray-800 text-xs">Morning Meditation</div>
          <div className="text-xs text-amber-600 font-medium">5 min • Beginner</div>
        </motion.div>
      </div>
    </div>
  );
};

export default App;
 