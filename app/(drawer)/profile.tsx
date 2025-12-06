import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { getAuthInstance, db } from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const mockData: { [key: string]: any } = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "",
    age: "25",
    gender: "other",
    height: "170",
    weight: "70",
    targetWeight: "65",
    activityLevel: "moderately_active",
    goal: "maintain_weight",
    dietaryRestrictions: [],
    fitnessLevel: "beginner",
    medicalConditions: "",
    allergies: "",
  };
  const [mockFields, setMockFields] = useState<string[]>([]);

  useEffect(() => {
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        let userData = userDoc.exists() ? userDoc.data() : {};
        // Fill missing fields with mock data and track which are mock
        const missing: string[] = [];
        const filledUser: any = { ...userData };
        Object.keys(mockData).forEach((key) => {
          if (!userData[key]) {
            filledUser[key] = mockData[key];
            missing.push(key);
          }
        });
        // Avatar fallback
        if (!filledUser.avatar) {
          filledUser.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            filledUser.name || "U"
          )}`;
        }
        setUser(filledUser);
        setMockFields(missing);
      }
      setLoadingProfile(false);
    });
    return () => unsubscribe();
  }, []);

  if (loadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00b894" />
      </View>
    );
  }

  // Helper for mock pill
  const MockPill = () => (
    <View style={styles.mockPill}>
      <Text style={styles.mockPillText}>mock</Text>
    </View>
  );

  const GENDER_MAP: { [key: string]: string } = {
    male: "Male",
    female: "Female",
    other: "Other",
  };
  const GOAL_MAP: { [key: string]: string } = {
    lose_weight: "Lose weight",
    maintain_weight: "Maintain weight",
    gain_weight: "Gain weight",
    build_muscle: "Build muscle",
  };
  const ACTIVITY_MAP: { [key: string]: string } = {
    sedentary: "Sedentary",
    lightly_active: "Lightly active",
    moderately_active: "Moderately active",
    very_active: "Very active",
    extremely_active: "Extremely active",
  };
  const FITNESS_MAP: { [key: string]: string } = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
  };

  const gender = GENDER_MAP[user?.gender] || user?.gender;
  const goal = GOAL_MAP[user?.goal] || user?.goal;
  const activity = ACTIVITY_MAP[user?.activityLevel] || user?.activityLevel;
  const fitness = FITNESS_MAP[user?.fitnessLevel] || user?.fitnessLevel;

  return (
    <ScrollView style={styles.bg} contentContainerStyle={styles.scrollContent}>
      <TouchableOpacity
        style={{
          marginTop: 8,
          backgroundColor: "#00b894",
          paddingVertical: 6,
          paddingHorizontal: 16,
          borderRadius: 10,
        }}
        onPress={() =>
          router.navigate({
            pathname: "/editProfile",
            params: { user: JSON.stringify(user) },
          })
        }
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Edit Profile</Text>
      </TouchableOpacity>
      <View style={styles.topSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <Text style={styles.name}>
          {user?.name}
          {mockFields.includes("name") && <MockPill />}
        </Text>
        <Text style={styles.email}>
          {user?.email}
          {mockFields.includes("email") && <MockPill />}
        </Text>
      </View>

      {/* Personal Info */}
      <ProfileSection icon="👤" title="Personal Info">
        <ProfileDetail
          label="Age"
          value={user?.age ? String(user.age) : ""}
          mock={mockFields.includes("age")}
        />
        <ProfileDetail
          label="Gender"
          value={user?.gender ? String(user.gender) : ""}
          mock={mockFields.includes("gender")}
          map={GENDER_MAP}
        />
      </ProfileSection>

      {/* Body Metrics */}
      <ProfileSection icon="📏" title="Body Metrics">
        <ProfileDetail
          label="Height (cm)"
          value={user?.height ? String(user.height) : ""}
          mock={mockFields.includes("height")}
        />
        <ProfileDetail
          label="Weight (kg)"
          value={user?.weight ? String(user.weight) : ""}
          mock={mockFields.includes("weight")}
        />
        <ProfileDetail
          label="Target Weight (kg)"
          value={user?.targetWeight ? String(user.targetWeight) : ""}
          mock={mockFields.includes("targetWeight")}
        />
      </ProfileSection>

      {/* Preferences */}
      <ProfileSection icon="🏃‍♂️" title="Preferences">
        <ProfileDetail
          label="Activity Level"
          value={user?.activityLevel ? String(user.activityLevel) : ""}
          mock={mockFields.includes("activityLevel")}
          map={ACTIVITY_MAP}
        />
        <ProfileDetail
          label="Goal"
          value={user?.goal ? String(user.goal) : ""}
          mock={mockFields.includes("goal")}
          map={GOAL_MAP}
        />
        <ProfileDetail
          label="Dietary Restrictions"
          value={
            Array.isArray(user?.dietaryRestrictions)
              ? user.dietaryRestrictions.join(", ")
              : user?.dietaryRestrictions
              ? String(user.dietaryRestrictions)
              : ""
          }
          mock={mockFields.includes("dietaryRestrictions")}
        />
        <ProfileDetail
          label="Fitness Level"
          value={user?.fitnessLevel ? String(user.fitnessLevel) : ""}
          mock={mockFields.includes("fitnessLevel")}
          map={FITNESS_MAP}
        />
      </ProfileSection>

      {/* Health */}
      <ProfileSection icon="🩺" title="Health">
        <ProfileDetail
          label="Medical Conditions"
          value={user?.medicalConditions ? String(user.medicalConditions) : ""}
          mock={mockFields.includes("medicalConditions")}
        />
        <ProfileDetail
          label="Allergies"
          value={user?.allergies ? String(user.allergies) : ""}
          mock={mockFields.includes("allergies")}
        />
      </ProfileSection>
    </ScrollView>
  );
}

function ProfileSection({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View>{children}</View>
    </View>
  );
}

function ProfileDetail({
  label,
  value,
  mock,
  map,
}: {
  label: string;
  value: string;
  mock: boolean;
  map?: Record<string, string>;
}) {
  if (!value) return null;
  let displayValue = value;
  if (map) {
    displayValue = (map as Record<string, string>)[value] || value;
  }
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <View style={styles.detailValueWrap}>
        <Text style={styles.detailValue}>{displayValue}</Text>
        {mock && (
          <View style={styles.inlineMockPill}>
            <Text style={styles.inlineMockPillText}>mock</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f4f6fa",
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f4f6fa",
    alignItems: "center",
    justifyContent: "center",
  },
  topSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#00b894",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e9ecef",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  userSentence: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 22,
  },
  mockPill: {
    backgroundColor: "#bbb",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    alignSelf: "center",
  },
  mockPillText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  sectionCard: {
    width: "92%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },
  detailsList: {
    width: "100%",
    marginTop: 18,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 15,
    color: "#888",
    flex: 1,
    textAlign: "left",
  },
  detailValueWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    maxWidth: "60%",
    justifyContent: "flex-end",
  },
  detailValue: {
    fontSize: 15,
    color: "#222",
    flexShrink: 1,
    textAlign: "right",
  },
  inlineMockPill: {
    backgroundColor: "#bbb",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 6,
    alignSelf: "center",
  },
  inlineMockPillText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
