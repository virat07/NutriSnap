import React from "react";
import { signOutUser } from "@/services/firebase";
import { Button, View } from "react-native";
import { useRouter } from "expo-router";
const SignOutButton = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    await signOutUser();
    router.replace("/login"); // Sign-out and go to login
  };
  return (
    <View style={{ marginTop: "auto", paddingBottom: 20 }}>
      <Button title="Sign Out" color="red" onPress={handleSignOut} />
    </View>
  );
};

export default SignOutButton;
