// app/_layout.tsx
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthInstance } from "../services/firebase";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = getAuthInstance();

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed:", user ? "signed in" : "signed out");
        if (user) {
          router.replace("/");
        } else {
          router.replace("/login");
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
      <Slot />
    </GestureHandlerRootView>
  );
}
