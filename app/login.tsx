// app/login.tsx
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getAuthInstance } from "../services/firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const auth = getAuthInstance();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log("Login error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Log In" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  input: { borderWidth: 1, padding: 12, marginBottom: 10, borderRadius: 5 },
});
