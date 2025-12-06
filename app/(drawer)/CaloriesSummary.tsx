// app/(drawer)/CaloriesSummary.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type PhotoEntry = {
  id: string;
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
};

type Props = {
  photos: PhotoEntry[];
};

// Circular progress component
const CircularProgress = ({ 
  value, 
  max, 
  color, 
  label, 
  unit 
}: { 
  value: number; 
  max: number; 
  color: string; 
  label: string; 
  unit: string;
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressCircle}>
        <View style={[styles.progressFill, { 
          backgroundColor: color,
          height: `${percentage}%`,
        }]} />
        <View style={styles.progressContent}>
          <Text style={styles.progressValue}>{Math.round(value)}</Text>
          <Text style={styles.progressUnit}>{unit}</Text>
        </View>
      </View>
      <Text style={styles.progressLabel}>{label}</Text>
      <Text style={styles.progressGoal}>of {max}{unit}</Text>
    </View>
  );
};

export default function CaloriesSummary({ photos }: Props) {
  const totals = photos.reduce(
    (acc, p) => ({
      calories: acc.calories + (p.calories || 0),
      fat: acc.fat + (p.fat || 0),
      protein: acc.protein + (p.protein || 0),
      carbs: acc.carbs + (p.carbs || 0),
    }),
    { calories: 0, fat: 0, protein: 0, carbs: 0 }
  );

  // Daily goals (customizable)
  const goals = {
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65,
  };

  const mealCount = photos.length;

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Today's Nutrition</Text>
          <Text style={styles.subtitle}>{mealCount} meal{mealCount !== 1 ? 's' : ''} logged</Text>
        </View>
        <View style={styles.caloriesBadge}>
          <Text style={styles.caloriesValue}>{totals.calories}</Text>
          <Text style={styles.caloriesLabel}>kcal</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        <CircularProgress 
          value={totals.protein} 
          max={goals.protein} 
          color="#4ade80" 
          label="Protein" 
          unit="g"
        />
        <CircularProgress 
          value={totals.carbs} 
          max={goals.carbs} 
          color="#60a5fa" 
          label="Carbs" 
          unit="g"
        />
        <CircularProgress 
          value={totals.fat} 
          max={goals.fat} 
          color="#fbbf24" 
          label="Fat" 
          unit="g"
        />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {Math.round((totals.calories / goals.calories) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Daily Goal</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {goals.calories - totals.calories > 0 
              ? Math.round(goals.calories - totals.calories) 
              : 0}
          </Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
  caloriesBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
  },
  caloriesValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  caloriesLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
  },
  progressRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  progressContainer: {
    alignItems: "center",
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "flex-end",
    overflow: "hidden",
    position: "relative",
  },
  progressFill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 40,
  },
  progressContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  progressValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  progressUnit: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressLabel: {
    fontSize: 13,
    color: "#fff",
    marginTop: 8,
    fontWeight: "600",
  },
  progressGoal: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },
});
