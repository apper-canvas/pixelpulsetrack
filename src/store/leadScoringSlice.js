import { createSlice } from '@reduxjs/toolkit';
import { differenceInDays } from 'date-fns';

const initialState = {
  // Weights for different factors (out of 100%)
  weights: {
    interactionFrequency: 40,
    engagementLevel: 35,
    recency: 25
  },
  // Thresholds for score categorization
  thresholds: {
    low: 30,
    medium: 60
  },
  // Default settings for score calculation
  settings: {
    // How many days to consider for recent interactions
    recentInteractionDays: 30,
    // Maximum number of days since last contact before score penalty
    maxLastContactDays: 14,
    // Value multipliers for engagement levels
    engagementMultipliers: {
      email: 1,
      call: 1.5,
      meeting: 2,
      demo: 2.5
    }
  },
  // Manual overrides for lead scores (if any)
  manualScores: {}
};

export const leadScoringSlice = createSlice({
  name: 'leadScoring',
  initialState,
  reducers: {
    updateWeights: (state, action) => {
      state.weights = { ...state.weights, ...action.payload };
    },
    updateThresholds: (state, action) => {
      state.thresholds = { ...state.thresholds, ...action.payload };
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setManualScore: (state, action) => {
      const { leadId, score } = action.payload;
      state.manualScores[leadId] = score;
    },
    removeManualScore: (state, action) => {
      const leadId = action.payload;
      delete state.manualScores[leadId];
    },
    resetToDefaults: (state) => {
      return initialState;
    }
  }
});

// Selectors
export const selectLeadScoringConfig = (state) => state.leadScoring;
export const selectWeights = (state) => state.leadScoring.weights;
export const selectThresholds = (state) => state.leadScoring.thresholds;
export const selectSettings = (state) => state.leadScoring.settings;
export const selectManualScores = (state) => state.leadScoring.manualScores;

export const selectLeadScore = (state, leadId) => {
  // Check if there's a manual override for this lead
  if (state.leadScoring.manualScores[leadId] !== undefined) {
    return state.leadScoring.manualScores[leadId];
  }
  // Otherwise, the score will be calculated in the component using the utils
  return null;
};

export const { updateWeights, updateThresholds, updateSettings, setManualScore, removeManualScore, resetToDefaults } = leadScoringSlice.actions;
export default leadScoringSlice.reducer;