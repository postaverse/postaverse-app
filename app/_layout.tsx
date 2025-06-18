import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, StatusBar } from 'react-native';
import 'react-native-reanimated';

import { AuthProvider } from '@/src/contexts/AuthContext';
import { DialogProvider } from '@/src/contexts/DialogContext';
import { globalStyles } from '@/src/styles';
import { StarsBackground } from '@/src/components';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DialogProvider>
          <RootLayoutNav />
        </DialogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootLayoutNav() {
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000000', // Pure black
      card: 'rgba(31, 41, 55, 0.6)', // Glass-morphism cards
      border: 'rgba(255, 255, 255, 0.1)', // Subtle borders
      text: '#ffffff', // White text
      primary: '#38bdf8', // Sky blue accent
    },
  };

  return (
    <View style={globalStyles.safeAreaContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <StarsBackground starCount={250} />
        <ThemeProvider value={customDarkTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
            <Stack.Screen 
              name="blog/[id]" 
              options={{ 
                headerShown: true,
                headerStyle: { backgroundColor: '#000000' },
                headerTintColor: '#ffffff',
                headerTitleStyle: { color: '#ffffff' },
              }} 
            />
            <Stack.Screen 
              name="profile/[id]" 
              options={{ 
                headerShown: true,
                headerStyle: { backgroundColor: '#000000' },
                headerTintColor: '#ffffff',
                headerTitleStyle: { color: '#ffffff' },
              }} 
            />
            <Stack.Screen 
              name="blocked-users" 
              options={{ 
                headerShown: true,
                title: 'Blocked Users',
                headerStyle: { backgroundColor: '#000000' },
                headerTintColor: '#ffffff',
                headerTitleStyle: { color: '#ffffff' },
              }} 
            />
            <Stack.Screen 
              name="edit-profile" 
              options={{ 
                headerShown: true,
                title: 'Edit Profile',
                headerStyle: { backgroundColor: '#000000' },
                headerTintColor: '#ffffff',
                headerTitleStyle: { color: '#ffffff' },
              }} 
            />
            <Stack.Screen name="security" options={{ headerShown: false }} />
            <Stack.Screen name="password-settings" options={{ headerShown: false }} />
            <Stack.Screen name="two-factor-settings" options={{ headerShown: false }} />
            <Stack.Screen name="browser-sessions" options={{ headerShown: false }} />
            <Stack.Screen name="delete-account" options={{ headerShown: false }} />
            <Stack.Screen name="connected-accounts" options={{ headerShown: false }} />
          </Stack>
        </ThemeProvider>
      </View>
    </View>
  );
}
