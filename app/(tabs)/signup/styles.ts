import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  stepHeader: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  currentStepTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 6,
  },
  currentStepSubtitle: {
    fontSize: 15,
    color: '#636e72',
  },
  stepContent: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#636e72',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 8,
  },
  inputSubtext: {
    fontSize: 13,
    color: '#636e72',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#dfe6e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#2d3436',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    shadowColor: '#00b894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  finishButton: {
    backgroundColor: '#00b894',
    shadowColor: '#00b894',
    shadowOpacity: 0.4,
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
    elevation: 10,
  },
  // Gender selection styles
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
  // Goals styles
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  goalButton: {
    width: '48%',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#dfe6e9',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  goalButtonActive: {
    backgroundColor: '#00b894',
    borderColor: '#00b894',
    shadowColor: '#00b894',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  goalButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  goalButtonTextActive: {
    color: '#fff',
  },
  // Activity level styles
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
  // Fitness level styles
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
  // Dietary restrictions styles
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
});
