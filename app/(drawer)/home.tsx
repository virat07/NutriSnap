import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";

export default function DashboardScreen() {
  const [user, setUser] = useState({
    name: "John Doe",
    avatar: "https://www.example.com/avatar.jpg", // Replace with a real avatar
    calories: 2000,
    protein: 120,
    fats: 80,
    carbs: 220,
    weight: 75, // kg
    targetWeight: 70, // kg
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.welcome}>Welcome, {user.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health Stats</Text>
          <Text style={styles.stat}>Calories: {user.calories} kcal</Text>
          <Text style={styles.stat}>Protein: {user.protein} g</Text>
          <Text style={styles.stat}>Fats: {user.fats} g</Text>
          <Text style={styles.stat}>Carbs: {user.carbs} g</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <Text style={styles.stat}>Current Weight: {user.weight} kg</Text>
          <Text style={styles.stat}>Target Weight: {user.targetWeight} kg</Text>
          {/* Here you can add a chart component for progress */}
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Log a Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Track Activity</Text>
        </TouchableOpacity>

        {/* More sections can be added here */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#00b894",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  welcome: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  stat: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#00b894",
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
