import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAuthInstance, db } from '../../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

// Import refactored modules
import { UserProfile } from './signup/types';
import { STEPS, REQUIRED_FIELDS_BY_STEP } from './signup/constants';
import { validateEmail, validatePassword, getFirebaseErrorMessage } from './signup/validation';
import { styles } from './signup/styles';

// Import components
import StepIndicator from './signup/components/StepIndicator';
import BasicInfo from './signup/steps/BasicInfo';
import PersonalDetails from './signup/steps/PersonalDetails';
import BodyMetrics from './signup/steps/BodyMetrics';
import GoalsAndActivity from './signup/steps/GoalsAndActivity';
import Preferences from './signup/steps/Preferences';
import HealthInfo from './signup/steps/HealthInfo';

export default function SignupScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    targetWeight: '',
    activityLevel: '',
    goal: '',
    dietaryRestrictions: [],
    fitnessLevel: '',
    medicalConditions: '',
    allergies: '',
  });
  const [loading, setLoading] = useState(false);

  const updateProfile = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const toggleDietaryRestriction = (restriction: string) => {
    setProfile(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction]
    }));
  };

  const validateStep = (step: number): boolean => {
    const requiredFields = REQUIRED_FIELDS_BY_STEP[step] || [];
    const missingFields = requiredFields.filter(field => !profile[field as keyof UserProfile]);
    
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return false;
    }
    
    // Additional validation for step 0
    if (step === 0) {
      if (!validateEmail(profile.email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return false;
      }
      if (!validatePassword(profile.password)) {
        Alert.alert('Weak Password', 'Password must be at least 6 characters long.');
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      return;
    }
    
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSignup();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignup = async () => {
    // Validate all steps
    for (let i = 0; i < STEPS.length; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
    }
    
    setLoading(true);
    try {
      const auth = getAuthInstance();
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        profile.email, 
        profile.password
      );
      const { uid } = userCredential.user;
      
      // Save profile to Firestore (exclude password)
      const { password, ...profileData } = profile;
      await setDoc(doc(db, 'users', uid), {
        ...profileData,
        uid,
        createdAt: new Date().toISOString(),
      });
      
      // Navigation will be handled by _layout.tsx onAuthStateChanged
      router.replace('/(drawer)/home');
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.code 
        ? getFirebaseErrorMessage(error.code)
        : error.message || 'Failed to create account. Please try again.';
      
      Alert.alert('Signup Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = { profile, updateProfile };
    
    switch (currentStep) {
      case 0:
        return <BasicInfo {...stepProps} />;
      case 1:
        return <PersonalDetails {...stepProps} />;
      case 2:
        return <BodyMetrics {...stepProps} />;
      case 3:
        return <GoalsAndActivity {...stepProps} />;
      case 4:
        return <Preferences {...stepProps} toggleDietaryRestriction={toggleDietaryRestriction} />;
      case 5:
        return <HealthInfo {...stepProps} />;
      default:
        return <BasicInfo {...stepProps} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Step Indicator */}
          <StepIndicator steps={STEPS} currentStep={currentStep} />

          {/* Step Title */}
          <View style={styles.stepHeader}>
            <Text style={styles.currentStepTitle}>{STEPS[currentStep].title}</Text>
            <Text style={styles.currentStepSubtitle}>{STEPS[currentStep].subtitle}</Text>
          </View>

          {/* Step Content */}
          {renderCurrentStep()}

          {/* Navigation */}
          <View style={styles.navigation}>
            {currentStep > 0 && (
              <TouchableOpacity style={styles.backButtonLarge} onPress={prevStep}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.nextButton,
                currentStep === STEPS.length - 1 && styles.finishButton
              ]}
              onPress={nextStep}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === STEPS.length - 1 ? 'Create Account' : 'Next'}
              </Text>
              <Ionicons
                name={currentStep === STEPS.length - 1 ? 'checkmark' : 'arrow-forward'}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="auto">
          <ActivityIndicator size="large" color="#00b894" />
        </View>
      )}
    </SafeAreaView>
  );
} 