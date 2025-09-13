import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/api';

// Get all assistants for current hospital
export const fetchAssistants = createAsyncThunk(
  'user/fetchAssistants',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest('/auth/assistants');
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch assistants');
    }
  }
);

// Get assistant by ID
export const fetchAssistant = createAsyncThunk(
  'user/fetchAssistant',
  async (assistantId, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/auth/assistants/${assistantId}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch assistant details');
    }
  }
);

// Create new assistant
export const createAssistant = createAsyncThunk(
  'user/createAssistant',
  async (assistantData, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      console.log('Creating assistant with data:', auth);

      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      const response = await apiRequest('/auth/assistants', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': auth.csrfToken
        },
        body: JSON.stringify(assistantData)
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create assistant');
    }
  }
);

// Update assistant
export const updateAssistant = createAsyncThunk(
  'user/updateAssistant',
  async ({ assistantId, assistantData }, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      const response = await apiRequest(`/auth/assistants/${assistantId}`, {
        method: 'PUT',
        headers: {
          'X-CSRF-Token': auth.csrfToken
        },
        body: JSON.stringify(assistantData)
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update assistant');
    }
  }
);

// Delete assistant
export const deleteAssistant = createAsyncThunk(
  'user/deleteAssistant',
  async (assistantId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();

      if (!auth.csrfToken) {
        return rejectWithValue('CSRF token missing');
      }

      const response = await apiRequest(`/auth/assistants/${assistantId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': auth.csrfToken
        }
      });

      const idToRemove = response.id || assistantId;
      return { ...response, assistantId: idToRemove };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete assistant');
    }
  }
);
