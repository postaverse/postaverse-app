import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useAuth } from '@/src/contexts/AuthContext';
import { useDialog } from '@/src/contexts/DialogContext';
import { LoginCredentials, RegisterCredentials } from '@/src/types';
import { colors } from '@/src/styles';

import { authStyles as styles } from '@/src/styles/';

export default function AuthScreen() {
  const { login, register, isLoading, isAuthenticated, user } = useAuth();
  const { showAlert } = useDialog();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (isLoginMode) {
        const credentials: LoginCredentials = {
          login: formData.email,
          password: formData.password,
        };
        await login(credentials);
      } else {
        if (formData.password !== formData.password_confirmation) {
          showAlert('Error', 'Passwords do not match');
          return;
        }
        const credentials: RegisterCredentials = {
          name: formData.name,
          handle: formData.handle,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        };
        await register(credentials);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'Authentication failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat();
        errorMessage = errorMessages.join('\n');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showAlert('Error', errorMessage);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    if (!isLoginMode) {
      // Switching to login mode
      setFormData({
        name: '',
        handle: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
    } else {
      // Switching to register mode - clear form
      setFormData({
        name: '',
        handle: '',
        email: '',
        password: '',
        password_confirmation: '',
      });
    }
  };

  const isFormValid = () => {
    if (isLoginMode) {
      return formData.email && formData.password;
    } else {
      return (
        formData.name &&
        formData.handle &&
        formData.email &&
        formData.password &&
        formData.password_confirmation
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Postaverse</Text>
            <Text style={styles.subtitle}>
              {isLoginMode ? 'Welcome back!' : 'Join the community'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {!isLoginMode && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#9ca3af"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#9ca3af"
                  value={formData.handle}
                  onChangeText={(value) => handleInputChange('handle', value)}
                  autoCapitalize="none"
                />
              </>
            )}
            
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9ca3af"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry
              autoComplete="password"
            />
            
            {!isLoginMode && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#9ca3af"
                value={formData.password_confirmation}
                onChangeText={(value) => handleInputChange('password_confirmation', value)}
                secureTextEntry
                autoComplete="password"
              />
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isFormValid() || isLoading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {isLoginMode ? 'Sign In' : 'Sign Up'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Toggle Mode */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLoginMode ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <TouchableOpacity onPress={toggleMode}>
              <Text style={styles.toggleText}>
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
