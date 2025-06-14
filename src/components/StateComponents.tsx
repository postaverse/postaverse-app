import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { blogDetailStyles } from '@/src/styles';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <View style={blogDetailStyles.loadingContainer}>
      <ActivityIndicator size="large" color="#38bdf8" />
      <Text style={blogDetailStyles.loadingText}>{message}</Text>
    </View>
  );
};

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'Something went wrong', 
  onRetry,
  retryText = 'Try Again'
}) => {
  return (
    <View style={blogDetailStyles.errorContainer}>
      <Text style={blogDetailStyles.errorText}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={blogDetailStyles.retryButton} onPress={onRetry}>
          <Text style={blogDetailStyles.retryButtonText}>{retryText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle }) => {
  return (
    <View style={blogDetailStyles.emptyCommentsContainer}>
      <Text style={blogDetailStyles.emptyCommentsText}>{title}</Text>
      {subtitle && (
        <Text style={blogDetailStyles.emptyCommentsSubtext}>{subtitle}</Text>
      )}
    </View>
  );
};
