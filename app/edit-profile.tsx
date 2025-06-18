import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useDialog } from '@/src/contexts/DialogContext';
import { useAuth } from '@/src/contexts/AuthContext';
import { authAPI } from '@/src/services/api';
import { UpdateProfileData } from '@/src/types';
import { colors, spacing, fontSize, fontWeight } from '@/src/styles';

export default function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();

  const [name, setName] = useState(user?.name || '');
  const [handle, setHandle] = useState(user?.handle || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes whenever form values change
  useEffect(() => {
    const changed = 
      name?.trim() !== user?.name ||
      handle?.trim() !== user?.handle ||
      bio?.trim() !== user?.bio
    setHasChanges(changed);
  }, [name, handle, bio, user]);

  // Handle hardware back button
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (hasChanges) {
          showAlert(
            'Discard Changes?',
            'You have unsaved changes. Are you sure you want to go back?',
            () => router.back()
          );
          return true; // Prevent default behavior
        }
        return false; // Allow default behavior
      };

      return () => {};
    }, [hasChanges, showAlert])
  );

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => authAPI.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the query cache
      queryClient.setQueryData(['user', 'me'], updatedUser);
      
      // Update the auth context
      updateUser(updatedUser);
      
      showAlert('Success', 'Profile updated successfully!');
      router.back();
    },
    onError: (error: any) => {
      console.error('Profile update error:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showAlert('Error', error.response?.data?.message || 'Failed to update profile. Please try again.');
      }
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (handle?.trim()) {
      // Basic handle validation
      const handleRegex = /^[a-zA-Z0-9_]+$/;
      if (!handleRegex.test(handle)) {
        newErrors.handle = 'Handle can only contain letters, numbers, and underscores';
      }
      if (handle.length < 3) {
        newErrors.handle = 'Handle must be at least 3 characters long';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Filter out empty strings and only send changed fields
    const dataToUpdate: UpdateProfileData = {};
    
    if (name?.trim() !== user?.name) {
      dataToUpdate.name = name?.trim();
    }
    
    if (handle?.trim() !== user?.handle) {
      dataToUpdate.handle = handle?.trim();
    }
    
    if (bio?.trim() !== user?.bio) {
      dataToUpdate.bio = bio?.trim();
    }

    // Only make the API call if there are changes
    if (Object.keys(dataToUpdate).length === 0) {
      showAlert('Info', 'No changes to save.');
      return;
    }

    updateProfileMutation.mutate(dataToUpdate);
  };

  const renderFormField = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    placeholder: string,
    error?: string,
    multiline?: boolean,
    maxLength?: number
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.textInputMultiline,
          error && styles.textInputError
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.tertiary}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize={label === 'Handle' ? 'none' : 'sentences'}
        autoCorrect={label !== 'Handle' && label !== 'Website'}
      />
      {maxLength && (
        <Text style={styles.characterCount}>
          {value.length}/{maxLength}
        </Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!hasChanges || updateProfileMutation.isPending}
          >
            <Text style={[styles.saveButtonText, !hasChanges && styles.saveButtonTextDisabled]}>
              {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          {renderFormField(
            'Name',
            name,
            setName,
            'Enter your display name',
            errors.name,
            false,
            50
          )}

          {renderFormField(
            'Handle',
            handle,
            setHandle,
            'Choose a unique handle',
            errors.handle,
            false,
            30
          )}

          {renderFormField(
            'Bio',
            bio,
            setBio,
            'Tell people about yourself...',
            errors.bio,
            true,
            160
          )}

          <View style={styles.helperTextContainer}>
            <Text style={styles.helperText}>
              Your handle is how others can find and mention you. It must be unique and can only contain letters, numbers, and underscores.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  } as ViewStyle,
  saveButton: {
    backgroundColor: colors.accent.primary,
    borderRadius: 8,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  } as ViewStyle,
  saveButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
  } as ViewStyle,
  saveButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  } as TextStyle,
  saveButtonTextDisabled: {
    color: colors.text.tertiary,
  } as TextStyle,
  keyboardAvoidingView: {
    flex: 1,
  } as ViewStyle,
  scrollView: {
    flex: 1,
  } as ViewStyle,
  scrollViewContent: {
    padding: spacing.md,
  } as ViewStyle,
  fieldContainer: {
    marginBottom: spacing.lg,
  } as ViewStyle,
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  } as TextStyle,
  textInput: {
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.base,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: 'transparent',
  } as TextStyle,
  textInputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top',
  } as TextStyle,
  textInputError: {
    borderColor: colors.status.danger,
  } as TextStyle,
  characterCount: {
    fontSize: fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  } as TextStyle,
  errorText: {
    fontSize: fontSize.xs,
    color: colors.status.danger,
    marginTop: spacing.xs,
  } as TextStyle,
  helperTextContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
  } as ViewStyle,
  helperText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  } as TextStyle,
});
