import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface TwoFactorChallengeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TwoFactorChallengeModal({ visible, onClose }: TwoFactorChallengeModalProps) {
  const [code, setCode] = useState('');
  const [recovery, setRecovery] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { submitTwoFactorChallenge } = useAuth();

  const handleSubmit = async () => {
    if ((!code.trim() && !isRecoveryMode) || (!recovery.trim() && isRecoveryMode)) {
      Alert.alert('Error', 'Please enter the required code');
      return;
    }

    setLoading(true);
    try {
      await submitTwoFactorChallenge({
        code: isRecoveryMode ? undefined : code,
        recovery_code: isRecoveryMode ? recovery : undefined,
      });
      // Reset form
      setCode('');
      setRecovery('');
      setIsRecoveryMode(false);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Invalid authentication code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleRecoveryMode = () => {
    setIsRecoveryMode(!isRecoveryMode);
    setCode('');
    setRecovery('');
  };

  const handleCancel = () => {
    setCode('');
    setRecovery('');
    setIsRecoveryMode(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Two-Factor Authentication</Text>
          
          {!isRecoveryMode ? (
            <>
              <Text style={styles.description}>
                Please enter the 6-digit code from your authenticator app
              </Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="000000"
                keyboardType="numeric"
                maxLength={6}
                autoFocus
                editable={!loading}
              />
            </>
          ) : (
            <>
              <Text style={styles.description}>
                Please enter one of your recovery codes
              </Text>
              <TextInput
                style={styles.input}
                value={recovery}
                onChangeText={setRecovery}
                placeholder="Recovery code"
                autoCapitalize="none"
                autoFocus
                editable={!loading}
              />
            </>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.recoveryToggle}
            onPress={toggleRecoveryMode}
            disabled={loading}
          >
            <Text style={styles.recoveryToggleText}>
              {isRecoveryMode 
                ? 'Use authenticator code instead' 
                : 'Use recovery code instead'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  secondaryButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  recoveryToggle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  recoveryToggleText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
