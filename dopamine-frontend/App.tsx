import React, { useState, useEffect, useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
  TextInput,
  LogBox,
  Animated,
  useWindowDimensions,
} from "react-native";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";
import TriggerHeatmap from "./TriggerHeatmap";
import FrictionOverlay from "./FrictionOverlay";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["expo-notifications: Android Push notifications"]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<string>("");
  const [savingsGoal, setSavingsGoal] = useState<string>("");
  const [isBombArmed, setIsBombArmed] = useState<boolean>(false);
  const [showFriction, setShowFriction] = useState<boolean>(false);
  const [triggerReason, setTriggerReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentStep, fadeAnim]);

  useEffect(() => {
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        setCurrentStep(1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const plantTimeBomb = async () => {
    Alert.alert("Guardian Active", "Monitoring footprint...");

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Please enable notifications.");
        return;
      }
    } catch (error) {
      console.error("Notifications Error:", error);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ High Impulse Risk",
        body: "Your impulse risk is 85% because you've been on social media for 65 mins.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      },
    });

    setIsBombArmed(true);

    const now = new Date();
    const hour = now.getHours();
    let time_of_day = "Late Night";
    if (hour >= 6 && hour < 12) time_of_day = "Morning";
    else if (hour >= 12 && hour < 17) time_of_day = "Afternoon";
    else if (hour >= 17 && hour < 22) time_of_day = "Evening";

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const day_of_week = days[now.getDay()];

    const url = "http://10.221.153.35:8000/api/v1/trigger";
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time_of_day,
        day_of_week,
        app_sequence: "Instagram -> Amazon",
        social_screen_time_mins: 65,
        daily_spend_ratio: 2.5,
        erratic_usage_score: 8.2,
      }),
    }).catch((error) => console.error("API Error:", error));
  };

  const handleCloseOverlay = () => setShowFriction(false);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.splashContainer}>
            <Text style={styles.splashText}>
              PnP <Text style={styles.neonText}>pauseNpay</Text>
            </Text>
          </View>
        );
      case 1:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.headerWrapper}>
              <Text style={styles.bigHeader}>
                Welcome to{"\n"}
                <Text style={{ color: "#7CFF2D" }}>pauseNpay.</Text>
              </Text>
              <Text style={styles.subtitle}>
                The premium pause that aligns your transactions with your actual
                intentions.
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.whiteButton}
                onPress={() => setCurrentStep(2)}
              >
                <Text style={styles.whiteButtonText}>GET STARTED</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.headerWrapper}>
              <Text style={styles.bigHeader}>
                What's your{"\n"}
                <Text style={{ color: "#7CFF2D" }}>current balance</Text>?
              </Text>
              <Text style={styles.subtitle}>
                Enter your total available liquidity to calibrate your
                dashboard.
              </Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                focusedInput === "balance" && styles.inputContainerFocused,
              ]}
            >
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={[
                  styles.input,
                  Platform.OS === "web" && ({ outlineStyle: "none" } as any),
                ]}
                value={currentBalance}
                onChangeText={setCurrentBalance}
                keyboardType="numeric"
                placeholder="e.g. 50000"
                placeholderTextColor="#555"
                onFocus={() => setFocusedInput("balance")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.neonButton}
                onPress={() => setCurrentStep(3)}
              >
                <Text style={styles.neonButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.headerWrapper}>
              <Text style={styles.bigHeader}>
                What's your{"\n"}
                <Text style={{ color: "#7CFF2D" }}>savings goal</Text>?
              </Text>
              <Text style={styles.subtitle}>
                Define your mindful target for the month.
              </Text>
            </View>
            <View
              style={[
                styles.inputContainer,
                focusedInput === "savings" && styles.inputContainerFocused,
              ]}
            >
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput
                style={[
                  styles.input,
                  Platform.OS === "web" && ({ outlineStyle: "none" } as any),
                ]}
                value={savingsGoal}
                onChangeText={setSavingsGoal}
                keyboardType="numeric"
                placeholder="e.g. 15000"
                placeholderTextColor="#555"
                onFocus={() => setFocusedInput("savings")}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.neonButton}
                onPress={() => setCurrentStep(4)}
              >
                <Text style={styles.neonButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.stepContainerCenter}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={100}
                color="#7CFF2D"
                style={styles.checkmarkIcon}
              />
              <Text style={styles.allSetText}>You're all set!</Text>
              <Text style={styles.subtitleCentered}>
                Let's try to save ₹{savingsGoal || "0"} this month.
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.neonButton}
                onPress={() => setCurrentStep(5)}
              >
                <Text style={styles.neonButtonText}>Go to Dashboard ➔</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 5:
        return (
          <View
            style={[
              styles.dashboardContainer,
              { paddingTop: Platform.OS === "android" ? 40 : 0 },
            ]}
          >
            <ScrollView
              contentContainerStyle={[
                styles.scrollContent,
                { paddingHorizontal: isLargeScreen ? 40 : 20 },
              ]}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  flexDirection: isLargeScreen ? "row" : "column",
                  justifyContent: "space-between",
                  alignItems: isLargeScreen ? "flex-start" : "stretch",
                }}
              >
                <View
                  style={[
                    styles.financialCard,
                    {
                      width: isLargeScreen ? "35%" : "100%",
                      marginBottom: isLargeScreen ? 0 : 20,
                    },
                  ]}
                >
                  <Text style={styles.financialTitle}>Financial Profile</Text>
                  <View style={styles.financialRow}>
                    <Text style={styles.financialLabel}>Current Balance:</Text>
                    <Text style={styles.financialValue}>
                      ₹{currentBalance || "0"}
                    </Text>
                  </View>
                  <View style={styles.financialRow}>
                    <Text style={styles.financialLabel}>Savings Goal:</Text>
                    <Text style={styles.financialValue}>
                      ₹{savingsGoal || "0"}
                    </Text>
                  </View>
                </View>

                <View
                  style={[
                    { width: isLargeScreen ? "60%" : "100%" },
                    { flex: 1, padding: 10 },
                  ]}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    onLongPress={plantTimeBomb}
                    delayLongPress={1000}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#7CFF2D",
                        letterSpacing: 2,
                        marginBottom: 15,
                        paddingTop: 10,
                        includeFontPadding: false,
                        textTransform: "uppercase",
                      }}
                    >
                      YOUR RISKIEST WINDOW
                    </Text>
                  </TouchableOpacity>
                  <View style={[styles.heatmapWrapper, { marginTop: 10 }]}>
                    <TriggerHeatmap />
                  </View>
                </View>
              </View>
            </ScrollView>

            {showFriction && (
              <FrictionOverlay
                triggerReason={triggerReason}
                cartAmount={29990}
                onSkip={handleCloseOverlay}
                onProceed={handleCloseOverlay}
              />
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      {renderStep()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFFFFF",
    letterSpacing: -1,
  },
  neonText: { color: "#7CFF2D" },
  stepContainer: {
    flex: 1,
    backgroundColor: "#121212",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  stepContainerCenter: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  headerWrapper: {
    marginTop: 40,
  },
  bigHeader: {
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1,
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 12,
    lineHeight: 24,
  },
  subtitleCentered: {
    fontSize: 16,
    color: "#A0A0A0",
    marginTop: 12,
    lineHeight: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderBottomWidth: 3,
    borderBottomColor: "#333",
    marginTop: 40,
    paddingHorizontal: 24,
  },
  inputContainerFocused: {
    borderBottomColor: "#7CFF2D",
    backgroundColor: "#1A1A1A",
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7CFF2D",
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "#7CFF2D",
    fontSize: 32,
    fontWeight: "bold",
    paddingVertical: 24,
    borderWidth: 0,
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 40,
    width: "100%",
  },
  whiteButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  whiteButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000000",
    letterSpacing: 1,
  },
  neonButton: {
    backgroundColor: "#7CFF2D",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
  },
  neonButtonText: { fontSize: 18, fontWeight: "800", color: "#000000" },
  checkmarkIcon: { marginBottom: 24 },
  allSetText: { fontSize: 36, fontWeight: "bold", color: "#FFFFFF" },
  dashboardContainer: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 24 },
  financialCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#333",
  },
  financialTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7CFF2D",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 24,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  financialLabel: { fontSize: 16, color: "#A0A0A0", fontWeight: "500" },
  financialValue: { fontSize: 24, color: "#FFFFFF", fontWeight: "700" },
  riskiestHeaderContainer: { marginBottom: 16, paddingHorizontal: 8 },
  riskiestHeaderText: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF" },
  heatmapWrapper: {
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    overflow: "hidden",
    height: 500,
  },
});

export default App;
