import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

// Create a simple initial Redux store
const initialState = {
  contacts: [
    { 
      id: '1', 
      firstName: 'John', 
      lastName: 'Doe', 
      email: 'john.doe@example.com', 
      phone: '(555) 123-4567', 
      company: 'Acme Corp', 
      position: 'Marketing Director',
      tags: ['VIP', 'Marketing'],
      createdAt: new Date('2023-08-15').toISOString(),
      updatedAt: new Date('2023-10-20').toISOString()
    },
    { 
      id: '2', 
      firstName: 'Jane', 
      lastName: 'Smith', 
      email: 'jane.smith@company.org', 
      phone: '(555) 987-6543', 
      company: 'Tech Solutions Inc', 
      position: 'CTO',
      tags: ['Technical', 'Decision Maker'],
      createdAt: new Date('2023-06-22').toISOString(),
      updatedAt: new Date('2023-09-05').toISOString()
    },
    { 
      id: '3', 
      firstName: 'Michael', 
      lastName: 'Johnson', 
      email: 'michael.j@globex.net', 
      phone: '(555) 456-7890', 
      company: 'Globex Industries', 
      position: 'Sales Manager',
      tags: ['Sales', 'Follow-up'],
      createdAt: new Date('2023-07-10').toISOString(),
      updatedAt: new Date('2023-11-12').toISOString()
    }
  ],
  leads: [
    {
      id: '1',
      contactId: '1',
      source: 'Website',
      stage: 'Qualified',
      value: 25000,
      probability: 60,
      lastContactedDate: new Date('2023-11-05').toISOString(),
      nextFollowUpDate: new Date('2023-12-15').toISOString(),
      assignedTo: 'user1',
      createdAt: new Date('2023-09-15').toISOString(),
      updatedAt: new Date('2023-11-05').toISOString()
    },
    {
      id: '2',
      contactId: '2',
      source: 'Referral',
      stage: 'Proposal',
      value: 75000,
      probability: 80,
      lastContactedDate: new Date('2023-11-10').toISOString(),
      nextFollowUpDate: new Date('2023-11-25').toISOString(),
      assignedTo: 'user1',
      createdAt: new Date('2023-08-01').toISOString(),
      updatedAt: new Date('2023-11-10').toISOString()
    },
    {
      id: '3',
      contactId: '3',
      source: 'Conference',
      stage: 'Initial Contact',
      value: 15000,
      probability: 30,
      lastContactedDate: new Date('2023-10-28').toISOString(),
      nextFollowUpDate: new Date('2023-12-05').toISOString(),
      assignedTo: 'user1',
      createdAt: new Date('2023-10-25').toISOString(),
      updatedAt: new Date('2023-10-28').toISOString()
    }
  ],
  interactions: [
    {
      id: '1',
      contactId: '1',
      leadId: '1',
      type: 'Call',
      notes: 'Discussed project requirements and timeline. Client seems interested in our premium package.',
      date: new Date('2023-11-05T14:30:00').toISOString(),
      createdBy: 'user1',
      createdAt: new Date('2023-11-05T15:00:00').toISOString(),
      updatedAt: new Date('2023-11-05T15:00:00').toISOString()
    },
    {
      id: '2',
      contactId: '2',
      leadId: '2',
      type: 'Meeting',
      notes: 'In-person meeting to present proposal. Jane had questions about implementation timeline.',
      date: new Date('2023-11-10T10:00:00').toISOString(),
      createdBy: 'user1',
      createdAt: new Date('2023-11-10T11:45:00').toISOString(),
      updatedAt: new Date('2023-11-10T11:45:00').toISOString()
    }
  ],
  followUps: [
    {
      id: '1',
      contactId: '1',
      leadId: '1',
      dueDate: new Date('2023-12-15T09:00:00').toISOString(),
      reminderDate: new Date('2023-12-14T09:00:00').toISOString(),
      description: 'Follow up on proposal details and address any questions',
      priority: 'high',
      status: 'pending',
      assignedTo: 'user1',
      createdAt: new Date('2023-11-05T15:00:00').toISOString(),
      updatedAt: new Date('2023-11-05T15:00:00').toISOString()
    },
    {
      id: '2',
      contactId: '2',
      leadId: '2',
      dueDate: new Date('2023-11-25T14:00:00').toISOString(),
      reminderDate: new Date('2023-11-24T14:00:00').toISOString(),
      description: 'Schedule demo with technical team',
      priority: 'medium',
      status: 'pending',
      assignedTo: 'user1',
      createdAt: new Date('2023-11-10T11:45:00').toISOString(),
      updatedAt: new Date('2023-11-10T11:45:00').toISOString()
    }
  ]
};

// Simple reducer for demonstration purposes
function crmReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_CONTACT':
      return {
        ...state,
        contacts: [...state.contacts, action.payload]
      };
    case 'ADD_LEAD':
      return {
        ...state,
        leads: [...state.leads, action.payload]
      };
    case 'ADD_INTERACTION':
      return {
        ...state,
        interactions: [...state.interactions, action.payload]
      };
    case 'ADD_FOLLOWUP':
      return {
        ...state,
        followUps: [...state.followUps, action.payload]
      };
    default:
      return state;
  }
}

const store = configureStore({
  reducer: crmReducer
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)