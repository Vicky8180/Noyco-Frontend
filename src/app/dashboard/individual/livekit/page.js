
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Room, RemoteTrack, RoomEvent, ConnectionState, createLocalAudioTrack } from 'livekit-client';

import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { secondsInDay } from 'date-fns/constants';

const RecordButton = ({ isRecording, startVoiceAssistant, stopVoiceAssistant }) => {
  return (
    <motion.button
      onClick={isRecording ? stopVoiceAssistant : startVoiceAssistant}
      className="relative flex items-center justify-center text-white shadow-2xl px-10 py-10 sm:px-12 sm:py-12 lg:px-14 lg:py-14 transition-all duration-300"
      style={{
        background: isRecording
          ? 'linear-gradient(135deg, #a855f7, #ef4444, #ec4899)'
          : 'linear-gradient(135deg, #facc15, #f97316, #ec4899, #f43f5e)',
        backgroundSize: '300% 300%',
        animation: 'gradientShift 1.5s ease infinite', // faster gradient sweep
      }}
      animate={{
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '60% 40% 40% 60% / 40% 60% 40% 60%',
          '50% 50% 70% 30% / 30% 70% 30% 70%',
          '70% 30% 30% 70% / 60% 40% 60% 40%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.08, 0.92, 1.06, 1], // bouncier
        rotate: [0, 3, -3, 2, 0], // faster wobble
      }}
      transition={{
        duration: 2.5, // faster morph cycle
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
    >
      {isRecording ? (
        <PauseIcon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 z-10" />
      ) : (
        <PlayIcon className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 z-10" />
      )}

      {/* Ripple waves — only active during recording */}
      {isRecording && (
        <>
          <div className="absolute inset-0 rounded-[inherit] border border-white opacity-30 animate-ping" />
          <div
            className="absolute inset-0 rounded-[inherit] border border-white opacity-20 animate-ping"
            style={{ animationDelay: '0.25s' }}
          />
        </>
      )}
    </motion.button>
  );
};


const AmebaButton = ({ isRecording, startVoiceAssistant, stopVoiceAssistant }) => {
  return (
 <motion.button
  onClick={isRecording ? stopVoiceAssistant : startVoiceAssistant}
  className="relative flex items-center justify-center text-white shadow-2xl px-12 py-12 lg:px-14 lg:py-14 transition-all"
  style={{
    background: isRecording
      ? 'linear-gradient(135deg, #a855f7, #ef4444, #ec4899, #397bdf, #06b6d4, #f59e0b)'
      : 'linear-gradient(135deg, #a855f7, #ef4444, #ec4899, #397bdf, #06b6d4, #f59e0b)',
    backgroundSize: '500% 500%',
    animation: 'gradientShift 3s ease infinite',
  }}
  animate={{
    borderRadius: [
      '42% 58% 60% 40% / 55% 42% 58% 45%',
      '60% 40% 55% 45% / 40% 65% 35% 60%',
      '50% 50% 70% 30% / 35% 65% 30% 70%',
      '68% 32% 38% 62% / 55% 45% 35% 65%',
      '58% 42% 62% 38% / 48% 52% 40% 60%',
      '45% 55% 65% 35% / 60% 40% 70% 30%',
    ],
    scale: [1, 1.1, 0.92, 1.06, 0.98, 1],
    rotate: [0, 3, -4, 2, -1, 0],
    skewX: [0, 3, -6, 2, -2, 0],
    skewY: [0, -2, 6, -3, 2, 0],
  }}
  transition={{
    duration: 1.8,
    repeat: Infinity,
    ease: 'easeInOut',
  }}
  whileHover={{ scale: 1.2 }}
  whileTap={{ scale: 0.9 }}
>
  {isRecording ? (
    <PauseIcon className="w-12 h-12 lg:w-14 lg:h-14 z-10" />
  ) : (
    <PlayIcon className="w-12 h-12 lg:w-14 lg:h-14 z-10" />
  )}
</motion.button>
  );
};

// Voice Assistant with synchronized typing and speaking
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
  const [seconds, setSeconds] = useState(5);
  const [isWaiting, setIsWaiting] = useState(false);
  
  const roomRef = useRef(null);
  const sessionDataRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const vadIntervalRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const botSpeechRef = useRef(null);
  const isProcessingRef = useRef(false);
  const voiceActivityRef = useRef(false);
  const silenceTimerRef = useRef(null);
  const speechRecognitionActiveRef = useRef(false);
  const userTypingIntervalRef = useRef(null);
  const botTypingIntervalRef = useRef(null);
  const currentUserTextRef = useRef('');
  const currentBotTextRef = useRef('');
  const preloadedVoiceRef = useRef(null);
  const vadInitializedRef = useRef(false);
  const voiceDetectionCountRef = useRef(0);

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

  // Synchronized typing effect functions
  const startUserTyping = (text) => {
    // Clear any existing typing
    if (userTypingIntervalRef.current) {
      clearInterval(userTypingIntervalRef.current);
    }
    
    currentUserTextRef.current = text;
    setUserTyping({ text: '', isActive: true });
    
    let index = 0;
    const typingSpeed = 40; // Faster typing speed for responsiveness
    
    userTypingIntervalRef.current = setInterval(() => {
      if (index <= text.length) {
        setUserTyping({ text: text.slice(0, index), isActive: true });
        index++;
      } else {
        clearInterval(userTypingIntervalRef.current);
        // Shorter display time for faster transitions
        setTimeout(() => {
          setUserTyping(prev => ({ ...prev, isActive: false }));
        }, 500);
      }
    }, typingSpeed);
  };

  const startBotTyping = (text) => {
    // Clear any existing typing
    if (botTypingIntervalRef.current) {
      clearInterval(botTypingIntervalRef.current);
    }
    
    currentBotTextRef.current = text;
    setBotTyping({ text: '', isActive: true });
    
    let index = 0;
    // Faster typing synchronized with speech speed
    const typingSpeed = 20; // Reduced from 25ms to 20ms for quicker response
    
    botTypingIntervalRef.current = setInterval(() => {
      if (index <= text.length) {
        setBotTyping({ text: text.slice(0, index), isActive: true });
        index++;
      } else {
        clearInterval(botTypingIntervalRef.current);
        // Don't hide immediately - let speech finish first
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

  // Optimized Voice Activity Detection with lower latency
  const startVoiceActivityDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true, // Enable for better voice detection
          autoGainControl: true,
          sampleRate: 44100, // Higher sample rate for better quality
          latency: 0.01 // Low latency constraint
        } 
      });
      
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      
      // Optimize for low latency
      if (audioContextRef.current.audioWorklet) {
        audioContextRef.current.audioWorklet.addModule('data:text/javascript,class VoiceProcessor extends AudioWorkletProcessor { process(inputs) { return true; } } registerProcessor("voice-processor", VoiceProcessor);');
      }
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      // Optimized settings for faster response
      analyserRef.current.fftSize = 256; // Smaller for faster processing
      analyserRef.current.smoothingTimeConstant = 0.1; // Less smoothing for faster response
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Reduced interval for faster detection with proper initialization
      vadIntervalRef.current = setInterval(() => {
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Optimized voice detection range
        const voiceRange = dataArray.slice(5, 85);
        const voiceLevel = voiceRange.reduce((a, b) => a + b) / voiceRange.length;
        const normalizedLevel = Math.min(voiceLevel / 50, 1);
        
        // More robust voice detection with stability check
        const isVoiceActive = normalizedLevel > 0.08; // Slightly lower but more stable
        
        // Count consecutive voice detections for stability
        if (isVoiceActive) {
          voiceDetectionCountRef.current++;
        } else {
          voiceDetectionCountRef.current = 0;
        }
        
        // Only trigger voice activity after stable detection (3 consecutive detections)
        const stableVoiceActivity = voiceDetectionCountRef.current >= 3;
        const wasVoiceActive = voiceActivityRef.current;
        
        if (stableVoiceActivity && !wasVoiceActive) {
          voiceActivityRef.current = true;
          onVoiceActivityStart();
        } else if (!isVoiceActive && wasVoiceActive) {
          voiceActivityRef.current = false;
          onVoiceActivityEnd();
        }
        
        if (stableVoiceActivity && isBotSpeaking) {
          interruptBotSpeech();
        }
      }, 30); // Faster polling for lower latency
      
      // Initialize VAD with proper delay
      setTimeout(() => {
        vadInitializedRef.current = true;
        console.log('VAD fully initialized, ready for voice detection');
        setDebugStatus('Ready to listen');
      }, 1000); // Give more time for proper initialization
      
    } catch (error) {
      console.error('VAD setup error:', error);
      // Fallback: mark as initialized after delay
      setTimeout(() => {
        vadInitializedRef.current = true;
        setDebugStatus('Ready to listen');
      }, 1000);
    }
  };

  const stopVoiceActivityDetection = () => {
    if (vadIntervalRef.current) {
      clearInterval(vadIntervalRef.current);
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    voiceActivityRef.current = false;
  };

  const onVoiceActivityStart = () => {
    // Only respond to voice activity if VAD is fully initialized
    if (!vadInitializedRef.current) {
      console.log('VAD not initialized yet, ignoring voice activity');
      return;
    }
    
    if (!isProcessingRef.current && !isBotSpeaking) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      
      // Start speech recognition when we actually detect stable voice activity
      if (!isListening && !speechRecognitionActiveRef.current) {
        console.log('Stable voice activity detected, starting speech recognition');
        setDebugStatus('Voice detected, starting...');
        startSpeechRecognition();
      }
    }
  };

  const onVoiceActivityEnd = () => {
    if (isListening && !isProcessingRef.current) {
      // Reduced silence timeout for faster response
      silenceTimerRef.current = setTimeout(() => {
        if (!voiceActivityRef.current && !isProcessingRef.current && isListening) {
          console.log('Silence detected, stopping speech recognition');
          stopSpeechRecognition();
        }
      }, 1200); // Slightly increased for stability
    }
  };

  const interruptBotSpeech = () => {
    if (isBotSpeaking && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsBotSpeaking(false);
      stopBotTyping();
      if (botSpeechRef.current) {
        botSpeechRef.current = null;
      }
    }
  };

  // Fixed Speech Recognition Setup with proper state management
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Fixed settings for reliable multi-turn conversations
      recognition.continuous = false; // Changed back to false for better control
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        speechRecognitionActiveRef.current = true;
        setDebugStatus('Listening...');
      };

      recognition.onresult = async (event) => {
        let interimTranscript = '';
        let finalText = '';
        
        // Process all results from this session
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            finalText += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        // Show real-time typing for interim results
        if (interimTranscript.trim() && !isProcessingRef.current) {
          setUserTyping({ text: interimTranscript.trim(), isActive: true });
          setDebugStatus('User speaking...');
        }
        
        // Process final text
        if (finalText.trim() && !isProcessingRef.current) {
          const cleanText = finalText.trim();
          if (cleanText.length > 2) {
            console.log('Processing speech:', cleanText);
            setDebugStatus('Processing...');
            setTurnCount(prev => prev + 1);
            
            // Stop speech recognition immediately
            speechRecognitionActiveRef.current = false;
            
            // Start user typing animation
            startUserTyping(cleanText);
            
            // Process the input
            await processVoiceInput(cleanText);
          }
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        speechRecognitionActiveRef.current = false;
        setIsListening(false);
        
        // Handle specific errors gracefully
        if (event.error === 'no-speech') {
          console.log('No speech detected, waiting for voice activity...');
          setDebugStatus('Waiting for speech...');
          // Don't restart immediately for no-speech, let VAD handle it
          return;
        }
        
        // Auto-restart on certain errors (but not on manual stops)
        if (event.error === 'network' || event.error === 'audio-capture') {
          setTimeout(() => {
            if (isRecording && !isProcessingRef.current && !speechRecognitionActiveRef.current) {
              startSpeechRecognition();
            }
          }, 1000);
        }
      };
      
      recognition.onend = () => {
        console.log('Speech recognition ended');
        speechRecognitionActiveRef.current = false;
        setIsListening(false);
        setDebugStatus('Recognition ended');
        
        // Auto-restart if we're still recording and not processing
        // But only if there was no error (like no-speech)
        setTimeout(() => {
          if (isRecording && !isProcessingRef.current && !speechRecognitionActiveRef.current && !isBotSpeaking) {
            console.log('Auto-restarting speech recognition');
            setDebugStatus('Ready to listen');
            // Only restart if we're actively listening for voice activity
            if (voiceActivityRef.current) {
              startSpeechRecognition();
            }
          }
        }, 500);
      };
      
      speechRecognitionRef.current = recognition;
    }
  }, []);

  const startSpeechRecognition = () => {
    if (!speechRecognitionRef.current) return;
    if (speechRecognitionActiveRef.current || isListening) {
      console.log('Speech recognition already active, skipping');
      return;
    }
    if (isProcessingRef.current) {
      console.log('Currently processing, skipping speech recognition start');
      return;
    }
    if (isBotSpeaking) {
      console.log('Bot is speaking, skipping speech recognition start');
      return;
    }
    
    try {
      console.log('Starting speech recognition');
      speechRecognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      speechRecognitionActiveRef.current = false;
      
      if (error.name === 'InvalidStateError') {
        if (error.message.includes('already started')) {
          console.log('Speech recognition already started, updating state');
          speechRecognitionActiveRef.current = true;
          setIsListening(true);
        } else {
          // Try to restart after a short delay
          setTimeout(() => {
            if (isRecording && !speechRecognitionActiveRef.current && !isProcessingRef.current) {
              startSpeechRecognition();
            }
          }, 500);
        }
      }
    }
  };

  const stopSpeechRecognition = () => {
    if (!speechRecognitionRef.current) return;
    
    try {
      console.log('Stopping speech recognition');
      speechRecognitionRef.current.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
      speechRecognitionActiveRef.current = false;
      setIsListening(false);
    }
  };

  const processVoiceInput = async (text) => {
    try {
      console.log('Processing voice input:', text);
      isProcessingRef.current = true;
      setIsProcessing(true);
      setDebugStatus('Processing...');
      
      // Stop speech recognition while processing
      if (speechRecognitionActiveRef.current) {
        stopSpeechRecognition();
      }
      
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
            setTimeout(() => {
              console.log('Speech ended, ready for next input');
              if (!speechRecognitionActiveRef.current && !isProcessingRef.current) {
                setDebugStatus('Ready to listen');
                // Reset voice detection counter for fresh start
                voiceDetectionCountRef.current = 0;
                console.log('Ready for next input - waiting for voice activity');
              }
            }, 500); // Reduced delay for better responsiveness
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
      
      // Reset all states and initialization flags
      setDebugStatus('Initializing...');
      setTurnCount(0);
      setCurrentConversation(null);
      stopAllTyping();
      vadInitializedRef.current = false;
      voiceDetectionCountRef.current = 0;
      
      // Clear any existing flags
      speechRecognitionActiveRef.current = false;
      isProcessingRef.current = false;
      voiceActivityRef.current = false;
      
      const session = await createSession();
      setDebugStatus('Session created, setting up audio...');
      await startVoiceActivityDetection();
      // Start 5-second countdown for first turn
      setIsWaiting(true);
      setSeconds(5);
      
      const countdownInterval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsWaiting(false);
            // Start voice detection after countdown
            // startVoiceActivityDetection();
            setDebugStatus('Ready to listen');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setIsRecording(true);
      setDebugStatus('Preparing voice assistant...');
      
      console.log('Voice assistant started successfully');
      
    } catch (error) {
      console.error('Error starting voice assistant:', error);
      setDebugStatus('Error: ' + error.message);
      setIsWaiting(false);
    }
  };

  const stopVoiceAssistant = () => {
    console.log('Stopping voice assistant');
    setIsRecording(false);
    setIsWaiting(false);
    setSeconds(5);
    
    // Clear all flags and timers
    speechRecognitionActiveRef.current = false;
    isProcessingRef.current = false;
    voiceActivityRef.current = false;
    vadInitializedRef.current = false;
    voiceDetectionCountRef.current = 0;
    
    // Clear all timeouts
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    // Stop all audio processes
    stopVoiceActivityDetection();
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
      if (roomRef.current) {
        roomRef.current.disconnect();
      }
    };
  }, []);

  // Play/Pause Icon Components
  const PlayIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
      <path d="M8 5v14l11-7z"/>
    </svg>
  );

  const PauseIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  );

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

  // Default empty state
  return (
    <div className="text-center text-gray-600 py-8">
      <div className="text-6xl mb-4">🎙️</div>
      <div className="text-xl font-light mb-2">Ready to chat</div>
      <div className="text-gray-500">
        Press play to start your voice conversation
      </div>
    </div>
  );
};

  return (
   <div className="min-h-screen bg-[#f8f7f1] flex flex-col items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-2xl mx-auto">
        
        {/* Main Control Button - Always Centered */}
        <div className="flex flex-col items-center mb-8">
          {/* <button
            onClick={isRecording ? stopVoiceAssistant : startVoiceAssistant}
            className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center text-white transition-all duration-500 transform hover:scale-105 active:scale-95 shadow-2xl relative ${
              isRecording 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            }`}
            style={{
              boxShadow: isRecording 
                ? '0 20px 40px rgba(239, 68, 68, 0.4)' 
                : '0 20px 40px rgba(59, 130, 246, 0.4)'
            }}
          >
            {isRecording ? <PauseIcon /> : <PlayIcon />}
       
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full border border-white opacity-30 animate-ping" />
                <div className="absolute inset-0 rounded-full border border-white opacity-20 animate-ping" style={{ animationDelay: '0.5s' }} />
              </>
            )}
          </button> */}

          <AmebaButton 
            isRecording={isRecording} 
            startVoiceAssistant={startVoiceAssistant} 
            stopVoiceAssistant={stopVoiceAssistant} 
          />

<div className="mt-4 text-[#15345fff] text-lg sm:text-xl font-medium text-center">
  {isRecording ? 'Voice Assistant Active' : 'Start Conversation'}
</div>



         
          {/* Single Dynamic Status Indicator */}
          {isRecording && (
            <div className="mt-4 text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm font-medium ${
                isBotSpeaking 
                  ? 'bg-purple-500 bg-opacity-30 text-purple-200' 
                  : isProcessing
                    ? 'bg-yellow-500 bg-opacity-30 text-yellow-200'
                    : isListening 
                      ? 'bg-blue-500 bg-opacity-30 text-blue-200'
                      : isWaiting
                        ? 'bg-orange-500 bg-opacity-30 text-orange-200'
                        : 'bg-gray-700 text-gray-300'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isBotSpeaking 
                    ? 'bg-purple-400 animate-pulse' 
                    : isProcessing
                      ? 'bg-yellow-400 animate-pulse'
                      : isListening 
                        ? 'bg-blue-400 animate-pulse'
                        : isWaiting
                          ? 'bg-orange-400 animate-pulse'
                          : 'bg-gray-500'
                }`} />
                <span>
                  {isBotSpeaking 
                    ? `Speaking • Turn ${turnCount}` 
                    : isProcessing
                      ? `Processing • Turn ${turnCount}`
                      : isListening 
                        ? `Listening • Turn ${turnCount}`
                        : isWaiting
                          ? `Wait for ${seconds} seconds`
                          : turnCount === 0 
                            ? `Ready • Turn ${turnCount}`
                            : `Ready • Turn ${turnCount}`
                        }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Waveform Visualizer */}
        {isRecording && (
          <div className="mb-6">
            <WaveformVisualizer isActive={isListening || isBotSpeaking} />
          </div>
        )}

        {/* Conversation Display - Responsive */}
      <div className="backdrop-blur-xl rounded-3xl p-4 sm:p-6 lg:p-8 min-h-64 sm:min-h-80 ">
  <ConversationDisplay />
</div>

        {/* Instructions */}
        {isRecording && (
          <div className="mt-6 text-center text-gray-300">
            <div className="text-base sm:text-lg font-light">Speak naturally • Assistant responds in real-time</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovedVoiceAssistant;