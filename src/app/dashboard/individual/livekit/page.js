
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Room, RemoteTrack, RoomEvent, ConnectionState, createLocalAudioTrack } from 'livekit-client';
import { useAuth, useAgentProfile } from '../../../../store/hooks';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import { secondsInDay } from 'date-fns/constants';

const RecordButton = ({ isRecording, handleVoiceToggle }) => {
  return (
    <motion.button
      onClick={handleVoiceToggle}
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


const AmebaButton = ({ isRecording, handleVoiceToggle }) => {
  return (
 <motion.button
  onClick={handleVoiceToggle}
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
  // Redux hooks for user and profile data
  const { user, isAuthenticated } = useAuth();
  const { profiles, currentProfile, fetchProfiles, isLoading: profilesLoading } = useAgentProfile();

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

  // Debug profile loading state and update session when profile loads
  useEffect(() => {
    console.log('Profile state changed:', {
      user: user?.role_entity_id,
      profilesLoading,
      profilesCount: profiles?.length || 0,
      currentProfile: currentProfile?.user_profile_id,
      isAuthenticated
    });
    
    // If we have a session running with fallback profile and now have real profile, update it
    const activeProfile = currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
    if (sessionDataRef.current && activeProfile && sessionDataRef.current.user_profile_id === 'profile_default') {
      console.log('Updating session with real profile:', activeProfile.user_profile_id);
      sessionDataRef.current.user_profile_id = activeProfile.user_profile_id;
    }
  }, [user?.role_entity_id, profiles, currentProfile, profilesLoading, isAuthenticated]);

  // Dynamic Session configuration based on user data
  const getSessionConfig = () => {
    // Get the active profile or first available profile
    const activeProfile = currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
    
    // Log available profiles for debugging
    console.log('Available profiles:', profiles);
    console.log('Current profile:', currentProfile);
    console.log('Selected active profile:', activeProfile);
    
    // More lenient check - if no profile is immediately available, use a fallback approach
    let userProfileId = 'profile_default'; // Temporary fallback
    let participantName = user?.name || 'User';
    
    if (activeProfile) {
      userProfileId = activeProfile.user_profile_id;
      participantName = activeProfile.name || user?.name || 'User';
      console.log('Using valid profile:', userProfileId);
    } else {
      console.warn('No profile found, using fallback temporarily - session will auto-update when profile loads');
    }
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const extraRandomId = Math.random().toString(36).substr(2, 5); // Extra randomness for uniqueness
    
    const sessionConfig = {
      conversation_id: `livekit_fresh_${timestamp}_${randomId}_${extraRandomId}`,
      individual_id: user?.role_entity_id || 'individual_default',
      user_profile_id: userProfileId,
      detected_agent: 'unknown', // Will be detected dynamically
      agent_instance_id: `dynamic_fresh_${timestamp}_${randomId}`, // Will be created dynamically
      call_log_id: `call_log_voice_fresh_${timestamp}_${randomId}`,
      participant_name: participantName,
      voice_settings: {
        vad_enabled: true,
        echo_cancellation: true,
        noise_suppression: true,
        auto_gain_control: true,
        sample_rate: 16000,
        interruption_enabled: true
      },
      // Add force_fresh flag to ensure backend treats this as completely new
      force_fresh_start: true,
      session_reset_timestamp: timestamp
    };
    
    console.log('Generated COMPLETELY FRESH session config:', {
      conversation_id: sessionConfig.conversation_id,
      user_profile_id: sessionConfig.user_profile_id,
      participant_name: sessionConfig.participant_name,
      force_fresh_start: sessionConfig.force_fresh_start,
      session_reset_timestamp: sessionConfig.session_reset_timestamp
    });
    
    return sessionConfig;
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

      // Get user profile ID - session data should now contain the correct ID
      const activeProfile = currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
      const userProfileId = currentSessionData.user_profile_id || activeProfile?.user_profile_id || 'profile_default';
      
      console.log('Using user_profile_id for API call:', userProfileId);
      console.log('Session data user_profile_id:', currentSessionData.user_profile_id);
      console.log('Active profile user_profile_id:', activeProfile?.user_profile_id);

      const payload = {
        session_id: currentSessionData.session_id,
        text: text,
        conversation_id: currentSessionData.conversation_id,
        individual_id: currentSessionData.individual_id || user?.role_entity_id || 'individual_default',
        user_profile_id: userProfileId
      };

      console.log('🔍 DEBUG: Voice API payload being sent:', payload);
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
        
        // Check if this is a connecting message
        if (result.is_connecting) {
          console.log('Received connecting message, playing and then calling orchestrator');
          
          // Update current conversation with connecting message
          setCurrentConversation({ user: text, bot: responseText, timestamp: Date.now() });
          
          // Start bot typing and speaking the connecting message
          startBotTyping(responseText);
          await speakText(responseText);
          
          // After connecting message is done, make the follow-up call to orchestrator
          setTimeout(async () => {
            try {
              const continueResponse = await fetch('/api/v1/voice/voice-message-continue', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
              });

              const continueResult = await continueResponse.json();
              console.log('Continue API response:', continueResult);

              if (continueResult.status === 'success') {
                const orchestratorResponse = continueResult.assistant_response;
                
                // Update conversation with actual orchestrator response
                setCurrentConversation({ user: text, bot: orchestratorResponse, timestamp: Date.now() });
                
                // Start bot typing and speaking orchestrator response
                startBotTyping(orchestratorResponse);
                await speakText(orchestratorResponse);
              } else {
                console.error('Continue API error:', continueResult);
              }
            } catch (error) {
              console.error('Error in continue call:', error);
            }
          }, 500); // Small delay to ensure connecting message finishes
          
        } else {
          // Normal response handling
          setCurrentConversation({ user: text, bot: responseText, timestamp: Date.now() });
          
          // Start bot typing and speaking
          startBotTyping(responseText);
          await speakText(responseText);
        }
        
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
      const currentSessionConfig = getSessionConfig();
      
      // Check if we have a valid session config (should always have one now)
      if (!currentSessionConfig) {
        throw new Error('Failed to generate session configuration');
      }
      
      console.log('Creating session with config:', currentSessionConfig);
      
      const response = await fetch('/api/v1/voice/voice-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentSessionConfig)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Session creation failed:', response.status, errorText);
        throw new Error(`Failed to create session: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Session creation response:', data);
      
      // Ensure the session data has the user_profile_id from the original config
      const sessionConfig = getSessionConfig();
      if (sessionConfig && !data.user_profile_id && sessionConfig.user_profile_id) {
        data.user_profile_id = sessionConfig.user_profile_id;
        console.log('Added user_profile_id to session data:', data.user_profile_id);
      }
      
      setSessionData(data);
      sessionDataRef.current = data;
      return data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      if (!sessionId) return;
      
      const response = await fetch(`/api/v1/voice/voice-sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        console.log('Session deleted successfully');
      } else {
        console.warn('Failed to delete session:', response.status);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const startVoiceAssistant = async () => {
    try {
      console.log('=== Starting voice assistant - COMPLETE FRESH SESSION RESET ===');
      
      // STEP 0: Log the session start attempt
      console.log('=== Starting voice assistant - COMPLETE FRESH SESSION RESET ===');
      console.log('User:', user?.role_entity_id);
      console.log('Profiles available:', profiles?.length || 0);
      console.log('Current profile:', currentProfile?.user_profile_id);
      
      // STEP 1: Immediately stop any existing session to prevent conflicts
      if (sessionDataRef.current?.session_id) {
        console.log('Found existing session, force deleting:', sessionDataRef.current.session_id);
        await deleteSession(sessionDataRef.current.session_id);
      }
      
      // STEP 2: Reset ALL states and initialization flags for completely fresh start
      setDebugStatus('Initializing fresh session...');
      setTurnCount(0);
      setCurrentConversation(null);
      setSessionData(null);  // Clear any existing session data
      sessionDataRef.current = null;  // Clear session reference
      stopAllTyping();
      vadInitializedRef.current = false;
      voiceDetectionCountRef.current = 0;
      
      // STEP 3: Clear any existing flags and timers completely
      speechRecognitionActiveRef.current = false;
      isProcessingRef.current = false;
      voiceActivityRef.current = false;
      
      // Clear all timeouts to prevent interference
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      
      // Stop all existing audio processes
      stopVoiceActivityDetection();
      stopSpeechRecognition();
      
      // Cancel any ongoing speech synthesis
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsBotSpeaking(false);
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // STEP 4: Create completely new session with fresh configuration
      console.log('Creating completely new session with fresh context...');
      const session = await createSession();
      console.log('Fresh session created successfully:', session?.session_id);
      
      if (!session || !session.session_id) {
        throw new Error('Failed to create fresh session');
      }
      
      // STEP 5: Setup audio detection for new session
      setDebugStatus('Session created, setting up audio...');
      await startVoiceActivityDetection();
      
      // STEP 6: Start countdown for first turn
      setIsWaiting(true);
      setSeconds(5);
      
      const countdownInterval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsWaiting(false);
            setDebugStatus('Ready to listen - Fresh session active');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setIsRecording(true);
      setDebugStatus('Fresh session initialized successfully');
      
      console.log('=== Voice assistant started with FRESH SESSION successfully ===');
      
    } catch (error) {
      console.error('Error starting voice assistant with fresh session:', error);
      setDebugStatus('Error: ' + error.message);
      setIsWaiting(false);
      setIsRecording(false);
    }
  };

  const stopVoiceAssistant = async () => {
    console.log('=== Stopping voice assistant and cleaning up session ===');
    console.log('Current session to delete:', sessionDataRef.current?.session_id);
    
    // STEP 1: Immediately set recording to false
    setIsRecording(false);
    setIsWaiting(false);
    setSeconds(5);
    
    // STEP 2: Clear all flags and timers completely
    speechRecognitionActiveRef.current = false;
    isProcessingRef.current = false;
    voiceActivityRef.current = false;
    vadInitializedRef.current = false;
    voiceDetectionCountRef.current = 0;
    
    // STEP 3: Clear all timeouts and intervals
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    // STEP 4: Stop all audio processes immediately
    stopVoiceActivityDetection();
    stopSpeechRecognition();
    stopAllTyping();
    
    // STEP 5: Cancel speech synthesis immediately
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsBotSpeaking(false);
    
    // STEP 6: Delete session from backend to ensure intent detection reset
    if (sessionDataRef.current?.session_id) {
      console.log('Deleting session from backend:', sessionDataRef.current.session_id);
      try {
        await deleteSession(sessionDataRef.current.session_id);
        console.log('Session deletion completed successfully');
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    } else {
      console.log('No session to delete');
    }
    
    // STEP 7: Clear ALL frontend session state completely
    setCurrentConversation(null);
    setSessionData(null);
    sessionDataRef.current = null;
    setDebugStatus('Ready - All session data cleared');
    
    console.log('=== Voice assistant stopped and session completely cleared ===');
  };

  // Wrapper function to handle async operations properly
  const handleVoiceToggle = async () => {
    if (isRecording) {
      await stopVoiceAssistant();
    } else {
      // Just start the session - let the backend handle validation
      await startVoiceAssistant();
    }
  };

  // Cleanup on unmount and page refresh/close
  useEffect(() => {
    const handleBeforeUnload = async () => {
      // Use sendBeacon for reliable cleanup on page unload
      if (sessionDataRef.current?.session_id) {
        // Create a minimal request body for DELETE
        const deleteData = new Blob(
          [JSON.stringify({ session_id: sessionDataRef.current.session_id })], 
          { type: 'application/json' }
        );
        
        // Use fetch with keepalive flag as sendBeacon alternative
        try {
          fetch(`/api/v1/voice/voice-sessions/${sessionDataRef.current.session_id}`, {
            method: 'DELETE',
            keepalive: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }).catch(() => {
            // Ignore errors on page unload
          });
        } catch (error) {
          // Fallback to sendBeacon if fetch fails
          navigator.sendBeacon(
            `/api/v1/voice/voice-sessions/${sessionDataRef.current.session_id}`,
            deleteData
          );
        }
      }
    };

    // Add beforeunload event listener
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
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

  // Check if profiles are ready - more lenient check
  const activeProfile = currentProfile || (profiles && profiles.length > 0 ? profiles[0] : null);
  const isProfileReady = !profilesLoading; // Simplified check - just wait for loading to finish
  const canStartSession = isAuthenticated && user && isProfileReady;

  return (
   <div className="min-h-screen bg-[#f8f7f1] flex flex-col items-center justify-center p-4 sm:p-6">

      <div className="w-full max-w-2xl mx-auto">
        
        {/* Profile Loading State */}
        {profilesLoading && (
          <div className="text-center mb-8">
            <div className="inline-block bg-blue-50 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <div className="text-blue-800 text-lg font-medium">
                Loading your profile...
              </div>
            </div>
          </div>
        )}
        
        {/* No Profile Warning */}
        {!profilesLoading && !activeProfile && (
          <div className="text-center mb-8">
            <div className="inline-block bg-yellow-50 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <div className="text-yellow-800 text-lg font-medium">
                Profile not found
              </div>
              <div className="text-yellow-600 text-sm mt-1">
                Please refresh the page or check your profile settings.
              </div>
              <button 
                onClick={fetchProfiles}
                className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition-colors"
              >
                Retry Loading Profile
              </button>
            </div>
          </div>
        )}
        
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

          {/* Always show the voice button when user is authenticated */}
          {isAuthenticated && user ? (
            <AmebaButton 
              isRecording={isRecording} 
              handleVoiceToggle={handleVoiceToggle}
            />
          ) : (
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-full bg-gray-300 flex items-center justify-center opacity-50">
              <div className="text-gray-500 text-sm text-center">
                Not Authenticated
              </div>
            </div>
          )}

<div className="mt-4 text-[#15345fff] text-lg sm:text-xl font-medium text-center">
  {!isAuthenticated || !user
    ? 'Please login to start' 
    : (isRecording ? 'Voice Assistant Active' : 'Start Conversation')
  }
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