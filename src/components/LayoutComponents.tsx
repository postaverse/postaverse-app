import React from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, shadows } from '../styles';

interface ScreenLayoutProps {
  children: React.ReactNode;
  backgroundColor?: string;
  padding?: number;
  scrollable?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  showScrollIndicator?: boolean;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  backgroundColor = colors.background.primary, // Pure black default
  padding = 0,
  scrollable = false,
  refreshing = false,
  onRefresh,
  showScrollIndicator = false,
}) => {
  const containerStyle = [
    styles.container,
    { backgroundColor, padding },
  ];

  if (scrollable) {
    return (
      <SafeAreaView style={containerStyle}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent.primary} // Sky blue
                colors={[colors.accent.primary]}
              />
            ) : undefined
          }
          showsVerticalScrollIndicator={showScrollIndicator}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      {children}
    </SafeAreaView>
  );
};

interface CardLayoutProps {
  children: React.ReactNode;
  padding?: number;
  margin?: number;
  backgroundColor?: string;
  borderRadius?: number;
}

export const CardLayout: React.FC<CardLayoutProps> = ({
  children,
  padding = 16,
  margin = 0,
  backgroundColor = 'rgba(31, 41, 55, 0.6)', // Glass-morphism background
  borderRadius = 12,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          padding,
          margin,
          backgroundColor,
          borderRadius,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
        },
      ]}
    >
      {children}
    </View>
  );
};

interface ListContainerProps {
  children: React.ReactNode;
  spacing?: number;
}

export const ListContainer: React.FC<ListContainerProps> = ({
  children,
  spacing = 16,
}) => {
  return (
    <View style={[styles.listContainer, { gap: spacing }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    // Use medium shadow from tokens
    ...shadows.medium,
  },
  listContainer: {
    flex: 1,
  },
});
