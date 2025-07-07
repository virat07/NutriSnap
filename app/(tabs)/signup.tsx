import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

interface UserProfile {
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

const ACTIVITY_LEVELS = [
  { key: 'sedentary', label: 'Sedentary', description: 'Little to no exercise' },
  { key: 'lightly_active', label: 'Lightly Active', description: 'Light exercise 1-3 days/week' },
  { key: 'moderately_active', label: 'Moderately Active', description: 'Moderate exercise 3-5 days/week' },
  { key: 'very_active', label: 'Very Active', description: 'Hard exercise 6-7 days/week' },
  { key: 'extremely_active', label: 'Extremely Active', description: 'Very hard exercise, physical job' },
];

const GOALS = [
  { key: 'lose_weight', label: 'Lose Weight', icon: 'trending-down' },
  { key: 'maintain_weight', label: 'Maintain Weight', icon: 'remove' },
  { key: 'gain_weight', label: 'Gain Weight', icon: 'trending-up' },
  { key: 'build_muscle', label: 'Build Muscle', icon: 'fitness' },
];

const FITNESS_LEVELS = [
  { key: 'beginner', label: 'Beginner', description: 'New to fitness' },
  { key: 'intermediate', label: 'Intermediate', description: 'Some experience' },
  { key: 'advanced', label: 'Advanced', description: 'Experienced' },
];

const DIETARY_RESTRICTIONS = [
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
  const [user, setUser] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
      setLoadingProfile(false);
    });
    return () => unsubscribe();
  }, []);

  const steps = [
    { title: 'Basic Info', subtitle: 'Tell us about yourself' },
    { title: 'Personal Details', subtitle: 'A bit more about you' },
    { title: 'Body Metrics', subtitle: 'Your current measurements' },
    { title: 'Goals & Activity', subtitle: 'What do you want to achieve?' },
    { title: 'Preferences', subtitle: 'Dietary and fitness preferences' },
    { title: 'Health Info', subtitle: 'Medical considerations' },
  ];

  const requiredFieldsByStep = [
    ['name', 'email', 'password'], // Basic Info
    ['age', 'gender'],            // Personal Details
    ['height', 'weight'],         // Body Metrics
    ['activityLevel', 'goal'],    // Goals & Activity
    [],                           // Preferences
    []                            // Health Info
  ];

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

  const nextStep = () => {
    const requiredFields = requiredFieldsByStep[currentStep] || [];
    const missingFields = requiredFields.filter(field => !profile[field as keyof UserProfile]);
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    if (currentStep < steps.length - 1) {
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
    // Validate all required fields for all steps
    const allRequired = requiredFieldsByStep.flat();
    const missingFields = allRequired.filter(field => !profile[field as keyof UserProfile]);
    if (missingFields.length > 0) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const auth = getAuthInstance();
      const userCredential = await createUserWithEmailAndPassword(auth, profile.email, profile.password);
      const { uid } = userCredential.user;
      // Save profile to Firestore (exclude password)
      const { password, ...profileData } = profile;
      await setDoc(doc(db, 'users', uid), {
        ...profileData,
        uid,
        createdAt: new Date().toISOString(),
      });
      router.replace('/(drawer)/home');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Signup Error', error.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#00b894" style={{ flex: 1, justifyContent: 'center' }} />
      </SafeAreaView>
    );
  }

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepContainer}>
          <View style={[
            styles.stepCircle,
            index <= currentStep ? styles.stepCircleActive : styles.stepCircleInactive
          ]}>
            <Text style={[
              styles.stepNumber,
              index <= currentStep ? styles.stepNumberActive : styles.stepNumberInactive
            ]}>
              {index + 1}
            </Text>
          </View>
          {index < steps.length - 1 && (
            <View style={[
              styles.stepLine,
              index < currentStep ? styles.stepLineActive : styles.stepLineInactive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderBasicInfo = () => (
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

  const renderPersonalDetails = () => (
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
            {[
              { key: 'male', emoji: '👨' },
              { key: 'female', emoji: '👩' },
              { key: 'other', emoji: '🧑' }
            ].map((gender, idx) => (
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
                  { fontSize: 32, marginBottom: 0 }
                ]}>{gender.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderBodyMetrics = () => (
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

  const renderGoalsAndActivity = () => (
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

  const renderPreferences = () => (
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

  const renderHealthInfo = () => (
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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderPersonalDetails();
      case 2: return renderBodyMetrics();
      case 3: return renderGoalsAndActivity();
      case 4: return renderPreferences();
      case 5: return renderHealthInfo();
      default: return renderBasicInfo();
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
          {renderStepIndicator()}
          {/* Step Title */}
          <View style={styles.stepHeader}>
            <Text style={styles.currentStepTitle}>{steps[currentStep].title}</Text>
            <Text style={styles.currentStepSubtitle}>{steps[currentStep].subtitle}</Text>
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
                currentStep === steps.length - 1 && styles.finishButton
              ]}
              onPress={nextStep}
              disabled={loading}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? 'Create Account' : 'Next'}
              </Text>
              <Ionicons
                name={currentStep === steps.length - 1 ? 'checkmark' : 'arrow-forward'}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef', // fallback
  },
  stepCircleActive: {
    backgroundColor: '#00b894',
  },
  stepCircleInactive: {
    backgroundColor: '#e9ecef',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepNumberInactive: {
    color: '#6c757d',
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#00b894',
  },
  stepLineInactive: {
    backgroundColor: '#e9ecef',
  },
  stepHeader: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  currentStepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  currentStepSubtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  stepContent: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputSubtext: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 4,
},
genderCard: {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 12,
  borderWidth: 1.5,
  borderColor: '#e0e0e0',
  alignItems: 'center',
  paddingVertical: 18,
  paddingHorizontal: 0,
  minWidth: 80,
  elevation: 2,
},
genderCardActive: {
  backgroundColor: '#00b894',
  borderColor: '#00b894',
  shadowColor: '#00b894',
  shadowOpacity: 0.15,
},
genderEmoji: {
  fontSize: 16,
  marginBottom: 4,
},
genderEmojiActive: {
  color: '#fff',
},
genderCardText: {
  fontSize: 15,
  fontWeight: '600',
  color: '#333',
},
genderCardTextActive: {
  color: '#fff',
},
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  goalButtonActive: {
    backgroundColor: '#00b894',
    borderColor: '#00b894',
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  goalButtonTextActive: {
    color: '#fff',
  },
  activityContainer: {
    gap: 12,
  },
  activityButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  activityButtonActive: {
    backgroundColor: '#00b894',
    borderColor: '#00b894',
  },
  activityButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  activityButtonTitleActive: {
    color: '#fff',
  },
  activityButtonDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  activityButtonDescriptionActive: {
    color: '#fff',
    opacity: 0.9,
  },
  fitnessContainer: {
    gap: 12,
  },
  fitnessButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  fitnessButtonActive: {
    backgroundColor: '#00b894',
    borderColor: '#00b894',
  },
  fitnessButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fitnessButtonTitleActive: {
    color: '#fff',
  },
  fitnessButtonDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  fitnessButtonDescriptionActive: {
    color: '#fff',
    opacity: 0.9,
  },
  dietaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dietaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dietaryButtonActive: {
    backgroundColor: '#00b894',
    borderColor: '#00b894',
  },
  dietaryButtonText: {
    fontSize: 14,
    color: '#333',
  },
  dietaryButtonTextActive: {
    color: '#fff',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  backButtonLarge: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#00b894',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  finishButton: {
    backgroundColor: '#28a745',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 10, // for Android
  },
}); 