import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useDialog } from '@/src/contexts/DialogContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { securityAPI } from '@/src/services/api';
import { colors, spacing, fontSize, fontWeight } from '@/src/styles';

export default function TwoFactorSettingsScreen() {
  const { user } = useAuth();
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();
  const [confirmationCode, setConfirmationCode] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ qr_code: string; recovery_codes: string[] } | null>(null);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);

  const isTwoFactorEnabled = user?.two_factor_confirmed_at !== null;

  const enableTwoFactorMutation = useMutation({
    mutationFn: securityAPI.enableTwoFactor,
    onSuccess: (data) => {
      setQrCodeData(data);
      setShowQrCode(true);
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Failed to enable two-factor authentication.');
    },
  });

  const confirmTwoFactorMutation = useMutation({
    mutationFn: securityAPI.confirmTwoFactor,
    onSuccess: () => {
      showAlert('Success', 'Two-factor authentication has been enabled successfully.');
      setShowQrCode(false);
      setConfirmationCode('');
      setQrCodeData(null);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Invalid verification code. Please try again.');
    },
  });

  const disableTwoFactorMutation = useMutation({
    mutationFn: securityAPI.disableTwoFactor,
    onSuccess: () => {
      showAlert('Success', 'Two-factor authentication has been disabled.');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Failed to disable two-factor authentication.');
    },
  });

  const regenerateRecoveryCodesMutation = useMutation({
    mutationFn: securityAPI.regenerateRecoveryCodes,
    onSuccess: (data) => {
      setRecoveryCodes(data.recovery_codes);
      setShowRecoveryCodes(true);
      showAlert('Success', 'New recovery codes have been generated.');
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Failed to regenerate recovery codes.');
    },
  });

  const handleEnableTwoFactor = () => {
    enableTwoFactorMutation.mutate();
  };

  const handleConfirmTwoFactor = () => {
    if (!confirmationCode.trim()) {
      showAlert('Error', 'Please enter the verification code from your authenticator app.');
      return;
    }
    confirmTwoFactorMutation.mutate(confirmationCode);
  };

  const handleDisableTwoFactor = () => {
    Alert.alert(
      'Disable Two-Factor Authentication',
      'Are you sure you want to disable two-factor authentication? This will make your account less secure.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Disable', 
          style: 'destructive',
          onPress: () => disableTwoFactorMutation.mutate()
        },
      ]
    );
  };

  const handleShowRecoveryCodes = () => {
    regenerateRecoveryCodesMutation.mutate();
  };

  const openAuthenticatorAppStore = () => {
    const url = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/google-authenticator/id388497605'
      : 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';
    Linking.openURL(url);
  };

  const RecoveryCodesModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Recovery Codes</Text>
          <TouchableOpacity onPress={() => setShowRecoveryCodes(false)}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.modalDescription}>
          Store these recovery codes in a secure location. They can be used to recover access to your account if you lose your two-factor authentication device.
        </Text>
        <View style={styles.recoveryCodesContainer}>
          {recoveryCodes.map((code, index) => (
            <View key={index} style={styles.recoveryCodeItem}>
              <Text style={styles.recoveryCodeText}>{code}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setShowRecoveryCodes(false)}
        >
          <Text style={styles.modalButtonText}>I've Saved These Codes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const QrCodeSetupModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Set Up Two-Factor Authentication</Text>
          <TouchableOpacity onPress={() => setShowQrCode(false)}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.modalDescription}>
            Scan the QR code below with your authenticator app, then enter the verification code to complete setup.
          </Text>

          {qrCodeData?.qr_code && (
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodePlaceholder}>QR Code would be displayed here</Text>
              <Text style={styles.qrCodeNote}>
                Use Google Authenticator, Authy, or any compatible TOTP app
              </Text>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <TextInput
              style={styles.input}
              value={confirmationCode}
              onChangeText={setConfirmationCode}
              placeholder="Enter 6-digit code"
              placeholderTextColor={colors.text.quaternary}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, confirmTwoFactorMutation.isPending && styles.buttonDisabled]}
            onPress={handleConfirmTwoFactor}
            disabled={confirmTwoFactorMutation.isPending}
          >
            <Text style={styles.confirmButtonText}>
              {confirmTwoFactorMutation.isPending ? 'Confirming...' : 'Confirm & Enable'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.appStoreButton}
            onPress={openAuthenticatorAppStore}
          >
            <Ionicons name="download" size={20} color={colors.accent.primary} />
            <Text style={styles.appStoreButtonText}>Download Authenticator App</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Two-Factor Authentication</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.statusCard}>
            <View style={styles.statusLeft}>
              <View style={[styles.statusIcon, isTwoFactorEnabled ? styles.statusIconEnabled : styles.statusIconDisabled]}>
                <Ionicons 
                  name={isTwoFactorEnabled ? "shield-checkmark" : "shield"} 
                  size={24} 
                  color={isTwoFactorEnabled ? colors.status.success : colors.text.tertiary} 
                />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusTitle}>
                  Two-Factor Authentication
                </Text>
                <Text style={styles.statusDescription}>
                  {isTwoFactorEnabled 
                    ? 'Your account is protected with 2FA' 
                    : 'Add an extra layer of security to your account'}
                </Text>
              </View>
            </View>
            <View style={[styles.statusBadge, isTwoFactorEnabled ? styles.statusBadgeEnabled : styles.statusBadgeDisabled]}>
              <Text style={[styles.statusBadgeText, isTwoFactorEnabled ? styles.statusBadgeTextEnabled : styles.statusBadgeTextDisabled]}>
                {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>

          {!isTwoFactorEnabled ? (
            <View style={styles.setupSection}>
              <Text style={styles.sectionTitle}>Enable Two-Factor Authentication</Text>
              <Text style={styles.sectionDescription}>
                Two-factor authentication adds an extra layer of security to your account by requiring a code from your phone in addition to your password.
              </Text>
              
              <TouchableOpacity
                style={[styles.enableButton, enableTwoFactorMutation.isPending && styles.buttonDisabled]}
                onPress={handleEnableTwoFactor}
                disabled={enableTwoFactorMutation.isPending}
              >
                <Ionicons name="shield-checkmark" size={20} color="#ffffff" />
                <Text style={styles.enableButtonText}>
                  {enableTwoFactorMutation.isPending ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.manageSection}>
              <Text style={styles.sectionTitle}>Manage Two-Factor Authentication</Text>
              
              <TouchableOpacity style={styles.actionItem} onPress={handleShowRecoveryCodes}>
                <View style={styles.actionLeft}>
                  <Ionicons name="key" size={20} color={colors.accent.primary} />
                  <Text style={styles.actionText}>Recovery Codes</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.quaternary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={handleDisableTwoFactor}>
                <View style={styles.actionLeft}>
                  <Ionicons name="shield-outline" size={20} color={colors.status.danger} />
                  <Text style={[styles.actionText, styles.actionTextDanger]}>Disable Two-Factor Authentication</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.text.quaternary} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {showQrCode && <QrCodeSetupModal />}
      {showRecoveryCodes && <RecoveryCodesModal />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  statusCard: {
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  statusIconEnabled: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statusIconDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  statusBadgeEnabled: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statusBadgeDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  statusBadgeText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
  },
  statusBadgeTextEnabled: {
    color: colors.status.success,
  },
  statusBadgeTextDisabled: {
    color: colors.text.tertiary,
  },
  setupSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  enableButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  enableButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: '#ffffff',
  },
  manageSection: {
    marginBottom: spacing.xl,
  },
  actionItem: {
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    fontSize: fontSize.base,
    color: colors.text.primary,
    marginLeft: spacing.md,
  },
  actionTextDanger: {
    color: colors.status.danger,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  // Modal styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: spacing.lg,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
  },
  modalDescription: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  qrCodeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrCodePlaceholder: {
    fontSize: fontSize.base,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  qrCodeNote: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    padding: spacing.md,
    fontSize: fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  confirmButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  confirmButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: '#ffffff',
  },
  appStoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  appStoreButtonText: {
    fontSize: fontSize.base,
    color: colors.accent.primary,
  },
  modalButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: '#ffffff',
  },
  recoveryCodesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  recoveryCodeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.xs,
  },
  recoveryCodeText: {
    fontSize: fontSize.sm,
    fontFamily: 'monospace',
    color: colors.text.primary,
    textAlign: 'center',
  },
});
