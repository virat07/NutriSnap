import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Step } from '../types';

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.indicator}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={[
              styles.stepCircle,
              index < currentStep && styles.stepCircleCompleted,
              index === currentStep && styles.stepCircleActive,
              index > currentStep && styles.stepCircleInactive,
            ]}>
              {index < currentStep ? (
                <Ionicons name="checkmark" size={18} color="#fff" />
              ) : (
                <Ionicons 
                  name={step.icon as any} 
                  size={18} 
                  color={index === currentStep ? '#fff' : '#b2bec3'} 
                />
              )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 20,
  },
  indicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  stepCircleCompleted: {
    backgroundColor: '#00b894',
  },
  stepCircleActive: {
    backgroundColor: '#00b894',
    borderWidth: 3,
    borderColor: '#b2f5ea',
    shadowColor: '#00b894',
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  stepCircleInactive: {
    backgroundColor: '#f1f3f5',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  stepLine: {
    height: 2,
    width: 16,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: '#00b894',
  },
  stepLineInactive: {
    backgroundColor: '#e9ecef',
  },
});
