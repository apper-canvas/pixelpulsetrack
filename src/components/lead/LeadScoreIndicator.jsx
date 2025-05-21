import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectThresholds } from '../../store/leadScoringSlice';
import { getScoreColorClass } from '../../utils/scoringUtils';

/**
 * Display a lead score with color-coding and tooltip
 */
const LeadScoreIndicator = ({ score, size = 'md' }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const thresholds = useSelector(selectThresholds);
  
  const colorClass = getScoreColorClass(score, thresholds);
  
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base'
  };
  
  return (
    <div className="relative inline-flex">
      <div
        className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-semibold relative cursor-help`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {score}
      </div>
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-surface-800 dark:bg-surface-900 text-white rounded-lg shadow-lg px-3 py-2 text-xs w-48 z-10">
          <div className="font-semibold mb-1">Lead Score: {score}/100</div>
          <div className="text-surface-200 mb-1">Based on interaction frequency, engagement level, and recency</div>
          <div className="flex justify-between text-xs">
            <span className="text-red-400">Low: &lt;{thresholds.low}</span>
            <span className="text-amber-400">Mid: {thresholds.low}-{thresholds.medium}</span>
            <span className="text-green-400">High: &gt;{thresholds.medium}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadScoreIndicator;