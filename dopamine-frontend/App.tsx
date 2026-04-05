import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';

import TriggerHeatmap from './TriggerHeatmap';
import FrictionOverlay from './FrictionOverlay';

const App = () => {
  const [showFriction, setShowFriction] = useState<boolean>(false);
  const [triggerReason, setTriggerReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSimulatePurchase = async () => {
    setIsLoading(true);

    try {
      // Note: On Android emulator, 10.0.2.2 usually routes to the host's localhost.
      // On iOS simulator, 127.0.0.1 works directly. 
      // Falling back strictly to the IP you requested for local hackathon dev.
      const url = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api/v1/trigger' : 'http://127.0.0.1:8000/api/v1/trigger';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          time_of_day: 'Late Night',
          day_of_week: 'Friday',
          app_sequence: 'Instagram->Amazon',
          social_screen_time_mins: 65,
          daily_spend_ratio: 2.5,
          erratic_usage_score: 8.2,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.requires_friction) {
        setTriggerReason(data.trigger_reason || 'High impulse risk detected based on your usage parameters.');
        setShowFriction(true);
      } else {
        Alert.alert("Success", "Order placed immediately with 1-Click!");
      }
    } catch (error) {
      console.error('Purchase simulation failed:', error);
      Alert.alert('Connection Error', 'Ensure FastAPI is running and accessible. (Check IP addresses for Android/iOS).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseOverlay = () => {
    setShowFriction(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Heatmap Section */}
        <View style={styles.heatmapSection}>
          <TriggerHeatmap />
        </View>

        {/* E-Commerce Section */}
        <View style={styles.ecommerceSection}>
          <Text style={styles.sectionTitle}>Demo E-Commerce View</Text>

          <View style={styles.productCard}>
            <View style={styles.productImagePlaceholder}>
              <Text style={styles.placeholderText}>🎧</Text>
            </View>
            
            <Text style={styles.productName}>Sony WH-1000XM5 Headphones</Text>
            <Text style={styles.productPrice}>₹29,990</Text>

            <TouchableOpacity
              style={[styles.buyButton, isLoading && styles.buyButtonDisabled]}
              onPress={handleSimulatePurchase}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buyButtonText}>1-Click Buy Now</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Friction Overlay */}
      {showFriction && (
        <FrictionOverlay
          triggerReason={triggerReason}
          cartAmount={29990}
          onSkip={handleCloseOverlay}
          onProceed={handleCloseOverlay}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  heatmapSection: {
  },
  ecommerceSection: {
    backgroundColor: '#f5f5f7',
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 24,
    letterSpacing: -0.4,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  productImagePlaceholder: {
    width: 140,
    height: 140,
    backgroundColor: '#e8eef7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 64,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 8,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 24,
  },
  buyButton: {
    backgroundColor: '#f5a623',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonDisabled: {
    backgroundColor: '#fcd385',
  },
  buyButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default App;
