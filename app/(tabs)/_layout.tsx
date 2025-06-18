import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { useAuth } from '@/src/contexts/AuthContext';
import { colors, spacing, fontSize, fontWeight, shadows } from '@/src/styles';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size?: number;
}) {
  return <Ionicons size={props.size || 20} style={{ marginBottom: -2 }} {...props} />;
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
        style={[
          customTabBarStyles.tabButton,
          isFocused && customTabBarStyles.tabButtonActive
        ]}
      >
        <View style={[
          customTabBarStyles.iconContainer,
          isFocused && customTabBarStyles.iconContainerActive
        ]}>
          <TabBarIcon
            name={getIconName(routeName) as any}
            color={isFocused ? colors.text.primary : colors.text.quaternary}
            size={routeName === 'create' ? 22 : 18}
          />
        </View>
        <Text style={[
          customTabBarStyles.tabLabel,
          { color: isFocused ? colors.accent.primary : colors.text.quaternary },
          isFocused && customTabBarStyles.tabLabelActive
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
    backgroundColor: colors.background.glass,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    borderTopWidth: 1,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.xs,
    ...shadows.large,
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.xs / 2,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs / 2,
    paddingHorizontal: spacing.xs,
    minWidth: 48,
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    marginBottom: 2,
  },
  iconContainerActive: {
    backgroundColor: colors.accent.primary,
    ...shadows.small,
  },
  tabLabel: {
    fontSize: fontSize.xs - 1,
    textAlign: 'center',
    fontWeight: fontWeight.medium as any,
  },
  tabLabelActive: {
    fontWeight: fontWeight.semibold as any,
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
