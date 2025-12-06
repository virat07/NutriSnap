import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { getAuthInstance, updateUserProfile } from "../../services/firebase";
import {  useNavigation } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

export default function EditProfile() {
  const navigation = useNavigation();

  const { user } = useLocalSearchParams();
  const parsedUser = JSON.parse(user as string);
  const userData = parsedUser || {};

  const [form, setForm] = useState({ ...userData });

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    try {
      const auth = getAuthInstance();
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Use updateUserProfile which creates or updates the document
      await updateUserProfile(user.uid, form);
      Alert.alert("Success", "Profile updated!");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {[
        "name",
        "email",
        "age",
        "height",
        "weight",
        "targetWeight",
        "medicalConditions",
        "allergies",
      ].map((field) => (
        <View key={field} style={styles.inputGroup}>
          <Text style={styles.label}>
            {field.charAt(0).toUpperCase() + field.slice(1)}
          </Text>
          <TextInput
            style={styles.input}
            value={form[field] || ""}
            onChangeText={(text) => handleChange(field, text)}
            keyboardType={
              ["age", "height", "weight", "targetWeight"].includes(field)
                ? "numeric"
                : "default"
            }
          />
        </View>
      ))}
      <Button title="Save Changes" onPress={handleSave} color="#00b894" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 4,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
});
