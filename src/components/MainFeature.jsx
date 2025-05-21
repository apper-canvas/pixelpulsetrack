import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { selectLeadScoringConfig, selectThresholds } from '../store/leadScoringSlice';
import { calculateLeadScore, getScoreColorClass } from '../utils/scoringUtils';
import LeadScoreIndicator from './lead/LeadScoreIndicator';
import LeadScoreConfig from './lead/LeadScoreConfig';

const MainFeature = () => {
  const dispatch = useDispatch();
  const contacts = useSelector((state) => state.contacts);
  const leads = useSelector((state) => state.leads);
  const interactions = useSelector((state) => state.interactions);
  const scoringConfig = useSelector(selectLeadScoringConfig);
  
  // New lead form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Lead scoring config state
  const [isScoreConfigOpen, setIsScoreConfigOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    contactId: '',
    name: '',
    source: '',
    stage: '',
    value: '',
    probability: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Filter and search state
  const [showScoreFilter, setShowScoreFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Lead stage options
  const stageOptions = [
    'Initial Contact',
    'Qualified',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];
  
  // Source options
  const sourceOptions = [
    'Website',
    'Referral',
    'Conference',
    'Social Media',
    'Email Campaign',
    'Cold Call',
    'Other'
  ];
  
  // Icons
  const PlusIcon = getIcon('plus');
  const XIcon = getIcon('x');
  const SearchIcon = getIcon('search');
  const SettingsIcon = getIcon('settings');
  const FilterIcon = getIcon('filter');
  const SortAscIcon = getIcon('arrow-up');
  const SortDescIcon = getIcon('arrow-down');
  const CheckIcon = getIcon('check');
  const AlertTriangleIcon = getIcon('alert-triangle');
  const DollarSignIcon = getIcon('dollar-sign');
  const PercentIcon = getIcon('percent');
  const UserIcon = getIcon('user');
  const TargetIcon = getIcon('target');
  const LayersIcon = getIcon('layers');
  const ClipboardIcon = getIcon('clipboard');
  const BarChartIcon = getIcon('bar-chart');
  const ArrowUpIcon = getIcon('arrow-up');
  const ArrowDownIcon = getIcon('arrow-down');
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear the error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.contactId) {
      errors.contactId = 'Contact is required';
    }
    
    if (!formData.source) {
      errors.source = 'Source is required';
    }
    
    if (!formData.stage) {
      errors.stage = 'Stage is required';
    }
    
    if (!formData.value) {
      errors.value = 'Value is required';
    } else if (isNaN(formData.value) || Number(formData.value) < 0) {
      errors.value = 'Value must be a positive number';
    }
    
    if (!formData.probability) {
      errors.probability = 'Probability is required';
    } else if (isNaN(formData.probability) || Number(formData.probability) < 0 || Number(formData.probability) > 100) {
      errors.probability = 'Probability must be between 0 and 100';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Create new lead object
      const newLead = {
        id: String(Date.now()),
        contactId: formData.contactId,
        source: formData.source,
        stage: formData.stage,
        value: Number(formData.value),
        probability: Number(formData.probability),
        lastContactedDate: new Date().toISOString(),
        nextFollowUpDate: null,
        assignedTo: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Dispatch to Redux store
      dispatch({ type: 'ADD_LEAD', payload: newLead });
      
      // Also add an interaction for this lead
      if (formData.notes) {
        const newInteraction = {
          id: String(Date.now() + 1),
          contactId: formData.contactId,
          leadId: newLead.id,
          type: 'Initial Contact',
          notes: formData.notes,
          date: new Date().toISOString(),
          createdBy: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        dispatch({ type: 'ADD_INTERACTION', payload: newInteraction });
      }
      
      // Show success toast
      toast.success('New lead added successfully!');
      
      // Reset form and close it
      setFormData({
        contactId: '',
        source: '',
        stage: '',
        value: '',
        probability: '',
        notes: ''
      });
      setIsFormOpen(false);
    } else {
      toast.error('Please fix the errors in the form');
    }
  };
  
  // Calculate lead score for display
  const getLeadScore = (lead) => {
    return calculateLeadScore(lead, interactions.filter(i => i.leadId === lead.id), scoringConfig);
  };
  
  // Sort options
  const sortOptions = [
    { id: 'newest', label: 'Newest First', icon: SortDescIcon },
    { id: 'oldest', label: 'Oldest First', icon: SortAscIcon },
    { id: 'score-high', label: 'Highest Score First', icon: ArrowDownIcon },
    { id: 'score-low', label: 'Lowest Score First', icon: ArrowUpIcon }
  ];
  
  // Filter and sort leads
  const filteredAndSortedLeads = [...leads]
    .map(lead => ({
      ...lead,
      calculatedScore: getLeadScore(lead)
    }))
    .filter(lead => {
      // Filter by score if needed
      if (showScoreFilter) {
        if (lead.calculatedScore < scoringConfig.thresholds.low) {
          return false;
        }
      }
      
      return true;
    })
    .filter(lead => {
      // Filter by stage
      if (filterStage !== 'all' && lead.stage !== filterStage) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const contact = contacts.find(c => c.id === lead.contactId);
        const contactName = contact ? `${contact.firstName} ${contact.lastName}`.toLowerCase() : '';
        const source = lead.source.toLowerCase();
        const stage = lead.stage.toLowerCase();
        
        return (
          contactName.includes(searchTerm.toLowerCase()) ||
          source.includes(searchTerm.toLowerCase()) ||
          stage.includes(searchTerm.toLowerCase())
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort based on selected option
      if (sortOrder === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortOrder === 'score-high') {
        // Sort by score high to low
        return b.calculatedScore - a.calculatedScore;
      } else if (sortOrder === 'score-low') {
        // Sort by score low to high
        return a.calculatedScore - b.calculatedScore;
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  
  // Get contact name by ID
  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown';
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
            Lead Management
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Track and manage your sales pipeline
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsScoreConfigOpen(true)}
            className="mt-4 sm:mt-0 btn btn-outline inline-flex items-center"
          >
            <SettingsIcon className="h-4 w-4 mr-2" />
            <span>Score Settings</span>
          </button>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-4 sm:mt-0 btn btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            <span>Add New Lead</span>
          </button>
        </div>
      </div>
      
      {/* Filter and Search */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 p-4 mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-4">
              <div className="w-48">
                <div className="flex items-center space-x-2">
                  <FilterIcon className="h-5 w-5 text-surface-500 dark:text-surface-400" />
                  <select
                    className="w-full bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary"
                    value={filterStage}
                    onChange={(e) => setFilterStage(e.target.value)}
                  >
                    <option value="all">All Stages</option>
                    {stageOptions.map((stage) => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary pr-9"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    {sortOptions.find(opt => opt.id === sortOrder)?.icon && (
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="score-filter"
                checked={showScoreFilter}
                onChange={() => setShowScoreFilter(!showScoreFilter)}
                className="mr-2 h-4 w-4 rounded border-surface-300 dark:border-surface-600 text-primary focus:ring-primary"
              />
              <label
                htmlFor="score-filter"
                className="text-sm text-surface-700 dark:text-surface-300 flex items-center"
              >
                <BarChartIcon className="h-4 w-4 mr-1.5" />
                Show only leads with scores above low threshold
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Leads List */}
      <div>
        {filteredAndSortedLeads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredAndSortedLeads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  className="card card-hover"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <div className="bg-surface-100 dark:bg-surface-700 rounded-full p-2">
                          <TargetIcon className="h-5 w-5 text-primary dark:text-primary-light" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-surface-900 dark:text-white">
                            {getContactName(lead.contactId)}
                          </h3>
                          <p className="text-sm text-surface-500 dark:text-surface-400">
                            {lead.source}
                          </p>
                        </div>
                      </div>
                      
                      <div className={`px-2.5 py-1 rounded-full text-xs font-medium
                        ${lead.stage === 'Closed Won' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                          : lead.stage === 'Closed Lost'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                            : lead.stage === 'Proposal' || lead.stage === 'Negotiation'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                        }`}
                      >
                        {lead.stage}
                      </div>
                    </div>
                    
                    {/* Score Indicator */}
                    <div className="absolute top-4 right-4">
                      <LeadScoreIndicator 
                        score={lead.calculatedScore} />
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <DollarSignIcon className="h-4 w-4 text-surface-500 dark:text-surface-400" />
                          <span className="text-sm text-surface-600 dark:text-surface-300">Value</span>
                        </div>
                        <span className="font-medium text-surface-900 dark:text-white">${lead.value.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <PercentIcon className="h-4 w-4 text-surface-500 dark:text-surface-400" />
                          <span className="text-sm text-surface-600 dark:text-surface-300">Probability</span>
                        </div>
                        <span className="font-medium text-surface-900 dark:text-white">{lead.probability}%</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <ClipboardIcon className="h-4 w-4 text-surface-500 dark:text-surface-400" />
                          <span className="text-sm text-surface-600 dark:text-surface-300">Last Contact</span>
                        </div>
                        <span className="text-sm text-surface-600 dark:text-surface-300">
                          {format(new Date(lead.lastContactedDate), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
                      <div className="text-xs text-surface-500 dark:text-surface-400">
                        Created {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                      </div>
                      <button className="btn btn-outline py-1.5 px-3 text-sm">
                        Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-white dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 mb-4">
              <LayersIcon className="h-8 w-8 text-surface-500 dark:text-surface-400" />
            </div>
            <h3 className="text-xl font-medium text-surface-900 dark:text-white">No leads found</h3>
            <p className="mt-2 text-surface-600 dark:text-surface-400">
              {searchTerm || filterStage !== 'all' 
                ? 'Try changing your search or filter criteria' 
                : 'Start by adding a new lead to your pipeline'}
            </p>
            {(searchTerm || filterStage !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStage('all');
                }}
                className="mt-4 btn btn-outline"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Lead Score Configuration Modal */}
      <LeadScoreConfig isOpen={isScoreConfigOpen} onClose={() => setIsScoreConfigOpen(false)} />
      
      {/* New Lead Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-surface-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                  Add New Lead
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Selection */}
                  <div className="input-group md:col-span-2">
                    <label htmlFor="contactId" className="input-label">
                      Contact <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                      <select
                        id="contactId"
                        name="contactId"
                        className={`w-full pl-10 ${formErrors.contactId ? 'border-red-500 focus:ring-red-500' : ''}`}
                        value={formData.contactId}
                        onChange={handleInputChange}
                      >
                        <option value="">Select a contact</option>
                        {contacts.map((contact) => (
                          <option key={contact.id} value={contact.id}>
                            {contact.firstName} {contact.lastName} - {contact.company}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.contactId && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.contactId}</p>
                    )}
                  </div>
                  
                  {/* Source */}
                  <div className="input-group">
                    <label htmlFor="source" className="input-label">
                      Source <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="source"
                      name="source"
                      className={formErrors.source ? 'border-red-500 focus:ring-red-500' : ''}
                      value={formData.source}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a source</option>
                      {sourceOptions.map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                    {formErrors.source && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.source}</p>
                    )}
                  </div>
                  
                  {/* Stage */}
                  <div className="input-group">
                    <label htmlFor="stage" className="input-label">
                      Stage <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="stage"
                      name="stage"
                      className={formErrors.stage ? 'border-red-500 focus:ring-red-500' : ''}
                      value={formData.stage}
                      onChange={handleInputChange}
                    >
                      <option value="">Select a stage</option>
                      {stageOptions.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                    {formErrors.stage && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.stage}</p>
                    )}
                  </div>
                  
                  {/* Value */}
                  <div className="input-group">
                    <label htmlFor="value" className="input-label">
                      Value ($) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                      <input
                        type="number"
                        id="value"
                        name="value"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 ${formErrors.value ? 'border-red-500 focus:ring-red-500' : ''}`}
                        value={formData.value}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.value && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.value}</p>
                    )}
                  </div>
                  
                  {/* Probability */}
                  <div className="input-group">
                    <label htmlFor="probability" className="input-label">
                      Probability (%) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <PercentIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-surface-400" />
                      <input
                        type="number"
                        id="probability"
                        name="probability"
                        placeholder="0-100"
                        min="0"
                        max="100"
                        className={`w-full pl-10 ${formErrors.probability ? 'border-red-500 focus:ring-red-500' : ''}`}
                        value={formData.probability}
                        onChange={handleInputChange}
                      />
                    </div>
                    {formErrors.probability && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.probability}</p>
                    )}
                  </div>
                  
                  {/* Notes */}
                  <div className="input-group md:col-span-2">
                    <label htmlFor="notes" className="input-label">
                      Initial Contact Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows="4"
                      placeholder="Enter any initial contact notes..."
                      className="w-full"
                      value={formData.notes}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex items-center justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    <CheckIcon className="h-4 w-4 mr-2" />
                    Create Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;