import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/src/contexts/AuthContext';
import { colors } from '@/src/styles';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const headerShown = useClientOnlyValue(false, true);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading]);

  // Show loading or nothing while checking auth
  if (isLoading || !isAuthenticated) {
    return null;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent.primary,     // Sky blue like website
        tabBarInactiveTintColor: colors.text.quaternary,  // Muted gray
        tabBarStyle: {
          backgroundColor: colors.background.primary,     // Pure black background
          borderTopColor: 'rgba(255, 255, 255, 0.1)',   // Subtle border
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 20,
        },
        headerShown: headerShown,
        headerStyle: {
          backgroundColor: 'rgba(31, 41, 55, 0.6)',      // Glass-morphism header
          borderBottomColor: 'rgba(255, 255, 255, 0.1)',
          borderBottomWidth: 1,
        },
        headerTintColor: colors.text.primary,             // White text
        headerTitleStyle: {
          fontWeight: '700',
          letterSpacing: -0.025,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <Tabs.Screen
        name="blogs"
        options={{
          title: 'Blogs',
          tabBarIcon: ({ color }) => <TabBarIcon name="library" color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <TabBarIcon name="add-circle" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <TabBarIcon name="notifications" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </Tabs>
  );
}
