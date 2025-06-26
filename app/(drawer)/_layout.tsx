// app/(drawer)/_layout.tsx
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DashboardScreen from "./home"; // Your Dashboard screen
import ProfileScreen from "./profile"; // Your Profile screen
import Header from "./header"; // Your custom header
import SignOutButton from "./signout";

const DrawerLayout = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        header: ({ navigation }) => <Header navigation={navigation} />,
        drawerType: "front",
        drawerStyle: {
          width: 250,
          backgroundColor: "#fff",
        },
      }}
      // drawerContent={() => <SignOutButton />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="My Profile" component={ProfileScreen} />
      <Drawer.Screen
        name="Sign Out"
        component={SignOutButton}
        options={{
          drawerItemStyle: {
            borderTopWidth: 1,
            borderTopColor: "#ccc",
            paddingVertical: 10,
            marginVertical: 20,
            flex: 1,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerLayout;
