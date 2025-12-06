import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { UserProfile } from '../types';
import { styles } from '../styles';

interface HealthInfoProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: any) => void;
}

export default function HealthInfo({ profile, updateProfile }: HealthInfoProps) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Health Information</Text>
      <Text style={styles.stepSubtitle}>Optional - helps us provide better recommendations</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Medical Conditions</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={profile.medicalConditions}
          onChangeText={(text) => updateProfile('medicalConditions', text)}
          placeholder="Any medical conditions we should know about?"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Food Allergies</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={profile.allergies}
          onChangeText={(text) => updateProfile('allergies', text)}
          placeholder="Any food allergies or sensitivities?"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );
}
