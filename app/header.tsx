import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerActions } from "@react-navigation/native";

const Header = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
    
      {/* The TouchableOpacity contains the hamburger menu icon wrapped in a Text component */}
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <Text style={styles.menuIcon}>☰</Text> {/* Hamburger menu */}
      </TouchableOpacity>

      {/* App title wrapped in Text component */}
      <Text style={styles.title}>NutriSnap</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 20,
    backgroundColor: "#6200ea",
    elevation: 4, // Add shadow effect for Android
  },
  menuIcon: {
    fontSize: 30,
    color: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Header;
