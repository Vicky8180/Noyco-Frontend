import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAssistants,
  fetchAssistant,
  createAssistant,
  updateAssistant,
  deleteAssistant
} from '../api-thunk/userAPI';

const initialState = {
  assistants: [],
  currentAssistant: null,
  loading: false,
  error: null,
};

const assistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAssistant: (state, action) => {
      state.currentAssistant = action.payload;
    },
    clearCurrentAssistant: (state) => {
      state.currentAssistant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all assistants
      .addCase(fetchAssistants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssistants.fulfilled, (state, action) => {
        state.assistants = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssistants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch assistants';
      })

      // Fetch single assistant
      .addCase(fetchAssistant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssistant.fulfilled, (state, action) => {
        state.currentAssistant = action.payload;
        state.loading = false;
      })
      .addCase(fetchAssistant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch assistant details';
      })

      // Create assistant
      .addCase(createAssistant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAssistant.fulfilled, (state, action) => {
        state.assistants.push(action.payload);
        state.loading = false;
      })
      .addCase(createAssistant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create assistant';
      })

      // Update assistant
      .addCase(updateAssistant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAssistant.fulfilled, (state, action) => {
        const updatedAssistant = action.payload;
        state.assistants = state.assistants.map(assistant =>
          assistant.id === updatedAssistant.id ? updatedAssistant : assistant
        );
        if (state.currentAssistant?.id === updatedAssistant.id) {
          state.currentAssistant = updatedAssistant;
        }
        state.loading = false;
      })
      .addCase(updateAssistant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update assistant';
      })

      // Delete assistant
      .addCase(deleteAssistant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAssistant.fulfilled, (state, action) => {
        const { assistantId } = action.payload;
        state.assistants = state.assistants.filter(
          assistant => assistant.id !== assistantId
        );
        if (state.currentAssistant?.id === assistantId) {
          state.currentAssistant = null;
        }
        state.loading = false;
      })
      .addCase(deleteAssistant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete assistant';
      });
  },
});

export const { clearError, setCurrentAssistant, clearCurrentAssistant } = assistantSlice.actions;

export default assistantSlice.reducer;
