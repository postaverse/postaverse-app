import { StyleSheet } from 'react-native';

export const notFoundStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 32,
  },
  option: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  externalLink: {
    marginBottom: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
    textDecorationLine: 'underline',
  },
  homeLink: {
    backgroundColor: '#2e78b7',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  homeLinkText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});
