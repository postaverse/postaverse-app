import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';

import { useDialog } from '@/src/contexts/DialogContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { securityAPI } from '@/src/services/api';
import { colors, spacing, fontSize, fontWeight } from '@/src/styles';

export default function DeleteAccountScreen() {
  const { showAlert } = useDialog();
  const { logout } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDeletion, setConfirmDeletion] = useState(false);

  const deleteAccountMutation = useMutation({
    mutationFn: securityAPI.deleteAccount,
    onSuccess: async () => {
      showAlert('Account Deleted', 'Your account has been permanently deleted.');
      await logout();
      router.replace('/auth');
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Failed to delete account. Please try again.');
    },
  });

  const handleDeleteAccount = () => {
    if (!password.trim()) {
      showAlert('Error', 'Please enter your password to confirm account deletion.');
      return;
    }

    if (!confirmDeletion) {
      showAlert('Error', 'Please confirm that you understand this action cannot be undone.');
      return;
    }

    Alert.alert(
      'Delete Account',
      'Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Account', 
          style: 'destructive',
          onPress: () => deleteAccountMutation.mutate(password)
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.warningCard}>
            <View style={styles.warningIcon}>
              <Ionicons name="warning" size={32} color={colors.status.warning} />
            </View>
            <Text style={styles.warningTitle}>Permanent Account Deletion</Text>
            <Text style={styles.warningDescription}>
              Once your account is deleted, all of your resources and data will be permanently deleted. 
              Before deleting your account, please download any data or information that you wish to retain.
            </Text>
          </View>

          <View style={styles.consequencesCard}>
            <Text style={styles.consequencesTitle}>What will be deleted:</Text>
            
            <View style={styles.consequenceItem}>
              <Ionicons name="person" size={16} color={colors.status.danger} />
              <Text style={styles.consequenceText}>Your profile and personal information</Text>
            </View>

            <View style={styles.consequenceItem}>
              <Ionicons name="document-text" size={16} color={colors.status.danger} />
              <Text style={styles.consequenceText}>All your posts and blogs</Text>
            </View>

            <View style={styles.consequenceItem}>
              <Ionicons name="chatbubbles" size={16} color={colors.status.danger} />
              <Text style={styles.consequenceText}>All your comments and interactions</Text>
            </View>

            <View style={styles.consequenceItem}>
              <Ionicons name="heart" size={16} color={colors.status.danger} />
              <Text style={styles.consequenceText}>Your likes and follows</Text>
            </View>

            <View style={styles.consequenceItem}>
              <Ionicons name="images" size={16} color={colors.status.danger} />
              <Text style={styles.consequenceText}>All uploaded images and media</Text>
            </View>

            <View style={styles.consequenceItem}>
              <Ionicons name="notifications" size={16} color={colors.status.danger} />
              <Text style={styles.consequenceText}>Your notification history</Text>
            </View>
          </View>

          <View style={styles.alternativesCard}>
            <Text style={styles.alternativesTitle}>Consider these alternatives:</Text>
            
            <View style={styles.alternativeItem}>
              <Ionicons name="pause-circle" size={16} color={colors.accent.primary} />
              <View style={styles.alternativeContent}>
                <Text style={styles.alternativeText}>Temporarily deactivate your account</Text>
                <Text style={styles.alternativeSubtext}>Hide your profile without losing data</Text>
              </View>
            </View>

            <View style={styles.alternativeItem}>
              <Ionicons name="shield-checkmark" size={16} color={colors.accent.primary} />
              <View style={styles.alternativeContent}>
                <Text style={styles.alternativeText}>Update your privacy settings</Text>
                <Text style={styles.alternativeSubtext}>Control who can see your content</Text>
              </View>
            </View>

            <View style={styles.alternativeItem}>
              <Ionicons name="download" size={16} color={colors.accent.primary} />
              <View style={styles.alternativeContent}>
                <Text style={styles.alternativeText}>Download your data</Text>
                <Text style={styles.alternativeSubtext}>Export your posts and information</Text>
              </View>
            </View>
          </View>

          <View style={styles.deleteSection}>
            <Text style={styles.deleteSectionTitle}>Delete Account</Text>
            <Text style={styles.deleteSectionDescription}>
              If you're sure you want to proceed, please enter your password and confirm below.
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

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setConfirmDeletion(!confirmDeletion)}
            >
              <View style={[styles.checkbox, confirmDeletion && styles.checkboxChecked]}>
                {confirmDeletion && (
                  <Ionicons name="checkmark" size={16} color="#ffffff" />
                )}
              </View>
              <Text style={styles.checkboxText}>
                I understand that this action cannot be undone and all my data will be permanently deleted.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                (!password.trim() || !confirmDeletion || deleteAccountMutation.isPending) && styles.deleteButtonDisabled
              ]}
              onPress={handleDeleteAccount}
              disabled={!password.trim() || !confirmDeletion || deleteAccountMutation.isPending}
            >
              <Ionicons name="trash" size={20} color="#ffffff" />
              <Text style={styles.deleteButtonText}>
                {deleteAccountMutation.isPending ? 'Deleting Account...' : 'Delete My Account'}
              </Text>
            </TouchableOpacity>
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
  warningCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  warningIcon: {
    marginBottom: spacing.md,
  },
  warningTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.status.warning,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  warningDescription: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  consequencesCard: {
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: spacing.lg,
  },
  consequencesTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  consequenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  consequenceText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  alternativesCard: {
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: spacing.lg,
  },
  alternativesTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  alternativeContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  alternativeText: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    fontWeight: fontWeight.medium as any,
  },
  alternativeSubtext: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  deleteSection: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  deleteSectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.status.danger,
    marginBottom: spacing.sm,
  },
  deleteSectionDescription: {
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.text.quaternary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.status.danger,
    borderColor: colors.status.danger,
  },
  checkboxText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: colors.status.danger,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  deleteButtonDisabled: {
    opacity: 0.5,
  },
  deleteButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: '#ffffff',
  },
});
