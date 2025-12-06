import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { UserProfile } from '../types';
import { FITNESS_LEVELS, DIETARY_RESTRICTIONS } from '../constants';
import { styles } from '../styles';

interface PreferencesProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: any) => void;
  toggleDietaryRestriction: (restriction: string) => void;
}

export default function Preferences({ profile, updateProfile, toggleDietaryRestriction }: PreferencesProps) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Preferences</Text>
      <Text style={styles.stepSubtitle}>Customize your experience</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Fitness Level</Text>
        <View style={styles.fitnessContainer}>
          {FITNESS_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.fitnessButton,
                profile.fitnessLevel === level.key && styles.fitnessButtonActive
              ]}
              onPress={() => updateProfile('fitnessLevel', level.key)}
            >
              <Text style={[
                styles.fitnessButtonTitle,
                profile.fitnessLevel === level.key && styles.fitnessButtonTitleActive
              ]}>
                {level.label}
              </Text>
              <Text style={[
                styles.fitnessButtonDescription,
                profile.fitnessLevel === level.key && styles.fitnessButtonDescriptionActive
              ]}>
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Dietary Restrictions</Text>
        <Text style={styles.inputSubtext}>Select all that apply</Text>
        <View style={styles.dietaryContainer}>
          {DIETARY_RESTRICTIONS.map((restriction) => (
            <TouchableOpacity
              key={restriction}
              style={[
                styles.dietaryButton,
                profile.dietaryRestrictions.includes(restriction) && styles.dietaryButtonActive
              ]}
              onPress={() => toggleDietaryRestriction(restriction)}
            >
              <Text style={[
                styles.dietaryButtonText,
                profile.dietaryRestrictions.includes(restriction) && styles.dietaryButtonTextActive
              ]}>
                {restriction}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
