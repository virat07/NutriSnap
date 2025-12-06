// app/_layout.tsx
import "expo-router/entry";
import { Slot, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthInstance } from "../services/firebase";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const auth = getAuthInstance();

      const unsubscribe = onAuthStateChanged(auth, (user) => {
        console.log("Auth state changed:", user ? "signed in" : "signed out");
        
        // Allow initialization to complete first
        if (!isInitialized) {
          setIsInitialized(true);
          return;
        }
        
        // Don't redirect if user is on public routes
        const isPublicRoute = pathname?.includes('/login') || pathname?.includes('/signup');
        
        // If user is signed in and not already on home, navigate to home
        if (user && !pathname?.includes('/(drawer)/home') && !isPublicRoute) {
          router.replace("/(drawer)/home");
        } else if (!user && !isPublicRoute) {
          // Only redirect to login if not already there
          if (!pathname?.includes('/login')) {
            router.replace("/login");
          }
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
  }, [pathname, isInitialized]);

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
