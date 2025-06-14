import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, fontSize, globalStyles, shadows } from '../styles';

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  showCharCount?: boolean;
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  numberOfLines = 1,
  maxLength,
  showCharCount = false,
  error,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.quaternary} // Better placeholder color
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
      {showCharCount && maxLength && (
        <Text style={styles.charCount}>
          {value.length}/{maxLength}
        </Text>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
}) => {
  const getButtonStyle = () => {
    const sizeKey = `button${size.charAt(0).toUpperCase() + size.slice(1)}` as 'buttonSmall' | 'buttonMedium' | 'buttonLarge';
    const baseStyle: any[] = [styles.button, styles[sizeKey]];
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    } else {
      switch (variant) {
        case 'primary':
          baseStyle.push(styles.buttonPrimary);
          break;
        case 'secondary':
          baseStyle.push(styles.buttonSecondary);
          break;
        case 'danger':
          baseStyle.push(styles.buttonDanger);
          break;
      }
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonTextDisabled);
    } else {
      switch (variant) {
        case 'primary':
          baseStyle.push(styles.buttonTextPrimary);
          break;
        case 'secondary':
          baseStyle.push(styles.buttonTextSecondary);
          break;
        case 'danger':
          baseStyle.push(styles.buttonTextDanger);
          break;
      }
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    color: colors.text.secondary,
    fontSize: fontSize.base,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // Matching website input background
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)', // Matching website border
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.text.secondary, // Slate 200 like website
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.status.danger,
  },
  charCount: {
    color: colors.text.quaternary,
    fontSize: fontSize.xs,
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    color: colors.status.danger,
    fontSize: fontSize.xs,
    marginTop: 4,
  },
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    // Add shadow like website buttons
    ...shadows.medium,
  },
  buttonSmall: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 36,
  },
  buttonMedium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 48,
  },
  buttonLarge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 56,
  },
  buttonPrimary: {
    backgroundColor: colors.accent.primary, // Sky blue like website
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonDanger: {
    backgroundColor: colors.status.danger,
  },
  buttonDisabled: {
    backgroundColor: colors.interactive.disabled,
    borderColor: colors.interactive.disabled,
    boxShadow: 'none', // Remove shadow when disabled
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
  },
  buttonTextSecondary: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  buttonTextDanger: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.primary,
  },
  buttonTextDisabled: {
    fontSize: fontSize.base,
    fontWeight: '600',
    color: colors.text.quaternary,
  },
});
