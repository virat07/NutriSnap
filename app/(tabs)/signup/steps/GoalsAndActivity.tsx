import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../types';
import { GOALS, ACTIVITY_LEVELS } from '../constants';
import { styles } from '../styles';

interface GoalsAndActivityProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: any) => void;
}

export default function GoalsAndActivity({ profile, updateProfile }: GoalsAndActivityProps) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Your Goals & Activity</Text>
      <Text style={styles.stepSubtitle}>Help us understand your lifestyle and objectives</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>What&apos;s your main goal? *</Text>
        <View style={styles.goalsContainer}>
          {GOALS.map((goal) => (
            <TouchableOpacity
              key={goal.key}
              style={[
                styles.goalButton,
                profile.goal === goal.key && styles.goalButtonActive
              ]}
              onPress={() => updateProfile('goal', goal.key)}
            >
              <Ionicons
                name={goal.icon as any}
                size={24}
                color={profile.goal === goal.key ? '#fff' : '#00b894'}
              />
              <Text style={[
                styles.goalButtonText,
                profile.goal === goal.key && styles.goalButtonTextActive
              ]}>
                {goal.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Activity Level *</Text>
        <View style={styles.activityContainer}>
          {ACTIVITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.activityButton,
                profile.activityLevel === level.key && styles.activityButtonActive
              ]}
              onPress={() => updateProfile('activityLevel', level.key)}
            >
              <Text style={[
                styles.activityButtonTitle,
                profile.activityLevel === level.key && styles.activityButtonTitleActive
              ]}>
                {level.label}
              </Text>
              <Text style={[
                styles.activityButtonDescription,
                profile.activityLevel === level.key && styles.activityButtonDescriptionActive
              ]}>
                {level.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
