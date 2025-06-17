import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/src/contexts/AuthContext';
import { colors } from '@/src/styles';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={24} style={{ marginBottom: -3 }} {...props} />;
}

// Custom tab bar component for two-row layout
function CustomTabBar({ state, descriptors, navigation }: any) {
  const tabsFirstRow = ['index', 'search', 'blogs', 'create'];
  const tabsSecondRow = ['notifications', 'profile', 'settings'];

  const renderTabButton = (routeName: string, index: number) => {
    const { options } = descriptors[state.routes.find((route: any) => route.name === routeName)?.key];
    const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : routeName;
    const isFocused = state.routeNames[state.index] === routeName;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: state.routes.find((route: any) => route.name === routeName)?.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(routeName);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: state.routes.find((route: any) => route.name === routeName)?.key,
      });
    };

    const getIconName = (name: string) => {
      switch (name) {
        case 'index': return 'home';
        case 'search': return 'search';
        case 'blogs': return 'library';
        case 'create': return 'add-circle';
        case 'notifications': return 'notifications';
        case 'profile': return 'person';
        case 'settings': return 'settings';
        default: return 'ellipse';
      }
    };

    return (
      <TouchableOpacity
        key={routeName}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={customTabBarStyles.tabButton}
      >
        <TabBarIcon
          name={getIconName(routeName) as any}
          color={isFocused ? colors.accent.primary : colors.text.quaternary}
        />
        <Text style={[
          customTabBarStyles.tabLabel,
          { color: isFocused ? colors.accent.primary : colors.text.quaternary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={customTabBarStyles.tabBar}>
      <View style={customTabBarStyles.tabRow}>
        {tabsFirstRow.map((routeName) => renderTabButton(routeName, 0))}
      </View>
      <View style={customTabBarStyles.tabRow}>
        {tabsSecondRow.map((routeName) => renderTabButton(routeName, 1))}
      </View>
    </View>
  );
}

const customTabBarStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.background.primary,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
});

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
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: colors.accent.primary,     // Sky blue like website
        tabBarInactiveTintColor: colors.text.quaternary,  // Muted gray
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
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabBarIcon name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
