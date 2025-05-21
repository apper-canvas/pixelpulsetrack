import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import ReactSlider from 'react-slider';
import { toast } from 'react-toastify';
import { 
  selectLeadScoringConfig, 
  updateWeights, 
  updateThresholds, 
  updateSettings,
  resetToDefaults
} from '../../store/leadScoringSlice';
import { getIcon } from '../../utils/iconUtils';

const LeadScoreConfig = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const scoringConfig = useSelector(selectLeadScoringConfig);
  
  // Local state for form values
  const [formValues, setFormValues] = useState({
    weights: { ...scoringConfig.weights },
    thresholds: { ...scoringConfig.thresholds },
    settings: { ...scoringConfig.settings }
  });
  
  // Update local state when redux store changes
  useEffect(() => {
    setFormValues({
      weights: { ...scoringConfig.weights },
      thresholds: { ...scoringConfig.thresholds },
      settings: { ...scoringConfig.settings }
    });
  }, [scoringConfig]);
  
  // Icons
  const XIcon = getIcon('x');
  const SaveIcon = getIcon('save');
  const RefreshCwIcon = getIcon('refresh-cw');
  const AlertCircleIcon = getIcon('alert-circle');
  const InfoIcon = getIcon('info');
  
  // Handle changes to weights
  const handleWeightChange = (key, value) => {
    const newWeights = { ...formValues.weights, [key]: value };
    
    // Ensure other weights adjust proportionally to maintain total of 100
    const currentTotal = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
    
    if (currentTotal !== 100) {
      // Calculate how much we need to adjust other weights
      const adjustment = (100 - currentTotal) / (Object.keys(newWeights).length - 1);
      
      // Adjust other weights proportionally
      Object.keys(newWeights).forEach(weightKey => {
        if (weightKey !== key) {
          newWeights[weightKey] = Math.max(0, Math.min(100, Math.round(newWeights[weightKey] + adjustment)));
        }
      });
      
      // Ensure total is exactly 100 by adjusting the last item if needed
      const newTotal = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
      if (newTotal !== 100) {
        const lastKey = Object.keys(newWeights).find(k => k !== key);
        if (lastKey) {
          newWeights[lastKey] += (100 - newTotal);
        }
      }
    }
    
    setFormValues(prev => ({
      ...prev,
      weights: newWeights
    }));
  };
  
  // Handle changes to thresholds
  const handleThresholdChange = (key, value) => {
    // Ensure low threshold can't exceed medium
    if (key === 'low' && value >= formValues.thresholds.medium) {
      value = formValues.thresholds.medium - 1;
    }
    
    // Ensure medium threshold can't be less than low
    if (key === 'medium' && value <= formValues.thresholds.low) {
      value = formValues.thresholds.low + 1;
    }
    
    setFormValues(prev => ({
      ...prev,
      thresholds: {
        ...prev.thresholds,
        [key]: value
      }
    }));
  };
  
  // Handle changes to settings
  const handleSettingChange = (key, value) => {
    setFormValues(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value
      }
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update all configs in Redux
    dispatch(updateWeights(formValues.weights));
    dispatch(updateThresholds(formValues.thresholds));
    dispatch(updateSettings(formValues.settings));
    
    toast.success('Lead scoring configuration updated successfully');
    onClose();
  };
  
  // Handle reset to defaults
  const handleReset = () => {
    dispatch(resetToDefaults());
    toast.info('Lead scoring configuration reset to defaults');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
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
            Lead Scoring Configuration
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <h4 className="text-lg font-semibold text-surface-900 dark:text-white">Factor Weights</h4>
              <div className="ml-2 group relative">
                <InfoIcon className="h-4 w-4 text-surface-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-surface-800 text-white text-xs p-2 rounded w-64">
                  Weights determine how much each factor contributes to the overall score. Total must equal 100%.
                </div>
              </div>
            </div>
            
            {Object.entries(formValues.weights).map(([key, value]) => (
              <div key={key} className="mb-6">
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-surface-700 dark:text-surface-300 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()} ({value}%)
                  </label>
                </div>
                <ReactSlider
                  className="h-6 flex items-center"
                  thumbClassName="h-6 w-6 bg-primary rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary-light"
                  trackClassName="h-2 bg-surface-200 dark:bg-surface-700 rounded-full"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(val) => handleWeightChange(key, val)}
                />
              </div>
            ))}
          </div>
          
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <h4 className="text-lg font-semibold text-surface-900 dark:text-white">Score Thresholds</h4>
              <div className="ml-2 group relative">
                <InfoIcon className="h-4 w-4 text-surface-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-surface-800 text-white text-xs p-2 rounded w-64">
                  Thresholds determine when leads are categorized as low, medium, or high potential.
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300 block mb-2">
                  Low/Medium Threshold ({formValues.thresholds.low})
                </label>
                <ReactSlider
                  className="h-6 flex items-center"
                  thumbClassName="h-6 w-6 bg-amber-500 rounded-full shadow-md focus:outline-none"
                  trackClassName="h-2 bg-surface-200 dark:bg-surface-700 rounded-full"
                  min={1}
                  max={99}
                  value={formValues.thresholds.low}
                  onChange={(val) => handleThresholdChange('low', val)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300 block mb-2">
                  Medium/High Threshold ({formValues.thresholds.medium})
                </label>
                <ReactSlider
                  className="h-6 flex items-center"
                  thumbClassName="h-6 w-6 bg-green-500 rounded-full shadow-md focus:outline-none"
                  trackClassName="h-2 bg-surface-200 dark:bg-surface-700 rounded-full"
                  min={1}
                  max={99}
                  value={formValues.thresholds.medium}
                  onChange={(val) => handleThresholdChange('medium', val)}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Additional Settings</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Recent Interaction Period (days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={formValues.settings.recentInteractionDays}
                  onChange={(e) => handleSettingChange('recentInteractionDays', parseInt(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  Max Days Since Last Contact
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={formValues.settings.maxLastContactDays}
                  onChange={(e) => handleSettingChange('maxLastContactDays', parseInt(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-surface-200 dark:border-surface-700">
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline flex items-center text-sm"
            >
              <RefreshCwIcon className="h-4 w-4 mr-2" />
              Reset to Defaults
            </button>
            
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Configuration
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LeadScoreConfig;