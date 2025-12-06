import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { UserProfile } from '../types';
import { styles } from '../styles';

interface PersonalDetailsProps {
  profile: UserProfile;
  updateProfile: (field: keyof UserProfile, value: any) => void;
}

export default function PersonalDetails({ profile, updateProfile }: PersonalDetailsProps) {
  const genderOptions = [
    { key: 'male', emoji: '👨' },
    { key: 'female', emoji: '👩' },
    { key: 'other', emoji: '🧑' }
  ];

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Personal Details</Text>
      <Text style={styles.stepSubtitle}>A bit more about you</Text>
      
      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Age *</Text>
          <TextInput
            style={styles.textInput}
            value={profile.age}
            onChangeText={(text) => updateProfile('age', text)}
            placeholder="25"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>
        
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.inputLabel}>Gender *</Text>
          <View style={styles.genderContainer}>
            {genderOptions.map((gender, idx) => (
              <TouchableOpacity
                key={gender.key}
                style={[
                  styles.genderCard,
                  profile.gender === gender.key && styles.genderCardActive,
                  idx !== 0 && { marginLeft: 18 }
                ]}
                onPress={() => updateProfile('gender', gender.key)}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.genderEmoji,
                  profile.gender === gender.key && styles.genderEmojiActive,
                  { fontSize: 28, marginBottom: 0 }
                ]}>
                  {gender.emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
