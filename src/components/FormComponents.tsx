import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius, fontSize, globalStyles, shadows, fontWeight } from '../styles';

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
    fontWeight: fontWeight.semibold as any,
    marginBottom: spacing.md,
    letterSpacing: -0.025,
  },
  input: {
    backgroundColor: colors.background.glass,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.base,
    color: colors.text.primary,
    minHeight: 56,
    fontWeight: fontWeight.normal as any,
    ...shadows.medium,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  inputError: {
    borderColor: colors.status.danger,
    borderWidth: 2,
  },
  charCount: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
    textAlign: 'right',
    marginTop: spacing.xs,
    fontWeight: fontWeight.medium as any,
  },
  errorText: {
    color: colors.status.danger,
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
    fontWeight: fontWeight.medium as any,
  },
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...shadows.medium,
  },
  buttonSmall: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
    borderRadius: 12,
  },
  buttonMedium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  buttonLarge: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 64,
  },
  buttonPrimary: {
    backgroundColor: colors.accent.primary,
  },
  buttonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonDanger: {
    backgroundColor: colors.status.danger,
  },
  buttonDisabled: {
    backgroundColor: colors.interactive.disabled,
    borderColor: colors.interactive.disabled,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
  },
  buttonTextPrimary: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
  },
  buttonTextSecondary: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.secondary,
  },
  buttonTextDanger: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
  },
  buttonTextDisabled: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.quaternary,
  },
});
