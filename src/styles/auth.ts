import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from './tokens';

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary, // Pure black
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: '700',
    letterSpacing: -0.025, // Website typography
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
  testCredentials: {
    fontSize: fontSize.xs,
    color: colors.status.success,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  form: {
    gap: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)', // Website input background
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: fontSize.base,
    color: colors.text.secondary,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.3)', // Website input border
  },
  submitButton: {
    backgroundColor: colors.accent.primary, // Sky blue
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
    // Use medium shadow from tokens
    ...shadows.medium,
  },
  submitButtonDisabled: {
    backgroundColor: colors.interactive.disabled,
  },
  submitButtonText: {
    color: colors.text.primary,
    fontSize: fontSize.base,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerText: {
    color: colors.text.tertiary,
    fontSize: fontSize.sm,
  },
  toggleText: {
    color: colors.accent.primary, // Sky blue
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
