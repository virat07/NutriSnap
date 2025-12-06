import { ActivityLevel, Goal, FitnessLevel, Step } from './types';

export const STEPS: Step[] = [
  { title: 'Account', subtitle: 'Tell us about yourself', icon: 'person-circle' },
  { title: 'Personal', subtitle: 'A bit more about you', icon: 'person' },
  { title: 'Metrics', subtitle: 'Your current measurements', icon: 'body' },
  { title: 'Goals', subtitle: 'What do you want to achieve?', icon: 'trophy' },
  { title: 'Preferences', subtitle: 'Dietary and fitness preferences', icon: 'restaurant' },
  { title: 'Health', subtitle: 'Medical considerations', icon: 'medical' },
];

export const REQUIRED_FIELDS_BY_STEP: string[][] = [
  ['name', 'email', 'password'], // Basic Info
  ['age', 'gender'],            // Personal Details
  ['height', 'weight'],         // Body Metrics
  ['activityLevel', 'goal'],    // Goals & Activity
  [],                           // Preferences
  []                            // Health Info
];

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  { key: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { key: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { key: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { key: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { key: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' },
];

export const GOALS: Goal[] = [
  { key: 'lose_weight', label: 'Lose Weight', icon: 'trending-down' },
  { key: 'maintain_weight', label: 'Maintain Weight', icon: 'remove' },
  { key: 'gain_weight', label: 'Gain Weight', icon: 'trending-up' },
  { key: 'build_muscle', label: 'Build Muscle', icon: 'fitness' },
];

export const FITNESS_LEVELS: FitnessLevel[] = [
  { key: 'beginner', label: 'Beginner', description: 'New to fitness' },
  { key: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { key: 'advanced', label: 'Advanced', description: 'Experienced' },
];

export const DIETARY_RESTRICTIONS: string[] = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Dairy-Free',
  'Keto',
  'Paleo',
  'Low-Carb',
  'Mediterranean',
  'None',
];
