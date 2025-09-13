export const agentSchemas = {
  emotional_companion: {
    name: "Emotional Companion",
    description: "A supportive agent focused on emotional well-being and meaningful conversations",
    icon: "💝",
    fields: {
      topics_user_enjoys: {
        type: "array",
        label: "Topics You Enjoy",
        placeholder: "Old songs, Childhood stories, Family memories",
        tooltip: "What topics bring you joy and comfort?",
        required: false
      },
      memory_triggers: {
        type: "array", 
        label: "Memory Triggers",
        placeholder: "I felt broken last March, My graduation day",
        tooltip: "Important memories or emotional moments you'd like to discuss",
        required: false
      },
      content_preference: {
        type: "array",
        label: "Content Preferences",
        placeholder: "Poems, Headlines, Music, Stories",
        tooltip: "What type of content would you like to receive?",
        required: false
      }
    }
  },
  accountability_buddy: {
    name: "Accountability Buddy",
    description: "Stay on track with your goals through regular check-ins and motivation",
    icon: "🎯",
    fields: {
      goal_statement: {
        type: "string",
        label: "Goal Statement",
        placeholder: "Drink 2L water daily, Exercise 30 minutes",
        tooltip: "What specific goal would you like help achieving?",
        required: true
      },
      tracking_type: {
        type: "select",
        label: "Tracking Method",
        options: ["yes_no", "rating"],
        tooltip: "How would you like to track your progress?",
        required: true
      },
      motivation_tone: {
        type: "select",
        label: "Motivation Style",
        options: ["Friendly", "Strict", "Soft"],
        tooltip: "What type of motivation works best for you?",
        required: true
      },
      track_for_days: {
        type: "number",
        label: "Track for Days",
        placeholder: "30",
        tooltip: "How many days would you like to track this goal?",
        required: true
      }
    }
  },
  loneliness_support: {
    name: "Loneliness Support",
    description: "Companionship and emotional support for those feeling isolated",
    icon: "🤗",
    fields: {
      conversation_topics: {
        type: "array",
        label: "Conversation Topics",
        placeholder: "How was your day, Sleep quality, Hobbies",
        tooltip: "What topics would you like to talk about?",
        required: false
      },
      baseline_feeling: {
        type: "string",
        label: "Current Baseline Feeling",
        placeholder: "Low energy, Anxious, Hopeful",
        tooltip: "How are you generally feeling these days?",
        required: false
      },
      emotional_check_frequency: {
        type: "select",
        label: "Emotional Check-in Frequency",
        options: ["Daily", "Weekly", "Bi-weekly", "Monthly"],
        tooltip: "How often would you like emotional check-ins?",
        required: true
      }
    }
  },
  therapy_checkin: {
    name: "Therapy Check-In",
    description: "Mental health support with mood tracking and therapeutic activities",
    icon: "🧠",
    fields: {
      mood_tracking_method: {
        type: "select",
        label: "Mood Tracking Method",
        options: ["emoji", "scale", "voice_analysis"],
        tooltip: "How would you prefer to track your mood?",
        required: true
      },
      preferred_activities: {
        type: "array",
        label: "Preferred Activities",
        placeholder: "5-min breathing, Affirmations, Journaling",
        tooltip: "What therapeutic activities help you feel better?",
        required: false
      },
      avoid_topics: {
        type: "array",
        label: "Topics to Avoid",
        placeholder: "Breakup, Death, Work stress",
        tooltip: "Any topics you'd prefer not to discuss?",
        required: false
      }
    }
  },
  social_prep: {
    name: "Social Anxiety Prep",
    description: "Preparation and support for social situations and events",
    icon: "👥",
    fields: {
      event_type: {
        type: "string",
        label: "Event Type",
        placeholder: "Interview, Date, Meeting, Party",
        tooltip: "What type of social event do you need help with?",
        required: true
      },
      event_datetime: {
        type: "datetime",
        label: "Event Date & Time",
        tooltip: "When is your upcoming event?",
        required: false
      },
      affirmations: {
        type: "array",
        label: "Personal Affirmations",
        placeholder: "You are safe, You are capable, You belong here",
        tooltip: "Positive affirmations that help you feel confident",
        required: false
      },
      practice_script: {
        type: "string",
        label: "Practice Script",
        placeholder: "Hi, I'm [Name]. Nice to meet you.",
        tooltip: "A script or phrases you'd like to practice",
        required: false
      },
      reset_method: {
        type: "string",
        label: "Reset Method",
        placeholder: "Breathing, Counting to 10, Positive self-talk",
        tooltip: "What helps you reset when feeling anxious?",
        required: false
      }
    }
  }
};

export const formDataSchema = {
  basic_user_info: {
    name_to_call_user: "string",
    preferred_language: "string", 
    timezone: "string",
    phone_number: "string"
  },
  call_preferences: {
    preferred_call_time: "string",
    call_frequency: "string", 
    call_duration_minutes: "number"
  },
  agent_context: {
    agent_type: "string",
    // Dynamic fields based on selected agent
  }
};

export const defaultLanguages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" }
];

export const defaultTimezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" }
];

export const callFrequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" }
];

export const callDurationOptions = [
  { value: 5, label: "5 minutes" },
  { value: 10, label: "10 minutes" },
  { value: 15, label: "15 minutes" },
  { value: 20, label: "20 minutes" },
  { value: 30, label: "30 minutes" }
];
