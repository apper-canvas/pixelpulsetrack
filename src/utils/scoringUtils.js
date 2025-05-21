import { differenceInDays } from 'date-fns';

/**
 * Calculate the lead score based on various factors
 * @param {Object} lead - The lead object
 * @param {Array} interactions - All interactions related to this lead
 * @param {Object} scoringConfig - Scoring configuration with weights and settings
 * @returns {number} - The calculated score between 0-100
 */
export const calculateLeadScore = (lead, interactions, scoringConfig) => {
  const { weights, settings } = scoringConfig;
  
  // Calculate scores for each factor (0-100 for each)
  const interactionFrequencyScore = calculateInteractionFrequencyScore(lead, interactions, settings);
  const engagementLevelScore = calculateEngagementLevelScore(lead, interactions, settings);
  const recencyScore = calculateRecencyScore(lead, settings);
  
  // Apply weights to each factor
  const weightedScore = (
    (interactionFrequencyScore * weights.interactionFrequency / 100) +
    (engagementLevelScore * weights.engagementLevel / 100) +
    (recencyScore * weights.recency / 100)
  );
  
  // Round to nearest integer and ensure it's between 0-100
  return Math.max(0, Math.min(100, Math.round(weightedScore)));
};

/**
 * Calculate the interaction frequency score
 * @param {Object} lead - The lead object
 * @param {Array} interactions - All interactions related to this lead
 * @param {Object} settings - Scoring settings
 * @returns {number} - Score between 0-100
 */
const calculateInteractionFrequencyScore = (lead, interactions, settings) => {
  const leadInteractions = interactions.filter(i => i.leadId === lead.id);
  
  // Recent interactions (within the specified days)
  const now = new Date();
  const recentInteractions = leadInteractions.filter(i => {
    const interactionDate = new Date(i.date);
    return differenceInDays(now, interactionDate) <= settings.recentInteractionDays;
  });
  
  // Score based on number of recent interactions
  // 0 interactions = 0 score, 10+ interactions = 100 score, linear in between
  const maxInteractions = 10; // Arbitrary threshold for maximum score
  return Math.min(100, (recentInteractions.length / maxInteractions) * 100);
};

/**
 * Calculate the engagement level score
 * @param {Object} lead - The lead object
 * @param {Array} interactions - All interactions related to this lead
 * @param {Object} settings - Scoring settings
 * @returns {number} - Score between 0-100
 */
const calculateEngagementLevelScore = (lead, interactions, settings) => {
  const leadInteractions = interactions.filter(i => i.leadId === lead.id);
  
  if (leadInteractions.length === 0) return 0;
  
  // Calculate engagement based on interaction types and their multipliers
  let totalEngagement = 0;
  
  leadInteractions.forEach(interaction => {
    const type = interaction.type.toLowerCase();
    const multiplier = settings.engagementMultipliers[type] || 1; // Default to 1 if not specified
    totalEngagement += multiplier;
  });
  
  // Normalize to 0-100 scale (5+ weighted interactions = 100 score)
  return Math.min(100, (totalEngagement / 5) * 100);
};

/**
 * Calculate the recency score based on time since last contact
 * @param {Object} lead - The lead object
 * @param {Object} settings - Scoring settings
 * @returns {number} - Score between 0-100
 */
const calculateRecencyScore = (lead, settings) => {
  const now = new Date();
  const lastContactedDate = new Date(lead.lastContactedDate);
  const daysSinceLastContact = differenceInDays(now, lastContactedDate);
  
  // If contacted within the threshold, give full score
  // Otherwise, decrease linearly to 0 at maxLastContactDays
  if (daysSinceLastContact <= 0) return 100;
  if (daysSinceLastContact >= settings.maxLastContactDays) return 0;
  
  // Linear decay
  return 100 * (1 - (daysSinceLastContact / settings.maxLastContactDays));
};

/**
 * Get the appropriate color class based on score and thresholds
 * @param {number} score - The lead score (0-100)
 * @param {Object} thresholds - The thresholds for low, medium, and high scores
 * @returns {string} - The appropriate color class
 */
export const getScoreColorClass = (score, thresholds) => {
  if (score >= thresholds.medium) {
    return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
  } else if (score >= thresholds.low) {
    return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400';
  } else {
    return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
  }
};