'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Room, RemoteTrack, RoomEvent, ConnectionState, createLocalAudioTrack } from 'livekit-client';

import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

// Amoeba blob component with different states - ONLY ANIMATION FROM PROVIDED CODE
const Amoeba = ({ gradient, duration, delay, sizeClass, isActive = false, isListening = false }) => {
  // Adjust animation based on state
  const getAnimationProps = () => {
    if (isListening) {  
      // Fast, echo-like spreading animation when listening
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '70% 30% 30% 70% / 30% 70% 30% 70%',
          '30% 70% 70% 30% / 70% 30% 70% 30%',
          '60% 40% 40% 60% / 40% 60% 40% 60%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.4, 0.6, 1.6, 0.8, 1],
        x: [0, 60, -40, 80, -60, 0],
        y: [0, -80, 60, -40, 70, 0],
        transition: {
          duration: duration * 0.25, // Much faster
          delay: delay * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      };
    } else if (isActive) {
      // Medium speed when ready to talk
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '65% 35% 35% 65% / 35% 65% 35% 65%',
          '45% 55% 75% 25% / 25% 75% 25% 75%',
          '75% 25% 25% 75% / 65% 35% 65% 35%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.25, 0.75, 1.3, 0.85, 1],
        x: [0, 45, -30, 60, -45, 0],
        y: [0, -60, 45, -30, 50, 0],
        transition: {
          duration: duration * 0.5, // Faster than idle
          delay: delay * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      };
    } else {
      // Default idle animation
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '60% 40% 40% 60% / 40% 60% 40% 60%',
          '50% 50% 70% 30% / 30% 70% 30% 70%',
          '70% 30% 30% 70% / 60% 40% 60% 40%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.1, 0.9, 1.05, 1],
        x: [0, 25, -25, 20, 0],
        y: [0, -20, 25, -15, 0],
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }
      };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClass}`}
      style={{
        background: gradient,
        filter: isListening ? 'blur(35px)' : isActive ? 'blur(42px)' : 'blur(50px)',
        opacity: isListening ? 0.8 : isActive ? 0.7 : 0.55,
      }}
      animate={{
        borderRadius: animationProps.borderRadius,
        scale: animationProps.scale,
        x: animationProps.x,
        y: animationProps.y,
      }}
      transition={animationProps.transition}
    />
  );
};

// Microphone button overlay for the amoeba - ONLY ANIMATION FROM PROVIDED CODE
const MicIconButton = ({ onClick, isActive, isConnecting, isListening }) => {
  const getButtonState = () => {
    if (isConnecting) return 'connecting';
    if (isListening) return 'listening';
    if (isActive) return 'active';
    return 'idle';
  };

  const buttonState = getButtonState();

  const getButtonStyles = () => {
    switch (buttonState) {
      case 'connecting':
        return 'text-yellow-300 drop-shadow-[0_0_20px_rgba(253,224,71,0.5)]';
      case 'listening':
        return 'text-green-300 drop-shadow-[0_0_20px_rgba(134,239,172,0.8)] animate-pulse';
      case 'active':
        return 'text-blue-300 drop-shadow-[0_0_20px_rgba(147,197,253,0.6)]';
      default:
        return 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]';
    }
  };

  const getRingAnimation = () => {
    switch (buttonState) {
      case 'connecting':
        return 'animate-ping';
      case 'listening':
        return 'animate-pulse';
      case 'active':
        return 'animate-pulse';
      default:
        return '';
    }
  };

  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 20 }}>
      {/* Outer ring for visual feedback */}
      {(isActive || isConnecting || isListening) && (
        <div 
          className={`absolute inset-0 rounded-full border-2 ${
            buttonState === 'connecting' ? 'border-yellow-300/50' :
            buttonState === 'listening' ? 'border-green-300/50' :
            'border-blue-300/50'
          } ${getRingAnimation()}`}
          style={{ 
            width: '80px', 
            height: '80px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      <motion.button
        className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 transition-all duration-300 ${getButtonStyles()}`}
        whileHover={{ scale: buttonState === 'idle' ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClick}
        disabled={isConnecting}
      >
        {/* Heroicons outline microphone */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className={`w-10 h-10 transition-all duration-300 ${
            buttonState === 'listening' ? 'animate-pulse' : ''
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.25a3.75 3.75 0 00-3.75 3.75v6a3.75 3.75 0 007.5 0v-6A3.75 3.75 0 0012 2.25z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5v.75a7.5 7.5 0 01-15 0v-.75M12 21v-3" />
        </svg>

        {/* Loading spinner for connecting state */}
        {isConnecting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-yellow-300/30 border-t-yellow-300 rounded-full animate-spin"></div>
          </div>
        )}
      </motion.button>
    </div>
  );
};

// Voice Assistant with simplified, reliable approach - ORIGINAL WORKING LIVEKIT CODE
const ImprovedVoiceAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [isBotSpeaking, setIsBotSpeaking] = useState(false);
  const [userTyping, setUserTyping] = useState({ text: '', isActive: false });
  const [botTyping, setBotTyping] = useState({ text: '', isActive: false });
  const [debugStatus, setDebugStatus] = useState('Ready');
  const [turnCount, setTurnCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const sessionDataRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const botSpeechRef = useRef(null);
  const isProcessingRef = useRef(false);
  const userTypingIntervalRef = useRef(null);
  const botTypingIntervalRef = useRef(null);
  const currentUserTextRef = useRef('');
  const currentBotTextRef = useRef('');
  const preloadedVoiceRef = useRef(null);
  const restartTimeoutRef = useRef(null);

  // Preload voice for faster speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const preferredVoices = voices.filter(voice => 
          voice.lang.startsWith('en') && 
          (voice.name.includes('Neural') || voice.name.includes('Premium') || voice.name.includes('Enhanced'))
        );
        
        if (preferredVoices.length > 0) {
          preloadedVoiceRef.current = preferredVoices[0];
        } else if (voices.length > 0) {
          const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
          preloadedVoiceRef.current = englishVoices[0] || voices[0];
        }
      };

      // Load voices immediately if available
      if (window.speechSynthesis.getVoices().length > 0) {
        loadVoices();
      } else {
        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  // Session configuration
  const sessionConfig = {
    conversation_id: 'voice_conversation_' + Date.now(),
    individual_id: 'individual_f068689a7d96',
    user_profile_id: 'user_profile_610f7db5658e',
    detected_agent: 'loneliness',
    agent_instance_id: 'loneliness_658',
    call_log_id: 'call_log_voice_' + Date.now(),
    participant_name: 'voice_user_' + Math.random().toString(36).substr(2, 9),
    voice_settings: {
      vad_enabled: true,
      echo_cancellation: true,
      noise_suppression: true,
      auto_gain_control: true,
      sample_rate: 16000,
      interruption_enabled: true
    }
  };

  // Simplified typing effect functions
  const startUserTyping = (text) => {
    if (userTypingIntervalRef.current) {
      clearInterval(userTypingIntervalRef.current);
    }
    
    currentUserTextRef.current = text;
    setUserTyping({ text: '', isActive: true });
    
    let index = 0;
    const typingSpeed = 40;
    
    userTypingIntervalRef.current = setInterval(() => {
      if (index <= text.length) {
        setUserTyping({ text: text.slice(0, index), isActive: true });
        index++;
      } else {
        clearInterval(userTypingIntervalRef.current);
        setTimeout(() => {
          setUserTyping(prev => ({ ...prev, isActive: false }));
        }, 500);
      }
    }, typingSpeed);
  };

  const startBotTyping = (text) => {
    if (botTypingIntervalRef.current) {
      clearInterval(botTypingIntervalRef.current);
    }
    
    currentBotTextRef.current = text;
    setBotTyping({ text: '', isActive: true });
    
    let index = 0;
    const typingSpeed = 20;
    
    botTypingIntervalRef.current = setInterval(() => {
      if (index <= text.length) {
        setBotTyping({ text: text.slice(0, index), isActive: true });
        index++;
      } else {
        clearInterval(botTypingIntervalRef.current);
      }
    }, typingSpeed);
  };

  const stopBotTyping = () => {
    if (botTypingIntervalRef.current) {
      clearInterval(botTypingIntervalRef.current);
    }
    setBotTyping(prev => ({ ...prev, isActive: false }));
  };

  const stopAllTyping = () => {
    if (userTypingIntervalRef.current) {
      clearInterval(userTypingIntervalRef.current);
    }
    if (botTypingIntervalRef.current) {
      clearInterval(botTypingIntervalRef.current);
    }
    setUserTyping({ text: '', isActive: false });
    setBotTyping({ text: '', isActive: false });
  };

  // Simplified Speech Recognition Setup - No VAD, just pure speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Simple, reliable settings
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setDebugStatus('Listening...');
      };

      recognition.onresult = async (event) => {
        let interimTranscript = '';
        let finalText = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalText += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show interim results
        if (interimTranscript.trim() && !isProcessingRef.current) {
          setUserTyping({ text: interimTranscript.trim(), isActive: true });
        }
        
        // Process final text
        if (finalText.trim() && !isProcessingRef.current) {
          const cleanText = finalText.trim();
          if (cleanText.length > 2) {
            console.log('Processing speech:', cleanText);
            setTurnCount(prev => prev + 1);
            
            // Start user typing animation
            startUserTyping(cleanText);
            
            // Process the input
            await processVoiceInput(cleanText);
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Handle errors gracefully
        if (event.error === 'no-speech') {
          setDebugStatus('No speech detected...');
          // Auto-restart after a short delay
          setTimeout(() => {
            if (isRecording && !isProcessingRef.current && !isBotSpeaking) {
              startSpeechRecognition();
            }
          }, 1000);
        } else if (event.error === 'network') {
          setDebugStatus('Network error, retrying...');
          setTimeout(() => {
            if (isRecording && !isProcessingRef.current && !isBotSpeaking) {
              startSpeechRecognition();
            }
          }, 2000);
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        
        // Only auto-restart if we're still recording and not processing
        // Don't restart if the bot is about to speak or is speaking
        if (isRecording && !isProcessingRef.current && !isBotSpeaking) {
          setTimeout(() => {
            // Double-check conditions before restarting
            if (isRecording && !isProcessingRef.current && !isBotSpeaking) {
              console.log('Auto-restarting speech recognition');
              startSpeechRecognition();
            }
          }, 500);
        }
      };
      
      speechRecognitionRef.current = recognition;
    }
  }, [isRecording, isProcessingRef, isBotSpeaking]);

  const startSpeechRecognition = () => {
    if (speechRecognitionRef.current && !isProcessingRef.current && !isBotSpeaking) {
      try {
        speechRecognitionRef.current.start();
        console.log('Speech recognition started');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        if (error.name !== 'InvalidStateError') {
          setDebugStatus('Error starting recognition');
        }
      }
    }
  };

  const stopSpeechRecognition = () => {
    if (speechRecognitionRef.current && isListening) {
      try {
        speechRecognitionRef.current.stop();
        console.log('Speech recognition stopped');
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  const processVoiceInput = async (text) => {
    try {
      console.log('Processing voice input:', text);
      isProcessingRef.current = true;
      setIsProcessing(true);
      setDebugStatus('Processing...');
      
      // Stop speech recognition while processing
      stopSpeechRecognition();
      
      const currentSessionData = sessionDataRef.current || sessionData;
      
      if (!currentSessionData) {
        console.error('No session data available');
        return;
      }

      const payload = {
        session_id: currentSessionData.session_id,
        text: text,
        conversation_id: currentSessionData.conversation_id,
        individual_id: currentSessionData.individual_id || 'individual_f068689a7d96',
        user_profile_id: currentSessionData.user_profile_id || 'user_profile_610f7db5658e'
      };

      console.log('Sending request to voice API');
      const response = await fetch('/api/v1/voice/voice-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Voice API response:', result);

      if (result.status === 'success') {
        const responseText = result.assistant_response;
        
        // Update current conversation
        setCurrentConversation({ user: text, bot: responseText, timestamp: Date.now() });
        
        // Start bot typing and speaking
        startBotTyping(responseText);
        await speakText(responseText);
        
        console.log('Voice processing completed');
      } else {
        console.error('Voice API error:', result);
      }
    } catch (error) {
      console.error('Error processing voice input:', error);
    } finally {
      isProcessingRef.current = false;
      setIsProcessing(false);
      console.log('Processing flag cleared');
    }
  };

  const speakText = async (text) => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1; // Slightly faster speech for more responsive feel
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        
        // Use preloaded voice for faster response
        if (preloadedVoiceRef.current) {
          utterance.voice = preloadedVoiceRef.current;
        } else {
          // Fallback to selecting voice
          const voices = window.speechSynthesis.getVoices();
          const preferredVoices = voices.filter(voice => 
            voice.lang.startsWith('en') && 
            (voice.name.includes('Neural') || voice.name.includes('Premium') || voice.name.includes('Enhanced'))
          );
          
          if (preferredVoices.length > 0) {
            utterance.voice = preferredVoices[0];
          } else if (voices.length > 0) {
            const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
            utterance.voice = englishVoices[0] || voices[0];
          }
        }
        
        utterance.onstart = () => {
          setIsBotSpeaking(true);
          setDebugStatus('Bot speaking...');
        };
        
        utterance.onend = () => {
          console.log('Speech synthesis ended');
          setIsBotSpeaking(false);
          setDebugStatus('Speech ended, preparing to listen');
          // Stop typing when speech ends
          stopBotTyping();
          
          // Resume listening after speaking with proper delay
          if (isRecording && !isProcessingRef.current) {
            console.log('Bot finished speaking, will restart speech recognition in 1 second');
            setTimeout(() => {
              console.log('Attempting to restart speech recognition after bot speech');
              if (isRecording && !isProcessingRef.current && !isBotSpeaking) {
                setDebugStatus('Ready to listen');
                console.log('Restarting speech recognition for next turn');
                startSpeechRecognition();
              } else {
                console.log('Cannot restart speech recognition:', {
                  isRecording,
                  isProcessing: isProcessingRef.current,
                  isBotSpeaking
                });
              }
            }, 1000); // Increased delay to ensure clean restart
          }
          
          resolve();
        };
        
        utterance.onerror = (event) => {
          setIsBotSpeaking(false);
          stopBotTyping();
          resolve();
        };
        
        botSpeechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  const createSession = async () => {
    try {
      const response = await fetch('/api/v1/voice/voice-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionConfig)
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`);
      }

      const data = await response.json();
      setSessionData(data);
      sessionDataRef.current = data;
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const startVoiceAssistant = async () => {
    try {
      console.log('Starting voice assistant');
      
      // Reset all states
      setDebugStatus('Initializing...');
      setTurnCount(0);
      setCurrentConversation(null);
      stopAllTyping();
      
      // Clear processing flags
      isProcessingRef.current = false;
      
      const session = await createSession();
      setDebugStatus('Ready to listen');
      
      setIsRecording(true);
      
      // Start listening immediately - no VAD complexity
      setTimeout(() => {
        startSpeechRecognition();
      }, 500);
      
      console.log('Voice assistant started successfully');
      
    } catch (error) {
      console.error('Error starting voice assistant:', error);
      setDebugStatus('Error: ' + error.message);
    }
  };

  const stopVoiceAssistant = () => {
    console.log('Stopping voice assistant');
    setIsRecording(false);
    
    // Clear processing flags
    isProcessingRef.current = false;
    
    // Stop all audio processes
    stopSpeechRecognition();
    stopAllTyping();
    
    // Cancel speech synthesis
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsBotSpeaking(false);
    
    // Clear current conversation when stopping
    setCurrentConversation(null);
    setDebugStatus('Ready');
    
    console.log('Voice assistant stopped');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceAssistant();
    };
  }, []);

  // Animated waveform visualizer
  const WaveformVisualizer = ({ isActive }) => {
    const bars = Array.from({ length: 30 }, (_, i) => i);
    return (
      <div className="flex items-center justify-center space-x-1 h-8 w-full max-w-xs mx-auto">
        {bars.map((bar) => (
          <div
            key={bar}
            className="bg-gradient-to-t from-blue-400 via-purple-400 to-pink-400 rounded-full transition-all duration-200 ease-out"
            style={{ 
              width: '2px',
              height: isActive 
                ? `${Math.random() * 20 + 4}px`
                : '3px',
              opacity: isActive ? 0.8 : 0.3,
              animationDelay: `${bar * 30}ms`
            }}
          />
        ))}
      </div>
    );
  };

  const ConversationDisplay = () => {
  // Show typing effects first, then current conversation
  if (userTyping.isActive || botTyping.isActive) {
    return (
      <div className="space-y-6">
        {userTyping.isActive && (
          <div className="text-center">
            <div className="inline-block bg-[rgb(31,77,143)]/10 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <div className="text-[rgb(31,77,143)] text-lg font-medium">
                {userTyping.text}
                <span className="inline-block w-0.5 h-5 bg-[rgb(31,77,143)] ml-1 animate-pulse" />
              </div>
            </div>
          </div>
        )}
        {botTyping.isActive && (
          <div className="text-center">
            <div className="inline-block bg-purple-800/10 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <div className="text-purple-800 text-lg font-medium">
                {botTyping.text}
                <span className="inline-block w-0.5 h-5 bg-purple-600 ml-1 animate-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show last conversation when not actively typing
  if (currentConversation && !userTyping.isActive && !botTyping.isActive) {
    return (
      <div className="space-y-6 opacity-80">
        <div className="text-center">
          <div className="inline-block bg-[rgb(31,77,143)]/5 px-6 py-4 rounded-2xl backdrop-blur-sm">
            <div className="text-[rgb(31,77,143)] text-lg">
              {currentConversation.user}
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-block bg-purple-800/5 px-6 py-4 rounded-2xl backdrop-blur-sm">
            <div className="text-purple-800 text-lg">
              {currentConversation.bot}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default empty state - removed emoji as requested
  return (
    <div className="text-center text-gray-600 py-8">
      {!isRecording && (
        <div className="text-lg text-gray-500">
          Press play to start your voice conversation
        </div>
      )}
    </div>
  );
};

  return (
    <div 
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Gradient Blobs Container - Full screen responsive */}
      <div className="relative w-full max-w-[min(90vw,90vh,660px)] aspect-square">
        <Amoeba
          gradient="linear-gradient(135deg, #facc15 0%, #f97316 100%)"
          duration={12}
          delay={0}
          sizeClass="w-[clamp(180px,55%,480px)] aspect-square"
          isActive={isRecording}
          isListening={isListening}
        />
        <Amoeba
          gradient="linear-gradient(135deg, #a855f7 0%, #ef4444 100%)"
          duration={16}
          delay={2}
          sizeClass="w-[clamp(200px,60%,525px)] aspect-square"
          isActive={isRecording}
          isListening={isListening}
        />
        <Amoeba
          gradient="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
          duration={14}
          delay={1}
          sizeClass="w-[clamp(160px,50%,450px)] aspect-square"
          isActive={isRecording}
          isListening={isListening}
        />
        <Amoeba
          gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
          duration={18}
          delay={3}
          sizeClass="w-[clamp(180px,55%,495px)] aspect-square"
          isActive={isRecording}
          isListening={isListening}
        />

        {/* Mic icon overlay - Centered within the blob container */}
        <MicIconButton 
          onClick={isRecording ? stopVoiceAssistant : startVoiceAssistant}
          isActive={isRecording}
          isConnecting={false}
          isListening={isListening}
        />
      </div>

       {/* Status and Conversation Display */}
       <div className="mt-8 w-full max-w-2xl">
         {/* Single Dynamic Status Indicator - Only when recording and no active conversation */}
         {isRecording && !userTyping.isActive && !botTyping.isActive && !currentConversation && (
           <div className="mb-6 text-center">
             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
               isBotSpeaking 
                 ? 'bg-purple-500 bg-opacity-30 text-purple-200' 
                 : isProcessing
                   ? 'bg-yellow-500 bg-opacity-30 text-yellow-200'
                   : isListening 
                     ? 'bg-blue-500 bg-opacity-30 text-blue-200'
                     : 'bg-gray-700 text-gray-300'
             }`}>
               <div className={`w-2 h-2 rounded-full ${
                 isBotSpeaking 
                   ? 'bg-purple-400 animate-pulse' 
                   : isProcessing
                     ? 'bg-yellow-400 animate-pulse'
                     : isListening 
                       ? 'bg-blue-400 animate-pulse'
                       : 'bg-gray-500'
               }`} />
               <span>
                 {isBotSpeaking 
                   ? `Speaking • Turn ${turnCount}` 
                   : isProcessing
                     ? `Processing • Turn ${turnCount}`
                     : isListening 
                       ? `Listening • Turn ${turnCount}`
                       : `Ready • Turn ${turnCount}`}
               </span>
             </div>
           </div>
         )}

         {/* Waveform Visualizer - Only when recording and no active conversation */}
         {isRecording && !userTyping.isActive && !botTyping.isActive && !currentConversation && (
           <div className="mb-6">
             <WaveformVisualizer isActive={isListening || isBotSpeaking} />
           </div>
         )}

         {/* Conversation Display - Always present, responsive */}
         <div className="backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 min-h-64 sm:min-h-80">
           <ConversationDisplay />
         </div>

         {/* Instructions - Only when recording and no active conversation */}
         {isRecording && !userTyping.isActive && !botTyping.isActive && !currentConversation && (
           <div className="mt-6 text-center text-gray-300">
             <div className="text-base sm:text-lg font-light">Speak naturally • Assistant responds in real-time</div>
           </div>
         )}
       </div>
    </div>
  );
};

export default ImprovedVoiceAssistant;