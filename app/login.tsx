import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { getAuthInstance } from "../services/firebase";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "701312807135-j5u8kgpelkl3pae1nml7mnj90kfdg6bv.apps.googleusercontent.com", // Web client ID from Firebase
    redirectUri: makeRedirectUri({
      native: "nutrisnap.app:/oauthredirect", // Match app.json scheme
    }),
  });

  const handleLogin = async () => {
    const auth = getAuthInstance();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/home");
    } catch (err: any) {
      console.log("Login error:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const auth = getAuthInstance();
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log("Google login success:", userCredential.user);
          router.replace("/home");
        })
        .catch((err) => {
          console.error("Google sign-in error:", err);
          setError("Google sign-in failed.");
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        style={styles.input}
        keyboardType="email-address"
      />

      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        style={styles.input}
        secureTextEntry
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button title="Log In" onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.divider} />
      </View>

      {/* Custom Google Button with Logo and Text */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Image
          source={{
            uri: "https://icon2.cleanpng.com/20240216/yhs/transparent-google-logo-google-logo-with-colorful-letters-on-black-1710875297222.webp",
          }} // Google logo from URL
          style={styles.googleLogo}
        />
        <Text style={styles.googleButtonText}>Log in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#777",
  },

  // Custom button styles
  googleButton: {
    backgroundColor: "#4285F4", // Google's Blue Color
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
