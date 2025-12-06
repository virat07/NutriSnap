import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { UserProfile } from '../types';
import { styles } from '../styles';

interface BodyMetricsProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: any) => void;
}

export default function BodyMetrics({ profile, updateProfile }: BodyMetricsProps) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Body Measurements</Text>
      <Text style={styles.stepSubtitle}>Current height and weight for accurate calculations</Text>
      
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Height (cm) *</Text>
          <TextInput
            style={styles.textInput}
            value={profile.height}
            onChangeText={(text) => updateProfile('height', text)}
            placeholder="170"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
        
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Current Weight (kg) *</Text>
          <TextInput
            style={styles.textInput}
            value={profile.weight}
            onChangeText={(text) => updateProfile('weight', text)}
            placeholder="70"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Target Weight (kg)</Text>
        <TextInput
          style={styles.textInput}
          value={profile.targetWeight}
          onChangeText={(text) => updateProfile('targetWeight', text)}
          placeholder="65"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}
