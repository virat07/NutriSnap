import { useRouter } from "expo-router";
import { useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthInstance } from "../services/firebase";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ProfileScreen from "./profile"; // Profile screen component
import DashboardScreen from "./home"; // Dashboard screen component
import Header from "./header"; // Import Header component
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"; // SafeAreaContext

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = getAuthInstance();

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed:", user ? "signed in" : "signed out");
        if (user) {
          router.replace("/"); // Home screen
        } else {
          router.replace("/login"); // Login screen
        }
      });

      return unsubscribe;
    };

    const unsubscribePromise = checkAuth();

    return () => {
      unsubscribePromise.then((unsub) => {
        if (typeof unsub === "function") {
          unsub();
        }
      });
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
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
          >
            <Drawer.Screen name="Dashboard" component={DashboardScreen} />
            <Drawer.Screen name="My Profile" component={ProfileScreen} />
          </Drawer.Navigator>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
