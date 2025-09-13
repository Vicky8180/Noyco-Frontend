// API base URL for backend services
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  HOSPITAL: 'hospital',
  ASSISTANT: 'assistant'
};

// Plan types
export const PLAN_TYPES = {
  LITE: 'lite',
  PRO: 'pro'
};

// Token refresh settings
export const TOKEN_REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes

// Authentication constants
export const AUTH_TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

// FHIR Resource Types
export const FHIR_RESOURCE_TYPES = {
  PATIENT: 'Patient',
  CONDITION: 'Condition',
  OBSERVATION: 'Observation',
  ENCOUNTER: 'Encounter',
  PROCEDURE: 'Procedure'
};
