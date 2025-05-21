import { configureStore } from '@reduxjs/toolkit';
import leadScoringReducer from './leadScoringSlice';

// Mock data for initial application state
const initialContacts = Array.from({ length: 20 }, (_, i) => ({
  id: `contact${i + 1}`,
  firstName: `First${i + 1}`,
  lastName: `Last${i + 1}`,
  email: `contact${i + 1}@example.com`,
  phone: `(123) 456-${7890 + i}`,
  company: `Company ${i + 1}`,
  jobTitle: `Job Title ${i + 1}`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
}));

const initialLeads = Array.from({ length: 15 }, (_, i) => ({
  id: `lead${i + 1}`,
  contactId: `contact${Math.floor(Math.random() * 20) + 1}`,
  source: ['Website', 'Referral', 'Conference', 'Social Media', 'Email Campaign'][Math.floor(Math.random() * 5)],
  stage: ['Initial Contact', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'][Math.floor(Math.random() * 6)],
  value: Math.floor(Math.random() * 100000) + 5000,
  probability: Math.floor(Math.random() * 100),
  lastContactedDate: new Date(Date.now() - Math.random() * 2000000000).toISOString(),
  createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
}));

// Simple reducer for initial mock data
const mockDataReducer = (state = { contacts: initialContacts, leads: initialLeads, interactions: [], followUps: [] }, action) => {
  return state;
};

export const store = configureStore({
  reducer: {
    leadScoring: leadScoringReducer,
    ...mockDataReducer()
  }
});