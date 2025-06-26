// app/_layout.tsx
import "expo-router/entry";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthInstance } from "../services/firebase";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = getAuthInstance();

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed:", user ? "signed in" : "signed out");
        // If user is signed in, navigate to home (dashboard)
        if (user) {
          router.replace("/(drawer)/home"); // Go to the Drawer layout
        } else {
          router.replace("/login"); // Redirect to login screen
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
          <Slot />
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
