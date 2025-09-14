import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import agentProfileReducer from './slices/agentProfileSlice';
import goalsReducer from './slices/goalsSlice';
import scheduleReducer from './slices/scheduleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    agentProfile: agentProfileReducer,
    goals: goalsReducer,
    schedule: scheduleReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});
