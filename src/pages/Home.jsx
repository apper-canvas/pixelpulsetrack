import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';

const Home = () => {
  // Get data from Redux store
  const contacts = useSelector((state) => state.contacts);
  const leads = useSelector((state) => state.leads);
  const interactions = useSelector((state) => state.interactions);
  const followUps = useSelector((state) => state.followUps);

  // Tab navigation
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Statistics
  const totalContacts = contacts.length;
  const totalLeads = leads.length;
  const totalInteractions = interactions.length;
  const pendingFollowUps = followUps.filter(followUp => followUp.status === 'pending').length;
  
  // Calculate lead stage distribution
  const leadStages = leads.reduce((acc, lead) => {
    if (!acc[lead.stage]) {
      acc[lead.stage] = 0;
    }
    acc[lead.stage]++;
    return acc;
  }, {});
  
  // Get upcoming follow-ups (next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingFollowUps = followUps
    .filter(followUp => {
      const dueDate = new Date(followUp.dueDate);
      return followUp.status === 'pending' && dueDate >= today && dueDate <= nextWeek;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  
  // Get recent interactions
  const recentInteractions = [...interactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  
  // Icons
  const UsersIcon = getIcon('users');
  const TargetIcon = getIcon('target');
  const MessageSquareIcon = getIcon('message-square');
  const CalendarIcon = getIcon('calendar');
  const PhoneIcon = getIcon('phone');
  const MailIcon = getIcon('mail');
  const VideoIcon = getIcon('video');
  const UserIcon = getIcon('user');
  const CheckCircleIcon = getIcon('check-circle');
  const ArrowRightIcon = getIcon('arrow-right');
  
  const getInteractionIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'call':
        return PhoneIcon;
      case 'email':
        return MailIcon;
      case 'meeting':
        return VideoIcon;
      default:
        return MessageSquareIcon;
    }
  };
  
  const getContactByID = (id) => {
    return contacts.find(contact => contact.id === id) || { firstName: '', lastName: '' };
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-surface-600 dark:text-surface-400">
          Track your contacts, leads, and upcoming follow-ups at a glance.
        </p>
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Contacts */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card p-6 flex items-center"
        >
          <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/30 mr-4">
            <UsersIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-surface-600 dark:text-surface-400 text-sm">Total Contacts</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{totalContacts}</p>
          </div>
        </motion.div>
        
        {/* Active Leads */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card p-6 flex items-center"
        >
          <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30 mr-4">
            <TargetIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-surface-600 dark:text-surface-400 text-sm">Active Leads</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{totalLeads}</p>
          </div>
        </motion.div>
        
        {/* Interactions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card p-6 flex items-center"
        >
          <div className="rounded-full p-3 bg-purple-100 dark:bg-purple-900/30 mr-4">
            <MessageSquareIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-surface-600 dark:text-surface-400 text-sm">Interactions</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{totalInteractions}</p>
          </div>
        </motion.div>
        
        {/* Pending Follow-ups */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="card p-6 flex items-center"
        >
          <div className="rounded-full p-3 bg-amber-100 dark:bg-amber-900/30 mr-4">
            <CalendarIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-surface-600 dark:text-surface-400 text-sm">Pending Follow-ups</p>
            <p className="text-2xl font-bold text-surface-900 dark:text-white">{pendingFollowUps}</p>
          </div>
        </motion.div>
      </div>
      
      {/* Main Feature Component */}
      <MainFeature />
      
      {/* Content Tabs */}
      <div className="mt-12">
        <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
          <div className="flex space-x-8">
            <button
              className={`py-4 relative ${
                activeTab === 'dashboard'
                  ? 'text-primary dark:text-primary-light font-medium'
                  : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
              {activeTab === 'dashboard' && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light"
                />
              )}
            </button>
            <button
              className={`py-4 relative ${
                activeTab === 'followups'
                  ? 'text-primary dark:text-primary-light font-medium'
                  : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light'
              }`}
              onClick={() => setActiveTab('followups')}
            >
              Upcoming Follow-ups
              {activeTab === 'followups' && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light"
                />
              )}
            </button>
            <button
              className={`py-4 relative ${
                activeTab === 'activity'
                  ? 'text-primary dark:text-primary-light font-medium'
                  : 'text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light'
              }`}
              onClick={() => setActiveTab('activity')}
            >
              Recent Activity
              {activeTab === 'activity' && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light"
                />
              )}
            </button>
          </div>
        </div>
        
        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lead Stage Distribution */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-surface-900 dark:text-white">Lead Stage Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(leadStages).map(([stage, count]) => (
                    <div key={stage} className="flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-surface-600 dark:text-surface-400">{stage}</span>
                        <span className="text-sm font-medium text-surface-900 dark:text-white">{count}</span>
                      </div>
                      <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(count / totalLeads) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4 text-surface-900 dark:text-white">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Avg. Deal Value</span>
                    <span className="font-medium text-surface-900 dark:text-white">
                      ${Math.round(leads.reduce((sum, lead) => sum + lead.value, 0) / (totalLeads || 1)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Most Common Lead Source</span>
                    <span className="font-medium text-surface-900 dark:text-white">
                      {Object.entries(leads.reduce((acc, lead) => {
                        if (!acc[lead.source]) acc[lead.source] = 0;
                        acc[lead.source]++;
                        return acc;
                      }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-surface-200 dark:border-surface-700">
                    <span className="text-surface-600 dark:text-surface-400">Interactions This Month</span>
                    <span className="font-medium text-surface-900 dark:text-white">
                      {interactions.filter(i => {
                        const date = new Date(i.date);
                        return date.getMonth() === new Date().getMonth() && 
                               date.getFullYear() === new Date().getFullYear();
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-surface-600 dark:text-surface-400">Total Deal Pipeline</span>
                    <span className="font-medium text-surface-900 dark:text-white">
                      ${leads.reduce((sum, lead) => sum + lead.value, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'followups' && (
            <div className="card">
              <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Upcoming Follow-ups</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm">Tasks and follow-ups scheduled for the next 7 days</p>
              </div>
              
              {upcomingFollowUps.length > 0 ? (
                <div className="divide-y divide-surface-200 dark:divide-surface-700">
                  {upcomingFollowUps.map((followUp) => {
                    const contact = getContactByID(followUp.contactId);
                    return (
                      <div key={followUp.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
                        <div className="flex items-start space-x-3 mb-3 sm:mb-0">
                          <div className={`rounded-full p-2.5 ${
                            followUp.priority === 'high' 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                              : followUp.priority === 'medium'
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          }`}>
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-medium text-surface-900 dark:text-white">{followUp.description}</h4>
                            <div className="flex items-center mt-1">
                              <UserIcon className="h-4 w-4 text-surface-500 dark:text-surface-400 mr-1.5" />
                              <span className="text-sm text-surface-600 dark:text-surface-400">
                                {contact.firstName} {contact.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="text-sm text-surface-500 dark:text-surface-400 mr-4">
                            {format(new Date(followUp.dueDate), 'MMM d, h:mm a')}
                          </div>
                          <button className="p-1.5 rounded-lg text-surface-500 hover:text-primary hover:bg-surface-100 dark:text-surface-400 dark:hover:text-primary-light dark:hover:bg-surface-700 transition-colors">
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-surface-400 dark:text-surface-600" />
                  <h3 className="mt-2 text-lg font-medium text-surface-900 dark:text-white">No upcoming follow-ups</h3>
                  <p className="mt-1 text-surface-500 dark:text-surface-400">
                    All caught up! No follow-ups scheduled for the next 7 days.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'activity' && (
            <div className="card">
              <div className="p-6 border-b border-surface-200 dark:border-surface-700">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm">Latest interactions with your contacts and leads</p>
              </div>
              
              {recentInteractions.length > 0 ? (
                <div className="divide-y divide-surface-200 dark:divide-surface-700">
                  {recentInteractions.map((interaction) => {
                    const contact = getContactByID(interaction.contactId);
                    const InteractionIcon = getInteractionIcon(interaction.type);
                    return (
                      <div key={interaction.id} className="p-4 sm:p-6">
                        <div className="flex">
                          <div className="mr-4">
                            <div className="rounded-full p-2.5 bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
                              <InteractionIcon className="h-5 w-5" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium text-surface-900 dark:text-white">
                                {interaction.type} with {contact.firstName} {contact.lastName}
                              </h4>
                              <span className="ml-3 text-xs text-surface-500 dark:text-surface-400">
                                {format(new Date(interaction.date), 'MMM d, h:mm a')}
                              </span>
                            </div>
                            <p className="mt-1 text-surface-600 dark:text-surface-400 text-sm">
                              {interaction.notes.length > 120 
                                ? `${interaction.notes.substring(0, 120)}...` 
                                : interaction.notes}
                            </p>
                            <div className="mt-3">
                              <a href="#" className="inline-flex items-center text-sm text-primary hover:text-primary-dark dark:text-primary-light">
                                View details <ArrowRightIcon className="ml-1 h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquareIcon className="mx-auto h-12 w-12 text-surface-400 dark:text-surface-600" />
                  <h3 className="mt-2 text-lg font-medium text-surface-900 dark:text-white">No recent activity</h3>
                  <p className="mt-1 text-surface-500 dark:text-surface-400">
                    Start recording interactions with your contacts and leads.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;