import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { ConfirmationDialog } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { useDialog } from '@/src/contexts/DialogContext';
import { User } from '@/src/types';
import { colors, spacing, fontSize, fontWeight } from '@/src/styles';

export default function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const { showAlert } = useDialog();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await logout();
      router.replace('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      showAlert('Error', 'Failed to logout. Please try again.');
    }
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleEditProfile = () => {
    router.push('/edit-profile');
  };

  const handleBlockedUsers = () => {
    router.push('/blocked-users');
  };

  const handleConnectedAccounts = () => {
    router.push('/connected-accounts');
  };

  const handleDeleteAccount = () => {
    router.push('/delete-account');
  };

  const handleSecurity = () => {
    router.push('/security');
  };

  const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const SettingsItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showArrow?: boolean;
  }> = ({ icon, title, subtitle, onPress, rightElement, showArrow = true }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon as any} size={20} color={colors.accent.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingsItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightElement}
        {showArrow && !rightElement && (
          <Ionicons name="chevron-forward" size={20} color={colors.text.quaternary} />
        )}
      </View>
    </TouchableOpacity>
  );

  const ToggleItem: React.FC<{
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }> = ({ icon, title, subtitle, value, onValueChange }) => (
    <SettingsItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      showArrow={false}
      rightElement={
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: colors.interactive.disabled,
            true: colors.accent.primary,
          }}
          thumbColor={value ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor={colors.interactive.disabled}
        />
      }
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <SettingsSection title="Profile">
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Image
                source={{ uri: user?.profile_photo_url }}
                style={styles.profileAvatar}
                placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                transition={1000}
              />
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileHandle}>@{user?.handle || 'username'}</Text>
                <Text style={styles.profileEmail}>{user?.email}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={16} color={colors.text.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <ToggleItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Get notified about new messages and updates"
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </SettingsSection>

        {/* Privacy & Security Section */}
        <SettingsSection title="Privacy & Security">
          <SettingsItem
            icon="shield"
            title="Security"
            subtitle="Password, 2FA, and account security"
            onPress={handleSecurity}
          />
          <SettingsItem
            icon="shield-checkmark"
            title="Blocked Users"
            subtitle="Manage blocked accounts"
            onPress={handleBlockedUsers}
          />
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsItem
            icon="link"
            title="Connected Accounts"
            subtitle="Manage social media connections"
            onPress={handleConnectedAccounts}
          />
          <SettingsItem
            icon="trash"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={handleDeleteAccount}
          />
        </SettingsSection>

        {/* Support Section */}
        <SettingsSection title="Support">
          <SettingsItem
            icon="mail"
            title="Contact Us"
            subtitle="Send feedback or report issues"
            onPress={() => showAlert('Zander Lewis', 'Zander is the founder/developer of Postaverse. Contact him here: zander@zanderlewis.dev')}
          />
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={colors.status.danger} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </SettingsSection>
      </ScrollView>

      <ConfirmationDialog
        visible={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        confirmStyle="destructive"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.lg,
    textTransform: 'uppercase' as any,
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: colors.background.glass,
    marginHorizontal: spacing.lg,
    borderRadius: 12,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: 2,
  },
  profileHandle: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  editButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: colors.text.primary,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background.glass,
    marginHorizontal: spacing.lg,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium as any,
    color: colors.text.primary,
  },
  settingsItemSubtitle: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginHorizontal: spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  logoutText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium as any,
    color: colors.status.danger,
    marginLeft: spacing.sm,
  },
});
