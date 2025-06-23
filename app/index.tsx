// app/index.tsx
import { View, Text, Button } from 'react-native';
// import { signOut } from 'firebase/auth';
// import { auth } from '../services/firebase';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>🏠 Welcome to NutriSnap</Text>
      {/* <Button title="Logout" onPress={() => signOut()} /> */}
    </View>
  );
}
