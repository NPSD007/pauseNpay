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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from 'expo-font';
import TriggerHeatmap from "./TriggerHeatmap";
import FrictionOverlay from "./FrictionOverlay";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["expo-notifications: Android Push notifications"]);

const App = () => {
  const [fontsLoaded] = useFonts({
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
  });

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentBalance, setCurrentBalance] = useState<string>("");
  const [savingsGoal, setSavingsGoal] = useState<string>("");
  const [isBombArmed, setIsBombArmed] = useState<boolean>(false);
  const [showFriction, setShowFriction] = useState<boolean>(false);
  const [triggerReason, setTriggerReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [modalReason, setModalReason] = useState("");
  const [showFakeCart, setShowFakeCart] = useState(false);
  const [preFetchedReason, setPreFetchedReason] = useState(
    "Your impulse risk is high based on recent digital footprint and time of day.",
  );

  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const isDesktop = width > 768;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isModalVisible && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isModalVisible, countdown]);

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

  useEffect(() => {
    const fetchRiskData = async () => {
      const hour = new Date().getHours();
      let timeWindow = "Morning";
      if (hour >= 12 && hour < 17) timeWindow = "Afternoon";
      else if (hour >= 17 && hour < 22) timeWindow = "Evening";
      else if (hour >= 22 || hour < 6) timeWindow = "Late Night";

      const payload = {
        current_balance: parseFloat(currentBalance) || 10000,
        savings_goal: parseFloat(savingsGoal) || 5000,
        transaction_amount: 650, // Hardcoded for our Fake Zomato Cart
        time_window: timeWindow,
        category: "Food Delivery"
      };

      try {
        const url = "https://pnp-backend.onrender.com/api/v1/trigger";
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (data.trigger_reason) setPreFetchedReason(data.trigger_reason);
      } catch (e) {
        console.log("Silent pre-fetch failed, using default.");
      }
    };
    if (currentStep === 5) fetchRiskData();
  }, [currentStep, currentBalance, savingsGoal]);

  const plantTimeBomb = () => {
    setModalReason(preFetchedReason);
    setCountdown(10);
    setIsModalVisible(true);
  };

  const handleCloseOverlay = () => setShowFriction(false);

  if (!fontsLoaded) {
    return null; // Wait for the font to load
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.splashContainer}>
            <Text style={[styles.splashText, { color: '#FFFFFF' }]}>
              PnP <Text style={{ color: '#7CFF2D' }}>pauseNpay</Text>
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
                onSubmitEditing={() => setCurrentStep(3)}
                returnKeyType="next"
                blurOnSubmit={false}
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
                onSubmitEditing={() => setCurrentStep(4)}
                returnKeyType="done"
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
              <Ionicons name="checkmark-circle" size={80} color="#7CFF2D" style={{ marginBottom: 20 }} />
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
              {!showFakeCart ? (
                <View
                  style={{
                    width: "100%",
                    maxWidth: 1200,
                    alignSelf: "center",
                    flexDirection: isDesktop ? "row" : "column",
                    gap: 30,
                  }}
                >
                  <View style={{ flex: isDesktop ? 1 : undefined }}>
                    <View
                      style={[
                        styles.financialCard,
                        {
                          marginBottom: isDesktop ? 0 : 20,
                        },
                      ]}
                    >
                      <Text style={styles.financialTitle}>
                        Financial Profile
                      </Text>
                      <View style={styles.financialRow}>
                        <Text style={styles.financialLabel}>
                          Current Balance:
                        </Text>
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

                    <TouchableOpacity
                      onPress={() => setShowFakeCart(true)}
                      style={{
                        backgroundColor: "#57FF22",
                        paddingVertical: 16,
                        paddingHorizontal: 32,
                        borderRadius: 100,
                        alignItems: "center",
                        marginTop: 30,
                        width: "100%",
                        alignSelf: "center",
                        shadowColor: "#57FF22",
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.4,
                        shadowRadius: 24,
                        elevation: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: "#000000",
                          fontSize: 16,
                          fontWeight: "900",
                          textTransform: "uppercase",
                          letterSpacing: 1.5,
                        }}
                      >
                        Simulate Zomato Checkout
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{ flex: isDesktop ? 2 : undefined }}>
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
                    <View style={[styles.heatmapWrapper, { marginTop: 10 }]}>
                      <TriggerHeatmap />
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "rgba(255,255,255,0.9)",
                    padding: 30,
                    borderRadius: 24,
                    shadowColor: "#000",
                    shadowOpacity: 0.15,
                    shadowRadius: 30,
                    elevation: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: "#1d1d1f",
                      marginBottom: 20,
                    }}
                  >
                    Checkout
                  </Text>
                  <Text
                    style={{ fontSize: 18, fontWeight: "600", color: "#333" }}
                  >
                    Burger Palace 🍔
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 15,
                    }}
                  >
                    <Text style={{ color: "#555" }}>
                      1x Truffle Burger, 1x Large Fries
                    </Text>
                    <Text style={{ fontWeight: "bold", color: "#000" }}>
                      ₹650
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 1,
                      backgroundColor: "#EEE",
                      marginVertical: 20,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 40,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      To Pay
                    </Text>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      ₹650
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={plantTimeBomb}
                    style={{
                      backgroundColor: "#FF3B30",
                      paddingVertical: 18,
                      borderRadius: 14,
                      alignItems: "center",
                      shadowColor: "#FF3B30",
                      shadowOpacity: 0.3,
                      shadowRadius: 10,
                      shadowOffset: { width: 0, height: 6 },
                      elevation: 5,
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Place Order via UPI
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowFakeCart(false)}
                    style={{ marginTop: 15, alignItems: "center" }}
                  >
                    <Text style={{ color: "#888", fontSize: 14 }}>Go Back</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            {showFriction && (
              <FrictionOverlay
                triggerReason={triggerReason}
                cartAmount={29990}
                onSkip={handleCloseOverlay}
                onProceed={handleCloseOverlay}
              />
            )}

            <Modal
              visible={isModalVisible}
              animationType="fade"
              transparent={false}
            >
              <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                <Text style={{ fontSize: 72, color: '#7CFF2D', marginBottom: 20 }}>⏸</Text>
                <Text style={{ fontSize: 28, color: '#FFFFFF', fontWeight: '900', letterSpacing: 2, marginBottom: 20, textAlign: 'center' }}>TRANSACTION PAUSED</Text>
                <Text style={{ color: '#A0A0A0', fontSize: 18, textAlign: 'center', lineHeight: 28, paddingHorizontal: 20 }}>{modalReason}</Text>
                {countdown > 0 ? (
                  <Text style={{ fontSize: 64, color: '#7CFF2D', marginTop: 50, fontWeight: 'bold' }}>{countdown}s</Text>
                ) : (
                  <TouchableOpacity onPress={() => { setIsModalVisible(false); setShowFakeCart(false); }} style={{ marginTop: 50, borderWidth: 2, borderColor: '#FFFFFF', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 30 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' }}>Skip & Pay</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  onPress={() => { 
                    setIsModalVisible(false); 
                    setShowFakeCart(false); 
                  }} 
                  style={{ 
                    marginTop: 30, 
                    backgroundColor: 'rgba(255, 59, 48, 0.15)', // Apple System Red with low opacity
                    borderWidth: 1,
                    borderColor: 'rgba(255, 59, 48, 0.4)',
                    paddingVertical: 14, 
                    paddingHorizontal: 40, 
                    borderRadius: 30 
                  }}
                >
                  <Text style={{ color: '#FF3B30', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                    Cancel & Save Money
                  </Text>
                </TouchableOpacity>
              </View>
            </Modal>
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
  neonText: { color: "#34C759" },
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
  neonButtonText: { fontSize: 18, fontWeight: "bold", color: "#000000" },
  checkmarkIcon: { marginBottom: 24 },
  allSetText: { fontSize: 36, fontWeight: "bold", color: "#FFFFFF" },
  dashboardContainer: { flex: 1, backgroundColor: "#121212" },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 24 },
  financialCard: {
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  financialTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34C759",
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
  financialLabel: { fontSize: 12, color: "#8E8E93", fontWeight: "600", textTransform: "uppercase", letterSpacing: 1 },
  financialValue: { fontSize: 32, color: "#FFFFFF", fontWeight: "800", letterSpacing: -0.5 },
  riskiestHeaderContainer: { marginBottom: 16, paddingHorizontal: 8 },
  riskiestHeaderText: { fontSize: 22, fontWeight: "bold", color: "#FFFFFF" },
  heatmapWrapper: {
    backgroundColor: "rgba(30, 30, 30, 0.6)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
    height: 500,
  },
});

export default App;
