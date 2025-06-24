import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Profile</Text>
      <Text style={styles.profileText}>Name: John Doe</Text>
      <Text style={styles.profileText}>Email: john.doe@example.com</Text>
      {/* Add more profile details */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
