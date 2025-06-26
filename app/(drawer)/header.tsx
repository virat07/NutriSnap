import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { DrawerActions } from "@react-navigation/native";

const Header = ({ navigation }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
      >
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Image
          source={require("../../assets/images/NutriSnap.png")} 
          style={styles.logo}
        />
        <Text style={styles.title}>NutriSnap</Text>
      </View>
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
    elevation: 4, 
  },
  menuIcon: {
    fontSize: 30,
    color: "#fff",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, 
    justifyContent: "center", 
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10, 
  },
  logo: {
    width: 30, 
    height: 30,
    resizeMode: "contain", 
  },
});

export default Header;
