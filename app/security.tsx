import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useAuth } from '@/src/contexts/AuthContext';
import { colors, spacing, fontSize, fontWeight } from '@/src/styles';

export default function SecurityScreen() {
  const { user } = useAuth();

  const handlePasswordSettings = () => {
    router.push('/password-settings');
  };

  const handleTwoFactorSettings = () => {
    router.push('/two-factor-settings');
  };

  const handleBrowserSessions = () => {
    router.push('/browser-sessions');
  };

  const handleDeleteAccount = () => {
    router.push('/delete-account');
  };

  const SecurityItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    status?: 'enabled' | 'disabled';
  }> = ({ icon, title, subtitle, onPress, rightElement, status }) => (
    <TouchableOpacity style={styles.securityItem} onPress={onPress}>
      <View style={styles.securityItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={20} color={colors.accent.primary} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.securityItemTitle}>{title}</Text>
            {status && (
              <View style={[styles.statusBadge, status === 'enabled' ? styles.statusEnabled : styles.statusDisabled]}>
                <Text style={[styles.statusText, status === 'enabled' ? styles.statusTextEnabled : styles.statusTextDisabled]}>
                  {status === 'enabled' ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            )}
          </View>
          {subtitle && <Text style={styles.securityItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.securityItemRight}>
        {rightElement}
        {!rightElement && (
          <Ionicons name="chevron-forward" size={20} color={colors.text.quaternary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const isTwoFactorEnabled = user?.two_factor_confirmed_at !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Security Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Security</Text>
          <Text style={styles.sectionDescription}>
            Manage your account security settings to keep your account safe and secure.
          </Text>

          <SecurityItem
            icon="key"
            title="Password"
            subtitle="Update your account password"
            onPress={handlePasswordSettings}
          />

          <SecurityItem
            icon="shield"
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            status={isTwoFactorEnabled ? 'enabled' : 'disabled'}
            onPress={handleTwoFactorSettings}
          />

          <SecurityItem
            icon="desktop"
            title="Browser Sessions"
            subtitle="Manage your active sessions"
            onPress={handleBrowserSessions}
          />
        </View>

        {/* Account Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Management</Text>
          
          <SecurityItem
            icon="trash"
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
          />
        </View>

        {/* Security Tips */}
        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark" size={24} color={colors.accent.primary} />
            <Text style={styles.infoTitle}>Security Tips</Text>
          </View>
          
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
              <Text style={styles.tipText}>Use a strong, unique password</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
              <Text style={styles.tipText}>Enable two-factor authentication</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
              <Text style={styles.tipText}>Regularly review active sessions</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={16} color={colors.status.success} />
              <Text style={styles.tipText}>Log out of unused devices</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: spacing.lg,
  },
  securityItem: {
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  securityItemTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    flex: 1,
  },
  securityItemSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  securityItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: spacing.sm,
  },
  statusEnabled: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  statusDisabled: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
  },
  statusTextEnabled: {
    color: colors.status.success,
  },
  statusTextDisabled: {
    color: colors.text.tertiary,
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
    marginBottom: spacing.md,
  },
  infoTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginLeft: spacing.sm,
  },
  tipsList: {
    gap: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
});
