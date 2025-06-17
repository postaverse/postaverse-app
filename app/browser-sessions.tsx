import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useDialog } from '@/src/contexts/DialogContext';
import { securityAPI } from '@/src/services/api';
import { colors, spacing, fontSize, fontWeight } from '@/src/styles';

interface BrowserSession {
  id: string;
  ip_address: string;
  user_agent: string;
  last_active: string;
  is_current_device: boolean;
}

export default function BrowserSessionsScreen() {
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ['browser-sessions'],
    queryFn: securityAPI.getBrowserSessions,
  });

  const logoutOtherSessionsMutation = useMutation({
    mutationFn: securityAPI.logoutOtherSessions,
    onSuccess: () => {
      showAlert('Success', 'All other browser sessions have been logged out.');
      setShowPasswordModal(false);
      setPassword('');
      queryClient.invalidateQueries({ queryKey: ['browser-sessions'] });
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Failed to logout other sessions. Please try again.');
    },
  });

  const handleLogoutOtherSessions = () => {
    setShowPasswordModal(true);
  };

  const confirmLogoutOtherSessions = () => {
    if (!password.trim()) {
      showAlert('Error', 'Please enter your password to continue.');
      return;
    }
    logoutOtherSessionsMutation.mutate(password);
  };

  const getDeviceInfo = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    
    // Detect device type
    let deviceType = 'Desktop';
    let deviceIcon = 'desktop';
    
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      deviceType = 'Mobile';
      deviceIcon = 'phone-portrait';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      deviceType = 'Tablet';
      deviceIcon = 'tablet-portrait';
    }

    // Detect browser
    let browser = 'Unknown Browser';
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';

    // Detect OS
    let os = 'Unknown OS';
    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('macos') || ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('linux')) os = 'Linux';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    return { deviceType, deviceIcon, browser, os };
  };

  const formatLastActive = (lastActive: string) => {
    const date = new Date(lastActive);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Active now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const SessionItem: React.FC<{ session: BrowserSession }> = ({ session }) => {
    const deviceInfo = getDeviceInfo(session.user_agent);
    
    return (
      <View style={[styles.sessionItem, session.is_current_device && styles.currentSessionItem]}>
        <View style={styles.sessionLeft}>
          <View style={[styles.deviceIcon, session.is_current_device && styles.currentDeviceIcon]}>
            <Ionicons 
              name={deviceInfo.deviceIcon as any} 
              size={20} 
              color={session.is_current_device ? colors.accent.primary : colors.text.tertiary} 
            />
          </View>
          <View style={styles.sessionInfo}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>
                {deviceInfo.browser} on {deviceInfo.os}
              </Text>
              {session.is_current_device && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              )}
            </View>
            <Text style={styles.sessionDevice}>{deviceInfo.deviceType}</Text>
            <Text style={styles.sessionDetails}>
              {session.ip_address} • {formatLastActive(session.last_active)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const PasswordModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Confirm Password</Text>
          <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.modalDescription}>
          Please enter your password to logout all other browser sessions.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.text.quaternary}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={colors.text.tertiary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowPasswordModal(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.confirmButton, logoutOtherSessionsMutation.isPending && styles.buttonDisabled]}
            onPress={confirmLogoutOtherSessions}
            disabled={logoutOtherSessionsMutation.isPending}
          >
            <Text style={styles.confirmButtonText}>
              {logoutOtherSessionsMutation.isPending ? 'Logging out...' : 'Logout Other Sessions'}
            </Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Browser Sessions</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          <Text style={styles.sectionDescription}>
            If necessary, you may logout of all other browser sessions across all of your devices. Some of your recent sessions are listed below; however, this list may not be exhaustive.
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading sessions...</Text>
            </View>
          ) : (
            <View style={styles.sessionsList}>
              {sessionsData?.sessions?.map((session: BrowserSession) => (
                <SessionItem key={session.id} session={session} />
              )) || (
                <View style={styles.emptyState}>
                  <Ionicons name="desktop" size={48} color={colors.text.quaternary} />
                  <Text style={styles.emptyStateText}>No active sessions found</Text>
                </View>
              )}
            </View>
          )}

          {sessionsData?.sessions && sessionsData.sessions.length > 1 && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogoutOtherSessions}
            >
              <Ionicons name="log-out" size={20} color={colors.status.danger} />
              <Text style={styles.logoutButtonText}>Logout Other Browser Sessions</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={colors.accent.primary} />
            <Text style={styles.infoTitle}>About Browser Sessions</Text>
          </View>
          <Text style={styles.infoText}>
            Browser sessions allow you to stay logged in across multiple devices and browsers. 
            For security, you can logout of sessions you don't recognize or no longer use.
          </Text>
        </View>
      </ScrollView>

      {showPasswordModal && <PasswordModal />}
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
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  sessionsList: {
    marginBottom: spacing.lg,
  },
  sessionItem: {
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  currentSessionItem: {
    borderColor: colors.accent.primary,
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
  },
  sessionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  currentDeviceIcon: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sessionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    flex: 1,
  },
  currentBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    color: '#ffffff',
  },
  sessionDevice: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  sessionDetails: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium as any,
    color: colors.status.danger,
  },
  infoSection: {
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyStateText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    marginTop: spacing.md,
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
  inputGroup: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.md,
  },
  passwordInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.text.primary,
    paddingVertical: spacing.md,
  },
  eyeButton: {
    padding: spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium as any,
    color: colors.text.primary,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.status.danger,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: '#ffffff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
