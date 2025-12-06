export interface UserProfile {
  name: string;
  email: string;
  password: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  height: string;
  weight: string;
  targetWeight: string;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active' | '';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight' | 'build_muscle' | '';
  dietaryRestrictions: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | '';
  medicalConditions: string;
  allergies: string;
}

export interface Step {
  title: string;
  subtitle: string;
  icon: string;
}

export interface ActivityLevel {
  key: string;
  label: string;
  description: string;
}

export interface Goal {
  key: string;
  label: string;
  icon: string;
}

export interface FitnessLevel {
  key: string;
  label: string;
  description: string;
}
