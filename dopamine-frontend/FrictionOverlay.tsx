import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

interface FrictionOverlayProps {
  triggerReason: string;
  cartAmount: number;
  onSkip: () => void;
  onProceed: () => void;
}

const FrictionOverlay: React.FC<FrictionOverlayProps> = ({
  triggerReason,
  cartAmount,
  onSkip,
  onProceed,
}) => {
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(cartAmount);

  return (
    <Modal transparent animationType="fade" visible={true}>
      <SafeAreaView style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Taking a moment.</Text>
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.amountText}>{formattedAmount}</Text>
            <Text style={styles.reasonText}>{triggerReason}</Text>
            
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {timeLeft > 0 ? `00:${timeLeft.toString().padStart(2, '0')}` : '00:00'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={onSkip}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Skip for now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                timeLeft > 0 && styles.disabledButton,
              ]}
              onPress={onProceed}
              disabled={timeLeft > 0}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  timeLeft > 0 && styles.disabledButtonText,
                ]}
              >
                Proceed anyway
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContainer: {
    paddingTop: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
    letterSpacing: -0.4,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  timerContainer: {
    backgroundColor: '#f2f2f7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#3a3a3c',
    fontVariant: ['tabular-nums'],
  },
  buttonContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5ea',
  },
  button: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#007aff',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e5ea',
  },
  disabledButton: {
    backgroundColor: '#f9f9f9',
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#8e8e93',
  },
  disabledButtonText: {
    color: '#c7c7cc',
  },
});

export default FrictionOverlay;
