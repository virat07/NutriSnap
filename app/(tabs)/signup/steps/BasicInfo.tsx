import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { UserProfile } from '../types';
import { styles } from '../styles';

interface BasicInfoProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: any) => void;
}

export default function BasicInfo({ profile, updateProfile }: BasicInfoProps) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Let&apos;s get to know you</Text>
      <Text style={styles.stepSubtitle}>This helps us personalize your experience</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.textInput}
          value={profile.name}
          onChangeText={(text) => updateProfile('name', text)}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address *</Text>
        <TextInput
          style={styles.textInput}
          value={profile.email}
          onChangeText={(text) => updateProfile('email', text)}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Password *</Text>
        <TextInput
          style={styles.textInput}
          value={profile.password}
          onChangeText={(text) => updateProfile('password', text)}
          placeholder="Enter a password"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}
