import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useDialog } from '@/src/contexts/DialogContext';
import { connectedAccountsAPI } from '@/src/services/api';
import { colors, spacing, fontSize, fontWeight } from '@/src/styles';

interface ConnectedAccount {
  id: string;
  provider: string;
  provider_id: string;
  name: string;
  nickname?: string;
  email?: string;
  avatar?: string;
  created_at: string;
}

export default function ConnectedAccountsScreen() {
  const { showAlert } = useDialog();
  const queryClient = useQueryClient();

  const { data: accountsData, isLoading } = useQuery({
    queryKey: ['connected-accounts'],
    queryFn: connectedAccountsAPI.getConnectedAccounts,
  });

  const removeAccountMutation = useMutation({
    mutationFn: connectedAccountsAPI.removeConnectedAccount,
    onSuccess: () => {
      showAlert('Success', 'Connected account has been removed.');
      queryClient.invalidateQueries({ queryKey: ['connected-accounts'] });
    },
    onError: (error: any) => {
      showAlert('Error', error.response?.data?.message || 'Failed to remove connected account.');
    },
  });

  const handleRemoveAccount = (account: ConnectedAccount) => {
    Alert.alert(
      'Remove Connected Account',
      `Are you sure you want to remove your ${account.provider} account connection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeAccountMutation.mutate(account.id)
        },
      ]
    );
  };

  const handleConnectAccount = (provider: string) => {
    // For now, show instructions for connecting accounts
    showAlert(
      `Connect ${provider} Account`, 
      `To connect your ${provider} account, please use the web version of Postaverse. Mobile OAuth integration is coming in a future update.`
    );
  };

  const getProviderInfo = (provider: string) => {
    const providerMap: Record<string, { name: string; icon: string; color: string }> = {
      'github': { name: 'GitHub', icon: 'logo-github', color: '#333333' },
      'google': { name: 'Google', icon: 'logo-google', color: '#4285F4' },
      'discord': { name: 'Discord', icon: 'logo-discord', color: '#5865F2' },
    };
    
    return providerMap[provider.toLowerCase()] || { name: provider, icon: 'link', color: colors.accent.primary };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const ConnectedAccountItem: React.FC<{ account: ConnectedAccount }> = ({ account }) => {
    const providerInfo = getProviderInfo(account.provider);
    
    return (
      <View style={styles.accountItem}>
        <View style={styles.accountLeft}>
          <View style={[styles.providerIcon, { backgroundColor: `${providerInfo.color}15` }]}>
            <Ionicons name={providerInfo.icon as any} size={24} color={providerInfo.color} />
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountProvider}>{providerInfo.name}</Text>
            {account.email && (
              <Text style={styles.accountEmail}>{account.email}</Text>
            )}
            <Text style={styles.accountDate}>
              Connected on {formatDate(account.created_at)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveAccount(account)}
        >
          <Ionicons name="trash" size={16} color={colors.status.danger} />
        </TouchableOpacity>
      </View>
    );
  };

  const AvailableProviderItem: React.FC<{ provider: string }> = ({ provider }) => {
    const providerInfo = getProviderInfo(provider);
    
    return (
      <TouchableOpacity
        style={styles.availableItem}
        onPress={() => handleConnectAccount(providerInfo.name)}
      >
        <View style={styles.availableLeft}>
          <View style={[styles.providerIcon, { backgroundColor: `${providerInfo.color}15` }]}>
            <Ionicons name={providerInfo.icon as any} size={24} color={providerInfo.color} />
          </View>
          <View style={styles.availableInfo}>
            <Text style={styles.availableName}>{providerInfo.name}</Text>
            <Text style={styles.availableDescription}>
              Connect your {providerInfo.name} account
            </Text>
          </View>
        </View>
        <Ionicons name="add-circle" size={24} color={colors.accent.primary} />
      </TouchableOpacity>
    );
  };

  const connectedAccounts = accountsData?.connected_accounts || [];
  const connectedProviders = connectedAccounts.map((account: ConnectedAccount) => account.provider.toLowerCase());
  const availableProviders = ['github', 'google', 'discord']
    .filter(provider => !connectedProviders.includes(provider));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Connected Accounts</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          <Text style={styles.sectionDescription}>
            Manage your connected social media accounts. You can use these to sign in to your account and share content across platforms.
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading connected accounts...</Text>
            </View>
          ) : connectedAccounts.length > 0 ? (
            <View style={styles.accountsList}>
              {connectedAccounts.map((account: ConnectedAccount) => (
                <ConnectedAccountItem key={account.id} account={account} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="link" size={48} color={colors.text.quaternary} />
              <Text style={styles.emptyStateTitle}>No Connected Accounts</Text>
              <Text style={styles.emptyStateDescription}>
                You haven't connected any social media accounts yet. Connect accounts below to enable easier sign-in and sharing.
              </Text>
            </View>
          )}
        </View>

        {availableProviders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Connections</Text>
            <Text style={styles.sectionDescription}>
              Connect these accounts to enable additional sign-in options and features.
            </Text>

            <View style={styles.availableList}>
              {availableProviders.map((provider) => (
                <AvailableProviderItem key={provider} provider={provider} />
              ))}
            </View>
          </View>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={24} color={colors.accent.primary} />
            <Text style={styles.infoTitle}>About Connected Accounts</Text>
          </View>
          <Text style={styles.infoText}>
            Connected accounts allow you to sign in using your social media credentials and may enable additional features like cross-posting. Your privacy settings on each platform still apply.
          </Text>
          
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Ionicons name="log-in" size={16} color={colors.accent.primary} />
              <Text style={styles.infoItemText}>Sign in with connected accounts</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={16} color={colors.accent.primary} />
              <Text style={styles.infoItemText}>Your data remains secure and private</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="settings" size={16} color={colors.accent.primary} />
              <Text style={styles.infoItemText}>Manage permissions on each platform</Text>
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
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
  accountsList: {
    marginBottom: spacing.lg,
  },
  accountItem: {
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
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  providerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: 2,
  },
  accountProvider: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  accountEmail: {
    fontSize: fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  accountDate: {
    fontSize: fontSize.xs,
    color: colors.text.quaternary,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  availableList: {
    marginBottom: spacing.lg,
  },
  availableItem: {
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
  availableLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  availableInfo: {
    flex: 1,
  },
  availableName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginBottom: 2,
  },
  availableDescription: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background.glass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  emptyStateTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.text.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyStateDescription: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
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
    marginBottom: spacing.md,
  },
  infoList: {
    marginTop: spacing.sm,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoItemText: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
});
